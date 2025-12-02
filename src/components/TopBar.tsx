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
      className="bg-secondary-bg border-b border-border-new flex gap-4 items-center justify-center px-5 md:px-6 py-3 relative w-full"
    >
      <p className="text-primary-fg text-sm font-normal leading-normal">
        {t('message')}
      </p>
      <button
        onClick={handleClose}
        className="absolute right-5 md:right-6 border-b border-primary-fg hover:bg-hover-bg transition-colors"
        aria-label={t('close')}
      >
        <p className="text-primary-fg text-sm font-normal leading-normal">
          {t('close')}
        </p>
      </button>
    </div>
  );
}

