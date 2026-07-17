import React from 'react';
import { Star, Plus, Minus, Heart, Eye, CheckSquare, Square, Zap } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  cart: CartItem[];
  wishlist: Product[];
  compareList: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onAddToCompare: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export default function ProductCard({
  product,
  cart,
  wishlist,
  compareList,
  onAddToCart,
  onRemoveFromCart,
  onAddToWishlist,
  onAddToCompare,
  onProductClick
}: ProductCardProps) {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const isInCompare = compareList.some((item) => item.id === product.id);

  const discountVal = product.discount;

  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-3.5 flex flex-col justify-between hover-grow relative group" id={`card-${product.id}`}>
      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 text-left">
        {discountVal > 0 && (
          <span className="yellow-gradient text-brand-dark font-black text-3xs px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
            {discountVal}% OFF
          </span>
        )}
        {product.bestSeller && (
          <span className="bg-orange-500 text-white font-black text-3xs px-2 py-0.5 rounded-md shadow-xs uppercase tracking-wider">
            Best Seller
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => onAddToWishlist(product)}
        className={`absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full shadow-xs cursor-pointer border ${
          isInWishlist ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white/80 border-gray-100 text-gray-400 hover:text-red-500'
        }`}
        title="Add to Wishlist"
      >
        <Heart className="w-4 h-4 fill-current" />
      </button>

      {/* Product Image Panel */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-50/50 flex items-center justify-center border border-gray-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Hover Controls */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onProductClick(product)}
            className="p-2.5 bg-white text-brand-dark rounded-xl shadow-md hover:bg-brand-green hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-200 cursor-pointer"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
        {/* Instant delivery tag */}
        <span className="absolute bottom-2 left-2 bg-brand-dark/75 text-white font-semibold text-3xs px-1.5 py-0.5 rounded-md flex items-center gap-0.5 select-none">
          <Zap className="w-3 h-3 text-brand-yellow fill-current" />
          {product.deliveryTime}
        </span>
      </div>

      {/* Product Information */}
      <div className="text-left flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{product.brand}</span>
            <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md font-semibold">{product.category}</span>
          </div>

          {/* Product Name */}
          <h4
            onClick={() => onProductClick(product)}
            className="font-display font-bold text-sm text-brand-dark hover:text-brand-green cursor-pointer line-clamp-2 h-10 leading-snug tracking-tight mb-1"
          >
            {product.name}
          </h4>

          {/* Ratings & Review Counts */}
          <div className="flex items-center gap-1 mb-2 select-none">
            <div className="flex items-center gap-0.5 bg-brand-green text-white px-1.5 py-0.5 rounded-sm text-3xs font-black">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-current" />
            </div>
            <span className="text-3xs text-gray-400 font-semibold">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Cart Action Block */}
        <div>
          {/* Weight details */}
          <p className="text-xs text-gray-500 font-semibold mb-2">{product.weight} {product.unit}</p>

          <div className="flex items-end justify-between gap-1.5 pt-2 border-t border-gray-100">
            {/* Price Box */}
            <div className="flex flex-col">
              <span className="text-base font-black text-brand-dark">₹{product.sellingPrice}</span>
              {discountVal > 0 && (
                <span className="text-3xs text-gray-400 line-through font-semibold">MRP ₹{product.mrp}</span>
              )}
            </div>

            {/* Incremental Add / Counter Action */}
            {cartItem ? (
              <div className="flex items-center bg-brand-green text-white rounded-xl shadow-xs overflow-hidden">
                <button
                  onClick={() => onRemoveFromCart(product)}
                  className="p-2 hover:bg-brand-green-dark transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 font-bold text-xs text-center min-w-[20px] select-none">{cartItem.quantity}</span>
                <button
                  onClick={() => onAddToCart(product)}
                  className="p-2 hover:bg-brand-green-dark transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(product)}
                disabled={product.stock <= 0}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all shadow-xs cursor-pointer ${
                  product.stock <= 0
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-brand-green-light text-brand-green border-brand-green hover:bg-brand-green hover:text-white'
                }`}
              >
                {product.stock <= 0 ? 'OUT OF STOCK' : (
                  <>
                    <span>ADD</span>
                    <Plus className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Compare Checkbox */}
      <div className="mt-3.5 pt-2.5 border-t border-dashed border-gray-200 flex items-center justify-between">
        <button
          onClick={() => onAddToCompare(product)}
          className="flex items-center gap-1.5 text-3xs font-bold text-gray-500 hover:text-brand-green cursor-pointer transition-colors"
        >
          {isInCompare ? (
            <CheckSquare className="w-3.5 h-3.5 text-brand-green fill-brand-green/10" />
          ) : (
            <Square className="w-3.5 h-3.5 text-gray-400" />
          )}
          <span>COMPARE SPECIFICATIONS</span>
        </button>
      </div>
    </div>
  );
}
