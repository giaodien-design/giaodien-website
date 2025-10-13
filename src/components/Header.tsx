"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

export function Header() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <header className="flex items-center gap-3 justify-center px-4 md:px-10 lg:px-20 py-3 bg-white">
      <div className="flex-1 flex items-start">
        <Link
          href="/"
          className="h-5 w-[97px] md:h-6 md:w-[117px] relative block"
        >
          <Image
            src="/images/gdd-logo.svg"
            alt="gdd logo"
            fill
            className="object-contain"
          />
        </Link>
      </div>

      <div className="hidden md:flex items-center">
        <Input
          type="text"
          placeholder="Tìm kiếm"
          className="w-48 lg:w-80 h-9 rounded-md border-neutral-200 px-3 py-1 text-base text-neutral-500 placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <div className="flex-1 flex items-center justify-end gap-2.5">
        {isLoading ? (
          <div className="h-9 w-24 animate-pulse bg-neutral-200 rounded-lg" />
        ) : session?.user ? (
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-2">
              <User className="size-4" />
              <span className="text-sm font-medium">
                {session.user.name || session.user.email}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-3 md:px-4 py-2 rounded-lg shadow-sm text-xs md:text-sm font-medium bg-white border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900"
            >
              <LogOut className="size-4 md:mr-2" />
              <span className="hidden md:inline">Đăng xuất</span>
            </Button>
          </div>
        ) : (
          <Button
            asChild
            variant="outline"
            className="px-3 md:px-4 py-2 rounded-lg shadow-sm text-xs md:text-sm font-medium bg-white border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900"
          >
            <Link href="/login">Đăng nhập</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
