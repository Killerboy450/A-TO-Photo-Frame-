/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { X, Trash2, ShoppingBag, Landmark, MessageSquare, CheckCircle, Smartphone, Award, Ticket, ArrowRight, CornerDownRight } from 'lucide-react';
import { LOCAL_SHOP_INFO } from '../data/defaultData';
import { Coupon } from '../types';

interface CartDrawerProps {
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onClose }) => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    placeOrder, 
    user, 
    dbUser,
    coupons 
  } = useFirebase();

  // Form controls
  const [customerName, setCustomerName] = useState(dbUser?.displayName || user?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Coupon promo code controls
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Loyalty Points redemption controls
  const [redeemPointsChecked, setRedeemPointsChecked] = useState(false);

  // Sync details if user logs/logged in
  React.useEffect(() => {
    if (dbUser) {
      if (!customerName) setCustomerName(dbUser.displayName || '');
    }
  }, [dbUser]);

  // Total amount based on dynamic customize price
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.customPrice * item.quantity), 0);

  // Calculate Coupon discount
  let couponDiscountAmount = 0;
  if (appliedCoupon && cartSubtotal >= (appliedCoupon.minOrderAmount || 0)) {
    if (appliedCoupon.discountType === 'percent') {
      couponDiscountAmount = Math.round(cartSubtotal * (appliedCoupon.discountValue / 100));
    } else {
      couponDiscountAmount = appliedCoupon.discountValue;
    }
  }

  const priceAfterCoupon = Math.max(0, cartSubtotal - couponDiscountAmount);

  // Calculate Loyalty Points discount (1 Point = ₹1)
  const userPointsBalance = dbUser?.loyaltyPoints || 0;
  const pointsRedeemedAmount = redeemPointsChecked ? Math.min(userPointsBalance, priceAfterCoupon) : 0;

  // Grand Total to pay
  const finalPriceToPay = Math.max(0, priceAfterCoupon - pointsRedeemedAmount);

  // Estimated points earned on this checkout (10% rate)
  const pointsEstimatedToEarn = Math.floor(finalPriceToPay * 0.1);

  // Check Coupon Code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);
    if (!couponCodeInput.trim()) return;

    const matched = coupons.find(
      c => c.code.trim().toUpperCase() === couponCodeInput.trim().toUpperCase()
    );

    if (!matched) {
      setCouponError("Promo code not found. Try 'VAPI100', 'FESTIVE20', or 'WELCOME200'!");
      setAppliedCoupon(null);
      return;
    }

    if (!matched.isActive) {
      setCouponError("This promo coupon is inactive or fully claimed.");
      setAppliedCoupon(null);
      return;
    }

    if (matched.expiryDate && new Date(matched.expiryDate).getTime() < Date.now()) {
      setCouponError("This promo coupon has expired.");
      setAppliedCoupon(null);
      return;
    }

    if (cartSubtotal < (matched.minOrderAmount || 0)) {
      setCouponError(`This code requires a minimum purchase of ₹${matched.minOrderAmount}.`);
      setAppliedCoupon(null);
      return;
    }

    // Success
    setAppliedCoupon(matched);
    const resolvedDiscount = matched.discountType === 'percent' 
      ? `${matched.discountValue}% Off` 
      : `₹${matched.discountValue} Off`;
    setCouponSuccess(`Coupon code '${matched.code}' applied! Saved ${resolvedDiscount}.`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess(null);
    setCouponCodeInput('');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('Please fill out all mandatory customer checkout details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderResult = await placeOrder(
        {
          name: customerName,
          phone: customerPhone,
          address: customerAddress,
          notes: orderNotes
        },
        pointsRedeemedAmount,
        appliedCoupon?.code || '',
        couponDiscountAmount + pointsRedeemedAmount,
        finalPriceToPay
      );
      setCompletedOrder(orderResult);
    } catch (err) {
      console.error('Failed to register order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    if (!completedOrder) return;

    const itemsText = completedOrder.items.map((item: any) => 
      `• ${item.name} 
   - Size: ${item.selectedSize}
   - Polish Wood: ${item.selectedMaterial}
   - Matte Color: ${item.selectedColor}
   - Uploaded Image: ${item.customImage ? 'Yes (Personal upload)' : 'No (Standard)'}
   - Unit price: ₹${item.price} (Qty: ${item.quantity}) = ₹${item.price * item.quantity}`
    ).join('\n\n');

    const whatsappMessage = `*A TO Z PHOTO FRAME - NEW LOCAL CUSTOM ORDER INVOICE*
---------------------------------------
*Order Reference ID:* ${completedOrder.id.substring(0, 8).toUpperCase()}
*Customer Name:* ${completedOrder.customerName}
*Phone Number:* ${completedOrder.customerPhone}
*Delivery Showroom Address:* ${completedOrder.customerAddress}
${completedOrder.notes ? `*Client Design Note:* ${completedOrder.notes}\n` : ''}

*Checkout Discounts:*
- Coupon: ${completedOrder.couponApplied ? `${completedOrder.couponApplied} (-₹${completedOrder.discountAmount - (completedOrder.pointsRedeemed || 0)})` : 'None'}
- Loyalty Points Spent: ${completedOrder.pointsRedeemed ? `${completedOrder.pointsRedeemed} points (-₹${completedOrder.pointsRedeemed})` : '0 points'}
- Loyalty Points Earned: +${completedOrder.pointsEarned} points (added to account)

*Ordered Frames Detail list:*
${itemsText}

---------------------------------------
*GRAND TOTAL COST AMOUNT:* ₹${completedOrder.totalAmount}
*Payment status:* Cash on Delivery / UPI Pay on Handover

Please review custom frames design choices, upload files, and confirm estimated delivery times in Vapi, Gujarat!`;

    const encodedText = encodeURIComponent(whatsappMessage);
    const whatsappLink = `https://wa.me/${LOCAL_SHOP_INFO.whatsapp.replace(/\+/g, '')}?text=${encodedText}`;
    window.open(whatsappLink, '_blank', 'noreferrer');
    
    // Reset state & close drawer
    setCompletedOrder(null);
    setAppliedCoupon(null);
    setRedeemPointsChecked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        
        {/* Background Backdrop blur */}
        <div 
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
          aria-hidden="true" 
        />

        {/* Drawer container align right */}
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md transform bg-white shadow-2xl transition-all duration-300 animate-slideLeft">
            
            <div className="flex h-full flex-col bg-white">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-amber-600 animate-pulse" size={20} />
                  <h2 className="text-lg font-bold text-slate-900 font-sans">
                    Your Framing Cart
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X size={19} />
                </button>
              </div>

              {/* Conditionally render order completion screen */}
              {completedOrder ? (
                <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm border border-emerald-200 animate-bounce">
                    <CheckCircle size={32} className="stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Order Placed & Registered!
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      Your custom frame order has been saved successfully. Click below to share the generated invoice details on WhatsApp with our shop.
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4.5 w-full text-left space-y-2 text-xs text-slate-600 shadow-inner">
                    <p><strong>Order Ref ID:</strong> {completedOrder.id.substring(0, 12).toUpperCase()}</p>
                    <p><strong>Client Name:</strong> {completedOrder.customerName}</p>
                    <p><strong>Coupon Discount:</strong> {completedOrder.couponApplied ? `${completedOrder.couponApplied} (₹${completedOrder.discountAmount} saved)` : 'None'}</p>
                    <p className="text-sm border-t border-slate-200 pt-1.5 text-slate-900 font-bold"><strong>Subtotal Cost:</strong> ₹{completedOrder.totalAmount}</p>
                  </div>

                  <button
                    onClick={handleWhatsAppRedirect}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 text-xs font-bold shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <MessageSquare size={16} />
                    <span>Send Order Invoice to WhatsApp</span>
                  </button>
                  <p className="text-[10px] text-slate-400 font-mono italic">
                    *UPI / GPay / NetBanking or COD are processed on frame delivery back to you in Vapi!
                  </p>
                </div>
              ) : (
                <>
                  {/* Cart Active Items List */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-slate-100">
                          <ShoppingBag size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">Your cart is currently empty</p>
                          <p className="text-xs text-slate-400 mt-1 max-w-[220px]">Browse our list of premium framing custom catalog to fill your spaces.</p>
                        </div>
                        <button
                          onClick={onClose}
                          className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100/50 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {cart.map((item) => (
                          <div key={item.id} className="flex py-4 gap-4 items-start">
                            {/* Base Image with custom thumbnail or product fallback */}
                            <div className="h-16 w-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0 relative flex items-center justify-center select-none">
                              <img
                                src={item.customImage || item.product.image}
                                alt={item.product.name}
                                referrerPolicy="no-referrer"
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                              {item.customImage && (
                                <div className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-white text-[7px] py-[1px] uppercase tracking-wider font-bold text-center">
                                  Your Photo
                                </div>
                              )}
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                                  {item.product.name}
                                </h4>
                                
                                {/* Customizations breakdown tags list */}
                                <div className="mt-1 space-y-0.5 text-[9px] text-slate-500 font-mono">
                                  <div className="flex items-center gap-1 text-slate-450">
                                    <CornerDownRight size={8} />
                                    <span>Wood Polish: <strong className="text-slate-700">{item.selectedMaterial}</strong></span>
                                  </div>
                                  <div className="flex items-center gap-1 text-slate-450">
                                    <CornerDownRight size={8} />
                                    <span>Outer Border Color: <strong className="text-slate-700">{item.selectedColor}</strong></span>
                                  </div>
                                  <div className="mt-1">
                                    <span className="inline-block text-[9px] bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.5 rounded font-mono font-bold">
                                      Size: {item.selectedSize}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 text-xs">
                                  <button
                                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                    className="px-2.5 py-1 text-slate-600 font-bold cursor-pointer hover:text-slate-950"
                                  >
                                    -
                                  </button>
                                  <span className="px-1.5 text-xs font-bold font-mono text-slate-800">{item.quantity}</span>
                                  <button
                                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                    className="px-2.5 py-1 text-slate-600 font-bold cursor-pointer hover:text-slate-950"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="text-xs font-bold text-slate-900 font-mono">
                                  ₹{item.customPrice * item.quantity}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="h-8 w-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors mt-auto shrink-0"
                              title="Remove item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Checkout Footer container */}
                  {cart.length > 0 && (
                    <div className="border-t border-slate-200 bg-slate-50 p-5 space-y-4 max-h-[64%] overflow-y-auto pr-3.5 shadow-inner">
                      
                      {/* Loyalty Board / Points Redemption Card */}
                      {user && dbUser && (
                        <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-start gap-2.5 shadow-xs">
                          <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600 shrink-0">
                            <Award size={16} />
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="text-xs font-bold text-slate-850">A to Z framing Points Balance</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              You have <strong>{userPointsBalance} points</strong> (1 Point = ₹1)
                            </p>
                            
                            {userPointsBalance > 0 ? (
                              <label className="flex items-center gap-1.5 mt-2 text-xs font-bold text-slate-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={redeemPointsChecked}
                                  onChange={(e) => setRedeemPointsChecked(e.target.checked)}
                                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 h-3.5 w-3.5 cursor-pointer"
                                />
                                <span className="text-[11px] text-amber-600 select-none">
                                  Redeem points for ₹{Math.min(userPointsBalance, priceAfterCoupon)} discount
                                </span>
                              </label>
                            ) : (
                              <p className="text-[9px] text-amber-500 font-semibold font-mono mt-1">Earn points immediately on purchase!</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Coupon Promotion Box */}
                      <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-xs">
                        {appliedCoupon ? (
                          <div className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-100 rounded-xl p-2 font-mono">
                            <div className="flex items-center gap-1.5 text-emerald-800">
                              <Ticket size={13} className="text-emerald-600" />
                              <span>Code <strong>{appliedCoupon.code}</strong> applied!</span>
                            </div>
                            <button 
                              type="button" 
                              onClick={handleRemoveCoupon}
                              className="text-red-500 hover:text-red-700 font-bold p-1 cursor-pointer"
                              title="Remove coupon"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleApplyCoupon} className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                placeholder="Enter coupon (e.g. WELCOME200)"
                                value={couponCodeInput}
                                onChange={e => {
                                  setCouponCodeInput(e.target.value);
                                  setCouponError(null);
                                }}
                                className="w-full text-xs rounded-xl border border-slate-205 focus:border-slate-805 bg-white py-2 px-3 pl-8 font-medium outline-none transition-all"
                              />
                              <Ticket size={12} className="text-slate-400 absolute left-2.5 top-3" />
                            </div>
                            <button
                              type="submit"
                              className="bg-slate-900 text-white rounded-xl text-xxs font-extrabold uppercase px-3 cursor-pointer hover:bg-slate-800"
                            >
                              Apply
                            </button>
                          </form>
                        )}
                        
                        {couponError && (
                          <p className="text-[9px] text-red-500 font-mono mt-1.5 text-left pl-1">{couponError}</p>
                        )}
                        {couponSuccess && !appliedCoupon && (
                          <p className="text-[9px] text-emerald-600 font-mono mt-1.5 text-left pl-1">{couponSuccess}</p>
                        )}
                      </div>

                      {/* Line Invoice summary breakdown */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs font-mono text-slate-500 space-y-1.5 text-left">
                        <div className="flex justify-between">
                          <span>Frame Subtotal:</span>
                          <span className="text-slate-900 font-medium">₹{cartSubtotal}</span>
                        </div>
                        {couponDiscountAmount > 0 && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Promo Discount:</span>
                            <span>-₹{couponDiscountAmount}</span>
                          </div>
                        )}
                        {pointsRedeemedAmount > 0 && (
                          <div className="flex justify-between text-emerald-600">
                            <span>Points Discount:</span>
                            <span>-₹{pointsRedeemedAmount}</span>
                          </div>
                        )}
                        <hr className="border-slate-100 my-1.5 border-dashed" />
                        <div className="flex justify-between text-sm font-extrabold text-slate-900 font-sans">
                          <span>Grand Total Due:</span>
                          <span className="font-mono text-amber-600">₹{finalPriceToPay}</span>
                        </div>
                        
                        {/* Point earning notification */}
                        <div className="text-[9px] text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-lg mt-2 font-mono flex items-center gap-1">
                          <CheckCircle size={10} />
                          <span>With this order, you will earn +{pointsEstimatedToEarn} loyalty points!</span>
                        </div>
                      </div>

                      {/* Checkout Client Form */}
                      <form onSubmit={handleSubmitOrder} className="space-y-3.5 border-t border-slate-200/60 pt-4">
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wide font-mono text-left">
                          Showroom Delivery Details
                        </p>
                        
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Full Customer Name *"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-205 focus:border-slate-805 bg-white py-2.5 px-3.5 font-medium outline-none transition-all shadow-sm"
                          />
                        </div>

                        <div className="relative">
                          <input
                            type="tel"
                            required
                            placeholder="Vapi WhatsApp Mob * (10 digit)"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-205 focus:border-slate-85 bg-white py-2.5 px-3.5 font-medium outline-none transition-all shadow-sm pl-8 text-slate-800"
                          />
                          <Smartphone size={13} className="text-slate-400 absolute left-3 top-3.5" />
                        </div>

                        <div>
                          <textarea
                            required
                            rows={2}
                            placeholder="Full Vapi Address (with landmark) *"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-205 focus:border-slate-85 bg-white py-2.5 px-3.5 font-medium outline-none transition-all shadow-sm resize-none"
                          />
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Frame border choices, matte glass or delivery instruction"
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            className="w-full text-xs rounded-xl border border-slate-205 focus:border-slate-85 bg-white py-2.5 px-3.5 font-medium outline-none transition-all shadow-sm"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white py-3 text-xs font-bold cursor-pointer transition-all shadow-sm"
                        >
                          <span>{isSubmitting ? 'Registering Order...' : 'Complete Custom Order'}</span>
                        </button>
                      </form>

                      <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-mono text-center pt-2">
                        <Landmark size={12} />
                        <span>UPI / GPay payment on safe doorstep hand-over</span>
                      </div>

                    </div>
                  )}
                </>
              )}

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
