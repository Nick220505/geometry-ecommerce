"use client";

import { ChatBot } from "@/components/chat-bot";
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
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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

function StoreContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const type = searchParams.get("type");

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

  useEffect(() => {
    let filtered = [...products];

    if (category) {
      filtered = filtered.filter((product) => product.type === category);
    }

    if (type) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(type.toLowerCase()),
      );
    }

    setFilteredProducts(filtered);
  }, [products, category, type]);

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
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="rotate-slow w-20 h-20 border-4 border-primary rounded-full border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold animate-gradient">
            {category
              ? t(`store.category.${category.toLowerCase()}`)
              : t("store.title")}
          </h1>
          {type && (
            <p className="text-muted-foreground mt-2">
              {t("store.filtering_by")} {type}
            </p>
          )}
        </div>
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <span className="mr-2">{t("store.cart")}</span>
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
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
                    <Card key={item.id} className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
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
                    </Card>
                  ))}
                  <div className="pt-4 border-t">
                    <p className="font-medium text-lg">
                      {t("store.cart.total")}: ${getTotalPrice().toFixed(2)}
                    </p>
                    <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
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
        {filteredProducts.map((product, index) => (
          <Card
            key={product.id}
            className="card-hover-effect overflow-hidden"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {product.type === "Sacred Geometry" ? (
                  <span className="text-2xl rotate-slow inline-block">⬡</span>
                ) : (
                  <span className="text-2xl float inline-block">🌸</span>
                )}
                {product.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    product.type === "Sacred Geometry"
                      ? "bg-purple-500"
                      : "bg-pink-500"
                  }`}
                />
                {product.type}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square relative mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-50 rotate-slow">
                      {product.type === "Sacred Geometry" ? "⬡" : "🌸"}
                    </div>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground grow-animation">
                {product.description}
              </p>
              {product.stock <= 5 && product.stock > 0 && (
                <p className="text-yellow-600 dark:text-yellow-400 mt-2 text-sm">
                  Only {product.stock} left in stock!
                </p>
              )}
              {product.stock <= 0 && (
                <p className="text-red-500 mt-2 text-sm">Out of stock</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                ${product.price.toFixed(2)}
              </p>
              <Button
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {t("store.product.addToCart")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

export default function StorePage() {
  return (
    <div className="container mx-auto p-8">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="rotate-slow w-20 h-20 border-4 border-primary rounded-full border-t-transparent" />
          </div>
        }
      >
        <StoreContent />
      </Suspense>
      <ChatBot />
    </div>
  );
}
