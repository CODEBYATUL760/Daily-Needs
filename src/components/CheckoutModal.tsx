/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, CheckCircle, CreditCard, Truck, MapPin, Calendar, 
  Sparkles, Check, ChevronRight, ArrowLeft, QrCode, ShoppingBag
} from 'lucide-react';
import { CartItem, Coupon, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  onPlaceOrder: (order: Order) => void;
}

const DELIVERY_SLOTS = [
  { id: 'slot_1', label: '☀️ Morning Delivery', time: '7:00 AM - 10:00 AM', available: true },
  { id: 'slot_2', label: '🌤️ Afternoon Delivery', time: '1:00 PM - 4:00 PM', available: true },
  { id: 'slot_3', label: '🌙 Evening Delivery', time: '6:00 PM - 9:00 PM', available: true }
];

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  appliedCoupon,
  onPlaceOrder
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping & Slot, 2: Payment, 3: Success Confirmation

  // Shipping form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [flat, setFlat] = useState('');
  const [area, setArea] = useState('');
  const [pinCode, setPinCode] = useState('110001');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [selectedSlot, setSelectedSlot] = useState('slot_1');
  const [instructions, setInstructions] = useState('');
  const [formError, setFormError] = useState('');

  // Payment choice fields
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod');
  const [upiAddress, setUpiAddress] = useState('');
  const [showQr, setShowQr] = useState(false);

  // Success state order object
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const originalMrpTotal = cartItems.reduce((acc, item) => acc + item.product.mrp * item.quantity, 0);
  const savingsAmount = originalMrpTotal - subtotal;
  
  const deliveryCharge = subtotal >= 500 ? 0 : 40;
  const taxAmount = Math.round(subtotal * 0.05);

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const discount = Math.round(subtotal * (appliedCoupon.discountPercent / 100));
    if (appliedCoupon.code === 'DAILY100') return Math.min(discount, 150);
    if (appliedCoupon.code === 'FIRSTNEEDS') return Math.min(discount, 100);
    return discount;
  };

  const couponDiscount = calculateDiscount();
  const finalTotal = subtotal + deliveryCharge + taxAmount - couponDiscount;

  const handleValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !flat.trim() || !area.trim() || !pinCode.trim()) {
      setFormError('Please fill in all required shipping address fields.');
      return;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      setFormError('Please enter a valid 10-digit mobile phone number.');
      return;
    }
    if (!/^\d{6}$/.test(pinCode.trim())) {
      setFormError('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setFormError('');
    setStep(2);
  };

  const handlePlaceOrderSubmit = () => {
    if (paymentMethod === 'upi' && !upiAddress.includes('@') && !showQr) {
      setFormError('Please provide a valid UPI Virtual Payment Address (e.g. name@okhdfcbank) or choose QR scan.');
      return;
    }

    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      items: cartItems,
      subtotal,
      discount: savingsAmount + couponDiscount,
      couponCode: appliedCoupon?.code,
      deliveryCharge,
      tax: taxAmount,
      total: finalTotal,
      address: {
        fullName,
        phone,
        flat,
        area,
        pinCode,
        city,
        state
      },
      deliverySlot: DELIVERY_SLOTS.find(s => s.id === selectedSlot)?.label || 'Standard Slot',
      deliveryInstructions: instructions || undefined,
      paymentMethod,
      status: 'confirmed',
      createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    setPlacedOrder(newOrder);
    onPlaceOrder(newOrder);
    setFormError('');
    setStep(3);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-fade-in relative">
        
        {/* Floating Close (only available in pre-success stages) */}
        {step !== 3 && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP 1: Shipping Address & Slots */}
        {step === 1 && (
          <>
            {/* Left form area */}
            <form onSubmit={handleValidation} className="w-full md:w-3/5 p-6 space-y-4 max-h-[90vh] overflow-y-auto text-left">
              <div>
                <h2 className="text-lg font-black text-gray-900">Delivery Information</h2>
                <p className="text-xs text-gray-400">Where and when would you like us to deliver your groceries?</p>
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-100 text-red-700 text-xs p-3 rounded-xl font-medium">
                  ⚠️ {formError}
                </div>
              )}

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Receiver's Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Chandra"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Mobile Contact Phone *</label>
                    <input
                      type="text"
                      required
                      placeholder="10-Digit Mobile Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Flat / House No. / Building Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 302, Green Meadows"
                    value={flat}
                    onChange={(e) => setFlat(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Street Address / Locality / Sector *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sector 15, Near Central Market"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="PIN Code"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      maxLength={6}
                      className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="City Name"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Delivery Time Slot Selection */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Preferred Delivery Time Slot (Demo) *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {DELIVERY_SLOTS.map((slot) => {
                      const isSelected = selectedSlot === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedSlot(slot.id)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-xs' 
                              : 'border-gray-100 hover:border-gray-200 text-gray-600 bg-white'
                          }`}
                        >
                          <div className="text-xs font-extrabold">{slot.label}</div>
                          <div className="text-[10px] text-gray-400 mt-0.5">{slot.time}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery instructions */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Leave at door, call before arriving, ring bell twice"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm py-3 px-6 rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-200 transition-all cursor-pointer"
                >
                  Continue to Payment <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </form>

            {/* Right side summary panel */}
            <OrderSummaryPanel cartItems={cartItems} subtotal={subtotal} deliveryCharge={deliveryCharge} taxAmount={taxAmount} couponDiscount={couponDiscount} appliedCoupon={appliedCoupon} finalTotal={finalTotal} />
          </>
        )}

        {/* STEP 2: Payment Choice */}
        {step === 2 && (
          <>
            {/* Left Payment form */}
            <div className="w-full md:w-3/5 p-6 space-y-5 text-left flex flex-col justify-between max-h-[90vh] overflow-y-auto">
              <div className="space-y-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-600 font-bold cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Shipping details
                </button>

                <div>
                  <h2 className="text-lg font-black text-gray-900">Payment Options</h2>
                  <p className="text-xs text-gray-400">All payments are secure. Cash on delivery requires no online credentials.</p>
                </div>

                {formError && (
                  <div className="bg-red-50 border border-red-100 text-red-700 text-xs p-3 rounded-xl font-medium">
                    ⚠️ {formError}
                  </div>
                )}

                {/* Option checkboxes */}
                <div className="space-y-3">
                  {/* Cash on delivery */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('cod'); setFormError(''); }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'cod' 
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' 
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center mt-0.5">
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wide">💵 Cash on Delivery (COD)</h4>
                      <p className="text-[11px] text-gray-400">Pay inside cash, or pay via any UPI app directly to our delivery executive when items are delivered.</p>
                    </div>
                  </button>

                  {/* UPI Demo options */}
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod('upi'); setFormError(''); }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 cursor-pointer transition-all ${
                      paymentMethod === 'upi' 
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' 
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-600 flex items-center justify-center mt-0.5">
                      {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />}
                    </div>
                    <div className="space-y-1 w-full">
                      <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wide">📱 UPI App / QR Code (Demo)</h4>
                      <p className="text-[11px] text-gray-400">Scan our instant merchant QR code, or input your UPI Address handle for express mock billing.</p>
                      
                      {paymentMethod === 'upi' && (
                        <div className="pt-3 space-y-2 text-left border-t border-emerald-100 mt-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Enter UPI ID (e.g. user@ybl)"
                              value={upiAddress}
                              onChange={(e) => setUpiAddress(e.target.value)}
                              className="flex-1 bg-white border border-gray-200 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              disabled={showQr}
                            />
                            <button
                              type="button"
                              onClick={() => setShowQr(!showQr)}
                              className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" /> {showQr ? 'Use Address' : 'Show QR'}
                            </button>
                          </div>
                          
                          {showQr && (
                            <div className="p-3 bg-white rounded-xl border border-emerald-100 flex items-center gap-3 animate-fade-in">
                              <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                {/* SVG representation of QR */}
                                <svg className="w-20 h-20 text-gray-800" viewBox="0 0 100 100">
                                  <rect width="100" height="100" fill="#fff" />
                                  <rect x="10" y="10" width="20" height="20" fill="currentColor" />
                                  <rect x="70" y="10" width="20" height="20" fill="currentColor" />
                                  <rect x="10" y="70" width="20" height="20" fill="currentColor" />
                                  <rect x="15" y="15" width="10" height="10" fill="#fff" />
                                  <rect x="75" y="15" width="10" height="10" fill="#fff" />
                                  <rect x="15" y="75" width="10" height="10" fill="#fff" />
                                  <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                                  <rect x="30" y="10" width="5" height="15" fill="currentColor" />
                                  <rect x="50" y="15" width="10" height="5" fill="currentColor" />
                                  <rect x="10" y="45" width="15" height="5" fill="currentColor" />
                                  <rect x="70" y="45" width="20" height="5" fill="currentColor" />
                                  <rect x="75" y="75" width="15" height="15" fill="currentColor" />
                                </svg>
                              </div>
                              <div className="text-xs space-y-0.5 text-gray-600">
                                <p className="font-bold text-gray-800">Scan via BHIM, GPay, PhonePe</p>
                                <p>UPI ID: <strong className="font-extrabold text-emerald-800">dailyneeds@icici</strong></p>
                                <p>Simulate order placement below</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handlePlaceOrderSubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-200 transition-all cursor-pointer"
                >
                  <CheckCircle className="w-5 h-5" /> Confirm & Place Order (₹{finalTotal})
                </button>
              </div>
            </div>

            {/* Right Summary */}
            <OrderSummaryPanel cartItems={cartItems} subtotal={subtotal} deliveryCharge={deliveryCharge} taxAmount={taxAmount} couponDiscount={couponDiscount} appliedCoupon={appliedCoupon} finalTotal={finalTotal} />
          </>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION & BILL RECEIPT */}
        {step === 3 && placedOrder && (
          <div className="w-full p-8 text-center space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Order Is Placed!</h2>
              <p className="text-xs text-gray-400 mt-1">Thank you for shopping at Daily Needs. Your support keeps local businesses thriving.</p>
              <div className="bg-emerald-50 text-emerald-800 text-xs font-bold py-1.5 px-4 rounded-full inline-block mt-3 uppercase tracking-wider">
                Order Reference: {placedOrder.id}
              </div>
            </div>

            {/* Receipt Summary block */}
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5 text-left max-w-xl mx-auto space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Receipt Summary</span>
                <span className="text-[11px] text-gray-400 font-semibold">{placedOrder.createdAt}</span>
              </div>

              {/* Items row */}
              <div className="space-y-2 text-xs font-semibold text-gray-700">
                {placedOrder.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <span className="line-clamp-1 flex-1 text-gray-600 font-medium">
                      {item.product.name} <span className="text-[10px] text-gray-400 font-bold">x{item.quantity}</span>
                    </span>
                    <span className="text-gray-900 shrink-0">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Details */}
              <div className="border-t border-gray-200 pt-3 grid grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Shipping Address</span>
                  <p className="text-gray-800 font-semibold">{placedOrder.address.fullName}</p>
                  <p className="text-gray-600">{placedOrder.address.flat}, {placedOrder.address.area}</p>
                  <p className="text-gray-600">{placedOrder.address.city} - {placedOrder.address.pinCode}</p>
                </div>
                <div>
                  <span className="text-gray-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">Time Slot</span>
                  <p className="text-emerald-700 font-bold">{placedOrder.deliverySlot}</p>
                  {placedOrder.deliveryInstructions && (
                    <p className="text-gray-400 italic text-[11px] mt-1">"{placedOrder.deliveryInstructions}"</p>
                  )}
                </div>
              </div>

              {/* Pricing Totals */}
              <div className="border-t border-gray-200 pt-3 space-y-1.5 text-xs font-semibold text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{placedOrder.subtotal}</span>
                </div>
                {placedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Total Savings (Discount & Coupons)</span>
                    <span>-₹{placedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery fee</span>
                  <span>{placedOrder.deliveryCharge > 0 ? `₹${placedOrder.deliveryCharge}` : 'FREE'}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-black text-sm pt-2 border-t border-gray-200/60">
                  <span>Total Paid ({placedOrder.paymentMethod.toUpperCase()})</span>
                  <span>₹{placedOrder.total}</span>
                </div>
              </div>

            </div>

            <div className="pt-3">
              <button
                onClick={onClose}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-8 rounded-xl cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Sub-component panel for Order Summary inside Checkout
function OrderSummaryPanel({
  cartItems,
  subtotal,
  deliveryCharge,
  taxAmount,
  couponDiscount,
  appliedCoupon,
  finalTotal
}: {
  cartItems: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  taxAmount: number;
  couponDiscount: number;
  appliedCoupon: Coupon | null;
  finalTotal: number;
}) {
  return (
    <div className="hidden md:block w-2/5 bg-gray-50 border-l border-gray-100 p-6 text-left space-y-4 max-h-[90vh] overflow-y-auto">
      <div>
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-3">Order Summary</h3>
        
        {/* Short items list */}
        <div className="divide-y divide-gray-100 max-h-[220px] overflow-y-auto mb-4">
          {cartItems.map((item) => (
            <div key={item.product.id} className="py-2.5 flex items-center gap-2 text-xs font-medium">
              <img 
                src={item.product.images.main} 
                alt={item.product.name} 
                className="w-8 h-8 object-contain rounded-lg border bg-white"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="text-gray-800 line-clamp-1">{item.product.name}</div>
                <div className="text-gray-400 text-[10px]">Qty: {item.quantity} x ₹{item.product.price}</div>
              </div>
              <div className="text-gray-900 font-bold shrink-0">₹{item.product.price * item.quantity}</div>
            </div>
          ))}
        </div>

        {/* Breakdown details */}
        <div className="space-y-2 text-xs font-semibold text-gray-500 border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-gray-900">₹{subtotal}</span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Coupon Discount ({appliedCoupon?.code})</span>
              <span>-₹{couponDiscount}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Estimated GST (5%)</span>
            <span className="text-gray-900">₹{taxAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping / Delivery</span>
            <span className="text-gray-900">
              {deliveryCharge > 0 ? `₹${deliveryCharge}` : <span className="text-emerald-600 uppercase font-black">FREE</span>}
            </span>
          </div>
        </div>

        {/* Grand Total */}
        <div className="border-t border-gray-200/60 pt-3 flex justify-between items-baseline mt-3">
          <span className="text-xs font-bold text-gray-900">To Pay Amount:</span>
          <span className="text-xl font-black text-gray-900">₹{finalTotal}</span>
        </div>

        {/* Fast checkout security badge */}
        <div className="pt-6 text-center space-y-1 bg-white p-3 border border-gray-100 rounded-2xl mt-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">🛡️ Daily Needs Assurance</p>
          <p className="text-[10px] text-gray-500 font-medium leading-relaxed">No payments processed on demo code. Safe checkout.</p>
        </div>
      </div>
    </div>
  );
}
