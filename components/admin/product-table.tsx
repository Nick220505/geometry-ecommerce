"use client";

import { useTranslation } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types/product";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

interface ProductTableProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

type SortConfig = {
  key: keyof Product | null;
  direction: "asc" | "desc";
};

const ITEMS_PER_PAGE = 10;

function TableSkeleton() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
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
    </div>
  );
}

export function ProductTable({
  products,
  isLoading,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const sortedAndFilteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const nameMatch = product.name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      const typeMatch =
        !typeFilter ||
        product.type.toLowerCase().includes(typeFilter.toLowerCase());
      return nameMatch && typeMatch;
    });

    if (sortConfig.key) {
      return filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Product];
        const bValue = b[sortConfig.key as keyof Product];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }

    return filtered;
  }, [products, sortConfig, nameFilter, typeFilter]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAndFilteredProducts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE,
    );
  }, [sortedAndFilteredProducts, currentPage]);

  const handleSort = (key: keyof Product) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("admin.image")}</TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                {t("admin.name")}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <div className="p-2">
                      <Input
                        placeholder={t("admin.search_by_name")}
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleSort("name")}>
                      <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                      {t("admin.sort_by_name")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                {t("admin.type")}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <div className="p-2">
                      <Input
                        placeholder={t("admin.filter_by_type")}
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleSort("type")}>
                      <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
                      {t("admin.sort_by_type")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                {t("admin.price")}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("price")}
                  className="h-8 w-8 p-0"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                {t("admin.stock")}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("stock")}
                  className="h-8 w-8 p-0"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </TableHead>
            <TableHead>{t("admin.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedProducts.map((product) => (
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

      {Math.ceil(sortedAndFilteredProducts.length / ITEMS_PER_PAGE) > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.max(1, p - 1));
                }}
              >
                {t("pagination.previous")}
              </PaginationPrevious>
            </PaginationItem>
            {Array.from(
              {
                length: Math.ceil(
                  sortedAndFilteredProducts.length / ITEMS_PER_PAGE,
                ),
              },
              (_, i) => i + 1,
            ).map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(pageNumber);
                  }}
                  isActive={currentPage === pageNumber}
                  aria-label={`${t("pagination.page")} ${pageNumber}`}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={
                  currentPage ===
                  Math.ceil(sortedAndFilteredProducts.length / ITEMS_PER_PAGE)
                }
                className={
                  currentPage ===
                  Math.ceil(sortedAndFilteredProducts.length / ITEMS_PER_PAGE)
                    ? "pointer-events-none opacity-50"
                    : ""
                }
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) =>
                    Math.min(
                      Math.ceil(
                        sortedAndFilteredProducts.length / ITEMS_PER_PAGE,
                      ),
                      p + 1,
                    ),
                  );
                }}
              >
                {t("pagination.next")}
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
