/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Landmark, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { LOCAL_SHOP_INFO } from '../data/defaultData';

interface FooterProps {
  setView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setView }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        
        {/* Main Columns Grid arrangement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Shop brand identification */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600 text-white shadow-md">
                <Landmark size={20} className="stroke-[1.75]" />
              </div>
              <span className="font-sans text-xl font-black tracking-tight text-white">
                {LOCAL_SHOP_INFO.name}
              </span>
            </div>
            
            <p className="text-sm text-slate-400 max-w-md leading-relaxed leading-6">
              Vapi's premier workshop for bespoke photo frames, luxury canvas prints, large floating diamond acrylic panels, memory grids, and personalized anniversary frame gifts. Handcrafted with precision since years.
            </p>

            {/* Local Search and SEO keywords tags representation */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-500 font-mono block mb-2">
                Local Framing Partner Vapi
              </span>
              <div className="flex flex-wrap gap-1.5">
                {LOCAL_SHOP_INFO.seoKeywords.map((tag, i) => (
                  <span 
                    key={i} 
                    className="text-[11px] font-mono bg-slate-800/60 border border-slate-700 text-slate-400 px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick links & Hours of operation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:col-span-2">
            
            {/* Showroom Contact Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Store Showroom
              </h3>
              
              <ul className="space-y-3.5 text-sm text-slate-400">
                <li className="flex gap-2.5 items-start">
                  <MapPin size={18} className="text-amber-500 shrink-0 mt-0.5" />
                  <span className="leading-6 font-medium">
                    {LOCAL_SHOP_INFO.address}
                  </span>
                </li>
                <li className="flex gap-2.5 items-center">
                  <Clock size={16} className="text-amber-500 shrink-0" />
                  <span>{LOCAL_SHOP_INFO.openingHours}</span>
                </li>
                <li className="flex gap-2.5 items-center">
                  <Phone size={16} className="text-amber-500 shrink-0" />
                  <a href={`tel:${LOCAL_SHOP_INFO.phone}`} className="hover:text-amber-500 transition-colors">
                    {LOCAL_SHOP_INFO.phone}
                  </a>
                </li>
              </ul>
            </div>

            {/* Policies and Links */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Explore & Help
              </h3>
              
              <div className="grid grid-cols-2 gap-3.5 text-sm font-medium">
                <div className="flex flex-col gap-2.5">
                  <button onClick={() => setView('home')} className="text-left text-slate-450 hover:text-white transition-colors cursor-pointer">
                    Home
                  </button>
                  <button onClick={() => setView('products')} className="text-left text-slate-450 hover:text-white transition-colors cursor-pointer">
                    Products
                  </button>
                  <button onClick={() => setView('about')} className="text-left text-slate-450 hover:text-white transition-colors cursor-pointer">
                    About Us
                  </button>
                  <button onClick={() => setView('contact')} className="text-left text-slate-450 hover:text-white transition-colors cursor-pointer">
                    Contact Us
                  </button>
                </div>
                
                <div className="flex flex-col gap-2.5">
                  <button onClick={() => setView('terms')} className="text-left text-slate-450 hover:text-white transition-colors cursor-pointer text-xs">
                    Terms of Use
                  </button>
                  <button onClick={() => setView('privacy')} className="text-left text-slate-450 hover:text-white transition-colors cursor-pointer text-xs">
                    Privacy Policy
                  </button>
                  <div className="text-[11px] text-slate-500 pt-1 font-mono leading-relaxed leading-5">
                    *Every order generated triggers custom WhatsApp confirmation invoices for seamless local cash/UPI payment handling.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom footer credit information */}
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {LOCAL_SHOP_INFO.name}. All Rights Reserved.</p>
          <p className="font-mono">
            Crafted for <span className="text-slate-400">{LOCAL_SHOP_INFO.owner}</span> | Vapi, Gujarat, India
          </p>
        </div>

      </div>
    </footer>
  );
};
