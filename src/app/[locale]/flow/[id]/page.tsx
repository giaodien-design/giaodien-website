import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getFlowById } from '@/lib/actions';

interface PageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function FlowDetailPage({ params }: PageProps) {
  // Await params in Next.js 15+
  const { id } = await params;
  const t = await getTranslations('appDetail');
  const tCommon = await getTranslations('common');

  // Fetch flow data from database
  const result = await getFlowById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const flow = result.data;
  const screens = flow.screens || [];

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col w-full">
      <Header hideTabs={true} />
      
      <div className="flex-1 overflow-y-auto">
        {/* Flow Header Section */}
        <div className="flex items-center px-4 sm:px-6 py-5 border-b border-border-new">
          <h1 className="text-primary-fg text-base font-normal leading-[1.5] w-full">
            {flow.name}
          </h1>
        </div>

        {/* Screen Grid */}
        {screens.length === 0 ? (
          <div className="w-full text-center py-20 border-b border-border-new">
            <p className="text-secondary-fg text-base">{t('noScreenYet')}</p>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            {/* Desktop: 4 columns */}
            <div className="hidden md:block">
              {Array.from({ length: Math.ceil(screens.length / 4) }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-4 w-full border-b border-border-new"
                >
                  {screens.slice(rowIndex * 4, rowIndex * 4 + 4).map((screen, colIndex) => (
                    <div
                      key={screen.id}
                      className={`flex flex-col items-center justify-center px-6 py-8 ${colIndex < 3 ? 'border-r border-border-new' : ''}`}
                    >
                      <div className="aspect-[249/540] w-full relative rounded-[10px] overflow-hidden">
                        <Image
                          src={screen.imageUrl}
                          alt={screen.title || `${flow.name} - Screen ${rowIndex * 4 + colIndex + 1}`}
                          fill
                          className="object-cover object-center rounded-[10px]"
                          sizes="25vw"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Mobile: 2 columns */}
            <div className="block md:hidden">
              {Array.from({ length: Math.ceil(screens.length / 2) }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-2 w-full border-b border-border-new"
                >
                  {screens.slice(rowIndex * 2, rowIndex * 2 + 2).map((screen, colIndex) => (
                    <div
                      key={screen.id}
                      className={`flex flex-col items-center justify-center px-6 py-8 ${colIndex === 0 ? 'border-r border-border-new' : ''}`}
                    >
                      <div className="aspect-[249/540] w-full relative rounded-[10px] overflow-hidden">
                        <Image
                          src={screen.imageUrl}
                          alt={screen.title || `${flow.name} - Screen ${rowIndex * 2 + colIndex + 1}`}
                          fill
                          className="object-cover object-center rounded-[10px]"
                          sizes="50vw"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

