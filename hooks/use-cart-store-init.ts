'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/lib/store';

/**
 * Custom hook to initialize the cart store
 * This ensures the cart data is loaded from the server on initial page load
 */
export function useCartStoreInit() {
  const { refreshCart } = useCartStore();

  useEffect(() => {
    // Initialize the cart store by fetching data from the server
    refreshCart();
  }, [refreshCart]);

  return null;
}