/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { MapSection } from './MapSection';
import { 
  ArrowRight, Heart, Sparkles, Shield, Award, Send, 
  MessageSquare, ChevronLeft, ChevronRight, Database 
} from 'lucide-react';
import { LOCAL_SHOP_INFO, DEFAULT_CATEGORIES } from '../data/defaultData';

interface HomeViewProps {
  setView: (view: string) => void;
  setSelectedCategory: (cat: string) => void;
  onOpenQuickView: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setView, setSelectedCategory, onOpenQuickView }) => {
  const { products, banners, isFirestoreEmpty, seedStoreData, isAdmin } = useFirebase();
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const activeBanners = banners.filter(b => b.isActive);

  // Auto-play banners slider
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const handleCategoryCardClick = (slug: string) => {
    setSelectedCategory(slug);
    setView('products');
  };

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % activeBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + activeBanners.length) % activeBanners.length);
  };

  return (
    <div className="space-y-16 animate-fadeIn">
      
      {/* Firestore Empty Setup Assistant */}
      {isFirestoreEmpty && (
        <div id="firestore-seeding-banner" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-50/80 backdrop-blur-xs p-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm text-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl mt-0.5 animate-pulse">
                <Sparkles size={16} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-900 font-sans">
                  Firestore Connected Successfully!
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl font-sans leading-relaxed">
                  Your custom Firebase SDK is active, but your firestore database is empty. The application is running smoothly on local default frame items. 
                  {isAdmin ? (
                    <span className="text-amber-800 font-bold font-sans"> You can seed these default items to your Live Cloud Firestore with 1-click!</span>
                  ) : (
                    <span className="text-slate-600 font-medium font-sans"> Let's populate these premium Vapi photo frame catalogs onto your custom live Firebase. Please make sure you have allowed write permissions in your Firebase Firestore Rules, then click seed!</span>
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={async () => {
                if (confirm('Deploy standard categories, custom photo frames, active banners, coupons, and sample reviews to your connected Firestore database?')) {
                  try {
                    await seedStoreData();
                    alert('Successfully seeded product listings to your live Firebase backend! Enjoy!');
                  } catch (e: any) {
                    alert('Seeding failed: ' + (e.message || e));
                  }
                }
              }}
              className="py-2.5 px-4 whitespace-nowrap text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Database size={13} />
              <span>Seed Live Database</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. HERO SLIDER BANNER */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
        {activeBanners.length === 0 ? (
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center text-white">
            <span className="text-amber-500 font-mono tracking-widest uppercase text-xs font-bold">A to Z Photo Frame</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-2 max-w-4xl mx-auto leading-tight">
              Protect & Frame Your Cherished Memories
            </h1>
            <p className="text-sm sm:text-lg text-slate-300 mt-4 max-w-2xl mx-auto">
              Luxury custom wooden borders, premium floating collage grids, and high-definition acrylic mount print blocks tailored for local homes in Vapi, Gujarat.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <button 
                onClick={() => setView('products')}
                className="rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold py-3.5 px-6 text-sm shadow-sm transition-all duration-200 cursor-pointer"
              >
                Browse Catalog
              </button>
              <button 
                onClick={() => setView('contact')}
                className="rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 px-6 text-sm transition-all duration-200 cursor-pointer"
              >
                Inquire Customs
              </button>
            </div>
          </div>
        ) : (
          <div className="relative h-[480px] sm:h-[550px]">
            {activeBanners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Background Dim Image */}
                <div className="absolute inset-0 bg-slate-950/60 max-h-full">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover mix-blend-overlay opacity-80"
                  />
                </div>

                {/* Content Alignment */}
                <div className="relative mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-white space-y-4">
                  <span className="text-amber-500 font-mono tracking-widest text-xs uppercase font-extrabold animate-slideDown">
                    PROMOTION & VALUES
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-sans max-w-2xl leading-tight">
                    {banner.title}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed">
                    {banner.subtitle}
                  </p>
                  <div className="pt-4 animate-slideUp">
                    <button
                      onClick={() => setView('products')}
                      className="rounded-xl bg-amber-600 hover:bg-amber-550 text-white font-bold py-3 px-6 text-xs sm:text-sm tracking-wide shadow-lg cursor-pointer transition-all hover:translate-x-0.5"
                    >
                      Explore Active Offers
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider Switch Toggles */}
            {activeBanners.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white cursor-pointer transition-colors border border-white/10"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white cursor-pointer transition-colors border border-white/10"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Indicator Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {activeBanners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        i === currentSlide ? 'w-6 bg-amber-550 bg-amber-500' : 'w-1.5 bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* 2. CATEGORIES GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-600 font-bold font-mono">
            Explore Handcrafts
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-sans">
            Choose Your Framing Category
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Select a category styling to filter and design standard frames that perfectly match your wall environment.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {DEFAULT_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryCardClick(category.slug)}
              className="group relative h-48 rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:border-slate-200 bg-slate-50 hover:shadow-md transition-all duration-350 cursor-pointer text-left"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-4">
                <span className="font-sans text-xs sm:text-sm font-bold text-white leading-tight">
                  {category.name}
                </span>
                <span className="text-[9px] text-amber-400 mt-0.5 font-mono flex items-center gap-0.5 hover:underline">
                  Browse list <ArrowRight size={8} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (BEST SELLERS) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-600 font-bold font-mono">
              Curated Masterpieces
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 text-slate-900 mt-1">
              Best Selling Frameworks in Vapi
            </h2>
          </div>
          <button
            onClick={() => { setSelectedCategory('all'); setView('products'); }}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors uppercase font-mono tracking-wider cursor-pointer mt-1"
          >
            Explore Full Catalog <ArrowRight size={12} />
          </button>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 py-10 text-center text-slate-400 text-sm">
            <Sparkles size={24} className="mx-auto text-amber-500/70 mb-2" />
            No featured frames published in catalog yet. Please click the "Seed Default Frame Data" button in your upper Admin panel to populate mock-items instantly.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenQuickView={onOpenQuickView}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. BRAND CORE VALUES BENTO GRID */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 overflow-hidden relative shadow-lg text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-slate-800">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">
              Robust Craftsmanship
            </span>
            <h3 className="text-2xl sm:text-3.5xl font-black leading-tight">
              Why Choice Handcrafted Frames?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every photograph, artwork, or marriage memory has a unique presence. Direct mass factory prints look plain, whereas handcrafted individual wood texturing matboards define absolute gallery class.
            </p>
            
            <div className="pt-2 flex flex-col gap-3 text-xs font-medium">
              {[
                { icon: Shield, title: "Dual Protection", desc: "Moisture-resistant backing paired with non-reflective cover shields." },
                { icon: Award, title: "Premium Synthetic Woods", desc: "Ultra-durable polymers which do not swell or suffer termites." },
                { icon: Heart, title: "Tailored to Fit", desc: "Any custom millimeter can be carved to perfection in our shop." }
              ].map((val, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center bg-slate-800 rounded-lg text-amber-500 shrink-0 border border-slate-700">
                    <val.icon size={14} />
                  </div>
                  <div>
                    <strong className="text-slate-100 block">{val.title}</strong>
                    <span className="text-slate-400 text-[11px] block mt-0.5">{val.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 h-[300px] lg:h-[400px] relative rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
            <img
              src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"
              alt="Bespoke frame crafting workshop"
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover filter brightness-90 animate-subtlePulse"
            />
          </div>

        </div>
      </section>

      {/* 5. GOOGLE MAP LOCATION & HOURS */}
      <MapSection />

    </div>
  );
};
