import React, { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { ProductCard } from "./ProductCard";
import { 
  Star, Truck, ShieldCheck, ArrowLeft, Plus, Minus, 
  ChevronRight, Calendar, User, MessageCircle, ShoppingBag, Sparkles
} from "lucide-react";

export const DetailsView: React.FC = () => {
  const {
    products, selectedProductId, setPage,
    cart, addToCart, updateCartQty,
    addNotification
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Review states
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const product = products.find((p) => p.id === selectedProductId);

  // Fallback if no product
  useEffect(() => {
    if (!product) {
      setPage("Home");
    } else {
      setActiveImageIdx(0);
    }
  }, [selectedProductId, product]);

  if (!product) return null;

  // Cart quantity count
  const cartItem = cart.find((item) => item.product.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;

  // 1. Related Products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // 2. Frequently Bought Together (2 items of complementary categories or similar)
  const bundleItems = products
    .filter((p) => p.category !== product.category && p.id !== product.id)
    .slice(0, 2);

  const bundleTotal = product.sellingPrice + bundleItems.reduce((sum, item) => sum + item.sellingPrice, 0);

  const handleAddBundle = () => {
    addToCart(product);
    bundleItems.forEach((item) => addToCart(item));
    addNotification("Added complete bundle to cart!", "success");
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      userName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    product.reviews = [newRev, ...product.reviews];
    // Recalculate average rating
    const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = parseFloat((total / product.reviews.length).toFixed(1));

    setReviewName("");
    setReviewComment("");
    addNotification("Your review was posted!", "success");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* Back Button */}
      <button
        onClick={() => setPage("Categories")}
        className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Categories</span>
      </button>

      {/* Grid: Image and Details columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column: Image Carousel */}
        <div className="space-y-4">
          <div className="w-full h-80 rounded-3xl overflow-hidden border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center relative">
            <img
              src={product.images[activeImageIdx]}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImageIdx === idx ? "border-emerald-500 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img src={img} alt={`thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & checkout purchase block */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
              {product.brand}
            </span>
            <h1 className="text-2xl font-black text-neutral-800 dark:text-white leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 text-xs font-medium text-neutral-400">
              <span>Category: <strong>{product.category}</strong></span>
              <span>SKU: <strong className="font-mono">{product.sku}</strong></span>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1.5 pt-1.5">
              <div className="flex items-center gap-0.5 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-neutral-400">({product.reviews.length} Verified Customer Reviews)</span>
            </div>
          </div>

          <hr className="border-neutral-100 dark:border-neutral-800" />

          {/* Pricing & Units */}
          <div className="space-y-1">
            <span className="text-xs text-neutral-400 font-medium">Pack Weight / Size: <strong>{product.unit}</strong></span>
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-black text-neutral-900 dark:text-white">₹{product.sellingPrice}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-sm text-neutral-400 line-through">MRP: ₹{product.mrp}</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md">Save ₹{product.mrp - product.sellingPrice}</span>
                </>
              )}
            </div>
            <p className="text-[10px] text-neutral-400">MRP is inclusive of all taxes (GST included in checkout summary).</p>
          </div>

          {/* Quick Delivery indicators */}
          <div className="grid grid-cols-2 gap-4 text-xs font-medium bg-neutral-50 dark:bg-neutral-800/30 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800/50">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              <div>
                <p className="font-bold text-neutral-800 dark:text-neutral-200">Express Delivery</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Arriving in {product.deliveryTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              <div>
                <p className="font-bold text-neutral-800 dark:text-neutral-200">Daily Needs Pledge</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">{product.returnPolicy}</p>
              </div>
            </div>
          </div>

          {/* Action Button: Add to Cart */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Purchase:</span>
            {qty > 0 ? (
              <div className="w-36 flex items-center justify-between bg-emerald-500 text-white font-bold rounded-2xl p-1.5 shadow-md shadow-emerald-500/10">
                <button
                  onClick={() => updateCartQty(product.id, qty - 1)}
                  className="p-1 hover:bg-emerald-600 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm">{qty} Units</span>
                <button
                  onClick={() => updateCartQty(product.id, qty + 1)}
                  className="p-1 hover:bg-emerald-600 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product)}
                className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-500/10 flex items-center gap-2 text-sm transition-all"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                <span>Add to Shopping Cart</span>
              </button>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">About the Product</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">{product.description}</p>
          </div>

        </div>

      </div>

      {/* Frequently Bought Together Segment */}
      {bundleItems.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-neutral-800/30 dark:to-neutral-900/30 p-6 rounded-3xl border border-emerald-100/50 dark:border-neutral-800 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm sm:text-base font-extrabold text-neutral-800 dark:text-neutral-100">Frequently Bought Together</h3>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Visual bundle items list */}
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Primary Product */}
              <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 p-2.5 rounded-2xl max-w-xs shadow-sm">
                <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[120px]">{product.name}</p>
                  <p className="font-extrabold text-neutral-950 dark:text-white">₹{product.sellingPrice}</p>
                </div>
              </div>

              <span className="text-lg font-bold text-neutral-400">+</span>

              {/* Bundle item 1 */}
              <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 p-2.5 rounded-2xl max-w-xs shadow-sm">
                <img src={bundleItems[0].images[0]} alt={bundleItems[0].name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[120px]">{bundleItems[0].name}</p>
                  <p className="font-extrabold text-neutral-950 dark:text-white">₹{bundleItems[0].sellingPrice}</p>
                </div>
              </div>

              <span className="text-lg font-bold text-neutral-400">+</span>

              {/* Bundle item 2 */}
              <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 p-2.5 rounded-2xl max-w-xs shadow-sm">
                <img src={bundleItems[1].images[0]} alt={bundleItems[1].name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[120px]">{bundleItems[1].name}</p>
                  <p className="font-extrabold text-neutral-950 dark:text-white">₹{bundleItems[1].sellingPrice}</p>
                </div>
              </div>

            </div>

            {/* Total price and bundle button */}
            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 pt-4 md:pt-0 md:pl-6 shrink-0 w-full md:w-auto justify-between md:justify-end">
              <div className="text-left md:text-right text-xs">
                <p className="text-neutral-400 font-semibold">Total Bundle Price</p>
                <p className="text-lg font-black text-neutral-900 dark:text-white">₹{bundleTotal}</p>
              </div>
              <button
                onClick={handleAddBundle}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold shadow-md transition-colors"
              >
                Add 3 Items to Cart
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 border-t border-neutral-100 dark:border-neutral-800">
        
        {/* Review Form */}
        <div className="lg:col-span-1 bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100">Post a Product Review</h3>
          <form onSubmit={handleAddReview} className="space-y-3.5 text-xs font-medium">
            <div>
              <label className="block text-neutral-400 font-bold mb-1.5">Your Full Name</label>
              <input
                type="text"
                placeholder="e.g. Priyanjali"
                required
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2.5 focus:outline-none text-neutral-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-neutral-400 font-bold mb-1.5">Rating Rating</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl p-2.5 font-bold focus:outline-none"
              >
                <option value="5">5 Stars (Excellent)</option>
                <option value="4">4 Stars (Good)</option>
                <option value="3">3 Stars (Average)</option>
                <option value="2">2 Stars (Poor)</option>
                <option value="1">1 Star (Terrible)</option>
              </select>
            </div>
            <div>
              <label className="block text-neutral-400 font-bold mb-1.5">Your Comment</label>
              <textarea
                placeholder="Write your review comments..."
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl p-3 focus:outline-none text-neutral-800 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-md transition-colors text-center"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Reviews timeline */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100">Customer Feedback ({product.reviews.length})</h3>
          
          <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl border border-neutral-50 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/20 text-xs font-medium space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-extrabold flex items-center justify-center text-[10px]">
                      {rev.userName.substring(0, 1)}
                    </div>
                    <span className="font-extrabold text-neutral-800 dark:text-neutral-200">{rev.userName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                    <span className="flex items-center gap-0.5 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {rev.rating}
                    </span>
                    <span>•</span>
                    <span className="font-mono">{rev.date}</span>
                  </div>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed pl-7 italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-neutral-100 dark:border-neutral-800">
          <h2 className="text-lg font-bold text-neutral-800 dark:text-white">Related Products (You may also like)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
