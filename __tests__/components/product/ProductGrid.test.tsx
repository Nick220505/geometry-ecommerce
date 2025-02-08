import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProductGrid } from "@/app/[locale]/store/components/product/product-grid";
import { ProductSkeleton } from "@/app/[locale]/store/components/product/product-skeleton";
import { ProductCard } from "@/app/[locale]/store/components/product/product-card";
import { type Product } from "@prisma/client";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Sacred Geometry Pendant",
    type: "Sacred Geometry",
    price: 49.99,
    stock: 10,
    description: "A beautiful sacred geometry pendant.",
    imageUrl: "/images/pendant.jpg",
  },
  {
    id: "2",
    name: "Flower Essence Oil",
    type: "Flower Essence",
    price: 19.99,
    stock: 25,
    description: "A soothing flower essence oil.",
    imageUrl: "/images/flower-oil.jpg",
  },
];

describe("ProductGrid Component", () => {
  it("renders loading state with skeletons", () => {
    render(<ProductGrid products={[]} isLoading={true} />);

    // Check for skeleton components
    const skeletons = screen.getAllByRole("presentation");
    expect(skeletons).toHaveLength(6); // 6 skeletons should be rendered
    skeletons.forEach((skeleton) => {
      expect(skeleton).toBeInTheDocument();
    });
  });

  it("renders loaded state with product cards", () => {
    render(<ProductGrid products={mockProducts} isLoading={false} />);

    // Check for product cards
    const productCards = screen.getAllByRole("article");
    expect(productCards).toHaveLength(mockProducts.length);

    // Verify product card content
    mockProducts.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
      expect(screen.getByText(product.type)).toBeInTheDocument();
      expect(screen.getByText(`$${product.price.toFixed(2)}`)).toBeInTheDocument();
    });
  });

  it("renders empty state when no products are provided", () => {
    render(<ProductGrid products={[]} isLoading={false} />);

    // Check that no product cards or skeletons are rendered
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();

    // Optionally, you can check for a specific empty state message if implemented
  });

  it("applies proper grid layout classes", () => {
    render(<ProductGrid products={mockProducts} isLoading={false} />);

    // Check for grid layout container
    const gridContainer = screen.getByRole("grid");
    expect(gridContainer).toHaveClass(
      "grid",
      "grid-cols-2",
      "sm:grid-cols-2",
      "md:grid-cols-3",
      "lg:grid-cols-3",
      "gap-3",
      "sm:gap-4",
      "md:gap-6"
    );
  });
});
