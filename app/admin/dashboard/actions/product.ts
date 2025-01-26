"use server";

import { ProductFormData } from "@/types/product";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["Flower Essence", "Sacred Geometry"], {
    required_error: "Type is required",
  }),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  stock: z
    .string()
    .min(1, "Stock is required")
    .regex(/^\d+$/, "Stock must be a whole number"),
  imageUrl: z.string().optional(),
});

interface FormState {
  errors: Record<string, string[]>;
  message: string;
  success?: boolean;
}

export async function createProduct(data: ProductFormData): Promise<FormState> {
  const validatedFields = productSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below",
      success: false,
    };
  }

  try {
    // Here you would typically save to your database
    // For now, we'll just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      errors: {},
      message: "Product created successfully",
      success: true,
    };
  } catch (error) {
    return {
      errors: {},
      message:
        error instanceof Error ? error.message : "Failed to create product",
      success: false,
    };
  }
}

export async function updateProduct(
  id: string,
  data: ProductFormData,
): Promise<FormState> {
  const validatedFields = productSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Please fix the errors below",
      success: false,
    };
  }

  try {
    // Here you would typically update your database
    // For now, we'll just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      errors: {},
      message: "Product updated successfully",
      success: true,
    };
  } catch (error) {
    return {
      errors: {},
      message:
        error instanceof Error ? error.message : "Failed to update product",
      success: false,
    };
  }
}
