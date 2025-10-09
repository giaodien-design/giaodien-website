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
  // Lấy dữ liệu từ database
  const result = await getApps()
  
  if (!result.success || !result.data) {
    return (
      <section className="flex flex-col gap-16 items-start p-20 w-full">
        <p className="text-neutral-500">Không có dữ liệu ứng dụng</p>
      </section>
    )
  }

  // Lấy 3 apps đầu tiên và lặp lại để có 8 cards (như design Figma)
  const apps = result.data.slice(0, 3)
  const displayApps: AppWithScreens[] = [
    ...apps,
    ...apps,
    ...apps.slice(0, 2) // Lặp lại để có đủ 8 cards
  ]

  return (
    <section className="flex flex-col gap-16 items-start p-20 w-full">
      {/* First Row - 4 cards */}
      <div className="flex gap-6 items-center w-full">
        {displayApps.slice(0, 4).map((app, index) => (
          <div key={`${app.id}-${index}`} className="flex-1 flex flex-col gap-5 items-start min-w-0">
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
                <p className="text-lg font-medium text-black leading-normal w-full truncate">
                  {app.name}
                </p>
                <p className="text-sm font-normal text-black/60 leading-normal w-full truncate">
                  {app.description || "Ứng dụng di động"}
                </p>
              </div>
            </div>
            
            {/* Screenshot Container */}
            <div className="bg-neutral-50 flex items-center justify-center px-[60px] py-[30px] rounded-[30px] w-full">
              <div className="aspect-[1179/2556] flex-1 rounded-[20px] relative overflow-hidden">
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

      {/* Second Row - 4 cards */}
      <div className="flex gap-6 items-center w-full">
        {displayApps.slice(4, 8).map((app, index) => (
          <div key={`${app.id}-${index + 4}`} className="flex-1 flex flex-col gap-5 items-start min-w-0">
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
                <p className="text-lg font-medium text-black leading-normal w-full truncate">
                  {app.name}
                </p>
                <p className="text-sm font-normal text-black/60 leading-normal w-full truncate">
                  {app.description || "Ứng dụng di động"}
                </p>
              </div>
            </div>
            
            {/* Screenshot Container */}
            <div className="bg-neutral-50 flex items-center justify-center px-[60px] py-[30px] rounded-[30px] w-full">
              <div className="aspect-[1179/2556] flex-1 rounded-[20px] relative overflow-hidden">
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
