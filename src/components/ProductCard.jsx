import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { lang, formatPrice, formatNumber, t } = useLanguage();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  const currentPrice = product.sale_price || product.price;
  const regularPrice = product.price;
  const hasDiscount = product.sale_price && product.sale_price < product.price;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={(product.images && product.images[0]) || 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=600&q=80'}
            alt={product.name_bn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 bg-[#f59e0b] text-gray-900 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            {formatNumber(product.discount_percent || Math.round(((regularPrice - currentPrice) / regularPrice) * 100))}% {t('discount')}
          </span>
        )}

        {/* Wishlist toggle */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 backdrop-blur-xs transition shadow-xs cursor-pointer ${
            isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
          aria-label="Add to wishlist"
        >
          <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} />
        </button>

        {/* Stock tag if out or low */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              {t('outOfStock')}
            </span>
          </div>
        ) : isLowStock ? (
          <span className="absolute bottom-2 left-2 bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
            {t('lowStock')}
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category tag */}
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            {product.category_name || (lang === 'bn' ? 'দেশি পণ্য' : 'Authentic Food')}
          </span>

          {/* Title */}
          <Link to={`/product/${product.id}`} className="block mt-1.5">
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-snug hover:text-[#1b4d3e] transition line-clamp-2">
              {lang === 'bn' ? product.name_bn : (product.name_en || product.name_bn)}
            </h3>
          </Link>

          {/* Unit & origin */}
          <p className="text-xs text-gray-400 mt-1">
            {product.unit} {product.origin ? `• ${product.origin}` : ''}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'}
                  className={i < Math.floor(product.rating || 5) ? 'text-amber-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-500 font-medium">
              ({formatNumber(product.rating || 4.8)})
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-[#1b4d3e]">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(regularPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              isOutOfStock
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#1b4d3e] hover:bg-[#13382c] text-white shadow-xs active:scale-95'
            }`}
          >
            <ShoppingBag size={13} />
            <span className="hidden sm:inline">{t('addToCart')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
