"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { Platform } from "@/generated/prisma";

// Example: Get all apps
export async function getApps() {
  try {
    const apps = await prisma.app.findMany({
      where: { isPublished: true },
      include: { screens: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: apps };
  } catch (error) {
    console.error("Failed to fetch apps:", error);
    return { success: false, error: "Failed to fetch apps" };
  }
}

// Example: Create new app (form action)
export async function createApp(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;
    const platform = (formData.get("platform") as Platform) || "IOS";
    const slug = formData.get("slug") as string;

    await prisma.app.create({
      data: {
        name,
        description,
        platform,
        slug,
      },
    });

    revalidatePath("/test"); // Revalidate the test page cache
  } catch (error) {
    console.error("Failed to create app:", error);
    throw new Error("Failed to create app");
  }
}

// Example: Increment screen view count
export async function incrementScreenView(screenId: string) {
  try {
    await prisma.screen.update({
      where: { id: screenId },
      data: { viewCount: { increment: 1 } },
    });

    revalidatePath("/"); // Revalidate cache
    return { success: true };
  } catch (error) {
    console.error("Failed to increment view:", error);
    return { success: false, error: "Failed to increment view" };
  }
}

// Example: Delete app
export async function deleteApp(appId: string) {
  try {
    await prisma.app.delete({
      where: { id: appId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete app:", error);
    return { success: false, error: "Failed to delete app" };
  }
}
