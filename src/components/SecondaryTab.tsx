'use client';

import { useTranslations } from 'next-intl';

interface SecondaryTabItemProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function SecondaryTabItem({ label, selected, onClick }: SecondaryTabItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center shrink-0 px-2 py-1 rounded-lg ${
        selected 
          ? 'bg-secondary-bg text-primary-fg' 
          : 'bg-transparent text-tertiary-fg hover:text-primary-fg'
      }`}
    >
      <span className="text-xs leading-none whitespace-pre text-nowrap uppercase">{label}</span>
    </button>
  );
}

interface SecondaryTabProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function SecondaryTab({ categories, selectedCategoryId, onCategoryChange }: SecondaryTabProps) {
  const t = useTranslations('categories');
  
  // List of available translations
  const availableTranslations = [
    'all', 'transportation', 'finance', 'entertainment', 
    'lifestyle', 'productivity', 'business', 'education',
    'social', 'health', 'food', 'shopping', 'travel', 
    'news', 'utilities', 'sports'
  ];
  
  // Helper function to get category label with fallback
  const getCategoryLabel = (category: { name: string; slug: string }): string => {
    // Check if translation exists for this slug
    if (availableTranslations.includes(category.slug)) {
      return t(`secondaryTabs.${category.slug}` as 'secondaryTabs.all');
    }
    // Fallback to category name from database if translation doesn't exist
    return category.name;
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide pl-4 pt-2 sm:pl-6 sm:pt-2">
      <div className="flex gap-2 items-start">
        <SecondaryTabItem
          label={t('secondaryTabs.all')}
          selected={selectedCategoryId === null}
          onClick={() => onCategoryChange(null)}
        />
        {categories.slice(0, 4).map((category) => (
          <SecondaryTabItem
            key={category.id}
            label={getCategoryLabel(category)}
            selected={selectedCategoryId === category.id}
            onClick={() => onCategoryChange(category.id)}
          />
        ))}
      </div>
    </div>
  );
}

