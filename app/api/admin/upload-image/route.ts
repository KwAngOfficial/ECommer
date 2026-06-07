import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createServiceClient } from "@/lib/supabase/server";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Không đọc được file upload" }, { status: 400 });
  }

  const productId = formData.get("productId") as string;
  const file = formData.get("file") as File | null;

  if (!productId) {
    return NextResponse.json({ error: "Thiếu productId" }, { status: 400 });
  }
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "Chưa chọn file ảnh" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Ảnh tối đa 5MB" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Chỉ hỗ trợ JPG, PNG, WEBP, GIF" },
      { status: 400 }
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        error:
          "Thiếu SUPABASE_SERVICE_ROLE_KEY. Thêm vào .env.local và Vercel Environment Variables.",
      },
      { status: 503 }
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${productId}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  let storage;
  try {
    storage = await createServiceClient();
  } catch {
    return NextResponse.json(
      { error: "Không kết nối được Supabase Storage" },
      { status: 503 }
    );
  }

  const { error: uploadError } = await storage.storage
    .from("product-images")
    .upload(path, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    const msg = uploadError.message.includes("Bucket not found")
      ? 'Bucket "product-images" chưa tạo. Chạy file supabase/migrations/003_storage_setup.sql'
      : uploadError.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = storage.storage.from("product-images").getPublicUrl(path);

  const { error: dbError } = await storage.from("product_images").insert({
    product_id: productId,
    url: publicUrl,
    sort_order: 0,
  });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, url: publicUrl });
}
