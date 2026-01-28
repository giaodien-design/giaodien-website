import { notFound } from 'next/navigation';
import { getAppById } from '@/lib/actions';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AppDetailsBody } from '@/components/AppDetailsBody';
import { checkSystemPremiumStatus, checkAppAccess } from '@/lib/access-control';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

  // Check if system premium is active to show pricing link
  const isSystemPremiumActive = await checkSystemPremiumStatus();

  // Get user session and check app access
  const session = await auth();
  const userId = session?.user?.id;
  const { canAccess, reason } = await checkAppAccess(userId, app.isPremium ?? false);

  // Get user subscription status for header badge
  let userSubscriptionStatus: 'FREE' | 'PREMIUM' = 'FREE';
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true }
    });
    if (user?.subscriptionStatus === 'PREMIUM') {
      userSubscriptionStatus = 'PREMIUM';
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      <Header showPricingLink={isSystemPremiumActive} userSubscriptionStatus={userSubscriptionStatus} />

      <main className="flex-1">
        <AppDetailsBody 
          app={app} 
          canAccess={canAccess} 
          accessReason={reason}
          isLoggedIn={!!session?.user}
        />
      </main>

      <Footer />
    </div>
  );
}
