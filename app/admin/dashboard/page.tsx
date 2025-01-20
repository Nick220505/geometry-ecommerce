"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
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

  const handleEditProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update product");
      }

      await fetchProducts();
      setIsEditProductOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update product",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete product");
      }

      await fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete product",
      );
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
    <div className="p-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Product Management</CardTitle>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button>Add Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name">Product Name</label>
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
                  <label htmlFor="description">Description</label>
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
                  <label htmlFor="type">Type</label>
                  <Input
                    id="type"
                    value={newProduct.type}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, type: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="price">Price</label>
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
                  <label htmlFor="stock">Stock</label>
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
                  <label htmlFor="image">Product Image</label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e)}
                    disabled={uploadingImage}
                  />
                  {uploadingImage && (
                    <p className="text-sm text-muted-foreground">
                      Uploading image...
                    </p>
                  )}
                  {newProduct.imageUrl && (
                    <div className="mt-2">
                      <Image
                        src={newProduct.imageUrl}
                        alt="Product preview"
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
                  {isLoading ? "Adding..." : "Add Product"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
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
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>
                        {editingProduct && (
                          <form
                            onSubmit={handleEditProduct}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <label htmlFor="edit-name">Product Name</label>
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
                                Description
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
                              <label htmlFor="edit-type">Type</label>
                              <Input
                                id="edit-type"
                                value={editingProduct.type}
                                onChange={(e) =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    type: e.target.value,
                                  })
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="edit-price">Price</label>
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
                              <label htmlFor="edit-stock">Stock</label>
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
                              <label htmlFor="edit-image">Product Image</label>
                              <Input
                                id="edit-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, true)}
                                disabled={uploadingImage}
                              />
                              {uploadingImage && (
                                <p className="text-sm text-muted-foreground">
                                  Uploading image...
                                </p>
                              )}
                              {editingProduct.imageUrl && (
                                <div className="mt-2">
                                  <Image
                                    src={editingProduct.imageUrl}
                                    alt="Product preview"
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
                              {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
