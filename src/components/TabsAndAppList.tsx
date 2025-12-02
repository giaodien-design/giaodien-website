'use client';

import { useState, useCallback, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { getApps } from '@/lib/actions';
import { AppItem } from './AppItem';
import { SecondaryTab } from './SecondaryTab';

type Category = {
  id: string;
  name: string;
  slug: string;
};

type AppWithCategory = {
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
  categories: Category[];
  activeTab: 'app' | 'flow';
  onTabChange: (tab: 'app' | 'flow') => void;
}

export function TabsAndAppList({ initialApps, categories }: TabsAndAppListProps) {
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
        categoryId: categoryId || undefined,
      });

      clearTimeout(loadingTimer);
      setShowLoading(false);

      if (result.success && result.data) {
        setApps(result.data);
      }
    });
  }, []);

  const handleCategoryChange = useCallback((categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    fetchApps(categoryId);
  }, [fetchApps]);

  return (
    <>
      {/* Secondary Tabs */}
      <SecondaryTab 
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={handleCategoryChange}
      />

      {/* App Grid */}
      <div className="flex flex-col w-full bg-primary-bg p-6 px-4 py-6 sm:p-6">
        {/* Loading State */}
        {showLoading && (
          <div className="w-full text-center py-20">
            <p className="text-secondary-fg">{tCommon('loading')}</p>
          </div>
        )}

        {/* Empty State */}
        {!showLoading && apps.length === 0 && (
          <div className="w-full text-center py-20">
            <p className="text-secondary-fg text-lg">{tCommon('noResults')}</p>
          </div>
        )}

        {/* App Grid */}
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
    </>
  );
}
