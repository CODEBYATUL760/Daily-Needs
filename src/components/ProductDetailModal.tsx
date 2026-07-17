import React, { useState, useEffect } from 'react';
import { Star, Plus, Minus, X, Heart, ShieldCheck, Truck, RefreshCw, ChevronRight, BarChart2, MessageSquare, AlertTriangle } from 'lucide-react';
import { Product, CartItem, Review } from '../types';
import { PRODUCTS } from '../data/products';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  wishlist: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  cart,
  wishlist,
  onAddToCart,
  onRemoveFromCart,
  onAddToWishlist,
  onProductClick
}: ProductDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('');

  // Reset indices when product changes
  useEffect(() => {
    setActiveImageIdx(0);
    // Seed initial mock reviews for this specific product
    const mockReviews: Review[] = [
      { id: '1', userName: 'Aravind K.', rating: 5, date: '12 July 2026', comment: `Absolutely loved the quality. Very fresh and packed neatly. Sourced with great standards!`, verified: true },
      { id: '2', userName: 'Nisha Sharma', rating: 4, date: '04 July 2026', comment: `Slightly expensive but delivery was within 10 minutes, so total value for money.`, verified: true },
      { id: '3', userName: 'Rahul Sen', rating: 5, date: '28 June 2026', comment: `Proper brand packaging, authentic taste, expiry date is far away. Highly recommended.`, verified: true }
    ];
    setReviews(mockReviews);
  }, [product]);

  if (!isOpen) return null;

  const cartItem = cart.find((item) => item.product.id === product.id);
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  // Mouse move zoom function
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${product.images[activeImageIdx]})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  // Submit Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      userName: reviewName.trim(),
      rating: reviewRating,
      date: 'Today',
      comment: reviewComment.trim(),
      verified: true
    };

    setReviews([newReview, ...reviews]);
    setReviewComment('');
    setReviewName('');
  };

  // Get Related products (same category, excluding current)
  const relatedProducts = PRODUCTS.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  // Frequently Bought Together (usually a complementary item from another category)
  const frequentlyBoughtTogether = PRODUCTS.filter(
    p => p.category !== product.category && p.bestSeller
  ).slice(0, 2);

  const discountVal = product.discount;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-fade-in" id="product-detail-modal">
        {/* Header Close Trigger */}
        <div className="p-4 border-b border-gray-150 flex items-center justify-between sticky top-0 bg-white z-20">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase select-none">
            <span>Grocery Catalog</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-green">{product.category}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Main Content (scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Top Info Layout: Image and Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left: Gallery & Zoom */}
            <div className="space-y-4">
              <div
                className="relative aspect-square rounded-2xl border border-gray-100 bg-gray-50/50 overflow-hidden cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={product.images[activeImageIdx] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Real-time magnified zoom mirror */}
                <div
                  className="absolute inset-0 pointer-events-none hidden md:block"
                  style={zoomStyle}
                />
              </div>

              {/* Thumbnails list */}
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-gray-50 cursor-pointer flex-shrink-0 transition-all ${
                      activeImageIdx === idx ? 'border-brand-green ring-2 ring-brand-green-light' : 'border-gray-200 hover:border-brand-green/50'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Pricing, Weight, Title */}
            <div className="text-left space-y-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-brand-green">{product.brand}</span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark leading-tight tracking-tight mt-1">{product.name}</h2>
                <p className="text-xs text-gray-400 font-mono mt-1.5 uppercase">SKU: {product.sku} | Barcode: {product.barcode}</p>
              </div>

              {/* Rating & reviews header */}
              <div className="flex items-center gap-3 select-none">
                <div className="flex items-center gap-1 bg-brand-green text-white px-2 py-0.5 rounded-md text-xs font-black">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-xs text-gray-400 font-bold tracking-wide uppercase">{product.reviewCount} Verified Customer Ratings</span>
              </div>

              {/* Price Details Block */}
              <div className="bg-gray-50/60 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-brand-dark">₹{product.sellingPrice}</span>
                    {discountVal > 0 && (
                      <span className="text-sm text-gray-400 line-through font-bold">MRP ₹{product.mrp}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-bold mt-1">Inclusive of all taxes • Weight: <span className="text-brand-dark">{product.weight} {product.unit}</span></p>
                </div>

                {discountVal > 0 && (
                  <span className="yellow-gradient text-brand-dark text-xs font-black px-3 py-1.5 rounded-xl shadow-xs">
                    SAVE ₹{product.mrp - product.sellingPrice} ({discountVal}% OFF)
                  </span>
                )}
              </div>

              {/* Quick Actions (Cart + Wishlist) */}
              <div className="flex flex-wrap items-center gap-4">
                {cartItem ? (
                  <div className="flex items-center bg-brand-green text-white rounded-2xl shadow-sm overflow-hidden py-1 border border-brand-green-dark">
                    <button
                      onClick={() => onRemoveFromCart(product)}
                      className="px-4 py-2 hover:bg-brand-green-dark transition-colors cursor-pointer text-lg font-bold"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-5 font-black text-sm text-center min-w-[40px] select-none">{cartItem.quantity}</span>
                    <button
                      onClick={() => onAddToCart(product)}
                      className="px-4 py-2 hover:bg-brand-green-dark transition-colors cursor-pointer text-lg font-bold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock <= 0}
                    className={`flex-1 min-w-[180px] py-3.5 rounded-2xl font-black text-sm text-center transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                      product.stock <= 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        : 'bg-brand-green text-white hover:bg-brand-green-dark border border-brand-green-dark'
                    }`}
                  >
                    {product.stock <= 0 ? 'OUT OF STOCK' : 'ADD TO BASKET'}
                  </button>
                )}

                <button
                  onClick={() => onAddToWishlist(product)}
                  className={`p-3.5 rounded-2xl border transition-colors cursor-pointer ${
                    isInWishlist
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-red-500'
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Delivery and Stock status alerts */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-green" />
                  <span>Delivered in <span className="text-brand-dark">{product.deliveryTime}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-green" />
                  <span>Stock: {product.stock > 10 ? (
                    <span className="text-brand-green font-bold">In Stock ({product.stock} left)</span>
                  ) : product.stock > 0 ? (
                    <span className="text-orange-500 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Low Stock ({product.stock} left)</span>
                  ) : (
                    <span className="text-red-500 font-bold">Sold Out</span>
                  )}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Table, Description, Nutrition info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 pt-8 text-left">
            {/* Description & Ingredients */}
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <h3 className="font-display font-black text-base text-brand-dark uppercase tracking-wider border-l-4 border-brand-green pl-2">Product Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">{product.description}</p>
              </div>

              {product.ingredients && (
                <div className="space-y-2">
                  <h3 className="font-display font-black text-base text-brand-dark uppercase tracking-wider border-l-4 border-brand-green pl-2">Ingredients / Composition</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-semibold italic">{product.ingredients}</p>
                </div>
              )}

              {/* Product Specifications List */}
              <div className="space-y-3">
                <h3 className="font-display font-black text-base text-brand-dark uppercase tracking-wider border-l-4 border-brand-green pl-2">Specifications & Storage</h3>
                <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden divide-y divide-gray-150 text-xs">
                  <div className="grid grid-cols-2 p-3"><span className="text-gray-400 font-bold">Manufacturer</span><span className="text-brand-dark font-semibold">{product.manufacturer}</span></div>
                  <div className="grid grid-cols-2 p-3"><span className="text-gray-400 font-bold">Country of Origin</span><span className="text-brand-dark font-semibold">{product.countryOfOrigin}</span></div>
                  <div className="grid grid-cols-2 p-3"><span className="text-gray-400 font-bold">Storage Instructions</span><span className="text-brand-dark font-semibold">{product.storageInstructions}</span></div>
                  <div className="grid grid-cols-2 p-3"><span className="text-gray-400 font-bold">Shelf Life</span><span className="text-brand-dark font-semibold">{product.shelfLife}</span></div>
                  <div className="grid grid-cols-2 p-3"><span className="text-gray-400 font-bold">Return Policy</span><span className="text-brand-dark font-semibold">{product.returnPolicy}</span></div>
                </div>
              </div>
            </div>

            {/* Nutrition Information card */}
            <div className="bg-brand-green-light/20 border border-brand-green/10 p-5 rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-brand-green" />
                <h3 className="font-display font-black text-base text-brand-dark uppercase tracking-wider">Nutrition Info</h3>
              </div>
              <p className="text-4xs text-gray-400 uppercase font-bold tracking-widest">Average Value per 100g / 100ml serving</p>

              <div className="space-y-2 divide-y divide-gray-200/50 text-xs">
                <div className="flex justify-between py-1.5"><span className="text-gray-500 font-bold">Calories</span><span className="text-brand-dark font-black">{product.nutritionInfo?.calories || '110 kcal'}</span></div>
                <div className="flex justify-between py-1.5"><span className="text-gray-500 font-bold">Protein</span><span className="text-brand-dark font-black">{product.nutritionInfo?.protein || '2.0 g'}</span></div>
                <div className="flex justify-between py-1.5"><span className="text-gray-500 font-bold">Carbohydrates</span><span className="text-brand-dark font-black">{product.nutritionInfo?.carbs || '15.0 g'}</span></div>
                <div className="flex justify-between py-1.5"><span className="text-gray-500 font-bold">Fat</span><span className="text-brand-dark font-black">{product.nutritionInfo?.fat || '0.5 g'}</span></div>
                {product.nutritionInfo?.fiber && (
                  <div className="flex justify-between py-1.5"><span className="text-gray-500 font-bold">Dietary Fiber</span><span className="text-brand-dark font-black">{product.nutritionInfo.fiber}</span></div>
                )}
                {product.nutritionInfo?.sodium && (
                  <div className="flex justify-between py-1.5"><span className="text-gray-500 font-bold">Sodium</span><span className="text-brand-dark font-black">{product.nutritionInfo.sodium}</span></div>
                )}
              </div>
            </div>
          </div>

          {/* Frequently bought together upsells */}
          <div className="border-t border-gray-100 pt-8 text-left space-y-4">
            <h3 className="font-display font-black text-base text-brand-dark uppercase tracking-wider border-l-4 border-brand-green pl-2">Frequently Bought Together</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {frequentlyBoughtTogether.map((item) => (
                <div key={item.id} className="bg-gray-50 border border-gray-150 p-3 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={item.images[0]} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-gray-200/50" referrerPolicy="no-referrer" />
                    <div className="text-xs text-left">
                      <p className="font-bold text-gray-400 uppercase text-[9px]">{item.brand}</p>
                      <p className="font-semibold text-brand-dark line-clamp-1">{item.name}</p>
                      <p className="font-bold text-brand-green mt-0.5">₹{item.sellingPrice} <span className="text-gray-400 font-medium line-through">₹{item.mrp}</span></p>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddToCart(item)}
                    className="bg-brand-green hover:bg-brand-green-dark text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs cursor-pointer transition-colors"
                  >
                    ADD
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews section and form */}
          <div className="border-t border-gray-100 pt-8 text-left grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review List */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-display font-black text-base text-brand-dark uppercase tracking-wider border-l-4 border-brand-green pl-2 mb-4">Customer Reviews</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 divide-y divide-gray-100">
                {reviews.map((r) => (
                  <div key={r.id} className="pt-3 first:pt-0 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-brand-dark">{r.userName}</span>
                      <span className="text-[10px] text-gray-400">{r.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex text-brand-yellow">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      {r.verified && (
                        <span className="bg-brand-green-light text-brand-green-dark px-1.5 py-0.2 rounded-sm font-bold text-[8px] uppercase">Verified Buyer</span>
                      )}
                    </div>
                    <p className="text-gray-600 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Form */}
            <div className="bg-gray-50 border border-gray-150 p-5 rounded-3xl space-y-4 h-fit">
              <h3 className="font-display font-black text-sm text-brand-dark uppercase tracking-wider">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-brand-dark focus:outline-hidden focus:border-brand-green font-medium"
                    placeholder="e.g. Priyan S."
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Rating</label>
                  <div className="flex gap-1 text-brand-yellow">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setReviewRating(i + 1)}
                        className="p-1 cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${i < reviewRating ? 'fill-current' : 'text-gray-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-500 mb-1">Comments</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-brand-dark focus:outline-hidden focus:border-brand-green font-medium"
                    placeholder="How is the packaging, taste, and freshness?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-black py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  SUBMIT REVIEW
                </button>
              </form>
            </div>
          </div>

          {/* Related Products Scroller */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-gray-100 pt-8 text-left space-y-4">
              <h3 className="font-display font-black text-base text-brand-dark uppercase tracking-wider border-l-4 border-brand-green pl-2">Related Products</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onProductClick(p)}
                    className="bg-white border border-gray-150 p-3 rounded-2xl cursor-pointer hover:shadow-md transition-all text-left flex flex-col justify-between"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-gray-50/50">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold uppercase">{p.brand}</span>
                      <h4 className="font-bold text-xs text-brand-dark line-clamp-1 leading-snug">{p.name}</h4>
                      <p className="text-3xs text-gray-500 font-medium mb-1">{p.weight} {p.unit}</p>
                      <p className="text-sm font-black text-brand-green">₹{p.sellingPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
