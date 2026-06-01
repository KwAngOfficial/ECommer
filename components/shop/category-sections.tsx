import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import type { Category, Product } from "@/types/database";

interface CategorySection {
  category: Category;
  products: Product[];
}

interface CategorySectionsProps {
  sections: CategorySection[];
  uncategorized: Product[];
}

export function CategorySections({
  sections,
  uncategorized,
}: CategorySectionsProps) {
  const allSections = [
    ...sections,
    ...(uncategorized.length > 0
      ? [
          {
            category: {
              id: "other",
              name: "Sản phẩm khác",
              slug: "khac",
              description: null,
              parent_id: null,
              created_at: "",
            } as Category,
            products: uncategorized,
          },
        ]
      : []),
  ];

  if (allSections.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Chưa có sản phẩm nào.</p>
        <Button asChild className="mt-4">
          <Link href="/products">Xem cửa hàng</Link>
        </Button>
      </section>
    );
  }

  return (
    <div className="space-y-14 py-12">
      {allSections.map(({ category, products }) => (
        <section key={category.id} className="container mx-auto px-4">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{category.name}</h2>
              {category.description && (
                <p className="mt-1 text-sm text-slate-500">{category.description}</p>
              )}
            </div>
            {category.id !== "other" && (
              <Button asChild variant="ghost" className="shrink-0 text-primary">
                <Link href={`/products?category=${category.id}`}>
                  Xem tất cả
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
