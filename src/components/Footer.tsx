import React, { useState } from 'react';
import { ShieldCheck, Truck, RefreshCw, Sparkles, Send, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-brand-dark text-gray-300 mt-16 border-t-4 border-brand-green" id="main-footer">
      {/* Quality Guarantees Banner */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center p-4">
            <div className="bg-brand-green-light/10 p-3 rounded-full mb-3">
              <Truck className="w-8 h-8 text-brand-green" />
            </div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Superfast 10-Min Delivery</h4>
            <p className="text-xs text-gray-400 mt-1">Sourced from your local dark store and dispatched immediately for peak freshness.</p>
          </div>
          <div className="flex flex-col items-center p-4 border-y md:border-y-0 md:border-x border-gray-800">
            <div className="bg-brand-green-light/10 p-3 rounded-full mb-3">
              <RefreshCw className="w-8 h-8 text-brand-green" />
            </div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">No Questions Asked Returns</h4>
            <p className="text-xs text-gray-400 mt-1">Not satisfied with the quality? Return at delivery time for full, instant cash refunds.</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="bg-brand-green-light/10 p-3 rounded-full mb-3">
              <ShieldCheck className="w-8 h-8 text-brand-green" />
            </div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">100% Quality Assurance</h4>
            <p className="text-xs text-gray-400 mt-1">Double-checked at our sorting depots. Only the best-rated crops make the basket.</p>
          </div>
        </div>
      </div>

      {/* Main Directory Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Information & Contacts */}
        <div className="flex flex-col gap-4 text-left">
          <div className="flex items-center gap-1">
            <div className="yellow-gradient p-1.5 rounded-lg shadow-xs">
              <Sparkles className="w-4 h-4 text-brand-green-dark" />
            </div>
            <span className="font-display font-black text-xl tracking-tight text-white">DAILY <span className="text-brand-green">NEEDS</span></span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your premium commercial-quality neighborhood supermarket, delivering fresh fruits, organic vegetables, dairy, household goods, and bakery essentials within minutes.
          </p>
          <div className="space-y-2 pt-2 text-xs text-gray-400">
            <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-brand-green" /> 1800-300-4567 (toll-free)</p>
            <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-brand-green" /> support@dailyneeds.com</p>
            <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-brand-green" /> Depot House, Level 4, Bandra West, Mumbai 400050</p>
          </div>
        </div>

        {/* Categories Directory */}
        <div className="text-left">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-brand-green pl-2">Top Categories</h4>
          <ul className="space-y-2 text-xs text-gray-400 font-medium">
            <li><a href="#" className="hover:text-brand-green transition-colors">Fresh Fruits & Vegetables</a></li>
            <li><a href="#" className="hover:text-brand-green transition-colors">Milk, Butter & Paneer</a></li>
            <li><a href="#" className="hover:text-brand-green transition-colors">Tea, Coffee & Instant Beverages</a></li>
            <li><a href="#" className="hover:text-brand-green transition-colors">Rice, Wheat Atta & Pulses</a></li>
            <li><a href="#" className="hover:text-brand-green transition-colors">Crispy Snacks, Namkeen & Biscuits</a></li>
          </ul>
        </div>

        {/* Quick Links Directory */}
        <div className="text-left">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-brand-green pl-2">Customer Service</h4>
          <ul className="space-y-2 text-xs text-gray-400 font-medium">
            <li><a href="#" className="hover:text-brand-green transition-colors">Track Your Order</a></li>
            <li><a href="#" className="hover:text-brand-green transition-colors">Return Policy & Process</a></li>
            <li><a href="#" className="hover:text-brand-green transition-colors">FAQs & Support Helpdesk</a></li>
            <li><a href="#" className="hover:text-brand-green transition-colors">Contact Our Depot Manager</a></li>
            <li><a href="#" className="hover:text-brand-green transition-colors">Pincode Eligibility list</a></li>
          </ul>
        </div>

        {/* Newsletter subscription */}
        <div className="text-left flex flex-col gap-4">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider border-l-2 border-brand-green pl-2">Weekly Restocking Coupons</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Subscribe to receive exclusive deals, flash sale announcements, and flat 15% discount coupon codes!
          </p>
          <form onSubmit={handleSubscribe} className="flex bg-gray-800 rounded-xl p-1 shadow-inner">
            <input
              type="email"
              placeholder="your.email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent w-full px-3 py-2 text-xs focus:outline-hidden text-white font-medium placeholder-gray-500"
              required
            />
            <button type="submit" className="bg-brand-green hover:bg-brand-green-dark p-2 rounded-lg text-white transition-colors cursor-pointer">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          {isSubscribed && (
            <span className="text-xs text-brand-green flex items-center gap-1.5 font-semibold animate-pulse">
              <CheckCircle className="w-4 h-4" /> Subscription confirmed! Check your inbox.
            </span>
          )}
        </div>
      </div>

      {/* Under copyright, licenses, security seals */}
      <div className="bg-[#0f0f0f] py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-900 text-center text-xs text-gray-500 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Daily Needs Retail Pvt. Ltd. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 text-3xs font-bold uppercase tracking-widest">
            <span className="hover:underline cursor-pointer">Security Certifications</span>
            <span>|</span>
            <span className="hover:underline cursor-pointer">Terms & Conditions</span>
            <span>|</span>
            <span className="hover:underline cursor-pointer">FSSAI Licence No: 10022022000450</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
