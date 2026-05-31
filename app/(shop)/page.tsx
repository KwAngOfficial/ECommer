import Link from "next/link";
import { fetchActiveProducts } from "@/lib/data/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ProductCard } from "@/components/shop/product-card";
import { SetupBanner } from "@/components/shop/setup-banner";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/database";

export default async function HomePage() {
  const configured = isSupabaseConfigured();
  const { products, error } = configured
    ? await fetchActiveProducts(8)
    : { products: [], error: "NOT_CONFIGURED" };

  return (
    <div>
      {error === "NOT_CONFIGURED" && <SetupBanner />}
      {error && error !== "NOT_CONFIGURED" && (
        <SetupBanner message={`Lỗi database: ${error}. Kiểm tra đã chạy migration SQL trên Supabase chưa.`} />
      )}

      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Mua sắm dễ dàng, giao hàng nhanh chóng
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Hàng ngàn sản phẩm chất lượng. Thanh toán COD, chuyển khoản, VNPay, MoMo.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/products">Khám phá ngay</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
          <Button variant="outline" asChild>
            <Link href="/products">Xem tất cả</Link>
          </Button>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {(products as Product[]).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            <p>Chưa có sản phẩm. Admin có thể thêm tại /admin/products</p>
          </div>
        )}
      </section>
    </div>
  );
}
