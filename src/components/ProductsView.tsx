/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { DEFAULT_CATEGORIES } from '../data/defaultData';
import { Grid, Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface ProductsViewProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenQuickView: (product: Product) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ 
  selectedCategory, 
  setSelectedCategory, 
  onOpenQuickView 
}) => {
  const { products } = useFirebase();

  // Filter configurations
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'newest'>('featured');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // 3. Sorting Algorithms
    if (sortOption === 'priceAsc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'newest') {
      // Static sort simulation or chronological listing
      result.reverse();
    } else if (sortOption === 'featured') {
      // prioritize featured
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortOption]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fadeIn">
      
      {/* Search and Sort layout panel */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-50 border border-slate-200/60 p-4 rounded-2xl shadow-sm">
        
        {/* Search input bar */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search custom frames, acrylic wall panels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-205 focus:border-slate-805 bg-white py-2.5 px-3.5 pl-10 font-medium outline-none transition-all shadow-sm"
          />
          <Search size={14} className="text-slate-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Filter categories directly in sorting bar */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm text-xs text-slate-600 font-semibold font-sans">
            <ArrowUpDown size={12} />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="outline-none bg-transparent cursor-pointer font-bold focus:text-slate-900 pr-1 pl-1"
            >
              <option value="featured">Best Sellers</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

        </div>

      </div>

      {/* Catalog Grid Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Filters Categories List item */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <SlidersHorizontal size={14} />
              <span>Select Category</span>
            </h4>

            {/* Vertically mapped category triggers */}
            <div className="flex flex-col gap-1 text-xs font-semibold">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left rounded-lg py-2.5 px-3 transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Framing Products ({products.length})
              </button>
              
              {DEFAULT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left rounded-lg py-2.5 px-3 transition-colors cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.name} ({products.filter(p => p.category === cat.slug).length})
                </button>
              ))}
            </div>

          </div>

          {/* Quick contact helper block */}
          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl block text-xs">
            <h5 className="font-bold text-amber-800 font-sans">Need Custom Sizes?</h5>
            <p className="text-amber-700/80 leading-relaxed mt-1">
              If your desired canvas or photo size is not listed, we can cut a custom border specifically to your dimensions. Contact us directly on WhatsApp.
            </p>
          </div>
        </div>

        {/* Main Grid display area */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl border p-12 text-center text-slate-400 text-xs">
              <Grid size={24} className="text-amber-500 mx-auto mb-2.5 opacity-60" />
              <span>No frames matching your selected choices were found. Try choosing a different category or clear the search field.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenQuickView={onOpenQuickView}
                />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
