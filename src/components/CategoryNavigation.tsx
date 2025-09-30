"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const primaryTabs = [
  "App",
  "Screen"
]

const secondaryTabs = [
  "Di chuyển",
  "Tài chính", 
  "Giải trí",
  "Đời sống",
  "Hiệu suất"
]

export function CategoryNavigation() {
  const [activePrimary, setActivePrimary] = useState("App")
  const [activeSecondary, setActiveSecondary] = useState("Di chuyển")

  return (
    <div className="px-20 py-6">
      {/* Primary Tabs - Toggle Style with Sliding Animation */}
      <div className="inline-flex bg-gray-100 rounded-lg p-1 mb-4 relative">
        {/* Sliding Background */}
        <div 
          className="absolute bg-white rounded-md shadow-sm transition-all duration-300 ease-in-out"
          style={{
            width: `calc(50% - 2px)`,
            height: 'calc(100% - 2px)',
            left: activePrimary === "App" ? '2px' : 'calc(50% + 2px)',
            top: '2px'
          }}
        />
        
        {primaryTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActivePrimary(tab)}
            className={cn(
              "relative z-10 flex-1 px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200 text-center",
              activePrimary === tab
                ? "text-black"
                : "text-gray-600 hover:text-gray-800"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      
      {/* Secondary Tabs */}
      <div className="relative">
        {/* Continuous underline background */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300"></div>
        
        {/* Animated underline */}
        <div 
          className="absolute bottom-0 h-0.5 bg-black transition-all duration-300 ease-in-out"
          style={{
            width: '80px',
            left: `${secondaryTabs.indexOf(activeSecondary) * 80}px`
          }}
        />
        
        <div className="flex">
          {secondaryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSecondary(tab)}
              className={cn(
                "py-2 text-sm font-medium transition-colors relative w-20",
                activeSecondary === tab
                  ? "text-black"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
