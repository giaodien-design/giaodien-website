'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { LoginForm } from './login-form';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export function LoginPopup({ isOpen, onClose, onSwitchToSignup }: LoginPopupProps) {
  const t = useTranslations('auth');
  const tHeader = useTranslations('header');

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
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
      if (!isOpen) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed h-screen w-screen bg-tertiary-fg p-0 sm:p-6 z-[100] grid place-items-end sm:place-items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Popup Container */}
      <div className="w-full max-w-[400px] max-h-[600px] sm:max-h-[800px] bg-primary-bg rounded-t-lg rounded-b-none sm:rounded-lg p-0 overflow-hidden flex flex-col relative">
        {/* Close Button (Absolute Top-Right) */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 rounded-bl-lg bg-tertiary-bg text-primary-fg leading-none uppercase pt-3 pr-6 pb-1 pl-1 sm:pt-4 sm:pr-9 sm:pb-3 sm:pl-2 text-sm hover:bg-primary-fg hover:text-tertiary-bg transition-colors z-20"
          aria-label={tHeader('close')}
        >
          {tHeader('close')}
        </button>

        {/* Content */}
        <div className="p-5 overflow-y-auto scrollbar-hide flex-1">
          <h2 className="text-xl leading-none uppercase text-primary-fg mb-4">{t('login')}</h2>
          <LoginForm onSwitchToSignup={onSwitchToSignup} />
        </div>
      </div>
    </div>
  );
}

