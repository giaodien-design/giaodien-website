'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Zod schemas for XSS protection
const createAppSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Name can only contain letters, numbers, spaces, hyphens and underscores'),

  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50, 'Slug must be less than 50 characters')
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'),

  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return null;
      // Strip any HTML tags
      return val.replace(/<[^>]*>/g, '');
    }),

  platform: z.enum(['IOS', 'ANDROID', 'WEB'], {
    message: 'Platform must be IOS, ANDROID, or WEB'
  }),

  brandColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Brand color must be a valid hex color (e.g., #FF5733)')
    .optional()
    .nullable(),

  websiteUrl: z.string().url('Must be a valid URL').max(200, 'URL too long').optional().nullable()
});

// Helper to parse comma-separated string to array
const parseToArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return value.split(',').filter(Boolean);
};

// Get all apps with optional filtering and search (supports multi-select)
export async function getApps(params?: {
  search?: string;
  categoryId?: string | string[]; // Supports single value or array/comma-separated
  screenTypeId?: string | string[];
  uiElementId?: string | string[];
  flowId?: string | string[];
}) {
  try {
    const { search, categoryId, screenTypeId, uiElementId, flowId } = params || {};

    // Parse comma-separated values to arrays
    const categoryIds = parseToArray(categoryId);
    const screenTypeIds = parseToArray(screenTypeId);
    const uiElementIds = parseToArray(uiElementId);
    const flowIds = parseToArray(flowId);

    const where: any = { isPublished: true };

    // Search by name or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filter by categories (direct relation) - multi-select with OR logic
    if (categoryIds.length > 0) {
      where.categoryId = { in: categoryIds };
    }

    // Deep filtering: Filter apps that have screens matching the criteria
    // Each filter type uses OR logic within (match any selected value)
    // Different filter types use AND logic between (must match all filter types)
    const screenFilterConditions: any[] = [];

    // Filter by screenTypeIds: App must have at least one screen with any of the selected screenTypes
    if (screenTypeIds.length > 0) {
      screenFilterConditions.push({
        screens: {
          some: {
            screenTypeId: { in: screenTypeIds }
          }
        }
      });
    }

    // Filter by uiElementIds: App must have at least one screen with any of the selected UI elements
    if (uiElementIds.length > 0) {
      screenFilterConditions.push({
        screens: {
          some: {
            uiElements: {
              some: {
                id: { in: uiElementIds }
              }
            }
          }
        }
      });
    }

    // Filter by flowIds: App must have at least one screen belonging to any of the selected flows
    if (flowIds.length > 0) {
      screenFilterConditions.push({
        screens: {
          some: {
            flowId: { in: flowIds }
          }
        }
      });
    }

    // Combine screen filter conditions with AND (app must satisfy all selected screen filter types)
    if (screenFilterConditions.length > 0) {
      if (where.AND) {
        where.AND = [...where.AND, ...screenFilterConditions];
      } else {
        where.AND = screenFilterConditions;
      }
    }

    const apps = await prisma.app.findMany({
      where,
      include: {
        screens: true,
        category: true
      },
      orderBy: { sortOrder: 'asc' }
    });

    return { success: true, data: apps };
  } catch (error) {
    console.error('Failed to fetch apps:', error);
    return { success: false, error: 'Failed to fetch apps' };
  }
}

// Get single app by ID
export async function getAppById(appId: string, versionId?: string) {
  try {
    // Validate ID format
    const idSchema = z.string().cuid('Invalid app ID format');
    const validatedId = idSchema.parse(appId);

    // Fetch all versions for this app, ordered by creation date (newest first)
    const versions = await prisma.appVersion.findMany({
      where: { appId: validatedId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { screens: true }
        }
      }
    });

    // Determine which version to use
    let targetVersionId: string | null = null;
    if (versionId) {
      // Use specified version if provided
      const versionExists = versions.some((v) => v.id === versionId);
      if (versionExists) {
        targetVersionId = versionId;
      }
    }
    // If no version specified or version not found, use the latest (first in the array)
    if (!targetVersionId && versions.length > 0) {
      targetVersionId = versions[0].id;
    }

    const app = await prisma.app.findUnique({
      where: {
        id: validatedId
      },
      include: {
        screens: {
          where: targetVersionId
            ? {
                appVersionId: targetVersionId
              }
            : {
                // If no versions exist, include screens without version
                appVersionId: null
              },
          include: {
            flow: true,
            appVersion: true
          },
          orderBy: [
            // Order by screen order field (for screens within flows)
            { order: 'asc' },
            // Fallback to createdAt for screens without order
            { createdAt: 'asc' }
          ]
        },
        category: true,
        versions: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { screens: true }
            }
          }
        }
      }
    });

    // Sort screens: first by flow sortOrder, then by screen order, then by createdAt
    if (app && app.screens) {
      app.screens.sort((a, b) => {
        // Screens with flows come first, sorted by flow sortOrder
        if (a.flow && b.flow) {
          if (a.flow.sortOrder !== b.flow.sortOrder) {
            return a.flow.sortOrder - b.flow.sortOrder;
          }
          // Same flow, sort by screen order
          if (a.order !== b.order) {
            return a.order - b.order;
          }
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        // If only one has a flow, the one with flow comes first
        if (a.flow && !b.flow) return -1;
        if (!a.flow && b.flow) return 1;
        // Both don't have flows, sort by order then createdAt
        if (a.order !== b.order) {
          return a.order - b.order;
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    }

    if (!app || !app.isPublished) {
      return { success: false, error: 'App not found' };
    }

    // Get the current version object
    const currentVersion = targetVersionId
      ? versions.find((v) => v.id === targetVersionId)
      : versions[0] || null;

    return {
      success: true,
      data: {
        ...app,
        currentVersion
      }
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Invalid ID:', error.issues);
      return { success: false, error: 'Invalid app ID' };
    }
    console.error('Failed to fetch app:', error);
    return { success: false, error: 'Failed to fetch app' };
  }
}

// Get all categories
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return { success: false, error: 'Failed to fetch categories' };
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
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        icon: true
      },
      take: 5,
      orderBy: { name: 'asc' }
    });

    return { success: true, data: apps };
  } catch (error) {
    console.error('Failed to fetch suggestions:', error);
    return { success: false, error: 'Failed to fetch suggestions' };
  }
}

// Example: Create new app with XSS protection
export async function createApp(formData: FormData) {
  try {
    // 🛡️ Validate and sanitize input
    const validated = createAppSchema.parse({
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      platform: formData.get('platform'),
      brandColor: formData.get('brandColor') || null,
      websiteUrl: formData.get('websiteUrl') || null
    });

    // Safe to use validated data
    await prisma.app.create({
      data: validated
    });

    revalidatePath('/test');
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors to user
      console.error('Validation error:', error.issues);
      throw new Error(error.issues.map((e: z.ZodIssue) => e.message).join(', '));
    }
    console.error('Failed to create app:', error);
    throw new Error('Failed to create app');
  }
}

// Example: Increment screen view count with validation
export async function incrementScreenView(screenId: string) {
  try {
    // Validate ID format (cuid)
    const idSchema = z.string().cuid('Invalid screen ID format');
    const validatedId = idSchema.parse(screenId);

    await prisma.screen.update({
      where: { id: validatedId },
      data: { viewCount: { increment: 1 } }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Invalid ID:', error.issues);
      return { success: false, error: 'Invalid screen ID' };
    }
    console.error('Failed to increment view:', error);
    return { success: false, error: 'Failed to increment view' };
  }
}

// Example: Delete app with validation
export async function deleteApp(appId: string) {
  try {
    // Validate ID format
    const idSchema = z.string().cuid('Invalid app ID format');
    const validatedId = idSchema.parse(appId);

    await prisma.app.delete({
      where: { id: validatedId }
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Invalid ID:', error.issues);
      return { success: false, error: 'Invalid app ID' };
    }
    console.error('Failed to delete app:', error);
    return { success: false, error: 'Failed to delete app' };
  }
}

// Zod schema for Flow creation
const createFlowSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Name can only contain letters, numbers, spaces, hyphens and underscores'),

  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return null;
      // Strip any HTML tags
      return val.replace(/<[^>]*>/g, '');
    }),

  sortOrder: z.number().int().min(0).optional().default(0)
});

// Get all flows
export async function getAllFlows() {
  try {
    const flows = await prisma.flow.findMany({
      include: {
        screens: {
          where: {
            flowId: { not: null }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    return { success: true, data: flows };
  } catch (error) {
    console.error('Failed to fetch flows:', error);
    return { success: false, error: 'Failed to fetch flows' };
  }
}

// Get all screen types
export async function getScreenTypes() {
  try {
    const screenTypes = await prisma.screenType.findMany({
      orderBy: { name: 'asc' }
    });
    return { success: true, data: screenTypes };
  } catch (error) {
    console.error('Failed to fetch screen types:', error);
    return { success: false, error: 'Failed to fetch screen types' };
  }
}

// Get all UI elements
export async function getUIElements() {
  try {
    const uiElements = await prisma.uIElement.findMany({
      orderBy: { name: 'asc' }
    });
    return { success: true, data: uiElements };
  } catch (error) {
    console.error('Failed to fetch UI elements:', error);
    return { success: false, error: 'Failed to fetch UI elements' };
  }
}

// Get single flow by ID
export async function getFlowById(flowId: string) {
  try {
    // Validate ID format
    const idSchema = z.string().cuid('Invalid flow ID format');
    const validatedId = idSchema.parse(flowId);

    const flow = await prisma.flow.findUnique({
      where: { id: validatedId },
      include: {
        screens: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!flow) {
      return { success: false, error: 'Flow not found' };
    }

    return { success: true, data: flow };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Invalid ID:', error.issues);
      return { success: false, error: 'Invalid flow ID' };
    }
    console.error('Failed to fetch flow:', error);
    return { success: false, error: 'Failed to fetch flow' };
  }
}

// Create new flow with XSS protection
export async function createFlow(formData: FormData) {
  try {
    // 🛡️ Validate and sanitize input
    const validated = createFlowSchema.parse({
      name: formData.get('name'),
      description: formData.get('description') || null,
      sortOrder: formData.get('sortOrder') ? parseInt(formData.get('sortOrder') as string, 10) : 0
    });

    // Safe to use validated data
    await prisma.flow.create({
      data: validated
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Return validation errors to user
      console.error('Validation error:', error.issues);
      throw new Error(error.issues.map((e: z.ZodIssue) => e.message).join(', '));
    }
    console.error('Failed to create flow:', error);
    throw new Error('Failed to create flow');
  }
}

// Get screens with optional filtering (for Screen View mode)
export async function getScreens(params?: {
  screenTypeId?: string | string[];
  uiElementId?: string | string[];
  categoryId?: string | string[];
}) {
  try {
    const { screenTypeId, uiElementId, categoryId } = params || {};

    // Parse comma-separated values to arrays
    const screenTypeIds = parseToArray(screenTypeId);
    const uiElementIds = parseToArray(uiElementId);
    const categoryIds = parseToArray(categoryId);

    const where: any = { isPublished: true };

    // Filter by screen types
    if (screenTypeIds.length > 0) {
      where.screenTypeId = { in: screenTypeIds };
    }

    // Filter by UI elements (many-to-many)
    if (uiElementIds.length > 0) {
      where.uiElements = {
        some: {
          id: { in: uiElementIds }
        }
      };
    }

    // Filter by app category (through app relation)
    if (categoryIds.length > 0) {
      where.app = {
        categoryId: { in: categoryIds }
      };
    }

    const screens = await prisma.screen.findMany({
      where,
      include: {
        app: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            brandColor: true
          }
        },
        screenType: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: [{ app: { sortOrder: 'asc' } }, { order: 'asc' }],
      take: 100 // Limit for performance
    });

    return { success: true, data: screens };
  } catch (error) {
    console.error('Failed to fetch screens:', error);
    return { success: false, error: 'Failed to fetch screens' };
  }
}

// Global Search - handles empty state (recommended) and text search with ranking
export async function searchGlobal(query: string): Promise<{
  success: boolean;
  data?: {
    recommendedApps?: Array<{ id: string; name: string; slug: string; icon: string | null; description: string | null }>;
    recommendedScreenTypes?: Array<{ id: string; name: string; slug: string }>;
    recommendedUiElements?: Array<{ id: string; name: string; slug: string }>;
    recommendedFlows?: Array<{ id: string; name: string; description: string | null }>;
    apps?: Array<{ id: string; name: string; slug: string; icon: string | null; description: string | null }>;
    screenTypes?: Array<{ id: string; name: string; slug: string }>;
    uiElements?: Array<{ id: string; name: string; slug: string }>;
    flows?: Array<{ id: string; name: string; description: string | null }>;
  };
  error?: string;
}> {
  try {
    const trimmedQuery = (query ?? '').trim();

    // Scenario A: Empty query - return recommended items
    if (!trimmedQuery) {
      const [recommendedApps, recommendedScreenTypes, recommendedUiElements, recommendedFlows] = await Promise.all([
        prisma.app.findMany({
          where: { isRecommended: true, isPublished: true },
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            description: true
          },
          orderBy: { name: 'asc' },
          take: 5
        }),
        prisma.screenType.findMany({
          where: { isRecommended: true },
          select: {
            id: true,
            name: true,
            slug: true
          },
          orderBy: { name: 'asc' },
          take: 5
        }),
        prisma.uIElement.findMany({
          where: { isRecommended: true },
          select: {
            id: true,
            name: true,
            slug: true
          },
          orderBy: { name: 'asc' },
          take: 5
        }),
        prisma.flow.findMany({
          where: { isRecommended: true },
          select: {
            id: true,
            name: true,
            description: true
          },
          orderBy: { name: 'asc' },
          take: 5
        })
      ]);

      return {
        success: true,
        data: {
          recommendedApps,
          recommendedScreenTypes,
          recommendedUiElements,
          recommendedFlows
        }
      };
    }

    // Scenario B: Query has text - search across tables with ranking
    // Fetch all matches, then sort by "starts with" priority
    const [apps, screenTypes, uiElements, flows] = await Promise.all([
      // Search Apps
      prisma.app.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: trimmedQuery, mode: 'insensitive' } },
            { description: { contains: trimmedQuery, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          description: true
        },
        orderBy: { name: 'asc' },
        take: 20 // Fetch more to allow for re-ranking
      }),

      // Search ScreenTypes
      prisma.screenType.findMany({
        where: {
          name: { contains: trimmedQuery, mode: 'insensitive' }
        },
        select: {
          id: true,
          name: true,
          slug: true
        },
        orderBy: { name: 'asc' },
        take: 20
      }),

      // Search UIElements
      prisma.uIElement.findMany({
        where: {
          name: { contains: trimmedQuery, mode: 'insensitive' }
        },
        select: {
          id: true,
          name: true,
          slug: true
        },
        orderBy: { name: 'asc' },
        take: 20
      }),

      // Search Flows
      prisma.flow.findMany({
        where: {
          OR: [
            { name: { contains: trimmedQuery, mode: 'insensitive' } },
            { description: { contains: trimmedQuery, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          name: true,
          description: true
        },
        orderBy: { name: 'asc' },
        take: 20
      })
    ]);

    // Helper function to rank results: "starts with" comes first
    const rankByStartsWith = <T extends { name: string }>(items: T[], searchQuery: string): T[] => {
      const lowerQuery = searchQuery.toLowerCase();
      const startsWithItems: T[] = [];
      const containsItems: T[] = [];

      for (const item of items) {
        if (item.name.toLowerCase().startsWith(lowerQuery)) {
          startsWithItems.push(item);
        } else {
          containsItems.push(item);
        }
      }

      // Return "starts with" items first, then "contains" items, limited to 5
      return [...startsWithItems, ...containsItems].slice(0, 5);
    };

    return {
      success: true,
      data: {
        apps: rankByStartsWith(apps, trimmedQuery),
        screenTypes: rankByStartsWith(screenTypes, trimmedQuery),
        uiElements: rankByStartsWith(uiElements, trimmedQuery),
        flows: rankByStartsWith(flows, trimmedQuery)
      }
    };
  } catch (error) {
    console.error('Failed to perform global search:', error);
    // Return empty results instead of error to prevent serialization issues
    return {
      success: true,
      data: {
        recommendedApps: [],
        recommendedScreenTypes: [],
        recommendedUiElements: [],
        recommendedFlows: [],
        apps: [],
        screenTypes: [],
        uiElements: [],
        flows: []
      }
    };
  }
}

// Get flows with preview data for Flow View (Mobbin style)
export async function getFlowsWithPreviews(params?: {
  flowId?: string | string[];
  categoryId?: string | string[];
}) {
  try {
    const { flowId, categoryId } = params || {};

    // Parse comma-separated values to arrays
    const flowIds = parseToArray(flowId);
    const categoryIds = parseToArray(categoryId);

    // Build where clause for flows
    const flowWhere: any = {
      screens: {
        some: {} // Only flows that have at least one screen
      }
    };

    // Filter by specific flow IDs if provided
    if (flowIds.length > 0) {
      flowWhere.id = { in: flowIds };
    }

    // Find all unique flows that have screens associated with them
    const flowsWithScreens = await prisma.flow.findMany({
      where: flowWhere,
      include: {
        screens: {
          where: {
            isPublished: true
          },
          orderBy: { order: 'asc' },
          take: 4, // Get first 4 screens for preview only
          select: {
            id: true,
            imageUrl: true,
            title: true,
            order: true
          }
        },
        // Get total count of screens in this flow
        _count: {
          select: {
            screens: {
              where: {
                isPublished: true
              }
            }
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    // For each flow, get the associated app details
    const flowsWithApps = await Promise.all(
      flowsWithScreens.map(async (flow) => {
        // Build where clause for screens
        const screenWhere: any = {
          flowId: flow.id,
          isPublished: true
        };

        // Filter by app category if provided
        if (categoryIds.length > 0) {
          screenWhere.app = {
            categoryId: { in: categoryIds }
          };
        }

        // Get a screen from this flow to find the associated app
        const screenWithApp = await prisma.screen.findFirst({
          where: screenWhere,
          include: {
            app: {
              select: {
                id: true,
                name: true,
                slug: true,
                icon: true,
                brandColor: true
              }
            }
          }
        });

        return {
          id: flow.id,
          name: flow.name,
          description: flow.description,
          sortOrder: flow.sortOrder,
          app: screenWithApp?.app || null,
          previewScreens: flow.screens.map((screen) => ({
            id: screen.id,
            imageUrl: screen.imageUrl,
            title: screen.title
          })),
          totalScreenCount: flow._count.screens // Total count for badge display
        };
      })
    );

    // Filter out flows without associated apps (this also filters by category if provided)
    const validFlows = flowsWithApps.filter((flow) => flow.app !== null);

    return { success: true, data: validFlows };
  } catch (error) {
    console.error('Failed to fetch flows with previews:', error);
    return { success: false, error: 'Failed to fetch flows with previews' };
  }
}

// Zod schema for profile update
const updateProfileSchema = z.object({
  userId: z.string().cuid('Invalid user ID'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string().email('Invalid email address').max(255, 'Email too long').trim().toLowerCase()
});

// Update user profile
export async function updateProfile(data: {
  userId: string;
  name: string;
  email: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const validated = updateProfileSchema.parse(data);

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: validated.email,
        NOT: {
          id: validated.userId
        }
      }
    });

    if (existingUser) {
      return { success: false, error: 'Email is already in use by another account' };
    }

    // Update the user
    await prisma.user.update({
      where: { id: validated.userId },
      data: {
        name: validated.name,
        email: validated.email
      }
    });

    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return { success: false, error: firstError.message };
    }
    console.error('Failed to update profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}
