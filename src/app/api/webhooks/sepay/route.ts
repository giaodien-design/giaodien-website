import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
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

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: 'Paid' }
    });

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
