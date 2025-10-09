"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const primaryTabs = [
  { id: "app", label: "Ứng dụng" },
  { id: "screen", label: "Screen type" }
]

const secondaryTabs = [
  { id: "di-chuyen", label: "Di chuyển" },
  { id: "tai-chinh", label: "Tài chính" }, 
  { id: "giai-tri", label: "Giải trí" },
  { id: "doi-song", label: "Đời sống" },
  { id: "hieu-suat", label: "Hiệu suất" }
]

export function CategoryNavigation() {
  const [activePrimary, setActivePrimary] = useState("app")
  const [activeSecondary, setActiveSecondary] = useState("di-chuyen")

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
                ? "bg-white border border-[#ebebeb] text-neutral-900 shadow-sm"
                : "text-neutral-900 hover:bg-white/60 hover:text-neutral-950"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Secondary Tabs */}
      <div className="border-b-2 border-[#ebebeb] w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
        <div className="flex items-center min-w-max">
          {secondaryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSecondary(tab.id)}
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
