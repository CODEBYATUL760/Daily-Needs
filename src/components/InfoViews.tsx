import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { 
  Building, Phone, Mail, Clock, MapPin, Sparkles, 
  ChevronDown, ArrowLeft, ShieldAlert, FileText, CornerDownRight 
} from "lucide-react";

interface InfoViewsProps {
  subPage: "About" | "Contact" | "FAQ" | "Privacy" | "Refund" | "Terms" | "404";
}

export const InfoViews: React.FC<InfoViewsProps> = ({ subPage }) => {
  const { setPage } = useStore();
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(null);

  const FAQS_DETAILED = [
    { q: "What is the delivery radius for Bhopal?", a: "We offer express grocery shipping strictly within a 10 KM delivery radius of our hub at 123 Main Market, Bhopal, Madhya Pradesh, India. If you live outside this boundary, please connect with our helpline to coordinate manual logistics." },
    { q: "What is the minimum checkout requirement?", a: "To maintain our premium express delivery standard, our minimum checkout value is ₹1,000. If your basket subtotal is less, the checkout module will remain locked." },
    { q: "How much are shipping fees?", a: "Delivery is completely FREE for all orders totaling ₹2,000 or above. For orders ranging between ₹1,000 and ₹1,999, we apply a standard delivery charge of ₹100." },
    { q: "What are your operational timings?", a: "Daily Needs is active from 7:00 AM to 10:00 PM every single day. Orders placed after 9:30 PM may be scheduled for express dispatch at 7:00 AM the following morning." },
    { q: "How do I return a product?", a: "Staples, tea, coffee, baby products, and kitchen essentials are backed by a 7-day hassle-free return policy. If you receive damaged packaging or incorrect items, request a return under My Orders or contact support immediately." }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 animate-in fade-in duration-300">
      
      {/* 1. ABOUT US PAGE */}
      {subPage === "About" && (
        <div className="space-y-8 text-xs sm:text-sm font-medium leading-relaxed text-neutral-600 dark:text-neutral-300">
          <div className="text-center space-y-3 pb-6 border-b border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">Our History</span>
            <h1 className="text-3xl font-black text-neutral-800 dark:text-white">About Daily Needs</h1>
            <p className="max-w-xl mx-auto text-neutral-400">Serving premium staple groceries and household needs across Bhopal since 2012.</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-base font-bold text-neutral-800 dark:text-white flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-500" /> Rajesh Sharma's Vision</h3>
            <p>
              Daily Needs is Bhopal's leading community-focused digital grocery hub. Founded by local merchant <strong>Rajesh Sharma</strong>, our goal has always been simple: bypass the long lines and premium markups of traditional supermarkets by delivering high-quality flours, unpolished pulses, premium basmati rice, and everyday personal care essentials straight to your doorstep.
            </p>
            <p>
              What started as a modest market store in Bhopal has evolved into a full-scale hyper-local digital delivery network. By integrating clean tech with traditional warehousing, we ensure every bag of flour is fresh-ground, spices are pristine, and kitchen supplies are fully sterilized before express dispatch.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-center">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl">
                <Clock className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-neutral-800 dark:text-white">Store Timings</h4>
                <p className="text-xs text-neutral-400 mt-1">7:00 AM – 10:00 PM</p>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl">
                <MapPin className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-neutral-800 dark:text-white">Hub Location</h4>
                <p className="text-xs text-neutral-400 mt-1">123 Main Market, Bhopal</p>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl">
                <Building className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-bold text-neutral-800 dark:text-white">Delivery Scope</h4>
                <p className="text-xs text-neutral-400 mt-1">10 KM Express Radius</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTACT US PAGE */}
      {subPage === "Contact" && (
        <div className="space-y-8 text-xs sm:text-sm font-medium">
          <div className="text-center space-y-3 pb-6 border-b border-neutral-100 dark:border-neutral-800">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">Get in touch</span>
            <h1 className="text-3xl font-black text-neutral-800 dark:text-white">Contact Store Helpline</h1>
            <p className="max-w-xl mx-auto text-neutral-400">Our customer support channels are open from 7:00 AM to 10:00 PM everyday.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Contact details */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-neutral-800 dark:text-white">Official Office Address</h3>
              <p className="text-neutral-500">
                Daily Needs Grocery Hub<br />
                123 Main Market, Bhopal,<br />
                Madhya Pradesh, Pin Code: 462001, India.
              </p>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
                  <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Call support: <strong>+91 9876543210</strong></span>
                </div>
                <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
                  <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>Email support: <strong>support@dailyneeds.in</strong></span>
                </div>
              </div>
            </div>

            {/* Simulated feedback Form */}
            <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">Send Direct Feedback</h3>
              <form onSubmit={(e) => { e.preventDefault(); alert("Feedback submitted! Thank you."); }} className="space-y-3 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2.5 focus:outline-none text-neutral-800 dark:text-white"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2.5 focus:outline-none text-neutral-800 dark:text-white"
                />
                <textarea
                  placeholder="Write feedback comments..."
                  rows={3}
                  required
                  className="w-full bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl p-3 focus:outline-none text-neutral-800 dark:text-white"
                />
                <button type="submit" className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-md transition-colors text-center">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. FAQ PAGE */}
      {subPage === "FAQ" && (
        <div className="space-y-6">
          <div className="text-center space-y-3 pb-6 border-b border-neutral-100 dark:border-neutral-800">
            <h1 className="text-3xl font-black text-neutral-800 dark:text-white">Frequently Asked Questions</h1>
            <p className="max-w-xl mx-auto text-neutral-400">Find answers regarding checkout, delivery timing, refund process, and more.</p>
          </div>

          <div className="space-y-3 pt-4">
            {FAQS_DETAILED.map((faq, i) => (
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
      )}

      {/* 4. PRIVACY POLICY */}
      {subPage === "Privacy" && (
        <div className="space-y-6 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300 leading-relaxed">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-4">
            <FileText className="w-6 h-6 text-emerald-500" />
            <h1 className="text-xl font-black text-neutral-800 dark:text-white">Privacy Policy</h1>
          </div>
          <p className="font-bold text-neutral-500">Effective Date: July 17, 2026</p>
          <p>
            At Daily Needs, accessible from the dailyneeds.in online portal, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Daily Needs and how we use it.
          </p>
          <h3 className="font-extrabold text-neutral-800 dark:text-white mt-4 flex items-center gap-1.5"><CornerDownRight className="w-4 h-4" /> Information We Collect</h3>
          <p>
            When you register a local account or submit a grocery order, we request access to your full name, WhatsApp/phone number, email address, shipping delivery address in Bhopal, and pin code. This data is strictly utilized to process dynamic invoices, coordinate order dispatches with delivery riders, and dispatch tracking status updates.
          </p>
          <h3 className="font-extrabold text-neutral-800 dark:text-white mt-4 flex items-center gap-1.5"><CornerDownRight className="w-4 h-4" /> Local Storage Security</h3>
          <p>
            We respect your privacy. No credentials or personal telemetry is transmitted to third-party ad networks. All shopper cart records, bookmarks, and shipping particulars are preserved inside your local client browser cache (localStorage) for swift access.
          </p>
        </div>
      )}

      {/* 5. REFUND POLICY */}
      {subPage === "Refund" && (
        <div className="space-y-6 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300 leading-relaxed">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-4">
            <FileText className="w-6 h-6 text-emerald-500" />
            <h1 className="text-xl font-black text-neutral-800 dark:text-white">Refund & Returns Policy</h1>
          </div>
          <p className="font-bold text-neutral-500">Effective Date: July 17, 2026</p>
          <p>
            Thank you for shopping at Daily Needs. We want you to be completely satisfied with your fresh groceries and staples.
          </p>
          <h3 className="font-extrabold text-neutral-800 dark:text-white mt-4 flex items-center gap-1.5"><CornerDownRight className="w-4 h-4" /> 7-Day Staple Returns</h3>
          <p>
            Rice, pulses, spices, flour, oils, tea, coffee, baby products, cleaning essentials, pet care, and stationery are fully backed by a 7-day return policy. If you receive expired stock or damaged packaging, you may initiate a return or contact support directly at <strong>+91 9876543210</strong>.
          </p>
          <h3 className="font-extrabold text-neutral-800 dark:text-white mt-4 flex items-center gap-1.5"><CornerDownRight className="w-4 h-4" /> Frozen Food and Fresh Items</h3>
          <p>
            Due to temperature-controlled logistics, frozen items, milk, ghee, and fresh bread are eligible for instant refunds ONLY upon delivery if damaged. We do not accept physical returns for perishable items once accepted.
          </p>
        </div>
      )}

      {/* 6. TERMS & CONDITIONS */}
      {subPage === "Terms" && (
        <div className="space-y-6 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-300 leading-relaxed">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-4">
            <FileText className="w-6 h-6 text-emerald-500" />
            <h1 className="text-xl font-black text-neutral-800 dark:text-white">Terms & Conditions</h1>
          </div>
          <p className="font-bold text-neutral-500">Effective Date: July 17, 2026</p>
          <p>
            Welcome to Daily Needs! These terms and conditions outline the rules and regulations for the use of Rajesh Sharma's Daily Needs Website.
          </p>
          <h3 className="font-extrabold text-neutral-800 dark:text-white mt-4 flex items-center gap-1.5"><CornerDownRight className="w-4 h-4" /> Shipping Limits</h3>
          <p>
            By placing an order, you agree that delivery will be handled exclusively inside our 10 KM Bhopal delivery perimeter. Orders outside this radius are subject to cancellation. Minimum checkout order is ₹1,000, and free shipping triggers at ₹2,000.
          </p>
          <h3 className="font-extrabold text-neutral-800 dark:text-white mt-4 flex items-center gap-1.5"><CornerDownRight className="w-4 h-4" /> Billing and Payment Security</h3>
          <p>
            Payments completed via our online UPI payment simulator are for simulation and checkout validation purposes only. All final settlements occur safely upon arrival via Cash on Delivery or digital transfer.
          </p>
        </div>
      )}

      {/* 7. 404 PAGE FALLBACK */}
      {subPage === "404" && (
        <div className="text-center py-16 max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 bg-rose-100 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-neutral-800 dark:text-white">Page Not Found</h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We couldn't locate the exact page you requested. Try returning to our homepage or search through our catalog categories.
            </p>
          </div>
          <button
            onClick={() => setPage("Home")}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home Page</span>
          </button>
        </div>
      )}

    </div>
  );
};
