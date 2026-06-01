export const orderStatusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

export const paymentMethodLabels: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  bank_transfer: "Chuyển khoản ngân hàng",
  vnpay: "VNPay",
  momo: "Ví MoMo",
};

export const paymentStatusLabels: Record<string, string> = {
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  failed: "Thanh toán thất bại",
  refunded: "Đã hoàn tiền",
};

export type OrderStatusStep = {
  key: string;
  label: string;
  done: boolean;
  active: boolean;
};

export function getOrderStatusSteps(current: string): {
  cancelled: boolean;
  steps: OrderStatusStep[];
} {
  const baseSteps = [
    { key: "pending", label: orderStatusLabels.pending },
    { key: "confirmed", label: orderStatusLabels.confirmed },
    { key: "shipping", label: orderStatusLabels.shipping },
    { key: "delivered", label: orderStatusLabels.delivered },
  ];

  if (current === "cancelled") {
    return { cancelled: true, steps: [] };
  }

  const order = ["pending", "confirmed", "shipping", "delivered"];
  const currentIndex = Math.max(0, order.indexOf(current));

  return {
    cancelled: false,
    steps: baseSteps.map((s, i) => ({
      ...s,
      done: i <= currentIndex,
      active: i === currentIndex,
    })),
  };
}
