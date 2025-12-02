"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod schemas for XSS protection
const createAppSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim()
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Name can only contain letters, numbers, spaces, hyphens and underscores"
    ),

  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50, "Slug must be less than 50 characters")
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .trim()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return null;
      // Strip any HTML tags
      return val.replace(/<[^>]*>/g, "");
    }),

  platform: z.enum(["IOS", "ANDROID", "WEB"], {
    message: "Platform must be IOS, ANDROID, or WEB",
  }),

  brandColor: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Brand color must be a valid hex color (e.g., #FF5733)"
    )
    .optional()
    .nullable(),

  websiteUrl: z
    .string()
    .url("Must be a valid URL")
    .max(200, "URL too long")
    .optional()
    .nullable(),
});

// Get all apps with optional filtering and search
export async function getApps(params?: {
  search?: string;
  categoryId?: string;
}) {
  try {
    const { search, categoryId } = params || {};

    const where: any = { isPublished: true };

    // Search by name or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filter by category
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const apps = await prisma.app.findMany({
      where,
      include: {
        screens: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: apps };
  } catch (error) {
    console.error("Failed to fetch apps:", error);
    return { success: false, error: "Failed to fetch apps" };
  }
}

// Get single app by ID
export async function getAppById(appId: string) {
  try {
    // Validate ID format
    const idSchema = z.string().cuid("Invalid app ID format");
    const validatedId = idSchema.parse(appId);

    const app = await prisma.app.findUnique({
      where: { 
        id: validatedId,
      },
      include: {
        screens: {
          orderBy: { createdAt: "asc" },
        },
        category: true,
      },
    });

    if (!app || !app.isPublished) {
      return { success: false, error: "App not found" };
    }

    return { success: true, data: app };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Invalid ID:", error.issues);
      return { success: false, error: "Invalid app ID" };
    }
    console.error("Failed to fetch app:", error);
    return { success: false, error: "Failed to fetch app" };
  }
}

// Get all categories
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

// Get search suggestions
export async function getSearchSuggestions(query: string) {
  try {
    if (!query || query.length < 2) {
      return { success: true, data: [] };
    }

    const apps = await prisma.app.findMany({
      where: {
        isPublished: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        icon: true,
      },
      take: 5,
      orderBy: { name: "asc" },
    });

    return { success: true, data: apps };
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    return { success: false, error: "Failed to fetch suggestions" };
  }
}

// Example: Create new app with XSS protection
export async function createApp(formData: FormData) {
  try {
    // 🛡️ Validate and sanitize input
    const validated = createAppSchema.parse({
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      platform: formData.get("platform"),
      brandColor: formData.get("brandColor") || null,
      websiteUrl: formData.get("websiteUrl") || null,
    });

    // Safe to use validated data
    await prisma.app.create({
      data: validated,
    });

    revalidatePath("/test");
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors to user
      console.error("Validation error:", error.issues);
      throw new Error(
        error.issues.map((e: z.ZodIssue) => e.message).join(", ")
      );
    }
    console.error("Failed to create app:", error);
    throw new Error("Failed to create app");
  }
}

// Example: Increment screen view count with validation
export async function incrementScreenView(screenId: string) {
  try {
    // Validate ID format (cuid)
    const idSchema = z.string().cuid("Invalid screen ID format");
    const validatedId = idSchema.parse(screenId);

    await prisma.screen.update({
      where: { id: validatedId },
      data: { viewCount: { increment: 1 } },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Invalid ID:", error.issues);
      return { success: false, error: "Invalid screen ID" };
    }
    console.error("Failed to increment view:", error);
    return { success: false, error: "Failed to increment view" };
  }
}

// Example: Delete app with validation
export async function deleteApp(appId: string) {
  try {
    // Validate ID format
    const idSchema = z.string().cuid("Invalid app ID format");
    const validatedId = idSchema.parse(appId);

    await prisma.app.delete({
      where: { id: validatedId },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Invalid ID:", error.issues);
      return { success: false, error: "Invalid app ID" };
    }
    console.error("Failed to delete app:", error);
    return { success: false, error: "Failed to delete app" };
  }
}

// Zod schema for Flow creation
const createFlowSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim()
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Name can only contain letters, numbers, spaces, hyphens and underscores"
    ),

  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .trim()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return null;
      // Strip any HTML tags
      return val.replace(/<[^>]*>/g, "");
    }),

  sortOrder: z
    .number()
    .int()
    .min(0)
    .optional()
    .default(0),
});

// Get all flows
export async function getAllFlows() {
  try {
    const flows = await prisma.flow.findMany({
      include: {
        screens: {
          where: {
            flowId: { not: null },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return { success: true, data: flows };
  } catch (error) {
    console.error("Failed to fetch flows:", error);
    return { success: false, error: "Failed to fetch flows" };
  }
}

// Get single flow by ID
export async function getFlowById(flowId: string) {
  try {
    // Validate ID format
    const idSchema = z.string().cuid("Invalid flow ID format");
    const validatedId = idSchema.parse(flowId);

    const flow = await prisma.flow.findUnique({
      where: { id: validatedId },
      include: {
        screens: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!flow) {
      return { success: false, error: "Flow not found" };
    }

    return { success: true, data: flow };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Invalid ID:", error.issues);
      return { success: false, error: "Invalid flow ID" };
    }
    console.error("Failed to fetch flow:", error);
    return { success: false, error: "Failed to fetch flow" };
  }
}

// Create new flow with XSS protection
export async function createFlow(formData: FormData) {
  try {
    // 🛡️ Validate and sanitize input
    const validated = createFlowSchema.parse({
      name: formData.get("name"),
      description: formData.get("description") || null,
      sortOrder: formData.get("sortOrder") 
        ? parseInt(formData.get("sortOrder") as string, 10)
        : 0,
    });

    // Safe to use validated data
    await prisma.flow.create({
      data: validated,
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors to user
      console.error("Validation error:", error.issues);
      throw new Error(
        error.issues.map((e: z.ZodIssue) => e.message).join(", ")
      );
    }
    console.error("Failed to create flow:", error);
    throw new Error("Failed to create flow");
  }
}
