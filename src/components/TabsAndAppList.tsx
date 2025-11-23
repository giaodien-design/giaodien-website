'use client';

import { useState, useCallback, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { getApps } from '@/lib/actions';
import { AppItem } from './AppItem';

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

interface TabsAndAppListProps {
  initialApps: AppWithTypes[];
  types: Type[];
  activeTab: 'app' | 'flow';
  onTabChange: (tab: 'app' | 'flow') => void;
}

export function TabsAndAppList({ initialApps, types }: TabsAndAppListProps) {
  const t = useTranslations('categories');
  const tCommon = useTranslations('common');
  const [apps, setApps] = useState<AppWithTypes[]>(initialApps);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [showLoading, setShowLoading] = useState(false);

  const fetchApps = useCallback(async (typeId: string | null) => {
    // Set a timer to show loading state only if request takes longer than 300ms
    const loadingTimer = setTimeout(() => {
      setShowLoading(true);
    }, 300);

    startTransition(async () => {
      const result = await getApps({
        typeId: typeId || undefined,
      });

      // Clear the timer and hide loading state
      clearTimeout(loadingTimer);
      setShowLoading(false);

      if (result.success && result.data) {
        setApps(result.data);
      }
    });
  }, []);

  const handleTypeChange = useCallback((typeId: string | null) => {
    setSelectedTypeId(typeId);
    fetchApps(typeId);
  }, [fetchApps]);

  // Map types to match translation keys
  const typeTranslationMap: Record<string, string> = {
    'all': 'all',
    'transportation': 'transportation',
    'finance': 'finance',
    'entertainment': 'entertainment',
    'lifestyle': 'lifestyle',
    'productivity': 'productivity'
  };

  return (
    <>
      {/* Secondary Tabs */}
      <div className="bg-background border-b border-border px-5 md:px-6 py-4 md:py-5">
        <div className="flex gap-4 items-start overflow-x-auto scrollbar-hide">
          {/* All */}
          <button
            onClick={() => handleTypeChange(null)}
            className={`
              flex items-center justify-center px-2 py-1 rounded-full transition-all shrink-0
              ${selectedTypeId === null 
                ? 'bg-secondary text-foreground' 
                : 'text-inactive-text hover:text-foreground'
              }
            `}
          >
            <span className="leading-[1.5] text-[14px] tracking-[0.07px] whitespace-nowrap">
              {t('secondaryTabs.all')}
            </span>
          </button>
          
          {/* Type Tabs */}
          {types.slice(0, 4).map((type) => {
            const translationKey = typeTranslationMap[type.slug] || type.slug;
            return (
              <button
                key={type.id}
                onClick={() => handleTypeChange(type.id)}
                className={`
                  flex items-center justify-center px-2 py-1 rounded-full transition-all shrink-0
                  ${selectedTypeId === type.id 
                    ? 'bg-secondary text-foreground' 
                    : 'text-inactive-text hover:text-foreground'
                  }
                `}
              >
                <span className="leading-[1.5] text-[14px] tracking-[0.07px] whitespace-nowrap">
                  {t(`secondaryTabs.${translationKey}` as 'secondaryTabs.all')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* App List */}
      <div className="flex flex-col w-full bg-background">
        {/* Loading State - only shown if request takes longer than 300ms */}
        {showLoading && (
          <div className="w-full text-center py-20">
            <p className="text-muted-foreground">{tCommon('loading')}</p>
          </div>
        )}

        {/* Empty State */}
        {!showLoading && apps.length === 0 && (
          <div className="w-full text-center py-20">
            <p className="text-muted-foreground text-lg">{tCommon('noResults')}</p>
          </div>
        )}

        {/* App Grid */}
        {!showLoading && apps.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full items-stretch">
            {apps.map((app) => (
              <AppItem
                key={app.id}
                id={app.id}
                name={app.name}
                description={app.description || ''}
                thumbnailUrl={app.screens?.[0]?.imageUrl}
                logoUrl={app.icon}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

