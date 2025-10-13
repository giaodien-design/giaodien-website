'use client';

import { useState, useCallback, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { getApps } from '@/lib/actions';
import { CategoryNavigationCombined } from './CategoryNavigationCombined';

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

interface AppGridSimpleProps {
  initialApps: AppWithTypes[];
  types: Type[];
}

export function AppGridSimple({ initialApps, types }: AppGridSimpleProps) {
  const t = useTranslations('apps');
  const tCommon = useTranslations('common');
  const [apps, setApps] = useState<AppWithTypes[]>(initialApps);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchApps = useCallback(async (selectedTypeId: string | null) => {
    startTransition(async () => {
      const result = await getApps({
        typeId: selectedTypeId || undefined,
      });

      if (result.success && result.data) {
        setApps(result.data);
      }
    });
  }, []);

  const handleTypeChange = useCallback((selectedTypeId: string | null) => {
    setTypeId(selectedTypeId);
    fetchApps(selectedTypeId);
  }, [fetchApps]);

  return (
    <>
      {/* Category Navigation with Filter */}
      <CategoryNavigationCombined types={types} onTypeChange={handleTypeChange} />

      {/* App Grid Section */}
      <section className="flex flex-col gap-8 md:gap-12 lg:gap-16 items-start p-4 md:p-10 lg:p-20 w-full">

        {/* Loading State */}
        {isPending && (
          <div className="w-full text-center py-8">
            <p className="text-neutral-500">{tCommon('loading')}</p>
          </div>
        )}

        {/* Empty State */}
        {!isPending && apps.length === 0 && (
          <div className="w-full text-center py-12">
            <p className="text-neutral-500 text-lg">{t('noResults')}</p>
          </div>
        )}

        {/* App Grid */}
        {!isPending && apps.length > 0 && (
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
        )}
      </section>
    </>
  );
}


