'use client';

import React from 'react';
import { TabsAndAppList, AppWithCategory } from './TabsAndAppList';
import { FlowGrid } from './FlowItem';
import { useEffect, useState } from 'react';
import { getApps } from '@/lib/actions';
import { useTranslations } from 'next-intl';

interface AppGridContainerProps {
  activeTab: 'app' | 'flow';
  onTabChange: (tab: 'app' | 'flow') => void;
}

export function AppGridContainer({ activeTab, onTabChange }: AppGridContainerProps) {
  const tApps = useTranslations('apps');
  const tCommon = useTranslations('common');
  const [apps, setApps] = useState<AppWithCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch apps data when in apps mode
    if (activeTab === 'app') {
      const fetchData = async () => {
        setLoading(true);
        const appsResult = await getApps();

        if (appsResult.success && appsResult.data) {
          setApps(appsResult.data);
        }

        setLoading(false);
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, [activeTab]);

  // Flows mode - show FlowGrid
  if (activeTab === 'flow') {
    return (
      <div className="flex flex-col w-full min-w-0 max-w-full">
        <FlowGrid />
      </div>
    );
  }

  // Apps mode - show TabsAndAppList
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 w-full">
        <p className="text-neutral-400">{tCommon('loading')}</p>
      </div>
    );
  }

  if (!apps.length) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 w-full">
        <p className="text-neutral-400">{tApps('noData')}</p>
      </div>
    );
  }

  return <TabsAndAppList initialApps={apps} activeTab={activeTab} onTabChange={onTabChange} />;
}
