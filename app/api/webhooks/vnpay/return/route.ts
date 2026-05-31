import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyVNPayReturn } from "@/lib/payments/vnpay";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const result = verifyVNPayReturn(params as Record<string, string>);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!result.valid || !result.orderId) {
    return NextResponse.redirect(`${appUrl}/checkout/success?error=invalid`);
  }

  const isSuccess = result.responseCode === "00";

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = await createServiceClient();
    const { data: order } = await supabase
      .from("orders")
      .select("id")
      .eq("order_code", result.orderId)
      .single();

    if (order) {
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
    }
  }

  if (isSuccess) {
    return NextResponse.redirect(
      `${appUrl}/checkout/success?code=${result.orderId}`
    );
  }

  return NextResponse.redirect(
    `${appUrl}/checkout/success?code=${result.orderId}&error=payment_failed`
  );
}
