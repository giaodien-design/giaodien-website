import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "giaodien.design - Khám phá giao diện ứng dụng",
  description: "Nền tảng khám phá và chia sẻ giao diện ứng dụng đẹp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${comfortaa.variable} font-sans antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
