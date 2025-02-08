import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TableSkeleton } from "@/app/[locale]/(admin)/dashboard/components/table/table-skeleton";

describe("TableSkeleton Component", () => {
  it("renders the table header with correct columns", () => {
    render(<TableSkeleton />);

    const headers = [
      "Image",
      "Name",
      "Type",
      "Price",
      "Stock",
      "Actions",
    ];

    headers.forEach((header) => {
      expect(screen.getByRole("columnheader", { name: header })).toBeInTheDocument();
    });
  });

  it("renders the correct number of skeleton rows", () => {
    render(<TableSkeleton />);

    const rows = screen.getAllByRole("row");
    // 1 header row + 5 skeleton rows
    expect(rows).toHaveLength(6);
  });

  it("renders skeleton cells with proper classes", () => {
    render(<TableSkeleton />);

    // Check for skeleton cells
    const skeletonCells = screen.getAllByRole("cell");
    expect(skeletonCells.length).toBeGreaterThan(0);

    // Verify skeleton classes are applied
    skeletonCells.forEach((cell) => {
      expect(cell.firstChild).toHaveClass("bg-muted", "animate-pulse");
    });
  });

  it("renders skeleton image cells with proper dimensions", () => {
    render(<TableSkeleton />);

    const imageSkeletons = screen.getAllByRole("cell").filter((cell) =>
      cell.firstChild?.classList.contains("w-16")
    );

    expect(imageSkeletons).toHaveLength(5); // 5 rows with image skeletons
    imageSkeletons.forEach((imageSkeleton) => {
      expect(imageSkeleton.firstChild).toHaveClass("h-16", "rounded-lg");
    });
  });

  it("renders action skeletons with correct structure", () => {
    render(<TableSkeleton />);

    const actionCells = screen.getAllByRole("cell").filter((cell) =>
      cell.firstChild?.classList.contains("flex")
    );

    expect(actionCells).toHaveLength(5); // 5 rows with action skeletons
    actionCells.forEach((actionCell) => {
      const buttons = actionCell.querySelectorAll(".h-8.w-8");
      expect(buttons).toHaveLength(2); // Each action cell has 2 skeleton buttons
    });
  });
});
