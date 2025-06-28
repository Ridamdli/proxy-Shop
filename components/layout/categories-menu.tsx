'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    subcategories: [
      { name: 'Smartphones', slug: 'smartphones' },
      { name: 'Laptops', slug: 'laptops' },
      { name: 'Accessories', slug: 'electronics-accessories' },
    ],
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    subcategories: [
      { name: 'Men', slug: 'mens-clothing' },
      { name: 'Women', slug: 'womens-clothing' },
      { name: 'Kids', slug: 'kids-clothing' },
    ],
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    subcategories: [
      { name: 'Furniture', slug: 'furniture' },
      { name: 'Decor', slug: 'home-decor' },
      { name: 'Kitchen', slug: 'kitchen' },
    ],
  },
];

export function CategoriesMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {categories.map((category) => (
                <div key={category.slug} className="space-y-2">
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className="block text-lg font-medium hover:text-primary"
                  >
                    {category.name}
                  </Link>
                  <ul className="space-y-1">
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory.slug}>
                        <Link
                          href={`/shop?category=${subcategory.slug}`}
                          className="block text-sm text-muted-foreground hover:text-primary"
                        >
                          {subcategory.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}