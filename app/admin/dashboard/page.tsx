"use client";

import { AddProductDialog } from "@/components/admin/add-product-dialog";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EditProductDialog } from "@/components/admin/edit-product-dialog";
import { ProductTable } from "@/components/admin/product-table";
import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductManagement } from "@/hooks/use-product-management";
import { Product, ProductFormData } from "@/types/product";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const {
    products,
    isLoading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductManagement();

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (data: ProductFormData) => {
    try {
      await addProduct(data);
      setIsAddProductOpen(false);
    } catch {
      // Error is handled by the form component
    }
  };

  const handleEditProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;
    try {
      await updateProduct(editingProduct.id, data);
      setIsEditProductOpen(false);
      setEditingProduct(null);
    } catch {
      // Error is handled by the form component
    }
  };

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
            className="bg-primary"
          >
            {t("admin.add_product")}
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
        onSubmit={handleAddProduct}
        isLoading={isLoading}
      />

      <EditProductDialog
        isOpen={isEditProductOpen}
        onOpenChange={(open) => {
          setIsEditProductOpen(open);
          if (!open) setEditingProduct(null);
        }}
        onSubmit={handleEditProduct}
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
