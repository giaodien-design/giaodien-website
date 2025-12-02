'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface AppItemProps {
  id: string;
  name: string;
  description: string;
  thumbnailUrl?: string | null;
  logoUrl?: string | null;
  screenCount?: number;
  flowCount?: number;
}

export function AppItem({ id, name, description, thumbnailUrl, logoUrl, screenCount = 0, flowCount = 0 }: AppItemProps) {
  const locale = useLocale();
  
  // Helper function to validate image URLs
  // Returns the URL if it's a local path or configured external domain, otherwise returns fallback
  const getValidImageUrl = (url: string | null | undefined, fallback: string): string => {
    if (!url) return fallback;
    
    // If it's a local path (starts with /), use it directly
    if (url.startsWith('/')) return url;
    
    // If it's an external URL, check if it's from a configured domain
    // For now, we'll use fallback for any external URLs that might not be configured
    // This prevents the Next.js image error
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
  
  const validThumbnailUrl = getValidImageUrl(thumbnailUrl, "/images/sample-img.png");
  const validLogoUrl = getValidImageUrl(logoUrl, "/images/sample-app-thumbnail.png");
  
  return (
    <Link href={`/${locale}/app/${id}`} className="flex flex-col w-full h-full group">
      {/* Card Container */}
      <div className="flex flex-col items-center justify-center w-full h-full">
        {/* Screenshot Container */}
        <div className="relative flex items-center justify-center w-full py-12 rounded-lg bg-card-bg">
          {/* Counters (Absolute Top-Left) */}
          {(screenCount > 0 || flowCount > 0) && (
            <div className="absolute top-0 left-0 z-10 flex gap-2">
              {screenCount > 0 && (
                <div className="py-1 px-2 bg-tertiary-bg rounded-tl-lg rounded-br-lg">
                  <span className="text-xs leading-none uppercase text-primary-fg">{screenCount} screens</span>
                </div>
              )}
              {flowCount > 0 && (
                <div className="py-1 px-2 bg-tertiary-bg rounded-b-lg">
                  <span className="text-xs leading-none uppercase text-primary-fg">{flowCount} flows</span>
                </div>
              )}
            </div>
          )}
          <div className="relative shrink-0 w-[200px] h-[434px]">
            <Image
              src={validThumbnailUrl}
              alt={name}
              fill
              className="object-cover object-center rounded-lg"
              sizes="(max-width: 768px) 200px, 200px"
            />
          </div>
        </div>
        
        {/* Content Container */}
        <div className="flex items-start w-full py-4 pl-[1px] pr-0 gap-2">
          {/* App Logo */}
          <div className="relative shrink-0 w-[44px] h-[44px] rounded-lg border border-border-new">
            <Image
              src={validLogoUrl}
              alt={name}
              fill
              className="object-cover object-center rounded-lg"
            />
          </div>
          
          {/* Text Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <h3 className="text-lg leading-none text-primary-fg">
              {name}
            </h3>
            <p className="text-base leading-none text-secondary-fg">
              {description || ''}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
