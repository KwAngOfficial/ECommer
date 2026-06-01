import Link from "next/link";
import { fetchHomeCatalog } from "@/lib/data/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { SaleCarousel } from "@/components/shop/sale-carousel";
import { CategorySections } from "@/components/shop/category-sections";
import { SetupBanner } from "@/components/shop/setup-banner";
import { Button } from "@/components/ui/button";
import { Truck, ShieldCheck, Headphones } from "lucide-react";
import type { Product } from "@/types/database";

export default async function HomePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div>
        <SetupBanner />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold">Chào mừng đến ECommer</h1>
          <p className="mt-2 text-muted-foreground">Cấu hình Supabase để hiển thị sản phẩm.</p>
        </div>
      </div>
    );
  }

  const { saleProducts, categorySections, uncategorized, error } =
    await fetchHomeCatalog();

  const carouselProducts =
    saleProducts.length > 0
      ? saleProducts
      : categorySections.flatMap((s) => s.products).slice(0, 6);

  return (
    <div>
      {error && error !== "NOT_CONFIGURED" && (
        <SetupBanner message={`Lỗi tải sản phẩm: ${error}`} />
      )}

      <SaleCarousel products={carouselProducts as Product[]} />

      <section className="border-b bg-slate-50">
        <div className="container mx-auto grid gap-6 px-4 py-8 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Giao hàng toàn quốc</p>
              <p className="text-sm text-slate-500">Phí ship 30.000đ</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Thanh toán an toàn</p>
              <p className="text-sm text-slate-500">COD, CK, VNPay, MoMo</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Hỗ trợ 24/7</p>
              <p className="text-sm text-slate-500">Hotline: 1900 xxxx</p>
            </div>
          </div>
        </div>
      </section>

      <CategorySections
        sections={categorySections}
        uncategorized={uncategorized as Product[]}
      />

      <section className="bg-gradient-to-r from-primary to-orange-500 py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Khám phá thêm hàng ngàn sản phẩm</h2>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link href="/products">Xem tất cả sản phẩm</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
