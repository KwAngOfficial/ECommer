"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavCategory = {
  id: string;
  name: string;
  slug: string;
};

interface ProductsNavProps {
  categories: NavCategory[];
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export function ProductsNav({
  categories,
  variant = "desktop",
  onNavigate,
}: ProductsNavProps) {
  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-1">
        <Link
          href="/products"
          className="font-medium hover:text-primary"
          onClick={onNavigate}
        >
          Tất cả sản phẩm
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.id}`}
            className="pl-3 text-sm text-muted-foreground hover:text-primary"
            onClick={onNavigate}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="group relative">
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm font-medium hover:text-primary"
      >
        Sản phẩm
        <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
      </Link>

      <div
        className={cn(
          "invisible absolute left-0 top-full z-50 pt-2 opacity-0",
          "transition-all duration-150 group-hover:visible group-hover:opacity-100"
        )}
      >
        <div className="min-w-[200px] rounded-md border bg-background py-2 shadow-lg">
          <Link
            href="/products"
            className="block px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Tất cả sản phẩm
          </Link>
          {categories.length > 0 ? (
            <>
              <div className="my-1 border-t" />
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {cat.name}
                </Link>
              ))}
            </>
          ) : (
            <p className="px-4 py-2 text-xs text-muted-foreground">
              Chưa có danh mục
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
