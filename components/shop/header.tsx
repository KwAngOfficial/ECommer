"use client";

import Link from "next/link";
import { ShoppingCart, Search, User, Menu } from "lucide-react";
import { useCartStore, selectCartItemCount } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { ProductsNav, type NavCategory } from "@/components/shop/products-nav";
import { useEffect, useState } from "react";

interface ShopHeaderProps {
  categories: NavCategory[];
}

export function ShopHeader({ categories }: ShopHeaderProps) {
  const itemCount = useCartStore(selectCartItemCount);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
            E
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Commer
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition hover:text-primary"
          >
            Trang chủ
          </Link>
          <ProductsNav categories={categories} />
          <Link
            href="/account"
            className="text-sm font-medium text-slate-600 transition hover:text-primary"
          >
            Tài khoản
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild className="hidden md:flex">
            <Link href="/products">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/account">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/" onClick={closeMobile} className="font-medium">
              Trang chủ
            </Link>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Sản phẩm
              </p>
              <ProductsNav
                categories={categories}
                variant="mobile"
                onNavigate={closeMobile}
              />
            </div>
            <Link href="/account" onClick={closeMobile} className="font-medium">
              Tài khoản
            </Link>
            <Link href="/cart" onClick={closeMobile} className="font-medium text-primary">
              Giỏ hàng {mounted && itemCount > 0 ? `(${itemCount})` : ""}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
