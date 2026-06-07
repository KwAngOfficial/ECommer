import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProduct } from "@/lib/actions/products";
import { ProductImageUpload } from "@/components/admin/product-image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; updated?: string }>;
}) {
  const { id } = await params;
  const { error, updated } = await searchParams;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const { data: categories } = await supabase.from("categories").select("*");
  const updateWithId = updateProduct.bind(null, id);

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/products">← Quay lại</Link>
        </Button>
        <h1 className="text-3xl font-bold">Sửa: {product.name}</h1>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {updated && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Đã lưu thay đổi sản phẩm.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <form action={updateWithId} className="space-y-4">
          <div>
            <Label htmlFor="name">Tên</Label>
            <Input id="name" name="name" defaultValue={product.name} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Giá</Label>
              <Input id="price" name="price" type="number" defaultValue={product.price} required />
            </div>
            <div>
              <Label htmlFor="sale_price">Giá KM</Label>
              <Input id="sale_price" name="sale_price" type="number" defaultValue={product.sale_price || ""} />
            </div>
          </div>
          <div>
            <Label htmlFor="stock">Tồn kho</Label>
            <Input id="stock" name="stock" type="number" defaultValue={product.stock} required />
          </div>
          <div>
            <Label htmlFor="category_id">Danh mục</Label>
            <select
              id="category_id"
              name="category_id"
              defaultValue={product.category_id || ""}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Không có</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" name="description" defaultValue={product.description || ""} rows={4} />
          </div>
          <div>
            <Label>Trạng thái</Label>
            <select
              name="is_active"
              defaultValue={product.is_active ? "true" : "false"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="true">Đang bán</option>
              <option value="false">Ẩn</option>
            </select>
          </div>
          <Button type="submit">Lưu thay đổi</Button>
        </form>

        <div>
          <h2 className="mb-4 font-semibold">Ảnh sản phẩm</h2>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {product.product_images?.length ? (
              product.product_images.map((img: { id: string; url: string }) => (
                <div
                  key={img.id}
                  className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </div>
              ))
            ) : (
              <p className="col-span-3 text-sm text-muted-foreground">
                Chưa có ảnh. Upload bên dưới.
              </p>
            )}
          </div>
          <ProductImageUpload productId={id} />
        </div>
      </div>
    </div>
  );
}
