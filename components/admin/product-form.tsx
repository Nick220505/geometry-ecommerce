"use client";

import { productFormAction } from "@/app/actions/form";
import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProductFormData } from "@/types/product";
import {
  AlertCircle,
  Box,
  DollarSign,
  ImageIcon,
  Info,
  Package2,
  Tags,
} from "lucide-react";
import Image from "next/image";
import { useActionState, useState } from "react";

interface ProductFormProps {
  initialData?: ProductFormData & { id?: string };
  isLoading: boolean;
  submitLabel: string;
}

interface FormState {
  errors: Record<string, string[]>;
  message: string;
  success?: boolean;
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
  const [uploadingImage, setUploadingImage] = useState(false);
  const { t } = useTranslation();

  const [state, formAction] = useActionState(productFormAction, initialState);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("type", initialData.type || "");

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      {initialData.id && (
        <Input type="hidden" name="id" value={initialData.id} />
      )}
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Tags className="h-4 w-4" />
          {t("admin.product_name")}
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="focus-visible:ring-primary"
          placeholder="Enter product name"
        />
        {state.errors?.name && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {state.errors.name[0]}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Info className="h-4 w-4" />
          {t("admin.description")}
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="focus-visible:ring-primary min-h-[100px]"
          placeholder="Enter product description"
        />
        {state.errors?.description && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {state.errors.description[0]}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="type"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Box className="h-4 w-4" />
          {t("admin.type")}
        </label>
        <Select
          value={formData.type}
          name="type"
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger className="focus-visible:ring-primary">
            <SelectValue placeholder="Select product type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Flower Essence">Flower Essence</SelectItem>
            <SelectItem value="Sacred Geometry">Sacred Geometry</SelectItem>
          </SelectContent>
        </Select>
        {state.errors?.type && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            {state.errors.type[0]}
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="price"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <DollarSign className="h-4 w-4" />
            {t("admin.price")}
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="focus-visible:ring-primary"
            placeholder="0.00"
          />
          {state.errors?.price && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {state.errors.price[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="stock"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Package2 className="h-4 w-4" />
            {t("admin.stock")}
          </label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            className="focus-visible:ring-primary"
            placeholder="0"
          />
          {state.errors?.stock && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {state.errors.stock[0]}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="image"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <ImageIcon className="h-4 w-4" />
          {t("admin.product_image")}
        </label>
        <div className="flex flex-col gap-4">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImage}
            className="focus-visible:ring-primary"
          />
          <Input
            type="hidden"
            name="imageUrl"
            value={formData.imageUrl || ""}
          />
          {uploadingImage && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              {t("admin.uploading_image")}
            </p>
          )}
          {formData.imageUrl && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
              <Image
                src={formData.imageUrl}
                alt={t("admin.product_preview")}
                fill
                sizes="(max-width: 768px) 100vw, 128px"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
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
        disabled={isLoading || uploadingImage}
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
