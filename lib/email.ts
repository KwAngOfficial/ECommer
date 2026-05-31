import { Resend } from "resend";
import { formatPrice } from "@/lib/utils";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderCode: string;
  customerName: string;
  total: number;
  paymentMethod: string;
  items: { name: string; quantity: number; price: number }[];
}) {
  if (!resend) return { skipped: true };

  const itemsHtml = params.items
    .map(
      (i) =>
        `<tr><td>${i.name}</td><td>${i.quantity}</td><td>${formatPrice(i.price)}</td></tr>`
    )
    .join("");

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to: params.to,
    subject: `Xác nhận đơn hàng ${params.orderCode}`,
    html: `
      <h2>Cảm ơn bạn đã đặt hàng, ${params.customerName}!</h2>
      <p>Mã đơn: <strong>${params.orderCode}</strong></p>
      <p>Phương thức thanh toán: ${params.paymentMethod}</p>
      <p>Tổng tiền: <strong>${formatPrice(params.total)}</strong></p>
      <table border="1" cellpadding="8" cellspacing="0">
        <thead><tr><th>Sản phẩm</th><th>SL</th><th>Giá</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
    `,
  });

  if (error) return { error: error.message };
  return { success: true };
}
