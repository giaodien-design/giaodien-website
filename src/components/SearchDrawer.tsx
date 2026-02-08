'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import {
  AppWindow,
  Layout,
  Component,
  Workflow,
  Sparkles,
  TrendingUp
} from 'lucide-react';

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator
} from '@/components/ui/command';
import { useDebounce } from '@/hooks/useDebounce';
import { searchGlobal } from '@/lib/actions';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

// Types for search results
type AppResult = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
};

type ScreenTypeResult = {
  id: string;
  name: string;
  slug: string;
};

type UIElementResult = {
  id: string;
  name: string;
  slug: string;
};

type FlowResult = {
  id: string;
  name: string;
  description: string | null;
};

type RecommendedData = {
  recommendedApps: AppResult[];
  recommendedScreenTypes: ScreenTypeResult[];
  recommendedUiElements: UIElementResult[];
  recommendedFlows: FlowResult[];
};

type SearchData = {
  apps: AppResult[];
  screenTypes: ScreenTypeResult[];
  uiElements: UIElementResult[];
  flows: FlowResult[];
};

export function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
  const router = useRouter();
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedData, setRecommendedData] = useState<RecommendedData | null>(null);
  const [searchResults, setSearchResults] = useState<SearchData | null>(null);

  // Debounce search query (300ms)
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Single effect to handle all search scenarios
  useEffect(() => {
    if (!isOpen) {
      // Reset state when dialog closes
      setSearchQuery('');
      setSearchResults(null);
      return;
    }

    // Create abort controller for cleanup
    let isCancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await searchGlobal(debouncedQuery);
        
        if (isCancelled) return;
        
        if (result.success && result.data) {
          if (debouncedQuery === '') {
            // Empty query - recommended data
            const data = result.data as RecommendedData;
            setRecommendedData({
              recommendedApps: data.recommendedApps || [],
              recommendedScreenTypes: data.recommendedScreenTypes || [],
              recommendedUiElements: data.recommendedUiElements || [],
              recommendedFlows: data.recommendedFlows || []
            });
            setSearchResults(null);
          } else {
            // Has query - search results
            const data = result.data as SearchData;
            setSearchResults({
              apps: data.apps || [],
              screenTypes: data.screenTypes || [],
              uiElements: data.uiElements || [],
              flows: data.flows || []
            });
            setRecommendedData(null);
          }
        }
      } catch (error) {
        console.error('Search failed:', error);
        // Set empty results on error
        if (!isCancelled) {
          if (debouncedQuery === '') {
            setRecommendedData({
              recommendedApps: [],
              recommendedScreenTypes: [],
              recommendedUiElements: [],
              recommendedFlows: []
            });
          } else {
            setSearchResults({
              apps: [],
              screenTypes: [],
              uiElements: [],
              flows: []
            });
          }
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, debouncedQuery]);

  // Navigation handlers
  const handleSelectApp = (app: AppResult) => {
    router.push(`/${locale}/app/${app.id}`);
    onClose();
  };

  const handleSelectScreenType = (screenType: ScreenTypeResult) => {
    router.push(`/${locale}?screenTypeId=${screenType.id}`);
    onClose();
  };

  const handleSelectUIElement = (uiElement: UIElementResult) => {
    router.push(`/${locale}?uiElementId=${uiElement.id}`);
    onClose();
  };

  const handleSelectFlow = (flow: FlowResult) => {
    router.push(`/${locale}?flowId=${flow.id}`);
    onClose();
  };

  // Check if we have any results
  const hasSearchResults =
    searchResults &&
    (searchResults.apps.length > 0 ||
      searchResults.screenTypes.length > 0 ||
      searchResults.uiElements.length > 0 ||
      searchResults.flows.length > 0);

  const hasRecommendedData =
    recommendedData &&
    (recommendedData.recommendedApps.length > 0 ||
      recommendedData.recommendedScreenTypes.length > 0 ||
      recommendedData.recommendedUiElements.length > 0 ||
      recommendedData.recommendedFlows.length > 0);

  // Only show loading when user is actively searching (has typed something)
  const showLoading = isLoading && searchQuery.length > 0;
  
  // Show recommendations when query is empty (regardless of loading state for initial fetch)
  const showRecommendations = !searchQuery && hasRecommendedData;
  
  // Show search results when there's a query and results exist
  const showSearchResults = debouncedQuery && hasSearchResults && !isLoading;
  
  // Show empty state only when search completed with no results
  const showEmptyState = debouncedQuery && !hasSearchResults && !isLoading;

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder="Search apps, screens, elements, flows..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        {/* Loading state - ONLY when actively searching with text */}
        {showLoading && (
          <div className="py-6 text-center text-sm text-neutral-500">
            <div className="animate-pulse">Searching...</div>
          </div>
        )}

        {/* Empty state - no results for query */}
        {showEmptyState && (
          <CommandEmpty>No results found for &quot;{debouncedQuery}&quot;</CommandEmpty>
        )}

        {/* Recommended data (empty query state) - show immediately */}
        {showRecommendations && (
          <>
            {/* Recommended Apps */}
            {recommendedData.recommendedApps.length > 0 && (
              <CommandGroup heading={<span className="flex items-center gap-2"><Sparkles className="h-3 w-3" /> Recommended Apps</span>}>
                {recommendedData.recommendedApps.map((app) => (
                  <CommandItem
                    key={app.id}
                    value={`app-${app.name}`}
                    onSelect={() => handleSelectApp(app)}
                  >
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200">
                      {app.icon ? (
                        <Image
                          src={app.icon}
                          alt={app.name}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <AppWindow className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className="flex-1">{app.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Trending Screen Types */}
            {recommendedData.recommendedScreenTypes.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading={<span className="flex items-center gap-2"><TrendingUp className="h-3 w-3" /> Trending Screens</span>}>
                  {recommendedData.recommendedScreenTypes.map((screenType) => (
                    <CommandItem
                      key={screenType.id}
                      value={`screenType-${screenType.name}`}
                      onSelect={() => handleSelectScreenType(screenType)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-200">
                        <Layout className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="flex-1">{screenType.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Recommended UI Elements */}
            {recommendedData.recommendedUiElements.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading={<span className="flex items-center gap-2"><Component className="h-3 w-3" /> Popular Elements</span>}>
                  {recommendedData.recommendedUiElements.map((element) => (
                    <CommandItem
                      key={element.id}
                      value={`uiElement-${element.name}`}
                      onSelect={() => handleSelectUIElement(element)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 ring-1 ring-purple-200">
                        <Component className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="flex-1">{element.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Recommended Flows */}
            {recommendedData.recommendedFlows.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading={<span className="flex items-center gap-2"><Workflow className="h-3 w-3" /> Popular Flows</span>}>
                  {recommendedData.recommendedFlows.map((flow) => (
                    <CommandItem
                      key={flow.id}
                      value={`flow-${flow.name}`}
                      onSelect={() => handleSelectFlow(flow)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-200">
                        <Workflow className="h-4 w-4 text-emerald-600" />
                      </div>
                      <span className="flex-1">{flow.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </>
        )}

        {/* Search results (when query has text) */}
        {showSearchResults && (
          <>
            {/* Apps */}
            {searchResults.apps.length > 0 && (
              <CommandGroup heading="Apps">
                {searchResults.apps.map((app) => (
                  <CommandItem
                    key={app.id}
                    value={`app-${app.name}`}
                    onSelect={() => handleSelectApp(app)}
                  >
                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200">
                      {app.icon ? (
                        <Image
                          src={app.icon}
                          alt={app.name}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <AppWindow className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span>{app.name}</span>
                      {app.description && (
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {app.description}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Screen Types */}
            {searchResults.screenTypes.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Screen Types">
                  {searchResults.screenTypes.map((screenType) => (
                    <CommandItem
                      key={screenType.id}
                      value={`screenType-${screenType.name}`}
                      onSelect={() => handleSelectScreenType(screenType)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-200">
                        <Layout className="h-4 w-4 text-blue-600" />
                      </div>
                      <span>{screenType.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* UI Elements */}
            {searchResults.uiElements.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="UI Elements">
                  {searchResults.uiElements.map((element) => (
                    <CommandItem
                      key={element.id}
                      value={`uiElement-${element.name}`}
                      onSelect={() => handleSelectUIElement(element)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 ring-1 ring-purple-200">
                        <Component className="h-4 w-4 text-purple-600" />
                      </div>
                      <span>{element.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Flows */}
            {searchResults.flows.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Flows">
                  {searchResults.flows.map((flow) => (
                    <CommandItem
                      key={flow.id}
                      value={`flow-${flow.name}`}
                      onSelect={() => handleSelectFlow(flow)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 ring-1 ring-emerald-200">
                        <Workflow className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex flex-col">
                        <span>{flow.name}</span>
                        {flow.description && (
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {flow.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </>
        )}
      </CommandList>

      {/* Footer with keyboard hints */}
      <div className="border-t border-neutral-200 px-4 py-3 bg-neutral-50">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">↑↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">↵</kbd>
              <span>Select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">Esc</kbd>
              <span>Close</span>
            </span>
          </div>
          <span className="hidden sm:flex items-center gap-1">
            <kbd className="rounded bg-neutral-200 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">⌘K</kbd>
            <span>to open anytime</span>
          </span>
        </div>
      </div>
    </CommandDialog>
  );
}
