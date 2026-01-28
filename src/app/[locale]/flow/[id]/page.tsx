import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getFlowById } from '@/lib/actions';
import { checkSystemPremiumStatus } from '@/lib/access-control';
import { ChevronRight, ArrowLeft, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function FlowDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const t = await getTranslations('appDetail');

  // Fetch flow data from database
  const result = await getFlowById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const flow = result.data;
  const screens = flow.screens || [];
  const app = flow.app;

  // Check if system premium is active to show pricing link
  const isSystemPremiumActive = await checkSystemPremiumStatus();

  // Helper function to validate image URLs
  const getValidImageUrl = (url: string | null | undefined, fallback: string): string => {
    if (!url) return fallback;
    if (url.startsWith('/')) return url;

    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'giaodien-website-image.s3.ap-southeast-1.amazonaws.com') {
        return url;
      }
      return fallback;
    } catch {
      return fallback;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      <Header showPricingLink={isSystemPremiumActive} />

      <main className="flex-1">
        {/* Hero Header Section */}
        <section className="px-4 sm:px-8 lg:px-12 pt-6 pb-10 sm:pt-8 sm:pb-14">
          <div className="max-w-[1800px] mx-auto">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
              <Link 
                href={`/${locale}`} 
                className="hover:text-neutral-900 transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              {app ? (
                <>
                  <Link 
                    href={`/${locale}/app/${app.id}`} 
                    className="hover:text-neutral-900 transition-colors"
                  >
                    {app.name}
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                </>
              ) : null}
              <span className="text-neutral-900 font-medium">{flow.name}</span>
            </nav>

            {/* Back Button */}
            {app && (
              <div className="mb-6">
                <Button asChild variant="ghost" className="gap-2 -ml-3 text-muted-foreground hover:text-neutral-900">
                  <Link href={`/${locale}/app/${app.id}`}>
                    <ArrowLeft className="h-4 w-4" />
                    Back to {app.name}
                  </Link>
                </Button>
              </div>
            )}

            {/* App Context + Flow Info */}
            <div className="flex flex-col gap-6">
              {/* App Context */}
              {app && (
                <Link 
                  href={`/${locale}/app/${app.id}`}
                  className="flex items-center gap-3 group w-fit"
                >
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-100 ring-1 ring-neutral-200 flex-shrink-0">
                    <Image
                      src={getValidImageUrl(app.icon, '/images/sample-app-thumbnail.png')}
                      alt={app.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-neutral-900 transition-colors">
                    {app.name}
                  </span>
                </Link>
              )}

              {/* Flow Title */}
              <div className="flex flex-col gap-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight">
                  {flow.name}
                </h1>

                {/* Description */}
                {flow.description && (
                  <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                    {flow.description}
                  </p>
                )}
              </div>

              {/* Meta Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-sm font-medium">
                  <Layers className="h-3.5 w-3.5" />
                  {screens.length} screen{screens.length !== 1 ? 's' : ''}
                </div>
                {flow.updatedAt && (
                  <span className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-sm font-medium">
                    Updated {new Intl.DateTimeFormat('en', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }).format(new Date(flow.updatedAt))}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Screens Content */}
        <section className="px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
          <div className="max-w-[1800px] mx-auto">
            {screens.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-neutral-50 py-20 px-6 text-center">
                <Layers className="h-12 w-12 text-neutral-300 mb-4" />
                <p className="text-base text-muted-foreground">{t('noScreenYet')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 sm:gap-8 lg:gap-10">
                {screens.map((screen, index) => (
                  <ScreenCard
                    key={screen.id}
                    imageUrl={getValidImageUrl(screen.imageUrl, '/images/sample-img.png')}
                    title={screen.title || `Screen ${index + 1}`}
                    order={index + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ScreenCard({ imageUrl, title, order }: { imageUrl: string; title: string; order: number }) {
  return (
    <div className="group flex flex-col gap-4">
      {/* Card Container - Matching Gallery Style */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50 transition-all duration-300 ease-out group-hover:shadow-lg group-hover:shadow-neutral-200/50 group-hover:-translate-y-1">
        {/* Order Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div className="w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full border border-neutral-200/50 shadow-sm">
            <span className="text-xs font-semibold text-neutral-700">{order}</span>
          </div>
        </div>

        {/* Screen Image with Padding */}
        <div className="relative flex items-center justify-center px-6 py-8 sm:px-8 sm:py-10">
          <div className="relative w-full max-w-[160px] aspect-[9/19.5] rounded-[20px] overflow-hidden shadow-xl shadow-neutral-900/10 ring-1 ring-neutral-900/5">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 140px, 160px"
            />
          </div>
        </div>
      </div>

      {/* Screen Title - Subtle Typography */}
      {title && (
        <p className="text-sm font-medium text-muted-foreground truncate px-1">
          {title}
        </p>
      )}
    </div>
  );
}
