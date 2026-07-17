import React from 'react';
import { X, RefreshCw, Star, ShoppingCart, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface CompareModalProps {
  compareList: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function CompareModal({
  compareList,
  isOpen,
  onClose,
  onRemove,
  onAddToCart
}: CompareModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden animate-fade-in" id="compare-modal">
        {/* Header */}
        <div className="p-4 border-b border-gray-150 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-brand-green" />
            <h3 className="font-display font-black text-lg text-brand-dark">Compare Product Specifications</h3>
            <span className="bg-brand-green-light text-brand-green-dark text-3xs font-black rounded-full h-5 px-2 flex items-center justify-center">
              {compareList.length} Selected (Max 4)
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table Grid */}
        <div className="flex-1 overflow-x-auto p-4 sm:p-6 lg:p-8">
          {compareList.length === 0 ? (
            <div className="py-16 text-center text-gray-500 space-y-3 select-none">
              <RefreshCw className="w-10 h-10 mx-auto text-gray-300 animate-spin" style={{ animationDuration: '6s' }} />
              <p className="font-bold text-sm text-brand-dark">No products selected for comparison</p>
              <p className="text-xs text-gray-400">Click "Compare Specifications" on product cards to make detailed side-by-side assessments.</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 divide-x divide-gray-150">
                  <th className="py-3 px-4 bg-gray-50 text-gray-400 font-bold uppercase tracking-wider w-1/5">Attributes</th>
                  {compareList.map((p) => (
                    <th key={p.id} className="py-3 px-4 text-center align-top relative w-1/5">
                      <button
                        onClick={() => onRemove(p)}
                        className="absolute top-1.5 right-1.5 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex flex-col items-center">
                        <img src={p.images[0]} alt={p.name} className="w-14 h-14 object-cover rounded-lg border border-gray-100 mb-2" referrerPolicy="no-referrer" />
                        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{p.brand}</span>
                        <h4 className="font-bold text-brand-dark line-clamp-2 h-8 text-center leading-normal tracking-tight mt-0.5">{p.name}</h4>
                        <button
                          onClick={() => onAddToCart(p)}
                          className="mt-3 bg-brand-green hover:bg-brand-green-dark text-white px-3 py-1 rounded-lg font-bold text-2xs cursor-pointer shadow-xs transition-colors flex items-center gap-1"
                        >
                          <ShoppingCart className="w-3 h-3" /> ADD
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150">
                {/* Brand */}
                <tr className="divide-x divide-gray-150 hover:bg-gray-50/50">
                  <td className="py-3.5 px-4 bg-gray-50 text-gray-500 font-bold uppercase">Brand Name</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 text-center text-brand-dark font-black">{p.brand}</td>
                  ))}
                </tr>
                {/* Category */}
                <tr className="divide-x divide-gray-150 hover:bg-gray-50/50">
                  <td className="py-3.5 px-4 bg-gray-50 text-gray-500 font-bold uppercase">Category</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 text-center text-brand-dark font-semibold">{p.category}</td>
                  ))}
                </tr>
                {/* Price & MRP */}
                <tr className="divide-x divide-gray-150 hover:bg-gray-50/50">
                  <td className="py-3.5 px-4 bg-gray-50 text-gray-500 font-bold uppercase">Selling Price</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 text-center">
                      <span className="text-sm font-black text-brand-green">₹{p.sellingPrice}</span>
                      <p className="text-3xs text-gray-400 line-through font-medium">MRP ₹{p.mrp}</p>
                    </td>
                  ))}
                </tr>
                {/* Weight */}
                <tr className="divide-x divide-gray-150 hover:bg-gray-50/50">
                  <td className="py-3.5 px-4 bg-gray-50 text-gray-500 font-bold uppercase">Weight / Unit</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 text-center text-brand-dark font-bold">{p.weight} {p.unit}</td>
                  ))}
                </tr>
                {/* Shelf Life */}
                <tr className="divide-x divide-gray-150 hover:bg-gray-50/50">
                  <td className="py-3.5 px-4 bg-gray-50 text-gray-500 font-bold uppercase">Shelf Life</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 text-center text-brand-dark font-semibold">{p.shelfLife}</td>
                  ))}
                </tr>
                {/* Rating */}
                <tr className="divide-x divide-gray-150 hover:bg-gray-50/50">
                  <td className="py-3.5 px-4 bg-gray-50 text-gray-500 font-bold uppercase">Ratings</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 font-black text-brand-green">
                        <span>{p.rating}</span>
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className="text-3xs text-gray-400">({p.reviewCount} reviews)</span>
                    </td>
                  ))}
                </tr>
                {/* Ingredients */}
                <tr className="divide-x divide-gray-150 hover:bg-gray-50/50">
                  <td className="py-3.5 px-4 bg-gray-50 text-gray-500 font-bold uppercase">Ingredients</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 text-center text-gray-500 italic font-medium max-w-[150px] truncate" title={p.ingredients}>{p.ingredients || 'Standard Fresh Product'}</td>
                  ))}
                </tr>
                {/* Nutrition */}
                <tr className="divide-x divide-gray-150 hover:bg-gray-50/50">
                  <td className="py-3.5 px-4 bg-gray-50 text-gray-500 font-bold uppercase">Calories / Protein</td>
                  {compareList.map((p) => (
                    <td key={p.id} className="py-3.5 px-4 text-center">
                      <p className="font-bold text-brand-dark">{p.nutritionInfo?.calories || '110 kcal'}</p>
                      <p className="text-3xs text-gray-400">Protein: {p.nutritionInfo?.protein || '2.0 g'}</p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
