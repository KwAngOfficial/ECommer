# ECommer - Ghi chú dự án

## Stack
- **Frontend/API**: Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Database/Auth/Storage**: Supabase (PostgreSQL)
- **Hosting**: Vercel (free tier)
- **Email**: Resend (optional)
- **Thanh toán**: COD, chuyển khoản, VNPay sandbox, MoMo sandbox

## Cấu trúc thư mục
```
app/
  (shop)/       # Trang khách: /, /products, /cart, /checkout, /account
  (auth)/       # /login, /register
  admin/        # Dashboard admin
  api/          # Webhooks, payments
components/     # shop, admin, ui
lib/            # supabase, payments, utils, cart
supabase/migrations/
types/
```

## Biến môi trường (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend (optional)
RESEND_API_KEY=
EMAIL_FROM=orders@yourdomain.com

# VNPay Sandbox
VNPAY_TMN_CODE=
VNPAY_HASH_SECRET=
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:3000/api/webhooks/vnpay/return
VNPAY_IPN_URL=http://localhost:3000/api/webhooks/vnpay/ipn

# MoMo Sandbox
MOMO_PARTNER_CODE=
MOMO_ACCESS_KEY=
MOMO_SECRET_KEY=
MOMO_ENDPOINT=https://test-payment.momo.vn/v2/gateway/api/create

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Supabase setup
1. Tạo project tại https://supabase.com
2. Chạy SQL trong `supabase/migrations/001_initial_schema.sql` (SQL Editor)
3. Tạo bucket Storage: `product-images` (public)
4. Copy URL + anon key vào `.env.local`

## Deploy Vercel
1. Push code lên GitHub
2. Import project trên vercel.com
3. Thêm env vars giống `.env.local`
4. Cập nhật `NEXT_PUBLIC_APP_URL` và webhook URLs

## Todo chi tiết

### Phase 1 - Nền tảng
- [x] NOTES.md + scaffold Next.js
- [x] Supabase schema + RLS
- [x] Auth login/register
- [x] Trang sản phẩm + giỏ hàng

### Phase 2 - Checkout + Admin
- [x] Checkout COD/chuyển khoản
- [x] Admin CRUD sản phẩm/đơn
- [x] Upload ảnh

### Phase 3 - Thanh toán VN
- [x] VNPay + MoMo sandbox
- [x] Webhooks

### Phase 4 - Hoàn thiện
- [x] Dashboard thống kê
- [x] vercel.json + README deploy

## Lệnh phát triển
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # kiểm tra build trước deploy
```

## Tài khoản admin mặc định
Sau khi đăng ký, chạy SQL trong Supabase:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```
