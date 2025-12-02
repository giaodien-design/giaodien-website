import { getApps } from "@/lib/actions";
import { getTranslations } from "next-intl/server";
import { AppGrid } from "@/components/AppGrid";
import { Header } from "@/components/Header";
import { Suspense } from "react";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const { q, type } = await searchParams;
  
  const t = await getTranslations({ locale, namespace: 'search' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  // Fetch apps with search and filter
  const appsResult = await getApps({ search: q, categoryId: type });
  const apps = appsResult.success && appsResult.data ? appsResult.data : [];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-10 lg:px-20 py-8 md:py-12 lg:py-16">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-2">
            {t('pageTitle')}
          </h1>
          {q && (
            <p className="text-lg text-neutral-600">
              {t('searchFor')}: <span className="font-medium text-black">{q}</span>
            </p>
          )}
        </div>

        {/* Results Count */}
        {apps.length > 0 && (
          <p className="text-sm text-neutral-600 mb-6">
            {t('foundResults', { count: apps.length })}
          </p>
        )}

        {/* Results */}
        <Suspense fallback={<div className="text-center py-12">{tCommon('loading')}</div>}>
          {apps.length > 0 ? (
            <AppGrid apps={apps} />
          ) : (
            <div className="text-center py-12 md:py-20">
              <p className="text-xl md:text-2xl text-neutral-700 mb-2">
                {t('noResults')}
              </p>
              <p className="text-neutral-500">{t('tryDifferent')}</p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

