/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, ShoppingBag, Trash2, Tag, Percent, ArrowRight, Sparkles, 
  ChevronRight, Gift, HelpCircle, Check, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { staticCoupons } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onAddToCart: (product: any) => void;
  onRemoveFromCart: (product: any) => void;
  onClearItem: (product: any) => void;
  onCheckout: (appliedCoupon: Coupon | null) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  onClearItem,
  onCheckout
}: CartDrawerProps) {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponFeedback, setCouponFeedback] = useState({ success: true, text: '' });

  if (!isOpen) return null;

  // Pricing calculations
  const originalMrpTotal = cartItems.reduce((acc, item) => acc + item.product.mrp * item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const savingsAmount = originalMrpTotal - subtotal;
  
  const minOrderValue = 100;
  const freeDeliveryThreshold = 500;
  
  const deliveryCharge = subtotal >= freeDeliveryThreshold ? 0 : 40;
  const taxAmount = Math.round(subtotal * 0.05); // 5% GST

  // Coupon application
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    
    if (!code) return;

    const matched = staticCoupons.find(c => c.code === code);
    if (!matched) {
      setCouponFeedback({ success: false, text: 'Invalid coupon code. Try DAILY100 or FESTIVE25' });
      setAppliedCoupon(null);
      return;
    }

    if (subtotal < matched.minOrderValue) {
      setCouponFeedback({ 
        success: false, 
        text: `Min order value for ${code} is ₹${matched.minOrderValue}. Add items worth ₹${matched.minOrderValue - subtotal} more.` 
      });
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(matched);
    setCouponFeedback({ success: true, text: `Coupon "${code}" applied successfully!` });
  };

  const removeAppliedCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponFeedback({ success: true, text: '' });
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountPercent === 0) return 0; // free delivery code, handled in totals
    
    const discount = Math.round(subtotal * (appliedCoupon.discountPercent / 100));
    // Caps
    if (appliedCoupon.code === 'DAILY100') return Math.min(discount, 150);
    if (appliedCoupon.code === 'FIRSTNEEDS') return Math.min(discount, 100);
    return discount;
  };

  const couponDiscount = calculateDiscount();
  const finalTotal = subtotal + deliveryCharge + taxAmount - couponDiscount;

  // Free delivery progress calculations
  const progressPercent = Math.min((subtotal / freeDeliveryThreshold) * 100, 100);
  const remainingForFreeDelivery = freeDeliveryThreshold - subtotal;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-xs">
      {/* Sidebar background click trigger */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      {/* Content wrapper */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-in-right z-10">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-900">My Shopping Cart</h2>
              <p className="text-xs text-gray-500 font-semibold">{cartItems.length} categories listed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Middle items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-20 space-y-4 max-w-xs mx-auto">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-pulse">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-extrabold text-gray-900">Your Cart is Empty</p>
                <p className="text-xs text-gray-400 mt-1">Looks like you haven't added any daily groceries to your basket yet. Let's start shopping!</p>
              </div>
              <button
                onClick={onClose}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-6 rounded-xl cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {/* Free Delivery Banner Progress */}
              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-emerald-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> 
                    {remainingForFreeDelivery > 0 ? 'Delivery status' : 'Free Delivery unlocked!'}
                  </span>
                  <span className="text-emerald-700">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-gray-200/60 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                {remainingForFreeDelivery > 0 ? (
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Add items worth <strong className="font-extrabold">₹{remainingForFreeDelivery}</strong> more to unlock <strong className="font-extrabold">FREE Express Delivery!</strong>
                  </p>
                ) : (
                  <p className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 rounded-full" /> Your shipping fee (₹40) is completely FREE!
                  </p>
                )}
              </div>

              {/* Items iteration list */}
              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-start gap-3">
                    <img
                      src={item.product.images.main}
                      alt={item.product.name}
                      className="w-16 h-16 object-contain rounded-xl bg-gray-50 border border-gray-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 text-left space-y-1">
                      <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{item.product.brand}</div>
                      <h4 className="text-xs font-semibold text-gray-800 line-clamp-1">{item.product.name}</h4>
                      <p className="text-[10px] text-gray-400">{item.product.weight}</p>
                      
                      <div className="flex items-center justify-between pt-1">
                        {/* Price columns */}
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-black text-gray-950">₹{item.product.price}</span>
                          {item.product.discount > 0 && (
                            <span className="text-[10px] text-gray-400 line-through">₹{item.product.mrp}</span>
                          )}
                        </div>

                        {/* Quantity management */}
                        <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <button
                            onClick={() => onRemoveFromCart(item.product)}
                            className="p-1 px-2.5 hover:bg-gray-200 active:scale-90 text-xs font-black text-gray-600 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-1.5 text-xs font-bold text-gray-800 min-w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onAddToCart(item.product)}
                            className="p-1 px-2.5 hover:bg-gray-200 active:scale-90 text-xs font-black text-gray-600 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Clear button */}
                    <button
                      onClick={() => onClearItem(item.product)}
                      className="text-gray-300 hover:text-red-500 p-1 rounded-lg cursor-pointer transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Coupons List Recommendations */}
              <div className="bg-amber-50/50 p-3.5 border border-amber-100 rounded-2xl space-y-2 text-left">
                <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5" /> Recommended Coupons
                </span>
                <div className="space-y-1.5">
                  {staticCoupons.slice(0, 2).map((c) => (
                    <div key={c.code} className="flex justify-between items-center text-[10px] font-medium border-b border-amber-100/40 pb-1.5">
                      <div>
                        <code className="bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded text-[9px] mr-1">{c.code}</code>
                        <span className="text-gray-600 font-semibold">{c.description}</span>
                      </div>
                      <button
                        onClick={() => { setCouponInput(c.code); }}
                        className="text-emerald-700 font-bold hover:underline cursor-pointer"
                      >
                        Use
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Summary (only if items > 0) */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">
            
            {/* Coupon Code Entry Form */}
            <div className="space-y-1.5">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Coupon (e.g. DAILY100)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 bg-white border border-gray-200 text-xs px-3.5 py-2.5 rounded-xl uppercase font-bold tracking-wider focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex justify-between items-center bg-emerald-100/60 text-emerald-800 p-2 rounded-xl border border-emerald-200">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-700" /> Active: "{appliedCoupon.code}"
                  </span>
                  <button 
                    onClick={removeAppliedCoupon}
                    className="text-emerald-900 font-extrabold text-xs hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponFeedback.text && !appliedCoupon && (
                <div className={`text-[10px] font-bold flex items-center gap-1 ${couponFeedback.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {couponFeedback.success ? <Check className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                  <span>{couponFeedback.text}</span>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs font-medium text-gray-500 border-b border-gray-200/60 pb-3">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-gray-900 font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span className="flex items-center gap-1"><Gift className="w-3.5 h-3.5" /> Direct Store Savings</span>
                <span>-₹{savingsAmount}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated GST & Cess (5%)</span>
                <span className="text-gray-900 font-semibold">₹{taxAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Delivery Charge</span>
                <span className="text-gray-900 font-semibold">
                  {deliveryCharge > 0 ? `₹${deliveryCharge}` : <strong className="text-emerald-600 uppercase">FREE</strong>}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center">
              <div className="text-left">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Estimated Total</span>
                <span className="text-xl font-black text-gray-900">₹{finalTotal}</span>
                <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">Total Savings: ₹{savingsAmount + couponDiscount}!</span>
              </div>

              {subtotal < minOrderValue ? (
                <button
                  disabled
                  className="bg-gray-100 border border-gray-200 text-gray-400 text-xs font-bold py-3.5 px-6 rounded-xl flex items-center gap-2 cursor-not-allowed"
                >
                  Min Order ₹100
                </button>
              ) : (
                <button
                  onClick={() => onCheckout(appliedCoupon)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-3.5 px-6 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-200 transition-all active:scale-95 cursor-pointer"
                >
                  Proceed to Checkout <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
