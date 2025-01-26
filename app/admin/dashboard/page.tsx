"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types/product";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AddProductDialog } from "./components/add-product-dialog";
import { DeleteDialog } from "./components/delete-dialog";
import { EditProductDialog } from "./components/edit-product-dialog";
import { ProductTable } from "./components/product-table";
import { useProductManagement } from "./hooks/use-product-management";

export default function AdminDashboard() {
  const { products, isLoading, error, fetchProducts, deleteProduct } =
    useProductManagement();

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    const success = await deleteProduct(productToDelete.id);
    if (success) {
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
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
            <Plus />
          </Button>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <ProductTable
            products={products}
            isLoading={isLoading}
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
        isLoading={isLoading}
      />

      <EditProductDialog
        isOpen={isEditProductOpen}
        onOpenChange={(open) => {
          setIsEditProductOpen(open);
          if (!open) setEditingProduct(null);
        }}
        isLoading={isLoading}
        product={editingProduct}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
