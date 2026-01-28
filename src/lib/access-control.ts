import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';

/**
 * Check if the system-wide Premium feature is active.
 * This is heavily cached since it's called on every page load.
 * 
 * Returns true if PREMIUM_ACTIVE is "true", false otherwise.
 */
export const checkSystemPremiumStatus = cache(async (): Promise<boolean> => {
  return getSystemPremiumStatusCached();
});

// Use unstable_cache for cross-request caching with a 60-second revalidation
const getSystemPremiumStatusCached = unstable_cache(
  async (): Promise<boolean> => {
    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key: 'PREMIUM_ACTIVE' },
      });
      
      return config?.value === 'true';
    } catch (error) {
      console.error('Error checking system premium status:', error);
      // Default to false (free mode) if there's an error
      return false;
    }
  },
  ['system-premium-status'],
  {
    revalidate: 60, // Revalidate every 60 seconds
    tags: ['system-config'],
  }
);

/**
 * Check if a user can access a specific app.
 * 
 * Logic:
 * 1. If System Premium is FALSE (soft launch mode) -> Everyone can access
 * 2. If System Premium is TRUE:
 *    - If app is NOT premium -> Everyone can access
 *    - If app IS premium -> Only PREMIUM users can access
 * 
 * @param userId - The user's ID (undefined if not logged in)
 * @param isAppPremium - Whether the app is marked as premium
 * @returns Object with canAccess boolean and optional reason
 */
export async function checkAppAccess(
  userId: string | undefined,
  isAppPremium: boolean
): Promise<{ canAccess: boolean; reason?: string }> {
  // Step 1: Check system premium status
  const isSystemPremiumActive = await checkSystemPremiumStatus();
  
  // Step 2: If system premium is OFF (soft launch), everyone has access
  if (!isSystemPremiumActive) {
    return { canAccess: true };
  }
  
  // Step 3: If system premium is ON but app is not premium, everyone has access
  if (!isAppPremium) {
    return { canAccess: true };
  }
  
  // Step 4: App is premium and system premium is ON - check user subscription
  if (!userId) {
    return { 
      canAccess: false, 
      reason: 'LOGIN_REQUIRED' 
    };
  }
  
  // Fetch user subscription status
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        subscriptionStatus: true,
        subscriptionEndDate: true 
      },
    });
    
    if (!user) {
      return { 
        canAccess: false, 
        reason: 'USER_NOT_FOUND' 
      };
    }
    
    // Check if user has premium subscription
    if (user.subscriptionStatus === 'PREMIUM') {
      // Optionally check if subscription has expired
      if (user.subscriptionEndDate && user.subscriptionEndDate < new Date()) {
        return { 
          canAccess: false, 
          reason: 'SUBSCRIPTION_EXPIRED' 
        };
      }
      return { canAccess: true };
    }
    
    return { 
      canAccess: false, 
      reason: 'UPGRADE_REQUIRED' 
    };
  } catch (error) {
    console.error('Error checking user subscription:', error);
    // Default to no access on error for premium content
    return { 
      canAccess: false, 
      reason: 'ERROR' 
    };
  }
}

/**
 * Get a SystemConfig value by key.
 * Cached for performance.
 */
export const getSystemConfig = cache(async (key: string): Promise<string | null> => {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key },
    });
    return config?.value ?? null;
  } catch (error) {
    console.error(`Error fetching system config "${key}":`, error);
    return null;
  }
});
