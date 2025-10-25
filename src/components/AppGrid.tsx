'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Type = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
};

type AppWithTypes = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  appTypes?: Array<{
    type: Type;
  }>;
  screens?: Array<{
    id: string;
    imageUrl: string;
    title: string;
  }>;
};

interface AppGridProps {
  apps: AppWithTypes[];
  isLoading?: boolean;
}

export function AppGrid({ apps, isLoading = false }: AppGridProps) {
  const t = useTranslations('apps');
  const tCommon = useTranslations('common');

  // Loading State
  if (isLoading) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-neutral-500">{tCommon('loading')}</p>
      </div>
    );
  }

  // Empty State
  if (apps.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-neutral-500 text-lg">{t('noResults')}</p>
      </div>
    );
  }

  // App Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {apps.map((app, index) => (
        <div key={`${app.id}-${index}`} className="flex flex-col gap-4 md:gap-5 items-start w-full">
          {/* App Info */}
          <div className="flex gap-3 items-start w-full">
            <div className="border border-neutral-100 rounded-xl w-10 h-10 shrink-0 relative overflow-hidden">
              <Image
                src="/images/sample-logo.png"
                alt={app.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1 items-start min-w-0">
              <p className="text-base md:text-lg font-medium text-black leading-normal w-full truncate">
                {app.name}
              </p>
              <p className="text-sm font-normal text-black/60 leading-normal w-full truncate">
                {app.description || t('mobileApp')}
              </p>
            </div>
          </div>

          {/* Screenshot Container */}
          <div className="bg-neutral-50 flex items-center justify-center px-8 md:px-12 lg:px-[60px] py-4 md:py-6 lg:py-[30px] rounded-2xl md:rounded-[30px] w-full">
            <div className="aspect-[1179/2556] flex-1 rounded-xl md:rounded-[20px] relative overflow-hidden">
              <Image
                src="/images/sample-img.png"
                alt={`${app.name} ${t('screenshot')}`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}



