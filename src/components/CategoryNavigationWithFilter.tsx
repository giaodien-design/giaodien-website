"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from 'next-intl'

type Type = {
  id: string;
  name: string;
  slug: string;
};

interface CategoryNavigationWithFilterProps {
  types: Type[];
  onTypeChange: (typeId: string | null) => void;
}

export function CategoryNavigationWithFilter({ types, onTypeChange }: CategoryNavigationWithFilterProps) {
  const t = useTranslations('categories');
  const tApps = useTranslations('apps');
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
    <div className="flex flex-col gap-4 md:gap-6 items-start px-4 md:px-10 lg:px-20">
      {/* Primary Tabs */}
      <div className="inline-flex bg-neutral-100 rounded-xl p-[3px]">
        {primaryTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePrimary(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm font-semibold transition-colors",
              activePrimary === tab.id
                ? "bg-white border border-neutral-200 text-neutral-900 shadow-sm"
                : "text-neutral-900 hover:bg-white/60 hover:text-neutral-950"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Secondary Tabs */}
      <div className="border-b-2 border-neutral-200 w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex items-center min-w-max">
          {/* Show All Button */}
          <button
            onClick={handleShowAll}
            className={cn(
              "flex flex-col items-center justify-center px-3 md:px-4 pt-2 md:pt-3 pb-[8px] md:pb-[10px] text-xs md:text-sm font-semibold relative transition-colors -mb-[2px]",
              activeSecondary === null
                ? "text-neutral-900 border-b-2 border-neutral-900"
                : "text-neutral-500 hover:text-black"
            )}
          >
            {tApps('allTypes')}
          </button>
          
          {secondaryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleSecondaryClick(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center px-3 md:px-4 pt-2 md:pt-3 pb-[8px] md:pb-[10px] text-xs md:text-sm font-semibold relative transition-colors -mb-[2px]",
                activeSecondary === tab.id
                  ? "text-neutral-900 border-b-2 border-neutral-900"
                  : "text-neutral-500 hover:text-black"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}


