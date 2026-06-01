import { fetchCategories } from "@/lib/data/products";
import { ShopHeader } from "@/components/shop/header";
import type { NavCategory } from "@/components/shop/products-nav";

export async function ShopHeaderWithCategories() {
  const { categories } = await fetchCategories();

  const navCategories: NavCategory[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return <ShopHeader categories={navCategories} />;
}
