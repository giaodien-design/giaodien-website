import { GalleryVerticalEnd } from "lucide-react";

export default function VerifyRequestPage() {
  return (
    <div className="bg-primary-bg flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-md bg-primary-fg/10">
              <GalleryVerticalEnd className="size-6 text-primary-fg" />
            </div>
            <h1 className="text-2xl font-bold">Kiểm tra email của bạn</h1>
          </div>

          <div className="space-y-4 text-secondary-fg">
            <p>Một link đăng nhập đã được gửi đến địa chỉ email của bạn.</p>
            <p>
              Vui lòng kiểm tra hộp thư đến (hoặc thư mục spam) và nhấp vào link
              để đăng nhập.
            </p>
          </div>

          <div className="pt-4">
            <a href="/" className="text-sm text-primary-fg hover:underline">
              ← Về trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}





