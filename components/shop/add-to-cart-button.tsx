"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { useState } from "react";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  slug: string;
  imageUrl?: string;
  disabled?: boolean;
}

export function AddToCartButton({
  productId,
  name,
  price,
  slug,
  imageUrl,
  disabled,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem({ productId, name, price, slug, imageUrl });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button size="lg" disabled={disabled} onClick={handleClick}>
      <ShoppingCart className="mr-2 h-5 w-5" />
      {added ? "Đã thêm!" : disabled ? "Hết hàng" : "Thêm vào giỏ hàng"}
    </Button>
  );
}
