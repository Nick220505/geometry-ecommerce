"use client";

import { useTranslation } from "@/components/language-provider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductFormData } from "@/types/product";
import { ProductForm } from "./product-form";

interface AddProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading: boolean;
}

export function AddProductDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
}: AddProductDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.add_new_product")}</DialogTitle>
          <DialogDescription className="sr-only">
            Form to add a new product to the store
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          isLoading={isLoading}
          onSubmit={onSubmit}
          submitLabel={t("admin.add")}
        />
      </DialogContent>
    </Dialog>
  );
}
