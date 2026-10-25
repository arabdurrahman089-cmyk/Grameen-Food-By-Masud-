import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, MessageCircle, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, formatPrice, formatNumber, t } = useLanguage();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { cleanWhatsAppNumber } = useSettings();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.product) {
          setProduct(data.product);
          setRelated(data.related || []);
          setSelectedImage(0);
          setSelectedUnit(data.product.unit || (data.product.available_units && data.product.available_units[0]) || '১ কেজি');
          setQuantity(1);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1b4d3e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">পণ্যটি পাওয়া যায়নি</h2>
        <Link to="/shop" className="px-6 py-2.5 bg-[#1b4d3e] text-white rounded-full font-semibold">
          দোকানে ফিরে যান
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const currentPrice = product.sale_price || product.price;
  const regularPrice = product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedUnit);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const text = `আসসালামু আলাইকুম! আমি Grameen Food by MASUD থেকে "${product.name_bn}" (${selectedUnit}) - ${quantity}টি অর্ডার করতে চাই। মোট আনুমানিক মূল্য: ৳${currentPrice * quantity}।`;
    window.open(`https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-[#1b4d3e]">{t('home')}</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-[#1b4d3e]">{t('allProducts')}</Link>
        <ChevronRight size={12} />
        <Link to={`/category/${product.category_slug}`} className="hover:text-[#1b4d3e]">
          {product.category_name}
        </Link>
        <ChevronRight size={12} />
        <span className="text-[#1b4d3e] font-semibold truncate max-w-xs">{product.name_bn}</span>
      </nav>

      {/* Main Product Section: Gallery + Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
            <img
              src={(product.images && product.images[selectedImage]) || 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80'}
              alt={product.name_bn}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-[#f59e0b] text-gray-950 font-bold text-xs px-3 py-1 rounded-full shadow">
                {formatNumber(product.discount_percent)}% {t('discount')}
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-gray-400 hover:text-red-500 shadow transition cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart size={20} fill={isFavorited ? '#ef4444' : 'none'} className={isFavorited ? 'text-red-500' : ''} />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                    selectedImage === idx ? 'border-[#1b4d3e] shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Origin Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#1b4d3e] text-xs font-semibold">
                {product.category_name}
              </span>
              {product.origin && (
                <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
                  উৎস: {product.origin}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {lang === 'bn' ? product.name_bn : (product.name_en || product.name_bn)}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'}
                    className={i < Math.floor(product.rating || 5) ? 'text-amber-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-800">{formatNumber(product.rating || 4.8)}</span>
              <span className="text-xs text-gray-400">({formatNumber(product.review_count || 12)} টি রিভিউ)</span>
            </div>

            {/* Price section */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#1b4d3e]">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    {formatPrice(regularPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded">
                    সাশ্রয় {formatPrice(regularPrice - currentPrice)}
                  </span>
                </>
              )}
            </div>

            {/* Unit Selector */}
            {product.available_units && product.available_units.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  পরিমাপ / ইউনিট নির্বাচন করুন:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.available_units.map(u => (
                    <button
                      key={u}
                      onClick={() => setSelectedUnit(u)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                        selectedUnit === u
                          ? 'bg-[#1b4d3e] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Stock */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                  disabled={quantity <= 1}
                >
                  <Minus size={15} />
                </button>
                <span className="px-4 py-2 font-bold text-sm text-gray-800 min-w-10 text-center">
                  {formatNumber(quantity)}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                  disabled={quantity >= product.stock}
                >
                  <Plus size={15} />
                </button>
              </div>

              <div>
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} /> বর্তমানে স্টক আউট
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={14} /> স্টকে আছে ({formatNumber(product.stock)} {product.unit})
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <button
                onClick={() => addToCart(product, quantity, selectedUnit)}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-4 bg-[#1b4d3e] hover:bg-[#13382c] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer disabled:bg-gray-300"
              >
                <ShoppingBag size={18} />
                <span>{t('addToCart')}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-4 bg-[#f59e0b] hover:bg-[#d97706] text-gray-950 font-bold rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer disabled:bg-gray-300"
              >
                {t('buyNow')}
              </button>
            </div>

            {/* WhatsApp direct order button */}
            <button
              onClick={handleWhatsAppOrder}
              className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm transition cursor-pointer"
            >
              <MessageCircle size={18} className="text-[#25D366]" />
              <span>এই পণ্যটি WhatsApp-এ সরাসরি অর্ডার করুন</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
            <div className="flex flex-col items-center p-2 rounded-xl bg-gray-50">
              <ShieldCheck size={18} className="text-[#1b4d3e] mb-1" />
              <span>১০০% আসল খাবার</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-gray-50">
              <Truck size={18} className="text-[#1b4d3e] mb-1" />
              <span>নিরাপদ ডেলিভারি</span>
            </div>
            <div className="flex flex-col items-center p-2 rounded-xl bg-gray-50">
              <RotateCcw size={18} className="text-[#1b4d3e] mb-1" />
              <span>সহজ রিটার্ন সুবিধা</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Evidence Disclaimer (Required by Guidelines) */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle size={20} className="text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <p className="font-bold mb-0.5">নিশ্চয়তা ও সততা সংক্রান্ত বিজ্ঞপ্তি:</p>
          <p>{product.evidence_disclaimer || t('verifiedDisclaimer')}</p>
        </div>
      </div>

      {/* Tabs: Description, Ingredients, Reviews */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs">
        <div className="flex border-b border-gray-200 gap-6 text-sm font-bold text-gray-500 mb-6">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeTab === 'desc' ? 'border-[#1b4d3e] text-[#1b4d3e]' : 'border-transparent hover:text-gray-800'
            }`}
          >
            পণ্যের বিবরণ
          </button>
          <button
            onClick={() => setActiveTab('origin')}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeTab === 'origin' ? 'border-[#1b4d3e] text-[#1b4d3e]' : 'border-transparent hover:text-gray-800'
            }`}
          >
            উৎস ও উপাদান
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition cursor-pointer ${
              activeTab === 'reviews' ? 'border-[#1b4d3e] text-[#1b4d3e]' : 'border-transparent hover:text-gray-800'
            }`}
          >
            গ্রাহক মতামত ({formatNumber(product.review_count || 5)})
          </button>
        </div>

        {activeTab === 'desc' && (
          <div className="prose text-gray-700 text-sm leading-relaxed space-y-3">
            <p>{product.description_bn}</p>
            {product.description_en && (
              <p className="text-gray-500 italic pt-2">{product.description_en}</p>
            )}
          </div>
        )}

        {activeTab === 'origin' && (
          <div className="space-y-4 text-sm text-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <span className="block text-xs font-bold text-gray-400 uppercase">সংগ্রহের স্থান / জেলা:</span>
                <span className="font-semibold text-gray-800 text-base">{product.origin || 'বাংলাদেশ'}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <span className="block text-xs font-bold text-gray-400 uppercase">উপাদান:</span>
                <span className="font-semibold text-gray-800 text-base">{product.ingredients || '১০০% প্রাকৃতিক'}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              * গ্রামীণ ফুড by MASUD সরাসরি বিশ্বস্ত কৃষক, মৌয়াল ও স্থানীয় কারিগরদের তত্ত্বাবধানে পণ্য সংগ্রহ করে থাকে।
            </p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-extrabold text-[#1b4d3e]">{product.rating}</div>
                <div className="flex text-amber-400 justify-center text-xs mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
                <div className="text-[11px] text-gray-500 mt-1">ভেরিফাইড রেটিং</div>
              </div>
              <div className="flex-1 text-xs text-gray-600">
                <p>আমাদের সকল পণ্য স্থানীয় মান নিয়ন্ত্রণে পরীক্ষা করে প্যাকেজিং করা হয়।</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {lang === 'bn' ? 'সম্পর্কিত অন্যান্য পণ্য' : 'Related Products'}
            </h2>
            <Link to={`/category/${product.category_slug}`} className="text-xs sm:text-sm font-bold text-[#1b4d3e] hover:underline">
              আরও দেখুন →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
