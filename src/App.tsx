/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';

// Views
import { HomeView } from './components/HomeView';
import { ProductsView } from './components/ProductsView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { AdminPanel } from './components/AdminPanel';
import { PrivacyView } from './components/PrivacyView';
import { LoginView } from './components/LoginView';

import { 
  Sparkles, ShieldCheck, Mail, Phone, Landmark, 
  HelpCircle, AlertTriangle, RefreshCw 
} from 'lucide-react';

const InnerApp: React.FC = () => {
  const { loading, products, user } = useFirebase();
  const [currentView, setView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl animate-subtlePulse">
          <Landmark size={28} className="stroke-[1.5]" />
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw size={14} className="animate-spin text-amber-600" />
          <span className="text-xs uppercase font-bold tracking-widest text-slate-500 font-mono">
            Loading A to Z Photo Frame...
          </span>
        </div>
      </div>
    );
  }

  // Enforce credentials gate before entering main framing showroom website
  if (!user) {
    return <LoginView />;
  }

  // Handle opening quick inspect details
  const handleOpenQuickView = (product: any) => {
    setQuickViewProduct(product);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-800">
      
      {/* Header component */}
      <Header 
        currentView={currentView} 
        setView={setView} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      {/* Helpful banner if database needs seeding on cold starts */}
      {products.length === 0 && currentView !== 'admin' && (
        <div className="bg-amber-50 border-b border-amber-100 py-3.5 px-4 text-center text-xs font-semibold text-amber-805 flex justify-center items-center gap-2">
          <AlertTriangle size={15} className="text-amber-600" />
          <span>Showroom is currently launch-empty. <strong>Authorized admin?</strong> Click Google Sign-In, enter Admin Panel, and press 'Seed Default Frame Data'!</span>
        </div>
      )}

      {/* Main viewport transitions */}
      <main className="flex-1 pb-16 bg-white">
        {currentView === 'home' && (
          <HomeView 
            setView={setView} 
            setSelectedCategory={setSelectedCategory} 
            onOpenQuickView={handleOpenQuickView} 
          />
        )}
        {currentView === 'products' && (
          <ProductsView 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            onOpenQuickView={handleOpenQuickView} 
          />
        )}
        {currentView === 'about' && (
          <AboutView setView={setView} />
        )}
        {currentView === 'contact' && (
          <ContactView />
        )}
        {currentView === 'admin' && (
          <AdminPanel />
        )}
        {currentView === 'terms' && (
          <PrivacyView type="terms" />
        )}
        {currentView === 'privacy' && (
          <PrivacyView type="privacy" />
        )}
      </main>

      {/* Footer component */}
      <Footer setView={setView} />

      {/* Cart Drawer sheet */}
      {isCartOpen && (
        <CartDrawer onClose={() => setIsCartOpen(false)} />
      )}

      {/* Product Inspect details modal */}
      {quickViewProduct && (
        <ProductDetailModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}

    </div>
  );
};

export default function App() {
  return (
    <FirebaseProvider>
      <InnerApp />
    </FirebaseProvider>
  );
}
