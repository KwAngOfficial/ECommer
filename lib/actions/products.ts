"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const slug = slugify(name);
  const price = Number(formData.get("price"));
  const salePrice = formData.get("sale_price")
    ? Number(formData.get("sale_price"))
    : null;
  const stock = Number(formData.get("stock"));
  const description = (formData.get("description") as string) || null;
  const categoryId = (formData.get("category_id") as string) || null;

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      slug: `${slug}-${Date.now().toString(36)}`,
      price,
      sale_price: salePrice,
      stock,
      description,
      category_id: categoryId || null,
      is_active: true,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect(`/admin/products/${data.id}`);
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      sale_price: formData.get("sale_price")
        ? Number(formData.get("sale_price"))
        : null,
      stock: Number(formData.get("stock")),
      description: (formData.get("description") as string) || null,
      category_id: (formData.get("category_id") as string) || null,
      is_active: formData.get("is_active") === "true",
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  return { success: true };
}

export async function uploadProductImage(productId: string, formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  if (!file) return { error: "Không có file" };

  const ext = file.name.split(".").pop();
  const path = `${productId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, file);

  if (uploadError) return { error: uploadError.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(path);

  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    url: publicUrl,
    sort_order: 0,
  });

  if (error) return { error: error.message };
  revalidatePath(`/admin/products/${productId}`);
  return { url: publicUrl };
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    description: (formData.get("description") as string) || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}
