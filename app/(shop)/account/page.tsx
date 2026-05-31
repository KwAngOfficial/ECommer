import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/actions/auth";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/types/database";

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Tài khoản</h1>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateProfile} className="space-y-4">
              <div>
                <Label htmlFor="full_name">Họ tên</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={profile?.full_name || ""}
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={profile?.phone || ""}
                />
              </div>
              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={profile?.address || ""}
                />
              </div>
              <Button type="submit">Cập nhật</Button>
            </form>
            {profile?.role === "admin" && (
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href="/admin">Vào Admin Panel</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Lịch sử đơn hàng</h2>
          {!orders || orders.length === 0 ? (
            <p className="text-muted-foreground">Chưa có đơn hàng nào.</p>
          ) : (
            <div className="space-y-4">
              {(orders as Order[]).map((order) => (
                <Card key={order.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{order.order_code}</span>
                      <Badge variant="secondary">
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="mt-2 font-semibold text-primary">
                      {formatPrice(order.total)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
