import { notFound } from "next/navigation";
import { fetchProductBySlug } from "@/lib/data/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { SetupBanner } from "@/components/shop/setup-banner";
import type { Product } from "@/types/database";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isSupabaseConfigured()) return { title: "Sản phẩm | ECommer" };
  const { product } = await fetchProductBySlug(slug);
  return { title: product ? `${product.name} | ECommer` : "Sản phẩm" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SetupBanner />
      </div>
    );
  }

  const { product, error } = await fetchProductBySlug(slug);
  if (!product) notFound();

  const p = product as Product;
  const effectivePrice = getEffectivePrice(p.price, p.sale_price);
  const images = p.product_images || [];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {error && <SetupBanner message={`Lỗi: ${error}`} />}
      <div className="grid gap-10 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-2 md:p-8">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
          {images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[0].url}
              alt={p.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Chưa có ảnh
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{p.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(effectivePrice)}
            </span>
            {p.sale_price && p.sale_price < p.price && (
              <span className="text-xl text-muted-foreground line-through">
                {formatPrice(p.price)}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Còn {p.stock} sản phẩm
          </p>
          {p.description && (
            <p className="mt-6 whitespace-pre-wrap text-muted-foreground">
              {p.description}
            </p>
          )}
          <div className="mt-8">
            <AddToCartButton
              productId={p.id}
              name={p.name}
              price={effectivePrice}
              slug={p.slug}
              imageUrl={images[0]?.url}
              disabled={p.stock === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
