import React, { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { ProductCard } from "./ProductCard";
import { SlidersHorizontal, ChevronRight, LayoutGrid, ListFilter, Trash2, ShieldAlert } from "lucide-react";

export const CategoriesView: React.FC = () => {
  const {
    products,
    selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery
  } = useStore();

  const [priceRange, setPriceRange] = useState<number>(1000);
  const [sortOption, setSortOption] = useState<string>("popular");

  // Reset category lists
  const categoriesList = [
    "All Products",
    "Rice", "Atta", "Pulses", "Oils", "Spices",
    "Tea", "Coffee", "Sugar", "Salt", "Snacks",
    "Chocolates", "Beverages", "Frozen Food", "Dry Fruits",
    "Personal Care", "Baby Care", "Cleaning Supplies",
    "Kitchen Essentials", "Pet Care", "Stationery"
  ];

  // Reset filters if category changes
  useEffect(() => {
    setPriceRange(1200);
  }, [selectedCategory]);

  // Compute products count per category
  const getCategoryCount = (cat: string) => {
    if (cat === "All Products") return products.length;
    return products.filter((p) => p.category === cat).length;
  };

  // Filter & Sort core logic
  const filteredProducts = products
    .filter((p) => {
      // 1. Category Filter
      const matchesCategory = !selectedCategory || selectedCategory === "All Products" || p.category === selectedCategory;
      // 2. Search Query Filter
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.category.toLowerCase().includes(searchQuery.toLowerCase());
      // 3. Price Filter
      const matchesPrice = p.sellingPrice <= priceRange;

      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortOption === "cheapest") return a.sellingPrice - b.sellingPrice;
      if (sortOption === "expensive") return b.sellingPrice - a.sellingPrice;
      if (sortOption === "discount") return b.discount - a.discount;
      if (sortOption === "rating") return b.rating - a.rating;
      // default: popularity / random
      return b.bestseller === a.bestseller ? 0 : b.bestseller ? 1 : -1;
    });

  const clearAllFilters = () => {
    setSelectedCategory("All Products");
    setSearchQuery("");
    setPriceRange(1000);
    setSortOption("popular");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-300">
      
      {/* 1. Left Filters Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Category Selector Side-list */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-neutral-50 dark:border-neutral-700/50 pb-3">
            <ListFilter className="w-4.5 h-4.5 text-emerald-500" />
            <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-100">Category Filter</h3>
          </div>
          <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1 text-xs scrollbar-thin">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === "All Products" ? null : cat)}
                className={`w-full flex justify-between items-center px-3 py-2 rounded-xl font-bold transition-colors ${
                  (cat === "All Products" && !selectedCategory) || selectedCategory === cat
                    ? "bg-emerald-500 text-white"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                  (cat === "All Products" && !selectedCategory) || selectedCategory === cat
                    ? "bg-white/25 text-white"
                    : "bg-neutral-100 dark:bg-neutral-700 text-neutral-400"
                }`}>
                  {getCategoryCount(cat)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Price slider */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm text-xs font-medium space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-50 dark:border-neutral-700/50 pb-3">
            <SlidersHorizontal className="w-4.5 h-4.5 text-emerald-500" />
            <h3 className="text-sm font-extrabold text-neutral-800 dark:text-neutral-100">Price Budget</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-neutral-400 font-bold">
              <span>₹10</span>
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-black">Under ₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="20"
              max="1500"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={clearAllFilters}
          className="w-full py-3 border border-dashed border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 rounded-2xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          <Trash2 className="w-4 h-4 text-rose-500" />
          <span>Clear All Filters</span>
        </button>

      </div>

      {/* 2. Right Products Grid Panel */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Sorting header & Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-neutral-800 p-4 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
          <div className="text-xs text-neutral-400 font-medium">
            <span>Showing </span>
            <strong className="text-neutral-800 dark:text-white font-black">{filteredProducts.length}</strong>
            <span> products </span>
            {selectedCategory && (
              <span>in <strong className="text-emerald-600 dark:text-emerald-400 font-black">{selectedCategory}</strong></span>
            )}
            {searchQuery && (
              <span> matching "<strong className="text-neutral-800 dark:text-white font-bold">{searchQuery}</strong>"</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs shrink-0 font-medium text-neutral-500">
            <span>Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl p-2 font-bold text-neutral-700 dark:text-neutral-200 focus:outline-none"
            >
              <option value="popular">Popularity</option>
              <option value="cheapest">Cheapest First</option>
              <option value="expensive">Highest Price</option>
              <option value="discount">Biggest Discount</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-100 dark:border-neutral-800 py-16 px-6 flex flex-col items-center text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center text-neutral-400 mb-4 animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-neutral-800 dark:text-white">No Matching Products</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              We couldn't find any groceries matching your exact filter parameters. Try clearing your search query or adjusting your price budget slider.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-6 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
