"use client";

import { useCart } from "@/components/cart-provider";
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
import { translateProducts } from "@/lib/translation-service";
import Image from "next/image";
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

function StoreContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { t, language } = useTranslation();
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error(t("store.error.failed_load"));
        const data = await response.json();

        // Translate products if language is Spanish
        const processedProducts =
          language === "es" ? await translateProducts(data) : data;

        setProducts(processedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(t("store.error.failed_load"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [language, t]);

  useEffect(() => {
    let filtered = [...products];

    if (category) {
      filtered = filtered.filter(
        (product) => product.type.toLowerCase() === category.toLowerCase(),
      );
    }

    if (type) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(type.toLowerCase()),
      );
    }

    setFilteredProducts(filtered);
  }, [products, category, type]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="rotate-slow w-20 h-20 border-4 border-primary rounded-full border-t-transparent" />
        <p className="ml-4">{t("store.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-red-500">{t("store.error.failed_load")}</p>
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
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {filteredProducts.map((product, index) => (
          <Card
            key={product.id}
            className="card-hover-effect overflow-hidden"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-xl">
                {product.type === "Sacred Geometry" ? (
                  <span className="text-xl sm:text-2xl rotate-slow inline-block">
                    ⬡
                  </span>
                ) : (
                  <span className="text-xl sm:text-2xl float inline-block">
                    🌸
                  </span>
                )}
                {product.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {product.type}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full aspect-square object-cover rounded-lg mb-2 sm:mb-3 md:mb-4"
                  priority
                />
              ) : (
                <Image
                  src={
                    product.type === "Sacred Geometry"
                      ? `/products/sacred-geometry.svg#${product.id}`
                      : "/products/flower-essence.svg"
                  }
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full aspect-square object-cover rounded-lg mb-2 sm:mb-3 md:mb-4"
                  priority
                />
              )}
              <p className="text-muted-foreground text-sm">
                {product.description}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col xs:flex-row justify-center xs:justify-between items-center p-3 sm:p-4 md:p-6 gap-2 xs:gap-0">
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-primary text-center xs:text-left">
                ${product.price.toFixed(2)}
              </span>
              <Button size="sm" onClick={() => addToCart(product)}>
                {t("store.add_to_cart")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ChatBot />
    </>
  );
}

export default function StorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="rotate-slow w-20 h-20 border-4 border-primary rounded-full border-t-transparent" />
          </div>
        }
      >
        <StoreContent />
      </Suspense>
    </div>
  );
}
