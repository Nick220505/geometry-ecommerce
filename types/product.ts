export interface Product {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  type: string;
  price: string;
  stock: string;
  imageUrl?: string;
}
