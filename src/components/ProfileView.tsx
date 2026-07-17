import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { 
  User, Mail, Phone, MapPin, ClipboardList, CheckCircle, 
  Trash, ArrowRight, UserCheck, ShieldCheck, Heart
} from "lucide-react";

export const ProfileView: React.FC = () => {
  const { 
    orders, user, updateUserProfile, loginUser, logoutUser,
    addNotification, setPage, setSelectedProductId, wishlist, products
  } = useStore();

  // Local login/signup states
  const [isLoginView, setIsLoginView] = useState(true);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");

  // Edit profile states
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editAddress, setEditAddress] = useState(user?.address || "");
  const [editPincode, setEditPincode] = useState(user?.pincode || "");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;

    if (isLoginView) {
      loginUser(authEmail, authName || "Valued Customer");
      addNotification(`Welcome back, ${authName || "Shopper"}!`, "success");
    } else {
      loginUser(authEmail, authName);
      addNotification(`Account registered! Welcome to Daily Needs, ${authName}!`, "success");
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      phone: editPhone,
      address: editAddress,
      pincode: editPincode
    });
    addNotification("Shipping details saved in local secure state!", "success");
  };

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  // If NOT logged in, show Login/Signup layout
  if (!user) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-neutral-800 dark:text-white">
            {isLoginView ? "Sign In to Daily Needs" : "Register New Account"}
          </h2>
          <p className="text-xs text-neutral-400">
            {isLoginView ? "Access your previous orders and shipping configurations." : "Create a local secure account with Rajesh Sharma's store."}
          </p>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-medium">
          {!isLoginView && (
            <div>
              <label className="block text-neutral-400 font-bold mb-1.5">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Aditi Sharma"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3.5 py-2.5 focus:outline-none text-neutral-800 dark:text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-neutral-400 font-bold mb-1.5">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. aditi@example.com"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3.5 py-2.5 focus:outline-none text-neutral-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-neutral-400 font-bold mb-1.5">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3.5 py-2.5 focus:outline-none text-neutral-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all text-center text-sm"
          >
            {isLoginView ? "Sign In" : "Register Account"}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-xs font-bold text-emerald-600 hover:underline"
          >
            {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div className="flex justify-between items-start border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-800 dark:text-white">Customer Profile</h1>
          <p className="text-xs text-neutral-400 mt-1">Manage shipping metrics, review purchase histories, and check bookmarked products.</p>
        </div>
        <button
          onClick={() => {
            logoutUser();
            addNotification("Logged out of local account.", "info");
          }}
          className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-300 rounded-xl text-xs font-extrabold transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left pane: Profile details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm space-y-6">
            
            <div className="flex items-center gap-3 border-b border-neutral-50 dark:border-neutral-700 pb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-sm shadow-md">
                {user.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-neutral-800 dark:text-white flex items-center gap-1">
                  {user.name} <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono">{user.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 text-xs font-medium">
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/50">
                <p className="text-neutral-400">Total Orders</p>
                <p className="text-lg font-black text-neutral-800 dark:text-white mt-1">{orders.length}</p>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800/50">
                <p className="text-neutral-400">Total Spent</p>
                <p className="text-lg font-black text-emerald-600 mt-1">₹{totalSpent}</p>
              </div>
            </div>

            {/* Profile update form */}
            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-medium pt-2">
              <div>
                <label className="block text-neutral-400 font-bold mb-1.5">Shipping Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-400 font-bold mb-1.5">WhatsApp / Phone</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-400 font-bold mb-1.5">Delivery Address (Bhopal)</label>
                <input
                  type="text"
                  required
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-400 font-bold mb-1.5">Pincode</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={editPincode}
                  onChange={(e) => setEditPincode(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-md transition-colors"
              >
                Save Shipping Address
              </button>
            </form>

          </div>
        </div>

        {/* Right pane: Orders history list */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Wishlist Bookmarks summary */}
          {wishlist.length > 0 && (
            <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-widest flex items-center gap-1.5">
                <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500" /> My Bookmarks ({wishlist.length})
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {products
                  .filter((p) => wishlist.includes(p.id))
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProductId(p.id);
                        setPage("Details");
                      }}
                      className="flex items-center gap-2 p-1.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      <img src={p.images[0]} alt={p.name} className="w-8 h-8 object-cover rounded-lg" referrerPolicy="no-referrer" />
                      <div>
                        <p className="text-neutral-800 dark:text-white truncate max-w-[100px]">{p.name}</p>
                        <p className="text-[10px] text-emerald-600">₹{p.sellingPrice}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Orders timeline */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-widest flex items-center gap-1.5">
              <ClipboardList className="w-4.5 h-4.5 text-emerald-500" /> Historical Order Records
            </h3>
            
            {orders.length === 0 ? (
              <div className="text-center py-12 text-neutral-400 text-xs font-medium">
                You haven't placed any orders yet. Place a test order from the checkout!
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((o) => (
                  <div key={o.id} className="p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700/60 bg-neutral-50/50 dark:bg-neutral-900/10 text-xs font-medium flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-neutral-800 dark:text-white">{o.id}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {new Date(o.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                      <p className="text-neutral-500">
                        Total Items: <strong className="text-neutral-800 dark:text-neutral-200">{o.items.length} staples</strong>
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {o.items.map((item, i) => (
                          <span key={i} className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 px-2.5 py-0.5 rounded-lg text-[10px] text-neutral-600 dark:text-neutral-300">
                            {item.name} x {item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end justify-between gap-2 shrink-0">
                      <div className="text-right">
                        <p className="font-black text-sm text-neutral-800 dark:text-white">₹{o.total}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">{o.paymentMethod} • Status: <strong className="text-emerald-600">{o.orderStatus}</strong></p>
                      </div>
                      <button
                        onClick={() => setPage("Track")}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[11px] shadow-sm shadow-emerald-500/10 flex items-center gap-1 transition-colors"
                      >
                        <span>Live Tracking</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
