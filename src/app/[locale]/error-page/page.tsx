'use client';

import { GalleryVerticalEnd } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const errorMessages: Record<string, string> = {
  Configuration: 'Có lỗi cấu hình máy chủ. Vui lòng thử lại sau.',
  AccessDenied: 'Bạn không có quyền truy cập.',
  Verification: 'Token xác thực đã hết hạn hoặc đã được sử dụng.',
  OAuthSignin: 'Lỗi khi bắt đầu đăng nhập OAuth.',
  OAuthCallback: 'Lỗi khi xử lý phản hồi OAuth.',
  OAuthCreateAccount: 'Không thể tạo tài khoản OAuth.',
  EmailCreateAccount: 'Không thể tạo tài khoản email.',
  Callback: 'Lỗi trong quá trình callback.',
  OAuthAccountNotLinked: 'Email này đã được sử dụng với phương thức đăng nhập khác.',
  EmailSignin: 'Không thể gửi email. Vui lòng kiểm tra địa chỉ email.',
  CredentialsSignin: 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.',
  SessionRequired: 'Vui lòng đăng nhập để truy cập trang này.',
  Default: 'Đã xảy ra lỗi. Vui lòng thử lại.'
};

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';

  return (
    <div className="bg-primary-bg flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-md bg-red-100">
              <GalleryVerticalEnd className="size-6 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold">Có lỗi xảy ra</h1>
          </div>

          <div className="space-y-4">
            <p className="text-secondary-fg">{errorMessages[error] || errorMessages.Default}</p>

            {error === 'OAuthAccountNotLinked' && (
              <p className="text-sm text-secondary-fg">
                Nếu bạn đã đăng ký bằng email, vui lòng sử dụng phương thức đăng nhập email. Nếu bạn đã đăng ký bằng
                Google, vui lòng sử dụng&nbsp;
                <span className="font-semibold">&quot;Đăng nhập với Google&quot;</span>.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button variant="outline" asChild>
              <Link href="/">Về trang chủ</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
