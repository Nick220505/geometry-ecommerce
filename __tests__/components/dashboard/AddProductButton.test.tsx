import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AddProductButton } from "@/app/[locale]/(admin)/dashboard/components/add-product-button";
import { useProductStore } from "@/lib/stores/use-product-store";

// Mock the zustand store
vi.mock("@/lib/stores/use-product-store", () => ({
  useProductStore: vi.fn(),
}));

describe("AddProductButton Component", () => {
  it("renders the button with correct text and icon", () => {
    // Mock the store state
    useProductStore.mockReturnValue({
      setAddDialogOpen: vi.fn(),
    });

    render(<AddProductButton />);

    // Check if the button is rendered
    const button = screen.getByRole("button", { name: /add product/i });
    expect(button).toBeInTheDocument();

    // Check if the icon is present
    const icon = screen.getByTestId("plus-icon");
    expect(icon).toBeInTheDocument();
  });

  it("opens the dialog when the button is clicked", () => {
    const setAddDialogOpenMock = vi.fn();
    useProductStore.mockReturnValue({
      setAddDialogOpen: setAddDialogOpenMock,
    });

    render(<AddProductButton />);

    // Simulate button click
    const button = screen.getByRole("button", { name: /add product/i });
    fireEvent.click(button);

    // Verify that the dialog open state is updated
    expect(setAddDialogOpenMock).toHaveBeenCalledWith(true);
  });
});
