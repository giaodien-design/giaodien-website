'use client';

import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SignupForm } from './signup-form';

interface SignupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function SignupPopup({ isOpen, onClose, onSwitchToLogin }: SignupPopupProps) {
  const t = useTranslations('auth');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-neutral-950">{t('signup')}</DialogTitle>
        </DialogHeader>
        <SignupForm onSwitchToLogin={onSwitchToLogin} />
      </DialogContent>
    </Dialog>
  );
}
