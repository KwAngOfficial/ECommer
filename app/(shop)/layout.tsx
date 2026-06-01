import { ShopHeaderWithCategories } from "@/components/shop/shop-header";
import { ShopFooter } from "@/components/shop/footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ShopHeaderWithCategories />
      <main className="flex-1">{children}</main>
      <ShopFooter />
    </div>
  );
}
