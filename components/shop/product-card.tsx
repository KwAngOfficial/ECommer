"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, getDiscountPercent, getEffectivePrice } from "@/lib/utils";
import { useAddToCart } from "@/lib/hooks/use-add-to-cart";
import { isOnSale } from "@/lib/utils";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact }: ProductCardProps) {
  const addToCart = useAddToCart();
  const effectivePrice = getEffectivePrice(product.price, product.sale_price);
  const imageUrl = product.product_images?.[0]?.url;
  const onSale = isOnSale(product.price, product.sale_price);
  const discount = onSale
    ? getDiscountPercent(product.price, effectivePrice)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: effectivePrice,
      slug: product.slug,
      imageUrl,
    });
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-slate-100"
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Chưa có ảnh
          </div>
        )}
        {onSale && (
          <span className="absolute left-2 top-2 rounded-md bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute right-2 top-2 rounded-md bg-slate-800/80 px-2 py-0.5 text-xs text-white">
            Hết hàng
          </span>
        )}
      </Link>

      <div className={`flex flex-1 flex-col ${compact ? "p-3" : "p-4"}`}>
        <Link href={`/products/${product.slug}`}>
          <h3
            className={`line-clamp-2 font-semibold text-slate-900 hover:text-primary ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className={`font-bold text-primary ${compact ? "text-base" : "text-lg"}`}>
            {formatPrice(effectivePrice)}
          </span>
          {onSale && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        <Button
          type="button"
          size="sm"
          className="mt-auto w-full pt-3"
          disabled={product.stock === 0}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Thêm vào giỏ
        </Button>
      </div>
    </article>
  );
}
