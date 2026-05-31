import { createClient } from "@/lib/supabase/server";
import { StatsCards } from "@/components/admin/stats-cards";
import { RevenueChart } from "@/components/admin/revenue-chart";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("total, payment_status, created_at, status");

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const paidOrders = orders?.filter((o) => o.payment_status === "paid") || [];
  const totalRevenue =
  orders
    ?.filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total), 0) || 0;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const chartData = last7Days.map((date) => {
    const dayOrders =
      orders?.filter(
        (o) =>
          o.created_at.startsWith(date) && o.status !== "cancelled"
      ) || [];
    return {
      date: date.slice(5),
      revenue: dayOrders.reduce((s, o) => s + Number(o.total), 0),
      orders: dayOrders.length,
    };
  });

  const topProducts = await supabase
    .from("order_items")
    .select("product_name, quantity");

  const productSales: Record<string, number> = {};
  topProducts.data?.forEach((item) => {
    productSales[item.product_name] =
      (productSales[item.product_name] || 0) + item.quantity;
  });

  const bestSellers = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      <StatsCards
        totalRevenue={totalRevenue}
        totalOrders={orders?.length || 0}
        totalProducts={productCount || 0}
        totalUsers={userCount || 0}
      />
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <RevenueChart data={chartData} />
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Sản phẩm bán chạy</h2>
          {bestSellers.length === 0 ? (
            <p className="text-muted-foreground text-sm">Chưa có dữ liệu</p>
          ) : (
            <ol className="space-y-2">
              {bestSellers.map(([name, qty], i) => (
                <li key={name} className="flex justify-between text-sm">
                  <span>{i + 1}. {name}</span>
                  <span className="font-medium">{qty} đã bán</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Đơn đã thanh toán online: {paidOrders.length}
      </p>
    </div>
  );
}
