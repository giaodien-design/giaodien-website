'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter as useNextRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

interface ButtonInHeaderProps {
  onSearchOpenChange?: (isOpen: boolean) => void;
  onLoginOpenChange?: (isOpen: boolean) => void;
}

export function ButtonInHeader({ onSearchOpenChange, onLoginOpenChange }: ButtonInHeaderProps) {
  const { data: session } = useSession();
  const t = useTranslations('header');
  const locale = useLocale();
  const router = useNextRouter();
  const pathname = usePathname();

  const handleLanguageSwitch = () => {
    const newLocale = locale === 'vi' ? 'en' : 'vi';
    const currentPath = pathname;
    router.push(currentPath, { locale: newLocale });
  };

  const handleSearchClick = () => {
    onSearchOpenChange?.(true);
  };

  const handleLoginClick = () => {
    if (session?.user) {
      signOut({ callbackUrl: '/' });
    } else {
      onLoginOpenChange?.(true);
    }
  };

  const handlePricingClick = () => {
    router.push('/pricing');
  };

  return (
    <div className="flex flex-row items-center gap-3">
      {/* Search Button - Secondary variant */}
      <Button variant="secondary" size="sm" onClick={handleSearchClick}>
        {t('search')}
      </Button>

      {/* Language Switcher - Secondary variant, hidden on mobile */}
      <Button variant="secondary" size="sm" onClick={handleLanguageSwitch} className="hidden sm:inline-flex">
        {locale === 'vi' ? t('switchToEnglish') : t('switchToVietnamese')}
      </Button>

      {/* Pricing Button - Secondary variant, hidden on mobile */}
      <Button variant="secondary" size="sm" onClick={handlePricingClick} className="hidden sm:inline-flex">
        {t('pricing')}
      </Button>

      {/* Login/Logout Button */}
      {session?.user ? (
        <Button variant="secondary" size="sm" onClick={handleLoginClick}>
          {t('logout')}
        </Button>
      ) : (
        <Button variant="default" size="sm" onClick={handleLoginClick}>
          {t('login')}
        </Button>
      )}
    </div>
  );
}
