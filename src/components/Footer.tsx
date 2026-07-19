/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, HelpCircle, ShieldCheck, Truck, PhoneCall, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-900 pb-20 md:pb-0">
      
      {/* Upper features footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 border-b border-gray-900 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-start gap-3.5 text-left">
          <div className="w-10 h-10 rounded-xl bg-gray-900 text-emerald-500 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wide">2-Hour Express Delivery</h4>
            <p className="text-xs text-gray-500 mt-1">Get your daily staples, cooking oil, spices, and stationery items delivered right to your door within 2 hours.</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 text-left">
          <div className="w-10 h-10 rounded-xl bg-gray-900 text-emerald-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wide">Purity & Purity Guard</h4>
            <p className="text-xs text-gray-500 mt-1">We source directly from premium verified manufacturers to ensure 100% pure ghee, unpolished pulses, and genuine daily essentials.</p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 text-left">
          <div className="w-10 h-10 rounded-xl bg-gray-900 text-emerald-500 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wide">Friendly Local Call Desk</h4>
            <p className="text-xs text-gray-500 mt-1">Prefer to order over phone call? Reach out to our store manager directly, and we will build your basket manually!</p>
          </div>
        </div>
      </div>

      {/* Middle row details */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
        {/* Brand details */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <button 
            onClick={() => onNavigate('Home')}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-base shadow-md">
              DN
            </div>
            <span className="text-lg font-extrabold text-white tracking-tight">
              Daily<span className="text-emerald-500">Needs</span>
            </span>
          </button>
          <p className="text-xs text-gray-500 leading-relaxed">
            Your neighborhood premier online grocery platform. We bundle the best of Indian staples, cooking oils, premium spices, household cleaners, and stationery essentials into an efficient shopping experience.
          </p>
        </div>

        {/* Categories Link */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Popular Categories</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('Shop')} className="hover:text-emerald-500 transition-colors cursor-pointer text-left">
                Atta, Flour & Grains
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('Shop')} className="hover:text-emerald-500 transition-colors cursor-pointer text-left">
                Cooking Oils & Ghee
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('Shop')} className="hover:text-emerald-500 transition-colors cursor-pointer text-left">
                Spices, Salt & Sugar
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('Shop')} className="hover:text-emerald-500 transition-colors cursor-pointer text-left">
                Stationery & Utilities
              </button>
            </li>
          </ul>
        </div>

        {/* Support Link */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Quick Links</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onNavigate('Home')} className="hover:text-emerald-500 transition-colors cursor-pointer text-left">
                Home Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('Shop')} className="hover:text-emerald-500 transition-colors cursor-pointer text-left">
                All Products Catalog
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('Categories')} className="hover:text-emerald-500 transition-colors cursor-pointer text-left">
                Category Tree
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('Support')} className="hover:text-emerald-500 transition-colors cursor-pointer text-left">
                FAQs & Support Center
              </button>
            </li>
          </ul>
        </div>

        {/* Contact/Support Address info */}
        <div className="space-y-2 text-xs">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Store Location</h4>
          <p className="text-gray-500 leading-relaxed text-[11px]">
            Daily Needs Retail Store<br />
            Shop 14-16, Sector 4 Market,<br />
            Near Central Plaza, New Delhi - 110001
          </p>
          <p className="text-gray-500 text-[11px]">Phone: +91 98765 43210</p>
          <p className="text-gray-500 text-[11px]">Email: support@dailyneeds.com</p>
        </div>
      </div>

      {/* Bottom Copyright bar */}
      <div className="bg-gray-950 border-t border-gray-900 py-6 text-center text-[10px] text-gray-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Daily Needs Grocery Retail. All rights reserved. Built with pride for local commerce.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-emerald-600 fill-current" /> in India | Admin Ready Configuration
          </p>
        </div>
      </div>

    </footer>
  );
}
