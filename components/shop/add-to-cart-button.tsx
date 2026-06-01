"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/lib/hooks/use-add-to-cart";
import { useState } from "react";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  slug: string;
  imageUrl?: string;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({
  productId,
  name,
  price,
  slug,
  imageUrl,
  disabled,
  className,
}: AddToCartButtonProps) {
  const addToCart = useAddToCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addToCart({ productId, name, price, slug, imageUrl });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button
      type="button"
      size="lg"
      className={className}
      disabled={disabled}
      onClick={handleClick}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      {added ? "Đã thêm vào giỏ!" : disabled ? "Hết hàng" : "Thêm vào giỏ hàng"}
    </Button>
  );
}
