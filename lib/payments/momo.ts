import crypto from "crypto";

export async function createMoMoPayment(params: {
  orderId: string;
  amount: number;
  orderInfo: string;
}): Promise<{ payUrl: string } | { error: string }> {
  const partnerCode = process.env.MOMO_PARTNER_CODE!;
  const accessKey = process.env.MOMO_ACCESS_KEY!;
  const secretKey = process.env.MOMO_SECRET_KEY!;
  const endpoint = process.env.MOMO_ENDPOINT!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const requestId = `${params.orderId}_${Date.now()}`;
  const orderId = params.orderId;
  const amount = String(params.amount);
  const orderInfo = params.orderInfo;
  const redirectUrl = `${appUrl}/checkout/success?order=${orderId}`;
  const ipnUrl = `${appUrl}/api/webhooks/momo`;
  const requestType = "captureWallet";
  const extraData = "";

  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${amount}`,
    `extraData=${extraData}`,
    `ipnUrl=${ipnUrl}`,
    `orderId=${orderId}`,
    `orderInfo=${orderInfo}`,
    `partnerCode=${partnerCode}`,
    `redirectUrl=${redirectUrl}`,
    `requestId=${requestId}`,
    `requestType=${requestType}`,
  ].join("&");

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  const body = {
    partnerCode,
    partnerName: "ECommer",
    storeId: "ECommerStore",
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang: "vi",
    requestType,
    autoCapture: true,
    extraData,
    signature,
    accessKey,
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.payUrl) {
      return { payUrl: data.payUrl };
    }
    return { error: data.message || "MoMo payment failed" };
  } catch {
    return { error: "Không thể kết nối MoMo" };
  }
}

export function verifyMoMoSignature(
  data: Record<string, string>,
  signature: string
): boolean {
  const secretKey = process.env.MOMO_SECRET_KEY!;
  const accessKey = process.env.MOMO_ACCESS_KEY!;

  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${data.amount}`,
    `extraData=${data.extraData || ""}`,
    `message=${data.message}`,
    `orderId=${data.orderId}`,
    `orderInfo=${data.orderInfo}`,
    `orderType=${data.orderType}`,
    `partnerCode=${data.partnerCode}`,
    `payType=${data.payType}`,
    `requestId=${data.requestId}`,
    `responseTime=${data.responseTime}`,
    `resultCode=${data.resultCode}`,
    `transId=${data.transId}`,
  ].join("&");

  const check = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  return check === signature;
}
