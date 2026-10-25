import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, X, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

export default function ShopPage() {
  const { lang, t, formatNumber } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchInput, setSearchInput] = useState(searchParam);
  const [sortBy, setSortBy] = useState('newest');
  const [maxPriceFilter, setMaxPriceFilter] = useState(2000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.categories);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = `/api/products?category=${selectedCategory}&sort=${sortBy}`;
    if (searchParam) {
      url += `&search=${encodeURIComponent(searchParam)}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.success) setProducts(data.products);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, sortBy, searchParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ search: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
    setMobileFilterOpen(false);
  };

  // Filter local for price & stock
  const filteredProducts = products.filter(p => {
    const price = p.sale_price || p.price;
    if (price > maxPriceFilter) return false;
    if (inStockOnly && p.stock <= 0) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb & Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <span>{t('home')}</span>
          <ChevronRight size={12} />
          <span className="text-[#1b4d3e] font-semibold">{t('allProducts')}</span>
          {searchParam && (
            <>
              <ChevronRight size={12} />
              <span className="text-gray-700">খোঁজ: "{searchParam}"</span>
            </>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {lang === 'bn' ? 'সকল খাঁটি গ্রামীণ পণ্য' : 'All Authentic Village Products'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              মোট {formatNumber(filteredProducts.length)} টি পণ্য পাওয়া গেছে
            </p>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 shadow-xs"
          >
            <Filter size={16} />
            <span>ফিল্টার ও বাছাই</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6">
          {/* Categories */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <h3 className="font-bold text-gray-800 text-sm mb-3 pb-2 border-b border-gray-100 flex items-center justify-between">
              <span>{t('categories')}</span>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="text-xs text-[#1b4d3e] hover:underline font-normal cursor-pointer"
                >
                  রিসেট
                </button>
              )}
            </h3>

            <div className="space-y-1 text-xs sm:text-sm">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#1b4d3e] text-white font-bold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>সব ক্যাটাগরি</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === 'all' ? 'bg-white/20' : 'bg-gray-100'}`}>
                  {formatNumber(products.length)}
                </span>
              </button>

              {categories.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-[#1b4d3e] text-white font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{lang === 'bn' ? cat.name_bn : cat.name_en}</span>
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === cat.slug ? 'bg-white/20' : 'bg-gray-100'}`}>
                    {formatNumber(cat.count || 0)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
            <h3 className="font-bold text-gray-800 text-sm pb-2 border-b border-gray-100">
              মূল্য পরিসীমা (সর্বোচ্চ ৳{formatNumber(maxPriceFilter)})
            </h3>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={maxPriceFilter}
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-full accent-[#1b4d3e] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>৳ ১০০</span>
              <span>৳ ২,০০০</span>
            </div>
          </div>

          {/* In-stock toggle */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-[#1b4d3e] rounded accent-[#1b4d3e]"
              />
              <span>শুধুমাত্র ইন-স্টক পণ্য দেখান</span>
            </label>
          </div>
        </aside>

        {/* PRODUCTS AREA */}
        <main className="flex-1">
          {/* Top Sort & Search Toolbar */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="নাম বা উপাদান দিয়ে খুঁজুন..."
                className="w-full pl-3.5 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#1b4d3e]"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1b4d3e]">
                <Search size={15} />
              </button>
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs sm:text-sm">
              <span className="text-gray-500 shrink-0">ক্রমানুসার:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:border-[#1b4d3e] cursor-pointer"
              >
                <option value="newest">নতুন পণ্য আগে</option>
                <option value="bestseller">বেস্ট সেলার আগে</option>
                <option value="price_asc">মূল্য: কম থেকে বেশি</option>
                <option value="price_desc">মূল্য: বেশি থেকে কম</option>
                <option value="rating">সর্বোচ্চ রেটিং</option>
              </select>
            </div>
          </div>

          {/* Grid of products */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse space-y-3">
                  <div className="aspect-square bg-gray-200 rounded-xl" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-3">
                <Search size={28} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-1">কোনো পণ্য পাওয়া যায়নি</h3>
              <p className="text-sm text-gray-500 mb-4">
                অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড দিয়ে খুঁজুন অথবা ফিল্টার রিসেট করুন।
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchInput('');
                  setSearchParams({});
                  setMaxPriceFilter(2000);
                  setInStockOnly(false);
                }}
                className="px-5 py-2.5 bg-[#1b4d3e] text-white rounded-full text-xs font-semibold hover:bg-[#13382c] transition cursor-pointer"
              >
                সকল ফিল্টার পরিষ্কার করুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER MODAL */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-bold text-base text-gray-800">ফিল্টার ও বিভাগ</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase text-gray-400 mb-2">ক্যাটাগরি</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                      selectedCategory === 'all' ? 'bg-[#1b4d3e] text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    সব ক্যাটাগরি
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.slug}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        selectedCategory === cat.slug ? 'bg-[#1b4d3e] text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cat.icon} {lang === 'bn' ? cat.name_bn : cat.name_en}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full mt-4 py-2.5 bg-[#1b4d3e] text-white rounded-xl font-bold text-sm"
            >
              প্রয়োগ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
