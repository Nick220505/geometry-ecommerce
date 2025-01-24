"use client";

import { useTranslation } from "@/components/language-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { ProductForm } from "./product-form";

interface EditProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  product: Product | null;
}

export function EditProductDialog({
  isOpen,
  onOpenChange,
  isLoading,
  product,
}: EditProductDialogProps) {
  const { t } = useTranslation();

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.edit_product")}</DialogTitle>
          <DialogDescription className="sr-only">
            Product form for editing {product.name}
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          initialData={{
            name: product.name,
            description: product.description,
            type: product.type,
            price: product.price.toString(),
            stock: product.stock.toString(),
            imageUrl: product.imageUrl || "",
            id: product.id,
          }}
          isLoading={isLoading}
          submitLabel={t("admin.edit")}
        />
      </DialogContent>
    </Dialog>
  );
}
