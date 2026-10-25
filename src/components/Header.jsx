import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, Phone, Truck, MapPin, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useSettings } from '../context/SettingsContext';

export default function Header() {
  const { lang, toggleLanguage, t, formatNumber } = useLanguage();
  const { totalItemsCount, wishlist, setIsCartOpen } = useCart();
  const { isAuthenticated, adminUser } = useAdminAuth();
  const { settings, cleanPhoneNumber } = useSettings();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [othersDropdownOpen, setOthersDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navCategories = [
    { name_bn: 'চাল ও ধান', name_en: 'Rice & Paddy', slug: 'rice-paddy' },
    { name_bn: 'ডাল ও শস্য', name_en: 'Pulses & Grains', slug: 'pulses-grains' },
    { name_bn: 'মধু', name_en: 'Honey', slug: 'honey' },
    { name_bn: 'খেজুরের রস', name_en: 'Date Palm Juice', slug: 'date-juice' },
    { name_bn: 'গুড় ও পাটালি', name_en: 'Jaggery & Patali', slug: 'jaggery-patali' },
    { name_bn: 'মিঠাই ও মিষ্টি', name_en: 'Sweets', slug: 'sweets-mithai' },
  ];

  const othersCategories = [
    { name_bn: 'সরিষার তেল', name_en: 'Mustard Oil', slug: 'mustard-oil' },
    { name_bn: 'ঘি ও দুগ্ধজাত', name_en: 'Ghee & Dairy', slug: 'ghee-dairy' },
    { name_bn: 'আচার ও ঘরোয়া খাবার', name_en: 'Pickles & Homemade', slug: 'pickles-homemade' },
    { name_bn: 'অন্যান্য পণ্য', name_en: 'Other Products', slug: 'other-products' },
  ];

  return (
    <header className="w-full sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#13382c] text-[#f4ede4] text-xs py-2 px-4 border-b border-[#1b4d3e]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 font-medium">
            <span className="flex items-center gap-1.5">
              <Truck size={14} className="text-[#eab308]" />
              {lang === 'bn' ? 'সারা বাংলাদেশে কুরিয়ারে ডেলিভারি' : 'Nationwide Courier Delivery'}
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <MapPin size={14} className="text-[#eab308]" />
              {lang === 'bn' ? 'নিজের এলাকায় ক্যাশ অন ডেলিভারি' : 'Cash on Delivery in local areas'}
            </span>
            <a
              href={`tel:${cleanPhoneNumber}`}
              className="flex items-center gap-1.5 hover:text-amber-300 transition"
              title={lang === 'bn' ? 'সরাসরি কল করুন' : 'Call us directly'}
            >
              <Phone size={14} className="text-[#eab308]" />
              <span>{lang === 'bn' ? `যোগাযোগ: ${settings.phone || '০১৭১২-৩৪৫৬৭৮'}` : `Call: ${settings.phone || '01712-345678'}`}</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#1b4d3e] hover:bg-[#237651] text-[#f4ede4] font-medium transition cursor-pointer"
              title="Change Language"
            >
              <Globe size={13} className="text-[#eab308]" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-gray-700 hover:text-[#1b4d3e] focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu size={24} />
        </button>

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1b4d3e] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-[#fde047]">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-lg sm:text-2xl text-[#1b4d3e] tracking-tight">Grameen Food</span>
              <span className="text-xs sm:text-sm font-semibold text-[#b45309] uppercase tracking-wider">by MASUD</span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium tracking-wide">
              {lang === 'bn' ? 'গ্রামের স্বাদ, ঘরের ভালোবাসা' : 'Taste of Village, Love of Home'}
            </p>
          </div>
        </Link>

        {/* SEARCH BAR (Center Desktop) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg mx-6 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-4 pr-12 py-2.5 rounded-full border border-gray-300 focus:outline-none focus:border-[#1b4d3e] focus:ring-2 focus:ring-[#1b4d3e]/20 text-sm transition"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#1b4d3e] hover:bg-[#13382c] text-white flex items-center justify-center transition shadow-sm cursor-pointer"
            aria-label="Search products"
          >
            <Search size={16} />
          </button>
        </form>

        {/* RIGHT ACTIONS: Account, Wishlist, Cart */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Admin / Account */}
          <Link
            to={isAuthenticated ? '/admin' : '/admin/login'}
            className="flex items-center gap-1.5 text-gray-700 hover:text-[#1b4d3e] text-sm font-medium py-1 px-2 rounded-lg transition"
            title={isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
          >
            <div className="p-2 rounded-full bg-gray-100 group-hover:bg-grameen-50">
              <User size={18} className="text-[#1b4d3e]" />
            </div>
            <span className="hidden xl:inline">{isAuthenticated ? (adminUser?.name || 'এডমিন') : t('account')}</span>
          </Link>

          {/* Wishlist */}
          <Link
            to="/shop"
            className="hidden sm:flex items-center gap-1.5 text-gray-700 hover:text-[#1b4d3e] text-sm font-medium relative py-1 px-2 rounded-lg transition"
            title="পছন্দের তালিকা"
          >
            <div className="p-2 rounded-full bg-gray-100 relative">
              <Heart size={18} className="text-gray-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {formatNumber(wishlist.length)}
                </span>
              )}
            </div>
            <span className="hidden xl:inline">{t('wishlist')}</span>
          </Link>

          {/* Cart Button with Counter */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-[#1b4d3e] hover:bg-[#13382c] text-white px-3 sm:px-4 py-2 rounded-full shadow-sm transition group cursor-pointer"
            aria-label="View shopping cart"
          >
            <div className="relative">
              <ShoppingBag size={18} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-red-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {formatNumber(totalItemsCount)}
                </span>
              )}
            </div>
            <span className="text-xs sm:text-sm font-semibold hidden md:inline">
              {t('cart')}
            </span>
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-4 pr-11 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-[#1b4d3e] text-sm"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1b4d3e] text-white flex items-center justify-center"
            aria-label="Search"
          >
            <Search size={14} />
          </button>
        </form>
      </div>

      {/* 3. DESKTOP NAVIGATION BAR */}
      <nav className="hidden lg:block bg-[#f8faf8] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 font-semibold text-gray-700">
            <Link to="/" className="px-3.5 py-2.5 hover:text-[#1b4d3e] hover:bg-white rounded-md transition">
              {t('home')}
            </Link>
            <Link to="/shop" className="px-3.5 py-2.5 hover:text-[#1b4d3e] hover:bg-white rounded-md transition">
              {t('allProducts')}
            </Link>

            {navCategories.map(cat => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="px-3 py-2.5 hover:text-[#1b4d3e] hover:bg-white rounded-md transition whitespace-nowrap"
              >
                {lang === 'bn' ? cat.name_bn : cat.name_en}
              </Link>
            ))}

            {/* Dropdown: অন্যান্য */}
            <div className="relative">
              <button
                onClick={() => setOthersDropdownOpen(!othersDropdownOpen)}
                onBlur={() => setTimeout(() => setOthersDropdownOpen(false), 200)}
                className="flex items-center gap-1 px-3 py-2.5 hover:text-[#1b4d3e] hover:bg-white rounded-md transition cursor-pointer"
              >
                <span>{t('others')}</span>
                <ChevronDown size={14} />
              </button>

              {othersDropdownOpen && (
                <div className="absolute top-full left-0 w-52 bg-white shadow-xl rounded-lg border border-gray-100 py-2 z-50 animate-fadeIn">
                  {othersCategories.map(cat => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#eef7f3] hover:text-[#1b4d3e] transition"
                    >
                      {lang === 'bn' ? cat.name_bn : cat.name_en}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Nav Links: About, Contact, Tracking */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600">
            <Link to="/about" className="px-2.5 py-2.5 hover:text-[#1b4d3e] transition">
              {t('aboutUs')}
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/contact" className="px-2.5 py-2.5 hover:text-[#1b4d3e] transition">
              {t('contact')}
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/track-order" className="px-2.5 py-2.5 text-[#1b4d3e] hover:underline transition">
              {t('trackOrder')}
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="p-4 bg-[#1b4d3e] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Grameen Food</h3>
                  <p className="text-xs text-emerald-200">গ্রামের স্বাদ, ঘরের ভালোবাসা</p>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-full hover:bg-white/20">
                  <X size={20} />
                </button>
              </div>

              <div className="py-2 divide-y divide-gray-100 text-sm">
                <div className="px-4 py-2 font-medium">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-800 hover:text-[#1b4d3e]">
                    {t('home')}
                  </Link>
                  <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-800 hover:text-[#1b4d3e]">
                    {t('allProducts')}
                  </Link>
                  <Link to="/track-order" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#1b4d3e] font-semibold">
                    {t('trackOrder')}
                  </Link>
                </div>

                <div className="px-4 py-3">
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    {t('categories')}
                  </p>
                  {[...navCategories, ...othersCategories].map(cat => (
                    <Link
                      key={cat.slug}
                      to={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 text-gray-700 hover:text-[#1b4d3e]"
                    >
                      {lang === 'bn' ? cat.name_bn : cat.name_en}
                    </Link>
                  ))}
                </div>

                <div className="px-4 py-3 text-xs text-gray-600">
                  <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#1b4d3e]">
                    {t('aboutUs')}
                  </Link>
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#1b4d3e]">
                    {t('contact')}
                  </Link>
                  <Link to="/policy/shipping" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 hover:text-[#1b4d3e]">
                    ডেলিভারি পলিসি
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <Link
                to={isAuthenticated ? '/admin' : '/admin/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center py-2 bg-[#1b4d3e] text-white rounded-lg font-medium text-xs shadow"
              >
                {isAuthenticated ? 'এডমিন ড্যাশবোর্ড' : 'এডমিন লগইন (Admin)'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
