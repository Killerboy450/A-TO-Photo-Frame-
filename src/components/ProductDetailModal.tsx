/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Product, Review } from '../types';
import { useFirebase } from '../context/FirebaseContext';
import { X, ShoppingCart, MessageSquare, ShieldCheck, Check, Star, Upload, Trash2 } from 'lucide-react';
import { LOCAL_SHOP_INFO } from '../data/defaultData';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, reviews, addReview, user, dbUser } = useFirebase();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [customImage, setCustomImage] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  
  // Review form states
  const [activeTab, setActiveTab] = useState<'customize' | 'reviews'>('customize');
  const [formRating, setFormRating] = useState(5);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formText, setFormText] = useState('');
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const reviewFormRef = useRef<HTMLInputElement>(null);

  if (!product) return null;

  // Set defaults on mount/change
  if (!selectedSize && product.sizes && product.sizes.length > 0) {
    setSelectedSize(product.sizes[0]);
  }
  const materialsList = product.materials || ["Synthetic Wood", "Premium Teak Wood", "Classic White Satin", "Gold Lining Gilt Edition"];
  if (!selectedMaterial && materialsList.length > 0) {
    setSelectedMaterial(materialsList[0]);
  }
  const colorsList = product.colors || ["Classic Black", "Italian Gold", "Teak Brown", "Metallic Silver"];
  if (!selectedColor && colorsList.length > 0) {
    setSelectedColor(colorsList[0]);
  }

  const isOutOfStock = product.stockStatus === 'out_of_stock';

  // Handle uploaded image for personalized frame
  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveUploaded = () => {
    setCustomImage(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Dynamic pricing calculation
  // Size increments: 1st size = standard price, index * ₹150 for larger dimensions
  const sizeIndex = product.sizes.indexOf(selectedSize);
  const sizeDelta = sizeIndex > 0 ? sizeIndex * 150 : 0;

  // Material increments
  let materialDelta = 0;
  if (selectedMaterial === "Premium Teak Wood") materialDelta = 250;
  else if (selectedMaterial === "Classic White Satin") materialDelta = 100;
  else if (selectedMaterial === "Gold Lining Gilt Edition") materialDelta = 400;

  const unitCustomPrice = product.price + sizeDelta + materialDelta;
  const totalAmount = unitCustomPrice * quantity;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(
      product, 
      selectedSize || 'Standard', 
      selectedMaterial, 
      selectedColor, 
      customImage, 
      quantity, 
      unitCustomPrice
    );
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
      onClose();
    }, 1200);
  };

  const handleWhatsAppOrder = () => {
    const size = selectedSize || 'Standard';
    const hasImageText = customImage ? "Yes (Custom Photo uploaded by Buyer)" : "No (Uses standard print stock)";
    const itemMessage = `Hello A to Z Photo Frame (Vapi, Gujarat)! I would like to place an order for:

• Product Name: ${product.name}
• Customizable Variations:
  - Dimensions: ${size}
  - Material: ${selectedMaterial}
  - Border Frame Color: ${selectedColor}
  - Frame Personal Photo: ${hasImageText}
• Quantity: ${quantity}
• Calculated Total: ₹${totalAmount} 

Could you please confirm the UPI payment code and shipping delivery slots in Vapi? Thanks!`;

    const encodedText = encodeURIComponent(itemMessage);
    const whatsappLink = `https://wa.me/${LOCAL_SHOP_INFO.whatsapp.replace(/\+/g, '')}?text=${encodedText}`;
    window.open(whatsappLink, '_blank', 'noreferrer');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;

    const reviewerName = formName.trim() || dbUser?.displayName || user?.displayName || 'Anonymous Guest';
    const reviewerEmail = formEmail.trim() || user?.email || '';

    // Standard customers can review. Admin review is auto approved, customer review is pending moderation
    const statusVal = dbUser?.role === 'admin' ? 'approved' : 'pending';

    await addReview({
      productId: product.id,
      rating: formRating,
      reviewText: formText.trim(),
      customerName: reviewerName,
      customerEmail: reviewerEmail,
      userId: user?.uid || 'guest',
      status: statusVal
    });

    setFormText('');
    setFormRating(5);
    if (statusVal === 'pending') {
      setReviewMessage('Your feedback has been submitted successfully for admin review! Thank you.');
    } else {
      setReviewMessage('Review published instantly.');
    }
    setTimeout(() => setReviewMessage(null), 4000);
  };

  // Filter approved product reviews
  const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'approved');
  const totalReviewsCount = productReviews.length;
  const averageStarsNum = totalReviewsCount > 0
    ? productReviews.reduce((sum, current) => sum + current.rating, 0) / totalReviewsCount
    : 0;
  const averageStars = totalReviewsCount > 0 ? averageStarsNum.toFixed(1) : undefined;

  // Count star distributions safely (5-star down to 1-star)
  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  productReviews.forEach(rev => {
    const r = Math.round(rev.rating);
    if (r >= 1 && r <= 5) {
      ratingCounts[r]++;
    }
  });

  const handleWriteReviewClick = () => {
    setActiveTab('reviews');
    setTimeout(() => {
      reviewFormRef.current?.focus();
      reviewFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-12 text-center sm:block sm:p-0">
        
        {/* Modal background overlay */}
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
          aria-hidden="true" 
        />

        {/* Trick browser into centering modal */}
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

        {/* Modal Container Body */}
        <div className="relative inline-block transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all my-8 w-full max-w-4xl sm:align-middle">
          
          <div className="absolute top-5 right-5 z-10 animate-bounce">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 shadow-md transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left side: Interactive Image Previewer with Overlay Frame */}
            <div>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center group shadow-inner">
                {/* Product Frame Image */}
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600'}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
                />
                
                {/* Custom superimposed photo Centered */}
                {customImage ? (
                  <div className="absolute inset-10 border-4 border-slate-50 shadow-2xl overflow-hidden flex items-center justify-center bg-slate-50 animate-fadeIn transition-all">
                    <img src={customImage} className="w-full h-full object-cover" alt="Custom photo preview" />
                  </div>
                ) : (
                  <div className="absolute top-4 left-4 right-4 bg-slate-900/40 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded text-center uppercase tracking-wider">
                    Add your personal photo below
                  </div>
                )}
              </div>

              {/* Verified delivery banner */}
              <div className="mt-4 flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200/50 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>Doorstep Courier in Vapi, Gujarat</span>
                </div>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-bold font-mono px-1.5 py-0.5 rounded">₹ Cash on Delivery</span>
              </div>
            </div>

            {/* Right side: Options and Reviews Tabs Panel */}
            <div className="flex flex-col h-full justify-between">
              <div>
                {/* Header Info */}
                <div className="border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 font-mono bg-amber-50 px-2 py-0.5 rounded">
                      {product.category} Series
                    </span>
                    {averageStars && (
                      <div className="flex items-center text-[10px] font-bold font-mono bg-yellow-50 text-amber-700 px-2 py-0.5 rounded">
                        ★ {averageStars} Stars
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      ₹{unitCustomPrice}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through font-mono">
                        ₹{product.originalPrice}
                      </span>
                    )}
                    <span className="text-xs text-slate-500 font-mono">(Custom unit cost)</span>
                  </div>
                </div>

                {/* Visual Rating & Review Summary Card */}
                <div id="product-ratings-summary" className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-5 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* Left section: Big Rating Numbers */}
                    <div className="sm:col-span-5 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-4">
                      <span className="text-4xl font-extrabold text-slate-900 font-mono">
                        {averageStars || '0.0'}
                      </span>
                      <div className="flex text-amber-500 my-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const starValue = i + 1;
                          const isFilled = starValue <= Math.round(averageStarsNum);
                          return (
                            <Star key={i} size={15} className={isFilled ? "fill-amber-400 stroke-amber-400 text-amber-450" : "text-slate-350"} />
                          );
                        })}
                      </div>
                      <span className="text-xs text-slate-500 font-semibold font-sans">
                        {totalReviewsCount} {totalReviewsCount === 1 ? 'Review' : 'Reviews'}
                      </span>
                    </div>

                    {/* Right section: Progress distribution bars */}
                    <div className="sm:col-span-7 space-y-1">
                      {[5, 4, 3, 2, 1].map(stars => {
                        const count = ratingCounts[stars];
                        const pct = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : 0;
                        return (
                          <div key={stars} className="flex items-center gap-2 text-xs">
                            <span className="w-3 text-right font-mono font-bold text-slate-600">{stars}</span>
                            <Star size={10} className="fill-amber-400 stroke-amber-400 text-amber-450" />
                            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-8 text-right font-mono text-[10px] text-slate-400">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Write a Review option */}
                  <div className="mt-3.5 pt-3.5 border-t border-slate-200/50 flex flex-col sm:flex-row gap-2 justify-between items-center text-center sm:text-left">
                    <p className="text-[11px] text-slate-500 font-sans font-medium">Have purchased this photo frame before?</p>
                    <button
                      id="write-review-btn"
                      type="button"
                      onClick={handleWriteReviewClick}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-sans text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <MessageSquare size={12} />
                      <span>Write a Review</span>
                    </button>
                  </div>
                </div>

                {/* Tabs switcher */}
                <div className="flex border-b border-slate-100 mb-4 text-xs font-bold font-mono">
                  <button 
                    onClick={() => setActiveTab('customize')}
                    className={`pb-2.5 px-4 cursor-pointer transition-colors border-b-2 -mb-px ${activeTab === 'customize' ? 'active-tab border-amber-600 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                  >
                    1. Custom Options
                  </button>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2.5 px-4 cursor-pointer transition-colors border-b-2 -mb-px relative ${activeTab === 'reviews' ? 'active-tab border-amber-600 text-amber-600' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
                  >
                    2. User Reviews ({productReviews.length})
                  </button>
                </div>

                {/* Customize tab content */}
                {activeTab === 'customize' && (
                  <div className="space-y-4 text-left">
                    {/* Dimension Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 flex justify-between font-sans">
                          <span>Frame Dimensions:</span>
                          <span className="text-[10px] text-slate-400 font-mono">Size updates unit price list</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size, index) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                                selectedSize === size
                                  ? 'bg-slate-900 border-slate-905 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {size} {index > 0 && `(+₹${index * 150})`}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Material Wood Texture Choice */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block font-sans">
                        Frame Polish Board Material:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {materialsList.map(mat => {
                          let priceLabel = "(Standard)";
                          if (mat === "Premium Teak Wood") priceLabel = "(+₹250)";
                          else if (mat === "Classic White Satin") priceLabel = "(+₹100)";
                          else if (mat === "Gold Lining Gilt Edition") priceLabel = "(+₹400)";

                          return (
                            <button
                              key={mat}
                              onClick={() => setSelectedMaterial(mat)}
                              className={`px-3 py-2 text-left rounded-xl text-xs font-medium border transition-all cursor-pointer flex flex-col justify-between ${
                                selectedMaterial === mat
                                  ? 'bg-amber-500 border-amber-400 text-white font-bold shadow-sm'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <span>{mat}</span>
                              <span className={`text-[9px] mt-0.5 ${selectedMaterial === mat ? 'text-amber-100' : 'text-slate-400 font-mono'}`}>{priceLabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Outer Border Border Color selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block font-sans">
                        Outer Matte Frame Color:
                      </label>
                      <div className="flex gap-2">
                        {colorsList.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3.5 py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                              selectedColor === color
                                ? 'bg-slate-900 border-slate-905 text-white shadow-sm'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image personal uploader container */}
                    <div className="space-y-1.5 border-t border-slate-100 pt-3 mt-1">
                      <label className="text-xs font-bold text-slate-700 flex justify-between font-sans">
                        <span>Personal Photo upload for Custom Framing:</span>
                        <span className="text-[10px] text-emerald-600 font-bold font-mono">Optional & Free</span>
                      </label>
                      {customImage ? (
                        <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                          <div className="flex items-center gap-2">
                            <div className="h-9 w-9 bg-slate-200 rounded overflow-hidden">
                              <img src={customImage} className="w-full h-full object-cover" alt="thumbnail" />
                            </div>
                            <span className="text-xs text-emerald-800 font-medium font-mono">Custom photo loaded.</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={handleRemoveUploaded} 
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-lg cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl transition-all cursor-pointer text-slate-500 hover:text-amber-600 bg-slate-50 hover:bg-slate-100 text-xs font-bold"
                        >
                          <Upload size={14} />
                          <span>Select Photo File (.jpg, .png)</span>
                          <input 
                            id="customImageUpload"
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef} 
                            onChange={handleUploadChange} 
                            className="hidden" 
                          />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Reviews tab content */}
                {activeTab === 'reviews' && (
                  <div className="space-y-4 text-left">
                    {/* Reviews List */}
                    <div className="max-h-56 overflow-y-auto pr-1 space-y-3">
                      {productReviews.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 font-mono text-xs">
                          No approved reviews yet. Be the first to review!
                        </div>
                      ) : (
                        productReviews.map(rev => (
                          <div key={rev.id} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-xl transition-colors">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-extrabold text-slate-800">{rev.customerName}</span>
                              <span className="text-[9px] font-mono text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            {/* Stars count */}
                            <div className="flex text-amber-500 text-[10px] mb-1.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={10} className={i < rev.rating ? "fill-amber-400 stroke-amber-400" : "text-slate-200"} />
                              ))}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed italic">
                              "{rev.reviewText}"
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Submit Review Form */}
                    <form onSubmit={handleReviewSubmit} className="border-t border-slate-100 pt-3 space-y-2">
                      <h4 className="text-xs font-bold text-slate-800">Submit Your Review & Rating:</h4>
                      
                      {reviewMessage && (
                        <div className="p-2 text-xs bg-emerald-55 text-emerald-800 font-medium rounded-lg text-center font-mono">
                          {reviewMessage}
                        </div>
                      )}

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">Your Rating:</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => {
                            const index = i + 1;
                            return (
                              <button
                                type="button"
                                key={index}
                                onClick={() => setFormRating(index)}
                                className="cursor-pointer text-amber-500 focus:outline-none"
                              >
                                <Star size={15} className={index <= formRating ? "fill-amber-400 stroke-amber-400" : "text-slate-300"} />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          ref={reviewFormRef}
                          id="review-form-name"
                          type="text"
                          placeholder="Name (e.g. Aarav)"
                          required
                          value={formName}
                          onChange={e => setFormName(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-amber-500"
                        />
                        <input
                          type="email"
                          placeholder="Email (optional)"
                          value={formEmail}
                          onChange={e => setFormEmail(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-amber-500"
                        />
                      </div>

                      <div className="flex gap-2">
                        <textarea
                          placeholder="Describe frame quality, texture, and wood polish..."
                          required
                          value={formText}
                          onChange={e => setFormText(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 h-10 resize-none focus:outline-amber-500"
                        />
                        <button
                          type="submit"
                          className="bg-amber-500 hover:bg-amber-600 font-bold text-xs text-white px-3.5 rounded-xl cursor-pointer"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Functional CTA Orders layout */}
              <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
                {/* Quantity + Total summary line */}
                {activeTab === 'customize' && (
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-700">Quantity:</span>
                      <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800 font-mono">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-bold text-xs cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-mono mr-1">Total:</span>
                      <span className="text-[16px] font-black text-slate-900 font-mono">₹{totalAmount}</span>
                    </div>
                  </div>
                )}

                {addedMessage ? (
                  <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 text-white py-3 px-4 text-xs font-bold font-mono">
                    <Check size={14} className="stroke-[2.5]" />
                    <span>Added {quantity} x Frame items to Digital Cart!</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer ${
                        isOutOfStock
                          ? 'bg-slate-100 border border-slate-200/50 text-slate-400 cursor-not-allowed shadow-none'
                          : 'bg-slate-950 hover:bg-slate-900 text-white'
                      }`}
                    >
                      <ShoppingCart size={14} />
                      <span>{isOutOfStock ? 'Out of Stock' : 'Add to Digital Cart'}</span>
                    </button>

                    <button
                      onClick={handleWhatsAppOrder}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer"
                    >
                      <MessageSquare size={14} />
                      <span>Buy Now on WhatsApp (Click to chat)</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
