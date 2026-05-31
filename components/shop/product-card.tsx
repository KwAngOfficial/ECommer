"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const effectivePrice = getEffectivePrice(product.price, product.sale_price);
  const imageUrl = product.product_images?.[0]?.url;
  const hasDiscount = product.sale_price != null && product.sale_price < product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: effectivePrice,
      slug: product.slug,
      imageUrl,
    });
  };

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
        <div className="relative aspect-square bg-muted">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute left-2 top-2" variant="destructive">
              Sale
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge className="absolute right-2 top-2" variant="secondary">
              Hết hàng
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 font-medium">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(effectivePrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            className="mt-3 w-full"
            disabled={product.stock === 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Thêm vào giỏ
          </Button>
        </div>
      </div>
    </Link>
  );
}
