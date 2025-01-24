export interface Product {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  type: string;
  price: string;
  stock: string;
  imageUrl: string;
}
