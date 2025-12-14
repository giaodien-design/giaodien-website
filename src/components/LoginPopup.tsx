'use client';

import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoginForm } from './login-form';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
}

export function LoginPopup({ isOpen, onClose, onSwitchToSignup }: LoginPopupProps) {
  const t = useTranslations('auth');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-neutral-950">{t('login')}</DialogTitle>
        </DialogHeader>
        <LoginForm onSwitchToSignup={onSwitchToSignup} />
      </DialogContent>
    </Dialog>
  );
}
