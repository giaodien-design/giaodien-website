import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CheckoutContent from './CheckoutContent';

export default async function CheckoutPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { locale } = await params;
  const { orderId } = await searchParams;
  const session = await auth();

  if (!session) {
    redirect(`/${locale}/login`);
  }

  if (!orderId) {
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: 3000,
        name: 'Test Product',
        paymentStatus: 'Unpaid'
      }
    });

    redirect(`/${locale}/checkout?orderId=${order.id}`);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId }
  });

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  return (
    <CheckoutContent
      orderId={order.id}
      orderName={order.name}
      orderTotal={Number(order.total)}
      initialPaymentStatus={order.paymentStatus}
    />
  );
}
