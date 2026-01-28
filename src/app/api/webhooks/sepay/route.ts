import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Validate API Key from SePay webhook header
    const providedKey = req.headers.get('x-api-key')?.trim();
    const expectedApiKey = process.env.SEPAY_API_KEY?.trim();

    // Debug: Check if SEPAY_API_KEY is configured
    if (!expectedApiKey) {
      console.error('[SePay Webhook] SEPAY_API_KEY environment variable is not configured');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Debug: Log both keys for troubleshooting (remove in production)
    if (!providedKey || providedKey !== expectedApiKey) {
      console.error('[SePay Webhook] API Key mismatch:');
      console.error(`  - Provided key: "${providedKey || '(empty)'}"`);
      console.error(`  - Expected key: "${expectedApiKey.substring(0, 10)}...${expectedApiKey.substring(expectedApiKey.length - 4)}"`);
      console.error(`  - Headers received:`, Object.fromEntries(req.headers.entries()));
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[SePay Webhook] API Key validated successfully');

    const data = await req.json();

    const {
      gateway,
      transactionDate,
      accountNumber,
      subAccount,
      transferType,
      transferAmount,
      accumulated,
      code,
      content: transactionContent,
      referenceCode,
      description: body
    } = data;

    const amountIn = transferType === 'in' ? transferAmount : 0;
    const amountOut = transferType === 'out' ? transferAmount : 0;

    const regex = /DH(\d+)|([a-zA-Z0-9]+)/;
    const matches = transactionContent.match(regex);
    const orderCode = matches?.[1] || matches?.[2];

    if (!orderCode) {
      return NextResponse.json({
        success: false,
        message: 'Order code not found in transaction content'
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderCode,
        total: amountIn,
        paymentStatus: 'Unpaid'
      }
    });

    if (!order) {
      await prisma.transaction.create({
        data: {
          userId: 'system',
          gateway,
          transactionDate: new Date(transactionDate),
          accountNumber,
          subAccount,
          amountIn,
          amountOut,
          accumulated,
          code,
          transactionContent,
          referenceNumber: referenceCode,
          body
        }
      });

      return NextResponse.json({
        success: false,
        message: `Order not found or already paid. Order code: ${orderCode}`
      });
    }

    await prisma.transaction.create({
      data: {
        userId: order.userId,
        gateway,
        transactionDate: new Date(transactionDate),
        accountNumber,
        subAccount,
        amountIn,
        amountOut,
        accumulated,
        code,
        transactionContent,
        referenceNumber: referenceCode,
        body
      }
    });

    // Step 1: Update order status to Paid
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'Paid' }
    });
    console.log('[SePay Webhook] Order updated to PAID for User:', order.userId);

    // Step 2: Update user subscription status to PREMIUM
    try {
      // Calculate subscription end date (30 days from now)
      const subscriptionEndDate = new Date();
      subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

      await prisma.user.update({
        where: { id: order.userId },
        data: {
          subscriptionStatus: 'PREMIUM',
          subscriptionEndDate: subscriptionEndDate
        }
      });
      console.log('[SePay Webhook] User status updated to PREMIUM:', order.userId);
      console.log('[SePay Webhook] Subscription ends on:', subscriptionEndDate.toISOString());
    } catch (userUpdateError) {
      console.error('[SePay Webhook] Failed to update user subscription:', userUpdateError);
      // Order is already paid, so we still return success
      // but log the error for manual intervention
      return NextResponse.json({ 
        success: true, 
        warning: 'Order paid but failed to update user subscription' 
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
