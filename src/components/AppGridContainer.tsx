'use client';

import React from "react"
import { TabsAndAppList } from './TabsAndAppList'
import { FlowGrid } from './FlowItem'
import { useEffect, useState } from "react";
import { getApps, getCategories } from "@/lib/actions"
import { useTranslations } from 'next-intl'

type AppWithScreens = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  thumbnailUrl: string | null;
  screens?: Array<{
    id: string;
    imageUrl: string;
  }>;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

interface AppGridContainerProps {
  activeTab: 'app' | 'flow';
  onTabChange: (tab: 'app' | 'flow') => void;
}

export function AppGridContainer({ activeTab, onTabChange }: AppGridContainerProps) {
  const tApps = useTranslations('apps');
  const tCommon = useTranslations('common');
  const [apps, setApps] = useState<AppWithScreens[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Only fetch apps data when in apps mode
    if (activeTab === 'app') {
      const fetchData = async () => {
        setLoading(true);
        const [appsResult, categoriesResult] = await Promise.all([
          getApps(),
          getCategories()
        ]);
        
        if (appsResult.success && appsResult.data) {
          setApps(appsResult.data);
        }
        
        if (categoriesResult.success && categoriesResult.data) {
          setCategories(categoriesResult.data);
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
      <div className="flex flex-col w-full bg-primary-bg min-w-0 max-w-full">
        <FlowGrid />
      </div>
    );
  }
  
  // Apps mode - show TabsAndAppList
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 w-full bg-primary-bg">
        <p className="text-secondary-fg">{tCommon('loading')}</p>
      </div>
    );
  }
  
  if (!apps.length) {
    return (
      <div className="flex flex-col items-center justify-center p-20 w-full bg-primary-bg">
        <p className="text-secondary-fg">{tApps('noData')}</p>
      </div>
    );
  }

  return (
    <TabsAndAppList 
      initialApps={apps} 
      categories={categories}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
}

