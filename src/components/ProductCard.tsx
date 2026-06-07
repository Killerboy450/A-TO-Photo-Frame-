/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { ShoppingCart, MessageSquare, ArrowRight, Eye } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';
import { LOCAL_SHOP_INFO } from '../data/defaultData';

interface ProductCardProps {
  product: Product;
  onOpenQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenQuickView }) => {
  const { addToCart, reviews } = useFirebase();

  const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'approved');
  const avgRating = productReviews.length > 0 
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : undefined;

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isOutOfStock = product.stockStatus === 'out_of_stock';

  const handleWhatsAppDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const message = `Hello A to Z Photo Frame! I am interested in ordering:
• Product: ${product.name}
• Standard Price: ₹${product.price}
• Selected Size: ${product.sizes[0] || 'Standard'}

Could you please verify availability and custom frame delivery timelines for Vapi, Gujarat?`;

    const encodedText = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${LOCAL_SHOP_INFO.whatsapp.replace(/\+/g, '')}?text=${encodedText}`;
    window.open(whatsappLink, '_blank', 'noreferrer');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultSize = product.sizes[0] || 'Standard';
    const defaultMaterial = product.materials?.[0] || 'Synthetic Wood';
    const defaultColor = product.colors?.[0] || 'Classic Black';
    // Add default options
    addToCart(product, defaultSize, defaultMaterial, defaultColor, undefined, 1, product.price);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      
      {/* Product Image Panel */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm font-mono tracking-wider uppercase">
            {discountPercent}% OFF
          </span>
        )}

        {/* Stock status badge overlay */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 bg-slate-800/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm uppercase font-mono tracking-widest">
            Out of Stock
          </span>
        ) : product.stockStatus === 'low_stock' ? (
          <span className="absolute top-3 right-3 bg-amber-500/95 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm uppercase font-mono tracking-widest">
            Low Stock
          </span>
        ) : null}

        {/* Floating Quick view overlay button */}
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            onClick={() => onOpenQuickView(product)}
            className="flex items-center gap-1.5 rounded-xl bg-white px-4.5 py-2.5 text-xs font-bold text-slate-900 shadow-lg cursor-pointer transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-slate-50 border border-slate-205"
          >
            <Eye size={14} className="stroke-[2]" />
            <span>Inspect Details</span>
          </button>
        </div>
      </div>

      {/* Product Content Block */}
      <div className="flex flex-1 flex-col p-4.5">
        
        {/* Category Label and Sizes tags line */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
          <span className="text-[11px] font-bold text-amber-600 uppercase font-mono tracking-widest">
            {product.category}
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {product.sizes[0]} {product.sizes.length > 1 && `+${product.sizes.length - 1} sizes`}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-sans font-bold text-[15px] text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
          <button onClick={() => onOpenQuickView(product)} className="text-left cursor-pointer">
            {product.name}
          </button>
        </h3>

        {/* Dynamic Rating Stars */}
        {avgRating && (
          <div className="flex items-center gap-1 mt-1.5 mb-0.5">
            <div className="flex items-center text-amber-500 text-xs">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.round(parseFloat(avgRating)) ? "text-amber-400" : "text-slate-200"}>★</span>
              ))}
            </div>
            <span className="text-slate-600 text-[11px] font-bold font-mono ml-1">{avgRating}</span>
            <span className="text-slate-400 text-[10px]">({productReviews.length})</span>
          </div>
        )}

        {/* Description Snippet */}
        <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
          {product.description}
        </p>

        {/* Price Tag arrangement */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[17px] font-extrabold text-slate-900 font-sans">
            ₹{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through font-medium">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Trigger Controls CTAs */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2.5">
          
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold px-3 py-2.5 shadow-sm transition-all duration-200 cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-slate-900 hover:bg-slate-805 text-white'
            }`}
          >
            <ShoppingCart size={13} className="stroke-[2.5]" />
            <span>Add to Cart</span>
          </button>

          <button
            onClick={handleWhatsAppDirect}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors cursor-pointer border border-emerald-100/30"
            title="Inquire directly on WhatsApp"
          >
            <MessageSquare size={15} />
          </button>

        </div>

      </div>

    </div>
  );
};
