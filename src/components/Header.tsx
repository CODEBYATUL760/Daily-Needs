import React, { useState, useEffect, useRef } from "react";
import { useStore } from "../context/StoreContext";
import { 
  Search, ShoppingCart, Heart, Sun, Moon, User, Phone, PhoneCall, 
  Menu, X, MessageSquareCode, Mic, MapPin, Sparkles, ChevronRight, BarChart3
} from "lucide-react";

export const Header: React.FC = () => {
  const {
    page, setPage,
    cart, wishlist,
    user, logout,
    darkMode, toggleDarkMode,
    searchQuery, setSearchQuery,
    setSelectedCategory,
    products, setSelectedProductId
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Cart quantity count
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter search suggestions in real-time
  const searchSuggestions = searchQuery.trim()
    ? products
        .filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Voice Search simulation
  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice search is not supported in this browser. Please type your query.");
      return;
    }

    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setSearchQuery(speechToText);
      setPage("Categories");
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const selectSuggestion = (id: string) => {
    setSelectedProductId(id);
    setPage("Details");
    setShowSearchSuggestions(false);
    setSearchQuery("");
  };

  return (
    <>
      {/* Promo Bar */}
      <div id="promo-bar" className="bg-emerald-600 dark:bg-emerald-700 text-white text-xs py-2 px-4 font-medium flex justify-between items-center z-50 relative">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 animate-bounce" />
          <span>Delivering in Bhopal within <strong>20-45 Mins</strong> (Radius 10 KM)</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" /> Call Support: <strong>+91 9876543210</strong>
          </span>
          <span>⚡ Min Order ₹1,000 | Free Delivery above ₹2,000</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header id="main-header" className="sticky top-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-sm border-b border-neutral-100 dark:border-neutral-800 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => { setPage("Home"); setSelectedCategory(null); }}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                Daily Needs
              </span>
              <p className="text-[10px] text-neutral-400 font-mono tracking-widest leading-none">BHOPAL STORE</p>
            </div>
          </div>

          {/* Smart Search Bar */}
          <div ref={searchRef} className="hidden md:block relative flex-1 max-w-xl z-50">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search 250+ grocery items (e.g., Basmati, Soya Oil, Amul Milk)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setPage("Categories");
                    setShowSearchSuggestions(false);
                  }
                }}
                className="w-full pl-10 pr-12 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              <button
                onClick={handleVoiceSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 rounded-full transition-colors"
                title="Voice Search"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 overflow-hidden z-50 animate-in fade-in-50 duration-150">
                <div className="p-2 border-b border-neutral-50 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 flex justify-between items-center">
                  <span className="text-xs text-neutral-400 font-medium px-2">Matches Found</span>
                  <span className="text-[10px] text-emerald-500 font-medium px-2 cursor-pointer hover:underline" onClick={() => { setPage("Categories"); setShowSearchSuggestions(false); }}>
                    View All {searchSuggestions.length} items
                  </span>
                </div>
                <div className="divide-y divide-neutral-50 dark:divide-neutral-700 max-h-80 overflow-y-auto">
                  {searchSuggestions.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => selectSuggestion(prod.id)}
                      className="p-3 hover:bg-emerald-50/50 dark:hover:bg-neutral-700/50 flex items-center gap-3 cursor-pointer transition-colors"
                    >
                      <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border border-neutral-100 dark:border-neutral-700" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{prod.brand}</p>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate">{prod.name}</p>
                        <p className="text-xs text-neutral-400">{prod.unit} • <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{prod.sellingPrice}</span> <span className="line-through text-[10px]">₹{prod.mrp}</span></p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Quick WhatsApp Support (Blinkit-style accessibility) */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 text-xs font-semibold hover:bg-green-100 dark:hover:bg-green-950/40 border border-green-200/50 dark:border-green-800/30 transition-all"
            >
              <MessageSquareCode className="w-3.5 h-3.5" />
              <span>WhatsApp Support</span>
            </a>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-xl transition-all"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Admin Dashboard Entry */}
            <button
              onClick={() => setPage("Admin")}
              className={`p-2 rounded-xl transition-all ${page === "Admin" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"}`}
              title="Admin Panel"
            >
              <BarChart3 className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setPage("Wishlist")}
              className="relative p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-xl transition-all"
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setPage("Cart")}
              className="relative p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center gap-2 font-bold shadow-md shadow-emerald-500/10 transition-all"
              title="My Cart"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              <span className="hidden sm:inline text-sm">{cartItemCount > 0 ? `${cartItemCount} Items` : "Cart"}</span>
              {cartItemCount > 0 && (
                <span className="sm:hidden absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-neutral-900 text-[10px] font-extrabold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            {user ? (
              <div className="relative group">
                <button
                  onClick={() => setPage("Dashboard")}
                  className="flex items-center gap-1.5 p-1.5 pr-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-100 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 transition-all"
                >
                  <div className="w-7 h-7 bg-emerald-500 text-white font-extrabold rounded-full flex items-center justify-center text-xs shadow-inner">
                    {user.name.substring(0, 1)}
                  </div>
                  <span className="hidden lg:inline text-xs font-semibold max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setPage("Login")}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search 250+ fresh products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage("Categories");
              }}
              className="w-full pl-9 pr-10 py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <button
              onClick={handleVoiceSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-4 space-y-3 shadow-lg z-40 absolute left-0 right-0 animate-in slide-in-from-top duration-200">
            <button
              onClick={() => { setPage("Home"); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex justify-between items-center"
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button
              onClick={() => { setPage("Categories"); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex justify-between items-center"
            >
              <span>Categories</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button
              onClick={() => { setPage("Wishlist"); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex justify-between items-center"
            >
              <span>Wishlist</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button
              onClick={() => { setPage("Cart"); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex justify-between items-center"
            >
              <span>Cart & Checkout</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            <button
              onClick={() => { setPage("Admin"); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex justify-between items-center"
            >
              <span>Admin Dashboard</span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
            {user ? (
              <>
                <button
                  onClick={() => { setPage("Dashboard"); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2.5 px-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex justify-between items-center"
                >
                  <span>My Dashboard</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2.5 px-3 hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/20 rounded-xl text-sm font-semibold flex justify-between items-center"
                >
                  <span>Sign Out</span>
                  <X className="w-4 h-4 text-rose-400" />
                </button>
              </>
            ) : (
              <button
                onClick={() => { setPage("Login"); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl text-center block"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </header>

      {/* Voice listening overlay */}
      {isListening && (
        <div className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-neutral-100 dark:border-neutral-700 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 animate-ping absolute inset-0 duration-1000" />
              <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl relative z-10 shadow-lg shadow-emerald-500/30">
                <Mic className="w-8 h-8" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">Listening to you...</h3>
              <p className="text-sm text-neutral-400 mt-2">Speak now. Try saying "Rice", "Pure Atta", "Amul" or "Chocolates"</p>
            </div>
            <button
              onClick={() => setIsListening(false)}
              className="px-6 py-2 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-full text-sm font-medium text-neutral-500 dark:text-neutral-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
