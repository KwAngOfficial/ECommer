import Link from "next/link";

export function ShopFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-bold">ECommer</h3>
            <p className="text-sm text-muted-foreground">
              Mua sắm trực tuyến dễ dàng — giao hàng toàn quốc, thanh toán linh hoạt.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Liên kết</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-primary">Sản phẩm</Link></li>
              <li><Link href="/cart" className="hover:text-primary">Giỏ hàng</Link></li>
              <li><Link href="/account" className="hover:text-primary">Tài khoản</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Liên hệ</h4>
            <p className="text-sm text-muted-foreground">Hotline: 1900 xxxx</p>
            <p className="text-sm text-muted-foreground">Email: support@ecommer.vn</p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ECommer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
