'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getApps, getAllFlows } from '@/lib/actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Fetch apps and flows when drawer opens
      const fetchData = async () => {
        const [appsResult, flowsResult] = await Promise.all([getApps(), getAllFlows()]);

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

  // Filter apps and flows based on search query
  const filteredApps = searchQuery
    ? appRecommendations.filter((app) => app.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : appRecommendations;

  const filteredFlows = searchQuery
    ? flowRecommendations.filter((flow) => flow.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : flowRecommendations;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[600px] sm:max-h-[80vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-neutral-200">
          <DialogTitle className="text-lg font-semibold text-neutral-950">{t('search')}</DialogTitle>
          {/* Search Input */}
          <div className="mt-4">
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search for apps, flows and screens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </DialogHeader>

        {/* Recommendation Container (Scrollable) */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-6 pt-4">
          {/* Apps Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-neutral-400 uppercase mb-4">Apps</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {filteredApps.map((app) => (
                <Link
                  key={app.id}
                  href={`/${locale}/app/${app.id}`}
                  onClick={onClose}
                  className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 hover:ring-2 hover:ring-neutral-300 transition-all"
                  title={app.name}
                >
                  <Image
                    src={app.icon || '/images/sample-app-thumbnail.png'}
                    alt={app.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </Link>
              ))}
              {filteredApps.length === 0 && <p className="col-span-full text-sm text-neutral-400">No apps found</p>}
            </div>
          </div>

          {/* Flows Section */}
          <div>
            <h3 className="text-sm font-medium text-neutral-400 uppercase mb-4">Flows</h3>
            <div className="flex flex-col gap-2">
              {filteredFlows.length > 0 ? (
                filteredFlows.map((flow) => (
                  <Link
                    key={flow.id}
                    href={`/${locale}/flow/${flow.id}`}
                    onClick={onClose}
                    className="px-3 py-2 rounded-md text-neutral-950 hover:bg-neutral-100 transition-colors"
                  >
                    <span className="text-sm">{flow.name}</span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-neutral-400">No flows found</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
