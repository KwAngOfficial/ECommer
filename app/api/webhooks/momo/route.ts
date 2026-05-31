import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyMoMoSignature } from "@/lib/payments/momo";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { signature, ...data } = body;

  if (!verifyMoMoSignature(data, signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  const isSuccess = data.resultCode === "0";
  const supabase = await createServiceClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id")
    .eq("order_code", data.orderId)
    .single();

  if (!order) {
    return NextResponse.json({ message: "Order not found" }, { status: 404 });
  }

  await supabase
    .from("orders")
    .update({
      payment_status: isSuccess ? "paid" : "failed",
      status: isSuccess ? "confirmed" : "pending",
    })
    .eq("id", order.id);

  await supabase
    .from("payments")
    .update({
      status: isSuccess ? "paid" : "failed",
      transaction_id: data.transId,
      raw_response: body,
    })
    .eq("order_id", order.id)
    .eq("gateway", "momo");

  return NextResponse.json({ message: "OK" });
}
