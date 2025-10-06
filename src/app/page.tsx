"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { AppWithPreview, ApiResponse } from "@/types"

export default function Home() {
  const [apps, setApps] = useState<AppWithPreview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/apps")
      .then((res) => res.json())
      .then((data: ApiResponse<AppWithPreview[]>) => {
        if (data.success) {
          setApps(data.data)
        }
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">UI Showcase</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">UI Showcase</h1>
        <p className="text-muted-foreground">
          Explore UI/UX designs from popular mobile apps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div
            key={app.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            style={{
              borderTopWidth: "4px",
              borderTopColor: app.brandColor || "#000",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-1">{app.name}</h2>
                <span className="text-sm text-muted-foreground">
                  {app.platform}
                </span>
              </div>
              {app.category && (
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {app.category}
                </span>
              )}
            </div>

            {app.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {app.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {app._count.screens} screens
              </span>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {apps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No apps found</p>
        </div>
      )}
    </div>
  )
}
