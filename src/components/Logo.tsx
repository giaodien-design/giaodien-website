'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface LogoProps {
  size?: 'large' | 'small';
  className?: string;
  disabled?: boolean;
}

export function Logo({ size = 'large', className = '', disabled = false }: LogoProps) {
  const locale = useLocale();

  const width = size === 'large' ? 70 : 35;
  const height = size === 'large' ? 100 : 40;

  const logoContent = (
    <div
      className={`relative shrink-0 h-10 ${className} ${disabled ? 'pointer-events-none' : ''}`}
      style={{ width: `${width}px` }}
    >
      <Image src="/images/logo-2.svg" alt="Logo" fill className="object-contain" />
    </div>
  );

  if (disabled) {
    return logoContent;
  }

  return <Link href={`/${locale}`}>{logoContent}</Link>;
}
