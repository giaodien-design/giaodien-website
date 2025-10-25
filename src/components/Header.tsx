"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { getApps } from '@/lib/actions';
import { AppItem } from './AppItem';

type AppWithScreens = {
  id: string;
  name: string;
  description: string | null;
  screens?: Array<{
    id: string;
    imageUrl: string;
  }>;
};

export function Header() {
  const { data: session } = useSession();
  const t = useTranslations('header');
  const tFooter = useTranslations('footer');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [topBarClosed, setTopBarClosed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AppWithScreens[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Check if top bar is closed and screen size
  useEffect(() => {
    const checkTopBar = () => {
      setTopBarClosed(!!sessionStorage.getItem('topBarClosed'));
      setIsMobile(window.innerWidth < 768);
    };
    
    checkTopBar();
    window.addEventListener('resize', checkTopBar);
    window.addEventListener('storage', checkTopBar);
    
    return () => {
      window.removeEventListener('resize', checkTopBar);
      window.removeEventListener('storage', checkTopBar);
    };
  }, []);

  // Auto-focus search input when drawer opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Search functionality
  useEffect(() => {
    const searchApps = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      const result = await getApps({ search: searchQuery });
      setIsSearching(false);

      if (result.success && result.data) {
        setSearchResults(result.data as AppWithScreens[]);
      }
    };

    const debounceTimer = setTimeout(searchApps, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Prevent body scroll when menu or search is open
  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Apply styles to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
      
      // Store scroll position
      document.body.setAttribute('data-scroll-y', scrollY.toString());
    } else {
      // Restore scroll position
      const scrollY = document.body.getAttribute('data-scroll-y');
      
      // Remove styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
        document.body.removeAttribute('data-scroll-y');
      }
    }
    
    return () => {
      // Cleanup on unmount
      const scrollY = document.body.getAttribute('data-scroll-y');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY));
        document.body.removeAttribute('data-scroll-y');
      }
    };
  }, [isMenuOpen, isSearchOpen]);

  const handleLanguageSwitch = () => {
    const newLocale = locale === 'vi' ? 'en' : 'vi';
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = path; // Force reload
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setIsMenuOpen(false);
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
      {/* Desktop Header */}
      <header className="border-b border-gd-cream/[0.12] hidden md:flex items-center justify-center w-full">
        {/* Logo Section */}
        <div className="border-r border-gd-cream/[0.12] flex items-center h-40 px-10 w-[30%]">
          <Link href={`/${locale}`} className="relative w-[191px] h-[42px]">
            <Image 
              src="/images/logo.svg" 
              alt={tCommon('logoAlt')}
              fill
              className="object-contain"
            />
          </Link>
        </div>

        {/* Button Section */}
        <div className="w-[40%] flex items-center h-40">
          <button
            onClick={handleSearchClick}
            className="flex-1 border-r border-gd-cream/[0.12] h-full flex items-center justify-center hover:bg-gd-cream hover:text-gd-dark transition-colors cursor-pointer group"
          >
            <p className="text-gd-cream group-hover:text-gd-dark text-sm font-normal leading-normal text-center">
              {t('search')}
            </p>
          </button>
          <button
            onClick={handleLoginClick}
            className="flex-1 border-r border-gd-cream/[0.12] h-full flex items-center justify-center hover:bg-gd-cream hover:text-gd-dark transition-colors cursor-pointer group"
          >
            <p className="text-gd-cream group-hover:text-gd-dark text-sm font-normal leading-normal text-center">
              {session?.user ? t('logout') : t('login')}
            </p>
          </button>
          <button
            onClick={handleLanguageSwitch}
            className="flex-1 border-r border-gd-cream/[0.12] h-full flex items-center justify-center hover:bg-gd-cream hover:text-gd-dark transition-colors cursor-pointer group"
          >
            <p className="text-gd-cream group-hover:text-gd-dark text-sm font-normal leading-normal text-center">
              {locale === 'vi' ? t('switchToEnglish') : t('switchToVietnamese')}
            </p>
          </button>
        </div>

        {/* Copyright Section */}
        <div className="flex items-center justify-center h-40 px-10 w-[30%]">
          <p className="text-gd-cream/60 text-sm font-normal leading-normal whitespace-pre">
            {tFooter('copyright')}
          </p>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="border-b border-gd-cream/[0.12] flex md:hidden items-center justify-center w-full">
        {/* Logo Section */}
        <div className="flex-1 border-r border-gd-cream/[0.12] flex items-center justify-center h-20 px-5">
          <Link href={`/${locale}`} className="relative w-[136px] h-[30px]">
            <Image 
              src="/images/logo.svg" 
              alt={tCommon('logoAlt')}
              fill
              className="object-contain"
            />
          </Link>
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            setIsSearchOpen(false);
          }}
          className="flex-1 flex flex-col items-center justify-center h-20 px-5 gap-2"
          aria-label="Menu"
        >
          <div 
            className={`
              w-9 h-0.5 bg-gd-cream transition-all duration-300
              ${isMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}
            `}
          />
          <div 
            className={`
              w-9 h-0.5 bg-gd-cream transition-all duration-300
              ${isMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}
            `}
          />
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      <div 
        className={`
          md:hidden fixed left-0 right-0 bottom-0 bg-gd-dark z-40
          transition-all duration-300 ease-in-out overflow-hidden
          border-b border-gd-cream/[0.12]
          ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        style={{ 
          top: topBarClosed ? '80px' : '129px' 
        }} // Below top bar + header or just header
      >
        <div className="flex flex-col h-full">
          {/* 3 Buttons - equally divided */}
          <button
            onClick={handleSearchClick}
            className="flex-1 border-b border-gd-cream/[0.12] flex items-center justify-center hover:bg-gd-cream hover:text-gd-dark transition-colors cursor-pointer group"
          >
            <p className="text-gd-cream group-hover:text-gd-dark text-sm font-normal leading-normal text-center">
              {t('search')}
            </p>
          </button>
          <button
            onClick={handleLoginClick}
            className="flex-1 border-b border-gd-cream/[0.12] flex items-center justify-center hover:bg-gd-cream hover:text-gd-dark transition-colors cursor-pointer group"
          >
            <p className="text-gd-cream group-hover:text-gd-dark text-sm font-normal leading-normal text-center">
              {session?.user ? t('logout') : t('login')}
            </p>
          </button>
          <button
            onClick={handleLanguageSwitch}
            className="flex-1 border-b border-gd-cream/[0.12] flex items-center justify-center hover:bg-gd-cream hover:text-gd-dark transition-colors cursor-pointer group"
          >
            <p className="text-gd-cream group-hover:text-gd-dark text-sm font-normal leading-normal text-center">
              {locale === 'vi' ? t('switchToEnglish') : t('switchToVietnamese')}
            </p>
          </button>
          
          {/* Copyright Footer - fixed height */}
          <div className="flex gap-4 items-center justify-center px-5 py-4 h-[49px]">
            <p className="text-gd-cream/60 text-sm font-normal leading-normal whitespace-pre">
              {tFooter('copyright')}
            </p>
          </div>
        </div>
      </div>

      {/* Search Drawer (Both Desktop and Mobile) */}
      <div 
        className={`
          fixed left-0 right-0 bottom-0 bg-gd-dark z-50
          transition-all duration-300 ease-in-out overflow-y-auto scrollbar-hide
          border-t border-gd-cream/[0.12]
          ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        style={{ 
          top: topBarClosed 
            ? (isMobile ? '80px' : '160px')
            : (isMobile ? '129px' : '209px'),
          height: topBarClosed
            ? (isMobile ? 'calc(100svh - 80px)' : 'calc(100svh - 160px)')
            : (isMobile ? 'calc(100svh - 129px)' : 'calc(100svh - 209px)')
        }}
      >
        {/* Search Field */}
        <div className="border-b border-gd-cream/[0.12] flex w-full">
          {/* Input Section */}
          <div className="flex-1 md:flex-[1486] flex items-center h-20 md:h-40 px-5 md:px-20 border-r border-gd-cream/[0.12]">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-transparent text-gd-cream/40 text-sm font-normal leading-normal outline-none focus:text-gd-cream hover:text-gd-cream transition-colors placeholder:text-gd-cream/40"
            />
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
              setSearchResults([]);
            }}
            className="w-[74px] md:w-[194px] h-20 md:h-40 flex items-center justify-center hover:bg-gd-cream hover:text-gd-dark transition-colors cursor-pointer group"
          >
            <p className="text-gd-cream group-hover:text-gd-dark text-sm font-normal leading-normal">
              {t('close')}
            </p>
          </button>
        </div>

        {/* Search Results */}
        <div className="flex flex-col w-full">
          {isSearching && (
            <div className="w-full text-center py-20">
              <p className="text-gd-cream/60">{tCommon('loading')}</p>
            </div>
          )}

          {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="w-full text-center py-20">
              <p className="text-gd-cream/60 text-lg">{t('noResults')}</p>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <div className="flex flex-wrap w-full border-b border-gd-cream/[0.12]">
              {searchResults.map((app, index) => {
                const isLastRowDesktop = index >= searchResults.length - (searchResults.length % 4 || 4);
                const isLastRowMobile = index >= searchResults.length - (searchResults.length % 2 || 2);

                return (
                  <div
                    key={app.id}
                    className={`
                      w-1/2 md:w-1/4
                      flex
                      border-r border-gd-cream/[0.12]
                      border-b border-gd-cream/[0.12]
                      md:[&:nth-child(4n)]:border-r-0
                      [&:nth-child(2n)]:border-r-0
                      md:[&:nth-child(2n)]:border-r
                      ${isLastRowMobile ? 'max-md:border-b-0' : ''}
                      ${isLastRowDesktop ? 'md:border-b-0' : ''}
                    `}
                  >
                    <AppItem
                      id={app.id}
                      name={app.name}
                      description={app.description || ''}
                      thumbnailUrl={app.screens?.[0]?.imageUrl}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </>
  );
}
