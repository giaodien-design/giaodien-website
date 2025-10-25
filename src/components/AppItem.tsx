'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface AppItemProps {
  id: string;
  name: string;
  description: string;
  thumbnailUrl?: string | null;
}

export function AppItem({ id, name, description, thumbnailUrl }: AppItemProps) {
  const t = useTranslations('common');
  
  return (
    <Link href={`/app/${id}`} className="flex flex-col w-full h-full group">
      {/* Content - flex-1 makes it grow to match tallest item in the row */}
      <div className="flex flex-col gap-3 px-5 pt-10 pb-5 w-full flex-1 items-start justify-start transition-colors group-hover:bg-gd-cream">
        <p className="text-gd-cream text-base font-normal leading-normal group-hover:text-gd-dark transition-colors">
          {name}
        </p>
        <p className="text-gd-cream/60 text-xs font-normal leading-normal group-hover:text-gd-dark transition-colors">
          {description || ''}
        </p>
      </div>
      
      {/* Thumbnail Container */}
      <div className="p-0.5 w-full flex-shrink-0">
        <div className="relative w-full aspect-[430/932]">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 50vw, 25vw"
              unoptimized={thumbnailUrl.startsWith('http')}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gd-dark">
              <p className="text-gd-cream/40 text-sm">{t('noData')}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

