import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyVNPayReturn } from "@/lib/payments/vnpay";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const result = verifyVNPayReturn(params as Record<string, string>);

  if (!result.valid || !result.orderId) {
    return NextResponse.json({ RspCode: "97", Message: "Invalid signature" });
  }

  const isSuccess = result.responseCode === "00";
  const supabase = await createServiceClient();

  const { data: order } = await supabase
    .from("orders")
    .select("id, payment_status")
    .eq("order_code", result.orderId)
    .single();

  if (!order) {
    return NextResponse.json({ RspCode: "01", Message: "Order not found" });
  }

  if (order.payment_status === "paid") {
    return NextResponse.json({ RspCode: "02", Message: "Already confirmed" });
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
      transaction_id: params.vnp_TransactionNo as string,
      raw_response: params,
    })
    .eq("order_id", order.id)
    .eq("gateway", "vnpay");

  return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
}
