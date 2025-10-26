'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'

export function TopBar() {
  const t = useTranslations('topBar');
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if top bar was previously closed in this session
    const wasClosed = sessionStorage.getItem('topBarClosed');
    if (!wasClosed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('topBarClosed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`
        border-b border-gd-cream/[0.12] 
        flex gap-4 items-center justify-center 
        px-5 md:px-20 py-4 
        relative w-full
      `}
    >
      <p className="text-gd-cream text-sm font-normal leading-normal whitespace-pre">
        {t('message')}
      </p>
      <button
        onClick={handleClose}
        className="absolute right-5 md:right-20 border-b border-gd-cream hover:bg-gd-cream/10 transition-colors"
        aria-label={t('close')}
      >
        <p className="text-gd-cream text-sm font-normal leading-normal whitespace-pre">
          {t('close')}
        </p>
      </button>
    </div>
  );
}

