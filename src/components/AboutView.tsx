/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LOCAL_SHOP_INFO } from '../data/defaultData';
import { Landmark, Sparkles, ShieldCheck, Hammer, Palette, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  setView: (view: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setView }) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16 animate-fadeIn">
      
      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-amber-600 font-bold font-mono">
          Bespoke Heritage
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mt-2 font-sans md:text-5xl">
          We Frame Your Moments to Last Forever
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-4 leading-relaxed">
          Based in Vapi, Gujarat, A to Z Photo Frame has grown to become the most trusted framing partner for local families, home interior designers, corporate offices, and local photographers.
        </p>
      </section>

      {/* Grid Features */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Story Illustration Left */}
        <div className="lg:col-span-6 relative aspect-[4/3] rounded-2.5xl overflow-hidden shadow-md border bg-slate-55">
          <img
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"
            alt="Framer assembling custom corner mats"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Story Content Right */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2.5xl font-black text-slate-900">
            A Journey of Design & Technical Woodwork
          </h2>
          
          <p className="text-xs text-slate-505 leading-relaxed">
            Our specialized workshop in Vapi is equipped to manage frames of any standard scale or material. From fine synthetic polymers that withstand coastal humidity to thick, rich teak borders, we curate every detail.
          </p>
          
          <p className="text-xs text-slate-505 leading-relaxed">
            Led by <strong>{LOCAL_SHOP_INFO.owner}</strong>, we pride ourselves on absolute local accountability. When you buy from us, you get face-to-face assistance, real material touchpoints, custom glass fittings, and instant high-fidelity feedback.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <span className="text-2xl font-black text-amber-650 block">150+</span>
              <span className="text-[10px] font-mono text-slate-400 font-bold block mt-0.5 uppercase">Borders Catalogs</span>
            </div>
            <div>
              <span className="text-2xl font-black text-amber-653 text-amber-600 block">5k+</span>
              <span className="text-[10px] font-mono text-slate-405 font-bold block mt-0.5 uppercase">Satisfied Deliveries</span>
            </div>
          </div>
        </div>

      </section>

      {/* Core Processes */}
      <section className="bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 text-center mb-8">
          The Crafting Blueprint we Follow
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { icon: Palette, title: "1. Frame Choice & Sizing", desc: "Browse a dynamic gallery or let us recommend double-board mat choices to highlight physical tones." },
            { icon: Hammer, title: "2. Precision Woodwork", desc: "Each polymer or wooden border is carved on automatic machines to fit details seamlessly." },
            { icon: ShieldCheck, title: "3. Ultimate Guarding", desc: "Finished with premium dust seal back covers and thick framing plexiglass sheets." }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center bg-amber-50 hover:bg-amber-100 text-amber-600 transition-colors rounded-xl border border-amber-100/50">
                  <item.icon size={16} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="text-center py-6">
        <h3 className="text-xl font-bold text-slate-900">Have a Particular Family Memory to Canvas?</h3>
        <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
          Contact Hasan's workshop team online today to request sizing quotes or visit our Vapi GIDC showroom.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => setView('contact')}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 text-xs transition-colors cursor-pointer"
          >
            Get Custom Quote
          </button>
          <button
            onClick={() => setView('products')}
            className="rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-6 text-xs transition-colors cursor-pointer"
          >
            Browse Products
          </button>
        </div>
      </section>

    </div>
  );
};
