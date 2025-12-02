'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter as useNextRouter } from '@/i18n/routing';
import { useEffect } from 'react';

interface SmallButtonProps {
  label: string;
  onClick: () => void;
}

function SmallButton({ label, onClick }: SmallButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center shrink-0 p-2 rounded-t-none rounded-b-lg bg-primary-bg text-primary-fg hover:bg-primary-fg hover:text-primary-bg transition-colors"
    >
      <span className="text-xs leading-none whitespace-pre uppercase">{label}</span>
    </button>
  );
}

interface LoginButtonProps {
  label: string;
  onClick: () => void;
  isMobile?: boolean;
}

function LoginButton({ label, onClick, isMobile = false }: LoginButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center shrink-0 rounded-bl-lg bg-secondary-bg text-primary-fg hover:bg-primary-fg hover:text-secondary-bg transition-colors uppercase ${
        isMobile 
          ? 'pt-4 pb-2 pl-3 pr-9 text-2xl' 
          : 'pt-8 pb-2 pl-3 pr-12 text-3xl'
      }`}
    >
      <span className="leading-none whitespace-pre">{label}</span>
    </button>
  );
}

interface ButtonInHeaderProps {
  direction?: 'vertical' | 'horizontal';
  onSearchOpenChange?: (isOpen: boolean) => void;
  onLoginOpenChange?: (isOpen: boolean) => void;
}

export function ButtonInHeader({ direction = 'vertical', onSearchOpenChange, onLoginOpenChange }: ButtonInHeaderProps) {
  const { data: session } = useSession();
  const t = useTranslations('header');
  const locale = useLocale();
  const router = useNextRouter();
  const pathname = usePathname();
  
  const isVertical = direction === 'vertical';
  const isMobile = !isVertical;

  const handleLanguageSwitch = () => {
    const newLocale = locale === 'vi' ? 'en' : 'vi';
    // Use the i18n router to properly handle locale switching
    // This preserves the current path while changing the locale
    const currentPath = pathname;
    router.push(currentPath, { locale: newLocale });
  };

  const handleSearchClick = () => {
    onSearchOpenChange?.(true);
  };

  const handleLoginClick = () => {
    if (session?.user) {
      signOut({ callbackUrl: "/" });
    } else {
      onLoginOpenChange?.(true);
    }
  };

  const handlePricingClick = () => {
    router.push('/pricing');
  };

  return (
    <div className="flex flex-row items-start gap-4">
      <SmallButton
        label={t('search')}
        onClick={handleSearchClick}
      />
      <SmallButton
        label={locale === 'vi' ? t('switchToEnglish') : t('switchToVietnamese')}
        onClick={handleLanguageSwitch}
      />
      <SmallButton
        label={t('pricing')}
        onClick={handlePricingClick}
      />
      {session?.user ? (
        <SmallButton
          label={t('logout')}
          onClick={handleLoginClick}
        />
      ) : (
        <LoginButton
          label={t('login')}
          onClick={handleLoginClick}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}


