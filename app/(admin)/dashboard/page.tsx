import { getProducts } from "@/actions/product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import { Suspense } from "react";
import { AddProductButton } from "./components/add-product-button";
import { ProductTable } from "./components/product-table";
import { TableSkeleton } from "./components/table/table-skeleton";

export const metadata: Metadata = {
  title: "Admin Dashboard | Geometry Store",
  description: "Manage your products and inventory",
};

export const revalidate = 3600;

export default async function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Admin Dashboard</CardTitle>
          <AddProductButton />
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TableSkeleton />}>
            <ProductTable products={await getProducts()} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
