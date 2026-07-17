import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { 
  Trash, ChevronRight, MapPin, Tag, X, AlertTriangle, 
  CreditCard, Truck, Receipt, CheckCircle, Info, QrCode
} from "lucide-react";

export const CartView: React.FC = () => {
  const {
    cart, removeFromCart, updateCartQty,
    cartSubtotal, discountAmount, deliveryCharge, gstAmount, cartTotal,
    isMinOrderMet, minOrderValue, freeShippingThreshold,
    appliedCoupon, applyCouponCode, removeCoupon,
    placeOrder, user
  } = useStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Checkout inputs
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [pincode, setPincode] = useState(user?.pincode || "");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "COD">("UPI");

  // Local state for UPI QR code checkout simulation
  const [showUpiQr, setShowUpiQr] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    if (!couponInput.trim()) return;

    const res = applyCouponCode(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput("");
    } else {
      setCouponError(res.message);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMinOrderMet) return;

    const customerDetails = {
      name,
      email,
      phone,
      address,
      pincode
    };

    if (paymentMethod === "UPI") {
      // Show dynamic UPI QR code first before finishing
      setShowUpiQr(true);
    } else {
      // COD instantly creates order
      placeOrder("COD", customerDetails);
    }
  };

  const handleFinishUpiPayment = () => {
    const customerDetails = {
      name,
      email,
      phone,
      address,
      pincode
    };
    setShowUpiQr(false);
    placeOrder("UPI", customerDetails);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <h1 className="text-2xl font-black text-neutral-800 dark:text-white">Shopping Cart & Checkout</h1>
        <p className="text-xs text-neutral-400 mt-1">Review your basket, apply coupons, and secure express delivery to Bhopal.</p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16 max-w-sm mx-auto space-y-4">
          <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 mx-auto">
            <Receipt className="w-10 h-10" />
          </div>
          <h2 className="text-lg font-bold text-neutral-800 dark:text-white">Your Cart is Empty</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Fill your basket with fresh groceries, premium basmati rice, tea, coffee, baby products, and stationery.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Cart List Table & Delivery Address (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Cart List */}
            <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-widest">Selected Groceries</h3>
              
              <div className="divide-y divide-neutral-50 dark:divide-neutral-700/50">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-4 flex items-center justify-between gap-4 text-xs font-medium">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl border border-neutral-100 dark:border-neutral-700" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <p className="font-extrabold text-neutral-400 uppercase tracking-wider text-[9px]">{item.product.brand}</p>
                        <p className="font-bold text-neutral-800 dark:text-neutral-100 truncate">{item.product.name}</p>
                        <p className="text-neutral-400 text-[10px]">{item.product.unit} • ₹{item.product.sellingPrice} per unit</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {/* Quantity Incrementor */}
                      <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-700 p-1.5 rounded-xl font-bold">
                        <button
                          onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded"
                        >
                          +
                        </button>
                      </div>

                      {/* Total Price & Delete icon */}
                      <span className="font-extrabold text-neutral-800 dark:text-white w-14 text-right">
                        ₹{item.product.sellingPrice * item.quantity}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-neutral-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address details Form (Only unlocked if Min Order value met!) */}
            <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500" /> Deliver To (Bhopal Limit)
              </h3>
              
              {!isMinOrderMet ? (
                <div className="p-4 bg-amber-50 dark:bg-neutral-900 border border-amber-200/50 dark:border-amber-800/30 rounded-2xl flex items-start gap-3 text-xs text-amber-800 dark:text-amber-400">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-bold">Minimum Order Value limit not met!</p>
                    <p className="mt-0.5">Please add at least ₹{minOrderValue - cartSubtotal} more of groceries to unlock the checkout details and payment sections. Current: ₹{cartSubtotal}.</p>
                  </div>
                </div>
              ) : (
                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-400 font-bold mb-1.5">Full Shipping Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2.5 focus:outline-none text-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1.5">WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2.5 focus:outline-none text-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1.5">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. support@dailyneeds.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2.5 focus:outline-none text-neutral-800 dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-400 font-bold mb-1.5">Full Delivery Address (Bhopal Region)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 123 Main Market, Arera Colony"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2.5 focus:outline-none text-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1.5">Postal Area Code (Pincode)</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 462001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2.5 focus:outline-none text-neutral-800 dark:text-white"
                    />
                  </div>

                  {/* Payment method */}
                  <div className="sm:col-span-2 pt-4 space-y-3">
                    <label className="block text-neutral-400 font-bold">Select Payment Option</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => setPaymentMethod("UPI")}
                        className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${paymentMethod === "UPI" ? "border-emerald-500 bg-emerald-50/50 dark:bg-neutral-700/50" : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700"}`}
                      >
                        <div>
                          <p className="font-bold text-neutral-800 dark:text-white">Pay Online (UPI)</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">UPI, GPay, Paytm QR</p>
                        </div>
                        <CreditCard className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div
                        onClick={() => setPaymentMethod("COD")}
                        className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${paymentMethod === "COD" ? "border-emerald-500 bg-emerald-50/50 dark:bg-neutral-700/50" : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700"}`}
                      >
                        <div>
                          <p className="font-bold text-neutral-800 dark:text-white">Cash on Delivery</p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">Pay cash to delivery rider</p>
                        </div>
                        <Truck className="w-5 h-5 text-neutral-500" />
                      </div>
                    </div>
                  </div>

                  {/* Submit checkout button */}
                  <div className="sm:col-span-2 pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-extrabold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>{paymentMethod === "UPI" ? "Proceed with Online Payment" : "Place Order (COD)"}</span>
                    </button>
                  </div>
                </form>
              )}

            </div>

          </div>

          {/* RIGHT: Price summary invoice & Coupons (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Promo coupon card */}
            <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm space-y-4 text-xs font-medium">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-widest flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-500" /> Shop Coupon Code
              </h3>
              
              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 dark:bg-neutral-950/20 border border-emerald-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-black text-emerald-700 dark:text-emerald-400 font-mono text-sm">{appliedCoupon.code}</span>
                    <p className="text-[10px] text-neutral-400 mt-1">{appliedCoupon.description}</p>
                  </div>
                  <button onClick={removeCoupon} className="p-1 hover:bg-emerald-100 text-emerald-700 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code (e.g. WELCOME50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2.5 font-bold uppercase focus:outline-none"
                  />
                  <button type="submit" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-md transition-colors">
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[10px] font-bold text-rose-500 mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] font-bold text-emerald-600 mt-1">{couponSuccess}</p>}
            </div>

            {/* Price Calculations */}
            <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm space-y-4 text-xs font-medium">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-widest flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-emerald-500" /> Invoice Details
              </h3>
              
              <div className="space-y-2.5 divide-y divide-neutral-50 dark:divide-neutral-700/50">
                <div className="flex justify-between text-neutral-500 pt-1">
                  <span>Basket Subtotal</span>
                  <span className="text-neutral-800 dark:text-neutral-100">₹{cartSubtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 pt-2.5">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500 pt-2.5">
                  <span>Bhopal Express Delivery Fee</span>
                  <span className="text-neutral-800 dark:text-neutral-100">
                    {deliveryCharge === 0 ? <strong className="text-emerald-600 font-extrabold">FREE</strong> : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-500 pt-2.5">
                  <span>Goods & Services Tax (GST 5%)</span>
                  <span className="text-neutral-800 dark:text-neutral-100">₹{gstAmount}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-neutral-900 dark:text-white pt-3 border-t border-dashed">
                  <span>Grand Total (Payable)</span>
                  <span>₹{cartTotal}</span>
                </div>
              </div>

              {/* Min Order warning */}
              {!isMinOrderMet && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-start gap-2 text-rose-800 dark:text-rose-400 text-[11px]">
                  <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold">Checkout Disabled</p>
                    <p className="mt-0.5">Minimum order value is ₹1000. Please add ₹{minOrderValue - cartSubtotal} more of groceries to order.</p>
                  </div>
                </div>
              )}

              {/* Free delivery bar status */}
              {cartSubtotal > 0 && cartSubtotal < freeShippingThreshold && (
                <div className="p-3 bg-emerald-50/50 dark:bg-neutral-900 border border-emerald-100/50 dark:border-neutral-800 rounded-xl flex items-start gap-2 text-neutral-500 text-[10px]">
                  <Info className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Add ₹{freeShippingThreshold - cartSubtotal} more of groceries to unlock <strong>FREE Express Delivery</strong>!</span>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Online UPI dynamic QR Code Checkout Modal */}
      {showUpiQr && (
        <div className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-neutral-100 dark:border-neutral-700 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
              <QrCode className="w-6 h-6 animate-pulse" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-800 dark:text-white">Pay Online (UPI Ready)</h3>
              <p className="text-xs text-neutral-400">Scan this QR Code using any UPI app (GPay, PhonePe, Paytm, BHIM)</p>
            </div>

            {/* Rendered simulated QR box */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/50 shadow-inner flex flex-col items-center justify-center">
              {/* Fake QR image */}
              <div className="w-40 h-40 bg-white border border-neutral-200 p-2 rounded-xl flex items-center justify-center">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=dailyneeds@upi%26pn=Daily%20Needs%20Bhopal%26am=1%26cu=INR"
                  alt="Dynamic UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[10px] font-black font-mono text-neutral-400 mt-2">Daily Needs Bhopal Gateway</p>
              <p className="text-xs font-bold text-neutral-800 mt-1">Amount: <span className="text-emerald-600">₹{cartTotal}</span></p>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowUpiQr(false)}
                className="flex-1 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-500 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFinishUpiPayment}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                Paid successfully
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
