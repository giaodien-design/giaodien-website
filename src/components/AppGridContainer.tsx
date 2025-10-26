import React from "react"
import { getApps, getTypes } from "@/lib/actions"
import { getTranslations } from 'next-intl/server'
import { TabsAndAppList } from './TabsAndAppList'

export async function AppGridContainer() {
  const t = await getTranslations('apps');
  
  // Fetch data from database
  const [appsResult, typesResult] = await Promise.all([
    getApps(),
    getTypes()
  ]);
  
  if (!appsResult.success || !appsResult.data) {
    return (
      <div className="flex flex-col items-center justify-center p-20 w-full">
        <p className="text-gd-cream/60">{t('noData')}</p>
      </div>
    )
  }

  const types = typesResult.success && typesResult.data ? typesResult.data : [];

  return <TabsAndAppList initialApps={appsResult.data} types={types} />;
}

