import { Prisma } from "@/generated/prisma"

// Base types from Prisma
export type Screen = Prisma.ScreenGetPayload<{
  include: {
    app: true
  }
}>

// Type for screen detail (with app info)
export type ScreenWithApp = Prisma.ScreenGetPayload<{
  include: {
    app: {
      select: {
        id: true
        name: true
        slug: true
        brandColor: true
      }
    }
  }
}>

// Type for create/update
export type ScreenCreateInput = Prisma.ScreenCreateInput
export type ScreenUpdateInput = Prisma.ScreenUpdateInput
