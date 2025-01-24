"use client";

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
import Image from "next/image";
import { useState } from "react";

interface ProductFormProps {
  initialData?: ProductFormData;
  isLoading: boolean;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel: string;
}

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
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialData);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

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
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name">{t("admin.product_name")}</label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description">{t("admin.description")}</label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="type">{t("admin.type")}</label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select product type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Flower Essence">Flower Essence</SelectItem>
            <SelectItem value="Sacred Geometry">Sacred Geometry</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="price">{t("admin.price")}</label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="stock">{t("admin.stock")}</label>
        <Input
          id="stock"
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="image">{t("admin.product_image")}</label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploadingImage}
        />
        {uploadingImage && (
          <p className="text-sm text-muted-foreground">
            {t("admin.uploading_image")}
          </p>
        )}
        {formData.imageUrl && (
          <div className="mt-2">
            <Image
              src={formData.imageUrl}
              alt={t("admin.product_preview")}
              width={128}
              height={128}
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button
        type="submit"
        className="w-full"
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
