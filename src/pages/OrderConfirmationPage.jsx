import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Printer, MapPin, Phone, Calendar, ArrowRight, Package, Truck, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, formatPrice, formatNumber, t } = useLanguage();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    // Fire confetti celebration on load
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    if (!order) {
      fetch(`/api/orders/${orderId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.order) {
            setOrder(data.order);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#1b4d3e] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">অর্ডারের তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">অর্ডার খুঁজে পাওয়া যায়নি</h2>
        <Link to="/" className="px-6 py-2.5 bg-[#1b4d3e] text-white rounded-full font-bold">
          হোমপেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Celebration Banner */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-xs text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 text-[#1b4d3e] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={46} />
        </div>

        <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          অর্ডার স্ট্যাটাস: {order.status === 'Pending' ? 'অপেক্ষমান (Pending)' : order.status}
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          ধন্যবাদ, {order.customer_name}! আপনার অর্ডারটি সফল হয়েছে।
        </h1>

        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          আপনার অর্ডারটি আমাদের ডাটাবেজে সংরক্ষিত হয়েছে। খুব শীঘ্রই আমাদের কাস্টমার প্রতিনিধি আপনার ঠিকানায় পণ্য পাঠানোর কার্যক্রম শুরু করবেন।
        </p>

        {/* Unique Order Number Box */}
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#1b4d3e]/5 border border-[#1b4d3e]/20 rounded-2xl">
          <span className="text-xs text-gray-500 font-semibold">আপনার অর্ডার নম্বর:</span>
          <span className="text-lg font-mono font-bold text-[#1b4d3e] tracking-wider">
            {order.order_number || `#GFM-${order.id}`}
          </span>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6 print:border-none print:shadow-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">অর্ডার ইনভয়েস</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              তারিখ: {new Date(order.created_at || Date.now()).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Printer size={15} />
              <span>ইনভয়েস প্রিন্ট করুন</span>
            </button>
            <Link
              to={`/track-order?orderId=${encodeURIComponent(order.order_number || order.id)}&phone=${encodeURIComponent(order.phone)}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1b4d3e] hover:bg-[#13382c] text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Truck size={15} />
              <span>অর্ডার ট্র্যাক করুন</span>
            </Link>
          </div>
        </div>

        {/* Customer & Delivery address grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-2xl text-xs text-gray-700">
          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-1.5">
              <MapPin size={16} className="text-[#1b4d3e]" /> ডেলিভারি ঠিকানা
            </h4>
            <p className="font-semibold text-gray-800">{order.customer_name}</p>
            <p className="mt-1 leading-relaxed">{order.address}</p>
            <p className="text-gray-500 mt-1">জেলা: <span className="font-semibold text-gray-700">{order.district}</span></p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-1.5">
              <Phone size={16} className="text-[#1b4d3e]" /> যোগাযোগের তথ্য ও পেমেন্ট
            </h4>
            <p className="font-mono text-gray-800 font-semibold">{order.phone}</p>
            <p className="mt-1">
              পদ্ধতি: <span className="font-semibold">{order.payment_method === 'cash_on_delivery' ? 'ক্যাশ অন ডেলিভারি' : 'অনলাইন / মোবাইল ব্যাংকিং'}</span>
            </p>
            <p className="text-gray-500 mt-1">
              পেমেন্ট স্ট্যাটাস: <span className={`font-semibold ${order.payment_status === 'paid' ? 'text-emerald-700' : 'text-amber-800'}`}>
                {order.payment_status === 'paid' ? 'পরিশোধিত (Paid)' : 'পণ্য পাওয়ার পর পরিশোধযোগ্য (Unpaid)'}
              </span>
            </p>
          </div>
        </div>

        {/* Items List */}
        <div>
          <h4 className="font-bold text-sm text-gray-800 mb-3">অর্ডারকৃত পণ্যসমূহ</h4>
          <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
            {order.items && order.items.map((item, idx) => (
              <div key={idx} className="p-3 sm:p-4 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">একক: {item.unit || '১ কেজি'} × {formatNumber(item.quantity)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs sm:text-sm max-w-sm ml-auto">
          <div className="flex justify-between text-gray-600">
            <span>উপমোট:</span>
            <span className="font-semibold text-gray-900">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>ডেলিভারি চার্জ:</span>
            <span className="font-semibold text-gray-900">{formatPrice(order.delivery_fee)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>ছাড়:</span>
              <span className="font-semibold">- {formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-extrabold text-gray-900">
            <span>সর্বমোট বিল:</span>
            <span className="text-[#1b4d3e]">{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Action Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 print:hidden">
        <Link
          to="/"
          className="px-6 py-3 border border-[#1b4d3e] text-[#1b4d3e] hover:bg-emerald-50 rounded-full font-bold text-sm transition"
        >
          হোমে ফিরে যান
        </Link>
        <Link
          to="/shop"
          className="px-8 py-3 bg-[#1b4d3e] hover:bg-[#13382c] text-white rounded-full font-bold text-sm transition shadow-md flex items-center gap-2"
        >
          <span>আরও দেশি খাবার কিনুন</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
