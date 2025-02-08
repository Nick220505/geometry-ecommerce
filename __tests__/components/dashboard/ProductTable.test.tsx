import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProductTable } from "@/app/[locale]/(admin)/dashboard/components/product-table";
import { useProductStore } from "@/lib/stores/use-product-store";
import { useTableStore } from "@/lib/stores/use-table-store";

vi.mock("@/lib/stores/use-product-store", () => ({
  useProductStore: vi.fn(),
}));

vi.mock("@/lib/stores/use-table-store", () => ({
  useTableStore: vi.fn(),
}));

const mockProducts = [
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

describe("ProductTable Component", () => {
  beforeEach(() => {
    useProductStore.mockReturnValue({
      setEditDialogOpen: vi.fn(),
      setEditingProduct: vi.fn(),
    });

    useTableStore.mockReturnValue({
      nameFilter: "",
      typeFilter: "all",
      sortConfig: { key: null, direction: "asc" },
      currentPage: 1,
      setCurrentPage: vi.fn(),
      isDeleteDialogOpen: false,
      productToDelete: null,
      setIsDeleteDialogOpen: vi.fn(),
    });
  });

  it("renders the table with correct headers", () => {
    render(<ProductTable products={mockProducts} />);

    const headers = ["Image", "Name", "Type", "Price", "Stock", "Actions"];
    headers.forEach((header) => {
      expect(screen.getByRole("columnheader", { name: header })).toBeInTheDocument();
    });
  });

  it("renders product rows correctly", () => {
    render(<ProductTable products={mockProducts} />);

    mockProducts.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
      expect(screen.getByText(product.type)).toBeInTheDocument();
      expect(screen.getByText(`$${product.price.toFixed(2)}`)).toBeInTheDocument();
      expect(screen.getByText(product.stock.toString())).toBeInTheDocument();
    });
  });

  it("renders pagination and handles page changes", () => {
    const setCurrentPageMock = vi.fn();
    useTableStore.mockReturnValue({
      ...useTableStore(),
      currentPage: 1,
      setCurrentPage: setCurrentPageMock,
    });

    render(<ProductTable products={mockProducts} />);

    // Check if pagination buttons are rendered
    const nextButton = screen.getByRole("button", { name: /next/i });
    const previousButton = screen.getByRole("button", { name: /previous/i });

    expect(nextButton).toBeInTheDocument();
    expect(previousButton).toBeInTheDocument();

    // Simulate clicking the next button
    fireEvent.click(nextButton);
    expect(setCurrentPageMock).toHaveBeenCalledWith(2);

    // Simulate clicking the previous button
    fireEvent.click(previousButton);
    expect(setCurrentPageMock).toHaveBeenCalledWith(0);
  });

  it("renders edit and delete dialogs in the DOM", () => {
    render(<ProductTable products={mockProducts} />);

    // Check for edit dialog
    const editDialog = screen.getByRole("dialog", { name: /edit product/i });
    expect(editDialog).toBeInTheDocument();

    // Check for delete dialog
    const deleteDialog = screen.getByRole("dialog", { name: /delete product/i });
    expect(deleteDialog).toBeInTheDocument();
  });
});
