"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartIconBadge() {
  // Use only the Zustand store
  const { count, refreshCart } = useCartStore();
  // Add client-side state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  // Sync with the server on mount
  useEffect(() => {
    setMounted(true);
    refreshCart();
  }, [refreshCart]);

  return (
    <div className="relative inline-flex items-center">
      <Link href="/cart">
        <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-gray-900 transition-colors" />
      </Link>
      {/* Only render the count badge on the client side after mounting */}
      {mounted && count > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
          {count}
        </span>
      )}
    </div>
  );
}
