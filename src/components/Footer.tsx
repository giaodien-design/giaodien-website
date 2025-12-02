'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export function Footer() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('header');
  
  const handleLanguageSwitch = () => {
    const newLocale = locale === 'vi' ? 'en' : 'vi';
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = path;
  };

  return (
    <footer className="bg-primary-bg border-t border-border-new w-full">
      {/* Desktop Footer */}
      <div className="hidden md:flex flex-row items-end justify-between gap-3 px-6">
        {/* Left: Logo */}
        <div className="flex items-end flex-1 min-w-0">
          <div className="relative shrink-0" style={{ width: '35px', height: '50px' }}>
            <Image 
              src="/images/logo-2.svg" 
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Center: Copyright */}
        <div className="flex items-end justify-center flex-1">
          <p className="p-2 bg-tertiary-bg rounded-t-lg rounded-b-none text-xs leading-none uppercase text-primary-fg whitespace-nowrap">
            © 2025 giaodien.design · Vietnam
          </p>
        </div>

        {/* Right: Credits */}
        <div className="flex items-end justify-end flex-1 min-w-0 gap-2">
          <div className="flex items-end gap-2 p-2 bg-tertiary-bg rounded-t-lg rounded-b-none">
            <span className="text-xs leading-none uppercase text-primary-fg whitespace-nowrap">
              Designed by
            </span>
            <span className="text-xs leading-none uppercase text-primary-fg whitespace-nowrap">
              Khang
            </span>
          </div>
          <div className="flex items-end gap-2 p-2 bg-tertiary-bg rounded-t-lg rounded-b-none">
            <span className="text-xs leading-none uppercase text-primary-fg whitespace-nowrap">
              Mentored by
            </span>
            <span className="text-xs leading-none uppercase text-primary-fg whitespace-nowrap">
              James
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="flex md:hidden flex-col items-center gap-3 px-4">
        {/* Logo */}
        <div className="relative" style={{ width: '35px', height: '50px' }}>
          <Image 
            src="/images/logo-2.svg" 
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* Language Switcher Button */}
        <button
          onClick={handleLanguageSwitch}
          className="flex items-center justify-center shrink-0 p-2 rounded-lg bg-primary-bg text-primary-fg hover:bg-primary-fg hover:text-primary-bg transition-colors"
        >
          <span className="text-xs leading-none whitespace-pre uppercase">
            {locale === 'vi' ? t('switchToEnglish') : t('switchToVietnamese')}
          </span>
        </button>

        {/* Copyright */}
        <p className="p-0 bg-transparent text-xs leading-none uppercase text-primary-fg text-center">
          © 2025 giaodien.design · Vietnam
        </p>

        {/* Credits */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-2 p-0 bg-transparent">
            <span className="text-xs leading-none uppercase text-primary-fg whitespace-nowrap">
              Designed by
            </span>
            <span className="text-xs leading-none uppercase text-primary-fg whitespace-nowrap">
              Khang
            </span>
          </div>
          <div className="flex items-center gap-2 p-0 bg-transparent">
            <span className="text-xs leading-none uppercase text-primary-fg whitespace-nowrap">
              Mentored by
            </span>
            <span className="text-xs leading-none uppercase text-primary-fg whitespace-nowrap">
              James
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
