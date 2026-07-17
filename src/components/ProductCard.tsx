import React from "react";
import { Product } from "../types";
import { useStore } from "../context/StoreContext";
import { Heart, ShoppingCart, Plus, Minus, Star, Clock } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    cart, addToCart, updateCartQty,
    isInWishlist, toggleWishlist,
    setPage, setSelectedProductId,
    addToRecentlyViewed
  } = useStore();

  // Check if item is in cart and find its quantity
  const cartItem = cart.find((item) => item.product.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;

  const isLiked = isInWishlist(product.id);

  const handleClickCard = () => {
    addToRecentlyViewed(product.id);
    setSelectedProductId(product.id);
    setPage("Details");
  };

  const savedAmount = product.mrp - product.sellingPrice;

  return (
    <div className="group relative bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-700/50 p-4 hover:shadow-xl hover:border-emerald-100 dark:hover:border-neutral-600 transition-all duration-300 flex flex-col h-full">
      
      {/* Top Badges & Actions */}
      <div className="flex justify-between items-start gap-2 absolute top-4 left-4 right-4 z-10">
        <div className="flex flex-col gap-1">
          {product.bestseller && (
            <span className="bg-amber-500 text-neutral-900 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm w-fit">
              Bestseller
            </span>
          )}
          {product.trending && (
            <span className="bg-purple-600 text-white text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm w-fit">
              Trending
            </span>
          )}
          {product.discount > 0 && (
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Favorite Heart Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="p-1.5 bg-white/90 dark:bg-neutral-800/90 hover:bg-rose-50 dark:hover:bg-neutral-700/50 hover:text-rose-500 text-neutral-400 dark:text-neutral-500 rounded-full shadow-md transition-colors"
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>
      </div>

      {/* Product Image Clickable area */}
      <div 
        onClick={handleClickCard}
        className="w-full h-40 mt-3 rounded-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-700 cursor-pointer flex items-center justify-center relative group"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        
        {/* Rapid Delivery Speed Badge */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3 text-emerald-400" />
          <span>{product.deliveryTime}</span>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 mt-4 flex flex-col">
        {/* Brand */}
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-mono">
          {product.brand}
        </span>
        
        {/* Title */}
        <h3 
          onClick={handleClickCard}
          className="text-sm font-bold text-neutral-800 dark:text-neutral-100 mt-1 hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-2 cursor-pointer leading-tight h-10"
        >
          {product.name}
        </h3>

        {/* Unit and Ratings */}
        <div className="flex items-center justify-between text-xs text-neutral-400 dark:text-neutral-500 mt-2 font-medium">
          <span>{product.unit}</span>
          <div className="flex items-center gap-0.5 bg-neutral-100 dark:bg-neutral-700/50 text-neutral-700 dark:text-neutral-300 px-1.5 py-0.5 rounded-md font-bold text-[10px]">
            <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Pricing & Add Trigger */}
        <div className="mt-4 pt-3 border-t border-neutral-50 dark:border-neutral-700/30 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-neutral-900 dark:text-white">
                ₹{product.sellingPrice}
              </span>
              {product.discount > 0 && (
                <span className="text-xs text-neutral-400 dark:text-neutral-500 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </div>
            {savedAmount > 0 && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                Save ₹{savedAmount}
              </span>
            )}
          </div>

          {/* Add-To-Cart / Qty Interface */}
          <div className="w-24">
            {qty > 0 ? (
              <div className="flex items-center justify-between bg-emerald-500 text-white font-bold rounded-xl p-1 shadow-md shadow-emerald-500/10">
                <button
                  onClick={(e) => { e.stopPropagation(); updateCartQty(product.id, qty - 1); }}
                  className="p-1 hover:bg-emerald-600 rounded-lg transition-colors"
                  title="Reduce Quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm">{qty}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); updateCartQty(product.id, qty + 1); }}
                  className="p-1 hover:bg-emerald-600 rounded-lg transition-colors"
                  title="Increase Quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                className="w-full py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
