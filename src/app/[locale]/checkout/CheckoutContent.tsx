'use client';

import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { CheckCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface CheckoutContentProps {
  orderId: string;
  orderName: string;
  orderTotal: number;
  initialPaymentStatus: string;
}

export default function CheckoutContent({ orderId, orderName, orderTotal }: CheckoutContentProps) {
  const t = useTranslations('checkout');
  const { status, isPolling } = usePaymentStatus(orderId);

  const isPaid = status === 'Paid';

  const bankInfo = {
    bank: 'Vietinbank',
    accountNumber: '105870309078',
    accountName: 'TRAN PHUC THANH',
    bankCode: 'VIETINBANK'
  };

  const transferContent = orderId;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        {isPaid && (
          <div className="text-center p-8 border-2 border-green-500 rounded-lg mb-6 animate-in fade-in slide-in-from-top">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">✅ {t('paymentSuccess')}</h2>
            <p className="text-gray-600">{t('paymentSuccessMessage')}</p>
          </div>
        )}

        {!isPaid && (
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h1 className="text-2xl font-bold">{t('orderSuccess')}</h1>
              </div>
              <p className="text-gray-500">
                {t('orderId')} #{orderId}
              </p>
            </div>

            <div className="border rounded-lg p-6 mb-6">
              <h3 className="font-bold text-center mb-6 text-lg">{t('paymentInstructions')}</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center border rounded-lg p-6">
                  <p className="font-bold mb-4">{t('method1')}</p>
                  <div className="relative inline-block">
                    <Image
                      src={`https://qr.sepay.vn/img?bank=${bankInfo.bankCode}&acc=${bankInfo.accountNumber}&template=compact&amount=${orderTotal}&des=${transferContent}`}
                      alt="QR Code"
                      width={300}
                      height={300}
                      className="mx-auto border rounded"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="text-sm text-gray-600">{t('waitingPayment')}</span>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <p className="font-bold mb-4 text-center">{t('method2')}</p>

                  <div className="text-center mb-4">
                    <Image
                      src={`https://qr.sepay.vn/assets/img/banklogo/${bankInfo.bankCode}.png`}
                      alt={bankInfo.bank}
                      width={60}
                      height={60}
                      className="mx-auto"
                    />
                    <p className="font-bold mt-2">{bankInfo.bank}</p>
                  </div>

                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 text-gray-600">{t('accountHolder')}:</td>
                        <td className="font-bold text-right">{bankInfo.accountName}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-600">{t('accountNumber')}:</td>
                        <td className="font-bold text-right font-mono">{bankInfo.accountNumber}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 text-gray-600">{t('amount')}:</td>
                        <td className="font-bold text-right text-red-600">{orderTotal.toLocaleString('vi-VN')}đ</td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-600">{t('transferContent')}:</td>
                        <td className="font-bold text-right text-blue-600 font-mono">{transferContent}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs mt-4">
                    <p className="font-semibold text-yellow-800 mb-1">⚠️ {t('importantNote')}:</p>
                    <p className="text-yellow-700">{t('keepContentNote', { content: transferContent })}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <p className="font-bold mb-4 text-lg">{t('orderInfo')}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('product')}:</span>
                  <span className="font-semibold">{orderName}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-bold">{t('total')}:</span>
                  <span className="font-bold text-red-600">{orderTotal.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isPolling && !isPaid && (
          <p className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t('autoChecking')}
          </p>
        )}
      </div>
    </div>
  );
}
