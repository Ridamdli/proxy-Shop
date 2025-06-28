'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FilterSidebar } from './filter-sidebar';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FilterHandlerProps {
  categories: Category[];
}

export function FilterHandler({ categories }: FilterHandlerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (filters: {
    categories: string[];
    priceRange: [number, number];
  }) => {
    const url = new URL(window.location.href);

    // Update category filter
    if (filters.categories.length > 0) {
      url.searchParams.set('category', filters.categories.join(','));
    } else {
      url.searchParams.delete('category');
    }

    // Update price range
    if (filters.priceRange[0] > 0) {
      url.searchParams.set('minPrice', filters.priceRange[0].toString());
    } else {
      url.searchParams.delete('minPrice');
    }

    if (filters.priceRange[1] < 1000) {
      url.searchParams.set('maxPrice', filters.priceRange[1].toString());
    } else {
      url.searchParams.delete('maxPrice');
    }

    // Reset to first page when filters change
    url.searchParams.delete('page');

    // Preserve sort parameter if it exists
    const sort = searchParams.get('sort');
    if (sort) {
      url.searchParams.set('sort', sort);
    }

    router.push(url.pathname + url.search);
  };

  return (
    <FilterSidebar
      categories={categories}
      onFilterChange={handleFilterChange}
    />
  );
}