"use server";

import { createClient } from "@/lib/supabase/server";
import { generateOrderCode } from "@/lib/utils";
import { sendOrderConfirmationEmail } from "@/lib/email";
import type { PaymentMethod } from "@/types/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const SHIPPING_FEE = 30000;

export interface CheckoutInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  note?: string;
  paymentMethod: PaymentMethod;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export async function createOrder(input: CheckoutInput) {
  const authClient = await createClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? await (await import("@/lib/supabase/server")).createServiceClient()
    : authClient;

  const subtotal = input.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
  const total = subtotal + SHIPPING_FEE;
  const orderCode = generateOrderCode();

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      order_code: orderCode,
      user_id: user?.id ?? null,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      customer_email: input.customerEmail || null,
      shipping_address: input.shippingAddress,
      note: input.note || null,
      subtotal,
      shipping_fee: SHIPPING_FEE,
      total,
      payment_method: input.paymentMethod,
      payment_status:
        input.paymentMethod === "cod" || input.paymentMethod === "bank_transfer"
          ? "pending"
          : "pending",
      status: "pending",
    })
    .select()
    .single();

  if (error || !order) {
    return { error: error?.message || "Không thể tạo đơn hàng" };
  }

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    product_price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    return { error: itemsError.message };
  }

  for (const item of input.items) {
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.productId)
      .single();
    if (product) {
      await supabase
        .from("products")
        .update({ stock: Math.max(0, product.stock - item.quantity) })
        .eq("id", item.productId);
    }
  }

  if (input.customerEmail) {
    await sendOrderConfirmationEmail({
      to: input.customerEmail,
      orderCode,
      customerName: input.customerName,
      total,
      paymentMethod: input.paymentMethod,
      items: input.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
    });
  }

  revalidatePath("/admin/orders");
  return { orderId: order.id, orderCode, total };
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  paymentStatus?: string
) {
  const supabase = await createClient();
  const updates: Record<string, string> = { status };
  if (paymentStatus) updates.payment_status = paymentStatus;

  const { error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", orderId);

  if (error) {
    redirect(
      `/admin/orders/${orderId}?error=${encodeURIComponent(error.message)}`
    );
  }
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/orders/${orderId}?updated=1`);
}
