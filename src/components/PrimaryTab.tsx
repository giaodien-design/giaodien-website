'use client';

import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PrimaryTabProps {
  activeTab: 'app' | 'flow';
  onTabChange: (tab: 'app' | 'flow') => void;
  direction?: 'vertical' | 'horizontal';
  isMobileFloating?: boolean;
}

export function PrimaryTab({
  activeTab,
  onTabChange,
  direction = 'horizontal',
  isMobileFloating = false
}: PrimaryTabProps) {
  const t = useTranslations('categories');

  const isVertical = direction === 'vertical';

  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'app' | 'flow')}>
      <TabsList className={isVertical ? 'flex-col h-auto' : ''}>
        <TabsTrigger value="app">{t('primaryTabs.app')}</TabsTrigger>
        <TabsTrigger value="flow">{t('primaryTabs.flow')}</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
