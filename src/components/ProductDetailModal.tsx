/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, Star, MapPin, Truck, RotateCcw, AlertCircle, Sparkles, 
  ShoppingCart, ShieldCheck, Check, Heart, HelpCircle, ArrowRight
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (product: Product) => void;
  quantityInCart: number;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  relatedProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

const DEFAULT_REVIEWS = [
  { id: '1', userName: 'Anjali Sharma', rating: 5, date: '14 July 2026', comment: 'Absolutely fresh product. The packaging was pristine and delivery was within 1.5 hours. Highly recommend Daily Needs!', verified: true },
  { id: '2', userName: 'Rajesh Kumar', rating: 4, date: '10 July 2026', comment: 'Very consistent quality. Good savings compared to supermarkets. Standard daily necessity.', verified: true },
  { id: '3', userName: 'Sneha Patel', rating: 5, date: '05 July 2026', comment: 'Pure and soft texture. Great customer support when I wanted to change the delivery slot.', verified: true }
];

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onRemoveFromCart,
  quantityInCart,
  isWishlisted,
  onToggleWishlist,
  relatedProducts,
  onSelectProduct
}: ProductDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'reviews'>('details');
  const [activeImageKey, setActiveImageKey] = useState<'main' | 'front' | 'side' | 'back' | 'lifestyle'>('main');
  const [pinInput, setPinInput] = useState('');
  const [pinChecked, setPinChecked] = useState(false);
  const [pinStatus, setPinStatus] = useState({ success: true, text: '' });
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  if (!isOpen || !product) return null;

  const handlePinCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pinInput.trim())) {
      setPinChecked(true);
      // Demo checks
      const validPins = ['110001', '400001', '560001', '600001', '700001', '500001', '380001'];
      if (validPins.includes(pinInput) || parseInt(pinInput) % 2 === 0) {
        setPinStatus({ success: true, text: '⚡ Guaranteed Express Delivery inside 2 Hours' });
      } else {
        setPinStatus({ success: true, text: '📅 Next-Day Standard Delivery Available (delivered before 12:00 PM)' });
      }
    } else {
      setPinChecked(true);
      setPinStatus({ success: false, text: 'Please enter a valid 6-digit Indian PIN code' });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const imagesToShow = {
    main: product.images.main,
    front: product.images.front,
    side: product.images.side,
    back: product.images.back,
    lifestyle: product.images.lifestyle
  };

  const currentImageSrc = imagesToShow[activeImageKey];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] animate-fade-in relative">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-full cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery and Slider */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between border-r border-gray-100 max-h-[92vh] overflow-y-auto">
          <div>
            {/* Active Image Stage with Hover Zoom */}
            <div 
              className="relative aspect-square bg-gray-50/50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={currentImageSrc}
                alt={product.name}
                className={`w-full h-full object-contain p-4 transition-transform duration-200 ${isZoomed ? 'scale-180' : 'scale-100'}`}
                style={isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay Stock Tag */}
              {product.stock <= 0 ? (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white text-gray-900 font-extrabold text-sm px-4 py-2 rounded-xl uppercase tracking-widest border border-gray-200">
                    Sold Out
                  </span>
                </div>
              ) : product.stock < 10 ? (
                <div className="absolute bottom-4 left-4 bg-red-100 text-red-800 border border-red-200 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  ⚠️ Only {product.stock} items left in stock
                </div>
              ) : null}
            </div>

            {/* Thumbnail Carousel Slider */}
            <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
              {Object.entries(imagesToShow).map(([key, src]) => {
                const isActive = activeImageKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveImageKey(key as any)}
                    className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center bg-white overflow-hidden p-1 shrink-0 cursor-pointer transition-all ${
                      isActive ? 'border-emerald-600 scale-105 shadow-sm' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={src} 
                      alt={key} 
                      className="w-full h-full object-contain" 
                      referrerPolicy="no-referrer"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Visual Certifications */}
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center gap-1.5 p-2 bg-emerald-50/50 rounded-xl border border-emerald-50">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">100% Organic</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 bg-amber-50/50 rounded-xl border border-amber-50">
              <Truck className="w-5 h-5 text-amber-600" />
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Express 2Hr</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 bg-sky-50/50 rounded-xl border border-sky-50">
              <RotateCcw className="w-5 h-5 text-sky-600" />
              <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">Easy Returns</span>
            </div>
          </div>
        </div>

        {/* Right Column: Descriptions, Price, Tabs, Delivery check */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between max-h-[92vh] overflow-y-auto">
          
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  {product.brand} Official
                </span>
                <span className="text-xs text-gray-400">SKU: {product.sku}</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-gray-400 mt-1">Category: {product.category} &gt; {product.subcategory}</p>
            </div>

            {/* Rating Summary */}
            <div className="flex items-center gap-2.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1 text-amber-500 font-extrabold text-sm">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{product.rating} Rating</span>
              </div>
              <span className="text-gray-300">|</span>
              <button 
                onClick={() => setActiveTab('reviews')}
                className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
              >
                {product.ratingCount} Verified Reviews
              </button>
            </div>

            {/* Pricing Section */}
            <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">Our Special Price</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
                  <span className="text-sm text-gray-400 line-through">₹{product.mrp}</span>
                </div>
                {product.discount > 0 && (
                  <span className="text-xs text-emerald-700 font-bold mt-1 block">
                    You save ₹{product.saveAmount} ({product.discount}% OFF)
                  </span>
                )}
              </div>

              {/* Add to Cart button */}
              <div>
                {product.stock <= 0 ? (
                  <button disabled className="bg-gray-100 text-gray-400 font-bold text-xs px-5 py-3 rounded-xl border cursor-not-allowed">
                    Sold Out
                  </button>
                ) : quantityInCart > 0 ? (
                  <div className="flex items-center bg-emerald-600 text-white rounded-xl shadow-md overflow-hidden">
                    <button onClick={() => onRemoveFromCart(product)} className="px-3 py-3 hover:bg-emerald-700 font-bold text-sm cursor-pointer">-</button>
                    <span className="px-3 text-sm font-black min-w-6 text-center">{quantityInCart}</span>
                    <button onClick={() => onAddToCart(product)} className="px-3 py-3 hover:bg-emerald-700 font-bold text-sm cursor-pointer">+</button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(product)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-sm font-extrabold shadow-md shadow-emerald-200 transition-all active:scale-95 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add To Cart
                  </button>
                )}
              </div>
            </div>

            {/* Pin Code Checker */}
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Check Delivery Feasibility</span>
              </div>
              <form onSubmit={handlePinCheck} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit pin (e.g. 110001)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  maxLength={6}
                  className="flex-1 bg-white border border-gray-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer transition-colors"
                >
                  Verify
                </button>
              </form>
              {pinChecked && (
                <div className={`flex items-start gap-1.5 text-xs font-semibold ${pinStatus.success ? 'text-emerald-700' : 'text-red-600'}`}>
                  {pinStatus.success ? <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                  <p>{pinStatus.text}</p>
                </div>
              )}
            </div>

            {/* Detail Tabs */}
            <div className="border-b border-gray-100 flex gap-4 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-2 border-b-2 cursor-pointer ${
                  activeTab === 'details' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-gray-500'
                }`}
              >
                Specifications
              </button>
              {product.ingredients && (
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`py-2 border-b-2 cursor-pointer ${
                    activeTab === 'ingredients' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-gray-500'
                  }`}
                >
                  Ingredients & Nutrition
                </button>
              )}
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-2 border-b-2 cursor-pointer ${
                  activeTab === 'reviews' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-gray-500'
                }`}
              >
                Reviews
              </button>
            </div>

            {/* Tab Contents */}
            <div className="text-xs text-gray-600 leading-relaxed font-medium">
              {activeTab === 'details' && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <div>
                    <h4 className="font-extrabold text-gray-800 mb-1.5 uppercase tracking-wide text-[10px]">Key Highlights:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {product.highlights.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-gray-400 block font-bold text-[9px] uppercase">Manufacturer</span>
                      <span className="text-gray-700 font-semibold">{product.manufacturer || 'Daily Needs Selected'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold text-[9px] uppercase">Country of Origin</span>
                      <span className="text-gray-700 font-semibold">{product.countryOfOrigin || 'India'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold text-[9px] uppercase">Storage</span>
                      <span className="text-gray-700 font-semibold">{product.storageInstructions || 'Cool Dry Place'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold text-[9px] uppercase">Expiry (Demo)</span>
                      <span className="text-gray-700 font-semibold">{product.expiryInfo || 'Best before 6 months'}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-extrabold text-gray-800 mb-1 uppercase tracking-wide text-[10px]">Ingredients:</h4>
                    <p className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-gray-500">
                      {product.ingredients || 'No artificial preservatives or added chemicals. 100% natural organic procurement.'}
                    </p>
                  </div>
                  {product.nutritionFacts && (
                    <div>
                      <h4 className="font-extrabold text-gray-800 mb-1.5 uppercase tracking-wide text-[10px]">Nutrition Facts (per 100g/serving):</h4>
                      <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                        {Object.entries(product.nutritionFacts).map(([k, v]) => (
                          <div key={k} className="flex justify-between p-2 hover:bg-gray-50/50">
                            <span className="text-gray-400 font-bold">{k}</span>
                            <span className="text-gray-800 font-bold">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {DEFAULT_REVIEWS.map((r) => (
                    <div key={r.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1.5 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{r.userName}</span>
                        <span className="text-[10px] text-gray-400">{r.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-500">
                          {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-current text-amber-500" />)}
                        </div>
                        {r.verified && (
                          <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" /> Verified Purchase
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs italic">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Related / Frequently Bought Products Carousel */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-left">
            <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider mb-3">
              Customers Also Bought:
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-1.5">
              {relatedProducts.slice(0, 5).map((p) => (
                <div 
                  key={p.id}
                  onClick={() => { onSelectProduct(p); setActiveImageKey('main'); }}
                  className="w-28 shrink-0 cursor-pointer p-2 rounded-xl border border-gray-50 hover:border-emerald-100 hover:shadow-xs transition-all bg-linear-to-b hover:from-white hover:to-emerald-50/10 text-center space-y-1.5"
                >
                  <img 
                    src={p.images.main} 
                    alt={p.name} 
                    className="w-14 h-14 object-contain mx-auto"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block truncate">{p.brand}</div>
                    <div className="text-[11px] font-semibold text-gray-800 line-clamp-1 block leading-tight">{p.name}</div>
                    <div className="text-xs font-bold text-gray-900 block mt-1">₹{p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
