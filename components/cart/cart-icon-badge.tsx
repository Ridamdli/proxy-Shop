'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/providers/cart-provider';
import Link from 'next/link';

export function CartIconBadge() {
  const { count } = useCart();

  return (
    <Link href="/cart" className="relative inline-flex items-center">
      <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-gray-900 transition-colors" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
          {count}
        </span>
      )}
    </Link>
  );
}