import { notFound } from 'next/navigation';
import { getAppById } from '@/lib/actions';
import { getTranslations } from 'next-intl/server';
import { TopBar } from '@/components/TopBar';
import { Header } from '@/components/Header';
import { ScreenItem } from '@/components/ScreenItem';
import { Footer } from '@/components/Footer';

interface PageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function AppDetailPage({ params }: PageProps) {
  const { id } = params;
  const t = await getTranslations('appDetail');
  const tCommon = await getTranslations('common');

  // Fetch app data
  const result = await getAppById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const app = result.data;
  const screens = app.screens || [];

  return (
    <div className="min-h-screen bg-gd-dark flex flex-col">
      <TopBar />
      <Header />

      {/* App Detail Content */}
      <div className="flex flex-col w-full">
        {/* App Info Section */}
        <div className="flex flex-col w-full px-20 max-md:px-5 py-20 border-b border-gd-cream/[0.12]">
          <h1 className="text-gd-cream text-[32px] font-normal leading-[38px] mb-[12px]">
            {app.name}
          </h1>
          <p className="text-gd-cream/60 text-base font-normal leading-[19px]">
            {app.description || ''}
          </p>
        </div>

        {/* Screens Section */}
        {screens.length === 0 ? (
          // Empty State
          <div className="w-full text-center py-20 border-b border-gd-cream/[0.12]">
            <p className="text-gd-cream/60 text-lg">{t('noScreenYet')}</p>
          </div>
        ) : (
          // Screen Grid
          <div className="flex flex-wrap w-full border-b border-gd-cream/[0.12]">
            {screens.map((screen, index) => {
              const isLastRowDesktop = index >= screens.length - (screens.length % 4 || 4);
              const isLastRowMobile = index >= screens.length - (screens.length % 2 || 2);

              return (
                <div
                  key={screen.id}
                  className={`
                    w-1/2 md:w-1/4
                    border-r border-gd-cream/[0.12]
                    border-b border-gd-cream/[0.12]
                    md:[&:nth-child(4n)]:border-r-0
                    [&:nth-child(2n)]:border-r-0
                    md:[&:nth-child(2n)]:border-r
                    ${isLastRowMobile ? 'max-md:border-b-0' : ''}
                    ${isLastRowDesktop ? 'md:border-b-0' : ''}
                  `}
                >
                  <ScreenItem
                    imageUrl={screen.imageUrl}
                    title={screen.title}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

