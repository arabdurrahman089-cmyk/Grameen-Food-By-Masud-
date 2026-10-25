import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function CartDrawer() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, totalItemsCount } = useCart();
  const { lang, formatPrice, formatNumber, t } = useLanguage();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 2000;
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const freePercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slideLeft">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-[#1b4d3e] text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#fde047]" />
              <h3 className="font-bold text-base sm:text-lg">
                {t('shoppingCart')} ({formatNumber(totalItemsCount)})
              </h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-emerald-100 hover:text-white hover:bg-white/20 transition cursor-pointer"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free delivery bar */}
          <div className="p-3 bg-emerald-50 border-b border-emerald-100 text-xs">
            {remainingForFree > 0 ? (
              <p className="text-emerald-900 font-medium mb-1.5">
                {lang === 'bn' ? (
                  <>আর মাত্র <span className="font-bold text-[#b45309]">{formatPrice(remainingForFree)}</span> টাকার অর্ডার করলেই <span className="font-bold text-emerald-700">ফ্রি ডেলিভারি</span> পাবেন!</>
                ) : (
                  <>Add <span className="font-bold text-[#b45309]">{formatPrice(remainingForFree)}</span> more for <span className="font-bold text-emerald-700">Free Shipping</span>!</>
                )}
              </p>
            ) : (
              <p className="text-emerald-800 font-bold mb-1.5 flex items-center gap-1">
                🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি সুবিধা পাচ্ছেন।
              </p>
            )}
            <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#1b4d3e] h-full rounded-full transition-all duration-300"
                style={{ width: `${freePercent}%` }}
              />
            </div>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <ShoppingBag size={36} />
                </div>
                <h4 className="font-bold text-gray-700 text-lg mb-2">{t('emptyCart')}</h4>
                <p className="text-sm text-gray-500 mb-6">
                  {lang === 'bn' ? 'আমাদের খাঁটি গ্রামীণ খাদ্যপণ্য দেখতে শপ পেজে যান।' : 'Explore our authentic village products in shop.'}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1b4d3e] hover:bg-[#13382c] text-white rounded-full text-sm font-semibold transition shadow-sm cursor-pointer"
                >
                  <span>{t('shopNow')}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div
                  key={`${item.product_id}-${item.unit}-${idx}`}
                  className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 relative group"
                >
                  <img
                    src={item.image}
                    alt={item.name_bn}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
                          {lang === 'bn' ? item.name_bn : item.name_en}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product_id, item.unit)}
                          className="text-gray-400 hover:text-red-600 p-1 transition cursor-pointer"
                          title="পণ্যটি মুছে ফেলুন"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {lang === 'bn' ? 'পরিমাপ' : 'Unit'}: <span className="font-medium text-gray-700">{item.unit}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.unit, -1)}
                          className="px-2 py-1 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-gray-800">
                          {formatNumber(item.quantity)}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.unit, 1)}
                          className="px-2 py-1 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-[#1b4d3e] text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout action */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-white space-y-3">
              <div className="flex items-center justify-between text-base">
                <span className="text-gray-600 font-medium">{t('subtotal')}</span>
                <span className="font-bold text-[#1b4d3e] text-lg">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-gray-500">
                {lang === 'bn' ? '* ডেলিভারি চার্জ চেকআউটের সময় জেলার ভিত্তিতে যুক্ত হবে।' : '* Delivery charge will be calculated at checkout based on district.'}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-2.5 px-3 border border-[#1b4d3e] text-[#1b4d3e] hover:bg-[#eef7f3] rounded-xl text-sm font-semibold transition text-center cursor-pointer"
                >
                  {lang === 'bn' ? 'কার্ট ভিউ' : 'View Cart'}
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-2.5 px-3 bg-[#1b4d3e] hover:bg-[#13382c] text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t('checkout')}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
