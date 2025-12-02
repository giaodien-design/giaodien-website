import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { paymentStatus: true }
    });

    if (!order) {
      return NextResponse.json({ paymentStatus: 'order_not_found' }, { status: 404 });
    }

    return NextResponse.json({
      paymentStatus: order.paymentStatus
    });
  } catch (error) {
    console.error('Check payment status error:', error);
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
  }
}
