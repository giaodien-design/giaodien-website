'use client';

import { useState, useCallback, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { getApps } from '@/lib/actions';
import { AppItem } from './AppItem';
import { SecondaryTab } from './SecondaryTab';

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type AppWithCategory = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  thumbnailUrl: string | null;
  category?: Category | null;
  screens?: Array<{
    id: string;
    imageUrl: string;
    title: string;
  }>;
};

interface TabsAndAppListProps {
  initialApps: AppWithCategory[];
  activeTab: 'app' | 'flow';
  onTabChange: (tab: 'app' | 'flow') => void;
}

export function TabsAndAppList({ initialApps }: TabsAndAppListProps) {
  const tCommon = useTranslations('common');
  const [apps, setApps] = useState<AppWithCategory[]>(initialApps);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [showLoading, setShowLoading] = useState(false);

  const fetchApps = useCallback(async (categoryId: string | null) => {
    const loadingTimer = setTimeout(() => {
      setShowLoading(true);
    }, 300);

    startTransition(async () => {
      const result = await getApps({
        categoryId: categoryId || undefined
      });

      clearTimeout(loadingTimer);
      setShowLoading(false);

      if (result.success && result.data) {
        setApps(result.data);
      }
    });
  }, []);

  const handleCategoryChange = useCallback(
    (categoryId: string | null) => {
      setSelectedCategoryId(categoryId);
      fetchApps(categoryId);
    },
    [fetchApps]
  );

  return (
    <div className="flex flex-col w-full px-6 py-8 gap-8">
      {/* Secondary Tabs */}
      <SecondaryTab selectedCategoryId={selectedCategoryId} onCategoryChange={handleCategoryChange} />

      {/* App Grid */}
      <div className="flex flex-col w-full">
        {/* Loading State */}
        {showLoading && (
          <div className="w-full text-center py-20">
            <p className="text-neutral-400">{tCommon('loading')}</p>
          </div>
        )}

        {/* Empty State */}
        {!showLoading && apps.length === 0 && (
          <div className="w-full text-center py-20">
            <p className="text-neutral-400 text-lg">{tCommon('noResults')}</p>
          </div>
        )}

        {/* App Grid - 1 col mobile, 2 cols tablet, 4 cols desktop */}
        {!showLoading && apps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
            {apps.map((app) => (
              <AppItem
                key={app.id}
                id={app.id}
                name={app.name}
                description={app.description || ''}
                thumbnailUrl={app.thumbnailUrl || app.screens?.[0]?.imageUrl}
                logoUrl={app.icon}
                screenCount={app.screens?.length || 0}
                flowCount={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
