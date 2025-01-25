"use client";

import { useCart } from "@/components/cart-provider";
import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types/product";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// List of all available flower essences
const FLOWER_ESSENCES = [
  "Agrimony",
  "Aspen",
  "Beech",
  "Centaury",
  "Cerato",
  "Cherry Plum",
  "Chestnut Bud",
  "Chicory",
  "Clematis",
  "Crab Apple",
  "Elm",
  "Gentian",
  "Gorse",
  "Heather",
  "Holly",
  "Honeysuckle",
  "Hornbeam",
  "Impatiens",
  "Larch",
  "Mimulus",
  "Mustard",
  "Oak",
  "Olive",
  "Pine",
  "Red Chestnut",
  "Rock Rose",
  "Rock Water",
  "Scleranthus",
  "Star of Bethlehem",
  "Sweet Chestnut",
  "Vervain",
  "Vine",
  "Walnut",
  "Water Violet",
  "White Chestnut",
  "Wild Oat",
  "Wild Rose",
  "Willow",
];

export default function ProductPage() {
  const { t } = useTranslation();
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBase, setSelectedBase] = useState<string>("");
  const [selectedEssences, setSelectedEssences] = useState<string[]>(
    Array(7).fill(""),
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) throw new Error("Failed to load product");
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleEssenceChange = (value: string, index: number) => {
    const newEssences = [...selectedEssences];
    newEssences[index] = value;
    setSelectedEssences(newEssences);
  };

  const isValidSelection = () => {
    if (product?.type !== "Flower Essence") return true;

    // Check if base is selected
    if (!selectedBase) return false;

    // Check if at least first two essences are selected
    const selectedCount = selectedEssences
      .slice(0, 2)
      .filter((essence) => essence).length;
    return selectedCount === 2;
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.type === "Flower Essence") {
      // Filter out empty selections
      const selectedEssencesList = selectedEssences.filter(
        (essence) => essence,
      );

      // Add to cart with selected essences
      addToCart({
        ...product,
        name: `${product.name} (${selectedEssencesList.join(", ")})`,
        description: `Base: ${selectedBase}, Essences: ${selectedEssencesList.join(
          ", ",
        )}`,
      });
    } else {
      // Regular product
      addToCart(product);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="rotate-slow w-20 h-20 border-4 border-primary rounded-full border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-lg">Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="lg:sticky lg:top-8">
          <div className="relative aspect-square">
            <Image
              src={
                product.imageUrl ||
                (product.type === "Sacred Geometry"
                  ? `/products/sacred-geometry.svg#${product.id}`
                  : "/products/flower-essence.svg")
              }
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl font-semibold text-primary">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          {/* Flower Essence Selection */}
          {product.type === "Flower Essence" && (
            <div className="space-y-8">
              <div className="prose max-w-none dark:prose-invert">
                <p>{t("store.essence.instructions")}</p>
                <p>{t("store.essence.empty_slots")}</p>
                <p>{t("store.essence.dosage")}</p>
                <p>{t("store.essence.whatsapp_help")}</p>
              </div>

              <Button variant="outline" className="w-full">
                {t("store.essence.learn_more")}
              </Button>

              <div className="space-y-6">
                {/* Base Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("store.essence.select_base")}
                    <span className="text-red-500">*</span>
                  </label>
                  <Select onValueChange={setSelectedBase} value={selectedBase}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("store.essence.select_option")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brandy">
                        {t("store.essence.base.brandy")}
                      </SelectItem>
                      <SelectItem value="glicerina">
                        {t("store.essence.base.glycerin")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Essences Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <label className="text-sm font-medium">
                        {t("store.essence.essence_number")} {index + 1}
                        {index < 2 && <span className="text-red-500">*</span>}
                      </label>
                      <Select
                        value={selectedEssences[index]}
                        onValueChange={(value) =>
                          handleEssenceChange(value, index)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              index < 2
                                ? t("store.essence.select_option")
                                : t("store.essence.skip_option")
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {FLOWER_ESSENCES.map((essence) => (
                            <SelectItem
                              key={essence}
                              value={essence}
                              disabled={
                                selectedEssences.includes(essence) &&
                                selectedEssences[index] !== essence
                              }
                            >
                              {essence}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90"
            size="lg"
            disabled={!isValidSelection()}
          >
            {t("store.add_to_cart")}
          </Button>
        </div>
      </div>
    </div>
  );
}
