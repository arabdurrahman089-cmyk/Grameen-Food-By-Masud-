import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Filter } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

export default function CategoryPage() {
  const { slug } = useParams();
  const { lang, formatNumber, t } = useLanguage();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch(`/api/products?category=${slug}&sort=${sortBy}`).then(res => res.json())
    ])
      .then(([catData, prodData]) => {
        if (catData.success) {
          const found = catData.categories.find(c => c.slug === slug);
          setCategory(found || { name_bn: slug, name_en: slug });
        }
        if (prodData.success) {
          setProducts(prodData.products);
        }
      })
      .finally(() => setLoading(false));
  }, [slug, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-[#1b4d3e]">{t('home')}</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-[#1b4d3e]">{t('categories')}</Link>
        <ChevronRight size={12} />
        <span className="text-[#1b4d3e] font-semibold">{category?.name_bn || slug}</span>
      </div>

      {/* Category Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#13382c] to-[#1b4d3e] text-white p-8 sm:p-12 shadow-md">
        {category?.image && (
          <img
            src={category.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
        )}
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="text-3xl sm:text-4xl">{category?.icon || '🌾'}</div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {lang === 'bn' ? category?.name_bn : (category?.name_en || category?.name_bn)}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-xl">
            {category?.description_bn || 'গ্রামবাংলার প্রাকৃতিক ও নির্ভরযোগ্য খাদ্যপণ্য সংগ্রহ।'}
          </p>
        </div>
      </div>

      {/* Sort Toolbar */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 text-xs sm:text-sm">
        <p className="text-gray-500 font-medium">
          মোট {formatNumber(products.length)} টি পণ্য পাওয়া গেছে
        </p>

        <div className="flex items-center gap-2">
          <span className="text-gray-500">ক্রমানুসার:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:border-[#1b4d3e] cursor-pointer"
          >
            <option value="newest">নতুন পণ্য</option>
            <option value="bestseller">বেস্ট সেলার</option>
            <option value="price_asc">মূল্য: কম থেকে বেশি</option>
            <option value="price_desc">মূল্য: বেশি থেকে কম</option>
            <option value="rating">রেটিং</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <p className="text-gray-500 mb-4">এই বিভাগে বর্তমানে কোনো পণ্য তালিকাভুক্ত নেই।</p>
          <Link to="/shop" className="px-6 py-2.5 bg-[#1b4d3e] text-white rounded-full text-xs font-semibold">
            অন্যান্য পণ্য দেখুন
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
