"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types/product";
import Image from "next/image";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

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

export function ProductTable({
  products,
  isLoading,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <TableSkeleton />;
  }

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
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(product)}
              >
                {t("admin.edit")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(product)}
              >
                {t("admin.delete")}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
