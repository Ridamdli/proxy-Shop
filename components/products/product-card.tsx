'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/components/providers/cart-provider';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/utils';

interface ProductImage {
  url: string;
  altText?: string;
  isPrimary: boolean;
}

interface ProductVariant {
  id: string;
  name: string;
  price?: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  shortDescription?: string;
  quantity: number;
  isFeatured: boolean;
  ratingAverage: number;
  ratingCount: number;
  images: ProductImage[];
  variants?: ProductVariant[];
  category?: {
    name: string;
  };
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const result = await addToCart(product.id, 1);
      if (result) {
        toast.success('Added to cart!');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please sign in to add to wishlist');
      return;
    }
    // TODO: Implement wishlist functionality
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Card className={`group hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <div className="aspect-square relative bg-gray-100">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText || product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Eye className="h-12 w-12" />
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs">
                -{discountPercentage}%
              </Badge>
            )}
            {product.isFeatured && (
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
            )}
            {product.quantity === 0 && (
              <Badge variant="outline" className="text-xs bg-white">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-gray-100"
            onClick={handleToggleWishlist}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>

          {/* Quick Add to Cart */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={handleAddToCart}
              disabled={loading || product.quantity === 0}
              className="w-full bg-white text-gray-900 hover:bg-gray-100"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {loading ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <div className="space-y-2">
            {/* Category */}
            {product.category && (
              <p className="text-sm text-gray-500">{product.category.name}</p>
            )}

            {/* Product Name */}
            <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            {product.ratingCount > 0 && (
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(Number(product.ratingAverage))
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  ({product.ratingCount})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.comparePrice!)}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.shortDescription}
              </p>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}