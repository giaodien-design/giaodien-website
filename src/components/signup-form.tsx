"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';

export function SignupForm() {
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
    <div className="flex flex-col gap-6 items-center justify-center h-full p-20 md:p-20 max-md:p-5 w-full">
      <form onSubmit={handleEmailSignUp} className="w-full max-w-[680px] flex flex-col gap-6">
        {/* Email Input */}
        <input
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading || isGoogleLoading}
          required
          className="w-full border border-gd-cream/[0.12] bg-transparent p-5 text-gd-cream/40 text-sm placeholder:text-gd-cream/40 focus:text-gd-cream focus:outline-none focus:border-gd-cream hover:border-gd-cream transition-colors"
        />

        {/* Error/Success Message */}
        {message && (
          <div
            className={`p-4 text-sm text-center ${
              message.type === "error"
                ? "text-red-400 border border-red-400/20"
                : "text-green-400 border border-green-400/20"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Signup Button */}
        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full bg-gd-cream p-5 text-gd-dark text-sm font-normal hover:bg-gd-cream/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? t('sending') : t('signup')}
        </button>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isLoading || isGoogleLoading}
          className="w-full border border-gd-cream p-5 text-gd-cream text-sm font-normal hover:bg-gd-cream/10 transition-colors disabled:opacity-50"
        >
          {isGoogleLoading ? t('signingUp') : t('continueWithGoogle')}
        </button>

        {/* Terms Text */}
        <p className="text-gd-cream/40 text-sm text-center w-full">
          {t('terms')} <span className="text-gd-cream underline">{t('termsOfService')}</span> {t('and')} <span className="text-gd-cream underline">{t('privacyPolicy')}</span> {locale === 'vi' ? t('ofUs') : '.'}
        </p>

        {/* Login Link */}
        <Link
          href={`/${locale}/login`}
          className="text-gd-cream text-sm text-center border-b border-gd-cream inline-block mx-auto hover:text-gd-cream/80 transition-colors"
        >
          {t('alreadyHaveAccount')}
        </Link>
      </form>
    </div>
  );
}
