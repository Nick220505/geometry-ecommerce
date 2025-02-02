"use client";

import { useTranslation } from "@/components/language-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductFormData } from "@/lib/schemas/product";
import { ProductForm } from "./product-form";

interface EditProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductFormData | null;
  onProductUpdated: (message: string) => void;
}

export function EditProductDialog({
  isOpen,
  onOpenChange,
  product,
  onProductUpdated,
}: EditProductDialogProps) {
  const { t } = useTranslation();

  const handleSuccess = async (message: string) => {
    onOpenChange(false);
    onProductUpdated(message);
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.edit_product")}</DialogTitle>
          <DialogDescription className="sr-only">
            Form to edit an existing product
          </DialogDescription>
        </DialogHeader>
        <ProductForm initialData={product} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
