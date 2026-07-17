import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { 
  Compass, ArrowRight, Truck, CheckCircle, Package, 
  MapPin, Phone, MessageSquare, ShieldCheck, Heart, AlertCircle
} from "lucide-react";

export const TrackView: React.FC = () => {
  const { orders } = useStore();
  const [trackIdInput, setTrackIdInput] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Get default order to display (most recent)
  const defaultOrder = orders.length > 0 ? orders[orders.length - 1] : null;
  const currentOrder = searchedOrder || defaultOrder;

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSearchedOrder(null);

    if (!trackIdInput.trim()) return;

    const found = orders.find((o) => o.id.toLowerCase() === trackIdInput.trim().toLowerCase());
    if (found) {
      setSearchedOrder(found);
    } else {
      setErrorMsg(`We couldn't locate any order with ID "${trackIdInput}". Double-check your invoice or place a new test order!`);
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "Placed": return 1;
      case "Processed": return 2;
      case "Out for Delivery": return 3;
      case "Delivered": return 4;
      default: return 1;
    }
  };

  const currentStep = currentOrder ? getStepIndex(currentOrder.orderStatus) : 0;

  const steps = [
    { label: "Placed", desc: "Order received & verified by Rajesh Sharma.", time: "Just now" },
    { label: "Processed", desc: "Staples packed & loaded into delivery vehicle.", time: "10 mins ago" },
    { label: "Out for Delivery", desc: "Rider navigating Bhopal express radius.", time: "20 mins ago" },
    { label: "Delivered", desc: "Groceries handed over. Thank you!", time: "Arrived!" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <h1 className="text-2xl font-black text-neutral-800 dark:text-white">Track Your Order</h1>
        <p className="text-xs text-neutral-400 mt-1">Get live transit telemetry for your Bhopal grocery deliveries.</p>
      </div>

      {/* Tracker search block */}
      <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm space-y-4 max-w-lg mx-auto">
        <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">Telemetry Lookup</h3>
        <form onSubmit={handleTrackSearch} className="flex gap-2 text-xs font-medium">
          <input
            type="text"
            placeholder="Enter Order ID (e.g., DN-12345)"
            value={trackIdInput}
            onChange={(e) => setTrackIdInput(e.target.value)}
            className="flex-1 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3.5 py-2.5 font-bold uppercase focus:outline-none"
          />
          <button type="submit" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-md transition-colors flex items-center gap-1">
            <span>Track</span>
            <Compass className="w-4 h-4" />
          </button>
        </form>
        {errorMsg && (
          <p className="text-[10px] font-bold text-rose-500 flex items-start gap-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </p>
        )}
      </div>

      {currentOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Timeline Tracking (2 cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-50 dark:border-neutral-700/50 pb-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Order Reference</span>
                <p className="text-lg font-black text-neutral-800 dark:text-white font-mono">{currentOrder.id}</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Current Status</span>
                <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{currentOrder.orderStatus}</p>
              </div>
            </div>

            {/* Visual Timeline Steps */}
            <div className="relative pl-8 space-y-10">
              {/* Vertical indicator line */}
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-neutral-100 dark:bg-neutral-700" />

              {steps.map((step, idx) => {
                const stepNum = idx + 1;
                const isCompleted = currentStep >= stepNum;
                const isCurrent = currentStep === stepNum;

                return (
                  <div key={idx} className="relative flex flex-col sm:flex-row sm:justify-between gap-2 text-xs">
                    {/* Circle */}
                    <div className={`absolute -left-[27px] w-5 h-5 rounded-full flex items-center justify-center border-2 shadow-sm transition-all ${
                      isCompleted 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-300"
                    }`}>
                      {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full" />}
                    </div>

                    <div className="space-y-1 max-w-sm">
                      <h4 className={`font-bold ${isCompleted ? "text-neutral-800 dark:text-white" : "text-neutral-400"}`}>
                        {step.label}
                        {isCurrent && <span className="ml-2 px-2 py-0.5 bg-yellow-400 text-neutral-900 font-extrabold text-[8px] rounded-full uppercase tracking-wider animate-pulse">Live</span>}
                      </h4>
                      <p className={`text-[11px] ${isCompleted ? "text-neutral-500" : "text-neutral-400/60"}`}>{step.desc}</p>
                    </div>

                    {isCompleted && (
                      <span className="text-[10px] text-neutral-400 font-mono text-left sm:text-right shrink-0">
                        {step.time}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer support and order metrics (1 col) */}
          <div className="space-y-6">
            
            {/* Delivery parameters */}
            <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm space-y-4 text-xs font-medium">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-widest">Delivery Parameters</h3>
              
              <div className="space-y-3">
                <div className="flex gap-2.5 items-start">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className="font-bold text-neutral-800 dark:text-neutral-200">Shipping Address</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {currentOrder.customerDetails.address}, Bhopal ({currentOrder.customerDetails.pincode})
                    </p>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <p className="font-bold text-neutral-800 dark:text-neutral-200">Customer Phone</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{currentOrder.customerDetails.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct support dispatch buttons */}
            <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm space-y-4 text-xs font-medium">
              <div>
                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 uppercase tracking-widest">Support Helpline</h3>
                <p className="text-[10px] text-neutral-400 mt-1">Need help? Connect instantly with Rajesh Sharma's support team.</p>
              </div>

              <div className="space-y-2">
                <a
                  href="tel:+919876543210"
                  className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>Call +91 9876543210</span>
                </a>
                <a
                  href={`https://wa.me/919876543210?text=Hi%20Rajesh%20Sharma,%20I'd%20like%20to%20query%20order%20status%20for%20${currentOrder.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 dark:text-emerald-400 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  <span>WhatsApp Live Chat</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="text-center py-16 max-w-sm mx-auto space-y-4">
          <div className="w-20 h-20 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 mx-auto">
            <Truck className="w-10 h-10" />
          </div>
          <h2 className="text-lg font-bold text-neutral-800 dark:text-white">No active orders tracking</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            There are no recent orders in your history yet. Fill your basket and order staples to launch express transit tracking.
          </p>
        </div>
      )}

    </div>
  );
};
