# ECommer - Website mua sắm trực tuyến

Website thương mại điện tử với shop, admin panel, thanh toán COD/chuyển khoản/VNPay/MoMo.

## Stack

- Next.js 15 + TypeScript + Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage)
- Vercel (hosting miễn phí)
- Resend (email, optional)

## Bắt đầu nhanh

### 1. Cài dependencies

```bash
npm install
```

### 2. Tạo Supabase project

1. Đăng ký tại [supabase.com](https://supabase.com)
2. Tạo project mới
3. Vào **SQL Editor** → chạy file [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)
4. Vào **Storage** → tạo bucket `product-images` (public)
5. Copy **Project URL** và **anon key** từ Settings → API

### 3. Cấu hình môi trường

```bash
cp .env.local.example .env.local
```

Điền các giá trị Supabase vào `.env.local`.

### 4. Chạy dev

```bash
npm run dev
```

Mở http://localhost:3000

### 5. Tạo tài khoản admin

1. Đăng ký tài khoản tại `/register`
2. Vào Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

3. Truy cập `/admin`

## Deploy lên Vercel (miễn phí)

1. Push code lên GitHub
2. Import project tại [vercel.com](https://vercel.com)
3. Thêm Environment Variables (giống `.env.local`)
4. Deploy → nhận URL `your-shop.vercel.app`

Cập nhật sau khi deploy:
- `NEXT_PUBLIC_APP_URL` = URL Vercel
- `VNPAY_RETURN_URL` / `VNPAY_IPN_URL` = URL webhook trên Vercel

## Thanh toán VN (sandbox)

- **VNPay**: Đăng ký sandbox tại [sandbox.vnpayment.vn](https://sandbox.vnpayment.vn)
- **MoMo**: Đăng ký test tại [developers.momo.vn](https://developers.momo.vn)

## Cấu trúc

```
app/(shop)/     Trang mua hàng
app/(auth)/     Đăng nhập/đăng ký
app/admin/      Admin panel
app/api/        Payment APIs & webhooks
components/     UI components
lib/            Utils, Supabase, payments
supabase/       SQL migrations
```

## Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy development |
| `npm run build` | Build production |
| `npm run start` | Chạy production |

Xem thêm chi tiết trong [NOTES.md](NOTES.md).
