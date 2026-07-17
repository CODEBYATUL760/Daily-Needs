import React, { useState, useEffect } from 'react';
import { ArrowRight, Tag, Percent, Sparkles, Filter, SlidersHorizontal, Check, Truck, Loader2, RefreshCw, X, ShoppingCart, Info, Award } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CompareModal from './components/CompareModal';
import AdminDashboard from './components/AdminDashboard';
import AiAssistant from './components/AiAssistant';

import { PRODUCTS, COUPONS } from './data/products';
import { Product, CartItem, Order, Coupon } from './types';

export default function App() {
  // Master Lists (with admin synchronization hooks)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);

  // Local Client Session States
  const [cart, setCart] = useState<CartItem[]>(() => {
    return JSON.parse(localStorage.getItem('daily_needs_cart') || '[]');
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    return JSON.parse(localStorage.getItem('daily_needs_wishlist') || '[]');
  });
  const [compareList, setCompareList] = useState<Product[]>(() => {
    return JSON.parse(localStorage.getItem('daily_needs_compare') || '[]');
  });

  // Navigation Filter and Search State Manager
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Professional Sidebar Filter Panels
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(1000); // Max Price Limit Filter
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'rating'>('relevance');

  // Interactive UI Modal triggers
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);

  // Success Checkout Confirmation state
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Hero Carousel Banners active slide
  const [heroSlide, setHeroSlide] = useState(0);

  // Auto-synchronize client states to LocalStorage
  useEffect(() => {
    localStorage.setItem('daily_needs_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('daily_needs_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('daily_needs_compare', JSON.stringify(compareList));
  }, [compareList]);

  // Rotates Hero Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Cart Mutators
  const handleAddToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert(`Only ${product.stock} units of ${product.name} are available in our local dark store.`);
        return;
      }
      setCart(
        cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (!existing) return;
    if (existing.quantity === 1) {
      setCart(cart.filter((item) => item.product.id !== product.id));
    } else {
      setCart(
        cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist Toggle
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  // Compare Toggle (max limit 4)
  const handleToggleCompare = (product: Product) => {
    const exists = compareList.some((item) => item.id === product.id);
    if (exists) {
      setCompareList(compareList.filter((item) => item.id !== product.id));
    } else {
      if (compareList.length >= 4) {
        alert('You can compare a maximum of 4 products side-by-side.');
        return;
      }
      setCompareList([...compareList, product]);
    }
  };

  // Trigger Checkout Simulation
  const handleCheckout = (appliedCoupon: Coupon | null, total: number) => {
    const subtotal = cart.reduce((acc, item) => acc + (item.product.sellingPrice * item.quantity), 0);
    const deliveryCharge = subtotal >= 500 ? 0 : 40;

    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        brand: item.product.brand,
        quantity: item.quantity,
        price: item.product.sellingPrice,
        image: item.product.images[0],
        weight: `${item.product.weight} ${item.product.unit}`
      })),
      subtotal,
      deliveryCharge,
      discount: appliedCoupon ? (appliedCoupon.discountType === 'percentage' ? Math.round((subtotal * appliedCoupon.value) / 100) : appliedCoupon.value) : 0,
      couponCode: appliedCoupon?.code,
      total,
      status: 'ordered',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      estimatedDelivery: '10-15 mins',
      customerDetails: {
        name: 'Arjun Mehra',
        email: 'arjun.mehra@gmail.com',
        phone: '+91 98765 43210',
        address: 'Tower A, Flat 802, Premium Regency, Bandra West',
        pincode: '400001'
      }
    };

    // Deduct stock levels in local simulation state
    const updatedProducts = products.map((p) => {
      const cartMatch = cart.find((item) => item.product.id === p.id);
      if (cartMatch) {
        return { ...p, stock: Math.max(0, p.stock - cartMatch.quantity) };
      }
      return p;
    });

    setProducts(updatedProducts);
    setOrders([newOrder, ...orders]);
    setLastPlacedOrder(newOrder);
    setCart([]); // Reset Cart
    setIsCartOpen(false);
  };

  // Search Submit dispatcher
  const handleSearchDispatch = (query: string, category: string) => {
    setSearchQuery(query);
    if (category) {
      setSelectedCategory(category);
    }
  };

  // Extract list of all unique brands in the catalog for filtration sidebar
  const uniqueBrands = ['All', ...Array.from(new Set(
    products
      .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
      .map(p => p.brand)
  ))];

  // Dynamic Filtration Pipeline
  const filteredProducts = products.filter((p) => {
    // 1. Category Filter
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    
    // 2. Search Box Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCat) return false;
    }

    // 3. Brand Filter
    if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;

    // 4. Maximum Price Range Limit
    if (p.sellingPrice > priceRange) return false;

    // 5. Star Rating Range
    if (p.rating < minRating) return false;

    return true;
  });

  // Sorting Pipeline
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.sellingPrice - b.sellingPrice;
    if (sortBy === 'price-high') return b.sellingPrice - a.sellingPrice;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // Relevance / Index standard
  });

  // Grab Flash Deal items (>15% discount limit)
  const flashSaleItems = products.filter(p => p.discount >= 18).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#f7f9f7] flex flex-col justify-between" id="app-root">
      {/* 1. Header component */}
      <Header
        cart={cart}
        wishlist={wishlist}
        compareList={compareList}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setShowWishlistModal(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
        onToggleAi={() => setIsAiOpen(!isAiOpen)}
        onProductClick={(p) => setActiveProduct(p)}
        onSearch={handleSearchDispatch}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isAdminOpen={isAdminOpen}
        isAiOpen={isAiOpen}
      />

      {/* Main Page Layout Wrapper */}
      <main className="flex-1 pb-16">
        
        {/* Banner Section / Sliders */}
        {selectedCategory === 'All' && !searchQuery && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 select-none" id="promo-banners">
            <div className="relative rounded-3xl overflow-hidden h-[180px] sm:h-[320px] shadow-sm border border-gray-150">
              
              {/* Slide 1 */}
              <div
                className={`absolute inset-0 transition-opacity duration-1000 flex items-center bg-radial from-[#eef7f2] to-[#cbeed8] ${
                  heroSlide === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="p-6 sm:p-12 text-left max-w-xl space-y-3">
                  <span className="bg-brand-green text-white text-3xs font-extrabold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 w-fit">
                    <Percent className="w-3 h-3" /> Flash Coupon Active
                  </span>
                  <h1 className="font-display font-black text-2xl sm:text-5xl text-brand-dark leading-tight tracking-tight">
                    Flat ₹100 Off on Dairy & Farm Fresh Veg!
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold leading-relaxed">
                    Use promo code <span className="bg-white border border-brand-green/30 text-brand-green px-2 py-0.5 rounded-lg font-black font-mono">SUPERGROCERY</span> on checkout limits above ₹499. Superfast 10-minute dispatch!
                  </p>
                  <button
                    onClick={() => setSelectedCategory('Vegetables')}
                    className="bg-brand-green hover:bg-brand-green-dark text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>SHOP FARM FRESH VEG</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {/* Minimal clean background accent decor illustration */}
                <div className="absolute right-12 bottom-6 hidden md:block">
                  <span className="text-9xl opacity-80 select-none animate-bounce" style={{ animationDuration: '4s' }}>🥑</span>
                </div>
              </div>

              {/* Slide 2 */}
              <div
                className={`absolute inset-0 transition-opacity duration-1000 flex items-center bg-radial from-[#fffde7] to-[#fff9c4] ${
                  heroSlide === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className="p-6 sm:p-12 text-left max-w-xl space-y-3">
                  <span className="bg-orange-500 text-white text-3xs font-extrabold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 w-fit">
                    <Sparkles className="w-3 h-3 text-brand-yellow fill-current" /> Monsoon Immunity Booster
                  </span>
                  <h1 className="font-display font-black text-2xl sm:text-5xl text-brand-dark leading-tight tracking-tight">
                    Cold-Pressed Juices & Organic Honey Deals
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold leading-relaxed">
                    Sourced directly from organic certified cooperatives. Tested for zero adulteration. Flat discounts of up to 25% off MRP.
                  </p>
                  <button
                    onClick={() => setSelectedCategory('Juices')}
                    className="bg-brand-green hover:bg-brand-green-dark text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>EXPLORE ORGANIC DEALS</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {/* Accent */}
                <div className="absolute right-12 bottom-6 hidden md:block">
                  <span className="text-9xl opacity-80 select-none animate-bounce" style={{ animationDuration: '5s' }}>🍯</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Category Navigation Bar */}
        <CategoryNav selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        {/* Flash Sales Scroller Widget */}
        {selectedCategory === 'All' && !searchQuery && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-left select-none" id="flash-sale-ticker">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-150 pb-2">
              <span className="yellow-gradient p-1.5 rounded-lg text-brand-dark">
                <Percent className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-display font-black text-lg text-brand-dark tracking-tight">Today's Flash Deals</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">High discount staples on super fast delivery</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {flashSaleItems.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setActiveProduct(prod)}
                  className="bg-white border border-red-100 rounded-2xl p-3 hover-grow cursor-pointer relative"
                >
                  <span className="absolute top-2 left-2 z-10 yellow-gradient text-brand-dark font-black text-4xs px-1.5 py-0.5 rounded-sm">
                    {prod.discount}% OFF
                  </span>
                  <div className="aspect-square bg-gray-50/50 rounded-xl overflow-hidden mb-2 flex items-center justify-center">
                    <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-[8px] font-bold text-gray-400 uppercase">{prod.brand}</span>
                  <h4 className="font-bold text-xs text-brand-dark line-clamp-1 leading-none mt-0.5">{prod.name}</h4>
                  <p className="text-[10px] text-gray-500 font-semibold mb-1.5">{prod.weight} {prod.unit}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-black text-brand-green">₹{prod.sellingPrice}</span>
                    <span className="text-3xs text-gray-400 line-through">₹{prod.mrp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Main Catalog Body: Split filter pane + Products list */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left: Professional Filters Sidebar Panel */}
          <aside className="bg-white border border-gray-150 rounded-3xl p-5 text-left h-fit space-y-6 lg:sticky lg:top-24 shadow-xs" id="filters-sidebar">
            <div className="flex items-center justify-between pb-3 border-b border-gray-150">
              <h4 className="font-display font-black text-sm text-brand-dark uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-brand-green" /> Filter Products
              </h4>
              {(selectedBrand !== 'All' || minRating > 0 || sortBy !== 'relevance' || priceRange < 1000) && (
                <button
                  onClick={() => { setSelectedBrand('All'); setMinRating(0); setSortBy('relevance'); setPriceRange(1000); }}
                  className="text-3xs font-bold text-red-500 hover:underline uppercase"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-gray-500 uppercase tracking-wider block">Sort Catalog By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-brand-dark font-semibold focus:outline-hidden"
              >
                <option value="relevance">Popular & Best Selling</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Ratings</option>
              </select>
            </div>

            {/* Price Slider filter */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <label className="font-bold text-gray-500 uppercase tracking-wider">Max Price Limit</label>
                <span className="font-black text-brand-green">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min={10}
                max={1000}
                step={10}
                value={priceRange}
                onChange={(e) => setPriceRange(+e.target.value)}
                className="w-full accent-brand-green cursor-pointer"
              />
              <div className="flex justify-between text-4xs font-bold text-gray-400 uppercase">
                <span>₹10</span>
                <span>₹1000</span>
              </div>
            </div>

            {/* Brand Filter List */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-gray-500 uppercase tracking-wider block">Filter by Brand</label>
              <div className="max-h-[160px] overflow-y-auto space-y-1 pr-1.5">
                {uniqueBrands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      selectedBrand === b
                        ? 'bg-brand-green-light text-brand-green-dark font-bold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{b}</span>
                    {selectedBrand === b && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Star Rating threshold */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-gray-500 uppercase tracking-wider block">Minimum Ratings</label>
              <div className="flex items-center gap-1">
                {[4, 4.5, 5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setMinRating(minRating === rate ? 0 : rate)}
                    className={`px-3 py-1.5 border rounded-xl font-bold transition-colors cursor-pointer text-2xs ${
                      minRating === rate
                        ? 'bg-brand-green text-white border-brand-green shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green'
                    }`}
                  >
                    {rate}★ & Up
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right: Products Listings Grid Section */}
          <section className="lg:col-span-3 space-y-6 text-left" id="products-section">
            <div className="flex items-center justify-between border-b border-gray-150 pb-3">
              <div>
                <h3 className="font-display font-black text-xl text-brand-dark tracking-tight">
                  {selectedCategory === 'All' ? 'Our Grocery Staples' : selectedCategory}
                </h3>
                <p className="text-3xs text-gray-400 font-bold uppercase tracking-wider">
                  Showing {sortedProducts.length} premium matched results
                </p>
              </div>
            </div>

            {sortedProducts.length === 0 ? (
              <div className="py-20 text-center space-y-4 select-none bg-white rounded-3xl border border-gray-150">
                <p className="text-gray-400 font-semibold text-sm">No items in stock matched your current filters.</p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setSelectedBrand('All'); setMinRating(0); setPriceRange(1000); }}
                  className="bg-brand-green hover:bg-brand-green-dark text-white font-black text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  RESET SELECTION & EXPLORE
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {sortedProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    cart={cart}
                    wishlist={wishlist}
                    compareList={compareList}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    onAddToWishlist={handleToggleWishlist}
                    onAddToCompare={handleToggleCompare}
                    onProductClick={(p) => setActiveProduct(p)}
                  />
                ))}
              </div>
            )}
          </section>

        </div>

      </main>

      {/* Dynamic Overlay Models */}

      {/* 2. Product Details Modal/Drawer */}
      {activeProduct && (
        <ProductDetailModal
          product={activeProduct}
          isOpen={!!activeProduct}
          onClose={() => setActiveProduct(null)}
          cart={cart}
          wishlist={wishlist}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onAddToWishlist={handleToggleWishlist}
          onProductClick={(p) => setActiveProduct(p)}
        />
      )}

      {/* 3. Sliding Sticky Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />

      {/* 4. Comparison Specifications Overlay Table */}
      <CompareModal
        compareList={compareList}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        onRemove={handleToggleCompare}
        onAddToCart={handleAddToCart}
      />

      {/* 5. Custom Admin Dashboard Overlay */}
      <AdminDashboard
        products={products}
        orders={orders}
        onUpdateProducts={setProducts}
        onUpdateOrders={setOrders}
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* 6. Gemini Artificial Intelligence Shopping Assistant Chat */}
      <AiAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        cart={cart}
        onAddToCart={handleAddToCart}
      />

      {/* 7. Wishlist Sidebar Overlay */}
      {showWishlistModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative flex flex-col max-h-[80vh] overflow-hidden text-left">
            <div className="p-4 border-b border-gray-150 flex items-center justify-between">
              <h3 className="font-display font-black text-base text-brand-dark uppercase tracking-wider">Your Favourites Wishlist</h3>
              <button onClick={() => setShowWishlistModal(false)} className="p-1 text-gray-400 hover:text-red-500 font-bold">X</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {wishlist.length === 0 ? (
                <p className="text-xs text-gray-400 font-semibold py-12 text-center select-none">No favourite items saved yet.</p>
              ) : (
                wishlist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 p-2 border border-gray-100 rounded-2xl bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <img src={item.images[0]} alt={item.name} className="w-10 h-10 object-cover rounded-lg border" referrerPolicy="no-referrer" />
                      <div className="text-xs text-left">
                        <p className="font-bold text-gray-400 uppercase tracking-wider text-[8px]">{item.brand}</p>
                        <p className="font-bold text-brand-dark">{item.name}</p>
                        <p className="text-brand-green font-black">₹{item.sellingPrice}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-brand-green text-white font-bold text-2xs px-2.5 py-1.5 rounded-lg shadow-xs cursor-pointer hover:bg-brand-green-dark transition-colors"
                      >
                        ADD
                      </button>
                      <button onClick={() => handleToggleWishlist(item)} className="text-red-500 hover:underline text-2xs font-bold px-2">Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. Success Checkout Simulator confirmation receipt Card */}
      {lastPlacedOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl text-left border-t-8 border-brand-green animate-bounce-in space-y-4">
            <div className="text-center space-y-1.5">
              <div className="bg-brand-green-light p-3 rounded-full text-brand-green w-fit mx-auto shadow-xs">
                <Check className="w-8 h-8 font-black" />
              </div>
              <h3 className="font-display font-black text-lg text-brand-dark">Logistics Packing Approved!</h3>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                Order <span className="text-brand-green font-bold">{lastPlacedOrder.id}</span> was placed successfully at our Mumbai Depot!
              </p>
            </div>

            {/* Simulated Receipt details */}
            <div className="bg-gray-50 border border-gray-150 p-4 rounded-2xl text-xs space-y-2">
              <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">Receipt Summary</span>
              {lastPlacedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between font-semibold text-gray-600">
                  <span>{it.name} ({it.weight}) x {it.quantity}</span>
                  <span>₹{it.price * it.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between font-black text-brand-dark text-sm border-t border-gray-250 pt-2.5">
                <span>Paid (Via Cash/UPI)</span>
                <span>₹{lastPlacedOrder.total}</span>
              </div>
            </div>

            {/* Courier dispatch card */}
            <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-2xl flex items-start gap-3">
              <Truck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-black text-indigo-800">Assigned Partner: Ramesh Kumar</p>
                <p className="text-gray-500 font-semibold mt-0.5">Dispatched from Dark Store #4 • Expected Delivery in 10-15 Minutes.</p>
              </div>
            </div>

            <button
              onClick={() => setLastPlacedOrder(null)}
              className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-black py-3 rounded-xl shadow-xs transition-colors cursor-pointer text-xs uppercase tracking-wide"
            >
              OKAY, AWESOME
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Cart Indicator Bar (For Mobile views if cart is not empty and drawer not open) */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-30 bg-brand-green text-white p-3.5 rounded-2xl flex items-center justify-between shadow-2xl border border-brand-green-dark md:hidden">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5" />
            <div className="text-left text-xs">
              <p className="font-bold">{cart.reduce((acc, x) => acc + x.quantity, 0)} items selected</p>
              <p className="font-semibold text-brand-green-light">To Pay: ₹{cart.reduce((acc, x) => acc + (x.product.sellingPrice * x.quantity), 0)}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-white text-brand-green font-black text-xs px-4 py-2 rounded-xl"
          >
            VIEW CART
          </button>
        </div>
      )}

      {/* 9. Corporate style footer */}
      <Footer />
    </div>
  );
}
