
export enum UserRole {
  FARMER = 'FARMER',
  SHOP = 'SHOP',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export enum ProductCategory {
  CROPS = 'CROPS',
  LIVESTOCK = 'LIVESTOCK',
  DAIRY = 'DAIRY',
  POULTRY = 'POULTRY',
  SEEDS = 'SEEDS',
  FERTILIZER = 'FERTILIZER',
  TOOLS = 'TOOLS'
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  unit: string;
  stock: number;
  sellerId: string;
  sellerName: string;
  sellerType: 'FARMER' | 'SHOP';
  sellerAvatar?: string;
  sellerJoinDate?: string;
  isVerified?: boolean;
  image: string;
  moreImages?: string[];
  rating: number;
  reviewCount?: number;
  reviews?: Review[];
  location: string;
  country: string;
  description: string;
  dateAdded: string; // Added for sorting purposes
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  avatar: string;
}

export interface Order {
  id: string;
  items: { product: Product; quantity: number }[];
  total: number;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  date: string;
  buyerId: string;
}
