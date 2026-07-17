import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/products';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// Category emojis for quick, beautiful representations
const CATEGORY_EMOJIS: Record<string, string> = {
  'Fruits': '🍎',
  'Vegetables': '🥦',
  'Dairy': '🥛',
  'Bread': '🍞',
  'Bakery': '🥐',
  'Rice': '🌾',
  'Atta': '🌾',
  'Flour': '🥣',
  'Pulses': '🫘',
  'Oil': '🫗',
  'Ghee': '🏺',
  'Tea': '🍵',
  'Coffee': '☕',
  'Sugar': '🍬',
  'Salt': '🧂',
  'Spices': '🌶️',
  'Snacks': '🍟',
  'Biscuits': '🍪',
  'Chocolates': '🍫',
  'Namkeen': '🥨',
  'Instant Food': '🥫',
  'Noodles': '🍜',
  'Sauces': '🍯',
  'Cold Drinks': '🥤',
  'Juices': '🧃',
  'Water': '💧',
  'Frozen Food': '❄️',
  'Ice Cream': '🍨',
  'Dry Fruits': '🌰',
  'Personal Care': '🧼',
  'Baby Care': '👶',
  'Cleaning Supplies': '🧹',
  'Kitchen Essentials': '🧽',
  'Stationery': '✏️',
  'Pet Care': '🐶',
};

export default function CategoryNav({ selectedCategory, onSelectCategory }: CategoryNavProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 250;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 select-none" id="category-scroller">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-black text-lg sm:text-xl text-brand-dark tracking-tight">Shop by Category</h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScroll('left')}
            className="p-1.5 bg-white border border-gray-200 hover:border-brand-green rounded-full shadow-xs text-gray-600 transition-colors hover:text-brand-green cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-1.5 bg-white border border-gray-200 hover:border-brand-green rounded-full shadow-xs text-gray-600 transition-colors hover:text-brand-green cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-2.5 overflow-x-auto scrollbar-none pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* 'All' category option */}
        <button
          onClick={() => onSelectCategory('All')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'All'
              ? 'bg-brand-green border-brand-green text-white shadow-md'
              : 'bg-white border-gray-200 text-gray-700 hover:border-brand-green hover:bg-brand-green-light/20'
          }`}
        >
          <span>🛒</span>
          <span>All Items</span>
        </button>

        {CATEGORIES.map((cat) => {
          const emoji = CATEGORY_EMOJIS[cat] || '📦';
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-brand-green border-brand-green text-white shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-brand-green hover:bg-brand-green-light/20'
              }`}
            >
              <span className="text-sm">{emoji}</span>
              <span>{cat}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
