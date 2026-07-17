import React, { useEffect } from "react";
import { StoreProvider, useStore } from "./context/StoreContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProductCard } from "./components/ProductCard";
import { HomeView } from "./components/HomeView";
import { CategoriesView } from "./components/CategoriesView";
import { DetailsView } from "./components/DetailsView";
import { CartView } from "./components/CartView";
import { TrackView } from "./components/TrackView";
import { ProfileView } from "./components/ProfileView";
import { InfoViews } from "./components/InfoViews";
import { AdminDashboard } from "./components/AdminDashboard";
import { AiAssistant } from "./components/AiAssistant";
import { 
  CheckCircle, ArrowRight, Printer, Sparkles, 
  Trash2, Heart, ArrowUp, AlertCircle, ShieldCheck
} from "lucide-react";

const AppContent: React.FC = () => {
  const { 
    page, setPage, notifications, removeNotification, 
    wishlist, products, orders, activeOrderToTrack 
  } = useStore();

  // Scroll to top button helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Find most recent order for Success Invoice
  const lastOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors duration-300 font-sans">
      
      {/* 1. Universal Top Header */}
      <Header />

      {/* 2. Main Router View Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {(() => {
          switch (page) {
            case "Home":
              return <HomeView />;
            case "Categories":
              return <CategoriesView />;
            case "Details":
              return <DetailsView />;
            case "Cart":
              return <CartView />;
            case "Track":
              return <TrackView />;
            
            // Profile & Auth
            case "Login":
            case "Signup":
            case "Dashboard":
              return <ProfileView />;

            // Admin Panel
            case "Admin":
              return <AdminDashboard />;

            // Bookmarked Wishlist View
            case "Wishlist":
              return (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <h1 className="text-2xl font-black text-neutral-800 dark:text-white flex items-center gap-2">
                      <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Bookmarked Wishlist
                    </h1>
                    <p className="text-xs text-neutral-400 mt-1">Review items you've bookmarked. Add them to cart or clear list.</p>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="text-center py-16 max-w-sm mx-auto space-y-4">
                      <div className="w-20 h-20 bg-rose-50 dark:bg-neutral-900 rounded-full flex items-center justify-center text-rose-400 mx-auto">
                        <Heart className="w-10 h-10" />
                      </div>
                      <h2 className="text-lg font-bold text-neutral-800 dark:text-white">Your Wishlist is Empty</h2>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Tap the heart badge on any product card or details section to bookmark items for fast pantry ordering.
                      </p>
                      <button
                        onClick={() => setPage("Categories")}
                        className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                      >
                        Browse Groceries
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {products
                        .filter((p) => wishlist.includes(p.id))
                        .map((prod) => (
                          <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                  )}
                </div>
              );

            // Checkout Order Success page view
            case "Success":
              return (
                <div className="max-w-xl mx-auto bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">Bhopal Hub Express Order</span>
                    <h1 className="text-2xl font-black text-neutral-800 dark:text-white">Order Placed Successfully!</h1>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Thank you for choosing Daily Needs. Rajesh Sharma's dispatch team is already preparing your basket for express transport.
                    </p>
                  </div>

                  {lastOrder && (
                    <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-left text-xs font-medium space-y-3">
                      <div className="flex justify-between items-center border-b border-neutral-200/50 dark:border-neutral-800 pb-2.5">
                        <span className="text-neutral-400 font-bold">Order ID Reference</span>
                        <strong className="font-mono text-neutral-800 dark:text-white text-sm">{lastOrder.id}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Recipient Name</span>
                        <span className="text-neutral-800 dark:text-neutral-200 font-bold">{lastOrder.customerDetails.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Delivery Address</span>
                        <span className="text-neutral-800 dark:text-neutral-200 truncate max-w-[200px] font-bold">{lastOrder.customerDetails.address}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400">Payment Status</span>
                        <span className="text-emerald-600 font-extrabold">{lastOrder.paymentStatus} ({lastOrder.paymentMethod})</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-dashed pt-3 text-sm font-black text-neutral-900 dark:text-white">
                        <span>Invoice Total Amount</span>
                        <span>₹{lastOrder.total}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-3 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-xl text-xs font-extrabold text-neutral-500 dark:text-neutral-300 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Invoice Receipt</span>
                    </button>
                    <button
                      onClick={() => setPage("Track")}
                      className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Track Express Transit</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );

            // Information Subpages routing
            case "About":
              return <InfoViews subPage="About" />;
            case "Contact":
              return <InfoViews subPage="Contact" />;
            case "FAQ":
              return <InfoViews subPage="FAQ" />;
            case "Privacy":
              return <InfoViews subPage="Privacy" />;
            case "Refund":
              return <InfoViews subPage="Refund" />;
            case "Terms":
              return <InfoViews subPage="Terms" />;

            // Fallback for missing configurations
            default:
              return <InfoViews subPage="404" />;
          }
        })()}
      </main>

      {/* 3. Floating AI Assistant (Always active!) */}
      <AiAssistant />

      {/* 4. Scroll To Top Accessibility button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-24 right-6 w-11 h-11 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-300 rounded-full border border-neutral-100 dark:border-neutral-700 shadow-lg flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-all z-40"
        title="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      {/* 5. Notifications Toaster Overlay */}
      <div className="fixed bottom-6 left-6 z-50 space-y-2 max-w-sm w-[90%] sm:w-auto">
        {notifications.map((not) => (
          <div
            key={not.id}
            onClick={() => removeNotification(not.id)}
            className={`p-3 rounded-2xl border flex items-start gap-2.5 shadow-xl cursor-pointer text-xs font-medium animate-in slide-in-from-left-5 duration-200 ${
              not.type === "success" 
                ? "bg-emerald-500 text-white border-emerald-400" 
                : not.type === "warning"
                ? "bg-amber-500 text-neutral-900 border-amber-400"
                : "bg-neutral-900 text-white border-neutral-800"
            }`}
          >
            {not.type === "success" ? <CheckCircle className="w-4.5 h-4.5 shrink-0" /> : <AlertCircle className="w-4.5 h-4.5 shrink-0" />}
            <span className="flex-1 leading-relaxed">{not.message}</span>
          </div>
        ))}
      </div>

      {/* 6. Universal Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
