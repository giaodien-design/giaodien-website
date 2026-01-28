'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown, X, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  name: string;
  slug?: string;
}

interface FilterDropdownProps {
  title: string;
  paramKey: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
}

function FilterDropdown({ title, paramKey, options, selectedValues, onSelectionChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const count = selectedValues.length;
  const isActive = count > 0;

  // Get display label based on selection count
  const getDisplayLabel = () => {
    if (count === 0) {
      return title;
    }
    if (count === 1) {
      const selected = options.find((opt) => opt.id === selectedValues[0]);
      return selected?.name || title;
    }
    return `${title} (${count})`;
  };

  // Toggle item selection
  const handleToggle = (optionId: string) => {
    const isSelected = selectedValues.includes(optionId);
    if (isSelected) {
      onSelectionChange(selectedValues.filter((id) => id !== optionId));
    } else {
      onSelectionChange([...selectedValues, optionId]);
    }
  };

  // Clear all selections
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange([]);
  };

  // Filter options based on search query
  const filteredOptions = options.filter((option) => option.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'h-9 rounded-full px-4 py-2 text-sm font-medium transition-all gap-1.5',
            isActive
              ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800 hover:border-neutral-800'
              : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400'
          )}
        >
          <span className="truncate max-w-[150px]">{getDisplayLabel()}</span>
          {isActive ? (
            <X
              className="h-3.5 w-3.5 shrink-0 opacity-80 hover:opacity-100"
              onClick={handleClear}
            />
          ) : (
            <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 transition-transform', open && 'rotate-180')} />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No {title.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.id);
                return (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    onSelect={() => handleToggle(option.id)}
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-neutral-300 bg-white'
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <span className="truncate text-neutral-900">{option.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          {isActive && (
            <div className="border-t border-neutral-200 bg-neutral-50 p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                onClick={() => {
                  onSelectionChange([]);
                  setOpen(false);
                }}
              >
                Clear selection
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface FilterBarProps {
  categories?: FilterOption[];
  screenTypes?: FilterOption[];
  uiElements?: FilterOption[];
  flows?: FilterOption[];
}

export function FilterBar({ categories = [], screenTypes = [], uiElements = [], flows = [] }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse comma-separated URL params into arrays
  const parseParamToArray = (key: string): string[] => {
    const value = searchParams.get(key);
    if (!value) return [];
    return value.split(',').filter(Boolean);
  };

  // Read current filter values from URL
  const selectedCategories = parseParamToArray('categoryId');
  const selectedScreenTypes = parseParamToArray('screenTypeId');
  const selectedUIElements = parseParamToArray('uiElementId');
  const selectedFlows = parseParamToArray('flowId');

  // Update URL search params when filter changes
  const updateFilter = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      if (values.length > 0) {
        params.set(key, values.join(','));
      } else {
        params.delete(key);
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Conditional visibility logic (the "Pivot")
  const hasFlow = selectedFlows.length > 0;
  const hasScreenAttrs = selectedScreenTypes.length > 0 || selectedUIElements.length > 0;

  // Determine which filters to show
  const showScreenTypeFilter = !hasFlow;
  const showUIElementFilter = !hasFlow;
  const showFlowFilter = !hasScreenAttrs;

  // Check if any filters are active
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedScreenTypes.length > 0 ||
    selectedUIElements.length > 0 ||
    selectedFlows.length > 0;

  const handleResetFilters = () => {
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="sticky top-0 z-40 w-full bg-white px-6 py-3">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {/* Categories - always visible */}
        {categories.length > 0 && (
          <FilterDropdown
            title="Categories"
            paramKey="categoryId"
            options={categories}
            selectedValues={selectedCategories}
            onSelectionChange={(values) => updateFilter('categoryId', values)}
          />
        )}

        {/* Screen Types - hidden when Flow is active */}
        {screenTypes.length > 0 && showScreenTypeFilter && (
          <FilterDropdown
            title="Screen Types"
            paramKey="screenTypeId"
            options={screenTypes}
            selectedValues={selectedScreenTypes}
            onSelectionChange={(values) => updateFilter('screenTypeId', values)}
          />
        )}

        {/* UI Elements - hidden when Flow is active */}
        {uiElements.length > 0 && showUIElementFilter && (
          <FilterDropdown
            title="UI Elements"
            paramKey="uiElementId"
            options={uiElements}
            selectedValues={selectedUIElements}
            onSelectionChange={(values) => updateFilter('uiElementId', values)}
          />
        )}

        {/* Flows - hidden when Screen Type or UI Element is active */}
        {flows.length > 0 && showFlowFilter && (
          <FilterDropdown
            title="Flows"
            paramKey="flowId"
            options={flows}
            selectedValues={selectedFlows}
            onSelectionChange={(values) => updateFilter('flowId', values)}
          />
        )}

        {/* Reset button */}
        {hasActiveFilters && (
          <Button
            onClick={handleResetFilters}
            variant="ghost"
            size="sm"
            className="h-9 rounded-full px-4 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <X className="h-3.5 w-3.5 mr-1.5" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
