'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { getSearchSuggestions } from '@/lib/actions';

type Suggestion = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  icon: string | null;
};

export function SearchWithSuggestions() {
  const t = useTranslations('header');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 300);

  // Fetch suggestions when debounced search changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearch.length < 2) {
        setSuggestions([]);
        setOpen(false);
        return;
      }

      setIsLoading(true);
      const result = await getSearchSuggestions(debouncedSearch);
      
      if (result.success && result.data) {
        setSuggestions(result.data);
        setOpen(result.data.length > 0);
      }
      setIsLoading(false);
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setSearchInput('');
    }
  }, [router]);

  const handleSelectSuggestion = useCallback((suggestion: Suggestion) => {
    handleSearch(suggestion.name);
  }, [handleSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(searchInput);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full group transition-transform duration-200 ease-in-out hover:translate-y-[1px] active:translate-y-[1px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('searchPlaceholder')}
            className="w-full md:w-48 lg:w-80 h-10 md:h-9 rounded-md border-t border-l border-r border-b-2 border-neutral-200 pl-10 pr-10 text-sm text-neutral-500 placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-indigo-500 hover:border-b active:border-b transition-all duration-200 ease-in-out touch-manipulation"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-neutral-500 pointer-events-none" />
          )}
        </div>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0" 
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandList>
            <CommandEmpty>{t('noResults')}</CommandEmpty>
            <CommandGroup heading={t('suggestions')}>
              {suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion.id}
                  onSelect={() => handleSelectSuggestion(suggestion)}
                  className="cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Search className="h-4 w-4 text-indigo-500" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{suggestion.name}</p>
                      {suggestion.description && (
                        <p className="text-xs text-neutral-500 truncate">
                          {suggestion.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}


