/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Star, Search, Filter, HelpCircle, Heart, ArrowRight,
  GitCompare, Sparkles, ChevronRight, MapPin, Grid, PhoneCall, Calendar,
  SlidersHorizontal, X, ArrowUpRight, Clock, ShieldCheck, RefreshCw, Undo, ChevronDown
} from 'lucide-react';

import { Product, CartItem, Order, Coupon } from './types';
import { generateProducts, curatedBrands, staticCoupons } from './data/products';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CompareModal from './components/CompareModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import FAQSupport from './components/FAQSupport';
import Footer from './components/Footer';
import ToastContainer, { ToastMessage } from './components/Toast';

export default function App() {
  // Main Products collection
  const allProducts = useMemo(() => generateProducts(), []);

  // Application State managers
  const [currentView, setCurrentView] = useState<'Home' | 'Shop' | 'Categories' | 'Wishlist' | 'Support'>('Home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [comparing, setComparing] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals Visibility managers
  const [cartOpen, setCartOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Shop filter state managers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState(1000);
  const [minRatingFilter, setMinRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('popularity');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Pagination manager
  const [itemsPerPage, setItemsPerPage] = useState(24);

  // Flash Sale Countdown simulator (2 hours, 45 mins loop)
  const [countdown, setCountdown] = useState({ h: 2, m: 45, s: 12 });

  // 1. Initial mounting and loading localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('dn_cart_storage');
    const savedWishlist = localStorage.getItem('dn_wishlist_storage');
    const savedRecent = localStorage.getItem('dn_recent_viewed');

    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { setCart([]); }
    }
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch (e) { setWishlist([]); }
    }
    if (savedRecent) {
      try { setRecentlyViewed(JSON.parse(savedRecent)); } catch (e) { setRecentlyViewed([]); }
    }
  }, []);

  // Loop countdown timer for flash sales
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 2, m: 59, s: 59 }; // loop
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Toast dispatch helper
  const triggerToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const id = `toast_${Date.now()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 2. Shopping Operations
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];
      
      if (existing) {
        updated = prev.map((item) => 
          item.product.id === product.id 
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } 
            : item
        );
      } else {
        updated = [...prev, { product, quantity: 1 }];
      }

      localStorage.setItem('dn_cart_storage', JSON.stringify(updated));
      return updated;
    });
    triggerToast(`Added "${product.name}" to cart!`, 'success');
  };

  const handleRemoveFromCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let updated: CartItem[];

      if (existing && existing.quantity > 1) {
        updated = prev.map((item) => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      } else {
        updated = prev.filter((item) => item.product.id !== product.id);
      }

      localStorage.setItem('dn_cart_storage', JSON.stringify(updated));
      return updated;
    });
    triggerToast(`Removed "${product.name}" from cart.`, 'warning');
  };

  const handleClearItemFromCart = (product: Product) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product.id !== product.id);
      localStorage.setItem('dn_cart_storage', JSON.stringify(updated));
      return updated;
    });
    triggerToast(`Cleared all quantities of "${product.name}".`, 'info');
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      let updated: Product[];

      if (exists) {
        updated = prev.filter((item) => item.id !== product.id);
        triggerToast(`Removed "${product.name}" from saved list.`, 'info');
      } else {
        updated = [...prev, product];
        triggerToast(`Saved "${product.name}" to wishlist!`, 'success');
      }

      localStorage.setItem('dn_wishlist_storage', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleCompare = (product: Product) => {
    setComparing((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      
      if (exists) {
        const updated = prev.filter((item) => item.id !== product.id);
        triggerToast(`Removed "${product.brand} ${product.name}" from comparisons.`, 'info');
        return updated;
      } else {
        if (prev.length >= 3) {
          triggerToast('Comparison panel holds a maximum of 3 products side-by-side.', 'warning');
          return prev;
        }
        const updated = [...prev, product];
        triggerToast(`Added "${product.brand} ${product.name}" to compare!`, 'success');
        setCompareOpen(true);
        return updated;
      }
    });
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    
    // Manage recently viewed items
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      const updated = [product, ...filtered].slice(0, 8);
      localStorage.setItem('dn_recent_viewed', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setCurrentView('Shop');
  };

  const handleCheckoutProgress = (coupon: Coupon | null) => {
    setAppliedCoupon(coupon);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handlePlaceOrderSuccess = (order: Order) => {
    // Empty local cart since order succeeded
    setCart([]);
    localStorage.removeItem('dn_cart_storage');
    triggerToast(`Order ${order.id} placed successfully!`, 'success');
  };

  // 3. Filtering and Sorting Logic for Catalog
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Search matches
      const cleanSearch = searchQuery.toLowerCase().trim();
      if (cleanSearch) {
        const matchesSearch = 
          p.name.toLowerCase().includes(cleanSearch) ||
          p.brand.toLowerCase().includes(cleanSearch) ||
          p.category.toLowerCase().includes(cleanSearch) ||
          p.subcategory.toLowerCase().includes(cleanSearch);
        if (!matchesSearch) return false;
      }

      // Category matches
      if (selectedCategory && p.category !== selectedCategory) return false;

      // Subcategory matches
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;

      // Brand matches
      if (selectedBrand && p.brand !== selectedBrand) return false;

      // Price limit matches
      if (p.price > maxPriceFilter) return false;

      // Rating matches
      if (p.rating < minRatingFilter) return false;

      return true;
    });
  }, [allProducts, searchQuery, selectedCategory, selectedSubcategory, selectedBrand, maxPriceFilter, minRatingFilter]);

  const sortedProducts = useMemo(() => {
    const items = [...filteredProducts];
    if (sortBy === 'priceLowHigh') {
      return items.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'priceHighLow') {
      return items.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'newest') {
      return items.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }
    if (sortBy === 'rating') {
      return items.sort((a, b) => b.rating - a.rating);
    }
    // Default popularity / best sellers
    return items.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  }, [filteredProducts, sortBy]);

  // Categories and brand details extractor
  const uniqueCategoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allProducts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [allProducts]);

  const subcategoriesForSelectedCategory = useMemo(() => {
    if (!selectedCategory) return [];
    const set = new Set<string>();
    allProducts.forEach((p) => {
      if (p.category === selectedCategory) {
        set.add(p.subcategory);
      }
    });
    return Array.from(set);
  }, [allProducts, selectedCategory]);

  const uniqueBrandsWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const scopeProducts = selectedCategory 
      ? allProducts.filter(p => p.category === selectedCategory)
      : allProducts;
    
    scopeProducts.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [allProducts, selectedCategory]);

  // Reset all filters helper
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedBrand('');
    setMaxPriceFilter(1000);
    setMinRatingFilter(0);
    setSortBy('popularity');
    setItemsPerPage(24);
  };

  const getQtyInCart = (prod: Product) => {
    const item = cart.find((i) => i.product.id === prod.id);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. Sticky Navigation Header */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        compareCount={comparing.length}
        products={allProducts}
        currentView={currentView}
        onNavigate={(view: any) => { setCurrentView(view); handleResetFilters(); }}
        onSelectProduct={handleProductSelect}
        onSearchSubmit={handleSearchSubmit}
        onOpenCart={() => setCartOpen(true)}
        onOpenCompare={() => setComparing(allProducts.slice(0, 2))} // Seed comparison for fun or let them select
      />

      {/* 2. Main Body Content Switcher */}
      <main className="flex-1 pb-16 md:pb-0">
        
        {/* VIEW: HOME PAGE */}
        {currentView === 'Home' && (
          <div className="space-y-12">
            
            {/* Promo Hero Slider Banner */}
            <div className="bg-emerald-900 text-white relative py-12 md:py-16 px-4 text-left overflow-hidden">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-5 relative z-10">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-800 text-emerald-300 font-bold px-3 py-1 rounded-full text-[11px] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" /> Monsoon Organic Fest 2026
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                    Get fresh daily essentials delivered to your door in <span className="text-amber-400">2 Hours</span>
                  </h1>
                  <p className="text-xs md:text-sm text-emerald-100 leading-relaxed max-w-lg">
                    Ditch the queue at supermarkets! Daily Needs brings the highest quality Indian brands (Amul, Aashirvaad, Britannia, Fortune, Nestlé) and handpicked kitchen essentials to Connaught Place residents.
                  </p>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setCurrentView('Shop')}
                      className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-black text-xs md:text-sm px-6 py-3.5 rounded-xl cursor-pointer shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      Shop Catalog Now <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => { setSelectedCategory('Atta, Flour & Grains'); setCurrentView('Shop'); }}
                      className="bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs md:text-sm px-6 py-3.5 rounded-xl border border-emerald-700 hover:border-emerald-600 cursor-pointer transition-colors"
                    >
                      Atta & Staple Flours
                    </button>
                  </div>
                </div>

                {/* Right side teaser image card */}
                <div className="relative flex justify-center z-10">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 w-full max-w-sm text-left space-y-4 shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-400 rounded-full blur-2xl opacity-20" />
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-amber-400 text-gray-950 px-2 py-0.5 rounded font-black uppercase tracking-wider">Today's Deal</span>
                      <span className="text-xs text-emerald-200">Starting @ ₹14</span>
                    </div>
                    <h3 className="text-lg font-black text-white leading-tight">Super Saver Weekly Groceries pack</h3>
                    <p className="text-[11px] text-emerald-100 leading-relaxed">Get 10% instant off on premium Amul Paneer, Aashirvaad Atta, and Surf Excel easy wash powders using coupon code <code className="bg-emerald-800 text-emerald-300 font-bold px-1 py-0.5 rounded uppercase">DAILY100</code></p>
                    <div className="flex items-center gap-2 pt-2 text-[10px] text-amber-300 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Certified Fresh & Hygienically Sealed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative backgrounds */}
              <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-l from-emerald-800/10 to-transparent pointer-events-none" />
            </div>

            {/* Shop by Brand Slider Section */}
            <div className="max-w-7xl mx-auto px-4 text-left">
              <div className="flex items-end justify-between border-b border-gray-100 pb-3 mb-6">
                <div>
                  <h2 className="text-lg font-black text-gray-950 uppercase tracking-wide">Shop By Trusted Brands</h2>
                  <p className="text-xs text-gray-400">Authentic products from India's most loved grocery brands</p>
                </div>
                <button 
                  onClick={() => setCurrentView('Shop')}
                  className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View All Brands <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {curatedBrands.slice(0, 5).map((brand) => (
                  <button
                    key={brand.name}
                    onClick={() => { setSelectedBrand(brand.name); setCurrentView('Shop'); }}
                    className="p-4 bg-white border border-gray-100 rounded-2xl text-center hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between items-center h-44 text-left group bg-linear-to-b hover:from-white hover:to-emerald-50/10"
                  >
                    <img 
                      src={brand.image} 
                      alt={brand.name} 
                      className="w-16 h-16 object-cover rounded-xl border border-gray-50 mb-2 group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{brand.name}</h4>
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 h-7 font-medium">{brand.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Shop by Category Circles Section */}
            <div className="max-w-7xl mx-auto px-4 text-left">
              <div className="border-b border-gray-100 pb-3 mb-6">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Explore Categories</h2>
                <p className="text-xs text-gray-400">Hand-sorted grocery selections for your family</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(uniqueCategoriesWithCounts).map(([catName, count]) => {
                  return (
                    <button
                      key={catName}
                      onClick={() => { setSelectedCategory(catName); setCurrentView('Shop'); }}
                      className="p-5 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 hover:shadow-md hover:border-emerald-100 text-left transition-all cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Grid className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-950 group-hover:text-emerald-700 transition-colors leading-tight">{catName}</h4>
                        <span className="text-[10px] text-gray-400 font-semibold block uppercase tracking-wider mt-0.5">{count} Variants listed</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Flash Sale countdown and Best Deals Grid */}
            <div className="max-w-7xl mx-auto px-4 text-left">
              
              {/* Flash Header with countdown clock */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-100 pb-4 mb-6 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-red-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">Flash Sale</span>
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Today's Hot Deals</h2>
                  </div>
                  <p className="text-xs text-gray-400">Limited-time discounted prices on essential household needs</p>
                </div>

                {/* Clock countdown timer */}
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 self-start sm:self-auto">
                  <Clock className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>Closes Inside:</span>
                  <div className="flex gap-1 font-mono text-[13px] text-red-800 font-extrabold">
                    <span>{String(countdown.h).padStart(2, '0')}h</span>
                    <span>:</span>
                    <span>{String(countdown.m).padStart(2, '0')}m</span>
                    <span>:</span>
                    <span>{String(countdown.s).padStart(2, '0')}s</span>
                  </div>
                </div>
              </div>

              {/* Product cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {allProducts.filter(p => p.isTodayDeal).slice(0, 8).map((product) => {
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantityInCart={getQtyInCart(product)}
                      isWishlisted={wishlist.some(w => w.id === product.id)}
                      isComparing={comparing.some(c => c.id === product.id)}
                      onAddToCart={handleAddToCart}
                      onRemoveFromCart={handleRemoveFromCart}
                      onToggleWishlist={handleToggleWishlist}
                      onToggleCompare={handleToggleCompare}
                      onSelectProduct={handleProductSelect}
                    />
                  );
                })}
              </div>
            </div>

            {/* Daily Essentials (Atta and Grains segment) Banner and Grid */}
            <div className="bg-linear-to-b from-emerald-50/50 to-white py-12">
              <div className="max-w-7xl mx-auto px-4 text-left space-y-8">
                
                <div className="flex items-end justify-between border-b border-emerald-100 pb-3">
                  <div>
                    <h2 className="text-lg font-black text-emerald-950 uppercase tracking-wide">🌾 Premium Staples & Chakki Atta</h2>
                    <p className="text-xs text-emerald-800 font-medium">Sourced directly from finest Indian grain mills</p>
                  </div>
                  <button 
                    onClick={() => { setSelectedCategory('Atta, Flour & Grains'); setCurrentView('Shop'); }}
                    className="text-xs text-emerald-700 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Staples Catalog <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {allProducts.filter(p => p.category === 'Atta, Flour & Grains').slice(0, 4).map((product) => {
                    return (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantityInCart={getQtyInCart(product)}
                        isWishlisted={wishlist.some(w => w.id === product.id)}
                        isComparing={comparing.some(c => c.id === product.id)}
                        onAddToCart={handleAddToCart}
                        onRemoveFromCart={handleRemoveFromCart}
                        onToggleWishlist={handleToggleWishlist}
                        onToggleCompare={handleToggleCompare}
                        onSelectProduct={handleProductSelect}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Customer Trust testimonial highlights block */}
            <div className="max-w-7xl mx-auto px-4 text-center py-10 space-y-6">
              <div className="max-w-xl mx-auto space-y-2">
                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  Verified Local Business
                </span>
                <h2 className="text-xl md:text-3xl font-black text-gray-950 tracking-tight">
                  Connaught Place's Trusted Grocery Hub
                </h2>
                <p className="text-xs text-gray-500">Why thousands of families depend on Daily Needs for their kitchens</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                  <div className="text-amber-400 font-black text-lg">★★★★★</div>
                  <p className="text-xs text-gray-500 italic">"The quality is always exceptional. The unpolished dals are clean, the cow ghee is extremely aromatic, and they package everything separately in sturdy eco-friendly bags. 10/10."</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">— Priya Sen, Resident</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                  <div className="text-amber-400 font-black text-lg">★★★★★</div>
                  <p className="text-xs text-gray-500 italic">"I was amazed by the delivery speed. Placed an order for MDH spices, Tata tea, and a Classmate notebook. Arrived in exactly 1 hour."</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">— Vikram Mehra, Business Owner</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                  <div className="text-amber-400 font-black text-lg">★★★★★</div>
                  <p className="text-xs text-gray-500 italic">"Excellent support! The store owner called me to confirm details when my choice of Aashirvaad Atta weight was out of stock. Highly supportive."</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">— Mrs. Kapoor, Homemaker</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW: CATALOG CATALOG SHOP PAGE */}
        {currentView === 'Shop' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold mb-6">
              <span className="hover:text-emerald-600 cursor-pointer" onClick={() => setCurrentView('Home')}>Home</span>
              <span>/</span>
              <span className="text-gray-900 font-bold">Grocery Store Catalog</span>
            </div>

            {/* Catalog header with summary count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-6 gap-4 text-left">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-gray-950 uppercase tracking-tight">
                  {selectedCategory || selectedBrand ? `${selectedBrand} ${selectedCategory}` : 'All Grocery Items'}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">Found <strong className="text-gray-950">{sortedProducts.length}</strong> matching products out of 520</p>
              </div>

              {/* Sort selector & Mobile filter toggle */}
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs rounded-xl border border-emerald-100 cursor-pointer w-1/2 sm:w-auto"
                >
                  <Filter className="w-4 h-4" /> Filters
                </button>

                <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 w-1/2 sm:w-auto">
                  <span className="text-xs text-gray-400 font-semibold mr-1.5 uppercase hidden sm:inline">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
                  >
                    <option value="popularity">Popularity / Deals</option>
                    <option value="priceLowHigh">Price: Low to High</option>
                    <option value="priceHighLow">Price: High to Low</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Main grid section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* DESKTOP SIDEBAR FILTERS (Sticky) */}
              <aside className="hidden lg:block space-y-6 text-left sticky top-24 self-start max-h-[85vh] overflow-y-auto pr-2">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm font-black text-gray-950 uppercase tracking-wide flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Filter Options
                  </span>
                  <button 
                    onClick={handleResetFilters}
                    className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                  >
                    Reset All
                  </button>
                </div>

                {/* Categories tree */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Browse Categories</h4>
                  <div className="space-y-1 text-xs font-semibold">
                    <button
                      onClick={() => { setSelectedCategory(''); setSelectedSubcategory(''); }}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors ${
                        !selectedCategory ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      All Categories
                    </button>
                    {Object.entries(uniqueCategoriesWithCounts).map(([catName, count]) => {
                      const isSelected = selectedCategory === catName;
                      return (
                        <div key={catName} className="space-y-0.5">
                          <button
                            onClick={() => { setSelectedCategory(catName); setSelectedSubcategory(''); }}
                            className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex justify-between items-center ${
                              isSelected ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>{catName}</span>
                            <span className="text-[10px] text-gray-400">({count})</span>
                          </button>
                          
                          {/* Render subcategories if active */}
                          {isSelected && subcategoriesForSelectedCategory.length > 0 && (
                            <div className="pl-4 space-y-0.5 border-l border-gray-100 ml-3 py-1">
                              {subcategoriesForSelectedCategory.map((subName) => {
                                const isSubSelected = selectedSubcategory === subName;
                                return (
                                  <button
                                    key={subName}
                                    onClick={() => setSelectedSubcategory(subName)}
                                    className={`w-full text-left py-1 px-2 rounded text-[11px] font-medium transition-colors ${
                                      isSubSelected ? 'text-emerald-600 font-bold bg-emerald-50/40' : 'text-gray-500 hover:text-emerald-700'
                                    }`}
                                  >
                                    {subName}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Brands checklist */}
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Brands Checklist</h4>
                  <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1 text-xs font-semibold text-gray-600">
                    <button
                      onClick={() => setSelectedBrand('')}
                      className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors ${
                        !selectedBrand ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      All Brands
                    </button>
                    {uniqueBrandsWithCounts.map(([brandName, count]) => {
                      const isSelected = selectedBrand === brandName;
                      return (
                        <button
                          key={brandName}
                          onClick={() => setSelectedBrand(brandName)}
                          className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors flex justify-between items-center ${
                            isSelected ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span>{brandName}</span>
                          <span className="text-[10px] text-gray-400">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price range slider */}
                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                    <span>Max Budget Limit</span>
                    <span className="text-gray-900 font-black text-xs">₹{maxPriceFilter}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={maxPriceFilter}
                    onChange={(e) => setMaxPriceFilter(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                    <span>₹10</span>
                    <span>₹1000</span>
                  </div>
                </div>

                {/* Rating filter */}
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Minimum Rating</h4>
                  <div className="flex items-center gap-1">
                    {[0, 3, 4, 4.5].map((val) => {
                      const isSelected = minRatingFilter === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setMinRatingFilter(val)}
                          className={`flex-1 py-1.5 rounded-lg border text-center font-bold text-[10px] transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-700' 
                              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                          }`}
                        >
                          {val === 0 ? 'All' : `${val} ★+`}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </aside>

              {/* PRODUCTS CATALOG LISTINGS GRID */}
              <div className="lg:col-span-3 space-y-6">
                
                {sortedProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl space-y-4 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400">
                      <Search className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-gray-950">No products match your filters</p>
                      <p className="text-xs text-gray-400 mt-1">Try resetting the brand checklist, increasing the price range, or searching general items.</p>
                    </div>
                    <button
                      onClick={handleResetFilters}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Active Filter Tags */}
                    {(selectedCategory || selectedBrand || searchQuery || selectedSubcategory || minRatingFilter > 0 || maxPriceFilter < 1000) && (
                      <div className="flex flex-wrap items-center gap-1.5 text-left bg-emerald-50/20 p-3 rounded-2xl border border-emerald-50/60">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mr-1">Active:</span>
                        {searchQuery && (
                          <span className="bg-white border text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5 shadow-2xs">
                            Query: "{searchQuery}" <X className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => setSearchQuery('')} />
                          </span>
                        )}
                        {selectedCategory && (
                          <span className="bg-white border text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5 shadow-2xs">
                            Cat: {selectedCategory} <X className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => setSelectedCategory('')} />
                          </span>
                        )}
                        {selectedSubcategory && (
                          <span className="bg-white border text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5 shadow-2xs">
                            Sub: {selectedSubcategory} <X className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => setSelectedSubcategory('')} />
                          </span>
                        )}
                        {selectedBrand && (
                          <span className="bg-white border text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5 shadow-2xs">
                            Brand: {selectedBrand} <X className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => setSelectedBrand('')} />
                          </span>
                        )}
                        {maxPriceFilter < 1000 && (
                          <span className="bg-white border text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5 shadow-2xs">
                            Max: ₹{maxPriceFilter} <X className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => setMaxPriceFilter(1000)} />
                          </span>
                        )}
                        {minRatingFilter > 0 && (
                          <span className="bg-white border text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1.5 shadow-2xs">
                            Rating: {minRatingFilter}★+ <X className="w-3 h-3 text-red-500 cursor-pointer" onClick={() => setMinRatingFilter(0)} />
                          </span>
                        )}
                        <button 
                          onClick={handleResetFilters}
                          className="text-[10px] text-rose-600 font-extrabold hover:underline ml-auto cursor-pointer"
                        >
                          Clear all
                        </button>
                      </div>
                    )}

                    {/* Products cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedProducts.slice(0, itemsPerPage).map((product) => {
                        return (
                          <ProductCard
                            key={product.id}
                            product={product}
                            quantityInCart={getQtyInCart(product)}
                            isWishlisted={wishlist.some(w => w.id === product.id)}
                            isComparing={comparing.some(c => c.id === product.id)}
                            onAddToCart={handleAddToCart}
                            onRemoveFromCart={handleRemoveFromCart}
                            onToggleWishlist={handleToggleWishlist}
                            onToggleCompare={handleToggleCompare}
                            onSelectProduct={handleProductSelect}
                          />
                        );
                      })}
                    </div>

                    {/* Load More pagination button */}
                    {sortedProducts.length > itemsPerPage && (
                      <div className="pt-6 text-center">
                        <button
                          onClick={() => setItemsPerPage((prev) => prev + 24)}
                          className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-bold py-3 px-8 rounded-xl cursor-pointer transition-all active:scale-95 shadow-2xs"
                        >
                          Show More Grocery Items
                        </button>
                      </div>
                    )}
                  </>
                )}

              </div>

            </div>
          </div>
        )}

        {/* VIEW: CATEGORY EXPLORATION PAGE */}
        {currentView === 'Categories' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 text-left animate-fade-in">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-wide">Category Directory</h1>
              <p className="text-xs text-gray-400">Quickly find the specific subcategories you need for your grocery cart.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(uniqueCategoriesWithCounts).map(([catName, count]) => {
                // Find matching base items or make demo subcategories
                const matchingItems = allProducts.filter(p => p.category === catName);
                const subNames = Array.from(new Set(matchingItems.map(p => p.subcategory)));

                return (
                  <div key={catName} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-80">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold">
                          <Grid className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-gray-900 text-base">{catName}</h3>
                          <span className="text-[10px] text-gray-400 font-semibold block uppercase tracking-wider">{count} Items listed</span>
                        </div>
                      </div>

                      {/* Subcategories list */}
                      <div className="space-y-1.5 pl-1.5">
                        {subNames.slice(0, 5).map((subName) => (
                          <button
                            key={subName}
                            onClick={() => { setSelectedCategory(catName); setSelectedSubcategory(subName); setCurrentView('Shop'); }}
                            className="w-full text-left text-xs font-semibold text-gray-600 hover:text-emerald-600 flex items-center gap-1.5 cursor-pointer"
                          >
                            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                            <span>{subName}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => { setSelectedCategory(catName); setCurrentView('Shop'); }}
                      className="text-xs text-emerald-700 font-black hover:underline flex items-center gap-1 pt-3 border-t border-gray-50"
                    >
                      Browse full category list <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW: SAVED WISHLIST PAGE */}
        {currentView === 'Wishlist' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-left animate-fade-in">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500 fill-current" /> My Saved Wishlist
              </h1>
              <p className="text-xs text-gray-400">Save items here to quickly add them to your cart in future purchases.</p>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl space-y-4 max-w-sm mx-auto">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
                  <Heart className="w-8 h-8 fill-current" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-gray-900">Your Saved List is Empty</p>
                  <p className="text-xs text-gray-400 mt-1">Keep track of items you like by clicking the Heart icon on any grocery product card.</p>
                </div>
                <button
                  onClick={() => setCurrentView('Shop')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer"
                >
                  Go To Shop
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlist.map((product) => {
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      quantityInCart={getQtyInCart(product)}
                      isWishlisted={true}
                      isComparing={comparing.some(c => c.id === product.id)}
                      onAddToCart={handleAddToCart}
                      onRemoveFromCart={handleRemoveFromCart}
                      onToggleWishlist={handleToggleWishlist}
                      onToggleCompare={handleToggleCompare}
                      onSelectProduct={handleProductSelect}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW: SUPPORT & FAQS */}
        {currentView === 'Support' && <FAQSupport />}

      </main>

      {/* 3. Footer Branding Area */}
      <Footer onNavigate={(view: any) => { setCurrentView(view); handleResetFilters(); }} />

      {/* 4. MODALS & FLY-OUT OVERLAYS */}
      
      {/* Side Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearItem={handleClearItemFromCart}
        onCheckout={handleCheckoutProgress}
      />

      {/* Product Specification Comparison sheet */}
      <CompareModal
        comparingProducts={comparing}
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
        onRemoveFromCompare={(p) => setComparing((prev) => prev.filter((item) => item.id !== p.id))}
        onAddToCart={handleAddToCart}
        quantityInCart={getQtyInCart}
      />

      {/* Interactive Detail Modal with magnification gallery */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        quantityInCart={selectedProduct ? getQtyInCart(selectedProduct) : 0}
        isWishlisted={selectedProduct ? wishlist.some(w => w.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        relatedProducts={allProducts.filter(p => p.category === selectedProduct?.category && p.id !== selectedProduct?.id)}
        onSelectProduct={handleProductSelect}
      />

      {/* Multi-step checkout form flow */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cart}
        appliedCoupon={appliedCoupon}
        onPlaceOrder={handlePlaceOrderSuccess}
      />

      {/* Elegant Toast notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Mobile Sticky bottom navigation spacers */}
      <div className="h-16 md:hidden" />

    </div>
  );
}
