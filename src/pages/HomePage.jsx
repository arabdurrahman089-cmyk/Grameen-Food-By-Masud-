import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, PackageCheck, Truck, CreditCard, Headphones, Star, CheckCircle2, Sparkles, Send } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { lang, t, formatNumber } = useLanguage();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero carousel index
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  const heroSlides = [
    {
      badge: 'প্রকৃতির সেরা উপহার',
      badge_en: "Nature's Purest Gift",
      title: 'গ্রামের স্বাদ, ঘরের ভালোবাসা',
      title_en: 'Taste of Village, Love of Home',
      subtitle: 'গ্রামবাংলার ঐতিহ্যবাহী খাবার ও দেশি পণ্য এখন এক জায়গায়।',
      subtitle_en: 'Authentic traditional village foods and rural delicacies at your doorstep.',
      bgGradient: 'from-black/75 via-black/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
      ctaLink: '/shop',
      ctaText: 'এখনই কেনাকাটা করুন',
      ctaText_en: 'Shop Now'
    },
    {
      badge: 'শীতের সেরা আয়োজন',
      badge_en: 'Winter Special SAP',
      title: 'তাজা খেজুরের রস ও পাটালি গুড়',
      title_en: 'Fresh Date Palm Juice & Patali Jaggery',
      subtitle: 'যশোর ও ফরিদপুরের গাছীদের থেকে সংগৃহীত নির্ভেজাল সুমিষ্ট স্বাদ।',
      subtitle_en: 'Directly sourced from village date palms of Jessore & Faridpur.',
      bgGradient: 'from-amber-950/80 via-black/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1600&q=80',
      ctaLink: '/category/jaggery-patali',
      ctaText: 'গুড় ও রস কিনুন',
      ctaText_en: 'Explore Jaggery'
    },
    {
      badge: 'ঘানি ভাঙা খাঁটি তেল',
      badge_en: 'Wood-Pressed Pure Oil',
      title: 'কাঠের ঘানির খাঁটি সরিষার তেল ও গাভীর ঘি',
      title_en: 'Pure Wood-Pressed Mustard Oil & Cow Ghee',
      subtitle: 'গ্রামের গাভীর দুধের দানাদার ঘি ও চোখ ধাঁধানো ঝাঁঝালো দেশি সরিষার তেল।',
      subtitle_en: 'Hand-churned fragrant granular ghee and traditional cold-pressed mustard oil.',
      bgGradient: 'from-emerald-950/80 via-black/40 to-transparent',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1600&q=80',
      ctaLink: '/category/mustard-oil',
      ctaText: 'তেল ও ঘি দেখুন',
      ctaText_en: 'View Oil & Ghee'
    }
  ];

  useEffect(() => {
    // Auto slide
    const interval = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?limit=50').then(res => res.json()),
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/reviews').then(res => res.json())
    ])
      .then(([prodData, catData, revData]) => {
        if (prodData.success) setProducts(prodData.products);
        if (catData.success) setCategories(catData.categories);
        if (revData.success) setReviews(revData.reviews);
      })
      .catch(err => console.error('Error fetching data:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      setNewsletterMsg(data.message || 'সাবস্ক্রিপশন সম্পন্ন হয়েছে!');
      setNewsletterEmail('');
      setTimeout(() => setNewsletterMsg(''), 5000);
    } catch {
      setNewsletterMsg('ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const bestSellingProducts = products.filter(p => p.bestseller).slice(0, 6);
  const featuredProducts = products.filter(p => p.featured && !p.bestseller).slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. HERO SLIDER BANNER matching Image 1 */}
      <section className="relative overflow-hidden bg-gray-900 text-white min-h-[460px] sm:min-h-[520px] md:min-h-[560px] flex items-center">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center scale-105 animate-pulse-slow"
            />
            {/* Overlay Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`} />

            {/* Content Container */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center py-16">
              <div className="max-w-2xl space-y-4 sm:space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>{lang === 'bn' ? slide.badge : slide.badge_en}</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
                  {lang === 'bn' ? slide.title : slide.title_en}
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-xl text-gray-200 font-medium leading-relaxed drop-shadow">
                  {lang === 'bn' ? slide.subtitle : slide.subtitle_en}
                </p>

                {/* CTA Button matching Image 1 */}
                <div className="pt-2">
                  <Link
                    to={slide.ctaLink}
                    className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#f59e0b] hover:bg-[#d97706] text-gray-950 hover:text-black font-bold text-sm sm:text-base rounded-full shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>{lang === 'bn' ? slide.ctaText : slide.ctaText_en}</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={() => setCurrentHeroIndex(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={() => setCurrentHeroIndex(prev => (prev + 1) % heroSlides.length)}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentHeroIndex(i)}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                i === currentHeroIndex ? 'bg-amber-400 w-8' : 'bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. PRODUCT CATEGORIES (পণ্যের বিভাগ) matching Image 1 */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
              {lang === 'bn' ? 'পণ্যের বিভাগ' : 'Product Categories'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {lang === 'bn' ? 'আমাদের খাঁটি দেশি পণ্যের সমৃদ্ধ সংগ্রহ' : 'Explore authentic traditional rural categories'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3 sm:gap-4">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="flex flex-col items-center p-3 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md hover:border-[#1b4d3e]/30 transition group text-center"
            >
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden bg-gray-50 border-2 border-emerald-100 group-hover:border-[#1b4d3e] transition-colors p-0.5">
                <img
                  src={cat.image}
                  alt={cat.name_bn}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition duration-300"
                />
              </div>
              <h3 className="font-semibold text-xs sm:text-[13px] text-gray-800 mt-2.5 group-hover:text-[#1b4d3e] transition line-clamp-2">
                {lang === 'bn' ? cat.name_bn : cat.name_en}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLER PRODUCTS (বেস্ট সেলার পণ্য) matching Image 1 */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-[#1b4d3e] rounded-full inline-block"></span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
                {lang === 'bn' ? 'বেস্ট সেলার পণ্য' : 'Best Selling Products'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 pl-4.5">
              {lang === 'bn' ? 'আমাদের গ্রাহকদের সবচেয়ে পছন্দের পণ্যসমূহ' : 'Top rated authentic food items loved by customers'}
            </p>
          </div>

          <Link
            to="/shop"
            className="flex items-center gap-1 text-sm font-bold text-[#1b4d3e] hover:text-[#13382c] hover:underline"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4.5">
          {bestSellingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. SEASONAL PROMOTIONAL BANNERS GRID matching Image 1 */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Promo Card 1: খেজুরের রস ও গুড় */}
          <div className="relative rounded-2xl overflow-hidden shadow-md group min-h-[190px] flex items-center p-6 bg-gradient-to-r from-amber-900 to-amber-950 text-white">
            <img
              src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
              alt="খেজুরের রস ও গুড়"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition duration-500"
            />
            <div className="relative z-10 max-w-xs space-y-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">অফারের বিশেষত্ব</span>
              <h3 className="text-xl font-bold leading-tight">খেজুরের রস ও গুড়</h3>
              <p className="text-xs text-amber-100">শীতের সেরা উপহার</p>
              <Link
                to="/category/jaggery-patali"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white bg-black/30 hover:bg-black/50 px-3.5 py-1.5 rounded-full transition mt-2"
              >
                <span>{lang === 'bn' ? 'এখনই কিনুন' : 'Shop Now'}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Promo Card 2: দেশি মিঠাই ও মিষ্টি */}
          <div className="relative rounded-2xl overflow-hidden shadow-md group min-h-[190px] flex items-center p-6 bg-gradient-to-r from-orange-900 to-stone-900 text-white">
            <img
              src="https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80"
              alt="দেশি মিঠাই ও মিষ্টি"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition duration-500"
            />
            <div className="relative z-10 max-w-xs space-y-2">
              <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">ঘরোয়া আনন্দ</span>
              <h3 className="text-xl font-bold leading-tight">দেশি মিঠাই ও মিষ্টি</h3>
              <p className="text-xs text-orange-100">পারিবারিক আনন্দের সেরা পছন্দ</p>
              <Link
                to="/category/sweets-mithai"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-300 hover:text-white bg-black/30 hover:bg-black/50 px-3.5 py-1.5 rounded-full transition mt-2"
              >
                <span>{lang === 'bn' ? 'এখনই কিনুন' : 'Shop Now'}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Promo Card 3: আচার ও ঘরোয়া খাবার */}
          <div className="relative rounded-2xl overflow-hidden shadow-md group min-h-[190px] flex items-center p-6 bg-gradient-to-r from-emerald-950 to-stone-900 text-white">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
              alt="আচার ও ঘরোয়া খাবার"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition duration-500"
            />
            <div className="relative z-10 max-w-xs space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">জিভে জল আনা স্বাদ</span>
              <h3 className="text-xl font-bold leading-tight">আচার ও ঘরোয়া খাবার</h3>
              <p className="text-xs text-emerald-100">প্রাকৃতিক উপকরণে তৈরি</p>
              <Link
                to="/category/pickles-homemade"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white bg-black/30 hover:bg-black/50 px-3.5 py-1.5 rounded-full transition mt-2"
              >
                <span>{lang === 'bn' ? 'এখনই কিনুন' : 'Shop Now'}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PRODUCTS (বিশেষ আকর্ষণ) */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-6 bg-[#d97706] rounded-full inline-block"></span>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
                  {lang === 'bn' ? 'বিশেষ আকর্ষণ ও ঐতিহ্য' : 'Featured Traditional Items'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 pl-4.5">
                {lang === 'bn' ? 'গ্রামের কারিগর ও কৃষকদের বিশেষ যত্নে তৈরি পণ্য' : 'Handpicked artisan products from rural farmers'}
              </p>
            </div>
            <Link
              to="/shop"
              className="flex items-center gap-1 text-sm font-bold text-[#1b4d3e] hover:text-[#13382c] hover:underline"
            >
              <span>{t('viewAll')}</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. WHY CHOOSE GRAMEEN FOOD BY MASUD? matching Image 1 */}
      <section className="bg-white py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {lang === 'bn' ? 'কেন গ্রামীণ ফুড by MASUD?' : 'Why Choose Grameen Food by MASUD?'}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {lang === 'bn'
                ? 'আমরা প্রতিশ্রুতিবদ্ধ খাঁটি পণ্যের নিশ্চয়তা ও দ্রুততম ডেলিভারি সেবায়'
                : 'Committed to 100% natural authentic food, reliable packaging and customer delight'}
            </p>
          </div>

          {/* 5 pillars matching Image 1 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 text-center">
            <div className="p-5 rounded-2xl bg-[#f8faf8] border border-gray-100 hover:border-[#1b4d3e]/30 transition group flex flex-col items-center">
              <div className="w-13 h-13 rounded-full bg-emerald-100 text-[#1b4d3e] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-bold text-sm text-gray-800">১০০% দেশি পণ্য</h3>
              <p className="text-xs text-gray-500 mt-1">(স্বতন্ত্র সঞ্চার প্রাকৃতিক)</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8faf8] border border-gray-100 hover:border-[#1b4d3e]/30 transition group flex flex-col items-center">
              <div className="w-13 h-13 rounded-full bg-emerald-100 text-[#1b4d3e] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <PackageCheck size={24} />
              </div>
              <h3 className="font-bold text-sm text-gray-800">নিরাপদ প্যাকেজিং</h3>
              <p className="text-xs text-gray-500 mt-1">(খাবারের মান অক্ষুণ্ণ রাখতে)</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8faf8] border border-gray-100 hover:border-[#1b4d3e]/30 transition group flex flex-col items-center">
              <div className="w-13 h-13 rounded-full bg-emerald-100 text-[#1b4d3e] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Truck size={24} />
              </div>
              <h3 className="font-bold text-sm text-gray-800">সারা বাংলাদেশে ডেলিভারি</h3>
              <p className="text-xs text-gray-500 mt-1">(বিশ্বস্ত কুরিয়ার সার্ভিস)</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8faf8] border border-gray-100 hover:border-[#1b4d3e]/30 transition group flex flex-col items-center">
              <div className="w-13 h-13 rounded-full bg-emerald-100 text-[#1b4d3e] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <CreditCard size={24} />
              </div>
              <h3 className="font-bold text-sm text-gray-800">সহজ ও নিরাপদ পেমেন্ট</h3>
              <p className="text-xs text-gray-500 mt-1">(ক্যাশ অন ডেলিভারি ও ব্যাংকিং)</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8faf8] border border-gray-100 hover:border-[#1b4d3e]/30 transition group flex flex-col items-center col-span-2 md:col-span-1">
              <div className="w-13 h-13 rounded-full bg-emerald-100 text-[#1b4d3e] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Headphones size={24} />
              </div>
              <h3 className="font-bold text-sm text-gray-800">বিশেষ গ্রাহক সেবা</h3>
              <p className="text-xs text-gray-500 mt-1">(যেকোনো প্রশ্নে পাশে আছি)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS (আমাদের গ্রাহকদের মতামত) matching Image 1 */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
              {lang === 'bn' ? 'আমাদের গ্রাহকদের মতামত' : 'What Our Customers Say'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {lang === 'bn' ? 'খাঁটি পণ্য পেয়ে সন্তুষ্ট গ্রাহকদের অভিজ্ঞতা' : 'Real experiences from happy food lovers across Bangladesh'}
            </p>
          </div>
          <Link
            to="/about"
            className="flex items-center gap-1 text-sm font-bold text-[#1b4d3e] hover:underline"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* 3 Review Cards matching Image 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(rev => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={rev.avatar}
                    alt={rev.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{rev.author}</h4>
                    <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                      <span>📍</span> {rev.location}
                    </p>
                  </div>
                </div>

                <div className="flex text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                <p className="text-sm text-gray-700 leading-relaxed italic">
                  "{rev.comment_bn}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
                <span>{rev.date}</span>
                <span className="text-emerald-600 font-medium">✓ ভেরিফাইড ক্রেতা</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. NEWSLETTER SUBSCRIPTION BAR matching Image 1 */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#1b4d3e] rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-700/20 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-md text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              {lang === 'bn' ? 'নতুন পণ্য ও অফারের খবর পেতে সাবস্ক্রাইব করুন' : 'Subscribe for exclusive offers and fresh harvests'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1.5">
              {lang === 'bn'
                ? 'খেজুরের রস, খাঁটি গুড় বা বিশেষ ছাড়ে কোনো পণ্য আসলে সবার আগে জানবেন।'
                : 'Be the first to know when seasonal winter juice, honey or special products arrive.'}
            </p>
            {newsletterMsg && (
              <p className="text-xs font-bold text-amber-300 mt-2 animate-fadeIn">{newsletterMsg}</p>
            )}
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5 max-w-md">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder={lang === 'bn' ? 'আপনার ইমেইল লিখুন' : 'Enter your email address'}
              className="px-4 py-3 rounded-full bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 w-full sm:w-72"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#f59e0b] hover:bg-[#d97706] text-gray-950 font-bold text-sm rounded-full transition shadow-md whitespace-nowrap cursor-pointer"
            >
              {lang === 'bn' ? 'সাবস্ক্রাইব' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
