import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createMoMoPayment } from "@/lib/payments/momo";

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

  if (!process.env.MOMO_PARTNER_CODE) {
    return NextResponse.json(
      { error: "MoMo chưa được cấu hình. Thêm MOMO_* vào .env.local" },
      { status: 503 }
    );
  }

  const result = await createMoMoPayment({
    orderId: order.order_code,
    amount,
    orderInfo: `Thanh toan ${order.order_code}`,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  await supabase.from("payments").insert({
    order_id: orderId,
    gateway: "momo",
    amount,
    status: "pending",
  });

  return NextResponse.json({ payUrl: result.payUrl });
}
