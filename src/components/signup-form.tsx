'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const t = useTranslations('auth');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'error' | 'success';
    text: string;
  } | null>(null);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: 'error', text: t('pleaseEnterEmail') });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await signIn('nodemailer', {
        email,
        redirect: false,
        callbackUrl: '/'
      });

      if (result?.error) {
        setMessage({ type: 'error', text: t('error') });
      } else {
        setMessage({
          type: 'success',
          text: t('checkEmail')
        });
      }
    } catch {
      setMessage({ type: 'error', text: t('error') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setMessage(null);

    try {
      await signIn('google', {
        callbackUrl: '/'
      });
    } catch {
      setMessage({
        type: 'error',
        text: t('error')
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailSignUp} className="flex flex-col gap-4">
      {/* Email Input */}
      <Input
        type="email"
        placeholder={t('emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading || isGoogleLoading}
        required
      />

      {/* Error/Success Message */}
      {message && (
        <div
          className={`rounded-md border p-3 text-sm text-center ${
            message.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-600'
              : 'border-green-200 bg-green-50 text-green-600'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Signup Button */}
      <Button type="submit" disabled={isLoading || isGoogleLoading} className="w-full">
        {isLoading ? t('sending') : t('signup')}
      </Button>

      {/* Google Button */}
      <Button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isLoading || isGoogleLoading}
        variant="outline"
        className="w-full"
      >
        {isGoogleLoading ? t('signingUp') : t('continueWithGoogle')}
      </Button>

      {/* Terms Text */}
      <p className="text-sm text-center text-neutral-500 m-0">
        {t('terms')} <span className="text-neutral-950 underline cursor-pointer">{t('termsOfService')}</span> {t('and')}{' '}
        <span className="text-neutral-950 underline cursor-pointer">{t('privacyPolicy')}</span>
        {locale === 'vi' ? ` ${t('ofUs')}` : '.'}
      </p>

      {/* Login Link */}
      {onSwitchToLogin ? (
        <Button type="button" onClick={onSwitchToLogin} variant="ghost" className="self-center">
          {t('alreadyHaveAccount')}
        </Button>
      ) : null}
    </form>
  );
}
