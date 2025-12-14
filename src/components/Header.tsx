'use client';

import { useState, useRef, useEffect } from 'react';
import { Logo } from './Logo';
import { PrimaryTab } from './PrimaryTab';
import { ButtonInHeader } from './ButtonInHeader';
import { SearchDrawer } from './SearchDrawer';
import { LoginPopup } from './LoginPopup';
import { SignupPopup } from './SignupPopup';

interface HeaderProps {
  activeTab?: 'app' | 'flow';
  onTabChange?: (tab: 'app' | 'flow') => void;
  hideTabs?: boolean;
  onLoginOpenChange?: (isOpen: boolean) => void;
}

export function Header({ activeTab = 'app', onTabChange, hideTabs = false, onLoginOpenChange }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync login state with parent
  useEffect(() => {
    onLoginOpenChange?.(isLoginOpen);
  }, [isLoginOpen, onLoginOpenChange]);

  // Auto-focus search input when drawer opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Prevent body scroll when search drawer is open
  useEffect(() => {
    if (isSearchOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      if (!isSearchOpen) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
      }
    };
  }, [isSearchOpen]);

  return (
    <>
      {/* Header - Desktop: flex row with justify-between, Mobile: simplified */}
      <header className="flex w-full items-center justify-between px-6 py-4">
        {/* Left Item: Logo - flex-1 to allow center positioning */}
        <div className="flex flex-1 items-center">
          <Logo size="large" disabled={isSearchOpen} />
        </div>

        {/* Center Item: Primary Tabs - Desktop only, centered */}
        {!hideTabs && (
          <div className="hidden sm:flex items-center justify-center">
            <PrimaryTab activeTab={activeTab} onTabChange={onTabChange || (() => {})} direction="horizontal" />
          </div>
        )}

        {/* Right Item: Button Group - flex-1 with justify-end */}
        <div className="flex flex-1 items-center justify-end">
          <ButtonInHeader onSearchOpenChange={setIsSearchOpen} onLoginOpenChange={setIsLoginOpen} />
        </div>
      </header>

      {/* Search Drawer - Rendered at Header level so it's always available */}
      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} searchInputRef={searchInputRef} />

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
