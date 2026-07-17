import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Check, AlertTriangle, HelpCircle } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { COUPONS } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onAddToCart: (product: any) => void;
  onRemoveFromCart: (product: any) => void;
  onClearCart: () => void;
  onCheckout: (appliedCoupon: Coupon | null, total: number) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onCheckout
}: CartDrawerProps) {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.product.sellingPrice * item.quantity), 0);

  // Constants
  const MIN_ORDER = 100;
  const FREE_SHIPPING_LIMIT = 500;
  const SHIPPING_CHARGE = 40;

  // Shipping cost calculation
  const shippingCost = subtotal >= FREE_SHIPPING_LIMIT || subtotal === 0 ? 0 : SHIPPING_CHARGE;

  // Coupon calculations
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      couponDiscount = Math.round((subtotal * appliedCoupon.value) / 100);
      // Cap percentage discount at ₹100 for safety
      couponDiscount = Math.min(couponDiscount, 100);
    } else {
      couponDiscount = appliedCoupon.value;
    }
  }

  const grandTotal = subtotal + shippingCost - couponDiscount;

  // Apply coupon function
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const matched = COUPONS.find(c => c.code.toLowerCase() === couponInput.trim().toLowerCase());
    if (!matched) {
      setCouponError('Invalid coupon code. Try SUPERGROCERY or FIRST50.');
      return;
    }

    if (subtotal < matched.minOrderValue) {
      setCouponError(`This coupon requires a minimum cart value of ₹${matched.minOrderValue}.`);
      return;
    }

    setAppliedCoupon(matched);
    setCouponSuccess(`Coupon '${matched.code}' applied successfully! Saved ₹${matched.discountType === 'percentage' ? matched.value + '%' : '₹' + matched.value}.`);
    setCouponInput('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Drawer panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col z-10 animate-slide-left" id="cart-drawer">
        {/* Header section */}
        <div className="p-4 border-b border-gray-150 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-green" />
            <h3 className="font-display font-black text-lg text-brand-dark">Your Shopping Cart</h3>
            <span className="bg-brand-green-light text-brand-green-dark text-3xs font-black rounded-full h-5 px-2 flex items-center justify-center">
              {cartCount} Items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Delivery Progress Bar */}
        {subtotal > 0 && (
          <div className="bg-brand-green-light/20 p-4 border-b border-gray-100 text-left select-none">
            {subtotal >= FREE_SHIPPING_LIMIT ? (
              <p className="text-xs text-brand-green-dark font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-brand-green bg-white rounded-full p-0.5" />
                Congratulations! You qualified for <span className="font-extrabold">FREE Delivery</span>!
              </p>
            ) : (
              <div className="space-y-1.5">
                <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                  Add <span className="font-extrabold text-brand-green">₹{FREE_SHIPPING_LIMIT - subtotal}</span> more to get <span className="font-extrabold">FREE Delivery</span> (Save ₹40)!
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-green h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((subtotal / FREE_SHIPPING_LIMIT) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scrollable Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 select-none">
              <div className="yellow-gradient p-5 rounded-3xl text-brand-green">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-brand-dark">Your basket is empty!</h4>
                <p className="text-xs text-gray-400 mt-1">Add items from our premium catalog to start shopping.</p>
              </div>
              <button
                onClick={onClose}
                className="bg-brand-green hover:bg-brand-green-dark text-white font-black text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 select-none">
                <span className="text-2xs font-bold text-gray-400 uppercase">Items List</span>
                <button onClick={onClearCart} className="text-3xs font-bold text-red-500 hover:underline flex items-center gap-1 uppercase">
                  <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                </button>
              </div>

              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100 items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 text-left">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl border border-gray-200" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 leading-none mb-0.5">{item.product.brand}</p>
                      <h4 className="font-bold text-xs text-brand-dark line-clamp-1 leading-snug">{item.product.name}</h4>
                      <p className="text-3xs text-gray-500 font-semibold mb-0.5">{item.product.weight} {item.product.unit}</p>
                      <p className="text-xs font-black text-brand-dark leading-none mt-1">₹{item.product.sellingPrice}</p>
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                    <button
                      onClick={() => onRemoveFromCart(item.product)}
                      className="p-1.5 hover:bg-gray-100 transition-colors cursor-pointer text-gray-500"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-bold text-xs text-center min-w-[20px] select-none">{item.quantity}</span>
                    <button
                      onClick={() => onAddToCart(item.product)}
                      className="p-1.5 hover:bg-gray-100 transition-colors cursor-pointer text-gray-500"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Billing Section */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-150 space-y-4 bg-gray-50/80">
            {/* Coupon System form */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-left block">Apply Restocking Coupons</span>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-brand-green-light border border-brand-green/20 p-2.5 rounded-xl">
                  <div className="text-left text-xs">
                    <p className="font-bold text-brand-green-dark">Code: {appliedCoupon.code} applied!</p>
                    <p className="text-3xs text-gray-500 font-semibold">{appliedCoupon.description}</p>
                  </div>
                  <button onClick={removeCoupon} className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer hover:underline">Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-xs">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g., SUPERGROCERY)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="bg-transparent w-full px-3 py-1.5 text-xs focus:outline-hidden text-brand-dark font-bold uppercase placeholder-gray-400"
                  />
                  <button type="submit" className="bg-brand-green hover:bg-brand-green-dark px-3 py-1 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer">
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-3xs text-red-500 font-semibold text-left">{couponError}</p>}
              {couponSuccess && <p className="text-3xs text-brand-green-dark font-semibold text-left">{couponSuccess}</p>}
            </div>

            {/* Bill details */}
            <div className="space-y-2 text-xs border-t border-gray-150 pt-3 text-left">
              <div className="flex justify-between font-semibold text-gray-500">
                <span>Cart Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-500">
                <span>Delivery Charges</span>
                <span>{shippingCost === 0 ? (
                  <span className="text-brand-green font-bold">FREE</span>
                ) : `₹${shippingCost}`}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between font-bold text-brand-green-dark">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-brand-dark text-base border-t border-gray-200/60 pt-2.5">
                <span>To Pay</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            {/* Checkout Rule Constraint (Min order ₹100) */}
            {subtotal < MIN_ORDER ? (
              <div className="bg-red-50 border border-red-200/50 p-3 rounded-2xl flex items-start gap-2.5 text-left">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-3xs">
                  <p className="font-extrabold text-red-600 uppercase tracking-wider">Minimum Checkout Limit: ₹{MIN_ORDER}</p>
                  <p className="text-gray-500 mt-1 leading-relaxed font-semibold">Your current subtotal of ₹{subtotal} is below the sustainable threshold. Please add items worth ₹{MIN_ORDER - subtotal} more to checkout.</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onCheckout(appliedCoupon, grandTotal)}
                className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer text-sm tracking-wide"
              >
                <span>PROCEED TO CHECKOUT (₹{grandTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
