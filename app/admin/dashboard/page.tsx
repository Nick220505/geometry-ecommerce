"use client";

import { DeleteDialog } from "@/components/admin/delete-dialog";
import { ProductForm } from "@/components/admin/product-form";
import { ProductTable } from "@/components/admin/product-table";
import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product, ProductFormData } from "@/types/product";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { t } = useTranslation();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (data: ProductFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          type: data.type,
          price: parseFloat(data.price),
          stock: parseInt(data.stock),
          imageUrl: data.imageUrl,
        }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Failed to create product");
      }

      await fetchProducts();
      setIsAddProductOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingProduct,
          name: data.name,
          description: data.description,
          type: data.type,
          price: parseFloat(data.price),
          stock: parseInt(data.stock),
          imageUrl: data.imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(t("admin.error.failed_update"));
      }

      await fetchProducts();
      setIsEditProductOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(t("admin.error.failed_delete"));
      }

      setProducts(products.filter((p) => p.id !== productToDelete.id));
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(t("admin.error.failed_delete"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("admin.title")}</CardTitle>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button>{t("admin.add_product")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("admin.add_new_product")}</DialogTitle>
                <DialogDescription>
                  {t("admin.add_product_description")}
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                isLoading={isLoading}
                onSubmit={handleAddProduct}
                submitLabel={t("admin.add")}
              />
            </DialogContent>
          </Dialog>
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

      <Dialog
        open={isEditProductOpen}
        onOpenChange={(open) => {
          setIsEditProductOpen(open);
          if (!open) setEditingProduct(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.edit_product")}</DialogTitle>
            <DialogDescription>
              {t("admin.edit_product_description")}
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              initialData={{
                name: editingProduct.name,
                description: editingProduct.description,
                type: editingProduct.type,
                price: editingProduct.price.toString(),
                stock: editingProduct.stock.toString(),
                imageUrl: editingProduct.imageUrl || "",
              }}
              isLoading={isLoading}
              onSubmit={handleEditProduct}
              submitLabel={t("admin.edit")}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </div>
  );
}
