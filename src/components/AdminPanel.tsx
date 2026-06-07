/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { 
  Database, Plus, Trash2, Edit2, ShieldAlert, Check, RefreshCw, 
  ShoppingBag, ClipboardList, Phone, Layers, Image, Eye, MessageSquare, MapPin,
  Award, Ticket, Star, Users, ShieldCheck
} from 'lucide-react';
import { Product, Category, Banner, Order, Inquiry } from '../types';
import { db } from '../lib/firebase';

export const AdminPanel: React.FC = () => {
  const {
    dbUser, isAdmin, products, categories, orders, inquiries, banners, seedStoreData,
    adminAddProduct, adminUpdateProduct, adminDeleteProduct, adminUpdateOrderStatus, adminDeleteOrder,
    adminAddCategory, adminDeleteCategory, adminAddBanner, adminUpdateBanner, adminDeleteBanner, adminDeleteInquiry,
    adminAddCoupon, adminUpdateCoupon, adminDeleteCoupon, adminModerateReview, adminDeleteReview, reviews, coupons,
    isFirestoreEmpty, adminClearAllData
  } = useFirebase();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'banners' | 'inquiries' | 'coupons' | 'reviews' | 'users'>('orders');
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [clearingLoading, setClearingLoading] = useState(false);

  // Users & Loyalty Points states
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingPointsUserId, setEditingPointsUserId] = useState<string | null>(null);
  const [pointsFormValue, setPointsFormValue] = useState<number>(0);

  // Coupon configuration states
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percent' as 'percent' | 'fixed',
    discountValue: 10,
    minOrderAmount: 200,
    usageLimit: 100,
    expiryDate: '',
  });

  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved'>('all');

  // Forms states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    originalPrice: 0,
    description: '',
    category: 'custom',
    image: '',
    sizes: '8"x10", 12"x18", 16"x20"',
    stockStatus: 'in_stock' as Product['stockStatus'],
    featured: false
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  });

  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    link: 'products',
    isActive: true
  });

  // Access screening
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-xl py-16 px-4 text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-100 mx-auto">
          <ShieldAlert size={28} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-sans">
          Access Restricted
        </h2>
        <p className="text-sm text-slate-505 mt-2 leading-relaxed">
          The administration dashboard is reserved specifically for the shop owner of A to Z Photo Frame. 
          Please sign in with the authorized owner email account <strong className="text-slate-800 font-mono">hasansodawala786@gmail.com</strong>.
        </p>
      </div>
    );
  }

  // Handle frame product saving (Add or Edit)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSizes = productForm.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const productData: Omit<Product, 'id'> = {
      name: productForm.name,
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
      description: productForm.description,
      category: productForm.category,
      image: productForm.image || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400',
      sizes: parsedSizes,
      stockStatus: productForm.stockStatus,
      featured: productForm.featured
    };

    try {
      if (editingProduct) {
        await adminUpdateProduct(editingProduct.id, productData);
        setEditingProduct(null);
      } else {
        await adminAddProduct(productData);
      }
      
      // Reset form
      setProductForm({
        name: '',
        price: 0,
        originalPrice: 0,
        description: '',
        category: 'custom',
        image: '',
        sizes: '8"x10", 12"x18", 16"x20"',
        stockStatus: 'in_stock',
        featured: false
      });
      alert(editingProduct ? 'Product frame updated successfully!' : 'New product frame added to catalog!');
    } catch (err) {
      console.error(err);
    }
  };

  // Set product form to edit mode
  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || 0,
      description: prod.description,
      category: prod.category,
      image: prod.image,
      sizes: prod.sizes.join(', '),
      stockStatus: prod.stockStatus,
      featured: prod.featured || false
    });
    // Scroll to form
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // Handle Category Submit
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name || !categoryForm.slug) return;
    try {
      await adminAddCategory(categoryForm);
      setCategoryForm({ name: '', slug: '', description: '', image: '' });
      alert('Category added successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Banner Submit
  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.imageUrl) return;
    try {
      await adminAddBanner(bannerForm);
      setBannerForm({ title: '', subtitle: '', imageUrl: '', link: 'products', isActive: true });
      alert('Banner added successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code.trim()) return;
    try {
      await adminAddCoupon({
        code: couponForm.code.trim().toUpperCase(),
        discountType: couponForm.discountType,
        discountValue: Number(couponForm.discountValue),
        minOrderAmount: Number(couponForm.minOrderAmount),
        usageLimit: Number(couponForm.usageLimit),
        usedCount: 0,
        expiryDate: couponForm.expiryDate || undefined,
        isActive: true
      });
      setCouponForm({
        code: '',
        discountType: 'percent',
        discountValue: 10,
        minOrderAmount: 205,
        usageLimit: 100,
        expiryDate: ''
      });
      alert('Dynamic promo coupon code registered successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handlePointsAdjustment = async (userId: string) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'users', userId), {
        loyaltyPoints: Number(pointsFormValue)
      });
      setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, loyaltyPoints: Number(pointsFormValue) } : u));
      setEditingPointsUserId(null);
      alert('User loyalty points balance adjusted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update points.');
    }
  };

  const loadRegisteredUsers = async () => {
    setLoadingUsers(true);
    try {
      const { collection, getDocs } = await import('firebase/firestore');
      const snap = await getDocs(collection(db, 'users'));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegisteredUsers(list);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'users') {
      loadRegisteredUsers();
    }
  }, [activeTab]);

  const handleInstantSeed = async () => {
    if (confirm('Are you sure you want to pre-populate public categories, photo frames, and active banners with standard default Indian Rupee models?')) {
      setSeedingLoading(true);
      try {
        await seedStoreData();
        alert('Store data populated successfully! Refreshing view list.');
      } catch (err) {
        console.error(err);
      } finally {
        setSeedingLoading(false);
      }
    }
  };

  const handleClearDatabase = async () => {
    if (confirm('CRITICAL WARNING: Are you sure you want to permanently DELETE all entries from your live Cloud Firestore database? This will wipe out all categories, products, banners, inquiries, orders, coupons, and customer reviews. This action CANNOT be undone!')) {
      if (confirm('SECOND CONFIRMATION: Double check! Are you absolutely sure you want to initiate a full database wipe? All categories and products you added will be deleted.')) {
        setClearingLoading(true);
        try {
          await adminClearAllData();
          alert('Database reset complete! All test data has been successfully deleted. You can start fresh now.');
        } catch (err: any) {
          console.error(err);
          alert('Failed to clear database: ' + (err.message || err));
        } finally {
          setClearingLoading(false);
        }
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* DB Empty Warning Alert */}
      {isFirestoreEmpty && (
        <div id="admin-db-empty-alert" className="mb-8 p-5 bg-amber-50/90 border border-amber-500/20 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm text-slate-800">
          <div className="text-left font-sans">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <ShieldAlert size={16} className="text-amber-600 animate-pulse" />
              <span>Cloud Firestore Database is Empty!</span>
            </div>
            <p className="text-xs mt-1 text-slate-600 max-w-2xl font-sans leading-relaxed">
              Your connected Firebase SDK is connected successfully, but has no files inside Firestore collections. The application is running seamlessly on local default frame models. Click the button to pre-populate and sync your cloud database with 1-click!
            </p>
          </div>
          <button
            type="button"
            onClick={handleInstantSeed}
            disabled={seedingLoading}
            className="flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 hover:shadow active:scale-95 text-white py-2.5 px-4 text-xs font-bold transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RefreshCw size={14} className={seedingLoading ? 'animate-spin' : ''} />
            <span>Pre-populate Cloud Database</span>
          </button>
        </div>
      )}

      {/* Top Banner administrative alerts */}
      <div className="mb-8 rounded-2xl bg-slate-900 text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500 font-bold">Showroom Manager Verified</span>
          </div>
          <h1 className="text-2xl font-black mt-1 font-sans">A to Z Photo Frame Control Terminal</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Logged in as <strong className="text-slate-200">{dbUser?.email}</strong>. This dashboard directly updates live customer views, WhatsApp invoices, and catalog configurations.
          </p>
        </div>

        {/* Quick Seed Tool for Cold Starts */}
        <div className="shrink-0 flex flex-wrap gap-3">
          <button
            onClick={handleInstantSeed}
            disabled={seedingLoading || clearingLoading}
            className="flex items-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white py-2.5 px-4 text-xs font-bold shadow cursor-pointer transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={seedingLoading ? 'animate-spin' : ''} />
            <span>Seed Default Frame Data</span>
          </button>
          
          <button
            onClick={handleClearDatabase}
            disabled={seedingLoading || clearingLoading}
            className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 text-xs font-bold shadow cursor-pointer transition-all disabled:opacity-50 font-sans"
          >
            <Trash2 size={14} className={clearingLoading ? 'animate-spin' : ''} />
            <span>Clear Live Database</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-4 mb-8">
        {[
          { id: 'orders', label: 'Customer Orders', icon: ClipboardList, badge: orders.filter(o => o.status === 'pending').length },
          { id: 'products', label: 'Frames Catalog', icon: ShoppingBag, badge: products.length },
          { id: 'categories', label: 'Categories Editor', icon: Layers, badge: categories.length },
          { id: 'banners', label: 'Homepage Promos', icon: Image, badge: banners.length },
          { id: 'inquiries', label: 'Direct Messages', icon: MessageSquare, badge: inquiries.length },
          { id: 'coupons', label: 'Discount Codes', icon: Ticket, badge: coupons.length },
          { id: 'reviews', label: 'Customer Reviews', icon: Star, badge: reviews.filter(r => r.status === 'pending').length },
          { id: 'users', label: 'Loyalty Points', icon: Users, badge: 0 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setEditingProduct(null);
            }}
            className={`flex items-center gap-2 pb-4 pt-1 px-2 font-sans text-sm font-semibold border-b-2 tracking-wide whitespace-nowrap cursor-pointer transition-all ${
              activeTab === tab.id
                ? 'border-amber-600 text-slate-905'
                : 'border-transparent text-slate-500 hover:text-slate-805 hover:border-slate-300'
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
            {tab.badge > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 text-[10px] text-white px-1 font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active Tab Screen Renderings */}
      
      {/* 1. ORDERS DASHBOARD */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Manage Customer Frame Orders</h3>
          
          {orders.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center text-slate-405 text-sm">
              No live orders registered in the system yet. Once clients checkout, their digital framing requests appear here.
            </div>
          ) : (
            <div className="grid gap-6">
              {orders.map(order => {
                const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.customerAddress)}`;
                // WhatsApp prefilled tracking link
                const trackingText = `Hello ${order.customerName}! This is Hasan from A to Z Photo Frame, Vapi. 

Thank you for your order (Ref: ${order.id.substring(0, 8).toUpperCase()}). We have updated your order status to *${order.status.toUpperCase()}*.

Your order of ₹${order.totalAmount} is being prepared. We will update you shortly regarding final home handover!`;
                const whatsappUrl = `https://wa.me/${order.customerPhone.replace(/\+/g, '')}?text=${encodeURIComponent(trackingText)}`;

                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
                    
                    {/* Unique Ref & Date Info */}
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-3">
                      <div>
                        <span className="text-[10px] font-mono bg-slate-105 border py-0.5 px-2 rounded-md font-bold text-slate-505 uppercase">
                          Ref: {order.id.substring(0, 10).toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500 ml-3">
                          Date: {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      {/* Status selectors */}
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => adminUpdateOrderStatus(order.id, e.target.value as any)}
                          className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold p-1.5 outline-none focus:border-slate-800"
                        >
                          <option value="pending">Pending Review</option>
                          <option value="processing">Processing Woodwork</option>
                          <option value="completed">Completed / Handed Over</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        
                        <button
                          onClick={() => { if(confirm('Delete order record permanently?')) adminDeleteOrder(order.id); }}
                          className="h-8 w-8 text-slate-400 hover:text-red-500 rounded hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Order Log"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Customer Specific Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-xs text-slate-655 border">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Customer</span>
                        <p className="font-bold text-slate-900 text-sm mt-0.5">{order.customerName}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Phone Contact</span>
                        <p className="font-semibold text-slate-805 mt-0.5 flex items-center gap-1">
                          <Phone size={11} />
                          {order.customerPhone}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Vapi Location Delivery Address</span>
                        <p className="font-semibold text-slate-805 mt-0.5 flex items-start gap-1 leading-relaxed">
                          <MapPin size={11} className="shrink-0 mt-0.5" />
                          <span>{order.customerAddress}</span>
                        </p>
                      </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="border border-slate-100 rounded-lg overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 font-bold border-b text-slate-705 font-mono uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="p-3">Photo Frame Model</th>
                            <th className="p-3 text-center">Selected Size</th>
                            <th className="p-3 text-center">Qty</th>
                            <th className="p-3 text-right">Calculated Indian Price</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {order.items.map((item, i) => (
                            <tr key={i}>
                              <td className="p-3 font-semibold text-slate-900">{item.name}</td>
                              <td className="p-3 text-center font-mono font-bold">{item.selectedSize}</td>
                              <td className="p-3 text-center font-bold font-mono">{item.quantity}</td>
                              <td className="p-3 text-right font-bold text-slate-900">₹{item.price * item.quantity}</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-50/60 font-bold">
                            <td colSpan={3} className="p-3 text-right text-slate-700">Total Billable Due:</td>
                            <td className="p-3 text-right text-base font-extrabold text-amber-600 font-sans">
                              ₹{order.totalAmount}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Special requests panel */}
                    {order.notes && (
                      <div className="text-xs bg-amber-50/30 border border-amber-100 p-3 rounded-lg block">
                        <strong>Custom Client Border Request:</strong> {order.notes}
                      </div>
                    )}

                    {/* Direct Admin Control Actions */}
                    <div className="pt-2 flex flex-wrap gap-3">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3.5 py-1.5 text-xs font-bold cursor-pointer transition-all"
                      >
                        <MessageSquare size={13} />
                        Update via WhatsApp
                      </a>
                      
                      <a
                        href={directionsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3.5 py-1.5 text-xs font-bold cursor-pointer transition-all"
                      >
                        <MapPin size={13} />
                        Get Navigation Route
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. PRODUCTS MANAGER */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form left */}
          <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-900 font-sans text-base">
              {editingProduct ? 'Update Frame Listing' : 'Introduce New Frame Model'}
            </h3>
            
            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Frame Model Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Royal Teak Wooden Frame"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full text-xs rounded-lg border border-slate-205 py-2.5 px-3 bg-white outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Discounted Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="850"
                    value={productForm.price || ''}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full text-xs rounded-lg border border-slate-205 py-2.5 px-3 bg-white outline-none focus:border-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Original Price (₹, optional)</label>
                  <input
                    type="number"
                    placeholder="1200"
                    value={productForm.originalPrice || ''}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full text-xs rounded-lg border border-slate-205 py-2.5 px-3 bg-white outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full text-xs rounded-lg border border-slate-205 py-2.5 px-3 bg-white outline-none focus:border-slate-800"
                  >
                    <option value="custom">Custom Frames</option>
                    <option value="wall">Wall Hangings</option>
                    <option value="gift">Memorial Gifts</option>
                    <option value="acrylic">Acrylic Prints</option>
                    <option value="collage">Collage Grids</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Stock Status *</label>
                  <select
                    value={productForm.stockStatus}
                    onChange={(e) => setProductForm({ ...productForm, stockStatus: e.target.value as any })}
                    className="w-full text-xs rounded-lg border border-slate-205 py-2.5 px-3 bg-white outline-none focus:border-slate-800"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Sizes List (comma separated) *</label>
                <input
                  type="text"
                  required
                  placeholder="8&quot;x10&quot;, 12&quot;x18&quot;, 16&quot;x20&quot;"
                  value={productForm.sizes}
                  onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                  className="w-full text-xs rounded-lg border border-slate-205 py-2.5 px-3 bg-white outline-none focus:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Product Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full text-xs rounded-lg border border-slate-205 py-2.5 px-3 bg-white outline-none focus:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description Summary *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Beautiful teak frame details with single mount mat surrounds..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full text-xs rounded-lg border border-slate-205 py-2.5 px-3 bg-white outline-none focus:border-slate-800 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 pb-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="featured-checkbox" className="font-semibold text-slate-700">
                  Feature on Home Screen carousel list
                </label>
              </div>

              <div className="flex gap-2">
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({ name: '', price: 0, originalPrice: 0, description: '', category: 'custom', image: '', sizes: '8"x10", 12"x18", 16"x20"', stockStatus: 'in_stock', featured: false });
                    }}
                    className="flex-1 rounded-lg border border-slate-200 py-2.5 text-center font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel Editing
                  </button>
                )}
                
                <button
                  type="submit"
                  className="flex-1 flex justify-center items-center gap-1 rounded-lg bg-slate-900 border hover:bg-slate-800 text-white py-2.5 font-bold cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{editingProduct ? 'Save Modifications' : 'Publish Model'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* List display right */}
          <div className="lg:col-span-7 bg-white border border-slate-200 shadow-sm p-6 rounded-2xl">
            <h3 className="font-bold text-slate-905 font-sans mb-4 text-base">Active Photo Frame Models ({products.length})</h3>
            
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 divide-y divide-slate-100">
              {products.map(prod => (
                <div key={prod.id} className="flex py-3.5 gap-4 items-start justify-between">
                  
                  <div className="flex gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="h-12 w-12 rounded object-cover border"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h4>
                      <p className="text-[10px] uppercase font-mono tracking-wider font-bold text-amber-600 mt-0.5">
                        {prod.category} | ₹{prod.price} {prod.originalPrice && `(was ₹${prod.originalPrice})`}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono tracking-widest">
                        Sizes: {prod.sizes.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditProduct(prod)}
                      className="h-7 w-7 flex items-center justify-center border border-slate-200 hover:bg-slate-50 text-slate-600 rounded cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => { if(confirm('Remove this frame product permanently?')) adminDeleteProduct(prod.id); }}
                      className="h-7 w-7 flex items-center justify-center border border-red-200 hover:bg-red-50 text-red-600 rounded cursor-pointer"
                      title="Delete Item"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* 3. CATEGORIES MANAGER */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Category Form */}
          <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Add Category</h3>
            
            <form onSubmit={handleCategorySubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traditional Metal Frames"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-205 py-2 px-3 bg-white outline-none focus:border-slate-800"
                />
              </div>
              
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Category Slug * (lowercases, no spaces)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. metal-frames"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full rounded-lg border border-slate-205 py-2 px-3 bg-white outline-none focus:border-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Illustration image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full rounded-lg border border-slate-205 py-2 px-3 bg-white outline-none focus:border-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-slate-900 border hover:bg-slate-805 text-white py-2.5 font-bold cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus size={14} />
                <span>Add Category</span>
              </button>
            </form>
          </div>

          {/* List Categories */}
          <div className="lg:col-span-7 bg-white border border-slate-205 shadow-sm p-6 rounded-2xl">
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Custom Categories List</h3>
            
            <div className="space-y-4 divide-y divide-slate-100">
              {categories.map(cat => (
                <div key={cat.id} className="flex py-3.5 gap-4 items-center justify-between">
                  <div className="flex gap-2.5 items-center">
                    <img src={cat.image} alt={cat.name} className="h-10 w-10 object-cover border rounded" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{cat.name}</h4>
                      <p className="text-[10px] font-mono text-slate-400">Slug: {cat.slug}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => { if(confirm('Delete category?')) adminDeleteCategory(cat.id); }}
                    className="h-8 w-8 text-slate-405 hover:text-red-500 rounded hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 4. HOME BANNERS EDITOR */}
      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Banner Form */}
          <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm p-6 rounded-2xl space-y-4 font-sans">
            <h3 className="font-bold text-slate-900 text-sm">Create New Promo Slider Banner</h3>
            
            <form onSubmit={handleBannerSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-750 text-slate-700">Banner Heading Title</label>
                <input
                  type="text"
                  placeholder="Framing Sale! Flat 30% OFF Today"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-205 py-2 px-3 bg-white outline-none focus:border-slate-85"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Banner Subtitle caption</label>
                <input
                  type="text"
                  placeholder="Applies to all floating acrylic sheet framing prints."
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full rounded-lg border border-slate-205 py-2 px-3 bg-white outline-none focus:border-slate-85"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Slide Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={bannerForm.imageUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  className="w-full rounded-lg border border-slate-205 py-2 px-3 bg-white outline-none focus:border-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-slate-900 border hover:bg-slate-805 text-white py-2.5 font-bold cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus size={14} />
                <span>Add Slide Banner</span>
              </button>
            </form>
          </div>

          {/* List Banners */}
          <div className="lg:col-span-7 bg-white border border-slate-250 shadow-sm p-6 rounded-2xl">
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Active Banners Sliding</h3>
            <div className="space-y-4 divide-y divide-slate-100">
              {banners.map(ban => (
                <div key={ban.id} className="flex py-3.5 gap-4 items-center justify-between">
                  <div className="flex gap-2.5 items-center">
                    <img src={ban.imageUrl} alt={ban.title} className="h-12 w-20 object-cover rounded border" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{ban.title || 'Untitled Banner'}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{ban.subtitle || 'No subtitle provided'}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => adminDeleteBanner(ban.id)}
                    className="h-8 w-8 text-slate-450 hover:text-red-500 rounded hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 5. INQUIRIES SUBMISSIONS LOG */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 font-sans">Contact Inquiries</h3>
          
          {inquiries.length === 0 ? (
            <div className="bg-slate-55 border border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-xs">
              No direct customer inquiries recorded yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {inquiries.map(inq => {
                const mailText = `Hello Hasan, replying to your inquiry message at A to Z Photo Frame.`;
                const whatsappMsg = `Hello ${inq.name}! Thank you for your inquiry: "${inq.message}". Let us connect!`;
                return (
                  <div key={inq.id} className="bg-white border text-xs p-5 rounded-xl border-slate-160 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <div>
                        <strong className="text-sm font-sans text-slate-900">{inq.name}</strong>
                        <span className="text-slate-400 ml-4 font-mono text-[10px]">
                          Submitted: {new Date(inq.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => adminDeleteInquiry(inq.id)}
                        className="text-slate-400 hover:text-red-500 h-7 w-7 rounded hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <p className="text-slate-700 leading-relaxed font-semibold bg-slate-50 p-3 rounded-lg border">
                      "{inq.message}"
                    </p>

                    <div className="flex gap-4">
                      <p className="text-slate-505">
                        <strong>Phone Contact:</strong> {inq.phone}
                      </p>
                      <p className="text-slate-505">
                        <strong>Email:</strong> {inq.email || 'N/A'}
                      </p>
                    </div>

                    {/* Responses hooks */}
                    <div className="pt-2 flex gap-3">
                      <a
                        href={`https://wa.me/${inq.phone.replace(/\+/g, '')}?text=${encodeURIComponent(whatsappMsg)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 font-bold font-sans cursor-pointer transition-all"
                      >
                        <MessageSquare size={12} />
                        Chat on WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. DISCOUNT COUPONS MANAGER */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs font-sans">
          {/* Add Coupon Form */}
          <div className="lg:col-span-5 bg-white border border-slate-200 shadow-sm p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Create Promo Coupon</h3>
            
            <form onSubmit={handleCouponSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SPECIAL30"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  className="w-full rounded-lg border border-slate-205 py-2.5 px-3 bg-white outline-none focus:border-slate-800 font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Discount Type *</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as any })}
                    className="w-full rounded-lg border border-slate-205 py-2.5 px-3 bg-white outline-none focus:border-slate-800"
                  >
                    <option value="percent font-bold">Percentage (%)</option>
                    <option value="fixed font-bold">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-205 py-2.5 px-3 bg-white outline-none focus:border-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Min Order Amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={couponForm.minOrderAmount}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-205 py-2.5 px-3 bg-white outline-none focus:border-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Usage Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={couponForm.usageLimit}
                    onChange={(e) => setCouponForm({ ...couponForm, usageLimit: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-205 py-2.5 px-3 bg-white outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Expiry Date (YYYY-MM-DD)</label>
                <input
                  type="date"
                  placeholder="e.g. 2026-12-31"
                  value={couponForm.expiryDate}
                  onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-205 py-2.5 px-3 bg-white outline-none focus:border-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-slate-900 border hover:bg-slate-800 text-white py-2.5 font-bold cursor-pointer flex items-center justify-center gap-1 font-sans text-xs"
              >
                <Plus size={14} />
                <span>Register Promo Code</span>
              </button>
            </form>
          </div>

          {/* List Coupons */}
          <div className="lg:col-span-7 bg-white border border-slate-200 shadow-sm p-6 rounded-2xl">
            <h3 className="font-bold text-slate-900 mb-4 text-sm font-sans">Active Discount Coupons</h3>
            
            {coupons.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                No active promotional codes registered. Use the panel on the left to add your first one!
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {coupons.map(coupon => (
                  <div key={coupon.id} className="flex py-3.5 gap-4 items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-700 bg-amber-50 text-xs px-2.5 py-0.5 rounded-lg border border-amber-200">
                          {coupon.code}
                        </span>
                        <span className="font-bold text-slate-900">
                          {coupon.discountType === 'percent' ? `${coupon.discountValue}% Off` : `₹${coupon.discountValue} Off`}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-[10px] text-slate-500 uppercase font-mono">
                        <span>Min Order: ₹{coupon.minOrderAmount || 0}</span>
                        <span>Used: {coupon.usageCount || 0} / {coupon.usageLimit || '∞'}</span>
                        {coupon.expiryDate && <span>Expires: {coupon.expiryDate}</span>}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => { if(confirm('Are you sure you want to delete coupon code ' + coupon.code + '?')) adminDeleteCoupon(coupon.id); }}
                      className="h-8 w-8 text-slate-400 hover:text-red-500 rounded hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete Coupon"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. CUSTOMER REVIEWS MODERATOR */}
      {activeTab === 'reviews' && (
        <div className="space-y-6 text-xs font-sans">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h3 className="text-lg font-bold text-slate-900 font-sans">Moderate Photo Frame Reviews</h3>
            
            <div className="flex gap-2">
              {(['all', 'pending', 'approved'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setReviewFilter(f)}
                  className={`px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                    reviewFilter === f
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm shadow-slate-900/10'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="capitalize">{f} Reviews</span>
                </button>
              ))}
            </div>
          </div>

          {reviews.filter(r => reviewFilter === 'all' ? true : r.status === reviewFilter).length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center text-slate-400">
              No reviews found matching status filter "{reviewFilter}".
            </div>
          ) : (
            <div className="grid gap-4">
              {reviews
                .filter(r => reviewFilter === 'all' ? true : r.status === reviewFilter)
                .map(rev => {
                  const productAssoc = products.find(p => p.id === rev.productId);
                  return (
                    <div key={rev.id} className="bg-white border border-slate-200 shadow-sm p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2 max-w-3xl text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={13} className={i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'} />
                            ))}
                          </div>
                          <strong className="text-slate-900">{rev.customerName}</strong>
                          <span className="text-slate-400 font-mono text-[10px]">{rev.customerEmail || 'No Email'}</span>
                        </div>

                        {productAssoc && (
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-sans uppercase">
                            <span>Product:</span>
                            <span className="font-bold text-slate-800 underline">{productAssoc.name}</span>
                          </div>
                        )}

                        <p className="text-slate-700 italic">"{rev.reviewText}"</p>
                        <span className="block text-[10px] text-slate-400 font-mono">Date: {new Date(rev.createdAt).toLocaleString()}</span>
                      </div>

                      <div className="flex md:flex-col justify-end items-end gap-2.5 border-t md:border-t-0 pt-3 md:pt-0 shrink-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {rev.status}
                          </span>
                          
                          {rev.status === 'pending' ? (
                            <button
                              onClick={() => adminModerateReview(rev.id, 'approved')}
                              className="flex items-center gap-1 bg-emerald-600 font-sans text-[11px] font-bold text-white px-2.5 py-1 rounded-lg hover:bg-emerald-700 transition-all cursor-pointer shadow-xs"
                            >
                              <Check size={12} />
                              <span>Approve</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => adminModerateReview(rev.id, 'pending')}
                              className="flex items-center gap-1 bg-amber-500 font-sans text-[11px] font-bold text-white px-2.5 py-1 rounded-lg hover:bg-amber-600 transition-all cursor-pointer shadow-xs"
                            >
                              <span>Unapprove</span>
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => { if(confirm('Delete review permanently?')) adminDeleteReview(rev.id); }}
                          className="flex items-center gap-1 border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-sans font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-xs"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* 8. REGISTERED USERS & LOYALTY POINTS */}
      {activeTab === 'users' && (
        <div className="space-y-6 text-xs font-sans text-left">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 border rounded-xl shadow-xs gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Adjust Loyalty Points Balances</h3>
              <p className="text-slate-500 text-xs mt-0.5">Below are all registered customer logins. Loyalty points grant proportional automated discounts on checkout (1 point = ₹1).</p>
            </div>
            
            <button
              onClick={loadRegisteredUsers}
              disabled={loadingUsers}
              className="flex items-center gap-1 border border-slate-200 hover:bg-slate-50 rounded-lg py-1.5 px-3 text-xs font-bold font-sans cursor-pointer h-9 transition-colors shrink-0"
            >
              <RefreshCw size={12} className={loadingUsers ? 'animate-spin' : ''} />
              <span>Reload Users List</span>
            </button>
          </div>

          {loadingUsers ? (
            <div className="py-10 text-center text-slate-400">Loading user profiles...</div>
          ) : registeredUsers.length === 0 ? (
            <div className="bg-slate-50 border p-10 text-center text-slate-400 rounded-xl">
              No registered user accounts found in Firestore. Loyalty points are automatically synced on purchase.
            </div>
          ) : (
            <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-slate-50 border-b font-semibold uppercase text-[10px] text-slate-500 tracking-wider">
                  <tr>
                    <th className="p-3">Customer Profile</th>
                    <th className="p-3 text-center">Role</th>
                    <th className="p-3 text-center">Loyalty Balance</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {registeredUsers.map(user => (
                    <tr key={user.id}>
                      <td className="p-3">
                        <p className="font-bold text-slate-900">{user.displayName || 'Guest User'}</p>
                        <p className="font-mono text-[10px] text-slate-400 mt-0.5">{user.email}</p>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`font-mono font-bold text-[10px] uppercase px-2 py-0.5 rounded ${
                          user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {user.role || 'customer'}
                        </span>
                      </td>
                      
                      <td className="p-3 text-center">
                        <span className="font-bold text-amber-600 bg-amber-50 py-0.5 px-2.5 rounded-md border border-amber-200">
                          {user.loyaltyPoints || 0} Points
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        {editingPointsUserId === user.id ? (
                          <div className="flex justify-end items-center gap-1.5">
                            <input
                              type="number"
                              required
                              min={0}
                              value={pointsFormValue}
                              onChange={(e) => setPointsFormValue(Number(e.target.value))}
                              className="w-20 rounded-lg border border-slate-200 py-1 px-2 text-xs bg-white text-center font-bold"
                            />
                            <button
                              onClick={() => handlePointsAdjustment(user.id)}
                              className="bg-emerald-600 text-white py-1 px-2.5 rounded-lg font-bold hover:bg-emerald-700 cursor-pointer shadow-xs"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingPointsUserId(null)}
                              className="text-slate-400 hover:text-slate-705 text-xs font-bold"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingPointsUserId(user.id);
                              setPointsFormValue(user.loyaltyPoints || 0);
                            }}
                            className="text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 py-1 px-3 border border-amber-200 rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs"
                          >
                            Update Balance
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
