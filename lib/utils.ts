import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function getEffectivePrice(price: number, salePrice: number | null): number {
  return salePrice != null && salePrice < price ? salePrice : price;
}

export function generateOrderCode(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DH${y}${m}${d}${rand}`;
}

export function isOnSale(price: number, salePrice: number | null): boolean {
  return salePrice != null && Number(salePrice) < Number(price);
}

export function getDiscountPercent(price: number, salePrice: number): number {
  if (price <= 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
