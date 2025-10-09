import { Prisma } from "@/generated/prisma"

// Base types from Prisma
export type App = Prisma.AppGetPayload<{
  include: {
    screens: true
    _count: {
      select: {
        screens: true
      }
    }
  }
}>

// Type for API response with preview screens
export type AppWithPreview = Prisma.AppGetPayload<{
  include: {
    screens: {
      take: 3
    }
    _count: {
      select: {
        screens: true
      }
    }
  }
}>

// Type for list (without screens)
export type AppListItem = Prisma.AppGetPayload<{
  include: {
    _count: {
      select: {
        screens: true
      }
    }
  }
}>

// Type for create/update
export type AppCreateInput = Prisma.AppCreateInput
export type AppUpdateInput = Prisma.AppUpdateInput
