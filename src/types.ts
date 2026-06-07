/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image: string;
  sizes: string[];
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  featured: boolean;
  createdAt?: any;
  // Customization defaults
  materials?: string[]; // e.g. ["Synthetic Wood", "Premium Teak Wood", "Museum Acrylic"]
  colors?: string[]; // e.g. ["Classic Black", "Italian Gold", "Teak Brown", "Metallic Silver"]
  averageRating?: number;
  ratingsCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface CartItem {
  id: string; // Unique CartItem ID to allow same product with different configs
  product: Product;
  selectedSize: string;
  selectedMaterial: string;
  selectedColor: string;
  customImage?: string; // local image base64 data URL
  quantity: number;
  customPrice: number; // price with options added
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number; // unit custom price
  selectedSize: string;
  selectedMaterial: string;
  selectedColor: string;
  customImage?: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: any;
  // Loyalty and coupon parameters
  pointsEarned?: number;
  pointsRedeemed?: number;
  couponApplied?: string;
  discountAmount?: number;
}

export interface Review {
  id: string;
  productId: string;
  rating: number; // 1 to 5 stars
  reviewText: string;
  customerName: string;
  customerEmail?: string;
  userId?: string;
  status: 'approved' | 'pending';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string; // e.g. VAPI200
  discountType: 'fixed' | 'percent';
  discountValue: number;
  minOrderAmount?: number;
  expiryDate?: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: any;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
}

export interface DbUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'admin';
  createdAt: any;
  loyaltyPoints?: number;
}
