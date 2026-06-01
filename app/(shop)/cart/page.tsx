"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, selectCartTotal } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Giỏ hàng trống</h1>
        <p className="mt-2 text-muted-foreground">Hãy thêm sản phẩm vào giỏ hàng</p>
        <Button asChild className="mt-6">
          <Link href="/products">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    );
  }

  const shipping = 30000;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Giỏ hàng</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-lg border p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-muted">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    N/A
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <Link href={`/products/${item.slug}`} className="font-medium hover:text-primary">
                  {item.name}
                </Link>
                <p className="text-primary font-semibold">{formatPrice(item.price)}</p>
                <div className="mt-auto flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto text-destructive"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t pt-2">
              <span>Tổng cộng</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>
          <Button asChild className="w-full mt-6" size="lg">
            <Link href="/checkout">Thanh toán</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
