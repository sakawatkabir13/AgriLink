export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  retailPrice: number;
  wholesalePrice: number;
  minWholesaleQty: number;
  unit: string;
  quantityAvailable: number;
  qualityGrade: 'A' | 'B' | 'C';
  region: string;
  freshnessdays: number;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isWholesale: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'paid' | 'dispatched' | 'delivered' | 'cancelled';
  totalAmount: number;
  deliveryCharge: number;
  createdAt: Date;
  region: string;
}

export type UserRole = 'admin' | 'buyer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  region?: string;
}
