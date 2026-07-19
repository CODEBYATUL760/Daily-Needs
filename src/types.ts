/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductImages {
  main: string;
  front: string;
  side: string;
  back: string;
  zoom: string;
  lifestyle: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  weight: string;
  mrp: number;
  price: number;
  discount: number; // percentage
  saveAmount: number;
  availability: boolean;
  stock: number;
  sku: string;
  category: string;
  subcategory: string;
  rating: number;
  ratingCount: number;
  images: ProductImages;
  description: string;
  highlights: string[];
  ingredients?: string;
  nutritionFacts?: Record<string, string>;
  storageInstructions?: string;
  manufacturer?: string;
  countryOfOrigin?: string;
  expiryInfo?: string;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isTodayDeal?: boolean;
  isSeasonal?: boolean;
  isFestivalSpecial?: boolean;
  isHealthyChoice?: boolean;
  isDailyEssential?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  photos?: string[];
}

export interface DeliverySlot {
  id: string;
  time: string;
  label: string; // e.g., "Morning: 7 AM - 10 AM"
  available: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryCharge: number;
  tax: number;
  total: number;
  address: {
    fullName: string;
    phone: string;
    flat: string;
    area: string;
    pinCode: string;
    city: string;
    state: string;
  };
  deliverySlot: string;
  deliveryInstructions?: string;
  paymentMethod: 'cod' | 'upi';
  status: 'pending' | 'confirmed' | 'dispatched' | 'delivered';
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrderValue: number;
  description: string;
}
