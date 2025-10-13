"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useTranslations } from 'next-intl'

export function CategoryNavigation() {
  const t = useTranslations('categories');
  const [activePrimary, setActivePrimary] = useState("app")
  const [activeSecondary, setActiveSecondary] = useState("all")

  const primaryTabs = [
    { id: "app", label: t('primaryTabs.app') },
    { id: "screen", label: t('primaryTabs.screen') }
  ]

  const secondaryTabs = [
    { id: "all", label: t('secondaryTabs.all') },
    { id: "transportation", label: t('secondaryTabs.transportation') },
    { id: "finance", label: t('secondaryTabs.finance') }, 
    { id: "entertainment", label: t('secondaryTabs.entertainment') },
    { id: "lifestyle", label: t('secondaryTabs.lifestyle') },
    { id: "productivity", label: t('secondaryTabs.productivity') }
  ]

  return (
    <div className="flex flex-col gap-8 md:gap-12 lg:gap-16 items-start px-4 md:px-10 lg:px-20">
      {/* Primary and Secondary Tabs */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full">
        {/* Primary Tabs */}
        <div className="inline-flex bg-neutral-100 rounded-xl p-[3px] shrink-0 w-auto">
          {primaryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePrimary(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center px-4 py-2.5 md:py-3 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out border-t border-l border-r border-b-2 active:scale-95 touch-manipulation",
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
        <div className="flex-1 w-full overflow-x-auto overflow-y-hidden scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex items-center gap-6 md:gap-8 min-w-max">
            {secondaryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSecondary(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center py-3 min-w-[44px] text-sm font-semibold relative transition-all duration-200 ease-in-out border-b-2 active:scale-95 touch-manipulation whitespace-nowrap",
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
