-- Sample categories and products (run after 001_initial_schema.sql)
INSERT INTO categories (name, slug, description) VALUES
  ('Điện tử', 'dien-tu', 'Thiết bị điện tử và phụ kiện'),
  ('Thời trang', 'thoi-trang', 'Quần áo và phụ kiện thời trang'),
  ('Gia dụng', 'gia-dung', 'Đồ dùng gia đình')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, sale_price, stock, category_id, is_active)
SELECT
  'Tai nghe Bluetooth Pro',
  'tai-nghe-bluetooth-pro',
  'Tai nghe không dây chống ồn chủ động, pin 30 giờ.',
  890000,
  690000,
  50,
  c.id,
  true
FROM categories c WHERE c.slug = 'dien-tu'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, sale_price, stock, category_id, is_active)
SELECT
  'Áo thun cotton basic',
  'ao-thun-cotton-basic',
  'Áo thun 100% cotton, form regular fit.',
  199000,
  NULL,
  100,
  c.id,
  true
FROM categories c WHERE c.slug = 'thoi-trang'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, sale_price, stock, category_id, is_active)
SELECT
  'Bình giữ nhiệt 500ml',
  'binh-giu-nhiet-500ml',
  'Giữ nóng 12h, giữ lạnh 24h, inox 304.',
  250000,
  199000,
  80,
  c.id,
  true
FROM categories c WHERE c.slug = 'gia-dung'
ON CONFLICT (slug) DO NOTHING;
