import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { dynamic } from "@/lib/supabase/route-config";
import { updateProfile } from "@/lib/actions/auth";
import { SetupBanner } from "@/components/shop/setup-banner";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { orderStatusLabels } from "@/lib/order-labels";
import type { Order } from "@/types/database";
import { ChevronRight } from "lucide-react";

export { dynamic };

export default async function AccountPage() {
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
                <Link key={order.id} href={`/account/orders/${order.id}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{order.order_code}</span>
                        <Badge variant="secondary">
                          {orderStatusLabels[order.status] || order.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("vi-VN")}
                        {order.order_items && order.order_items.length > 0 && (
                          <> · {order.order_items.length} sản phẩm</>
                        )}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="font-semibold text-primary">
                          {formatPrice(order.total)}
                        </p>
                        <span className="flex items-center text-sm text-primary">
                          Xem chi tiết
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
