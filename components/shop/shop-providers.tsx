"use client";

import { CartToast } from "@/components/shop/cart-toast";

export function ShopProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartToast />
    </>
  );
}
