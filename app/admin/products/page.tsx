import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, getEffectivePrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteProduct } from "@/lib/actions/products";
import type { Product } from "@/types/database";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sản phẩm</h1>
        <Button asChild>
          <Link href="/admin/products/new">Thêm sản phẩm</Link>
        </Button>
      </div>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Ảnh</th>
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Giá</th>
              <th className="p-3 text-left">Tồn kho</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {(products as Product[] | null)?.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <div className="relative h-12 w-12 rounded bg-muted overflow-hidden">
                    {p.product_images?.[0] ? (
                      <Image
                        src={p.product_images[0].url}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">
                  {formatPrice(getEffectivePrice(p.price, p.sale_price))}
                </td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  <Badge variant={p.is_active ? "success" : "secondary"}>
                    {p.is_active ? "Đang bán" : "Ẩn"}
                  </Badge>
                </td>
                <td className="p-3 flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/admin/products/${p.id}`}>Sửa</Link>
                  </Button>
                  <form action={deleteProduct.bind(null, p.id)}>
                    <Button size="sm" variant="destructive" type="submit">
                      Xóa
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!products || products.length === 0) && (
          <p className="p-8 text-center text-muted-foreground">Chưa có sản phẩm</p>
        )}
      </div>
    </div>
  );
}
