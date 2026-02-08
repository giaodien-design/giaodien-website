import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProfileForm } from './ProfileForm';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { checkSystemPremiumStatus } from '@/lib/access-control';
import { prisma } from '@/lib/prisma';
import { Crown, Calendar, Sparkles } from 'lucide-react';

export default async function ProfilePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  // Redirect to home if not logged in
  if (!session?.user) {
    redirect('/');
  }

  // Fetch user subscription data from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      subscriptionStatus: true,
      subscriptionEndDate: true
    }
  });

  const subscriptionStatus = user?.subscriptionStatus || 'FREE';
  const subscriptionEndDate = user?.subscriptionEndDate;
  const isPremium = subscriptionStatus === 'PREMIUM' && 
    (!subscriptionEndDate || subscriptionEndDate > new Date());

  // Get user initials for avatar fallback
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format subscription end date
  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Check if system premium is active to show pricing link
  const isSystemPremiumActive = await checkSystemPremiumStatus();

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      <Header 
        showPricingLink={isSystemPremiumActive} 
        userSubscriptionStatus={subscriptionStatus}
      />

      <main className="flex-1">
        <div className="container max-w-3xl py-10 px-4 sm:px-6">
          {/* Page Header */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>

          <Separator className="my-8" />

          {/* Avatar Section */}
          <div className="flex items-center gap-4 mb-10">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                <AvatarFallback className="text-xl font-semibold bg-neutral-100 text-neutral-700">
                  {getInitials(session.user.name)}
                </AvatarFallback>
              </Avatar>
              {isPremium && (
                <span className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 ring-2 ring-white">
                  <Crown className="w-3.5 h-3.5 text-white" />
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-neutral-900 truncate">
                  {session.user.name || 'User'}
                </h2>
                {isPremium && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold">
                    PRO
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {session.user.email}
              </p>
            </div>
          </div>

          {/* Subscription Section */}
          {isSystemPremiumActive && (
            <>
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Subscription</h3>
                <div className={`rounded-xl border-2 p-6 ${isPremium ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50' : 'border-neutral-200 bg-neutral-50'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${isPremium ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-neutral-200'}`}>
                        {isPremium ? (
                          <Crown className="w-6 h-6 text-white" />
                        ) : (
                          <Sparkles className="w-6 h-6 text-neutral-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-neutral-900">
                            {isPremium ? 'Premium Plan' : 'Starter Plan'}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isPremium ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-600'}`}>
                            {isPremium ? 'Active' : 'Current'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isPremium 
                            ? 'Full access to all premium content and features.' 
                            : 'Access to free content only.'}
                        </p>
                        {isPremium && subscriptionEndDate && (
                          <div className="flex items-center gap-1.5 mt-2 text-sm text-amber-700">
                            <Calendar className="w-4 h-4" />
                            <span>Valid until: {formatDate(subscriptionEndDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {!isPremium && (
                      <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                        <Link href={`/${locale}/pricing`}>
                          <Crown className="w-4 h-4 mr-2" />
                          Upgrade
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-8" />
            </>
          )}

          {/* Profile Form */}
          <ProfileForm
            userId={session.user.id}
            initialName={session.user.name || ''}
            initialEmail={session.user.email || ''}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
