import Link from "next/link";

export function ShopFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-bold text-white">
                E
              </span>
              <span className="text-xl font-bold text-white">Commer</span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              Mua sắm trực tuyến tiện lợi — giao hàng nhanh, thanh toán linh hoạt,
              sản phẩm chất lượng với giá tốt nhất.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white">Mua sắm</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-primary">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary">
                  Giỏ hàng
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-primary">
                  Tài khoản
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white">Liên hệ</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>Hotline: 1900 xxxx</li>
              <li>Email: support@ecommer.vn</li>
              <li>8:00 – 22:00 hàng ngày</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} ECommer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
