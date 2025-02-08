import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock next-intl for translations
vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

// Mock Zustand stores
vi.mock("@/lib/stores/use-product-store", () => {
  const actual = vi.importActual("@/lib/stores/use-product-store");
  return {
    ...actual,
    useProductStore: vi.fn(() => ({
      isAddDialogOpen: false,
      isEditDialogOpen: false,
      editingProduct: null,
      setAddDialogOpen: vi.fn(),
      setEditDialogOpen: vi.fn(),
      setEditingProduct: vi.fn(),
      resetState: vi.fn(),
    })),
  };
});

vi.mock("@/lib/stores/use-table-store", () => {
  const actual = vi.importActual("@/lib/stores/use-table-store");
  return {
    ...actual,
    useTableStore: vi.fn(() => ({
      nameFilter: "",
      typeFilter: "all",
      sortConfig: { key: null, direction: "asc" },
      currentPage: 1,
      setCurrentPage: vi.fn(),
      isDeleteDialogOpen: false,
      productToDelete: null,
      setIsDeleteDialogOpen: vi.fn(),
      setProductToDelete: vi.fn(),
      resetDeleteState: vi.fn(),
    })),
  };
});

// Extend global test utilities if needed
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
