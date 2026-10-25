import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const { lang, formatPrice, formatNumber, t } = useLanguage();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'GRAMEEN50') {
      setDiscount(50);
      setCouponMessage('🎉 অভিনন্দন! ৳৫০ ডিসকাউন্ট যুক্ত হয়েছে।');
    } else if (couponCode.trim().toUpperCase() === 'DESHI10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setCouponMessage(`🎉 ১০% ছাড় (৳${disc}) সফলভাবে যুক্ত হয়েছে!`);
    } else {
      setCouponMessage('❌ অকার্যকর কুপন কোড। ট্রাই করুন: GRAMEEN50');
      setDiscount(0);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#1b4d3e]">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('emptyCart')}</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
          আপনার শপিং কার্টে বর্তমানে কোনো পণ্য নেই। আমাদের গ্রামবাংলার আসল স্বাদ ও খাঁটি খাবার দেখুন।
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1b4d3e] hover:bg-[#13382c] text-white font-bold rounded-full shadow-lg transition"
        >
          <span>পণ্য দেখুন ও অর্ডার করুন</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  const estimatedTotal = Math.max(0, subtotal - discount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-[#1b4d3e]">{t('home')}</Link>
        <ChevronRight size={12} />
        <span className="text-[#1b4d3e] font-semibold">{t('shoppingCart')}</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {lang === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-4 sm:p-6 shadow-xs overflow-hidden">
            <div className="divide-y divide-gray-100">
              {cartItems.map((item, idx) => (
                <div key={`${item.product_id}-${item.unit}-${idx}`} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name_bn}
                      className="w-20 h-20 object-cover rounded-2xl border border-gray-100 shrink-0"
                    />
                    <div>
                      <Link to={`/product/${item.product_id}`} className="font-bold text-gray-800 text-sm sm:text-base hover:text-[#1b4d3e]">
                        {lang === 'bn' ? item.name_bn : item.name_en}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">
                        একক: <span className="font-semibold text-gray-700">{item.unit}</span>
                      </p>
                      <p className="text-xs font-bold text-[#1b4d3e] mt-1 sm:hidden">
                        মূল্য: {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    {/* Quantity counter */}
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.unit, -1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-gray-800 min-w-8 text-center">
                        {formatNumber(item.quantity)}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.unit, 1)}
                        className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right min-w-20">
                      <p className="font-bold text-[#1b4d3e] text-base">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.product_id, item.unit)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-lg transition cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              <Link to="/shop" className="text-xs sm:text-sm font-semibold text-[#1b4d3e] hover:underline">
                ← আরও পণ্য যুক্ত করুন
              </Link>
              <button
                onClick={clearCart}
                className="text-xs text-red-500 hover:underline font-medium cursor-pointer"
              >
                কার্ট খালি করুন
              </button>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-gray-900 text-lg pb-3 border-b border-gray-100">
              অর্ডারের সংক্ষিপ্ত বিবরণ
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>ডিসকাউন্ট</span>
                  <span>- {formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>আনুমানিক ডেলিভারি</span>
                <span className="text-xs text-gray-500">পরের ধাপে নির্ধারণ হবে</span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-bold text-gray-900">
                <span>মোট (ডেলিভারি ছাড়া)</span>
                <span className="text-[#1b4d3e] text-xl">{formatPrice(estimatedTotal)}</span>
              </div>
            </div>

            {/* Coupon Box */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                কুপন কোড ব্যবহার করুন:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="যেমন: GRAMEEN50"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 uppercase focus:outline-none focus:border-[#1b4d3e]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-xl hover:bg-black transition cursor-pointer"
                >
                  প্রয়োগ
                </button>
              </div>
              {couponMessage && (
                <p className="text-[11px] font-medium mt-1.5 text-emerald-700">{couponMessage}</p>
              )}
            </form>

            {/* Proceed to checkout */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-[#1b4d3e] hover:bg-[#13382c] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('checkout')}</span>
              <ArrowRight size={18} />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>১০০% নিরাপদ ও সুরক্ষিত চেকআউট</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
