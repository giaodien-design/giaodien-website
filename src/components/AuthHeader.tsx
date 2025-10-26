'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

export function AuthHeader() {
  const t = useTranslations('header');
  const locale = useLocale();
  const pathname = usePathname();

  const handleLanguageSwitch = () => {
    const newLocale = locale === 'vi' ? 'en' : 'vi';
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = path; // Force reload
  };

  return (
    <>
      {/* Desktop Header (Left Side) */}
      <div className="hidden md:flex flex-col h-full border-r border-gd-cream/[0.12]">
        {/* Logo Container - grows to push button to bottom */}
        <div className="flex-1 border-b border-gd-cream/[0.12] flex items-center justify-center px-5">
          <Link href={`/${locale}`} className="relative w-[191px] h-[42px]">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              fill
              className="object-contain"
            />
          </Link>
        </div>

        {/* Language Switcher Button */}
        <button
          onClick={handleLanguageSwitch}
          className="p-10 hover:bg-gd-cream hover:text-gd-dark transition-colors cursor-pointer group"
        >
          <p className="text-gd-cream group-hover:text-gd-dark text-sm font-normal text-center">
            {locale === 'vi' ? t('switchToEnglish') : t('switchToVietnamese')}
          </p>
        </button>
      </div>

      {/* Mobile Header (Top) */}
      <div className="md:hidden border-b border-gd-cream/[0.12] flex items-center w-full">
        {/* Logo Section */}
        <div className="flex-1 border-r border-gd-cream/[0.12] h-20 flex items-center justify-center px-5">
          <Link href={`/${locale}`} className="relative w-[136px] h-[30px]">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              fill
              className="object-contain"
            />
          </Link>
        </div>

        {/* Language Switcher Button */}
        <button
          onClick={handleLanguageSwitch}
          className="flex-1 h-20 flex items-center justify-center px-5 hover:bg-gd-cream hover:text-gd-dark transition-colors cursor-pointer group"
        >
          <p className="text-gd-cream group-hover:text-gd-dark text-sm font-normal text-center">
            {locale === 'vi' ? t('switchToEnglish') : t('switchToVietnamese')}
          </p>
        </button>
      </div>
    </>
  );
}

