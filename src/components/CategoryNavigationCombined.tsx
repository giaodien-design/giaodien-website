"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from 'next-intl'

type Type = {
  id: string;
  name: string;
  slug: string;
};

interface CategoryNavigationCombinedProps {
  types: Type[];
  onTypeChange: (typeId: string | null) => void;
}

export function CategoryNavigationCombined({ types, onTypeChange }: CategoryNavigationCombinedProps) {
  const t = useTranslations('categories');
  const [activePrimary, setActivePrimary] = useState("app")
  const [activeSecondary, setActiveSecondary] = useState<string | null>(null)

  const primaryTabs = [
    { id: "app", label: t('primaryTabs.app') },
    { id: "screen", label: t('primaryTabs.screen') }
  ]

  // Map types to secondary tabs
  const secondaryTabs = types.map((type) => ({
    id: type.id,
    slug: type.slug,
    label: type.name
  }));

  const handleSecondaryClick = (tabId: string) => {
    // If clicking the same tab, deselect it (show all)
    if (activeSecondary === tabId) {
      setActiveSecondary(null);
      onTypeChange(null);
    } else {
      setActiveSecondary(tabId);
      onTypeChange(tabId);
    }
  };

  const handleShowAll = () => {
    setActiveSecondary(null);
    onTypeChange(null);
  };

  return (
    <div className="flex flex-col gap-8 md:gap-12 lg:gap-16 items-start px-4 md:px-10 lg:px-20 w-full">
      {/* Combined Primary and Secondary Tabs */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full">
        {/* Primary Tabs */}
        <div className="flex bg-neutral-100 rounded-xl p-[3px] shrink-0 self-start">
          {primaryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePrimary(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center px-4 pt-1.5 pb-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out border-t border-l border-r border-b-2 active:scale-95 touch-manipulation",
                activePrimary === tab.id
                  ? "bg-white border-neutral-200 text-neutral-900"
                  : "text-neutral-400 border-transparent hover:text-neutral-900 active:text-neutral-900"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Divider - Hidden on mobile */}
        <div className="hidden md:block h-[29px] w-px bg-neutral-300 shrink-0" />
        
        {/* Secondary Tabs */}
        <div className="flex-1 w-full overflow-x-auto overflow-y-hidden scrollbar-hide md:mx-0 md:px-0">
          <div className="flex items-center gap-6 md:gap-8 min-w-max">
            {/* Show All Button */}
            <button
              onClick={handleShowAll}
              className={cn(
                "flex flex-col items-center justify-center pt-1.5 pb-1.5 min-w-[44px] text-sm font-semibold relative transition-all duration-200 ease-in-out border-b-2 active:scale-95 touch-manipulation whitespace-nowrap",
                activeSecondary === null
                  ? "text-neutral-900 border-neutral-900"
                  : "text-neutral-400 border-transparent hover:text-neutral-900 active:text-neutral-900"
              )}
            >
              {t('secondaryTabs.all')}
            </button>
            
            {secondaryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSecondaryClick(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center pt-1.5 pb-1.5 min-w-[44px] text-sm font-semibold relative transition-all duration-200 ease-in-out border-b-2 active:scale-95 touch-manipulation whitespace-nowrap",
                  activeSecondary === tab.id
                    ? "text-neutral-900 border-neutral-900"
                    : "text-neutral-400 border-transparent hover:text-neutral-900 active:text-neutral-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

