export type UserRole = "customer" | "admin";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "bank_transfer" | "vnpay" | "momo";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  stock: number;
  category_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_images?: ProductImage[];
  categories?: Category | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
}

export interface Order {
  id: string;
  order_code: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  note: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

export interface Payment {
  id: string;
  order_id: string;
  gateway: string;
  transaction_id: string | null;
  amount: number;
  status: PaymentStatus;
  created_at: string;
}

export interface CartItemLocal {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  slug: string;
}
