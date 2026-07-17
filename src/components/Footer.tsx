import React from "react";
import { useStore } from "../context/StoreContext";
import { 
  Sparkles, Phone, Mail, MapPin, Clock, ShieldCheck, 
  Truck, CornerDownLeft, CreditCard, MessageSquare 
} from "lucide-react";

export const Footer: React.FC = () => {
  const { setPage } = useStore();

  return (
    <footer id="app-footer" className="bg-neutral-900 text-neutral-400 mt-16 transition-colors border-t border-neutral-800">
      
      {/* Brand values / Trust markers section */}
      <div className="border-b border-neutral-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Express 30 Mins Delivery</h4>
              <p className="text-xs text-neutral-500 mt-1">Superfast delivery straight to your door in Bhopal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">100% Quality Assurance</h4>
              <p className="text-xs text-neutral-500 mt-1">Sourced from top brands & premium local farms</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
              <CornerDownLeft className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">7-Day Easy Returns</h4>
              <p className="text-xs text-neutral-500 mt-1">No questions asked refund or instant exchange</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Secure UPI & COD Ready</h4>
              <p className="text-xs text-neutral-500 mt-1">Pay safely on delivery or via dynamic UPI QR</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Col 1: Store Intro */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage("Home")}>
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Daily Needs</span>
          </div>
          <p className="text-xs leading-relaxed text-neutral-500">
            Daily Needs is Bhopal's trusted grocery and essentials hub, committed to bringing you fresh produce, standard pantry items, baby items, stationeries, and pet needs within 20 to 45 minutes. Quality is our standard.
          </p>
          <div className="flex gap-3">
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="p-2 bg-neutral-800 text-green-400 hover:text-white hover:bg-emerald-500 rounded-xl transition-all" title="WhatsApp Chat">
              <MessageSquare className="w-4 h-4" />
            </a>
            <a href="tel:+919876543210" className="p-2 bg-neutral-800 text-emerald-400 hover:text-white hover:bg-emerald-500 rounded-xl transition-all" title="Phone Call">
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Useful Links */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Explore Daily Needs</h4>
          <ul className="space-y-3 text-xs">
            <li><button onClick={() => setPage("Home")} className="hover:text-emerald-400 transition-colors">Home Store</button></li>
            <li><button onClick={() => setPage("Categories")} className="hover:text-emerald-400 transition-colors">Browse Categories</button></li>
            <li><button onClick={() => setPage("Wishlist")} className="hover:text-emerald-400 transition-colors">My Wishlist</button></li>
            <li><button onClick={() => setPage("FAQ")} className="hover:text-emerald-400 transition-colors">Frequently Asked Questions (FAQ)</button></li>
            <li><button onClick={() => setPage("About")} className="hover:text-emerald-400 transition-colors">About Store</button></li>
            <li><button onClick={() => setPage("Contact")} className="hover:text-emerald-400 transition-colors">Contact Support</button></li>
          </ul>
        </div>

        {/* Col 3: Legal & Corporate policies */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Our Policies</h4>
          <ul className="space-y-3 text-xs">
            <li><button onClick={() => setPage("Privacy")} className="hover:text-emerald-400 transition-colors">Privacy Policy</button></li>
            <li><button onClick={() => setPage("Refund")} className="hover:text-emerald-400 transition-colors">Refund & Return Policy</button></li>
            <li><button onClick={() => setPage("Terms")} className="hover:text-emerald-400 transition-colors">Terms & Conditions</button></li>
            <li><button onClick={() => setPage("FAQ")} className="hover:text-emerald-400 transition-colors">Shipping & Delivery Policies</button></li>
          </ul>
        </div>

        {/* Col 4: Address & Timing details */}
        <div className="space-y-4 text-xs text-neutral-500">
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Store Details</h4>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Daily Needs Store</strong><br />
              123 Main Market, Bhopal,<br />
              Madhya Pradesh, India
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Store Timings: <strong>7:00 AM – 10:00 PM</strong></span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Support: +91 9876543210</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Email: support@dailyneeds.in</span>
          </div>
        </div>

      </div>

      {/* Ground Copyright and Trademark details */}
      <div className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-600 bg-neutral-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} Daily Needs Bhopal. Developed by राजेश शर्मा (Rajesh Sharma). All Rights Reserved.</span>
          <div className="flex gap-4">
            <button onClick={() => setPage("Privacy")} className="hover:underline">Privacy</button>
            <button onClick={() => setPage("Terms")} className="hover:underline">Terms</button>
            <button onClick={() => setPage("Refund")} className="hover:underline">Refunds</button>
          </div>
        </div>
      </div>

    </footer>
  );
};
