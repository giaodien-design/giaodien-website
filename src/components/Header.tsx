'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter as useNextRouter } from '@/i18n/routing';
import { Search } from 'lucide-react';
import { Logo } from './Logo';
import { SearchDrawer } from './SearchDrawer';
import { LoginPopup } from './LoginPopup';
import { SignupPopup } from './SignupPopup';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
  onLoginOpenChange?: (isOpen: boolean) => void;
}

export function Header({ onLoginOpenChange }: HeaderProps) {
  const { data: session } = useSession();
  const t = useTranslations('header');
  const router = useNextRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // Sync login state with parent
  useEffect(() => {
    onLoginOpenChange?.(isLoginOpen);
  }, [isLoginOpen, onLoginOpenChange]);

  // Keyboard shortcut: Cmd+K / Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleAvatarClick = () => {
    router.push('/profile');
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handlePricingClick = () => {
    router.push('/pricing');
  };

  return (
    <>
      {/* Header */}
      <header className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        {/* Left: Logo */}
        <div className="flex shrink-0 items-center">
          <Logo size="large" disabled={isSearchOpen} />
        </div>

        {/* Center: Fake Search Input (Desktop) */}
        <div className="hidden flex-1 justify-center sm:flex">
          <button
            onClick={handleSearchClick}
            className="flex w-full max-w-md items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-left transition-colors hover:border-neutral-300 hover:bg-neutral-100"
          >
            <Search className="h-4 w-4 text-neutral-400" />
            <span className="flex-1 text-sm text-neutral-500">Search apps, screens, flows...</span>
            <kbd className="hidden rounded-md border border-neutral-200 bg-white px-2 py-0.5 font-mono text-xs text-neutral-400 md:inline-block">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Mobile Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchClick}
            className="sm:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Pricing - Hidden on mobile */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handlePricingClick}
            className="hidden sm:inline-flex"
          >
            {t('pricing')}
          </Button>

          {/* User Avatar (Logged In) or Login Button (Logged Out) */}
          {session?.user ? (
            <button
              onClick={handleAvatarClick}
              className="rounded-full ring-2 ring-transparent transition-all hover:ring-neutral-200 focus:outline-none focus:ring-neutral-300"
              aria-label="Go to profile"
            >
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                <AvatarFallback className="text-xs font-medium">
                  {getUserInitials(session.user.name)}
                </AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <Button variant="default" size="sm" onClick={handleLoginClick}>
              {t('login')}
            </Button>
          )}
        </div>
      </header>

      {/* Search Drawer */}
      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Auth Popups */}
      <LoginPopup
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />
      <SignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
}
