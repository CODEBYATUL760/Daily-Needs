/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronUp, MapPin, 
  Mail, PhoneCall, ShieldCheck, Truck, RotateCcw, Award 
} from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS_LIST: FAQItem[] = [
  {
    q: 'What is the minimum order value at Daily Needs?',
    a: 'The minimum order value for placing a delivery request is ₹100. If your cart value is less than ₹100, please add a few more daily essentials to unlock the checkout button.'
  },
  {
    q: 'How does the Free Delivery policy work?',
    a: 'We offer completely FREE Express Delivery on all orders above ₹500. For orders between ₹100 and ₹500, a flat delivery charge of ₹40 is added to support local logistics.'
  },
  {
    q: 'What are your operational hours and delivery speeds?',
    a: 'Our grocery dispatch centers are open from 7:00 AM to 10:00 PM every day. For select locations, we guarantee express dispatch that delivers inside 2 hours of placing the order.'
  },
  {
    q: 'How do I return a fresh item or dry grocery?',
    a: 'We offer a "No Questions Asked" refund and return policy. If you receive any fresh fruits, vegetables, or milk that does not meet your quality standards, return it to the delivery executive immediately for an instant refund or replacement.'
  },
  {
    q: 'Are your fruits and vegetables organic?',
    a: 'Yes, we source our fresh produce directly from trusted regional farmers. We prioritize organic farming and visual grading, ensuring pesticide-free clean items arrive at your door.'
  },
  {
    q: 'How can I pay for my grocery order?',
    a: 'We support Cash on Delivery (COD), UPI transfer (GooglePay, PhonePe, Paytm, BHIM), and direct payment via card to our executive at the time of delivery.'
  }
];

export default function FAQSupport() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      
      {/* Intro Banner */}
      <div className="bg-linear-to-r from-emerald-800 to-emerald-700 text-white rounded-3xl p-8 md:p-12 text-left relative overflow-hidden shadow-lg shadow-emerald-100">
        <div className="max-w-xl space-y-4 relative z-10">
          <span className="bg-emerald-600/80 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Customer Support Center
          </span>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
            We are here to assist with your daily needs
          </h1>
          <p className="text-xs md:text-sm text-emerald-100 leading-relaxed">
            Have questions about delivery slots, premium brands, bulk corporate orders, or quality assurance? Check our detailed documentation or reach out instantly.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <a href="tel:+919876543210" className="flex items-center gap-1.5 bg-white text-emerald-900 font-extrabold text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-50 transition-colors shadow-xs">
              <PhoneCall className="w-3.5 h-3.5" /> +91 98765 43210
            </a>
            <a href="mailto:support@dailyneeds.com" className="flex items-center gap-1.5 bg-emerald-600/70 text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors border border-emerald-500/30">
              <Mail className="w-3.5 h-3.5" /> support@dailyneeds.com
            </a>
          </div>
        </div>
        {/* Abstract design elements */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient opacity-10 pointer-events-none hidden md:block" />
      </div>

      {/* Core Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3 shadow-xs">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wide">Delivery Policy</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Fast dispatch from the nearest partner store. Free above ₹500, flat ₹40 for smaller purchases. Inside 2-hour slot options.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3 shadow-xs">
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wide">Easy Refunds</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            "No Questions Asked" refund standard. If any item is damaged or stale, return instantly to our delivery executive for credit.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3 shadow-xs">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wide">100% Secure</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            We value your digital security. Choose Cash on Delivery, or scan our official merchant UPI QR code. No credit card stored.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-3 shadow-xs">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-gray-950 uppercase tracking-wide">Quality Grading</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            All brand items are 100% authentic. Fresh fruits & veggies are visually sorted, cleaned, and packed under high hygiene norms.
          </p>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        
        {/* Left intro FAQ */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Help Desk FAQs</h2>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Find answers to standard customer queries. Can't find what you need? Talk to our store owners at the help phone number anytime.
          </p>
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-3 text-xs text-gray-600">
            <div className="font-bold text-gray-900 flex items-center gap-1">📍 Central Store Address:</div>
            <p className="leading-relaxed">
              Daily Needs Retail Pvt. Ltd.<br />
              Shop No. 14-16, Market Complex,<br />
              Connaught Place, New Delhi - 110001
            </p>
          </div>
        </div>

        {/* Right expandable accordion */}
        <div className="md:col-span-2 space-y-3">
          {FAQS_LIST.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex justify-between items-center font-bold text-sm text-gray-900 cursor-pointer hover:bg-gray-50/50"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-gray-500 leading-relaxed font-medium bg-gray-50/30 border-t border-gray-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
