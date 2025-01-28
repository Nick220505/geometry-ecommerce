"use client";

import { deleteProduct, getProducts } from "@/actions/product";
import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddProductDialog } from "./add-product-dialog";
import { DeleteDialog } from "./delete-dialog";
import { EditProductDialog } from "./edit-product-dialog";
import { ProductTable } from "./product-table";

interface AdminDashboardClientProps {
  initialProducts: Product[];
}

export function AdminDashboardClient({
  initialProducts,
}: AdminDashboardClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  const refreshProducts = async () => {
    const updatedProducts = await getProducts();
    setProducts(updatedProducts);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      const result = await deleteProduct(productToDelete.id);

      if (result.success) {
        await refreshProducts();
        toast({
          title: t("admin.success"),
          description: result.message,
          variant: "default",
        });
      } else {
        toast({
          title: t("admin.error"),
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: t("admin.error"),
        description: t("admin.error.delete"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleProductAdded = async () => {
    await refreshProducts();
  };

  const handleProductUpdated = async (message: string) => {
    await refreshProducts();
    toast({
      title: t("admin.success"),
      description: message,
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{t("admin.title")}</CardTitle>
          <Button
            onClick={() => setIsAddProductOpen(true)}
            className="bg-primary hover:bg-primary/90"
            size="sm"
          >
            {t("admin.add_product")}
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ProductTable
            products={products}
            isLoading={false}
            onEdit={(product) => {
              setEditingProduct(product);
              setIsEditProductOpen(true);
            }}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <AddProductDialog
        isOpen={isAddProductOpen}
        onOpenChange={setIsAddProductOpen}
        isLoading={false}
        onProductAdded={handleProductAdded}
      />

      <EditProductDialog
        isOpen={isEditProductOpen}
        onOpenChange={(open) => {
          setIsEditProductOpen(open);
          if (!open) setEditingProduct(null);
        }}
        isLoading={false}
        product={editingProduct}
        onProductUpdated={handleProductUpdated}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
