import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { ALL_PRODUCTS, ACTIVE_COUPONS } from "../data/products";
import { 
  BarChart3, LayoutDashboard, ShoppingBag, FolderHeart, 
  ShoppingBasket, Users, AlertTriangle, Ticket, Bell, Settings,
  TrendingUp, Plus, Search, Edit2, Check, RefreshCw, Trash, Send
} from "lucide-react";
import { Product, Coupon, Order } from "../types";

export const AdminDashboard: React.FC = () => {
  const { 
    products, orders, updateOrderStatus,
    appliedCoupon, addNotification
  } = useStore();

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [productSearch, setProductSearch] = useState<string>("");
  const [editingStockProductId, setEditingStockProductId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  // Local Coupons State for simulation
  const [coupons, setCoupons] = useState<Coupon[]>(ACTIVE_COUPONS);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponVal, setNewCouponVal] = useState(10);
  const [newCouponMin, setNewCouponMin] = useState(1000);
  const [newCouponDesc, setNewCouponDesc] = useState("");

  // Broadcast Notification message
  const [broadcastMessage, setBroadcastMessage] = useState("");

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const outOfStockProducts = products.filter((p) => p.stock === 0 || p.stock < 15);
  const mockCustomersCount = 124;

  const handleUpdateStock = (productId: string) => {
    const p = products.find((prod) => prod.id === productId);
    if (p) {
      p.stock = tempStockValue;
      setEditingStockProductId(null);
      addNotification(`Updated stock of ${p.name} to ${tempStockValue}!`, "success");
    }
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    const newC: Coupon = {
      code: newCouponCode.toUpperCase(),
      discountType: "percentage",
      value: newCouponVal,
      minOrderValue: newCouponMin,
      description: newCouponDesc || `${newCouponVal}% OFF on orders above ₹${newCouponMin}`
    };
    setCoupons([newC, ...coupons]);
    setNewCouponCode("");
    setNewCouponDesc("");
    addNotification(`Coupon ${newC.code} added to shop!`, "success");
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons(coupons.filter((c) => c.code !== code));
    addNotification("Coupon code deactivated.", "info");
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage) return;
    addNotification(`Broadcast: "${broadcastMessage}" sent to all users!`, "success");
    setBroadcastMessage("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all min-h-[600px] bg-neutral-50/30 dark:bg-neutral-900/10 rounded-3xl border border-neutral-100 dark:border-neutral-800">
      
      {/* Admin Title Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800 mb-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">Control Center</span>
          <h1 className="text-2xl font-black text-neutral-800 dark:text-neutral-100 mt-1">Admin Dashboard</h1>
          <p className="text-xs text-neutral-400 mt-1">Manage Daily Needs inventory, track orders, configure coupons, and view analytics for Rajesh Sharma.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 p-3 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-xs shadow-inner">RS</div>
          <div>
            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Rajesh Sharma</p>
            <p className="text-[10px] text-neutral-400 font-mono">Daily Needs Bhopal Owner</p>
          </div>
        </div>
      </div>

      {/* Grid Layout: Sidebar Navigation & Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "dashboard" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10" : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"}`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span>Overview Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "products" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10" : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"}`}
          >
            <ShoppingBasket className="w-4.5 h-4.5" />
            <span>Products Inventory</span>
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "orders" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10" : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"}`}
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            <span>Customer Orders</span>
            {orders.filter((o) => o.orderStatus === "Placed").length > 0 && (
              <span className="ml-auto w-5 h-5 bg-yellow-400 text-neutral-900 text-[10px] font-black rounded-full flex items-center justify-center">
                {orders.filter((o) => o.orderStatus === "Placed").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "coupons" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10" : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"}`}
          >
            <Ticket className="w-4.5 h-4.5" />
            <span>Coupon Engine</span>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "analytics" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10" : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"}`}
          >
            <BarChart3 className="w-4.5 h-4.5" />
            <span>Bhopal Sales Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "notifications" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10" : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"}`}
          >
            <Bell className="w-4.5 h-4.5" />
            <span>Broadcast Alerts</span>
          </button>
        </div>

        {/* Dynamic Content Window */}
        <div className="lg:col-span-3">

          {/* TAB 1: OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-250">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Sales Revenue</span>
                  <p className="text-2xl font-black text-neutral-800 dark:text-white mt-1">₹{totalRevenue.toLocaleString("en-IN")}</p>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-2">
                    <TrendingUp className="w-3.5 h-3.5" /> +14.5% Since yesterday
                  </span>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Orders</span>
                  <p className="text-2xl font-black text-neutral-800 dark:text-white mt-1">{totalOrdersCount}</p>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-2 block">
                    100% Fulfilled or Active
                  </span>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Low Stock Warnings</span>
                  <p className="text-2xl font-black text-rose-500 mt-1">{outOfStockProducts.length}</p>
                  <span className="text-[10px] text-neutral-400 font-medium flex items-center gap-1 mt-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Stock below 15 units
                  </span>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Registered Clients</span>
                  <p className="text-2xl font-black text-neutral-800 dark:text-white mt-1">{mockCustomersCount}</p>
                  <span className="text-[10px] text-neutral-400 font-medium mt-2 block">
                    Bhopal delivery radius
                  </span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6">
                <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100 mb-4">Incoming Shop Orders</h3>
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 text-xs">
                    No orders have been received yet. Place a test order from the checkout!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-neutral-100 dark:border-neutral-700 text-neutral-400 font-bold">
                          <th className="py-3 px-2">Order ID</th>
                          <th className="py-3 px-2">Customer</th>
                          <th className="py-3 px-2">Items</th>
                          <th className="py-3 px-2">Total Amount</th>
                          <th className="py-3 px-2">Payment</th>
                          <th className="py-3 px-2">Status</th>
                          <th className="py-3 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800 font-medium">
                        {orders.map((o) => (
                          <tr key={o.id}>
                            <td className="py-3.5 px-2 font-mono font-bold text-neutral-800 dark:text-neutral-200">{o.id}</td>
                            <td className="py-3.5 px-2">
                              <div>
                                <p className="font-bold text-neutral-800 dark:text-neutral-200">{o.customerDetails.name}</p>
                                <p className="text-[10px] text-neutral-400">{o.customerDetails.phone}</p>
                              </div>
                            </td>
                            <td className="py-3.5 px-2 text-neutral-500 dark:text-neutral-400">{o.items.length} items</td>
                            <td className="py-3.5 px-2 font-bold text-neutral-800 dark:text-neutral-200">₹{o.total}</td>
                            <td className="py-3.5 px-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${o.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400" : "bg-yellow-50 text-yellow-700"}`}>
                                {o.paymentStatus} ({o.paymentMethod})
                              </span>
                            </td>
                            <td className="py-3.5 px-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${o.orderStatus === "Delivered" ? "bg-emerald-50 text-emerald-700" : o.orderStatus === "Out for Delivery" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
                                {o.orderStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-2 text-right">
                              <select
                                value={o.orderStatus}
                                onChange={(e) => {
                                  updateOrderStatus(o.id, e.target.value as any);
                                  addNotification(`Order status updated to ${e.target.value}`, "info");
                                }}
                                className="bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg p-1 text-[11px] font-bold focus:outline-none"
                              >
                                <option value="Placed">Placed</option>
                                <option value="Processed">Processed</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS STOCK */}
          {activeTab === "products" && (
            <div className="space-y-6 animate-in fade-in duration-250 bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100">Products Catalog & Stock Level</h3>
                  <p className="text-xs text-neutral-400 mt-1">Total products listed: {products.length}. Type a name to filter.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search brand, name, category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl text-xs placeholder-neutral-400 focus:outline-none text-neutral-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-100 dark:border-neutral-700 text-neutral-400 font-bold sticky top-0 bg-white dark:bg-neutral-800">
                      <th className="py-3 px-2">Image</th>
                      <th className="py-3 px-2">Product Name</th>
                      <th className="py-3 px-2">Category</th>
                      <th className="py-3 px-2">Price</th>
                      <th className="py-3 px-2">Stock status</th>
                      <th className="py-3 px-2 text-right">Edit Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800 font-medium">
                    {products
                      .filter((p) =>
                        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
                        p.category.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .slice(0, 30) // show last 30 for performance
                      .map((p) => (
                        <tr key={p.id}>
                          <td className="py-3 px-2">
                            <img src={p.images[0]} alt={p.name} className="w-9 h-9 object-cover rounded-lg border border-neutral-100 dark:border-neutral-700" referrerPolicy="no-referrer" />
                          </td>
                          <td className="py-3 px-2">
                            <div>
                              <p className="font-bold text-neutral-800 dark:text-neutral-200">{p.name}</p>
                              <p className="text-[10px] text-neutral-400 font-mono">{p.sku} • {p.unit}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-neutral-500">{p.category}</td>
                          <td className="py-3 px-2 font-bold text-neutral-800 dark:text-white">₹{p.sellingPrice}</td>
                          <td className="py-3 px-2">
                            {p.stock === 0 ? (
                              <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold text-[10px]">Out of Stock</span>
                            ) : p.stock < 15 ? (
                              <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full font-bold text-[10px]">Low ({p.stock})</span>
                            ) : (
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold text-[10px]">Good ({p.stock})</span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-right">
                            {editingStockProductId === p.id ? (
                              <div className="flex items-center justify-end gap-1">
                                <input
                                  type="number"
                                  value={tempStockValue}
                                  onChange={(e) => setTempStockValue(Number(e.target.value))}
                                  className="w-14 bg-neutral-50 border border-neutral-300 rounded p-1 text-[11px] font-bold focus:outline-none"
                                />
                                <button
                                  onClick={() => handleUpdateStock(p.id)}
                                  className="p-1.5 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingStockProductId(p.id);
                                  setTempStockValue(p.stock);
                                }}
                                className="p-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-neutral-600"
                                title="Edit Stock"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in duration-250 bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800">
              <div className="border-b border-neutral-100 pb-4">
                <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100">Fulfillment Pipeline</h3>
                <p className="text-xs text-neutral-400 mt-1">Real-time update order statuses here. Updates customer tracking window instantly.</p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 text-xs">
                  No orders have been received yet. Go buy some items first!
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700 flex flex-col sm:flex-row justify-between gap-4 text-xs font-medium bg-neutral-50/50 dark:bg-neutral-800/30">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-neutral-800 dark:text-white">{o.id}</span>
                          <span className="text-[10px] text-neutral-400">{new Date(o.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-neutral-500">
                          Customer: <strong className="text-neutral-800 dark:text-neutral-200">{o.customerDetails.name}</strong> • Phone: {o.customerDetails.phone}
                        </p>
                        <p className="text-neutral-500">
                          Address: <span className="text-neutral-800 dark:text-neutral-200">{o.customerDetails.address}, Bhopal ({o.customerDetails.pincode})</span>
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {o.items.map((item, i) => (
                            <span key={i} className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 px-2.5 py-1 rounded-lg text-[10px] text-neutral-600 dark:text-neutral-300">
                              {item.name} x {item.quantity}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:items-end justify-between gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-sm font-black text-neutral-800 dark:text-white">₹{o.total}</span>
                          <p className="text-[10px] text-neutral-400">Payment: {o.paymentMethod} • Status: {o.paymentStatus}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Update State:</span>
                          <select
                            value={o.orderStatus}
                            onChange={(e) => {
                              updateOrderStatus(o.id, e.target.value as any);
                              addNotification(`Order status updated to ${e.target.value}`, "success");
                            }}
                            className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-lg p-1.5 font-bold text-xs"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Processed">Processed</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: COUPON ENGINE */}
          {activeTab === "coupons" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-250">
              {/* Left Column: Create Coupon */}
              <div className="md:col-span-1 bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800">
                <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100 mb-4">Create Promo Code</h3>
                <form onSubmit={handleAddCoupon} className="space-y-4 text-xs font-medium">
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1.5">Coupon Code (Uppercase)</label>
                    <input
                      type="text"
                      placeholder="e.g. MONSOON30"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2.5 font-bold uppercase focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1.5">Discount Percentage (%)</label>
                    <input
                      type="number"
                      value={newCouponVal}
                      onChange={(e) => setNewCouponVal(Number(e.target.value))}
                      className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1.5">Min Order Requirement (₹)</label>
                    <input
                      type="number"
                      value={newCouponMin}
                      onChange={(e) => setNewCouponMin(Number(e.target.value))}
                      className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 font-bold mb-1.5">Description</label>
                    <input
                      type="text"
                      placeholder="Special discount code"
                      value={newCouponDesc}
                      onChange={(e) => setNewCouponDesc(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2.5 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Activate Coupon</span>
                  </button>
                </form>
              </div>

              {/* Right Column: List active Coupons */}
              <div className="md:col-span-2 bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800">
                <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100 mb-4">Active Shop Coupons</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map((c) => (
                    <div key={c.code} className="p-4 rounded-2xl border border-neutral-100 dark:border-neutral-700 relative bg-neutral-50/50 dark:bg-neutral-800/30 text-xs font-medium flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="font-black text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-lg font-mono">
                          {c.code}
                        </span>
                        <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-100 mt-3">{c.description}</h4>
                        <p className="text-[10px] text-neutral-400">Min Order value: ₹{c.minOrderValue}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCoupon(c.code)}
                        className="absolute top-4 right-4 p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg"
                        title="Deactivate Coupon"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BHOPAL SALES ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-in fade-in duration-250 bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100">Bhopal Regional Sales Analytics</h3>
                <p className="text-xs text-neutral-400 mt-1">Sales projections and category performance metrics for the 10 KM delivery radius.</p>
              </div>

              {/* Custom SVG Bar Chart */}
              <div className="pt-4 space-y-4">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Revenue by Category (Top Selling)</p>
                
                <div className="space-y-3">
                  {[
                    { cat: "Rice & Pulses", val: "₹18,400", pct: 90 },
                    { cat: "Oils & Ghee", val: "₹15,100", pct: 75 },
                    { cat: "Beverages & Dairy", val: "₹12,400", pct: 60 },
                    { cat: "Snacks & Chocolates", val: "₹9,800", pct: 48 },
                    { cat: "Personal Care", val: "₹6,500", pct: 32 }
                  ].map((row, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-neutral-700 dark:text-neutral-300">{row.cat}</span>
                        <span className="text-neutral-900 dark:text-white font-extrabold">{row.val}</span>
                      </div>
                      <div className="w-full h-3 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Speed statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-4 border-t border-neutral-50 dark:border-neutral-700/50 text-xs font-medium">
                <div className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-800/30">
                  <p className="text-neutral-400">Average Delivery Time</p>
                  <p className="text-xl font-extrabold text-emerald-600 mt-1">26.4 Minutes</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Within 10 KM limit</p>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-800/30">
                  <p className="text-neutral-400">Customer Satisfaction Score</p>
                  <p className="text-xl font-extrabold text-emerald-600 mt-1">4.8 / 5.0 Stars</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Based on 1,200 reviews</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BROADCAST SYSTEM */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in duration-250 bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100">Broadcast Shop Announcement</h3>
                <p className="text-xs text-neutral-400 mt-1">Broadcast an announcement, discount code, or service advisory banner to all shoppers at Daily Needs.</p>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <textarea
                  placeholder="e.g., Daily Needs is open! Get fresh green peas at 20% discount today! Use coupon code: FRESHPEAS."
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-2xl p-4 text-xs font-medium focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Notice</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
