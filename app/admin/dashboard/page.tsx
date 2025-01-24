"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useEffect, useState } from "react";

function TableSkeleton() {
  const { t } = useTranslation();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("admin.image")}</TableHead>
          <TableHead>{t("admin.name")}</TableHead>
          <TableHead>{t("admin.type")}</TableHead>
          <TableHead>{t("admin.price")}</TableHead>
          <TableHead>{t("admin.stock")}</TableHead>
          <TableHead>{t("admin.actions")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="w-16 h-16 rounded-lg bg-gray-200 animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface Product {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    type: "",
    price: "",
    stock: "",
    imageUrl: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const { t } = useTranslation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Fetch products
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

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,
          description: newProduct.description,
          type: newProduct.type,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          imageUrl: newProduct.imageUrl,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create product");
      }

      await fetchProducts();
      setIsAddProductOpen(false);
      setNewProduct({
        name: "",
        description: "",
        type: "",
        price: "",
        stock: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to add product",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingProduct),
      });

      if (!response.ok) {
        throw new Error(t("admin.error.failed_update"));
      }

      await fetchProducts();
      setIsEditProductOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      setError(t("admin.error.failed_update"));
    }
  };

  const handleDelete = async (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

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
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false,
  ) => {
    if (!e.target.files?.[0]) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append(
      "type",
      isEdit ? editingProduct?.type || "" : newProduct.type,
    );

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();

      if (isEdit && editingProduct) {
        setEditingProduct({
          ...editingProduct,
          imageUrl: data.url,
        });
      } else {
        setNewProduct({
          ...newProduct,
          imageUrl: data.url,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image");
    } finally {
      setUploadingImage(false);
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
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name">{t("admin.product_name")}</label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="description">{t("admin.description")}</label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="type">{t("admin.type")}</label>
                  <Select
                    value={newProduct.type}
                    onValueChange={(value) =>
                      setNewProduct({ ...newProduct, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flower Essence">
                        Flower Essence
                      </SelectItem>
                      <SelectItem value="Sacred Geometry">
                        Sacred Geometry
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="price">{t("admin.price")}</label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="stock">{t("admin.stock")}</label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="image">{t("admin.product_image")}</label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    disabled={uploadingImage}
                  />
                  {uploadingImage && (
                    <p className="text-sm text-muted-foreground">
                      {t("admin.uploading_image")}
                    </p>
                  )}
                  {newProduct.imageUrl && (
                    <div className="mt-2">
                      <Image
                        src={newProduct.imageUrl}
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
                  {isLoading ? t("admin.adding") : t("admin.add")}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.image")}</TableHead>
                  <TableHead>{t("admin.name")}</TableHead>
                  <TableHead>{t("admin.type")}</TableHead>
                  <TableHead>{t("admin.price")}</TableHead>
                  <TableHead>{t("admin.stock")}</TableHead>
                  <TableHead>{t("admin.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <Image
                          src={
                            product.type === "Sacred Geometry"
                              ? `/products/sacred-geometry.svg#${product.id}`
                              : "/products/flower-essence.svg"
                          }
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.type}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="space-x-2">
                      <Dialog
                        open={
                          isEditProductOpen && editingProduct?.id === product.id
                        }
                        onOpenChange={(open) => {
                          setIsEditProductOpen(open);
                          if (!open) setEditingProduct(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                          >
                            {t("admin.edit")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t("admin.edit_product")}</DialogTitle>
                            <DialogDescription>
                              {t("admin.edit_product_description")}
                            </DialogDescription>
                          </DialogHeader>
                          {editingProduct && (
                            <form
                              onSubmit={handleEditProduct}
                              className="space-y-4"
                            >
                              <div className="space-y-2">
                                <label htmlFor="edit-name">
                                  {t("admin.product_name")}
                                </label>
                                <Input
                                  id="edit-name"
                                  value={editingProduct.name}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      name: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-description">
                                  {t("admin.description")}
                                </label>
                                <Textarea
                                  id="edit-description"
                                  value={editingProduct.description}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      description: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-type">
                                  {t("admin.type")}
                                </label>
                                <Select
                                  value={editingProduct.type}
                                  onValueChange={(value) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      type: value,
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select product type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Flower Essence">
                                      Flower Essence
                                    </SelectItem>
                                    <SelectItem value="Sacred Geometry">
                                      Sacred Geometry
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-price">
                                  {t("admin.price")}
                                </label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  step="0.01"
                                  value={editingProduct.price}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      price: parseFloat(e.target.value),
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-stock">
                                  {t("admin.stock")}
                                </label>
                                <Input
                                  id="edit-stock"
                                  type="number"
                                  value={editingProduct.stock}
                                  onChange={(e) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      stock: parseInt(e.target.value),
                                    })
                                  }
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-image">
                                  {t("admin.product_image")}
                                </label>
                                <Input
                                  id="edit-image"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, true)}
                                  disabled={uploadingImage}
                                />
                                {uploadingImage && (
                                  <p className="text-sm text-muted-foreground">
                                    {t("admin.uploading_image")}
                                  </p>
                                )}
                                {editingProduct.imageUrl && (
                                  <div className="mt-2">
                                    <Image
                                      src={editingProduct.imageUrl}
                                      alt={t("admin.product_preview")}
                                      width={128}
                                      height={128}
                                      className="w-32 h-32 object-cover rounded-lg"
                                    />
                                  </div>
                                )}
                              </div>
                              {error && (
                                <p className="text-sm text-red-500">{error}</p>
                              )}
                              <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading || uploadingImage}
                              >
                                {isLoading
                                  ? t("admin.adding")
                                  : t("admin.edit")}
                              </Button>
                            </form>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product)}
                      >
                        {t("admin.delete")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.delete_confirm_title")}</DialogTitle>
            <DialogDescription>
              {productToDelete ? t("admin.delete_confirm_description") : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t("admin.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("admin.confirm_delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
