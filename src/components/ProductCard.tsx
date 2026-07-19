/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Eye, GitCompare, Star, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  isWishlisted: boolean;
  isComparing: boolean;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  key?: any;
}

export default function ProductCard({
  product,
  quantityInCart,
  isWishlisted,
  isComparing,
  onAddToCart,
  onRemoveFromCart,
  onToggleWishlist,
  onToggleCompare,
  onSelectProduct
}: ProductCardProps) {
  const {
    name,
    brand,
    weight,
    mrp,
    price,
    discount,
    saveAmount,
    stock,
    rating,
    ratingCount,
    images,
    isBestSeller,
    isTrending,
    isNewArrival,
    isTodayDeal
  } = product;

  const isOutOfStock = stock <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full bg-linear-to-b hover:from-white hover:to-emerald-50/10">
      
      {/* Badge container */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {isBestSeller && (
          <span className="bg-amber-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
            Best Seller
          </span>
        )}
        {isTodayDeal && (
          <span className="bg-red-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
            Deal
          </span>
        )}
        {isNewArrival && (
          <span className="bg-sky-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
            New
          </span>
        )}
        {discount > 0 && (
          <span className="bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* Floating Action Icons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
        {/* Wishlist toggle */}
        <button
          onClick={() => onToggleWishlist(product)}
          className={`p-2 rounded-xl border shadow-xs transition-all cursor-pointer ${
            isWishlisted 
              ? 'bg-rose-50 border-rose-100 text-rose-500' 
              : 'bg-white border-gray-100 text-gray-400 hover:text-rose-500 hover:bg-rose-50'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Compare toggle */}
        <button
          onClick={() => onToggleCompare(product)}
          className={`p-2 rounded-xl border shadow-xs transition-all cursor-pointer ${
            isComparing 
              ? 'bg-amber-50 border-amber-100 text-amber-600' 
              : 'bg-white border-gray-100 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
          }`}
          title="Compare Product"
        >
          <GitCompare className="w-4 h-4" />
        </button>

        {/* Quick View */}
        <button
          onClick={() => onSelectProduct(product)}
          className="p-2 bg-white border border-gray-100 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl shadow-xs transition-all cursor-pointer"
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Image click to details */}
      <div 
        onClick={() => onSelectProduct(product)}
        className="cursor-pointer relative pt-4 pb-2 flex items-center justify-center overflow-hidden aspect-square rounded-xl bg-gray-50/50 mb-3"
      >
        <img
          src={images.main}
          alt={name}
          className="w-full h-full object-contain max-h-[140px] transform group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white/95 text-gray-900 font-extrabold text-xs px-3 py-1.5 rounded-lg uppercase tracking-wider border border-gray-100 shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content description */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Weight */}
          <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
            <span className="text-emerald-600 uppercase tracking-wider">{brand}</span>
            <span className="text-gray-400">{weight}</span>
          </div>

          {/* Name */}
          <h3 
            onClick={() => onSelectProduct(product)}
            className="text-sm font-semibold text-gray-800 hover:text-emerald-600 cursor-pointer line-clamp-2 h-10 mb-1.5 leading-snug transition-colors text-left"
          >
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2.5">
            <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 text-[10px] font-bold">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{rating}</span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">({ratingCount})</span>
            <span className="text-gray-200">|</span>
            <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider">
              ⚡ 2 Hr
            </span>
          </div>
        </div>

        {/* Pricing & Add button */}
        <div className="border-t border-gray-50 pt-2.5 flex items-center justify-between gap-1.5">
          {/* Price blocks */}
          <div className="text-left shrink-0">
            <div className="flex items-baseline gap-1">
              <span className="text-base font-extrabold text-gray-900">₹{price}</span>
              {discount > 0 && (
                <span className="text-xs text-gray-400 line-through">₹{mrp}</span>
              )}
            </div>
            {discount > 0 && (
              <div className="text-[10px] text-emerald-600 font-bold block">
                Save ₹{saveAmount}
              </div>
            )}
          </div>

          {/* Add-to-cart operations */}
          <div className="shrink-0">
            {isOutOfStock ? (
              <button
                disabled
                className="bg-gray-100 text-gray-400 text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 cursor-not-allowed"
              >
                Out of Stock
              </button>
            ) : quantityInCart > 0 ? (
              <div className="flex items-center bg-emerald-600 text-white rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => onRemoveFromCart(product)}
                  className="px-2.5 py-2 hover:bg-emerald-700 active:scale-95 transition-all text-xs font-bold cursor-pointer"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-2 text-xs font-black min-w-4 text-center">
                  {quantityInCart}
                </span>
                <button
                  onClick={() => onAddToCart(product)}
                  className="px-2.5 py-2 hover:bg-emerald-700 active:scale-95 transition-all text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(product)}
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white px-3 py-2 rounded-xl text-xs font-extrabold border border-emerald-100 hover:border-transparent transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
