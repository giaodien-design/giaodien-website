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
}

export function TabsAndAppList({ initialApps, types }: TabsAndAppListProps) {
  const t = useTranslations('categories');
  const tCommon = useTranslations('common');
  const [apps, setApps] = useState<AppWithTypes[]>(initialApps);
  const [activeTab, setActiveTab] = useState<'app' | 'screen'>('app');
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
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
      {/* Primary Tabs */}
      <div className="border-b border-gd-cream/[0.12] flex items-center w-full">
        <button
          onClick={() => setActiveTab('app')}
          className={`
            flex-1 h-20 md:h-40 flex items-center justify-center
            border-r border-gd-cream/[0.12]
            transition-colors
            ${activeTab === 'app' 
              ? 'bg-gd-cream text-gd-dark' 
              : 'text-gd-cream/40 hover:text-gd-cream/60 cursor-pointer'
            }
          `}
        >
          <p className="text-sm font-normal leading-normal whitespace-pre">
            {t('primaryTabs.app')}
          </p>
        </button>
        <button
          onClick={() => setActiveTab('screen')}
          className={`
            flex-1 h-20 md:h-40 flex items-center justify-center
            transition-colors
            ${activeTab === 'screen' 
              ? 'bg-gd-cream text-gd-dark' 
              : 'text-gd-cream/40 hover:text-gd-cream/60 cursor-pointer'
            }
          `}
        >
          <p className="text-sm font-normal leading-normal whitespace-pre">
            {t('primaryTabs.screen')}
          </p>
        </button>
      </div>

      {/* Secondary Tabs */}
      <div className="border-b border-gd-cream/[0.12] w-full">
        <div className="flex items-center overflow-x-auto scrollbar-hide md:overflow-visible">
          {/* All */}
          <button
            onClick={() => handleTypeChange(null)}
            className={`
              h-20 md:h-40 flex items-center justify-center
              border-r border-gd-cream/[0.12]
              px-5
              md:flex-1 md:px-0
              transition-colors
              ${selectedTypeId === null 
                ? 'text-gd-cream border-b-2 border-b-gd-cream' 
                : 'text-gd-cream/60 hover:text-gd-cream/80 cursor-pointer'
              }
            `}
          >
            <p className="text-sm font-normal leading-normal whitespace-nowrap">
              {t('secondaryTabs.all')}
            </p>
          </button>
          
          {/* Type Tabs */}
          {types.slice(0, 4).map((type, index) => {
            const translationKey = typeTranslationMap[type.slug] || type.slug;
            return (
              <button
                key={type.id}
                onClick={() => handleTypeChange(type.id)}
                className={`
                  h-20 md:h-40 flex items-center justify-center
                  ${index < 3 ? 'border-r border-gd-cream/[0.12]' : ''}
                  px-5
                  md:flex-1 md:px-0
                  transition-colors
                  ${selectedTypeId === type.id 
                    ? 'text-gd-cream border-b-2 border-b-gd-cream' 
                    : 'text-gd-cream/60 hover:text-gd-cream/80 cursor-pointer'
                  }
                `}
              >
                <p className="text-sm font-normal leading-normal whitespace-nowrap">
                  {t(`secondaryTabs.${translationKey}` as any)}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* App List */}
      <div className="flex flex-col w-full">
        {/* Loading State - only shown if request takes longer than 300ms */}
        {showLoading && (
          <div className="w-full text-center py-20">
            <p className="text-gd-cream/60">{tCommon('loading')}</p>
          </div>
        )}

        {/* Empty State */}
        {!showLoading && apps.length === 0 && (
          <div className="w-full text-center py-20">
            <p className="text-gd-cream/60 text-lg">{tCommon('noResults')}</p>
          </div>
        )}

        {/* App Grid */}
        {!showLoading && apps.length > 0 && (
          <div className="flex flex-wrap w-full">
            {apps.map((app, index) => {
              // Add border-b to all items except those in the last row
              const isLastRowDesktop = index >= apps.length - (apps.length % 4 || 4);
              const isLastRowMobile = index >= apps.length - (apps.length % 2 || 2);
              
              return (
                <div
                  key={app.id}
                  className={`
                    w-1/2 md:w-1/4
                    flex
                    border-r border-gd-cream/[0.12]
                    border-b border-gd-cream/[0.12]
                    md:[&:nth-child(4n)]:border-r-0
                    [&:nth-child(2n)]:border-r-0
                    md:[&:nth-child(2n)]:border-r
                    ${isLastRowMobile ? 'max-md:border-b-0' : ''}
                    ${isLastRowDesktop ? 'md:border-b-0' : ''}
                  `}
                >
                  <AppItem
                    id={app.id}
                    name={app.name}
                    description={app.description || ''}
                    thumbnailUrl={app.screens?.[0]?.imageUrl}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

