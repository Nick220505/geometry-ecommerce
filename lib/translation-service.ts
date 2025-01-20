import { translations } from "@/components/language-provider";

interface TranslationResponse {
  data: {
    translations: Array<{
      translatedText: string;
    }>;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  type?: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export async function translateText(
  text: string,
  targetLanguage: string = "es",
): Promise<string> {
  // First check if we have a static translation
  const translationKey = Object.keys(translations).find(
    (key) => translations[key].en === text || translations[key].es === text,
  );

  if (translationKey) {
    return translations[translationKey][targetLanguage as "en" | "es"];
  }

  // If no static translation found, use Google Translate API
  try {
    if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
      console.warn("Missing GOOGLE_TRANSLATE_API_KEY");
      return text;
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: "en",
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Translation failed");
    }

    const data = (await response.json()) as TranslationResponse;
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

export async function translateProduct(
  product: Product,
  targetLanguage: string = "es",
): Promise<Product> {
  if (!product) return product;

  const translatedProduct = { ...product };

  try {
    // Translate name and description
    translatedProduct.name = await translateText(product.name, targetLanguage);
    translatedProduct.description = await translateText(
      product.description,
      targetLanguage,
    );

    // Translate type if needed
    if (product.type) {
      translatedProduct.type = await translateText(
        product.type,
        targetLanguage,
      );
    }
  } catch (error) {
    console.error("Error translating product:", error);
  }

  return translatedProduct;
}

export async function translateProducts(
  products: Product[],
  targetLanguage: string = "es",
): Promise<Product[]> {
  return Promise.all(
    products.map((product) => translateProduct(product, targetLanguage)),
  );
}
