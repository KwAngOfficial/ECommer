"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItemLocal } from "@/types/database";

interface CartStore {
  items: CartItemLocal[];
  toastMessage: string | null;
  addItem: (item: Omit<CartItemLocal, "quantity">, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  clearToast: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      toastMessage: null,
      addItem: (item, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          const items = existing
            ? state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              )
            : [...state.items, { ...item, quantity: qty }];

          return {
            items,
            toastMessage: `Đã thêm "${item.name}" vào giỏ hàng`,
          };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      clearToast: () => set({ toastMessage: null }),
    }),
    {
      name: "ecommer-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function selectCartItemCount(state: CartStore): number {
  return state.items.reduce((sum, i) => sum + i.quantity, 0);
}

export function selectCartTotal(state: CartStore): number {
  return state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
