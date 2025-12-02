'use client';

import { useTranslations } from 'next-intl';

interface PrimaryTabItemProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  isMobileFloating?: boolean;
}

function PrimaryTabItem({ label, selected, onClick, isMobileFloating = false }: PrimaryTabItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center shrink-0 p-2 text-xs leading-none uppercase ${
        selected 
          ? 'bg-secondary-bg text-primary-fg' 
          : 'bg-transparent text-primary-fg'
      } ${
        isMobileFloating 
          ? 'rounded-t-lg rounded-b-lg' 
          : 'rounded-t-none rounded-b-lg'
      }`}
    >
      <span className="whitespace-pre text-nowrap">{label}</span>
    </button>
  );
}

interface PrimaryTabProps {
  activeTab: 'app' | 'flow';
  onTabChange: (tab: 'app' | 'flow') => void;
  direction?: 'vertical' | 'horizontal';
  isMobileFloating?: boolean;
}

export function PrimaryTab({ activeTab, onTabChange, direction = 'horizontal', isMobileFloating = false }: PrimaryTabProps) {
  const t = useTranslations('categories');
  
  const isVertical = direction === 'vertical';
  
  return (
    <div 
      className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-start gap-0`}
    >
      <PrimaryTabItem
        label={t('primaryTabs.app')}
        selected={activeTab === 'app'}
        onClick={() => onTabChange('app')}
        isMobileFloating={isMobileFloating}
      />
      <PrimaryTabItem
        label={t('primaryTabs.flow')}
        selected={activeTab === 'flow'}
        onClick={() => onTabChange('flow')}
        isMobileFloating={isMobileFloating}
      />
    </div>
  );
}

