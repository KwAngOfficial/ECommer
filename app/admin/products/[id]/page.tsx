import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { updateProduct, uploadProductImage } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const { data: categories } = await supabase.from("categories").select("*");
  const updateWithId = updateProduct.bind(null, id);
  const uploadWithId = uploadProductImage.bind(null, id);

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/products">← Quay lại</Link>
        </Button>
        <h1 className="text-3xl font-bold">Sửa: {product.name}</h1>
      </div>

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
          <h2 className="font-semibold mb-4">Ảnh sản phẩm</h2>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {product.product_images?.map((img: { id: string; url: string }) => (
              <div key={img.id} className="relative aspect-square rounded overflow-hidden bg-muted">
                <Image src={img.url} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
          <form action={uploadWithId} className="space-y-2">
            <Label htmlFor="file">Upload ảnh mới</Label>
            <Input id="file" name="file" type="file" accept="image/*" required />
            <Button type="submit" variant="outline">Upload</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
