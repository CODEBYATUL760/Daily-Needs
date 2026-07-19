/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, GitCompare, Star, ShoppingCart, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface CompareModalProps {
  comparingProducts: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveFromCompare: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  quantityInCart: (product: Product) => number;
}

export default function CompareModal({
  comparingProducts,
  isOpen,
  onClose,
  onRemoveFromCompare,
  onAddToCart,
  quantityInCart
}: CompareModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Product Comparison</h2>
              <p className="text-xs text-gray-500 font-medium">Compare specifications, pricing, nutrition & ingredients side-by-side</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto p-6">
          {comparingProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3 max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <GitCompare className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-gray-800">No products added to comparison</p>
              <p className="text-xs text-gray-400">Click the compare button (arrows icon) on any product card to begin comparing specifications.</p>
            </div>
          ) : (
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="w-1/4 p-4 text-xs font-semibold text-gray-400 uppercase tracking-widest bg-gray-50/35 rounded-tl-2xl">Features</th>
                  {comparingProducts.map((p) => (
                    <th key={p.id} className="p-4 relative bg-linear-to-b hover:from-emerald-50/5 hover:to-white">
                      <button
                        onClick={() => onRemoveFromCompare(p)}
                        className="absolute top-2 right-2 p-1 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-lg transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      
                      <div className="text-center space-y-2 mt-2">
                        <img 
                          src={p.images.main} 
                          alt={p.name} 
                          className="w-24 h-24 object-contain mx-auto rounded-lg"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{p.brand}</div>
                          <div className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{p.weight}</div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-600 font-medium">
                
                {/* Selling Price */}
                <tr>
                  <td className="p-4 font-extrabold text-gray-900 bg-gray-50/30">Selling Price</td>
                  {comparingProducts.map((p) => (
                    <td key={p.id} className="p-4 font-black text-gray-900 text-sm">
                      ₹{p.price}
                      <span className="text-xs text-emerald-600 block">Save {p.discount}% (₹{p.saveAmount})</span>
                    </td>
                  ))}
                </tr>

                {/* MRP */}
                <tr>
                  <td className="p-4 font-bold text-gray-400 bg-gray-50/30">MRP</td>
                  {comparingProducts.map((p) => (
                    <td key={p.id} className="p-4 line-through text-gray-400">₹{p.mrp}</td>
                  ))}
                </tr>

                {/* Rating */}
                <tr>
                  <td className="p-4 font-bold text-gray-700 bg-gray-50/30">Customer Rating</td>
                  {comparingProducts.map((p) => (
                    <td key={p.id} className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span className="font-extrabold text-gray-800">{p.rating}</span>
                        <span className="text-gray-400">({p.ratingCount} reviews)</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* SKU & Category */}
                <tr>
                  <td className="p-4 font-bold text-gray-700 bg-gray-50/30">SKU / Code</td>
                  {comparingProducts.map((p) => (
                    <td key={p.id} className="p-4 font-mono text-gray-500">{p.sku}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-bold text-gray-700 bg-gray-50/30">Category</td>
                  {comparingProducts.map((p) => (
                    <td key={p.id} className="p-4 text-gray-700">{p.category} &gt; {p.subcategory}</td>
                  ))}
                </tr>

                {/* Nutrition (if available) */}
                <tr>
                  <td className="p-4 font-bold text-gray-700 bg-gray-50/30">Nutrition Facts</td>
                  {comparingProducts.map((p) => (
                    <td key={p.id} className="p-4 text-left">
                      {p.nutritionFacts ? (
                        <div className="space-y-1 text-[11px] max-h-24 overflow-y-auto">
                          {Object.entries(p.nutritionFacts).map(([k, v]) => (
                            <div key={k} className="flex justify-between border-b border-gray-50 py-0.5">
                              <span className="text-gray-400 font-semibold">{k}:</span>
                              <span className="text-gray-700 font-bold">{v}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">Not Applicable</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Ingredients */}
                <tr>
                  <td className="p-4 font-bold text-gray-700 bg-gray-50/30">Ingredients</td>
                  {comparingProducts.map((p) => (
                    <td key={p.id} className="p-4 text-gray-500 line-clamp-3 overflow-hidden text-left max-w-[200px]" title={p.ingredients}>
                      {p.ingredients || 'Natural Sourcing - No Added chemicals'}
                    </td>
                  ))}
                </tr>

                {/* Country of Origin */}
                <tr>
                  <td className="p-4 font-bold text-gray-700 bg-gray-50/30">Origin Country</td>
                  {comparingProducts.map((p) => (
                    <td key={p.id} className="p-4 text-gray-700">{p.countryOfOrigin || 'India'}</td>
                  ))}
                </tr>

                {/* Operations */}
                <tr>
                  <td className="p-4 font-bold text-gray-700 bg-gray-50/30 rounded-bl-2xl">Cart Operation</td>
                  {comparingProducts.map((p) => {
                    const qty = quantityInCart(p);
                    return (
                      <td key={p.id} className="p-4">
                        <button
                          onClick={() => onAddToCart(p)}
                          className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl transition-all cursor-pointer text-xs"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          {qty > 0 ? `In Cart (${qty})` : 'Add To Cart'}
                        </button>
                      </td>
                    );
                  })}
                </tr>

              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
