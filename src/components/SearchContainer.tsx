/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Product } from '../types';

interface SearchContainerProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSearchSubmit: (query: string) => void;
  onClose?: () => void;
}

const POPULAR_SEARCHES = ['Amul Milk', 'Aashirvaad Atta', 'Lays Chips', 'Ghee', 'Fresh Onion', 'Coca-Cola', 'Dettol Handwash'];

export default function SearchContainer({ products, onSelectProduct, onSearchSubmit, onClose }: SearchContainerProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('dn_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  useEffect(() => {
    // Perform instant autocomplete and suggestions
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const cleanedQuery = query.toLowerCase().trim();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(cleanedQuery) ||
      p.brand.toLowerCase().includes(cleanedQuery) ||
      p.category.toLowerCase().includes(cleanedQuery) ||
      p.subcategory.toLowerCase().includes(cleanedQuery)
    );

    // Limit to top 6 for autocomplete
    setSuggestions(filtered.slice(0, 6));
  }, [query, products]);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveSearchQuery = (q: string) => {
    const term = q.trim();
    if (!term) return;

    let updated = [term, ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())];
    updated = updated.slice(0, 5); // Keep top 5
    setRecentSearches(updated);
    localStorage.setItem('dn_recent_searches', JSON.stringify(updated));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveSearchQuery(query);
    onSearchSubmit(query);
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handlePopularClick = (term: string) => {
    setQuery(term);
    saveSearchQuery(term);
    onSearchSubmit(term);
    setIsOpen(false);
    if (onClose) onClose();
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('dn_recent_searches');
  };

  const handleSuggestionClick = (product: Product) => {
    saveSearchQuery(product.name);
    onSelectProduct(product);
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for bread, milk, chips, fresh veggies..."
          className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm pl-11 pr-10 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all shadow-xs"
        />
        <Search className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
        
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Instant Dropdown Suggestions Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 overflow-hidden divide-y divide-gray-100">
          
          {/* Default view when query is empty */}
          {!query.trim() && (
            <div className="p-4 space-y-4">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Recent Searches</span>
                    <button 
                      onClick={clearRecentSearches}
                      className="hover:text-emerald-600 font-bold tracking-tight cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handlePopularClick(term)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 text-xs font-medium rounded-lg border border-gray-100 transition-colors cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Popular Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePopularClick(term)}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 text-xs font-medium rounded-lg border border-gray-100 transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Matches / Suggestions */}
          {query.trim() && suggestions.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Products</span>
                <span className="text-[10px] text-gray-400 font-normal">Press Enter to search all</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-[380px] overflow-y-auto">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSuggestionClick(product)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50/80 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.images.main} 
                        alt={product.name} 
                        className="w-10 h-10 object-cover rounded-lg border border-gray-100 bg-gray-50"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs font-semibold text-emerald-600">{product.brand}</div>
                        <div className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</div>
                        <div className="text-xs text-gray-400">{product.weight}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">₹{product.price}</div>
                        {product.discount > 0 && (
                          <div className="text-[10px] text-emerald-600 font-semibold">Save ₹{product.saveAmount}</div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results instant panel */}
          {query.trim() && suggestions.length === 0 && (
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">No matching items found</p>
                <p className="text-xs text-gray-400 mt-1">Try typing a brand, category name, or generic food item.</p>
              </div>
              <div className="pt-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {POPULAR_SEARCHES.slice(0, 4).map((term, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePopularClick(term)}
                      className="px-2.5 py-1 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 text-gray-500 hover:text-emerald-800 text-xs rounded-md border border-gray-100 transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
