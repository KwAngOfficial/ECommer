"use client";

import { useCartStore } from "@/lib/cart-store";
import type { CartItemLocal } from "@/types/database";

export function useAddToCart() {
  const addItem = useCartStore((s) => s.addItem);

  return (item: Omit<CartItemLocal, "quantity">, qty = 1) => {
    addItem(item, qty);
  };
}
