"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductFormData } from "@/types/product";
import { AlertCircle } from "lucide-react";
import { useActionState, useState } from "react";
import { productFormAction } from "../actions/form";
import { FormFields } from "./form/form-fields";
import { ImageUpload } from "./form/image-upload";
import { FormState } from "./form/types";

interface ProductFormProps {
  initialData?: ProductFormData & { id?: string };
  isLoading: boolean;
  submitLabel: string;
}

const initialState: FormState = {
  errors: {},
  message: "",
};

export function ProductForm({
  initialData = {
    name: "",
    description: "",
    type: "",
    price: "",
    stock: "",
    imageUrl: "",
  },
  isLoading,
  submitLabel,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialData);
  const { t } = useTranslation();
  const [state, formAction] = useActionState(productFormAction, initialState);

  const handleFieldChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form action={formAction} className="space-y-6">
      {initialData.id && (
        <Input type="hidden" name="id" value={initialData.id} />
      )}

      <FormFields
        formData={formData}
        state={state}
        onChange={handleFieldChange}
      />

      <ImageUpload
        initialImageUrl={formData.imageUrl}
        productType={formData.type}
        onImageUrlChange={(url) => handleFieldChange("imageUrl", url)}
      />

      {state.message && (
        <p
          className={`text-sm flex items-center gap-1 ${
            state.success ? "text-green-500" : "text-red-500"
          }`}
          role="alert"
        >
          <AlertCircle className="h-4 w-4" />
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading
          ? initialData?.name
            ? t("admin.editing")
            : t("admin.adding")
          : submitLabel}
      </Button>
    </form>
  );
}
