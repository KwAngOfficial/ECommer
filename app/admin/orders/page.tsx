import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/database";

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const paymentLabels: Record<string, string> = {
  cod: "COD",
  bank_transfer: "Chuyển khoản",
  vnpay: "VNPay",
  momo: "MoMo",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Đơn hàng</h1>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Mã đơn</th>
              <th className="p-3 text-left">Khách hàng</th>
              <th className="p-3 text-left">Tổng</th>
              <th className="p-3 text-left">Thanh toán</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Ngày</th>
              <th className="p-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {(orders as Order[] | null)?.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-3 font-medium">{order.order_code}</td>
                <td className="p-3">
                  <div>{order.customer_name}</div>
                  <div className="text-muted-foreground">{order.customer_phone}</div>
                </td>
                <td className="p-3">{formatPrice(order.total)}</td>
                <td className="p-3">
                  <div>{paymentLabels[order.payment_method]}</div>
                  <Badge variant={order.payment_status === "paid" ? "success" : "warning"}>
                    {order.payment_status}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge variant="secondary">
                    {statusLabels[order.status]}
                  </Badge>
                </td>
                <td className="p-3 text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-3">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/orders/${order.id}`}>Chi tiết</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
