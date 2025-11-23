import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface PageProps {
  params: {
    locale: string;
    id: string;
  };
}

// Dummy flow data for now
const dummyFlows: Record<string, { id: string; name: string; description?: string }> = {
  '1': { id: '1', name: 'Onboarding', description: 'User onboarding flow' },
  '2': { id: '2', name: 'Login & Signup', description: 'Authentication flow' },
  '3': { id: '3', name: 'Booking', description: 'Booking and reservation flow' },
  '4': { id: '4', name: 'Filtering', description: 'Search and filter flow' },
};

export default async function FlowDetailPage({ params }: PageProps) {
  const { id } = params;
  const t = await getTranslations('appDetail');
  const tCommon = await getTranslations('common');

  // Get flow data
  const flow = dummyFlows[id];

  if (!flow) {
    notFound();
  }

  // Use demo images for now (10 screens)
  const demoScreens = Array.from({ length: 10 }, (_, i) => ({
    id: `demo-${i + 1}`,
    imageUrl: '/images/sample-img.png',
  }));

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop: Header fixed on left, Body scrollable on right */}
      <div className="hidden sm:flex w-full">
        <Header hideTabs={true} />
        <div className="flex-1 overflow-y-auto min-w-0 w-full">
          {/* Flow Header Section */}
          <div className="flex items-center px-6 py-5 border-b border-border">
            <h1 className="text-foreground text-base font-normal leading-[1.5] w-full">
              {flow.name}
            </h1>
          </div>

          {/* Screen Grid - 4 items per row on desktop */}
          {demoScreens.length === 0 ? (
            <div className="w-full text-center py-20 border-b border-border">
              <p className="text-muted-foreground text-base">{t('noScreenYet')}</p>
            </div>
          ) : (
            <div className="flex flex-col w-full">
              {Array.from({ length: Math.ceil(demoScreens.length / 4) }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-2 md:grid-cols-4 w-full border-b border-border"
                >
                  {demoScreens.slice(rowIndex * 4, rowIndex * 4 + 4).map((screen, colIndex) => (
                    <div
                      key={screen.id}
                      className={`flex flex-col items-center justify-center px-6 py-8 border-r border-border ${colIndex === 1 ? 'border-r-0' : ''} md:${colIndex === 3 ? 'border-r-0' : 'border-r'}`}
                    >
                      <div className="aspect-[249/540] w-full relative rounded-[10px] overflow-hidden">
                        <Image
                          src={screen.imageUrl}
                          alt={`${flow.name} - Screen ${rowIndex * 4 + colIndex + 1}`}
                          fill
                          className="object-cover object-center rounded-[10px]"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          <Footer />
        </div>
      </div>

      {/* Mobile/Tablet: Header on top, Body below */}
      <div className="flex sm:hidden flex-col w-full">
        <Header hideTabs={true} />
        <div className="flex-1 overflow-y-auto">
          {/* Flow Header Section */}
          <div className="flex items-center p-5 border-b border-border">
            <h1 className="text-foreground text-base font-normal leading-[1.5] w-full">
              {flow.name}
            </h1>
          </div>

          {/* Screen Grid - 2 items per row on mobile */}
          {demoScreens.length === 0 ? (
            <div className="w-full text-center py-20 border-b border-border">
              <p className="text-muted-foreground text-base">{t('noScreenYet')}</p>
            </div>
          ) : (
            <div className="flex flex-col w-full">
              {Array.from({ length: Math.ceil(demoScreens.length / 2) }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className="grid grid-cols-2 w-full border-b border-border"
                >
                  {demoScreens.slice(rowIndex * 2, rowIndex * 2 + 2).map((screen, colIndex) => (
                    <div
                      key={screen.id}
                      className={`flex flex-col items-center justify-center px-6 py-8 border-r border-border ${colIndex === 1 ? 'border-r-0' : ''}`}
                    >
                      <div className="aspect-[249/540] w-full relative rounded-[10px] overflow-hidden">
                        <Image
                          src={screen.imageUrl}
                          alt={`${flow.name} - Screen ${rowIndex * 2 + colIndex + 1}`}
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
          )}

          <Footer />
        </div>
      </div>
    </div>
  );
}

