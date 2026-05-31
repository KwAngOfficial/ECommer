import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; order?: string }>;
}) {
  const { code, order } = await searchParams;
  const orderCode = code || order;

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h1 className="mt-6 text-3xl font-bold">Đặt hàng thành công!</h1>
      {orderCode && (
        <p className="mt-4 text-lg">
          Mã đơn hàng: <strong className="text-primary">{orderCode}</strong>
        </p>
      )}
      <p className="mt-2 text-muted-foreground">
        Chúng tôi sẽ liên hệ xác nhận đơn hàng sớm nhất.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button asChild variant="outline">
          <Link href="/account">Xem đơn hàng</Link>
        </Button>
        <Button asChild>
          <Link href="/products">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    </div>
  );
}
