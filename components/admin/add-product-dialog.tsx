"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
      <DialogTrigger asChild>
        <Button>{t("admin.add_product")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.add_new_product")}</DialogTitle>
          <DialogDescription className="sr-only">
            Product form for adding a new product
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
