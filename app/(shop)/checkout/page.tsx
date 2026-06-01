"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { createOrder } from "@/lib/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PaymentMethod } from "@/types/database";

const SHIPPING_FEE = 30000;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotalFromStore = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );
  const clearCart = useCartStore((s) => s.clearCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Giỏ hàng trống</p>
        <Button className="mt-4" onClick={() => router.push("/products")}>
          Mua sắm ngay
        </Button>
      </div>
    );
  }

  const subtotal = subtotalFromStore;
  const total = subtotal + SHIPPING_FEE;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const result = await createOrder({
      customerName: form.get("name") as string,
      customerPhone: form.get("phone") as string,
      customerEmail: (form.get("email") as string) || undefined,
      shippingAddress: form.get("address") as string,
      note: (form.get("note") as string) || undefined,
      paymentMethod,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    clearCart();

    if (paymentMethod === "vnpay" && result.orderId) {
      const res = await fetch("/api/payments/vnpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: result.orderId, amount: result.total }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    }

    if (paymentMethod === "momo" && result.orderId) {
      const res = await fetch("/api/payments/momo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: result.orderId, amount: result.total }),
      });
      const data = await res.json();
      if (data.payUrl) {
        window.location.href = data.payUrl;
        return;
      }
    }

    router.push(`/checkout/success?code=${result.orderCode}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Thanh toán</h1>
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Thông tin giao hàng</h2>
          <div>
            <Label htmlFor="name">Họ tên *</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="phone">Số điện thoại *</Label>
            <Input id="phone" name="phone" type="tel" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" />
          </div>
          <div>
            <Label htmlFor="address">Địa chỉ giao hàng *</Label>
            <Textarea id="address" name="address" required rows={3} />
          </div>
          <div>
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea id="note" name="note" rows={2} />
          </div>

          <h2 className="text-lg font-semibold pt-4">Phương thức thanh toán</h2>
          <div className="space-y-2">
            {(
              [
                { value: "cod", label: "Thanh toán khi nhận hàng (COD)" },
                { value: "bank_transfer", label: "Chuyển khoản ngân hàng" },
                { value: "vnpay", label: "VNPay (thẻ/QR)" },
                { value: "momo", label: "Ví MoMo" },
              ] as const
            ).map(({ value, label }) => (
              <label
                key={value}
                className="flex items-center gap-3 rounded-md border p-3 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <input
                  type="radio"
                  name="payment"
                  value={value}
                  checked={paymentMethod === value}
                  onChange={() => setPaymentMethod(value)}
                />
                {label}
              </label>
            ))}
          </div>

          {paymentMethod === "bank_transfer" && (
            <div className="rounded-md bg-muted p-4 text-sm">
              <p className="font-medium">Thông tin chuyển khoản:</p>
              <p>Ngân hàng: {process.env.NEXT_PUBLIC_BANK_NAME || "Vietcombank"}</p>
              <p>Số TK: {process.env.NEXT_PUBLIC_BANK_ACCOUNT || "0123456789"}</p>
              <p>Chủ TK: {process.env.NEXT_PUBLIC_BANK_HOLDER || "NGUYEN VAN A"}</p>
              <p className="mt-2 text-muted-foreground">
                Nội dung CK: Mã đơn hàng + SĐT của bạn
              </p>
            </div>
          )}
        </div>

        <div className="rounded-lg border p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Đơn hàng</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>{item.name} x{item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí ship</span>
              <span>{formatPrice(SHIPPING_FEE)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>
          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đặt hàng"}
          </Button>
        </div>
      </form>
    </div>
  );
}
