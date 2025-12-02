"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations, useLocale } from 'next-intl';

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps = {}) {
  const t = useTranslations('auth');
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: "error", text: t('pleaseEnterEmail') });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        setMessage({ type: "error", text: t('error') });
      } else {
        setMessage({
          type: "success",
          text: t('checkEmail'),
        });
      }
    } catch {
      setMessage({ type: "error", text: t('error') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setMessage(null);

    try {
      await signIn("google", {
        callbackUrl: "/",
      });
    } catch {
      setMessage({
        type: "error",
        text: t('error'),
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailSignUp} className="flex flex-col gap-4">
        {/* Email Input */}
        <input
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading || isGoogleLoading}
          required
          className="w-full p-3 border border-border-new rounded-lg bg-primary-bg text-xs leading-none text-primary-fg placeholder:text-secondary-fg outline-none focus:border-primary-fg disabled:opacity-50"
        />

        {/* Error/Success Message */}
        {message && (
          <div className={`p-3 rounded-lg text-sm leading-relaxed text-center ${
            message.type === 'error' 
              ? 'bg-red-50 text-red-600 border border-red-200' 
              : 'bg-green-50 text-green-600 border border-green-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Signup Button */}
        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full flex items-center justify-center p-3 rounded-lg bg-reverse-bg text-reverse-fg text-xs leading-none uppercase font-normal border-none cursor-pointer transition-colors hover:bg-reverse-hover-bg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t('sending') : t('signup')}
        </button>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isLoading || isGoogleLoading}
          className="w-full flex items-center justify-center p-3 rounded-lg bg-secondary-bg text-primary-fg text-xs leading-none uppercase font-normal border border-border-new cursor-pointer transition-colors hover:bg-hover-bg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGoogleLoading ? t('signingUp') : t('continueWithGoogle')}
        </button>

        {/* Terms Text */}
        <p className="text-sm leading-relaxed text-secondary-fg text-center m-0">
          {t('terms')} <span className="text-primary-fg underline cursor-pointer">{t('termsOfService')}</span> {t('and')} <span className="text-primary-fg underline cursor-pointer">{t('privacyPolicy')}</span>{locale === 'vi' ? ` ${t('ofUs')}` : '.'}
        </p>

        {/* Login Link */}
        {onSwitchToLogin ? (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="self-center p-2 rounded-lg bg-secondary-bg text-primary-fg text-xs leading-none uppercase font-normal border-none cursor-pointer transition-colors hover:bg-hover-bg"
          >
            {t('alreadyHaveAccount')}
          </button>
        ) : null}
      </form>
  );
}
