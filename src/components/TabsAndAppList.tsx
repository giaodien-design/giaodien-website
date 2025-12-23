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
    <div className="flex flex-col w-full px-6 py-8 gap-8">
      {/* App Grid */}
      <div className="flex flex-col w-full">
        {/* Empty State */}
        {apps.length === 0 && (
          <div className="w-full text-center py-20">
            <p className="text-neutral-400 text-lg">{tCommon('noResults')}</p>
          </div>
        )}

        {/* App Grid - 1 col mobile, 2 cols tablet, 4 cols desktop */}
        {apps.length > 0 && (
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
