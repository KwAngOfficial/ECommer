import { createClient } from "@/lib/supabase/server";
import { createCategory, deleteCategory } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Danh mục</h1>
      <form action={createCategory} className="mb-8 flex gap-4 max-w-md">
        <div className="flex-1">
          <Label htmlFor="name" className="sr-only">Tên danh mục</Label>
          <Input id="name" name="name" placeholder="Tên danh mục mới" required />
        </div>
        <Button type="submit">Thêm</Button>
      </form>
      <div className="rounded-lg border divide-y">
        {categories?.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{cat.name}</p>
              <p className="text-sm text-muted-foreground">/{cat.slug}</p>
            </div>
            <form action={deleteCategory.bind(null, cat.id)}>
              <Button size="sm" variant="destructive" type="submit">Xóa</Button>
            </form>
          </div>
        ))}
        {(!categories || categories.length === 0) && (
          <p className="p-8 text-center text-muted-foreground">Chưa có danh mục</p>
        )}
      </div>
    </div>
  );
}
