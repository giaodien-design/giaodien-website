'use client';

import { useTranslations } from 'next-intl';

export default function TestPage() {
  const tTest = useTranslations('test');
  const tHeader = useTranslations('header');
  const tHero = useTranslations('hero');
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{tTest('pageTitle')}</h1>
      <div className="space-y-2">
        <p>{tTest('headerSearch')} {tHeader('search')}</p>
        <p>{tTest('headerLogin')} {tHeader('login')}</p>
        <p>{tTest('heroTitle')} {tHero('title')}</p>
        <p>{tTest('heroSubtitle')} {tHero('subtitle')}</p>
      </div>
    </div>
  );
}

