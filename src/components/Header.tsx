"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { SearchPopup } from './SearchPopup';
import { Menu, Search, X } from 'lucide-react';

interface HeaderProps {
  activeTab?: 'app' | 'flow';
  onTabChange?: (tab: 'app' | 'flow') => void;
  hideTabs?: boolean;
}

export function Header({ activeTab = 'app', onTabChange, hideTabs = false }: HeaderProps = {}) {
  const { data: session } = useSession();
  const t = useTranslations('header');
  const tCategories = useTranslations('categories');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input when popup opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Prevent body scroll when search popup or menu drawer is open
  useEffect(() => {
    if (isSearchOpen || isMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
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
      // Cleanup on unmount
      if (!isSearchOpen && !isMenuOpen) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
      }
    };
  }, [isSearchOpen, isMenuOpen]);

  const handleLanguageSwitch = () => {
    const newLocale = locale === 'vi' ? 'en' : 'vi';
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = path; // Force reload
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleLoginClick = () => {
    if (session?.user) {
      signOut({ callbackUrl: "/" });
    } else {
      router.push(`/${locale}/login`);
    }
  };

  return (
    <>
      {/* Desktop Header - Fixed left sidebar */}
      <header className="hidden sm:flex flex-col items-start justify-between w-[15vw] min-w-[200px] h-screen sticky top-0 border-r border-border bg-background px-[24px] py-[48px]">
        {/* Logo at top */}
        <div className="w-[70px] h-[100px] relative shrink-0">
          <Link href={`/${locale}`} className="relative w-full h-full flex items-center justify-center">
            <Image 
              src="/images/gd-logo.svg" 
              alt={tCommon('logoAlt')}
              fill
              className="object-contain"
            />
          </Link>
        </div>

        {/* Primary Tabs in middle */}
        {!hideTabs && (
          <div className="flex flex-col gap-4 items-start w-full">
            <button
              onClick={() => onTabChange?.('app')}
              className={`
                flex items-center justify-center px-2 py-1 rounded-full transition-all text-[14px]
                ${activeTab === 'app' 
                  ? 'bg-secondary text-foreground' 
                  : 'text-inactive-text hover:text-foreground'
                }
              `}
            >
              <span className="leading-[1.5] tracking-[0.07px]">
                {tCategories('primaryTabs.app')}
              </span>
            </button>
            <button
              onClick={() => onTabChange?.('flow')}
              className={`
                flex items-center justify-center px-2 py-1 rounded-full transition-all text-[14px]
                ${activeTab === 'flow' 
                  ? 'bg-secondary text-foreground' 
                  : 'text-inactive-text hover:text-foreground'
                }
              `}
            >
              <span className="leading-[1.5] tracking-[0.07px]">
                {tCategories('primaryTabs.flow')}
              </span>
            </button>
          </div>
        )}

        {/* Bottom section: Search, Language, Login */}
        <div className="flex flex-col gap-4 items-start w-full">
          <button
            onClick={handleSearchClick}
            className="flex items-center justify-center px-2 py-1 rounded-full transition-all text-[14px] hover:text-foreground text-foreground"
          >
            <span className="leading-[1.5]">
              {t('search')}
            </span>
          </button>
          <button
            onClick={handleLanguageSwitch}
            className="flex items-center justify-center px-2 py-1 rounded-full transition-all text-[14px] hover:text-foreground text-foreground"
          >
            <span className="leading-[1.5]">
              {locale === 'vi' ? t('switchToEnglish') : t('switchToVietnamese')}
            </span>
          </button>
          <button
            onClick={handleLoginClick}
            className="flex items-center justify-center px-2 py-1 rounded-full transition-all text-[14px] hover:text-foreground text-foreground"
          >
            <span className="leading-[1.5]">
              {session?.user ? t('logout') : t('login')}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="flex sm:hidden flex-col w-full bg-background border-b border-border h-[130px]">
        {/* Top row: Logo, Search and Menu icons */}
        <div className="flex items-center justify-between px-5 py-4 w-full">
          <Link href={`/${locale}`} className="relative w-[35px] h-[50px] flex items-center justify-center">
            <Image 
              src="/images/gd-logo.svg" 
              alt={tCommon('logoAlt')}
              fill
              className="object-contain"
            />
          </Link>
          <div className="flex items-center gap-0">
            <button
              onClick={handleSearchClick}
              className="flex items-center justify-center w-10 h-10 p-2 rounded-[10px] hover:bg-accent transition-colors"
              aria-label={t('search')}
            >
              <Search className="w-6 h-6" strokeWidth={2} />
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="flex items-center justify-center w-10 h-10 p-2 rounded-[10px] hover:bg-accent transition-colors"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Bottom row: Primary Tabs */}
        {!hideTabs && (
          <div className="flex gap-4 items-start px-5 pb-4 w-full">
            <button
              onClick={() => onTabChange?.('app')}
              className={`
                flex items-center justify-center px-2 py-1 rounded-[10px] transition-all text-[14px]
                ${activeTab === 'app' 
                  ? 'bg-secondary text-foreground' 
                  : 'text-foreground hover:bg-accent'
                }
              `}
            >
              <span className="leading-[1.5]">
                {tCategories('primaryTabs.app')}
              </span>
            </button>
            <button
              onClick={() => onTabChange?.('flow')}
              className={`
                flex items-center justify-center px-2 py-1 rounded-[10px] transition-all text-[14px]
                ${activeTab === 'flow' 
                  ? 'bg-secondary text-foreground' 
                  : 'text-foreground hover:bg-accent'
                }
              `}
            >
              <span className="leading-[1.5]">
                {tCategories('primaryTabs.flow')}
              </span>
            </button>
          </div>
        )}
      </header>

      {/* Search Popup */}
      <SearchPopup 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchInputRef={searchInputRef}
      />

      {/* Menu Drawer - Mobile Only */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 sm:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:hidden pointer-events-none">
            <div className="w-full h-full max-h-[400px] bg-background rounded-t-[20px] pointer-events-auto overflow-y-auto">
              <div className="flex flex-col gap-8 px-5 py-8">
                <button
                  onClick={handleLanguageSwitch}
                  className="flex items-center justify-start px-2 py-1 rounded-full transition-all text-[14px] hover:text-foreground text-foreground"
                >
                  <span className="leading-[1.5]">
                    {locale === 'vi' ? t('switchToEnglish') : t('switchToVietnamese')}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLoginClick();
                  }}
                  className="flex items-center justify-start px-2 py-1 rounded-full transition-all text-[14px] hover:text-foreground text-foreground"
                >
                  <span className="leading-[1.5]">
                    {session?.user ? t('logout') : t('login')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
