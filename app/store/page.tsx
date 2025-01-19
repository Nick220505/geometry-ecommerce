"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  type: string;
  stock: number;
  imageUrl?: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError("Failed to load products");
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    );
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t("store.title")}</h1>
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <Button variant="outline">
              {t("store.cart")} (
              {cart.reduce((total, item) => total + item.quantity, 0)})
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t("store.cart")}</SheetTitle>
            </SheetHeader>
            <div className="mt-8">
              {cart.length === 0 ? (
                <p>{t("store.cart.empty")}</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          {t("store.cart.remove")}
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <p className="font-medium">
                      {t("store.cart.total")}: ${getTotalPrice().toFixed(2)}
                    </p>
                    <Button className="w-full mt-4">
                      {t("store.cart.checkout")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square relative mb-4 bg-gray-100 rounded-lg">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Image Placeholder
                  </div>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {product.description}
              </p>
              {product.stock <= 0 && (
                <p className="text-red-500 mt-2">Out of stock</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="font-bold">${product.price.toFixed(2)}</p>
              <Button
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
              >
                {t("store.product.addToCart")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
