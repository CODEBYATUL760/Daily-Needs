export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  images: string[];
  description: string;
  unit: string;
  stock: number;
  sku: string;
  mrp: number;
  sellingPrice: number;
  discount: number; // e.g. 15 for 15% off
  rating: number;
  reviews: Review[];
  deliveryTime: string; // e.g. "20-45 mins"
  bestseller: boolean;
  trending: boolean;
  featured: boolean;
  returnPolicy: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  value: number; // percentage or fixed amount
  minOrderValue: number;
  description: string;
}

export interface Order {
  id: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  gst: number;
  total: number;
  couponCode?: string;
  paymentMethod: "UPI" | "COD";
  paymentStatus: "Pending" | "Paid";
  orderStatus: "Placed" | "Processed" | "Out for Delivery" | "Delivered";
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
    pincode: string;
  };
  createdAt: string;
  estimatedDelivery: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  pincode: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  categorySales: { category: string; value: number }[];
  recentOrders: Order[];
  outOfStockCount: number;
}
