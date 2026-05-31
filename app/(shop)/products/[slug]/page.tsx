import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import type { Product } from "@/types/database";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("name")
    .eq("slug", slug)
    .single();
  return { title: data ? `${data.name} | ECommer` : "Sản phẩm" };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const p = product as Product;
  const effectivePrice = getEffectivePrice(p.price, p.sale_price);
  const images = p.product_images || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {images[0] ? (
            <Image
              src={images[0].url}
              alt={p.name}
              fill
              className="object-cover"
              priority
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
            <p className="mt-6 text-muted-foreground whitespace-pre-wrap">
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
