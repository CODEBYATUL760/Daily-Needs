import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Coupon, Order, UserProfile } from "../types";
import { ALL_PRODUCTS, ACTIVE_COUPONS } from "../data/products";

interface StoreContextType {
  // Navigation & Routing
  page: string;
  setPage: (page: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeOrderToTrack: string | null;
  setActiveOrderToTrack: (id: string | null) => void;

  // Products & Categories
  products: Product[];
  
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // User Auth
  user: UserProfile | null;
  login: (email: string, name?: string) => void;
  signup: (name: string, email: string, phone: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Cart State
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  // Computed Cart Totals
  cartSubtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  gstAmount: number;
  cartTotal: number;
  isMinOrderMet: boolean;
  minOrderValue: number;
  freeShippingThreshold: number;

  // Wishlist
  wishlist: string[]; // array of product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (paymentMethod: "UPI" | "COD", customerDetails: Order["customerDetails"]) => Order | null;
  updateOrderStatus: (orderId: string, status: Order["orderStatus"]) => void;

  // Recently Viewed
  recentlyViewed: string[]; // array of product IDs
  addToRecentlyViewed: (productId: string) => void;

  // Notifications
  notifications: { id: string; message: string; type: "success" | "info" | "warning" }[];
  addNotification: (message: string, type?: "success" | "info" | "warning") => void;
  removeNotification: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Simple local routing state (Home, Categories, Wishlist, Cart, Checkout, Success, Track, Login, Signup, Dashboard, Admin, About, Contact, FAQ, Terms, Privacy, Refund)
  const [page, setPageInternal] = useState<string>("Home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeOrderToTrack, setActiveOrderToTrack] = useState<string | null>(null);

  const setPage = (newPage: string) => {
    setPageInternal(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      return saved === "true";
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // User Authentication state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, name?: string) => {
    const mockUser: UserProfile = {
      id: "user-101",
      name: name || "Rajesh Sharma", // Owner as default user for easy demo
      email: email,
      phone: "+91 9876543210",
      address: "123 Main Market, Bhopal, Madhya Pradesh",
      pincode: "462001"
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    addNotification(`Welcome back, ${mockUser.name}!`, "success");
    setPage("Home");
  };

  const signup = (name: string, email: string, phone: string) => {
    const mockUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name,
      email: email,
      phone: phone,
      address: "Enter your full address",
      pincode: "462001"
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    addNotification("Account created successfully!", "success");
    setPage("Home");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    addNotification("Logged out successfully.", "info");
    setPage("Home");
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...profile };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      addNotification("Profile updated!", "success");
    }
  };

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        addNotification(`Increased quantity of ${product.name}`, "success");
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      addNotification(`Added ${product.name} to cart`, "success");
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addNotification("Item removed from cart", "info");
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Computed totals
  const minOrderValue = 1000;
  const freeShippingThreshold = 2000;

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.sellingPrice * item.quantity, 0);
  const isMinOrderMet = cartSubtotal >= minOrderValue;

  // Coupon Engine
  const applyCouponCode = (code: string) => {
    const coupon = ACTIVE_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) {
      return { success: false, message: "Invalid Coupon Code" };
    }
    if (cartSubtotal < coupon.minOrderValue) {
      return {
        success: false,
        message: `Min order for this coupon is ₹${coupon.minOrderValue}. Your total: ₹${cartSubtotal}`,
      };
    }
    setAppliedCoupon(coupon);
    addNotification(`Coupon ${coupon.code} applied successfully!`, "success");
    return { success: true, message: `Coupon applied: ₹${coupon.value} off!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addNotification("Coupon removed.", "info");
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? Math.round((cartSubtotal * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;

  const afterDiscount = Math.max(0, cartSubtotal - discountAmount);
  const deliveryCharge = cartSubtotal === 0 ? 0 : afterDiscount >= freeShippingThreshold ? 0 : 100;
  const gstRate = 0.05; // 5% GST on groceries
  const gstAmount = Math.round(afterDiscount * gstRate);
  const cartTotal = afterDiscount + deliveryCharge + gstAmount;

  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        addNotification("Removed from Wishlist", "info");
        return prev.filter((id) => id !== productId);
      } else {
        addNotification("Added to Wishlist", "success");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (paymentMethod: "UPI" | "COD", customerDetails: Order["customerDetails"]): Order | null => {
    if (!isMinOrderMet) {
      addNotification("Minimum order value is ₹1000.", "warning");
      return null;
    }

    const newOrder: Order = {
      id: `DN-${Date.now()}`,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.sellingPrice,
        quantity: item.quantity,
        unit: item.product.unit,
        image: item.product.images[0]
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      deliveryCharge: deliveryCharge,
      gst: gstAmount,
      total: cartTotal,
      couponCode: appliedCoupon?.code,
      paymentMethod,
      paymentStatus: paymentMethod === "UPI" ? "Paid" : "Pending",
      orderStatus: "Placed",
      customerDetails,
      createdAt: new Date().toISOString(),
      estimatedDelivery: "20-45 Mins"
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveOrderToTrack(newOrder.id);
    setPage("Success");
    addNotification("Order placed successfully!", "success");
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["orderStatus"]) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, orderStatus: status } : ord))
    );
  };

  // Recently Viewed state
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem("recentlyViewed");
    return saved ? JSON.parse(saved) : [];
  });

  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      const updated = [productId, ...filtered].slice(0, 10); // keep last 10
      localStorage.setItem("recentlyViewed", JSON.stringify(updated));
      return updated;
    });
  };

  // Notifications banner alerts
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: "success" | "info" | "warning" }[]>([]);

  const addNotification = (message: string, type: "success" | "info" | "warning" = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <StoreContext.Provider
      value={{
        page,
        setPage,
        selectedProductId,
        setSelectedProductId,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeOrderToTrack,
        setActiveOrderToTrack,

        products: ALL_PRODUCTS,
        darkMode,
        toggleDarkMode,

        user,
        login,
        signup,
        logout,
        updateProfile,

        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        
        cartSubtotal,
        discountAmount,
        deliveryCharge,
        gstAmount,
        cartTotal,
        isMinOrderMet,
        minOrderValue,
        freeShippingThreshold,

        wishlist,
        toggleWishlist,
        isInWishlist,

        orders,
        placeOrder,
        updateOrderStatus,

        recentlyViewed,
        addToRecentlyViewed,

        notifications,
        addNotification,
        removeNotification
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
