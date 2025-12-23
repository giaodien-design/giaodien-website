'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

interface PreviewScreen {
  id: string;
  imageUrl: string;
  title: string;
}

interface FlowApp {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  brandColor: string | null;
}

export interface FlowPreviewData {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  app: FlowApp | null;
  previewScreens: PreviewScreen[];
  totalScreenCount: number; // Total screens in flow (for badge)
}

interface FlowGridViewProps {
  flows: FlowPreviewData[];
  isLoading?: boolean;
}

export function FlowGridView({ flows, isLoading = false }: FlowGridViewProps) {
  const locale = useLocale();
  const t = useTranslations('common');

  // Loading State
  if (isLoading) {
    return (
      <div className="w-full px-6 py-8">
        <div className="flex flex-col gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-4 p-6 bg-neutral-100 rounded-2xl">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="w-[140px] h-[300px] bg-neutral-200 rounded-xl shrink-0" />
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-200 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-32" />
                  <div className="h-3 bg-neutral-100 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty State
  if (flows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 w-full">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">{t('noFlowsFound')}</h3>
          <p className="text-sm text-neutral-500">{t('tryAdjustingFilters')}</p>
        </div>
      </div>
    );
  }

  // Flow Grid
  return (
    <div className="w-full px-6 py-8">
      <div className="flex flex-col gap-8">
        {flows.map((flow, index) => {
          const previewCount = flow.previewScreens.length;
          const totalCount = flow.totalScreenCount;
          const hasMoreScreens = totalCount > previewCount;
          const remainingCount = totalCount - previewCount;

          return (
            <Link
              key={flow.id}
              href={`/${locale}/flow/${flow.id}`}
              className={`group block ${index !== flows.length - 1 ? 'pb-8 border-b border-neutral-200' : ''}`}
            >
              {/* Preview Screens Container */}
              {previewCount > 0 ? (
                <div className="flex gap-3 p-5 bg-neutral-50 rounded-2xl overflow-x-auto scrollbar-hide group-hover:bg-neutral-100 transition-colors">
                  {flow.previewScreens.map((screen) => (
                    <div
                      key={screen.id}
                      className="relative shrink-0 w-[140px] h-[300px] rounded-xl overflow-hidden ring-1 ring-neutral-200 group-hover:ring-neutral-300 transition-all"
                    >
                      <Image
                        src={screen.imageUrl}
                        alt={screen.title || flow.name}
                        fill
                        className="object-cover object-top"
                        sizes="140px"
                        unoptimized={screen.imageUrl.startsWith('http')}
                      />
                    </div>
                  ))}

                  {/* Show "+N more" indicator if there are more screens than previews */}
                  {hasMoreScreens ? (
                    <div className="flex items-center justify-center shrink-0 w-[140px] h-[300px] rounded-xl bg-neutral-200 group-hover:bg-neutral-300 transition-colors">
                      <div className="flex flex-col items-center gap-1 text-neutral-600 group-hover:text-neutral-800">
                        <span className="text-2xl font-semibold">+{remainingCount}</span>
                        <span className="text-sm font-medium">more</span>
                      </div>
                    </div>
                  ) : (
                    /* Show "View all" if exactly 4 screens (might have more) */
                    <div className="flex items-center justify-center px-4 shrink-0">
                      <div className="flex items-center gap-1 text-neutral-400 group-hover:text-neutral-600 transition-colors">
                        <span className="text-sm font-medium">View all</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 bg-neutral-50 rounded-2xl">
                  <p className="text-neutral-400 text-sm">No preview screens available</p>
                </div>
              )}

              {/* Flow Info */}
              <div className="mt-4 flex items-center gap-3">
                {/* App Icon */}
                {flow.app && (
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 ring-1 ring-neutral-200">
                    {flow.app.icon ? (
                      <Image
                        src={flow.app.icon}
                        alt={flow.app.name}
                        fill
                        className="object-cover"
                        unoptimized={flow.app.icon.startsWith('http')}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: flow.app.brandColor || '#6B7280' }}
                      >
                        {flow.app.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                )}

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-neutral-900 truncate group-hover:text-neutral-600 transition-colors">
                    {flow.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    {flow.app && <span>{flow.app.name}</span>}
                    <span>•</span>
                    <span>
                      {totalCount} screen{totalCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
