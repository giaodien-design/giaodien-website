import React from "react";
import { Card, CardContent } from "./ui/card";

export function MobileAppGrid() {
  // Placeholder cho 8 ảnh mobile app
  const mobileApps = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: "Grab App",
    description: "Ứng dụng di chuyển và giao đồ ăn"
  }))

  return (
    <section className="px-20 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {mobileApps.map((app) => (
          <Card key={app.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-[9/16] bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                  <p className="text-sm">Mobile App Screenshot</p>
                  <p className="text-xs text-gray-400">{app.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
