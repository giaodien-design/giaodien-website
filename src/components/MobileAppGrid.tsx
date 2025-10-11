import React from "react"
import Image from "next/image"
import { getApps } from "@/lib/actions"

type AppWithScreens = {
  id: string
  name: string
  description: string | null
  icon: string | null
  screens?: Array<{
    id: string
    imageUrl: string
    title: string
  }>
}

export async function MobileAppGrid() {
  // Fetch data from database
  const result = await getApps()
  
  if (!result.success || !result.data) {
    return (
      <section className="flex flex-col gap-16 items-start p-20 w-full">
        <p className="text-neutral-500">No app data available</p>
      </section>
    )
  }

  // Get first 8 apps from database
  const displayApps: AppWithScreens[] = result.data.slice(0, 8)

  return (
    <section className="flex flex-col gap-8 md:gap-12 lg:gap-16 items-start p-4 md:p-10 lg:p-20 w-full">
      {/* Grid - Responsive: 1 col mobile, 2 cols tablet, 4 cols desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {displayApps.map((app, index) => (
          <div key={`${app.id}-${index}`} className="flex flex-col gap-4 md:gap-5 items-start w-full">
            {/* App Info */}
            <div className="flex gap-3 items-start w-full">
              <div className="border border-[#f3f3f3] rounded-xl w-10 h-10 shrink-0 relative overflow-hidden">
                <Image 
                  src="/images/gdd-logo.svg"
                  alt={app.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col gap-1 items-start min-w-0">
                <p className="text-base md:text-lg font-medium text-black leading-normal w-full truncate">
                  {app.name}
                </p>
                <p className="text-sm font-normal text-black/60 leading-normal w-full truncate">
                  {app.description || "Mobile application"}
                </p>
              </div>
            </div>
            
            {/* Screenshot Container */}
            <div className="bg-neutral-50 flex items-center justify-center px-8 md:px-12 lg:px-[60px] py-4 md:py-6 lg:py-[30px] rounded-2xl md:rounded-[30px] w-full">
              <div className="aspect-[1179/2556] flex-1 rounded-xl md:rounded-[20px] relative overflow-hidden">
                <Image 
                  src="/images/sample-img.png"
                  alt={`${app.name} screenshot`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
