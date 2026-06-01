import { fetchActiveProducts, fetchCategories } from "@/lib/data/products";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ProductCard } from "@/components/shop/product-card";
import { SetupBanner } from "@/components/shop/setup-banner";
import type { Product } from "@/types/database";

export const metadata = { title: "Sản phẩm | ECommer" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SetupBanner />
        <h1 className="mt-8 text-3xl font-bold">Sản phẩm</h1>
      </div>
    );
  }

  const { categories } = await fetchCategories();
  const { products: allProducts, error } = await fetchActiveProducts();

  let products = allProducts;
  if (q) {
    products = products.filter((p) =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
  }
  if (category) {
    products = products.filter((p) => p.category_id === category);
  }

  const activeCategory = categories.find((c) => c.id === category);

  return (
    <div>
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {activeCategory ? activeCategory.name : "Tất cả sản phẩm"}
          </h1>
          <p className="mt-2 text-slate-500">
            {products.length} sản phẩm
            {q ? ` cho "${q}"` : ""}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && <SetupBanner message={`Lỗi: ${error}`} />}

        <form className="mb-8 flex flex-wrap gap-3 rounded-2xl border bg-white p-4 shadow-sm">
          <input
            name="q"
            defaultValue={q}
            placeholder="Tìm kiếm sản phẩm..."
            className="flex h-11 flex-1 min-w-[200px] rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <select
            name="category"
            defaultValue={category}
            className="h-11 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm"
          >
            <option value="">Tất cả danh mục</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-11 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Lọc
          </button>
        </form>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {(products as Product[]).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-muted-foreground">
            Không tìm thấy sản phẩm nào.
          </p>
        )}
      </div>
    </div>
  );
}
