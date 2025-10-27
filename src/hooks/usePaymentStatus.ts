'use client';

import { useEffect, useState } from 'react';

type PaymentStatus = 'Unpaid' | 'Paid' | 'order_not_found';

export function usePaymentStatus(orderId: string) {
  const [status, setStatus] = useState<PaymentStatus>('Unpaid');
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    if (!orderId || !isPolling) return;

    const checkPaymentStatus = async () => {
      if (status === 'Unpaid') {
        try {
          const response = await fetch(`/api/orders/${orderId}/status`);
          const data = await response.json();

          if (data.paymentStatus === 'Paid') {
            setStatus('Paid');
            setIsPolling(false);
          }
        } catch (error) {
          console.error('Payment status check error:', error);
        }
      }
    };

    const interval = setInterval(checkPaymentStatus, 5000);

    return () => clearInterval(interval);
  }, [orderId, status, isPolling]);

  return { status, isPolling };
}
