import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { checkSystemPremiumStatus } from '@/lib/access-control';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Crown, Check } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });

  // Check if system premium is active
  const isSystemPremiumActive = await checkSystemPremiumStatus();

  // If premium feature is disabled, redirect to home
  if (!isSystemPremiumActive) {
    redirect(`/${locale}`);
  }

  // Get current user and check subscription status
  const session = await auth();
  let userSubscriptionStatus: 'FREE' | 'PREMIUM' = 'FREE';
  
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionStatus: true, subscriptionEndDate: true }
    });
    
    if (user?.subscriptionStatus === 'PREMIUM') {
      // Check if subscription is still valid
      if (!user.subscriptionEndDate || user.subscriptionEndDate > new Date()) {
        userSubscriptionStatus = 'PREMIUM';
      }
    }
  }

  const isUserPremium = userSubscriptionStatus === 'PREMIUM';

  // Define plans with real pricing (Starter vs Premium)
  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '0',
      period: 'forever',
      description: 'Perfect for exploring and getting started',
      features: [
        'Access to free app screens',
        'Basic search functionality',
        'Community support',
        'Limited screen previews'
      ],
      cta: isUserPremium ? 'Downgrade' : 'Current Plan',
      popular: false,
      isCurrentPlan: !isUserPremium,
      href: null
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '29,000',
      period: 'month',
      description: 'Full access to all premium content',
      features: [
        'Access to ALL app screens',
        'Premium app collections',
        'Advanced search & filters',
        'Download high-res screens',
        'Priority support',
        'Early access to new features'
      ],
      cta: isUserPremium ? 'Current Plan' : 'Upgrade Now',
      popular: true,
      isCurrentPlan: isUserPremium,
      href: isUserPremium ? null : `/${locale}/checkout?type=premium`
    }
  ];

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col w-full">
      <Header showPricingLink={isSystemPremiumActive} userSubscriptionStatus={userSubscriptionStatus} />

      <div className="flex-1 overflow-y-auto">
        {/* Pricing Content */}
        <div className="w-full px-4 sm:px-6 py-8 sm:py-12">
          {/* Header Section */}
          <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-5xl font-semibold text-primary-foreground mb-3 sm:mb-4">
              {t('title')}
            </h1>
            <p className="text-base sm:text-xl text-secondary-foreground max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
            
            {/* User status indicator */}
            {session?.user && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-bg border border-border-new">
                {isUserPremium ? (
                  <>
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-primary-foreground">
                      You&apos;re on Premium
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-secondary-foreground">
                    Logged in as {session.user.email}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Pricing Cards - 2 column layout */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border-2 p-6 sm:p-8 ${
                  plan.popular
                    ? 'border-primary-foreground bg-secondary-bg shadow-xl md:scale-105'
                    : 'border-border-new bg-primary-bg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-xs sm:text-sm font-medium uppercase flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" />
                    {t('popular')}
                  </div>
                )}

                {/* Current plan badge */}
                {plan.isCurrentPlan && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  </div>
                )}

                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-primary-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm sm:text-base text-secondary-foreground">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6 sm:mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl sm:text-5xl font-bold text-primary-foreground">
                      {plan.price === '0' ? t('free') : `₫${plan.price}`}
                    </span>
                    {plan.price !== '0' && (
                      <span className="ml-2 text-sm sm:text-base text-secondary-foreground">
                        / {plan.period}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className={`w-5 h-5 mr-2 sm:mr-3 mt-0.5 flex-shrink-0 ${
                          plan.popular ? 'text-amber-500' : 'text-primary-foreground'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm sm:text-base text-primary-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.href && !plan.isCurrentPlan ? (
                  <Button 
                    asChild 
                    variant={plan.popular ? 'default' : 'outline'} 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0' : ''}`}
                  >
                    <Link href={plan.href}>
                      {plan.popular && <Crown className="w-4 h-4 mr-2" />}
                      {plan.cta}
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    variant={plan.popular ? 'default' : 'outline'} 
                    className="w-full" 
                    disabled={plan.isCurrentPlan}
                  >
                    {plan.isCurrentPlan && <Check className="w-4 h-4 mr-2" />}
                    {plan.cta}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary-foreground text-center mb-8 sm:mb-12">
              {t('faq.title')}
            </h2>
            <div className="space-y-6">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="border-b border-border-new pb-6">
                  <h3 className="text-lg sm:text-xl font-medium text-primary-foreground mb-2 sm:mb-3">
                    {t(`faq.questions.${idx}.question`)}
                  </h3>
                  <p className="text-sm sm:text-base text-secondary-foreground">
                    {t(`faq.questions.${idx}.answer`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
