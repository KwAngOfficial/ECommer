"use server";

import { updateOrderStatus } from "@/lib/actions/orders";

export async function updateOrderStatusAction(
  orderId: string,
  formData: FormData
) {
  const status = formData.get("status") as string;
  const paymentStatus = formData.get("payment_status") as string;
  return updateOrderStatus(orderId, status, paymentStatus || undefined);
}
