import { prisma } from './prisma';
import Cookies from 'js-cookie';

const CART_SESSION_KEY = 'cart_session_id';

// Generate or get session ID for anonymous users
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  let sessionId = Cookies.get(CART_SESSION_KEY);
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now();
    Cookies.set(CART_SESSION_KEY, sessionId, { expires: 30, path: '/' }); // 30 days
  }
  return sessionId;
};

export const cartService = {
  // Add item to cart
  async addToCart(
    productId: string, 
    quantity: number = 1, 
    variantId?: string,
    userId?: string
  ) {
    const sessionId = userId ? null : getSessionId();
    
    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        productId,
        variantId: variantId || null,
        ...(userId ? { userId } : { sessionId })
      }
    });
    
    if (existingItem) {
      // Update quantity if item exists
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { 
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: {
            include: {
              images: true
            }
          },
          variant: true
        }
      });
    } else {
      // Insert new item
      return await prisma.cartItem.create({
        data: {
          userId: userId || null,
          sessionId,
          productId,
          variantId: variantId || null,
          quantity,
        },
        include: {
          product: {
            include: {
              images: true
            }
          },
          variant: true
        }
      });
    }
  },

  // Get cart items
  async getCartItems(userId?: string) {
    const sessionId = userId ? null : getSessionId();
    
    return await prisma.cartItem.findMany({
      where: userId ? { userId } : { sessionId },
      include: {
        product: {
          include: {
            images: true
          }
        },
        variant: true
      }
    });
  },

  // Update cart item quantity
  async updateCartItem(itemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(itemId);
    }
    
    return await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          include: {
            images: true
          }
        },
        variant: true
      }
    });
  },

  // Remove item from cart
  async removeFromCart(itemId: string) {
    return await prisma.cartItem.delete({
      where: { id: itemId }
    });
  },

  // Clear entire cart
  async clearCart(userId?: string) {
    const sessionId = userId ? null : getSessionId();
    
    return await prisma.cartItem.deleteMany({
      where: userId ? { userId } : { sessionId }
    });
  },

  // Get cart total
  async getCartTotal(userId?: string): Promise<{ count: number; total: number }> {
    const items = await this.getCartItems(userId);
    
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => {
      const price = item.variant?.price || item.product.price;
      return sum + (Number(price) * item.quantity);
    }, 0);
    
    return { count, total };
  },

  // Merge anonymous cart with user cart when user logs in
  async mergeCart(userId: string) {
    const sessionId = getSessionId();
    
    // Get anonymous cart items
    const anonymousItems = await prisma.cartItem.findMany({
      where: {
        sessionId,
        userId: null
      }
    });
    
    if (anonymousItems.length === 0) {
      return;
    }
    
    // Get user's existing cart items
    const userItems = await prisma.cartItem.findMany({
      where: { userId }
    });
    
    for (const anonymousItem of anonymousItems) {
      // Check if user already has this item
      const existingUserItem = userItems.find(
        item => 
          item.productId === anonymousItem.productId &&
          item.variantId === anonymousItem.variantId
      );
      
      if (existingUserItem) {
        // Update quantity
        await prisma.cartItem.update({
          where: { id: existingUserItem.id },
          data: { 
            quantity: existingUserItem.quantity + anonymousItem.quantity
          }
        });
        
        // Delete anonymous item
        await prisma.cartItem.delete({
          where: { id: anonymousItem.id }
        });
      } else {
        // Move item to user cart
        await prisma.cartItem.update({
          where: { id: anonymousItem.id },
          data: { 
            userId,
            sessionId: null
          }
        });
      }
    }
  },
};