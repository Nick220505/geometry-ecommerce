import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProductSkeleton } from "@/app/[locale]/store/components/product/product-skeleton";

describe("ProductSkeleton Component", () => {
  it("renders the skeleton card structure", () => {
    render(<ProductSkeleton />);

    // Check for the card container
    const card = screen.getByRole("article");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("overflow-hidden", "card-hover-effect");
  });

  it("renders the skeleton for the title and description", () => {
    render(<ProductSkeleton />);

    // Check for title skeleton
    const titleSkeleton = screen.getAllByRole("presentation")[0];
    expect(titleSkeleton).toBeInTheDocument();
    expect(titleSkeleton).toHaveClass("h-6", "w-3/4");

    // Check for description skeleton
    const descriptionSkeleton = screen.getAllByRole("presentation")[1];
    expect(descriptionSkeleton).toBeInTheDocument();
    expect(descriptionSkeleton).toHaveClass("h-4", "w-1/4", "mt-2");
  });

  it("renders the skeleton for the image", () => {
    render(<ProductSkeleton />);

    // Check for image skeleton
    const imageSkeleton = screen.getByRole("presentation", {
      name: /image skeleton/i,
    });
    expect(imageSkeleton).toBeInTheDocument();
    expect(imageSkeleton).toHaveClass("w-full", "aspect-square", "rounded-lg", "mb-4");
  });

  it("renders the skeleton for the price and button", () => {
    render(<ProductSkeleton />);

    // Check for price skeleton
    const priceSkeleton = screen.getByRole("presentation", {
      name: /price skeleton/i,
    });
    expect(priceSkeleton).toBeInTheDocument();
    expect(priceSkeleton).toHaveClass("h-6", "w-20");

    // Check for button skeleton
    const buttonSkeleton = screen.getByRole("presentation", {
      name: /button skeleton/i,
    });
    expect(buttonSkeleton).toBeInTheDocument();
    expect(buttonSkeleton).toHaveClass("h-9", "w-28");
  });
});
