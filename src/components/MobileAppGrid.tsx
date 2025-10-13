import React from "react"
import { getApps, getTypes } from "@/lib/actions"
import { getTranslations } from 'next-intl/server'
import { AppGridSimple } from './AppGridSimple'

export async function MobileAppGrid() {
  const t = await getTranslations('apps');
  
  // Fetch data from database
  const [appsResult, typesResult] = await Promise.all([
    getApps(),
    getTypes()
  ]);
  
  if (!appsResult.success || !appsResult.data) {
    return (
      <section className="flex flex-col gap-16 items-start p-20 w-full">
        <p className="text-neutral-500">{t('noData')}</p>
      </section>
    )
  }

  const types = typesResult.success && typesResult.data ? typesResult.data : [];

  return <AppGridSimple initialApps={appsResult.data} types={types} />;
}
