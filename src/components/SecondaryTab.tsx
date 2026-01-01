'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCategories } from '@/lib/actions';

type Category = {
  id: string;
  name: string;
  slug: string;
};

interface SecondaryTabProps {
  selectedCategoryId: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function SecondaryTab({ selectedCategoryId, onCategoryChange }: SecondaryTabProps) {
  const t = useTranslations('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const result = await getCategories();

      if (result.success && result.data) {
        setCategories(result.data);
      }

      setLoading(false);
    };

    fetchCategories();
  }, []);

  // List of available translations
  const availableTranslations = [
    'all',
    'transportation',
    'transport',
    'finance',
    'entertainment',
    'lifestyle',
    'productivity',
    'business',
    'education',
    'social',
    'health',
    'health-fitness',
    'food',
    'food-and-drink',
    'food-drink',
    'shopping',
    'travel',
    'news',
    'utilities',
    'sports',
    'games',
    'music',
    'photo-video',
    'navigation',
    'weather',
    'books',
    'reference',
    'medical'
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

  // Don't render until categories are loaded
  if (loading) {
    return (
      <div className="w-full overflow-x-auto scrollbar-hide py-2">
        <div className="h-10" /> {/* Placeholder height to prevent layout shift */}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-hide flex justify-start items-start">
      <Tabs
        value={selectedCategoryId || 'all'}
        onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}
      >
        <TabsList className="w-full bg-transparent rounded-none p-0 gap-1 h-auto items-start flex">
          <TabsTrigger
            value="all"
            className="text-xl font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {t('secondaryTabs.all')}
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="text-xl font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {getCategoryLabel(category)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
