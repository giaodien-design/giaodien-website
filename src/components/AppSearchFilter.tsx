'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { Search, X } from 'lucide-react';

type Type = {
  id: string;
  name: string;
  slug: string;
};

interface AppSearchFilterProps {
  types: Type[];
  onSearchChange: (search: string) => void;
  onTypeChange: (typeId: string | null) => void;
}

export function AppSearchFilter({ types, onSearchChange, onTypeChange }: AppSearchFilterProps) {
  const t = useTranslations('apps');
  const [searchInput, setSearchInput] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Debounce search với 150ms
  const debouncedSearch = useDebounce(searchInput, 150);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const handleTypeSelect = (typeId: string | null) => {
    setSelectedType(typeId);
    onTypeChange(typeId);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSelectedType(null);
    onSearchChange('');
    onTypeChange(null);
  };

  const hasActiveFilters = searchInput !== '' || selectedType !== null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
        <Input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full pl-10 pr-10 h-11 rounded-lg border-neutral-200"
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Type Filter */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-neutral-700">{t('filterByType')}</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedType === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTypeSelect(null)}
            className="rounded-full"
          >
            {t('allTypes')}
          </Button>
          {types.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTypeSelect(type.id)}
              className="rounded-full"
            >
              {type.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="w-fit text-neutral-600"
        >
          <X className="h-4 w-4 mr-1" />
          {t('clearFilters')}
        </Button>
      )}
    </div>
  );
}

