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

  return (
    <div className="container mx-auto px-4 py-8">
      {error && <SetupBanner message={`Lỗi database: ${error}`} />}
      <h1 className="mb-6 text-3xl font-bold">Sản phẩm</h1>

      <form className="mb-8 flex flex-wrap gap-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm kiếm sản phẩm..."
          className="flex h-10 flex-1 min-w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <select
          name="category"
          defaultValue={category}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
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
          className="h-10 rounded-md bg-primary px-4 text-sm text-primary-foreground"
        >
          Lọc
        </button>
      </form>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {(products as Product[]).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          Không tìm thấy sản phẩm nào.
        </p>
      )}
    </div>
  );
}
