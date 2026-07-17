export interface Product {
  id: string;
  brand: string;
  name: string;
  category: string;
  images: string[];
  weight: number;
  unit: string; // 'g', 'kg', 'ml', 'L', 'pcs', 'packs'
  mrp: number;
  sellingPrice: number;
  discount: number; // percentage
  sku: string;
  barcode: string;
  stock: number;
  description: string;
  ingredients?: string;
  nutritionInfo?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
    sodium?: string;
    fiber?: string;
  };
  manufacturer: string;
  countryOfOrigin: string;
  storageInstructions: string;
  shelfLife: string;
  deliveryTime: string; // e.g. "10-15 mins", "2 hours", etc.
  rating: number;
  reviewCount: number;
  bestSeller: boolean;
  featured: boolean;
  trending: boolean;
  returnPolicy: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  description: string;
}

export interface Order {
  id: string;
  items: {
    productId: string;
    name: string;
    brand: string;
    quantity: number;
    price: number;
    image: string;
    weight: string;
  }[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: 'ordered' | 'packed' | 'out-for-delivery' | 'delivered';
  createdAt: string;
  estimatedDelivery: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    pincode: string;
  };
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedProducts?: string[]; // list of product IDs
}
