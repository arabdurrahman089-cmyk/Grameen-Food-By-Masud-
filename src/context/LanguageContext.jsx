import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  bn: {
    // Header & Navigation
    announcement: 'সারা বাংলাদেশে কুরিয়ারে ডেলিভারি | নিজের এলাকায় ক্যাশ অন ডেলিভারি | যোগাযোগ: ০১৭১২-৩৪৫৬৭৮',
    brandName: 'Grameen Food by MASUD',
    brandTagline: 'গ্রামের স্বাদ, ঘরের ভালোবাসা',
    searchPlaceholder: 'পণ্য খুঁজুন...',
    account: 'অ্যাকাউন্ট',
    wishlist: 'পছন্দের তালিকা',
    cart: 'কার্ট',
    home: 'হোম',
    allProducts: 'সব পণ্য',
    others: 'অন্যান্য',
    aboutUs: 'আমাদের সম্পর্কে',
    contact: 'যোগাযোগ',
    trackOrder: 'অর্ডার ট্র্যাক',
    categories: 'পণ্যের বিভাগ',
    
    // Home sections
    natureGift: 'প্রকৃতির সেরা উপহার',
    heroTitle: 'গ্রামের স্বাদ, ঘরের ভালোবাসা',
    heroSubtitle: 'গ্রামবাংলার ঐতিহ্যবাহী খাবার ও দেশি পণ্য এখন এক জায়গায়।',
    shopNow: 'এখনই কেনাকাটা করুন',
    exploreMore: 'আরও দেখুন',
    bestSelling: 'বেস্ট সেলার পণ্য',
    viewAll: 'সব দেখুন',
    featuredProducts: 'বিশেষ আকর্ষণ',
    whyChooseUs: 'কেন গ্রামীণ ফুড by MASUD?',
    howToOrder: 'সহজে অর্ডার করার নিয়ম',
    customerReviews: 'আমাদের গ্রাহকদের মতামত',
    subscribeNewsletter: 'নতুন পণ্য ও অফারের খবর পেতে সাবস্ক্রাইব করুন',
    subscribeBtn: 'সাবস্ক্রাইব',
    emailPlaceholder: 'আপনার ইমেইল লিখুন',
    whatsappOrder: 'WhatsApp-এ অর্ডার করুন',

    // Product Card & Details
    addToCart: 'কার্টে যোগ করুন',
    buyNow: 'এখনই কিনুন',
    inStock: 'ইন স্টক',
    lowStock: 'সীমিত স্টক',
    outOfStock: 'স্টক আউট',
    discount: 'ছাড়',
    unit: 'একক',
    origin: 'উৎস',
    ingredients: 'উপাদান',
    description: 'বিবরণ',
    relatedProducts: 'সম্পর্কিত পণ্য',
    verifiedDisclaimer: 'সতর্কতা ও নিশ্চয়তা: প্রাকৃতিক খাদ্য উপাদান। কোনো কৃত্রিম রাসায়নিক রং বা প্রিজারভেটিভ ব্যবহার করা হয়নি। চিকিৎসাগত কোনো অবাস্তব দাবি করা হয় না।',

    // Cart & Checkout
    shoppingCart: 'শপিং কার্ট',
    emptyCart: 'আপনার কার্ট খালি রয়েছে',
    subtotal: 'উপমোট',
    deliveryFee: 'ডেলিভারি চার্জ',
    grandTotal: 'সর্বমোট',
    checkout: 'অর্ডার সম্পন্ন করুন',
    customerName: 'আপনার পুরো নাম',
    phoneNumber: 'মোবাইল নম্বর',
    deliveryAddress: 'পূর্ণ ডেলিভারি ঠিকানা',
    district: 'জেলা নির্বাচন করুন',
    orderNotes: 'অতিরিক্ত নির্দেশনা (ঐচ্ছিক)',
    cashOnDelivery: 'ক্যাশ অন ডেলিভারি (COD)',
    codDescription: 'পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।',
    bkashNagad: 'বিকাশ / নগদ পেমেন্ট',
    bkashDescription: 'নিরাপদ মোবাইল ব্যাংকিংয়ের মাধ্যমে পরিশোধ করুন।',
    placeOrder: 'অর্ডার নিশ্চিত করুন',
    
    // Admin
    adminDashboard: 'ড্যাশবোর্ড',
    productManagement: 'পণ্য ব্যবস্থাপনা',
    orderManagement: 'অর্ডারসমূহ',
    inquiries: 'গ্রাহক যোগাযোগ',
    bannerManagement: 'ব্যানার ম্যানেজমেন্ট',
    deliverySettings: 'ডেলিভারি সেটিংস',
    reportsExport: 'রিপোর্ট ও এক্সপোর্ট',
    settings: 'সেটিংস',
    logout: 'লগআউট'
  },
  en: {
    announcement: 'Courier delivery all over Bangladesh | Cash on Delivery in local areas | Contact: 01712-345678',
    brandName: 'Grameen Food by MASUD',
    brandTagline: 'Taste of Village, Love of Home',
    searchPlaceholder: 'Search authentic foods...',
    account: 'Account',
    wishlist: 'Wishlist',
    cart: 'Cart',
    home: 'Home',
    allProducts: 'All Products',
    others: 'Others',
    aboutUs: 'About Us',
    contact: 'Contact',
    trackOrder: 'Track Order',
    categories: 'Product Categories',

    natureGift: "Nature's Purest Gift",
    heroTitle: 'Taste of Village, Love of Home',
    heroSubtitle: 'Traditional Bangladeshi village foods and rural delicacies at your doorstep.',
    shopNow: 'Shop Now',
    exploreMore: 'Explore More',
    bestSelling: 'Best Selling Products',
    viewAll: 'View All',
    featuredProducts: 'Featured Products',
    whyChooseUs: 'Why Choose Grameen Food by MASUD?',
    howToOrder: 'How to Order',
    customerReviews: 'What Our Customers Say',
    subscribeNewsletter: 'Subscribe for new products and seasonal offers',
    subscribeBtn: 'Subscribe',
    emailPlaceholder: 'Enter your email address',
    whatsappOrder: 'Order via WhatsApp',

    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    inStock: 'In Stock',
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    discount: 'Off',
    unit: 'Unit',
    origin: 'Origin',
    ingredients: 'Ingredients',
    description: 'Description',
    relatedProducts: 'Related Products',
    verifiedDisclaimer: 'Notice & Quality Assurance: Pure natural food ingredients. No artificial chemicals, colours, or synthetic preservatives are used. No unverified medical claims are made.',

    shoppingCart: 'Shopping Cart',
    emptyCart: 'Your cart is currently empty',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    grandTotal: 'Total Amount',
    checkout: 'Proceed to Checkout',
    customerName: 'Full Name',
    phoneNumber: 'Phone Number',
    deliveryAddress: 'Full Delivery Address',
    district: 'Select District',
    orderNotes: 'Additional Delivery Instructions (Optional)',
    cashOnDelivery: 'Cash on Delivery (COD)',
    codDescription: 'Pay with cash upon receiving your order.',
    bkashNagad: 'bKash / Nagad Payment',
    bkashDescription: 'Secure payment via mobile financial services.',
    placeOrder: 'Confirm Order',

    adminDashboard: 'Dashboard',
    productManagement: 'Product Management',
    orderManagement: 'Orders',
    inquiries: 'Inquiries',
    bannerManagement: 'Banner Management',
    deliverySettings: 'Delivery Settings',
    reportsExport: 'Reports & Export',
    settings: 'Settings',
    logout: 'Logout'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('gfm_lang') || 'bn';
  });

  useEffect(() => {
    localStorage.setItem('gfm_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['bn']?.[key] || key;
  };

  // Convert numbers to Bengali digits if Bengali language is active
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '';
    const str = num.toString();
    if (lang !== 'bn') return str;
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return str.replace(/[0-9]/g, (w) => bengaliDigits[+w]);
  };

  const formatPrice = (amount) => {
    const formatted = formatNumber(amount);
    return `৳ ${formatted}`;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, formatNumber, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
