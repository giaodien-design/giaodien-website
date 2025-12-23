'use client';

import { FilterBar } from '@/components/FilterBar';
import { AppGridContainer } from '@/components/AppGridContainer';
import { ScreenGrid, ScreenWithApp } from '@/components/ScreenGrid';
import { FlowGridView, FlowPreviewData } from '@/components/FlowGridView';
import { AppWithCategory } from '@/components/TabsAndAppList';

type ViewMode = 'APP' | 'SCREEN' | 'FLOW';

interface FilterOption {
  id: string;
  name: string;
  slug?: string;
}

interface HomeContentProps {
  categories: FilterOption[];
  screenTypes: FilterOption[];
  uiElements: FilterOption[];
  flows: FilterOption[];
  viewMode: ViewMode;
  apps: AppWithCategory[];
  screens: ScreenWithApp[];
  flowPreviews: FlowPreviewData[];
}

export function HomeContent({
  categories,
  screenTypes,
  uiElements,
  flows,
  viewMode,
  apps,
  screens,
  flowPreviews
}: HomeContentProps) {
  // Render content based on view mode
  const renderContent = () => {
    switch (viewMode) {
      case 'SCREEN':
        return <ScreenGrid screens={screens} />;

      case 'FLOW':
        return <FlowGridView flows={flowPreviews} />;

      case 'APP':
      default:
        return <AppGridContainer initialApps={apps} />;
    }
  };

  return (
    <>
      <FilterBar categories={categories} screenTypes={screenTypes} uiElements={uiElements} flows={flows} />
      {renderContent()}
    </>
  );
}
