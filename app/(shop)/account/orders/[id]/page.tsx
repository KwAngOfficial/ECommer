import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { dynamic } from "@/lib/supabase/route-config";
import { formatPrice } from "@/lib/utils";
import {
  orderStatusLabels,
  paymentMethodLabels,
  paymentStatusLabels,
  getOrderStatusSteps,
  type OrderStatusStep,
} from "@/lib/order-labels";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SetupBanner } from "@/components/shop/setup-banner";
import { Check, Package, Truck, X } from "lucide-react";
import type { Order } from "@/types/database";

export { dynamic };

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SetupBanner />
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?redirect=/account/orders/${id}`);

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  const o = order as Order;
  const isCancelled = o.status === "cancelled";
  const orderSteps: OrderStatusStep[] = isCancelled
    ? []
    : getOrderStatusSteps(o.status).steps;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button asChild variant="outline" size="sm" className="mb-6">
        <Link href="/account">← Quay lại tài khoản</Link>
      </Button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Đơn hàng {o.order_code}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Đặt ngày{" "}
            {new Date(o.created_at).toLocaleString("vi-VN", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
        </div>
        <Badge
          variant={o.status === "cancelled" ? "destructive" : "secondary"}
          className="text-sm"
        >
          {orderStatusLabels[o.status] || o.status}
        </Badge>
      </div>

      {isCancelled ? (
        <Card className="mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 pt-6">
            <X className="h-5 w-5 text-destructive" />
            <p className="text-sm">Đơn hàng đã bị hủy.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Tình trạng đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {orderSteps.map((step) => (
                <li key={step.key} className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      step.done
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.key === "shipping" ? (
                      <Truck className="h-4 w-4" />
                    ) : step.key === "delivered" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Package className="h-4 w-4" />
                    )}
                  </span>
                  <span
                    className={
                      step.active ? "font-semibold text-primary" : "text-muted-foreground"
                    }
                  >
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sản phẩm đã mua</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 text-left font-medium">Sản phẩm</th>
                  <th className="p-3 text-right font-medium">SL</th>
                  <th className="p-3 text-right font-medium">Đơn giá</th>
                  <th className="p-3 text-right font-medium">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {o.order_items?.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="p-3">{item.product_name}</td>
                    <td className="p-3 text-right">{item.quantity}</td>
                    <td className="p-3 text-right">{formatPrice(item.product_price)}</td>
                    <td className="p-3 text-right font-medium">
                      {formatPrice(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="space-y-2 border-t p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span>{formatPrice(o.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span>{formatPrice(o.shipping_fee)}</span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatPrice(o.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin giao hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Người nhận: </span>
              {o.customer_name}
            </p>
            <p>
              <span className="text-muted-foreground">SĐT: </span>
              {o.customer_phone}
            </p>
            {o.customer_email && (
              <p>
                <span className="text-muted-foreground">Email: </span>
                {o.customer_email}
              </p>
            )}
            <p>
              <span className="text-muted-foreground">Địa chỉ: </span>
              {o.shipping_address}
            </p>
            {o.note && (
              <p>
                <span className="text-muted-foreground">Ghi chú: </span>
                {o.note}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Phương thức: </span>
              {paymentMethodLabels[o.payment_method] || o.payment_method}
            </p>
            <p className="flex items-center gap-2">
              <span className="text-muted-foreground">Trạng thái: </span>
              <Badge variant={o.payment_status === "paid" ? "default" : "secondary"}>
                {paymentStatusLabels[o.payment_status] || o.payment_status}
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
