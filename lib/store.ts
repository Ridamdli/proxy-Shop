import { create } from "zustand";
import { toast } from "react-hot-toast";

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: Array<{
      url: string;
      altText?: string;
    }>;
  };
  variant?: {
    id: string;
    name: string;
    price?: number;
  };
}

interface CartState {
  items: CartItem[];
  count: number;
  total: number;
  loading: boolean;
  isItemInCart: (productId: string) => boolean;
  addToCart: (
    productId: string,
    quantity?: number,
    variantId?: string,
  ) => Promise<any>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

// Helper to load cart from localStorage
const loadCartFromStorage = (): {
  items: CartItem[];
  count: number;
  total: number;
} => {
  if (typeof window === "undefined") return { items: [], count: 0, total: 0 };

  try {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      return JSON.parse(storedCart);
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }

  return { items: [], count: 0, total: 0 };
};

// Helper to save cart to localStorage
const saveCartToStorage = (cart: {
  items: CartItem[];
  count: number;
  total: number;
}) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  // Initialize with values from localStorage
  ...loadCartFromStorage(),
  loading: false,

  isItemInCart: (productId: string) => {
    return get().items.some((item) => item.productId === productId);
  },

  addToCart: async (
    productId: string,
    quantity: number = 1,
    variantId?: string,
  ) => {
    set({ loading: true });
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity, variantId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      const data = await response.json();
      const newState = {
        items: [...get().items, data.item],
        count: data.count,
        total: data.total,
        loading: false,
      };

      set(newState);
      saveCartToStorage(newState);

      toast.success("Product added to cart!", {
        position: "top-center",
        icon: "✅",
      });

      return data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      set({ loading: false });
      toast.error("Failed to add to cart", {
        position: "top-center",
      });
      throw error;
    }
  },

  removeFromCart: async (itemId: string) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await get().refreshCart();
        toast.success("Product removed from cart!", {
          position: "top-center",
          icon: "🗑️",
        });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart", {
        position: "top-center",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateCartItem: async (itemId: string, quantity: number) => {
    set({ loading: true });
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await get().refreshCart();
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  clearCart: async () => {
    set({ loading: true });
    try {
      // Clear all items
      await Promise.all(
        get().items.map((item) => get().removeFromCart(item.id)),
      );
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  refreshCart: async () => {
    set({ loading: true });
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        const newState = {
          items: data.items,
          count: data.count,
          total: data.total,
          loading: false,
        };

        set(newState);
        saveCartToStorage(newState);
      }
    } catch (error) {
      console.error("Error refreshing cart:", error);
      // If API call fails, try to load from localStorage as fallback
      const storedCart = loadCartFromStorage();
      set({ ...storedCart, loading: false });
    }
  },
}));
