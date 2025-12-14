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
  screenCount = 0,
  flowCount = 0
}: AppItemProps) {
  const locale = useLocale();
  const t = useTranslations('apps');

  // Helper function to validate image URLs
  // Returns the URL if it's a local path or configured external domain, otherwise returns fallback
  const getValidImageUrl = (url: string | null | undefined, fallback: string): string => {
    if (!url) return fallback;

    // If it's a local path (starts with /), use it directly
    if (url.startsWith('/')) return url;

    // If it's an external URL, check if it's from a configured domain
    try {
      const urlObj = new URL(url);
      // Check if it's from the configured S3 domain
      if (urlObj.hostname === 'giaodien-website-image.s3.ap-southeast-1.amazonaws.com') {
        return url;
      }
      // For other external URLs, use fallback to avoid configuration errors
      return fallback;
    } catch {
      // Invalid URL format, use fallback
      return fallback;
    }
  };

  const validThumbnailUrl = getValidImageUrl(thumbnailUrl, '/images/sample-img.png');
  const validLogoUrl = getValidImageUrl(logoUrl, '/images/sample-app-thumbnail.png');

  return (
    <Link href={`/${locale}/app/${id}`} className="flex flex-col gap-4 w-full group">
      {/* Screenshot Container */}
      <div className="relative flex items-center justify-center w-full py-12 rounded-[20px] bg-neutral-100">
        {/* Counters (Absolute Top-Left) */}
        {(screenCount > 0 || flowCount > 0) && (
          <div className="absolute top-2 left-2 z-10 flex gap-2">
            {screenCount > 0 && (
              <div className="py-1 px-2 bg-white rounded-[16px] flex justify-center items-center text-center leading-4">
                <span className="text-xs font-normal text-neutral-950">{t('screenCount', { count: screenCount })}</span>
              </div>
            )}
            {flowCount > 0 && (
              <div className="py-1 px-2 bg-white rounded-[16px] flex justify-center items-center text-center leading-4">
                <span className="text-xs font-normal text-neutral-950">{t('flowCount', { count: flowCount })}</span>
              </div>
            )}
          </div>
        )}

        {/* Screenshot Image - CRITICAL: Preserve existing width calculation */}
        <div className="relative shrink-0 w-[200px] h-[434px]">
          <Image
            src={validThumbnailUrl}
            alt={name}
            fill
            className="object-cover object-center rounded-[20px]"
            sizes="(max-width: 768px) 200px, 200px"
          />
        </div>
      </div>

      {/* App Information */}
      <div className="flex flex-row items-start gap-2">
        {/* Logo */}
        <div className="relative shrink-0 w-[44px] h-[44px] rounded-[16px] border border-neutral-200 overflow-hidden">
          <Image src={validLogoUrl} alt={name} fill className="object-cover object-center" />
        </div>

        {/* Text Group */}
        <div className="flex-1 min-w-0 flex flex-col gap-0">
          <h3 className="text-base leading-normal text-neutral-950">{name}</h3>
          <p className="text-sm leading-normal text-neutral-400">{description || ''}</p>
        </div>
      </div>
    </Link>
  );
}
