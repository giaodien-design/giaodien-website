"use client";

import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: "error", text: "Vui lòng nhập email" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        setMessage({ type: "error", text: "Đã xảy ra lỗi. Vui lòng thử lại." });
      } else {
        setMessage({
          type: "success",
          text: "Kiểm tra email của bạn để nhận link đăng nhập!",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Đã xảy ra lỗi. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setMessage(null);

    try {
      await signIn("google", {
        callbackUrl: "/",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Đã xảy ra lỗi khi đăng ký với Google.",
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleEmailSignUp}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">giaodien.design</span>
            </Link>
            <h1 className="text-xl font-bold">
              Chào mừng đến với giaodien.design
            </h1>
            <FieldDescription>
              Đã có tài khoản? <a href="/login">Đăng nhập</a>
            </FieldDescription>
          </div>

          {message && (
            <div
              className={cn(
                "rounded-md p-3 text-sm",
                message.type === "error"
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-green-50 text-green-800 border border-green-200"
              )}
            >
              {message.text}
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isGoogleLoading}
              required
            />
          </Field>
          <Field>
            <Button type="submit" disabled={isLoading || isGoogleLoading}>
              {isLoading ? "Đang gửi..." : "Tạo tài khoản"}
            </Button>
          </Field>
          <FieldSeparator>Hoặc</FieldSeparator>
          <Field>
            <div className="flex justify-center">
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading || isGoogleLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                {isGoogleLoading ? "Đang đăng ký..." : "Đăng ký với Google"}
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        Khi tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </FieldDescription>
    </div>
  );
}
