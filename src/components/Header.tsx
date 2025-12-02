"use client";

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

export function Header({ activeTab = 'app', onTabChange, hideTabs = false, onLoginOpenChange }: HeaderProps = {}) {
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
      {/* Desktop Header */}
      <header className="hidden sm:flex w-full max-w-none justify-between items-start pl-6">
        <div className="flex items-start gap-4">
          <Logo size="large" disabled={isSearchOpen} />
          
          {!hideTabs && (
            <div className="px-1 pb-1 pt-0 bg-tertiary-bg rounded-none rounded-b-lg">
              <PrimaryTab 
                activeTab={activeTab} 
                onTabChange={onTabChange || (() => {})}
                direction="horizontal"
              />
            </div>
          )}
        </div>

        <ButtonInHeader 
          direction="horizontal" 
          onSearchOpenChange={setIsSearchOpen}
          onLoginOpenChange={setIsLoginOpen}
        />
      </header>

      {/* Mobile Header */}
      <header className="flex sm:hidden w-full max-w-none justify-between items-start pl-4 pb-4">
        <Logo size="small" disabled={isSearchOpen} />
        
        <ButtonInHeader 
          direction="horizontal" 
          onSearchOpenChange={setIsSearchOpen}
          onLoginOpenChange={setIsLoginOpen}
        />
      </header>
      
      {/* Search Drawer - Rendered at Header level so it's always available */}
      <SearchDrawer 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchInputRef={searchInputRef}
      />
      
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
