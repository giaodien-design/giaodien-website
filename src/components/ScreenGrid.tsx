'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

interface ScreenApp {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  brandColor: string | null;
}

interface ScreenType {
  id: string;
  name: string;
  slug: string;
}

export interface ScreenWithApp {
  id: string;
  title: string;
  imageUrl: string;
  app: ScreenApp;
  screenType?: ScreenType | null;
}

interface ScreenGridProps {
  screens: ScreenWithApp[];
  isLoading?: boolean;
}

export function ScreenGrid({ screens, isLoading = false }: ScreenGridProps) {
  const locale = useLocale();
  const t = useTranslations('common');

  // Loading State
  if (isLoading) {
    return (
      <div className="w-full px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[9/19.5] bg-neutral-200 rounded-xl" />
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                <div className="h-3 bg-neutral-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty State
  if (screens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 w-full">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">{t('noScreensFound')}</h3>
          <p className="text-sm text-neutral-500">{t('tryAdjustingFilters')}</p>
        </div>
      </div>
    );
  }

  // Screen Grid
  return (
    <div className="w-full px-6 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {screens.map((screen) => (
          <Link
            key={screen.id}
            href={`/${locale}/app/${screen.app.slug}`}
            className="group flex flex-col"
          >
            {/* Screen Image */}
            <div className="relative aspect-[9/19.5] rounded-xl overflow-hidden bg-neutral-100 ring-1 ring-neutral-200 group-hover:ring-neutral-400 transition-all">
              <Image
                src={screen.imageUrl}
                alt={screen.title}
                fill
                className="object-cover object-top"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                unoptimized={screen.imageUrl.startsWith('http')}
              />
            </div>

            {/* Screen Info */}
            <div className="mt-3 flex items-start gap-2">
              {/* App Icon */}
              <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 ring-1 ring-neutral-200">
                {screen.app.icon ? (
                  <Image
                    src={screen.app.icon}
                    alt={screen.app.name}
                    fill
                    className="object-cover"
                    unoptimized={screen.app.icon.startsWith('http')}
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: screen.app.brandColor || '#6B7280' }}
                  >
                    {screen.app.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate group-hover:text-neutral-600 transition-colors">
                  {screen.title || screen.app.name}
                </p>
                <p className="text-xs text-neutral-500 truncate">{screen.app.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

