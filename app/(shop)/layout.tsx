import { ShopHeaderWithCategories } from "@/components/shop/shop-header";
import { ShopFooter } from "@/components/shop/footer";
import { ShopProviders } from "@/components/shop/shop-providers";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShopProviders>
      <div className="flex min-h-screen flex-col">
        <ShopHeaderWithCategories />
        <main className="flex-1">{children}</main>
        <ShopFooter />
      </div>
    </ShopProviders>
  );
}
