import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Heart, RefreshCw, BarChart2, MessageSquare, MapPin, Sparkles, ChevronDown, Clock, X, Volume2, User } from 'lucide-react';
import { Product, CartItem } from '../types';
import { PRODUCTS } from '../data/products';

interface HeaderProps {
  cart: CartItem[];
  wishlist: Product[];
  compareList: Product[];
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onToggleAdmin: () => void;
  onToggleAi: () => void;
  onProductClick: (product: Product) => void;
  onSearch: (query: string, category: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isAdminOpen: boolean;
  isAiOpen: boolean;
}

export default function Header({
  cart,
  wishlist,
  compareList,
  onOpenCart,
  onOpenWishlist,
  onOpenCompare,
  onToggleAdmin,
  onToggleAi,
  onProductClick,
  onSearch,
  selectedCategory,
  onSelectCategory,
  isAdminOpen,
  isAiOpen
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [popularSearches] = useState(['Fresh Mango', 'Amul Butter', 'Whole Wheat Atta', 'Lay\'s', 'Organic Ghee', 'Milk']);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('search_history') || '[]');
  });
  const [pincode, setPincode] = useState('400001');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  const suggestionRef = useRef<HTMLDivElement>(null);

  // Filter products for suggestions based on query
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const filtered = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6);
    setSuggestions(filtered);
  }, [searchQuery]);

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent, forcedQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = forcedQuery !== undefined ? forcedQuery : searchQuery;
    onSearch(finalQuery, selectedCategory);
    setShowSuggestions(false);

    if (finalQuery.trim() && !searchHistory.includes(finalQuery.trim())) {
      const updated = [finalQuery.trim(), ...searchHistory].slice(0, 5);
      setSearchHistory(updated);
      localStorage.setItem('search_history', JSON.stringify(updated));
    }
  };

  const handleSuggestionClick = (product: Product) => {
    onProductClick(product);
    setSearchQuery(product.name);
    setShowSuggestions(false);
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory([]);
    localStorage.removeItem('search_history');
  };

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length === 6 && /^\d+$/.test(pinInput)) {
      setPincode(pinInput);
      setIsChangingPin(false);
    } else {
      alert('Please enter a valid 6-digit Pincode');
    }
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice Recognition is not supported in this browser. Please try Chrome or Safari.');
      return;
    }
    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setSearchQuery(speechToText);
      setIsListening(false);
      onSearch(speechToText, selectedCategory);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.product.sellingPrice * item.quantity), 0);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-200 shadow-xs" id="main-header">
      {/* Super Header Banner */}
      <div className="bg-brand-green-dark text-white text-xs py-1 px-4 flex justify-between items-center font-medium">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-brand-yellow animate-pulse" />
          <span>Super-fast 10-Minute Grocery Delivery across major locations!</span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span>Min. Order ₹100</span>
          <span>•</span>
          <span>Free delivery on orders above ₹500</span>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Pincode Selector */}
        <div className="flex items-center justify-between w-full md:w-auto gap-6">
          <button 
            onClick={() => { onSelectCategory('All'); onSearch('', 'All'); setSearchQuery(''); }}
            className="flex items-center gap-1 cursor-pointer select-none"
          >
            <div className="yellow-gradient p-2 rounded-xl shadow-xs">
              <Sparkles className="w-6 h-6 text-brand-green-dark" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display font-black text-2xl tracking-tight text-brand-green leading-none">DAILY</span>
              <span className="font-sans font-bold text-xs tracking-widest text-brand-dark leading-none">NEEDS</span>
            </div>
          </button>

          {/* Location / Pincode */}
          <div className="relative">
            {isChangingPin ? (
              <form onSubmit={handlePincodeSubmit} className="flex items-center gap-1 bg-white border border-brand-green rounded-lg p-1 shadow-xs">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Pincode"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-20 px-2 py-0.5 text-xs focus:outline-hidden font-medium"
                  autoFocus
                />
                <button type="submit" className="bg-brand-green text-white px-2 py-0.5 rounded text-xs hover:bg-brand-green-dark font-semibold">Save</button>
                <button type="button" onClick={() => setIsChangingPin(false)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
              </form>
            ) : (
              <button
                onClick={() => { setIsChangingPin(true); setPinInput(pincode); }}
                className="flex items-center gap-1 text-left hover:bg-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-brand-green" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-semibold flex items-center gap-0.5">
                    Deliver to <ChevronDown className="w-3 h-3" />
                  </span>
                  <span className="text-xs font-bold text-brand-dark">Mumbai {pincode}</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Search Engine */}
        <div className="relative w-full md:max-w-xl flex-1" ref={suggestionRef}>
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 rounded-2xl border border-gray-200 focus-within:border-brand-green focus-within:bg-white focus-within:shadow-md transition-all">
            <input
              type="text"
              placeholder="Search for vegetables, brand new dairy, cold drinks, fresh juices..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-transparent px-4 py-2.5 text-sm font-medium text-brand-dark focus:outline-hidden placeholder-gray-400"
            />
            <div className="flex items-center gap-2 pr-3">
              <button
                type="button"
                onClick={startVoiceSearch}
                className={`p-1.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'text-gray-500'}`}
                title="Voice Search"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button type="submit" className="p-1.5 bg-brand-green text-white rounded-xl hover:bg-brand-green-dark transition-colors cursor-pointer">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Search Suggestions & Popular History panel */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 p-4">
              {/* Voice Listening Mode */}
              {isListening && (
                <div className="py-4 text-center text-sm font-semibold text-brand-green flex items-center justify-center gap-2 animate-bounce">
                  <Volume2 className="w-5 h-5 animate-pulse" /> Listening... Speak naturally (e.g., "Amul Butter")
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 ? (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Matching Grocery Products</h4>
                  <div className="space-y-1 mb-4">
                    {suggestions.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSuggestionClick(p)}
                        className="w-full flex items-center justify-between p-2 hover:bg-brand-green-light rounded-xl transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-9 h-9 object-cover rounded-lg border border-gray-100" referrerPolicy="no-referrer" />
                          <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">{p.brand}</p>
                            <p className="text-sm font-semibold text-brand-dark leading-snug">{p.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-brand-green">₹{p.sellingPrice}</span>
                          <p className="text-3xs text-gray-400 line-through">₹{p.mrp}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchQuery.trim().length >= 2 ? (
                <div className="text-center py-4 text-sm font-medium text-gray-500">No exact product matched, press Enter to search broad catalog</div>
              ) : null}

              {/* Popular Searches */}
              <div className="mb-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Popular Searches</h4>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((ps) => (
                    <button
                      key={ps}
                      onClick={() => { setSearchQuery(ps); handleSearchSubmit(undefined, ps); }}
                      className="px-3 py-1 bg-gray-100 hover:bg-brand-green hover:text-white rounded-full text-xs font-medium text-gray-600 transition-colors cursor-pointer"
                    >
                      {ps}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Recent Searches</h4>
                    <button onClick={clearHistory} className="text-3xs font-bold text-red-500 uppercase tracking-wider hover:underline">Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {searchHistory.map((sh, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSearchQuery(sh); handleSearchSubmit(undefined, sh); }}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-600 transition-colors cursor-pointer"
                      >
                        {sh}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menu Controls Widget */}
        <div className="flex items-center gap-3 md:gap-4 justify-end w-full md:w-auto">
          {/* Admin Toggle */}
          <button
            onClick={onToggleAdmin}
            className={`p-2 rounded-xl transition-all cursor-pointer relative ${isAdminOpen ? 'bg-brand-green text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            title="Admin Dashboard"
          >
            <BarChart2 className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-green"></span>
            </span>
          </button>

          {/* AI Shopping Assistant Toggle */}
          <button
            onClick={onToggleAi}
            className={`p-2 rounded-xl transition-all cursor-pointer relative ${isAiOpen ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-600 hover:bg-indigo-50 bg-indigo-50/50'}`}
            title="AI Shopping Assistant"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          </button>

          {/* Comparison */}
          <button
            onClick={onOpenCompare}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer relative"
            title="Compare Products"
          >
            <RefreshCw className="w-5 h-5" />
            {compareList.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-yellow text-brand-dark text-4xs font-black rounded-full h-4 w-4 flex items-center justify-center border border-white">
                {compareList.length}
              </span>
            )}
          </button>

          {/* Wishlist */}
          <button
            onClick={onOpenWishlist}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer relative"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-4xs font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Widget */}
          <button
            onClick={onOpenCart}
            className="bg-brand-green hover:bg-brand-green-dark text-white pl-3.5 pr-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer border border-brand-green-dark"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-yellow text-brand-dark text-4xs font-black rounded-full h-4 w-4 flex items-center justify-center border border-brand-green">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="flex flex-col text-left font-semibold">
              <span className="text-[10px] uppercase tracking-wider text-brand-green-light leading-none">Your Cart</span>
              <span className="text-xs leading-tight">₹{cartTotal}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
