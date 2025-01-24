"use client";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  stock: number;
  imageUrl?: string;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  type,
  stock,
  imageUrl,
}: ProductCardProps) {
  const { addToCart } = useCart();

  const getFallbackImage = (type: string) => {
    if (type === "Sacred Geometry") {
      return "/products/sacred-geometry.svg";
    }
    if (type === "Flower Essences") {
      return "/products/flower-essence.svg";
    }
    return ""; // Default fallback if needed
  };

  return (
    <div className="group relative bg-background rounded-lg shadow-lg overflow-hidden border border-border hover:border-primary transition-colors">
      <Link href={`/product/${id}`}>
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={imageUrl || getFallbackImage(type)}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            priority
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{type}</p>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ${price.toFixed(2)}
            </span>
            {stock > 0 ? (
              <span className="text-sm text-green-500">In Stock</span>
            ) : (
              <span className="text-sm text-red-500">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <Button
          onClick={() =>
            addToCart({ id, name, description, price, type, stock })
          }
          className="w-full"
          disabled={stock === 0}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
