'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getApps, getAllFlows } from '@/lib/actions';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

type AppData = {
  id: string;
  name: string;
  icon: string | null;
};

type FlowData = {
  id: string;
  name: string;
};

export function SearchDrawer({ isOpen, onClose, searchInputRef }: SearchDrawerProps) {
  const t = useTranslations('header');
  const locale = useLocale();
  const [appRecommendations, setAppRecommendations] = useState<AppData[]>([]);
  const [flowRecommendations, setFlowRecommendations] = useState<FlowData[]>([]);
  
  useEffect(() => {
    if (isOpen) {
      // Fetch apps and flows when drawer opens
      const fetchData = async () => {
        const [appsResult, flowsResult] = await Promise.all([
          getApps(),
          getAllFlows()
        ]);
        
        if (appsResult.success && appsResult.data) {
          setAppRecommendations(appsResult.data.slice(0, 8));
        }
        
        if (flowsResult.success && flowsResult.data) {
          setFlowRecommendations(flowsResult.data.slice(0, 6));
        }
      };
      
      fetchData();
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed h-screen w-screen bg-tertiary-fg p-0 sm:p-6 z-[100] grid place-items-end sm:place-items-center">
      {/* Search Drawer Inner Container */}
      <div className="w-full max-w-[800px] max-h-[600px] sm:max-h-[800px] bg-primary-bg rounded-t-lg rounded-b-none sm:rounded-lg p-0 overflow-hidden flex flex-col relative">
        {/* Close Button (Absolute Top-Right) */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 rounded-bl-lg bg-tertiary-bg text-primary-fg leading-none uppercase pt-3 pr-6 pb-1 pl-1 sm:pt-4 sm:pr-9 sm:pb-3 sm:pl-2 text-sm hover:bg-primary-fg hover:text-tertiary-bg transition-colors z-20"
          aria-label={t('close')}
        >
          {t('close')}
        </button>

        {/* Search Field (Sticky Top) */}
        <div className="sticky top-0 z-10 p-5 bg-primary-bg">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for apps, flows and screens..."
            className="w-full bg-transparent border-none outline-none text-sm leading-relaxed text-primary-fg placeholder:text-secondary-fg"
          />
        </div>

        {/* Recommendation Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Apps Section */}
          <div className="flex flex-row gap-3 px-5 py-3">
            <div className="w-[50px] pt-2">
              <span className="text-xs leading-none uppercase text-secondary-fg">Apps</span>
            </div>
            <div className="flex-1 grid grid-cols-4 sm:grid-cols-8 gap-3">
              {appRecommendations.map((app) => (
                <Link
                  key={app.id}
                  href={`/${locale}/app/${app.id}`}
                  className="relative aspect-square rounded-lg overflow-hidden bg-secondary-bg"
                  title={app.name}
                >
                  <Image
                    src={app.icon || "/images/sample-app-thumbnail.png"}
                    alt={app.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Flows Section */}
          <div className="flex flex-row gap-3 px-5 py-3">
            <div className="w-[50px] pt-2">
              <span className="text-xs leading-none uppercase text-secondary-fg">Flows</span>
            </div>
            <div className="flex-1 grid grid-cols-1 gap-3">
              {flowRecommendations.length > 0 ? (
                flowRecommendations.map((flow) => (
                  <Link
                    key={flow.id}
                    href={`/${locale}/flow/${flow.id}`}
                    className="p-2 rounded-lg text-primary-fg bg-transparent hover:bg-secondary-bg transition-colors"
                  >
                    <span className="text-sm leading-none uppercase">{flow.name}</span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-secondary-fg p-2">No flows available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

