"use client";

import Link from "next/link";
import { ShoppingCart, Search, User, Menu } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { ProductsNav, type NavCategory } from "@/components/shop/products-nav";
import { useState } from "react";

interface ShopHeaderProps {
  categories: NavCategory[];
}

export function ShopHeader({ categories }: ShopHeaderProps) {
  const totalItems = useCartStore((s) => s.totalItems());
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          ECommer
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Trang chủ
          </Link>
          <ProductsNav categories={categories} />
          <Link href="/account" className="text-sm font-medium hover:text-primary">
            Tài khoản
          </Link>
        </nav>

        <div className="flex items-center gap-2">
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
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {totalItems}
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
        <nav className="border-t px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/" onClick={closeMobile}>
              Trang chủ
            </Link>
            <div>
              <p className="mb-2 font-medium">Sản phẩm</p>
              <ProductsNav
                categories={categories}
                variant="mobile"
                onNavigate={closeMobile}
              />
            </div>
            <Link href="/account" onClick={closeMobile}>
              Tài khoản
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
