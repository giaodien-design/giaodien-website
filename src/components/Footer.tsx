'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' }
];

export function Footer() {
  const locale = useLocale();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = path;
  };

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  return (
    <footer className="w-full border-t border-neutral-100">
      {/* Desktop Footer */}
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

        {/* Right: Credits + Language */}
        <div className="flex items-center justify-end flex-1 min-w-0 gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-sm leading-normal text-neutral-400">Designed by</span>
              <span className="text-sm leading-normal text-neutral-950">Khang</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm leading-normal text-neutral-400">Mentored by</span>
              <span className="text-sm leading-normal text-neutral-950">James</span>
            </div>
          </div>

          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-neutral-500 hover:text-neutral-700">
                <Globe className="h-4 w-4" />
                <span className="text-sm">{currentLanguage.label}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={locale === lang.code ? 'bg-neutral-100' : ''}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Footer */}
      <div className="flex md:hidden flex-col items-center gap-4 px-6 py-4">
        {/* Top row: Logo + Language */}
        <div className="flex w-full items-center justify-between">
          <div className="relative w-[35px] h-[50px]">
            <Image src="/images/logo-2.svg" alt="Logo" fill className="object-contain" />
          </div>

          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-neutral-500 hover:text-neutral-700">
                <Globe className="h-4 w-4" />
                <span className="text-sm">{currentLanguage.label}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={locale === lang.code ? 'bg-neutral-100' : ''}
                >
                  {lang.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Copyright */}
        <p className="text-sm leading-normal text-neutral-400">© 2025 giaodien.design · Vietnam</p>
      </div>
    </footer>
  );
}
