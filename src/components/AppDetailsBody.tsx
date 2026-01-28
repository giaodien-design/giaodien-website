'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ExternalLink, Search, Lock, Crown } from 'lucide-react';

interface AppDetailsBodyProps {
  app: {
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    platform?: string | null;
    isPremium?: boolean;
    category?: {
      id: string;
      name: string;
      slug: string;
    } | null;
    brandColor?: string | null;
    websiteUrl?: string | null;
    updatedAt?: Date | string;
    screens?: {
      id: string;
      title: string;
      description?: string | null;
      imageUrl: string;
      flow?: {
        id: string;
        name: string;
        sortOrder: number;
      } | null;
      order: number;
    }[];
    versions?: {
      id: string;
      name: string;
      createdAt: Date | string;
      _count: {
        screens: number;
      };
    }[];
    currentVersion?: {
      id: string;
      name: string;
      createdAt: Date | string;
    } | null;
  };
  /** Whether the user can access full content */
  canAccess?: boolean;
  /** Reason for access denial */
  accessReason?: string;
  /** Whether user is logged in */
  isLoggedIn?: boolean;
}

export function AppDetailsBody({ app, canAccess = true, accessReason, isLoggedIn = false }: AppDetailsBodyProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<'screens' | 'flows'>('screens');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle version switching
  const handleVersionChange = (versionId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (versionId) {
      params.set('version', versionId);
    } else {
      params.delete('version');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  // Helper function to validate image URLs
  const getValidImageUrl = (url: string | null | undefined, fallback: string): string => {
    if (!url) return fallback;
    if (url.startsWith('/')) return url;

    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'giaodien-website-image.s3.ap-southeast-1.amazonaws.com') {
        return url;
      }
      return fallback;
    } catch {
      return fallback;
    }
  };

  const formattedScreens = useMemo(() => {
    if (app.screens?.length) {
      return app.screens.map((screen, index) => ({
        id: screen.id || `screen-${index + 1}`,
        title: screen.title || `Screen ${index + 1}`,
        description: screen.description,
        imageUrl: getValidImageUrl(screen.imageUrl, '/images/sample-img.png'),
        screenType: screen.flow?.name || 'Ungrouped',
        flow: screen.flow,
        order: screen.order
      }));
    }
    return [];
  }, [app.screens]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredScreens = useMemo(() => {
    if (!normalizedSearch) {
      return formattedScreens;
    }
    return formattedScreens.filter((screen) => {
      const haystack = `${screen.title} ${screen.screenType ?? ''}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [formattedScreens, normalizedSearch]);

  const computedFlowGroups = useMemo(() => {
    if (!formattedScreens.length) {
      return [];
    }

    const groupsMap = new Map<string, { id: string; name: string; screens: typeof formattedScreens; sortOrder: number }>();

    formattedScreens.forEach((screen) => {
      const flow = (screen as any).flow;
      const key = flow?.name || 'Ungrouped';
      const groupId = flow?.id || 'ungrouped';
      
      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          id: groupId,
          name: key,
          screens: [],
          sortOrder: flow?.sortOrder ?? 999
        });
      }
      groupsMap.get(key)!.screens.push(screen);
    });

    return Array.from(groupsMap.values())
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return a.name.localeCompare(b.name);
      })
      .map(({ sortOrder, ...group }) => group);
  }, [formattedScreens]);

  const filteredFlowGroups = useMemo(() => {
    if (!normalizedSearch) {
      return computedFlowGroups;
    }

    return computedFlowGroups
      .map((group) => ({
        ...group,
        screens: group.screens.filter((screen) =>
          `${screen.title} ${screen.screenType ?? ''}`.toLowerCase().includes(normalizedSearch)
        )
      }))
      .filter((group) => group.screens.length);
  }, [computedFlowGroups, normalizedSearch]);

  const websiteHref = app.websiteUrl
    ? /^https?:\/\//i.test(app.websiteUrl)
      ? app.websiteUrl
      : `https://${app.websiteUrl}`
    : null;

  return (
    <div className="w-full">
      {/* Hero Header - Clean & Spacious */}
      <section className="px-4 sm:px-8 lg:px-12 pt-8 pb-10 sm:pt-12 sm:pb-14">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            {/* App Icon */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-neutral-100 ring-1 ring-neutral-200 flex-shrink-0 shadow-sm">
              <Image
                src={getValidImageUrl(app.icon, '/images/sample-app-thumbnail.png')}
                alt={app.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>

            {/* App Info */}
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <div className="flex flex-col gap-2">
                {/* Name + Version */}
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-900 tracking-tight">
                    {app.name}
                  </h1>
                  {app.currentVersion && (
                    <div className="flex items-center gap-1">
                      <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-sm text-neutral-600 font-medium">
                        v{app.currentVersion.name}
                      </span>
                      {app.versions && app.versions.length > 1 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <ChevronDown className="h-4 w-4 text-neutral-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {app.versions.map((version) => (
                              <DropdownMenuItem
                                key={version.id}
                                onClick={() => handleVersionChange(version.id)}
                                className={app.currentVersion?.id === version.id ? 'bg-neutral-100' : ''}
                              >
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-sm font-medium">v{version.name}</span>
                                  <span className="text-xs text-neutral-500">
                                    {version._count.screens} screen{version._count.screens !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg text-neutral-500 max-w-2xl leading-relaxed">
                  {app.description || 'No description provided'}
                </p>
              </div>

              {/* Meta Tags */}
              <div className="flex flex-wrap items-center gap-2">
                {app.isPremium && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium shadow-sm">
                    <Crown className="w-3.5 h-3.5" />
                    Premium
                  </span>
                )}
                {app.category && (
                  <span className="px-3 py-1.5 rounded-full bg-neutral-900 text-white text-sm font-medium">
                    {app.category.name}
                  </span>
                )}
                {app.platform && (
                  <span className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-sm font-medium">
                    {formatPlatform(app.platform)}
                  </span>
                )}
                {formattedScreens.length > 0 && (
                  <span className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-sm font-medium">
                    {formattedScreens.length} screen{formattedScreens.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Website Button */}
            {websiteHref && (
              <div className="flex-shrink-0">
                <Button asChild variant="outline" className="gap-2">
                  <Link href={websiteHref} target="_blank" rel="noopener noreferrer">
                    Visit Website
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Toolbar - Views & Search */}
      <section className="sticky top-0 z-30 bg-white px-4 sm:px-8 lg:px-12 py-4">
        <div className="max-w-[1800px] mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'screens' | 'flows')}>
            <TabsList className="bg-neutral-100">
              <TabsTrigger value="screens">Screens</TabsTrigger>
              <TabsTrigger value="flows">Flows</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={activeView === 'screens' ? 'Search screens...' : 'Search flows...'}
              className="pl-9 bg-neutral-50 border-neutral-200"
            />
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="max-w-[1800px] mx-auto">
          {!canAccess ? (
            // Premium Locked State
            <div className="relative">
              {/* Teaser: Show first 3 screens with blur overlay */}
              {formattedScreens.length > 0 && (
                <div className="relative">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 sm:gap-8 lg:gap-10">
                    {formattedScreens.slice(0, 3).map((screen) => (
                      <div key={screen.id} className="relative">
                        <div className="blur-sm pointer-events-none select-none">
                          <ScreenCard imageUrl={screen.imageUrl} title={screen.title} />
                        </div>
                      </div>
                    ))}
                    {/* Placeholder cards to show there's more content */}
                    {formattedScreens.length > 3 && Array.from({ length: Math.min(3, formattedScreens.length - 3) }).map((_, i) => (
                      <div key={`placeholder-${i}`} className="relative opacity-30">
                        <div className="blur-md pointer-events-none select-none">
                          <ScreenCard imageUrl="/images/sample-img.png" title="" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white pointer-events-none" />
                </div>
              )}

              {/* Premium CTA Overlay */}
              <div className="relative -mt-32 sm:-mt-40 flex flex-col items-center justify-center py-16 sm:py-20 px-6 text-center">
                <div className="flex flex-col items-center gap-6 max-w-md">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-200">
                    <Crown className="w-8 h-8 text-white" />
                  </div>

                  {/* Badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    Premium Content
                  </span>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-semibold text-neutral-900">
                    This is a Premium App
                  </h3>

                  {/* Description */}
                  <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
                    {accessReason === 'LOGIN_REQUIRED' 
                      ? 'Please log in and upgrade to Premium to view all screens and flows in this app.'
                      : 'Upgrade to Premium to unlock all screens and flows in this app.'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span className="flex items-center gap-1.5">
                      <span className="font-semibold text-neutral-900">{formattedScreens.length}</span> screens
                    </span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300" />
                    <span className="flex items-center gap-1.5">
                      <span className="font-semibold text-neutral-900">{computedFlowGroups.length}</span> flows
                    </span>
                  </div>

                  {/* CTA Button */}
                  <Button asChild size="lg" className="mt-2 gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-200/50">
                    <Link href="/pricing">
                      <Crown className="w-4 h-4" />
                      {accessReason === 'LOGIN_REQUIRED' ? 'Log in to Upgrade' : 'Upgrade to Premium'}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : activeView === 'screens' ? (
            filteredScreens.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 sm:gap-8 lg:gap-10">
                {filteredScreens.map((screen) => (
                  <ScreenCard key={screen.id} imageUrl={screen.imageUrl} title={screen.title} />
                ))}
              </div>
            ) : (
              <EmptyState label="No screens match your search." />
            )
          ) : filteredFlowGroups.length ? (
            <div className="flex flex-col gap-20">
              {filteredFlowGroups.map((group) => (
                <div key={group.id} className="flex flex-col gap-8">
                  {/* Flow Header */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {group.screens.length} screen{group.screens.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Flow Screens */}
                  {group.screens.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 sm:gap-8 lg:gap-10">
                      {group.screens
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        .map((screen) => (
                          <ScreenCard key={`${group.id}-${screen.id}`} imageUrl={screen.imageUrl} title={screen.title} />
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState label="No flows available yet." />
          )}
        </div>
      </section>
    </div>
  );
}

function ScreenCard({ imageUrl, title }: { imageUrl: string; title: string }) {
  return (
    <div className="group flex flex-col gap-4">
      {/* Card Container - Matching Homepage Gallery Style */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200/60 bg-neutral-50 transition-all duration-300 ease-out group-hover:shadow-lg group-hover:shadow-neutral-200/50 group-hover:-translate-y-1">
        {/* Screen Image with Padding */}
        <div className="relative flex items-center justify-center px-6 py-8 sm:px-8 sm:py-10">
          <div className="relative w-full max-w-[160px] aspect-[9/19.5] rounded-[20px] overflow-hidden shadow-xl shadow-neutral-900/10 ring-1 ring-neutral-900/5">
            <Image
              src={imageUrl}
              alt={title || 'App screen preview'}
              fill
              className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 140px, 160px"
            />
          </div>
        </div>
      </div>

      {/* Screen Title - Subtle Typography */}
      {title && (
        <p className="text-sm font-medium text-muted-foreground truncate px-1">
          {title}
        </p>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-neutral-50 py-20 px-6 text-center">
      <p className="text-base text-neutral-500">{label}</p>
    </div>
  );
}

function formatPlatform(platform: string) {
  const normalized = platform.toLowerCase();
  if (normalized === 'ios') return 'iOS';
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}
