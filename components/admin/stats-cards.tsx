import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";

interface StatsCardsProps {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}

export function StatsCards({
  totalRevenue,
  totalOrders,
  totalProducts,
  totalUsers,
}: StatsCardsProps) {
  const stats = [
    { title: "Doanh thu", value: formatPrice(totalRevenue), icon: DollarSign },
    { title: "Đơn hàng", value: totalOrders.toString(), icon: ShoppingBag },
    { title: "Sản phẩm", value: totalProducts.toString(), icon: Package },
    { title: "Người dùng", value: totalUsers.toString(), icon: Users },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ title, value, icon: Icon }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
