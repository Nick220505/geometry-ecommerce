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
import { useState } from "react";

// Mock data for products with translation keys
const mockProducts = [
  {
    id: 1,
    titleKey: "store.product.platonic.title",
    typeKey: "store.category.geometry",
    price: 29.99,
    descriptionKey: "store.product.platonic.description",
    image: "/placeholder.png",
  },
  {
    id: 2,
    titleKey: "store.product.rose.title",
    typeKey: "store.category.essence",
    price: 19.99,
    descriptionKey: "store.product.rose.description",
    image: "/placeholder.png",
  },
  {
    id: 3,
    titleKey: "store.product.sacred.title",
    typeKey: "store.category.geometry",
    price: 39.99,
    descriptionKey: "store.product.sacred.description",
    image: "/placeholder.png",
  },
  {
    id: 4,
    titleKey: "store.product.lavender.title",
    typeKey: "store.category.essence",
    price: 15.99,
    descriptionKey: "store.product.lavender.description",
    image: "/placeholder.png",
  },
];

interface CartItem {
  id: number;
  titleKey: string;
  price: number;
  quantity: number;
}

export default function StorePage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { t } = useTranslation();

  const addToCart = (product: (typeof mockProducts)[0]) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...currentCart,
        {
          id: product.id,
          titleKey: product.titleKey,
          price: product.price,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    );
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
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
                        <p className="font-medium">{t(item.titleKey)}</p>
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
        {mockProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{t(product.titleKey)}</CardTitle>
              <CardDescription>{t(product.typeKey)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square relative mb-4 bg-gray-100 rounded-lg">
                {/* Add proper image component here */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Image Placeholder
                </div>
              </div>
              <p className="text-gray-600">{t(product.descriptionKey)}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="font-bold">${product.price.toFixed(2)}</p>
              <Button onClick={() => addToCart(product)}>
                {t("store.product.addToCart")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
