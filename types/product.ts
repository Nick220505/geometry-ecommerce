export interface Product {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  stock: number;
  imageUrl: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
}
