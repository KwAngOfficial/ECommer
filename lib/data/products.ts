import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isOnSale } from "@/lib/utils";
import type { Product } from "@/types/database";

type FetchResult = {
  products: Product[];
  error: string | null;
};

export async function fetchActiveProducts(limit?: number): Promise<FetchResult> {
  if (!isSupabaseConfigured()) {
    return { products: [], error: "NOT_CONFIGURED" };
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return { products: [], error: "NOT_CONFIGURED" };
  }

  try {
    let query = supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error("[fetchActiveProducts]", error.message);
      return { products: [], error: error.message };
    }

    return { products: (data as Product[]) ?? [], error: null };
  } catch (err) {
    console.error("[fetchActiveProducts]", err);
    return { products: [], error: "SERVER_ERROR" };
  }
}

export async function fetchProductBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    return { product: null, error: "NOT_CONFIGURED" };
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return { product: null, error: "NOT_CONFIGURED" };
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error) {
      console.error("[fetchProductBySlug]", error.message);
      return { product: null, error: error.message };
    }

    return { product: data as Product | null, error: null };
  } catch (err) {
    console.error("[fetchProductBySlug]", err);
    return { product: null, error: "SERVER_ERROR" };
  }
}

export async function fetchHomeCatalog() {
  const { products, error } = await fetchActiveProducts();
  const { categories, error: catError } = await fetchCategories();

  const saleProducts = products.filter((p) =>
    isOnSale(p.price, p.sale_price)
  );

  const categorySections = categories
    .map((category) => ({
      category,
      products: products
        .filter((p) => p.category_id === category.id)
        .slice(0, 8),
    }))
    .filter((section) => section.products.length > 0);

  const uncategorized = products.filter((p) => !p.category_id).slice(0, 8);

  return {
    saleProducts,
    categorySections,
    uncategorized,
    error: error || catError,
  };
}

export async function fetchCategories() {
  if (!isSupabaseConfigured()) {
    return { categories: [], error: "NOT_CONFIGURED" };
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return { categories: [], error: "NOT_CONFIGURED" };
  }

  try {
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error) return { categories: [], error: error.message };
    return { categories: data ?? [], error: null };
  } catch {
    return { categories: [], error: "SERVER_ERROR" };
  }
}
