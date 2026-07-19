/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, Heart, GitCompare, HelpCircle, PhoneCall, MapPin, 
  Menu, X, Sparkles, Home, Grid, Search, User, CheckCircle
} from 'lucide-react';
import { Product } from '../types';
import SearchContainer from './SearchContainer';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  compareCount: number;
  products: Product[];
  currentView: string;
  onNavigate: (view: string) => void;
  onSelectProduct: (product: Product) => void;
  onSearchSubmit: (query: string) => void;
  onOpenCart: () => void;
  onOpenCompare: () => void;
}

export default function Navbar({
  cartCount,
  wishlistCount,
  compareCount,
  products,
  currentView,
  onNavigate,
  onSelectProduct,
  onSearchSubmit,
  onOpenCart,
  onOpenCompare
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userZip, setUserZip] = useState('110001');
  const [isChangingZip, setIsChangingZip] = useState(false);
  const [zipInput, setZipInput] = useState('');
  const [zipFeedback, setZipFeedback] = useState('');

  const handleZipChange = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanZip = zipInput.trim();
    if (/^\d{6}$/.test(cleanZip)) {
      setUserZip(cleanZip);
      setIsChangingZip(false);
      setZipFeedback('');
    } else {
      setZipFeedback('Please enter a valid 6-digit Indian PIN code');
    }
  };

  const navLinks = [
    { name: 'Home', view: 'Home', icon: <Home className="w-4 h-4" /> },
    { name: 'Shop All', view: 'Shop', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Categories', view: 'Categories', icon: <Grid className="w-4 h-4" /> },
    { name: 'FAQs & Support', view: 'Support', icon: <HelpCircle className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-gray-100">
      {/* Top Banner Alert */}
      <div className="bg-emerald-700 text-white text-xs px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="bg-emerald-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Flash Offer</span>
            <span>⚡ Free Delivery above ₹500 | Min Order ₹100 | Delivery inside 2 Hours</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1"><PhoneCall className="w-3.5 h-3.5" /> Call Store: +91 98765 43210</span>
            <span className="hidden md:inline">🕒 7:00 AM - 10:00 PM Daily</span>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Brand Section */}
          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            <button 
              onClick={() => { onNavigate('Home'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
                DN
              </div>
              <div>
                <span className="text-xl font-extrabold text-gray-900 tracking-tight block">
                  Daily<span className="text-emerald-600">Needs</span>
                </span>
                <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase block -mt-1">
                  Local Grocery
                </span>
              </div>
            </button>

            {/* ZIP/Pin Code Selector */}
            <div className="hidden lg:flex items-center gap-1.5 pl-6 border-l border-gray-100">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <div className="text-left text-xs">
                <span className="text-gray-400 block font-semibold uppercase text-[9px] tracking-wider">Deliver to</span>
                {isChangingZip ? (
                  <form onSubmit={handleZipChange} className="flex items-center gap-1">
                    <input
                      type="text"
                      value={zipInput}
                      onChange={(e) => setZipInput(e.target.value)}
                      placeholder="Pin code"
                      className="w-18 bg-gray-50 border border-gray-200 text-gray-800 text-[11px] px-1.5 py-0.5 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      maxLength={6}
                      autoFocus
                    />
                    <button type="submit" className="text-emerald-600 font-bold text-[11px] hover:underline cursor-pointer">Set</button>
                    <button type="button" onClick={() => setIsChangingZip(false)} className="text-gray-400 text-[11px] hover:underline cursor-pointer">X</button>
                  </form>
                ) : (
                  <button 
                    onClick={() => { setZipInput(userZip); setIsChangingZip(true); }}
                    className="text-gray-800 font-bold hover:text-emerald-600 underline decoration-dotted underline-offset-2 transition-colors cursor-pointer block"
                  >
                    {userZip} (Standard)
                  </button>
                )}
                {zipFeedback && <p className="absolute text-[9px] text-red-500 mt-0.5">{zipFeedback}</p>}
              </div>
            </div>
          </div>

          {/* Autocomplete Search input block */}
          <div className="hidden md:block flex-1 max-w-xl">
            <SearchContainer 
              products={products} 
              onSelectProduct={onSelectProduct} 
              onSearchSubmit={onSearchSubmit} 
            />
          </div>

          {/* Action Icons Section */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Compare items slot */}
            <button
              onClick={onOpenCompare}
              className="relative p-2.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer group"
              title="Compare Products"
            >
              <GitCompare className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Wishlist slot */}
            <button
              onClick={() => onNavigate('Wishlist')}
              className={`relative p-2.5 rounded-xl transition-all cursor-pointer group ${
                currentView === 'Wishlist' ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              title="Saved Items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button with savings/price indicator */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-xl border border-emerald-100 transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-emerald-50">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs">My Cart</span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-emerald-600 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Desktop Categories Sub-Nav Bar */}
      <div className="hidden md:block border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.name}
                  onClick={() => onNavigate(link.view)}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                    isActive 
                      ? 'border-emerald-600 text-emerald-700 font-bold bg-white' 
                      : 'border-transparent text-gray-500 hover:text-emerald-600 hover:border-gray-200'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </button>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider">
              <CheckCircle className="w-3.5 h-3.5" /> 100% Quality Guaranteed
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Store Pickup Available</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white p-4 space-y-4 shadow-xl">
          {/* Mobile search */}
          <div className="w-full">
            <SearchContainer 
              products={products} 
              onSelectProduct={(p) => { onSelectProduct(p); setMobileMenuOpen(false); }} 
              onSearchSubmit={(q) => { onSearchSubmit(q); setMobileMenuOpen(false); }} 
            />
          </div>

          {/* Navigation Links list */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.name}
                  onClick={() => { onNavigate(link.view); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-left cursor-pointer transition-colors ${
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </button>
              );
            })}
            <button
              onClick={() => { onNavigate('Wishlist'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl text-left cursor-pointer transition-colors ${
                currentView === 'Wishlist' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
              }`}
            >
              <Heart className="w-4 h-4" />
              Wishlist / Saved
            </button>
          </div>

          {/* Location status for mobile */}
          <div className="p-3 bg-gray-50 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
              <MapPin className="w-4 h-4 text-emerald-600 animate-bounce" />
              <span>DELIVERING TO PIN CODE: <strong className="text-gray-800">{userZip}</strong></span>
            </div>
            <button
              onClick={() => { setIsChangingZip(true); setMobileMenuOpen(false); }}
              className="text-xs text-emerald-600 font-bold hover:underline ml-6 cursor-pointer"
            >
              Change Location Pincode
            </button>
          </div>
        </div>
      )}

      {/* STICKY BOTTOM NAVIGATION BAR FOR MOBILE SCREENS */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl z-40 px-3 py-1 flex items-center justify-around">
        <button
          onClick={() => onNavigate('Home')}
          className={`flex flex-col items-center gap-0.5 p-2 rounded-lg cursor-pointer transition-colors ${
            currentView === 'Home' ? 'text-emerald-600 font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          onClick={() => onNavigate('Shop')}
          className={`flex flex-col items-center gap-0.5 p-2 rounded-lg cursor-pointer transition-colors ${
            currentView === 'Shop' ? 'text-emerald-600 font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-medium">Shop</span>
        </button>

        <button
          onClick={() => onNavigate('Categories')}
          className={`flex flex-col items-center gap-0.5 p-2 rounded-lg cursor-pointer transition-colors ${
            currentView === 'Categories' ? 'text-emerald-600 font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-medium">Categories</span>
        </button>

        <button
          onClick={() => onNavigate('Wishlist')}
          className={`flex flex-col items-center gap-0.5 p-2 rounded-lg cursor-pointer transition-colors ${
            currentView === 'Wishlist' ? 'text-emerald-600 font-bold' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-medium">Wishlist</span>
        </button>

        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center gap-0.5 p-2 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-emerald-700">Cart</span>
        </button>
      </div>
    </header>
  );
}
