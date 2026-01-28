'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

interface AppItemProps {
  id: string;
  name: string;
  description: string;
  thumbnailUrl?: string | null;
  logoUrl?: string | null;
  screenCount?: number;
  flowCount?: number;
}

export function AppItem({
  id,
  name,
  description,
  thumbnailUrl,
  logoUrl,
  screenCount = 0
}: AppItemProps) {
  const locale = useLocale();
  const t = useTranslations('apps');

  // Helper function to validate image URLs
  const getValidImageUrl = (url: string | null | undefined, fallback: string): string => {
    if (!url) return fallback;

    if (url.startsWith('/')) return url;

    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'giaodien-website-image.s3.ap-southeast-1.amazonaws.com') {
        return url;
      }
      return fallback;
    } catch {
      return fallback;
    }
  };

  const validThumbnailUrl = getValidImageUrl(thumbnailUrl, '/images/sample-img.png');
  const validLogoUrl = getValidImageUrl(logoUrl, '/images/sample-app-thumbnail.png');

  return (
    <Link
      href={`/${locale}/app/${id}`}
      className="group flex flex-col gap-5 w-full"
    >
      {/* Thumbnail Container - Gallery Style */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50 transition-all duration-300 ease-out group-hover:shadow-lg group-hover:shadow-neutral-200/50 group-hover:-translate-y-1">
        {/* Screen Count Badge */}
        {screenCount > 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full border border-neutral-200/50 shadow-sm">
              <span className="text-xs font-medium text-neutral-700">
                {t('screenCount', { count: screenCount })}
              </span>
            </div>
          </div>
        )}

        {/* Main Thumbnail - Phone Mockup Style */}
        <div className="relative flex items-center justify-center px-8 py-10 sm:px-10 sm:py-12">
          <div className="relative w-full max-w-[180px] aspect-[9/19.5] rounded-[24px] overflow-hidden shadow-xl shadow-neutral-900/10 ring-1 ring-neutral-900/5">
            <Image
              src={validThumbnailUrl}
              alt={name}
              fill
              className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 160px, 180px"
            />
          </div>
        </div>
      </div>

      {/* App Info - Clean & Minimal */}
      <div className="flex items-center gap-3 px-1">
        {/* Small Logo */}
        <div className="relative shrink-0 w-10 h-10 rounded-xl overflow-hidden ring-1 ring-neutral-200 bg-white">
          <Image
            src={validLogoUrl}
            alt={`${name} logo`}
            fill
            className="object-cover"
            sizes="40px"
          />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-neutral-900 truncate leading-tight">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-neutral-500 truncate mt-0.5 leading-tight">
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
