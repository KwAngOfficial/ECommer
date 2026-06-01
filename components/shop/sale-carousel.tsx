"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { formatPrice, getDiscountPercent, getEffectivePrice } from "@/lib/utils";
import { useAddToCart } from "@/lib/hooks/use-add-to-cart";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/database";

interface SaleCarouselProps {
  products: Product[];
}

export function SaleCarousel({ products }: SaleCarouselProps) {
  const [index, setIndex] = useState(0);
  const addToCart = useAddToCart();

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % products.length);
  }, [products.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [products.length, next]);

  if (products.length === 0) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-orange-500 to-amber-500 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg font-medium opacity-90">Chưa có sản phẩm khuyến mãi</p>
          <Button asChild variant="secondary" className="mt-6">
            <Link href="/products">Xem tất cả sản phẩm</Link>
          </Button>
        </div>
      </section>
    );
  }

  const product = products[index];
  const imageUrl = product.product_images?.[0]?.url;
  const salePrice = getEffectivePrice(product.price, product.sale_price);
  const discount = getDiscountPercent(product.price, salePrice);

  return (
    <section className="relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0 bg-gradient-to-r from-rose-600/90 via-orange-600/80 to-transparent" />
      <div className="container relative mx-auto px-4 py-10 md:py-14">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              Flash Sale
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              Ưu đãi hot hôm nay
            </h2>
          </div>
          {products.length > 1 && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                aria-label="Trước"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
                aria-label="Sau"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="relative aspect-square max-h-[360px] overflow-hidden rounded-2xl bg-white/10 md:mx-auto md:w-full">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-white/60">
                Chưa có ảnh
              </div>
            )}
            <span className="absolute left-4 top-4 rounded-lg bg-rose-500 px-3 py-1 text-sm font-bold text-white">
              -{discount}%
            </span>
          </div>

          <div className="text-white">
            <h3 className="text-2xl font-bold md:text-4xl">{product.name}</h3>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <span className="text-3xl font-bold md:text-4xl">
                {formatPrice(salePrice)}
              </span>
              <span className="text-lg text-white/70 line-through">
                {formatPrice(product.price)}
              </span>
            </div>
            <p className="mt-4 line-clamp-3 text-white/80">
              {product.description || "Sản phẩm đang giảm giá — mua ngay kẻo lỡ!"}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                type="button"
                size="lg"
                className="bg-white text-rose-600 hover:bg-white/90"
                disabled={product.stock === 0}
                onClick={() =>
                  addToCart({
                    productId: product.id,
                    name: product.name,
                    price: salePrice,
                    slug: product.slug,
                    imageUrl,
                  })
                }
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Thêm vào giỏ
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10"
              >
                <Link href={`/products/${product.slug}`}>Xem chi tiết</Link>
              </Button>
            </div>
          </div>
        </div>

        {products.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {products.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-white" : "w-2 bg-white/40"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
