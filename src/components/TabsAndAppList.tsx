'use client';

import { useTranslations } from 'next-intl';
import { AppItem } from './AppItem';

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
}

export function TabsAndAppList({ initialApps }: TabsAndAppListProps) {
  const tCommon = useTranslations('common');

  // Use server-provided apps directly (filtering is done via URL params on server)
  const apps = initialApps;

  return (
    <div className="flex flex-col w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-16">
      {/* App Grid */}
      <div className="flex flex-col w-full max-w-[1800px] mx-auto">
        {/* Empty State */}
        {apps.length === 0 && (
          <div className="w-full text-center py-20">
            <p className="text-neutral-400 text-lg">{tCommon('noResults')}</p>
          </div>
        )}

        {/* App Grid - Spacious Gallery Layout */}
        {apps.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
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
