'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  const languages = [
    { code: 'vi', label: '🇻🇳 Tiếng Việt' },
    { code: 'en', label: '🇬🇧 English' },
  ];

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="bg-neutral-100 rounded-xl p-[2px] inline-flex">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={cn(
            "px-3 md:px-4 pt-1.5 pb-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out whitespace-nowrap border-t border-l border-r border-b-2 active:scale-95 touch-manipulation min-w-[44px]",
            currentLocale === lang.code
              ? "bg-white border-neutral-200 text-neutral-900"
              : "text-neutral-400 border-transparent hover:text-neutral-900 active:text-neutral-900"
          )}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

