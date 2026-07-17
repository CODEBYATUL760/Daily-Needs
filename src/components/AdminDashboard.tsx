import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Users, Tag, TrendingUp, AlertCircle, CheckCircle, Search, Edit2, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Product, Order, Coupon } from '../types';
import { PRODUCTS, COUPONS } from '../data/products';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onUpdateProducts: (updated: Product[]) => void;
  onUpdateOrders: (updated: Order[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminDashboard({
  products,
  orders,
  onUpdateProducts,
  onUpdateOrders,
  isOpen,
  onClose
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'orders' | 'products' | 'coupons'>('stats');
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editedStock, setEditedStock] = useState(0);
  const [editedPrice, setEditedPrice] = useState(0);

  // New Coupon Form States
  const [couponCode, setCouponCode] = useState('');
  const [couponVal, setCouponVal] = useState(10);
  const [couponMinVal, setCouponMinVal] = useState(200);
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [localCoupons, setLocalCoupons] = useState<Coupon[]>(COUPONS);

  if (!isOpen) return null;

  // Stats calculations
  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = orders.length;
  const lowStockCount = products.filter(p => p.stock <= 8).length;
  const activeCouponsCount = localCoupons.length;

  // Filter products for admin editor
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 50); // page cap

  // Update order status programmatically
  const handleUpdateOrderStatus = (orderId: string, nextStatus: Order['status']) => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: nextStatus };
      }
      return o;
    });
    onUpdateOrders(updated);
  };

  // Save edited product stock / price
  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const updated = products.map(p => {
      if (p.id === editingProduct.id) {
        return { ...p, stock: editedStock, sellingPrice: editedPrice, discount: Math.round(((p.mrp - editedPrice) / p.mrp) * 100) };
      }
      return p;
    });

    onUpdateProducts(updated);
    setEditingProduct(null);
  };

  // Create new coupon
  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const newCoupon: Coupon = {
      code: couponCode.trim().toUpperCase(),
      discountType: couponType,
      value: couponVal,
      minOrderValue: couponMinVal,
      description: `Get ${couponType === 'percentage' ? couponVal + '%' : '₹' + couponVal} OFF on orders above ₹${couponMinVal}`
    };

    setLocalCoupons([...localCoupons, newCoupon]);
    setCouponCode('');
  };

  // Delete coupon
  const handleDeleteCoupon = (code: string) => {
    setLocalCoupons(localCoupons.filter(c => c.code !== code));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-6xl shadow-2xl relative flex flex-col h-[90vh] overflow-hidden animate-fade-in" id="admin-dashboard">
        
        {/* Admin Header Section */}
        <div className="bg-brand-dark p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-2.5 text-left">
            <div className="yellow-gradient p-2 rounded-xl text-brand-dark shadow-xs">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl tracking-tight">Daily Needs Manager Control</h2>
              <p className="text-3xs text-gray-400 font-bold uppercase tracking-widest">Depot Analytics & Real-Time Logistics Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-700 text-white font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer border border-gray-700"
          >
            EXIT PANEL
          </button>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left: Sidebar Navigation */}
          <div className="bg-gray-50 border-r border-gray-150 p-4 w-full md:w-56 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'stats' ? 'bg-brand-green text-white shadow-md' : 'text-gray-600 hover:bg-gray-200/50'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Depot Statistics
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'orders' ? 'bg-brand-green text-white shadow-md' : 'text-gray-600 hover:bg-gray-200/50'
              }`}
            >
              <ShoppingCart className="w-4 h-4" /> Live Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'products' ? 'bg-brand-green text-white shadow-md' : 'text-gray-600 hover:bg-gray-200/50'
              }`}
            >
              <Package className="w-4 h-4" /> Inventory Editor
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'coupons' ? 'bg-brand-green text-white shadow-md' : 'text-gray-600 hover:bg-gray-200/50'
              }`}
            >
              <Tag className="w-4 h-4" /> Coupons Manager
            </button>
          </div>

          {/* Right: Main dynamic view Panel */}
          <div className="flex-1 p-6 overflow-y-auto text-left">
            
            {/* View Tab 1: Depot Stats */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Depot Metrics Overview</h3>
                
                {/* Visual Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-3xs text-emerald-600 font-bold uppercase tracking-wider">Depot Gross Revenue</p>
                      <h4 className="text-2xl font-black text-emerald-800 mt-1">₹{totalSales}</h4>
                    </div>
                    <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600"><TrendingUp className="w-5 h-5" /></div>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-3xs text-indigo-600 font-bold uppercase tracking-wider">Total Dispatch Orders</p>
                      <h4 className="text-2xl font-black text-indigo-800 mt-1">{totalOrders}</h4>
                    </div>
                    <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600"><ShoppingCart className="w-5 h-5" /></div>
                  </div>

                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-3xs text-red-600 font-bold uppercase tracking-wider">Low Stock Shortages</p>
                      <h4 className="text-2xl font-black text-red-800 mt-1">{lowStockCount}</h4>
                    </div>
                    <div className="bg-red-100 p-2.5 rounded-xl text-red-600"><AlertCircle className="w-5 h-5 animate-pulse" /></div>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-3xs text-amber-600 font-bold uppercase tracking-wider">Active Promo Coupons</p>
                      <h4 className="text-2xl font-black text-amber-800 mt-1">{activeCouponsCount}</h4>
                    </div>
                    <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600"><Tag className="w-5 h-5" /></div>
                  </div>
                </div>

                {/* Low Stock Warning List */}
                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-1.5 text-red-600">
                    <AlertCircle className="w-4 h-4 fill-current text-red-100" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wider">Critical Inventory Depletions (Stock &lt;= 8)</h4>
                  </div>
                  {lowStockCount === 0 ? (
                    <p className="text-xs text-gray-400 font-semibold flex items-center gap-1"><CheckCircle className="w-4 h-4 text-brand-green" /> All depot inventory stocks are optimized!</p>
                  ) : (
                    <div className="bg-white rounded-2xl border border-red-100 overflow-hidden divide-y divide-gray-100">
                      {products.filter(p => p.stock <= 8).slice(0, 10).map(p => (
                        <div key={p.id} className="p-3 flex items-center justify-between text-xs hover:bg-red-50/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <img src={p.images[0]} alt={p.name} className="w-8 h-8 object-cover rounded-md border border-gray-100" referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-bold text-gray-500 uppercase text-[9px]">{p.brand}</p>
                              <p className="font-semibold text-brand-dark">{p.name} ({p.weight} {p.unit})</p>
                            </div>
                          </div>
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-bold text-3xs uppercase tracking-wider">
                            ONLY {p.stock} LEFT
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* View Tab 2: Live Logistics Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Dispatcher Dispatch Tracking</h3>
                
                {orders.length === 0 ? (
                  <p className="text-xs text-gray-400 font-semibold py-8 text-center border-2 border-dashed border-gray-150 rounded-2xl select-none">No active sales recorded yet during this session</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div key={o.id} className="border border-gray-150 rounded-2xl p-4 bg-white shadow-xs space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                          <div>
                            <span className="text-xs font-black text-brand-green uppercase">ID: {o.id}</span>
                            <p className="text-3xs text-gray-400 font-bold uppercase tracking-wider">Placed at: {o.createdAt}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-2xs font-bold uppercase px-2 py-0.5 rounded-full ${
                              o.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                              o.status === 'out-for-delivery' ? 'bg-amber-100 text-amber-800' :
                              'bg-indigo-100 text-indigo-800'
                            }`}>
                              {o.status}
                            </span>

                            {/* Status transitions control */}
                            {o.status === 'ordered' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(o.id, 'packed')}
                                className="bg-brand-green hover:bg-brand-green-dark text-white font-bold text-3xs px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer"
                              >
                                Mark Packed <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            {o.status === 'packed' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(o.id, 'out-for-delivery')}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-3xs px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer"
                              >
                                Dispatch <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                            {o.status === 'out-for-delivery' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(o.id, 'delivered')}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-3xs px-2.5 py-1 rounded-md flex items-center gap-1 cursor-pointer"
                              >
                                Mark Delivered <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Order info details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">Customer Logistics</span>
                            <p className="font-black text-brand-dark">{o.customerDetails.name}</p>
                            <p className="text-gray-500 font-semibold">{o.customerDetails.phone} | {o.customerDetails.address} (Pincode: {o.customerDetails.pincode})</p>
                          </div>

                          <div>
                            <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">Summary Billing (To Pay: ₹{o.total})</span>
                            <div className="space-y-1">
                              {o.items.map((it, idx) => (
                                <p key={idx} className="text-gray-600 font-semibold">{it.name} ({it.weight}) x {it.quantity} - ₹{it.price * it.quantity}</p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* View Tab 3: Inventory Stock Editor */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Inventory Management</h3>
                  
                  {/* Local product search bar */}
                  <div className="relative w-full sm:max-w-xs">
                    <input
                      type="text"
                      placeholder="Search items for stock update..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-brand-dark focus:outline-hidden focus:border-brand-green font-bold"
                    />
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                {/* Grid Lists */}
                <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden divide-y divide-gray-150">
                  {filteredProducts.map((p) => (
                    <div key={p.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs hover:bg-gray-50/40">
                      <div className="flex items-center gap-3 text-left">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-gray-100" referrerPolicy="no-referrer" />
                        <div>
                          <p className="font-bold text-gray-400 uppercase text-[9px]">{p.brand}</p>
                          <h4 className="font-bold text-brand-dark leading-snug">{p.name}</h4>
                          <p className="text-3xs text-gray-500 font-semibold">{p.weight} {p.unit} | Barcode: {p.barcode}</p>
                        </div>
                      </div>

                      {/* Editing and stock display */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-gray-400 font-bold uppercase text-[9px]">Depot Stock</p>
                          <span className={`font-black ${p.stock <= 8 ? 'text-red-600 animate-pulse' : 'text-brand-dark'}`}>{p.stock} units</span>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 font-bold uppercase text-[9px]">Sale Price</p>
                          <span className="font-black text-brand-green">₹{p.sellingPrice}</span>
                        </div>

                        {/* Edit Action */}
                        <button
                          onClick={() => { setEditingProduct(p); setEditedStock(p.stock); setEditedPrice(p.sellingPrice); }}
                          className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-brand-green hover:text-white transition-all cursor-pointer"
                          title="Quick Edit Stock"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Floating Edit Panel Overlay */}
                {editingProduct && (
                  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <form onSubmit={handleSaveProductEdit} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl text-left space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-display font-black text-sm text-brand-dark uppercase tracking-wider">Modify Depot Stock</h4>
                        <button type="button" onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-red-500 font-bold">X</button>
                      </div>

                      <div className="text-xs">
                        <span className="font-bold text-gray-400 uppercase tracking-wider block">{editingProduct.brand}</span>
                        <p className="font-black text-brand-dark mt-0.5">{editingProduct.name}</p>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div>
                          <label className="block font-bold text-gray-500 mb-1">Stock Level (Units)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={editedStock}
                            onChange={(e) => setEditedStock(+e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-brand-dark font-black"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-500 mb-1">Selling Price (₹)</label>
                          <input
                            type="number"
                            required
                            min={5}
                            value={editedPrice}
                            onChange={(e) => setEditedPrice(+e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-brand-dark font-black"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-black py-2.5 rounded-xl transition-all cursor-pointer shadow-xs text-xs"
                      >
                        SAVE ADJUSTMENT
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* View Tab 4: Promo Coupons Creator */}
            {activeTab === 'coupons' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                
                {/* Coupon Form Creator */}
                <div className="bg-gray-50 border border-gray-150 p-5 rounded-3xl space-y-4 text-xs">
                  <h4 className="font-display font-black text-brand-dark uppercase tracking-wider flex items-center gap-1"><Plus className="w-4 h-4 text-brand-green" /> Create Promo Coupon</h4>
                  <form onSubmit={handleAddCoupon} className="space-y-3.5">
                    <div>
                      <label className="block font-bold text-gray-500 mb-1">Coupon Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. MEGAWEEKEND"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-brand-dark font-black uppercase"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-500 mb-1">Discount Type</label>
                        <select
                          value={couponType}
                          onChange={(e) => setCouponType(e.target.value as any)}
                          className="w-full border border-gray-200 bg-white rounded-xl px-2 py-2 text-brand-dark font-semibold focus:outline-hidden"
                        >
                          <option value="percentage">Percent (%)</option>
                          <option value="fixed">Fixed Flat (₹)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-500 mb-1">Value</label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={couponVal}
                          onChange={(e) => setCouponVal(+e.target.value)}
                          className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-brand-dark font-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-500 mb-1">Min. Order Limit (₹)</label>
                      <input
                        type="number"
                        required
                        min={100}
                        value={couponMinVal}
                        onChange={(e) => setCouponMinVal(+e.target.value)}
                        className="w-full border border-gray-200 bg-white rounded-xl px-3 py-2 text-brand-dark font-black"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-black py-2.5 rounded-xl transition-all cursor-pointer shadow-xs uppercase tracking-wide"
                    >
                      PUBLISH PROMO CODE
                    </button>
                  </form>
                </div>

                {/* Coupon Directory list */}
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Published Depot Coupons</h4>
                  <div className="bg-white border border-gray-150 rounded-2xl divide-y divide-gray-150 overflow-hidden">
                    {localCoupons.map((c) => (
                      <div key={c.code} className="p-3.5 flex items-center justify-between text-xs hover:bg-gray-50/40">
                        <div className="text-left space-y-0.5">
                          <span className="font-black text-brand-green bg-brand-green-light px-2 py-0.5 rounded-md text-3xs uppercase tracking-wider">{c.code}</span>
                          <p className="font-bold text-brand-dark mt-1">{c.description}</p>
                          <p className="text-4xs text-gray-400 font-semibold uppercase">MINIMUM BASKET THRESHOLD: ₹{c.minOrderValue}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteCoupon(c.code)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
