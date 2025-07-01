'use client';

import { useCartStoreInit } from '@/hooks/use-cart-store-init';

/**
 * Component that initializes the cart store
 * This should be included in the app layout to ensure the cart is initialized on every page
 */
export function CartStoreInitializer() {
  // Initialize the cart store
  useCartStoreInit();
  
  // This component doesn't render anything
  return null;
}