'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function EmptyState() {
  const router = useRouter();
  const pathname = usePathname();

  const handleClearFilters = () => {
    router.replace(pathname);
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 w-full gap-4">
      <p className="text-black text-lg">No apps match your filters.</p>
      <Button onClick={handleClearFilters} variant="outline" className="bg-gray-200 text-black">
        Clear all filters
      </Button>
    </div>
  );
}

