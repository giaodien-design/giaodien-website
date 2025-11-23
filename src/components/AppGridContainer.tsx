'use client';

import React from "react"
import { TabsAndAppList } from './TabsAndAppList'
import { FlowGrid } from './FlowItem'
import { useEffect, useState } from "react";
import { getApps, getTypes } from "@/lib/actions"
import { useTranslations } from 'next-intl'

type AppWithScreens = {
  id: string;
  name: string;
  description: string | null;
  screens?: Array<{
    id: string;
    imageUrl: string;
  }>;
};

type Type = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

interface AppGridContainerProps {
  activeTab: 'app' | 'flow';
  onTabChange: (tab: 'app' | 'flow') => void;
}

export function AppGridContainer({ activeTab, onTabChange }: AppGridContainerProps) {
  const tApps = useTranslations('apps');
  const tCommon = useTranslations('common');
  const [apps, setApps] = useState<AppWithScreens[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Only fetch apps data when in apps mode
    if (activeTab === 'app') {
      const fetchData = async () => {
        setLoading(true);
        const [appsResult, typesResult] = await Promise.all([
          getApps(),
          getTypes()
        ]);
        
        if (appsResult.success && appsResult.data) {
          setApps(appsResult.data);
        }
        
        if (typesResult.success && typesResult.data) {
          setTypes(typesResult.data);
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
      <div className="flex flex-col w-full bg-background min-w-0 max-w-full">
        <FlowGrid />
      </div>
    );
  }
  
  // Apps mode - show TabsAndAppList
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 w-full bg-background">
        <p className="text-muted-foreground">{tCommon('loading')}</p>
      </div>
    );
  }
  
  if (!apps.length) {
    return (
      <div className="flex flex-col items-center justify-center p-20 w-full bg-background">
        <p className="text-muted-foreground">{tApps('noData')}</p>
      </div>
    );
  }

  return (
    <TabsAndAppList 
      initialApps={apps} 
      types={types}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
}

