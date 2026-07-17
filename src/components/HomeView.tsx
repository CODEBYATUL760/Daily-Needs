import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { ProductCard } from "./ProductCard";
import { 
  Percent, ChevronLeft, ChevronRight, Zap, Sparkles, 
  ArrowRight, ShieldCheck, Heart, Star, ChevronDown, CheckCircle 
} from "lucide-react";

export const HomeView: React.FC = () => {
  const { 
    products, setPage, setSelectedCategory, recentlyViewed 
  } = useStore();

  const [activeHero, setActiveHero] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsSubscribed, setNewsSubscribed] = useState(false);

  // FAQ Accordion State
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(null);

  // Filters for dynamic sections
  const flashSaleItems = products.filter((p) => p.discount >= 25).slice(0, 4);
  const bestsellerItems = products.filter((p) => p.bestseller).slice(0, 4);
  const trendingItems = products.filter((p) => p.trending).slice(0, 4);
  const featuredItems = products.filter((p) => p.featured).slice(0, 4);

  // List of 20 categories with nice illustrative symbols/emojis
  const CATEGORY_ICONS: Record<string, string> = {
    Rice: "🌾", Atta: "🍞", Pulses: "🍲", Oils: "🏺", Spices: "🌶️",
    Tea: "☕", Coffee: "🥤", Sugar: "🍬", Salt: "🧂", Snacks: "🍪",
    Chocolates: "🍫", Beverages: "🍹", "Frozen Food": "❄️", "Dry Fruits": "🌰",
    "Personal Care": "🧴", "Baby Care": "🍼", "Cleaning Supplies": "🧹",
    "Kitchen Essentials": "🍳", "Pet Care": "🐕", Stationery: "✏️",
  };

  const HERO_SLIDES = [
    {
      badge: "MONSOON SAVINGS FESTIVAL",
      title: "Fresh Groceries Delivered in 20-45 Mins!",
      desc: "Get premium staples, fresh dairy, household essentials, and snacks straight from Rajesh Sharma's Daily Needs hub in Bhopal.",
      bg: "from-emerald-900 to-emerald-600",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600",
      link: "WELCOME50"
    },
    {
      badge: "FLAT ₹200 OFF ON LARGE ORDERS",
      title: "Save Big with Super Needs Deals",
      desc: "Stock up your pantry today! Free delivery on orders above ₹2,000. Use coupon code SUPERNEEDS during checkout.",
      bg: "from-neutral-900 to-teal-800",
      image: "https://images.unsplash.com/photo-1606923829579-0ac984c55d03?auto=format&fit=crop&q=80&w=600",
      link: "SUPERNEEDS"
    }
  ];

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setPage("Categories");
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsSubscribed(true);
      setNewsletterEmail("");
    }
  };

  const FAQS = [
    { q: "What is the minimum order value at Daily Needs?", a: "To ensure fast and reliable delivery across Bhopal, our minimum order value is ₹1,000. Checkout will be disabled if your cart subtotal is lower than this amount." },
    { q: "How much are the delivery charges?", a: "Daily Needs offers Free Delivery on all orders above ₹2,000. For orders between ₹1,000 and ₹2,000, we apply a nominal delivery fee of ₹100." },
    { q: "What is the delivery radius for the Bhopal store?", a: "We deliver express groceries to all locations within a 10 KM radius of our store at 123 Main Market, Bhopal, Madhya Pradesh." },
    { q: "Which payment methods are accepted?", a: "We accept Cash on Delivery (COD) as well as all digital instant UPI payments (Paytm, PhonePe, Google Pay) directly to our delivery executives upon arrival." }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* 1. Hero Carousel */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r text-white">
        <div className={`p-8 md:p-12 lg:p-16 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-r ${HERO_SLIDES[activeHero].bg}`}>
          
          <div className="space-y-4 max-w-xl">
            <span className="bg-yellow-400 text-neutral-900 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit">
              {HERO_SLIDES[activeHero].badge}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              {HERO_SLIDES[activeHero].title}
            </h1>
            <p className="text-sm text-neutral-100 font-medium leading-relaxed opacity-90">
              {HERO_SLIDES[activeHero].desc}
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => { setSelectedCategory(null); setPage("Categories"); }}
                className="px-6 py-3 bg-white text-emerald-800 font-extrabold rounded-xl shadow-md hover:bg-neutral-50 transition-all flex items-center gap-1.5"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="px-5 py-3 border border-white/20 bg-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm">
                <span>Coupon:</span>
                <strong className="text-yellow-300 font-mono">{HERO_SLIDES[activeHero].link}</strong>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 h-56 rounded-2xl overflow-hidden shadow-inner shrink-0 relative border border-white/10">
            <img src={HERO_SLIDES[activeHero].image} alt="Hero grocery banner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>

        </div>

        {/* Carousel controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button onClick={() => setActiveHero((activeHero + 1) % HERO_SLIDES.length)} className="p-2 bg-white/10 text-white hover:bg-white/30 rounded-xl">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setActiveHero((activeHero + 1) % HERO_SLIDES.length)} className="p-2 bg-white/10 text-white hover:bg-white/30 rounded-xl">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Circle Categories Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-xl font-extrabold text-neutral-800 dark:text-white">Shop by Category</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Explore our wide selection of 250+ premium groceries</p>
          </div>
          <button onClick={() => { setSelectedCategory(null); setPage("Categories"); }} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5">
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
            <div
              key={cat}
              onClick={() => handleSelectCategory(cat)}
              className="group flex flex-col items-center text-center p-3 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-800 cursor-pointer hover:shadow-md hover:border-emerald-100 dark:hover:border-neutral-700 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-neutral-700 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                {icon}
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-neutral-700 dark:text-neutral-200 mt-2 truncate w-full">
                {cat}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Flash Sale (Great Deals) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
          <h2 className="text-xl font-extrabold text-neutral-800 dark:text-white">Flash Saver Deals</h2>
          <span className="bg-rose-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse ml-1">25%+ OFF</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {flashSaleItems.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>

      {/* 4. Best Sellers */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <h2 className="text-xl font-extrabold text-neutral-800 dark:text-white">Store Bestsellers</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestsellerItems.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>

      {/* 5. Trending Products */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-neutral-800 dark:text-white">Trending in Bhopal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingItems.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>

      {/* 6. Featured Products */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-neutral-800 dark:text-white">Featured Selections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredItems.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>

      {/* 7. Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="space-y-4 p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-800/20 border border-neutral-100 dark:border-neutral-800">
          <h2 className="text-lg font-bold text-neutral-800 dark:text-white">Recently Viewed Items</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
              .filter((p) => recentlyViewed.includes(p.id))
              .slice(0, 4)
              .map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
          </div>
        </div>
      )}

      {/* 8. Customer Reviews */}
      <div className="bg-white dark:bg-neutral-800/40 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800/50">
        <h2 className="text-xl font-extrabold text-neutral-800 dark:text-white text-center">What Bhopal Shoppers Say</h2>
        <p className="text-xs text-neutral-400 text-center mt-1">Real ratings from authentic Daily Needs shoppers</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { name: "Siddharth Jain", location: "Arera Colony, Bhopal", text: "Daily Needs has changed my grocery shopping routine completely! Basmati Rice and staples are extremely premium and always arrive within 30 minutes. High discounts make it cheaper than physical supermarkets.", stars: 5 },
            { name: "Anjali Gupta", location: "Kolar Road, Bhopal", text: "We ordered Surf Excel and cleaning supplies along with Amul milk last Sunday. Delivering everything in 20 minutes under heavy rain is highly commendable. Rajesh Sharma is doing a stellar job with support!", stars: 5 },
            { name: "Vikram Singh", location: "Indrapuri, Bhopal", text: "The unpolished Toor Dal is genuinely unpolished and cooks beautifully. Their coupon engine is extremely friendly and checkout processes are secure. Minimum order ₹1,000 threshold is totally worth the quality.", stars: 5 }
          ].map((rev, i) => (
            <div key={i} className="p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 text-xs font-medium space-y-3">
              <div className="flex gap-1">
                {[...Array(rev.stars)].map((_, sIdx) => (
                  <Star key={sIdx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-neutral-600 dark:text-neutral-300 italic leading-relaxed">"{rev.text}"</p>
              <div>
                <p className="font-extrabold text-neutral-800 dark:text-neutral-100">{rev.name}</p>
                <p className="text-[10px] text-neutral-400 font-mono">{rev.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 9. FAQs */}
      <div className="space-y-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-extrabold text-neutral-800 dark:text-white text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
              <button
                onClick={() => setFaqOpenIdx(faqOpenIdx === i ? null : i)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-neutral-800 dark:text-neutral-100 flex justify-between items-center"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${faqOpenIdx === i ? "rotate-180" : ""}`} />
              </button>
              {faqOpenIdx === i && (
                <div className="px-4 pb-4 text-xs text-neutral-500 leading-relaxed border-t border-neutral-50 dark:border-neutral-700/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 10. Newsletter */}
      <div className="p-8 md:p-12 rounded-3xl bg-emerald-500 text-white text-center relative overflow-hidden shadow-lg shadow-emerald-500/20">
        <div className="max-w-xl mx-auto space-y-4 relative z-10">
          <h2 className="text-2xl font-black">Subscribe to our Newsletter</h2>
          <p className="text-xs text-emerald-100 font-medium">Receive weekly Bhopal-exclusive deals, discount coupons, and fresh stock alerts instantly.</p>
          
          {newsSubscribed ? (
            <div className="bg-white/10 border border-white/20 p-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold animate-in zoom-in-50">
              <CheckCircle className="w-5 h-5 text-yellow-300" />
              <span>Thank you! You have been successfully subscribed to Daily Needs letters.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-3 bg-white text-neutral-800 border-none rounded-xl text-xs font-semibold placeholder-neutral-400 focus:outline-none"
              />
              <button type="submit" className="px-6 py-3 bg-neutral-900 hover:bg-black text-white font-black rounded-xl text-xs transition-colors">
                Subscribe
              </button>
            </form>
          )}
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-emerald-600/50 rounded-full blur-xl pointer-events-none" />
      </div>

    </div>
  );
};
