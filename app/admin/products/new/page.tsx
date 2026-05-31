import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*");

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/products">← Quay lại</Link>
        </Button>
        <h1 className="text-3xl font-bold">Thêm sản phẩm</h1>
      </div>
      <form action={createProduct} className="max-w-lg space-y-4">
        <div>
          <Label htmlFor="name">Tên sản phẩm *</Label>
          <Input id="name" name="name" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Giá (VND) *</Label>
            <Input id="price" name="price" type="number" min="0" required />
          </div>
          <div>
            <Label htmlFor="sale_price">Giá khuyến mãi</Label>
            <Input id="sale_price" name="sale_price" type="number" min="0" />
          </div>
        </div>
        <div>
          <Label htmlFor="stock">Tồn kho *</Label>
          <Input id="stock" name="stock" type="number" min="0" defaultValue="0" required />
        </div>
        <div>
          <Label htmlFor="category_id">Danh mục</Label>
          <select
            id="category_id"
            name="category_id"
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
          <Textarea id="description" name="description" rows={4} />
        </div>
        <Button type="submit">Tạo sản phẩm</Button>
      </form>
    </div>
  );
}
