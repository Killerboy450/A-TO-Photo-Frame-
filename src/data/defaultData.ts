/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Category, Banner } from '../types';

export const LOCAL_SHOP_INFO = {
  name: "A to Z Photo Frame",
  owner: "Hasan Sodawala",
  phone: "+916359495943", // Styled format, authentic and active
  whatsapp: "+916359495943", // Configured directly for Vapi Gujarat order placement
  address: "No.2,Plot No.C, Shop, 7/10/1, Surya Hospital Rd, Gunjan Area, GIDC Housing Board Colony, Golden Town, GIDC, Vapi, Gujarat 396195",
  mapCoordinates: {
    lat: 20.372915230470184,
    lng: 72.92139822841061
  },
  openingHours: "Monday - Saturday: 10:00 AM - 9:00 PM (Sunday Open on Call)",
  services: [
    "Custom Photo Framing",
    "Synthetic & Natural Wood Frames",
    "Premium Acrylic Wall Art",
    "Collage & Family Memory Frames",
    "Canvas Printing & Wrapping",
    "Lamination & Textured Mounting"
  ],
  seoKeywords: [
    "Photo frame shop in Vapi",
    "Custom frame store in Gujarat",
    "Buy photo frames near me",
    "Acrylic prints Vapi",
    "Collage frames gift Vapi"
  ]
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-custom",
    name: "Custom Frames",
    slug: "custom",
    description: "Classic borders with high-grade synthetic wood, mountboard mats, and clear covers.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "cat-wall",
    name: "Wall & Canvas Frames",
    slug: "wall",
    description: "Decorate your living area with bold premium wall hangings and artistic stretched canvases.",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "cat-gift",
    name: "Memorial & Gift Frames",
    slug: "gift",
    description: "Intimate and meaningful desktop standees, personalized frame plates, and couple keepsakes.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "cat-acrylic",
    name: "Acrylic Floating Prints",
    slug: "acrylic",
    description: "Ultra-modern glass-like frameless print mounting with stainless steel metal wall studs.",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "cat-collage",
    name: "Collage Grid Frames",
    slug: "collage",
    description: "Blend 4 to 12 memory captures into single curated framed story wall displays.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600"
  }
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "prod-royal-teak",
    name: "Royal Teak Custom Wooden Frame",
    price: 850,
    originalPrice: 1200,
    description: "Graceful Royal Teak wood textured frame featuring clean double-mat mounting. Best suited for high-profile portrait photography and wedding captures.",
    category: "custom",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
    sizes: ["8\"x10\"", "12\"x18\"", "16\"x20\"", "24\"x36\""],
    stockStatus: "in_stock",
    featured: true
  },
  {
    id: "prod-acrylic-float",
    name: "Diamond-Gloss Frameless Acrylic",
    price: 1499,
    originalPrice: 1999,
    description: "Frameless sleek high-definition acrylic sheet with elegant flame-polished diamond borders. Includes premium heavy-duty silver wall spacers.",
    category: "acrylic",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600",
    sizes: ["12\"x18\"", "18\"x24\"", "20\"x30\"", "24\"x36\""],
    stockStatus: "in_stock",
    featured: true
  },
  {
    id: "prod-charcoal-minimal",
    name: "Matte Charcoal Contemporary Frame",
    price: 450,
    originalPrice: 600,
    description: "Ultra-modern slim border design in elegant black charcoal matte finish. Ideal for modern home posters, certificates, design sketches, or abstract landscapes.",
    category: "custom",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600",
    sizes: ["A4", "A3", "8\"x10\"", "12\"x18\""],
    stockStatus: "in_stock",
    featured: false
  },
  {
    id: "prod-vintage-gold",
    name: "Imperial Baroque Vintage Gold Frame",
    price: 1100,
    originalPrice: 1500,
    description: "Rich Victorian-inspired ornate details with real gold leaf patina brush. Perfect to add standard cultural heritage vibes to family pictures and temples.",
    category: "wall",
    image: "https://images.unsplash.com/photo-1579783922619-3838449c3f15?auto=format&fit=crop&q=80&w=600",
    sizes: ["12\"x16\"", "16\"x20\"", "20\"x30\""],
    stockStatus: "in_stock",
    featured: true
  },
  {
    id: "prod-collage-love",
    name: "Heartbeat Family 8-Photo Collage Series",
    price: 1250,
    originalPrice: 1750,
    description: "Custom-made aesthetic grid pattern allowing up to 8 high-resolution photos. Complemented with individual mount mats and black protective synthetic borders.",
    category: "collage",
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600",
    sizes: ["16\"x20\"", "20\"x24\"", "24\"x36\""],
    stockStatus: "in_stock",
    featured: true
  },
  {
    id: "prod-birthdays-gift",
    name: "Personalized Neon Birth Calendar Desk Frame",
    price: 399,
    originalPrice: 550,
    description: "Sleek tabletop stand frame listing baby birth credentials or wedding anniversaries, highlighting custom dates with elegant lighting layout.",
    category: "gift",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600",
    sizes: ["5\"x7\"", "6\"x8\"", "A5"],
    stockStatus: "in_stock",
    featured: false
  },
  {
    id: "prod-wooden-bento",
    name: "Classic Grid Wall Frame Bundle",
    price: 2499,
    originalPrice: 3500,
    description: "A complete set of 6 sleek matching wooden frames (2 medium, 4 small) to create your own customized gallery wall at home.",
    category: "wall",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600",
    sizes: ["Complete Set"],
    stockStatus: "in_stock",
    featured: false
  }
];

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: "ban-intro",
    title: "Vapi's Finest Custom Photo Framing Shop",
    subtitle: "Protect and elevate your beautiful milestones with robust synthetic wood frames, Diamond-Gloss acrylics, and personalized wedding memory collages.",
    imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200",
    link: "products",
    isActive: true
  },
  {
    id: "ban-offer",
    title: "Special Festive Framing Season Offer!",
    subtitle: "Avail Flat 30% OFF on bespoke custom acrylic floating panels and gallery wall bundles. Order now and get quick delivery in Vapi, Gujarat.",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200",
    link: "products?category=acrylic",
    isActive: true
  }
];
