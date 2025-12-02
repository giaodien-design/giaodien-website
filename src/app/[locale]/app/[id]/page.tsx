import { notFound } from 'next/navigation';
import { getAppById } from '@/lib/actions';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AppDetailsBody } from '@/components/AppDetailsBody';

interface PageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function AppDetailPage({ params }: PageProps) {
  // Await params in Next.js 15+
  const { id } = await params;
  
  // Fetch app data
  const result = await getAppById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const app = result.data;

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col w-full">
      <Header hideTabs={true} />
      
      <div className="flex-1 overflow-y-auto">
        <AppDetailsBody app={app} />
        <Footer />
      </div>
    </div>
  );
}
