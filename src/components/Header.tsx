/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { ShoppingCart, LogIn, LogOut, ShieldCheck, Menu, X, Landmark } from 'lucide-react';
import { LOCAL_SHOP_INFO } from '../data/defaultData';

interface HeaderProps {
  currentView: string;
  setView: (view: string) => void;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, onOpenCart }) => {
  const { user, dbUser, cart, loginWithGoogle, logout, isAdmin, isFirestoreEmpty } = useFirebase();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const totalCartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleNavClick = (viewId: string) => {
    setView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/94 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Shop Name */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 group cursor-pointer text-left"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:bg-amber-600">
            <Landmark size={20} className="stroke-[1.75]" />
          </div>
          <div>
            <span className="font-sans text-lg font-extrabold tracking-tight text-slate-900 block leading-none">
              {LOCAL_SHOP_INFO.name}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-600 font-bold leading-none block mt-1">
              Vapi, Gujarat
            </span>
          </div>
        </button>

        {/* Desktop Navigation Link items */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`font-sans text-sm font-medium tracking-wide transition-all duration-200 cursor-pointer relative py-1 ${
                currentView === item.id 
                  ? 'text-slate-950 font-semibold' 
                  : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              {item.label}
              {currentView === item.id && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-amber-600 rounded-full" />
              )}
            </button>
          ))}
          
          {/* Admin Dashboard Navigation Button */}
          {(isAdmin || isFirestoreEmpty) && (
            <button
               onClick={() => handleNavClick('admin')}
               className={`flex items-center gap-1.5 font-sans text-sm font-semibold px-3 py-1 rounded-full border transition-all duration-200 cursor-pointer ${
                 currentView === 'admin'
                   ? 'bg-amber-500 text-white border-amber-500'
                   : 'text-amber-600 border-amber-600/30 hover:bg-amber-50'
               }`}
             >
               <ShieldCheck size={15} />
               <span>{isFirestoreEmpty ? 'Admin & DB Setup' : 'Admin Panel'}</span>
             </button>
           )}
        </nav>

        {/* Action Controls Side */}
        <div className="flex items-center gap-4">
          
          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            id="header-cart-btn"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all duration-200 cursor-pointer border border-slate-100"
          >
            <ShoppingCart size={19} className="stroke-[1.75]" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Sign In controls */}
          <div className="hidden sm:block border-l border-slate-100 pl-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-900 leading-tight">
                    {dbUser?.displayName || user.displayName || 'Customer'}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize">
                    {dbUser?.role || 'Customer'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Log Out"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold tracking-wide text-white hover:bg-slate-800 shadow-sm transition-all duration-200 cursor-pointer hover:shadow"
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-50 md:hidden border border-slate-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white py-4 px-4 shadow-lg animate-fadeIn">
          <div className="flex flex-col gap-3">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left font-sans text-base font-medium py-2 rounded-lg px-3 transition-colors ${
                  currentView === item.id 
                    ? 'bg-slate-50 text-slate-950 font-semibold border-l-4 border-amber-600' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {(isAdmin || isFirestoreEmpty) && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-2 text-left font-sans text-base font-semibold py-2 rounded-lg px-3 ${
                  currentView === 'admin'
                    ? 'bg-amber-500 text-white'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                <ShieldCheck size={18} />
                <span>{isFirestoreEmpty ? 'Admin & DB Setup' : 'Admin Dashboard'}</span>
              </button>
            )}

            {/* Mobile User Authentication section */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              {user ? (
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">
                      {dbUser?.displayName || user.displayName}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">
                      Role: {dbUser?.role || 'Customer'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-red-50 hover:bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-650 tracking-wide transition-all cursor-pointer"
                  >
                    <LogOut size={12} />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    loginWithGoogle();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-all cursor-pointer shadow"
                >
                  <LogIn size={16} />
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
