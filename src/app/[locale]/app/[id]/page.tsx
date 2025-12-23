import { notFound } from 'next/navigation';
import { getAppById } from '@/lib/actions';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AppDetailsBody } from '@/components/AppDetailsBody';

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
  searchParams: Promise<{ version?: string }>;
}

export default async function AppDetailPage({ params, searchParams }: PageProps) {
  // Await params in Next.js 15+
  const { id } = await params;
  const { version } = await searchParams;

  // Fetch app data with optional version filter
  const result = await getAppById(id, version);

  if (!result.success || !result.data) {
    notFound();
  }

  const app = result.data;

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col w-full">
      <Header />

      <div className="flex-1 overflow-y-auto">
        <AppDetailsBody app={app} />
        <Footer />
      </div>
    </div>
  );
}
