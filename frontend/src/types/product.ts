export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number | string;
  imageUrl?: string;
  category?: string;
  brand?: string;
  stock?: number;
  isActive?: boolean;
}
