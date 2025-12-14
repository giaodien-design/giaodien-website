'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function Footer() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('header');

  const handleLanguageSwitch = () => {
    const newLocale = locale === 'vi' ? 'en' : 'vi';
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = path;
  };

  return (
    <footer className="w-full">
      {/* Desktop Footer - flex row, justify-between */}
      <div className="hidden md:flex flex-row items-center justify-between px-6 py-4">
        {/* Left: Logo */}
        <div className="flex items-center flex-1 min-w-0">
          <div className="relative shrink-0 w-[35px] h-[50px]">
            <Image src="/images/logo-2.svg" alt="Logo" fill className="object-contain" />
          </div>
        </div>

        {/* Center: Copyright */}
        <div className="flex items-center justify-center flex-1">
          <p className="text-sm leading-normal text-neutral-400">© 2025 giaodien.design · Vietnam</p>
        </div>

        {/* Right: Credits */}
        <div className="flex items-center justify-end flex-1 min-w-0 gap-4">
          <div className="flex items-center gap-1">
            <span className="text-sm leading-normal text-neutral-400">Designed by</span>
            <span className="text-sm leading-normal text-neutral-950">Khang</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm leading-normal text-neutral-400">Mentored by</span>
            <span className="text-sm leading-normal text-neutral-950">James</span>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Footer - flex row with items-center */}
      <div className="flex md:hidden flex-row items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="relative w-[35px] h-[50px]">
          <Image src="/images/logo-2.svg" alt="Logo" fill className="object-contain" />
        </div>

        {/* Right side content */}
        <div className="flex flex-col items-end gap-2">
          {/* Language Switcher Button */}
          <Button variant="secondary" size="sm" onClick={handleLanguageSwitch}>
            {locale === 'vi' ? t('switchToEnglish') : t('switchToVietnamese')}
          </Button>

          {/* Copyright */}
          <p className="text-sm leading-normal text-neutral-400">© 2025 giaodien.design</p>
        </div>
      </div>
    </footer>
  );
}
