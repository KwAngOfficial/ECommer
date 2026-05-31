import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createVNPayUrl } from "@/lib/payments/vnpay";

export async function POST(request: NextRequest) {
  const { orderId, amount } = await request.json();

  if (!orderId || !amount) {
    return NextResponse.json({ error: "Missing orderId or amount" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("order_code")
    .eq("id", orderId)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (!process.env.VNPAY_TMN_CODE || !process.env.VNPAY_HASH_SECRET) {
    return NextResponse.json(
      { error: "VNPay chưa được cấu hình. Thêm VNPAY_* vào .env.local" },
      { status: 503 }
    );
  }

  const url = createVNPayUrl({
    orderId: order.order_code,
    amount,
    orderInfo: `Thanh toan don hang ${order.order_code}`,
    ipAddr: request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1",
  });

  await supabase.from("payments").insert({
    order_id: orderId,
    gateway: "vnpay",
    amount,
    status: "pending",
  });

  return NextResponse.json({ url });
}
