import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateOrderStatusAction } from "@/lib/actions/admin-orders";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const updateStatus = updateOrderStatusAction.bind(null, id);

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/orders">← Quay lại</Link>
        </Button>
        <h1 className="text-3xl font-bold">Đơn {order.order_code}</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border p-6">
          <h2 className="font-semibold">Thông tin khách</h2>
          <p><strong>Tên:</strong> {order.customer_name}</p>
          <p><strong>SĐT:</strong> {order.customer_phone}</p>
          <p><strong>Email:</strong> {order.customer_email || "—"}</p>
          <p><strong>Địa chỉ:</strong> {order.shipping_address}</p>
          {order.note && <p><strong>Ghi chú:</strong> {order.note}</p>}
        </div>

        <div className="space-y-4 rounded-lg border p-6">
          <h2 className="font-semibold">Cập nhật trạng thái</h2>
          <form action={updateStatus} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Trạng thái đơn</label>
              <select
                name="status"
                defaultValue={order.status}
                className="mt-1 flex h-10 w-full rounded-md border px-3 text-sm"
              >
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipping">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Thanh toán</label>
              <select
                name="payment_status"
                defaultValue={order.payment_status}
                className="mt-1 flex h-10 w-full rounded-md border px-3 text-sm"
              >
                <option value="pending">Chờ thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="failed">Thất bại</option>
                <option value="refunded">Hoàn tiền</option>
              </select>
            </div>
            <Button type="submit">Cập nhật</Button>
          </form>
        </div>
      </div>

      <div className="mt-8 rounded-lg border p-6">
        <h2 className="font-semibold mb-4">Chi tiết sản phẩm</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="pb-2 text-left">Sản phẩm</th>
              <th className="pb-2 text-right">SL</th>
              <th className="pb-2 text-right">Giá</th>
              <th className="pb-2 text-right">Tổng</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items?.map((item: {
              id: string;
              product_name: string;
              quantity: number;
              product_price: number;
              subtotal: number;
            }) => (
              <tr key={item.id} className="border-t">
                <td className="py-2">{item.product_name}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{formatPrice(item.product_price)}</td>
                <td className="py-2 text-right">{formatPrice(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-end gap-8 text-sm">
          <span>Phí ship: {formatPrice(order.shipping_fee)}</span>
          <span className="text-lg font-bold">
            Tổng: {formatPrice(order.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
