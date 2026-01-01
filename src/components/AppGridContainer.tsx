'use client';

import React from 'react';
import { TabsAndAppList, AppWithCategory } from './TabsAndAppList';
import { EmptyState } from './EmptyState';

interface AppGridContainerProps {
  initialApps: AppWithCategory[];
}

export function AppGridContainer({ initialApps }: AppGridContainerProps) {
  // Empty State: No apps match filters
  if (initialApps.length === 0) {
    return <EmptyState />;
  }

  // Render App Grid
  return <TabsAndAppList initialApps={initialApps} />;
}
