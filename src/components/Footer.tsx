'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export function Footer() {
  const locale = useLocale();
  
  return (
    <footer className="bg-background border-t border-border w-full">
      {/* Desktop Footer */}
      <div className="hidden md:flex items-center justify-between px-6 py-2.5 h-[90px]">
        {/* Left: Logo + Links */}
        <div className="flex gap-4 items-center flex-1 min-w-0">
          <div className="relative w-[35px] h-[50px] shrink-0">
            <Image 
              src="/images/gd-logo.svg" 
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex gap-4 items-center">
            <Link href="#" className="flex items-center justify-center px-2 py-1 rounded-[10px] hover:bg-accent transition-colors">
              <span className="text-muted-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
                Privacy Policy
              </span>
            </Link>
            <Link href="#" className="flex items-center justify-center px-2 py-1 rounded-[10px] hover:bg-accent transition-colors">
              <span className="text-muted-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
                Terms of Service
              </span>
            </Link>
            <Link href="#" className="flex items-center justify-center px-2 py-1 rounded-[10px] hover:bg-accent transition-colors">
              <span className="text-muted-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
                About Me
              </span>
            </Link>
          </div>
        </div>

        {/* Center: Copyright */}
        <div className="flex items-center justify-center flex-1">
          <p className="text-muted-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
            © 2025 giaodien.design · Vietnam
          </p>
        </div>

        {/* Right: Credits */}
        <div className="flex gap-4 items-center justify-end flex-1 min-w-0">
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
              Designed by
            </span>
            <span className="text-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
              Khang
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
              Mentored by
            </span>
            <span className="text-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
              James
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="flex md:hidden flex-col items-center gap-3 px-5 py-2">
        {/* Logo */}
        <div className="relative w-[35px] h-[50px]">
          <Image 
            src="/images/gd-logo.svg" 
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* Copyright */}
        <p className="text-muted-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] text-center">
          © 2025 giaodien.design · Vietnam
        </p>

        {/* Links */}
        <div className="flex gap-4 items-center justify-center">
          <Link href="#" className="flex items-center justify-center px-2 py-1 rounded-[10px] hover:bg-accent transition-colors">
            <span className="text-muted-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
              Privacy Policy
            </span>
          </Link>
          <Link href="#" className="flex items-center justify-center px-2 py-1 rounded-[10px] hover:bg-accent transition-colors">
            <span className="text-muted-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
              Terms of Service
            </span>
          </Link>
          <Link href="#" className="flex items-center justify-center px-2 py-1 rounded-[10px] hover:bg-accent transition-colors">
            <span className="text-muted-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
              About Me
            </span>
          </Link>
        </div>

        {/* Credits */}
        <div className="flex gap-4 items-center justify-center">
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
              Designed by
            </span>
            <span className="text-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
              Khang
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-muted-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
              Mentored by
            </span>
            <span className="text-foreground text-[11px] font-normal leading-[1.5] tracking-[0.07px] whitespace-nowrap">
              James
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
