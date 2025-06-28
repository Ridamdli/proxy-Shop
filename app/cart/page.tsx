'use client';

import { useCart } from '@/components/providers/cart-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, updateCartItem, removeFromCart, total } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-4 text-2xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">Add some products to your cart to get started</p>
          <Button asChild className="mt-8">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    if (quantity === 0) {
      await removeFromCart(itemId);
    } else {
      await updateCartItem(itemId, quantity);
    }
  };

  const handleCheckout = () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/cart');
      return;
    }
    // TODO: Implement checkout flow
    router.push('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="text-lg font-medium hover:text-blue-600 transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  {item.variant && (
                    <p className="text-sm text-gray-600">
                      Variant: {item.variant.name}
                    </p>
                  )}
                  <p className="text-lg font-bold">
                    {formatPrice(item.variant?.price || item.product.price)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            <Button
              className="w-full mt-6"
              size="lg"
              onClick={handleCheckout}
            >
              {session ? 'Proceed to Checkout' : 'Sign in to Checkout'}
            </Button>
            <Button
              variant="outline"
              className="w-full mt-2"
              asChild
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}