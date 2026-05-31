import crypto from "crypto";

function sortObject(obj: Record<string, string>): Record<string, string> {
  return Object.keys(obj)
    .sort()
    .reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {} as Record<string, string>);
}

export function createVNPayUrl(params: {
  orderId: string;
  amount: number;
  orderInfo: string;
  ipAddr?: string;
}): string {
  const tmnCode = process.env.VNPAY_TMN_CODE!;
  const hashSecret = process.env.VNPAY_HASH_SECRET!;
  const vnpUrl = process.env.VNPAY_URL!;
  const returnUrl = process.env.VNPAY_RETURN_URL!;

  const date = new Date();
  const createDate = date
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const expireDate = new Date(date.getTime() + 15 * 60 * 1000)
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);

  const vnpParams: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Amount: String(params.amount * 100),
    vnp_CurrCode: "VND",
    vnp_TxnRef: params.orderId,
    vnp_OrderInfo: params.orderInfo,
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: params.ipAddr || "127.0.0.1",
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  };

  const sorted = sortObject(vnpParams);
  const signData = new URLSearchParams(sorted).toString();
  const hmac = crypto.createHmac("sha512", hashSecret);
  const secureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return `${vnpUrl}?${signData}&vnp_SecureHash=${secureHash}`;
}

export function verifyVNPayReturn(
  query: Record<string, string>
): { valid: boolean; orderId?: string; responseCode?: string } {
  const hashSecret = process.env.VNPAY_HASH_SECRET!;
  const secureHash = query.vnp_SecureHash;
  const params = { ...query };
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const sorted = sortObject(params);
  const signData = new URLSearchParams(sorted).toString();
  const hmac = crypto.createHmac("sha512", hashSecret);
  const checkHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (checkHash !== secureHash) {
    return { valid: false };
  }

  return {
    valid: true,
    orderId: query.vnp_TxnRef,
    responseCode: query.vnp_ResponseCode,
  };
}
