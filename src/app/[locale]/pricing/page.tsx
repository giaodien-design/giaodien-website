import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function PricingPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });

  const plans = [
    {
      name: 'Free',
      nameKey: 'plans.free.name',
      price: '0',
      period: 'month',
      periodKey: 'plans.free.period',
      descriptionKey: 'plans.free.description',
      features: [
        'plans.free.features.0',
        'plans.free.features.1',
        'plans.free.features.2',
        'plans.free.features.3',
      ],
      cta: 'plans.free.cta',
      popular: false,
    },
    {
      name: 'Pro',
      nameKey: 'plans.pro.name',
      price: '299,000',
      period: 'month',
      periodKey: 'plans.pro.period',
      descriptionKey: 'plans.pro.description',
      features: [
        'plans.pro.features.0',
        'plans.pro.features.1',
        'plans.pro.features.2',
        'plans.pro.features.3',
        'plans.pro.features.4',
        'plans.pro.features.5',
      ],
      cta: 'plans.pro.cta',
      popular: true,
    },
    {
      name: 'Enterprise',
      nameKey: 'plans.enterprise.name',
      price: null,
      priceText: 'plans.enterprise.priceText',
      periodKey: 'plans.enterprise.period',
      descriptionKey: 'plans.enterprise.description',
      features: [
        'plans.enterprise.features.0',
        'plans.enterprise.features.1',
        'plans.enterprise.features.2',
        'plans.enterprise.features.3',
        'plans.enterprise.features.4',
        'plans.enterprise.features.5',
      ],
      cta: 'plans.enterprise.cta',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-primary-bg flex flex-col w-full">
      <Header hideTabs={true} />
      
      <div className="flex-1 overflow-y-auto">
        {/* Pricing Content */}
        <div className="w-full px-4 sm:px-6 py-8 sm:py-12">
          {/* Header Section */}
          <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-5xl font-semibold text-primary-fg mb-3 sm:mb-4">
              {t('title')}
            </h1>
            <p className="text-base sm:text-xl text-secondary-fg max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border-2 p-6 sm:p-8 ${
                    plan.popular
                      ? 'border-primary-fg bg-secondary-bg shadow-xl scale-105'
                      : 'border-border-new bg-primary-bg'
                  }`}
                >
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 bg-primary-fg text-primary-bg rounded-full text-xs sm:text-sm font-medium uppercase">
                    {t('popular')}
                  </div>
                )}

                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-semibold text-primary-fg mb-2">
                    {t(plan.nameKey)}
                  </h3>
                  <p className="text-sm sm:text-base text-secondary-fg">
                    {t(plan.descriptionKey)}
                  </p>
                </div>

                <div className="mb-6 sm:mb-8">
                  {plan.price !== null ? (
                    <div className="flex items-baseline">
                      <span className="text-4xl sm:text-5xl font-bold text-primary-fg">
                        {plan.price === '0' ? t('free') : `₫${plan.price}`}
                      </span>
                      {plan.price !== '0' && (
                        <span className="ml-2 text-sm sm:text-base text-secondary-fg">
                          / {t(plan.periodKey)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-2xl sm:text-3xl font-bold text-primary-fg">
                      {t(plan.priceText!)}
                    </div>
                  )}
                </div>

                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
                  {plan.features.map((featureKey, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-primary-fg mr-2 sm:mr-3 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm sm:text-base text-primary-fg">
                        {t(featureKey)}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-primary-fg text-primary-bg hover:opacity-90'
                      : 'bg-secondary-bg text-primary-fg border-2 border-border-new hover:bg-tertiary-bg'
                  }`}
                >
                  {t(plan.cta)}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold text-primary-fg text-center mb-8 sm:mb-12">
              {t('faq.title')}
            </h2>
            <div className="space-y-6">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="border-b border-border-new pb-6"
                >
                  <h3 className="text-lg sm:text-xl font-medium text-primary-fg mb-2 sm:mb-3">
                    {t(`faq.questions.${idx}.question`)}
                  </h3>
                  <p className="text-sm sm:text-base text-secondary-fg">
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

