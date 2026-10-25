import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Clock, CheckCircle, Truck, Package, XCircle, Phone, MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const { lang, formatPrice, formatNumber, t } = useLanguage();

  const [orderIdInput, setOrderIdInput] = useState(searchParams.get('orderId') || '');
  const [phoneInput, setPhoneInput] = useState(searchParams.get('phone') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const statusSteps = [
    { key: 'Pending', label_bn: 'পেন্ডিং (অর্ডার গৃহীত)', label_en: 'Pending', icon: Clock },
    { key: 'Confirmed', label_bn: 'নিশ্চিত করা হয়েছে', label_en: 'Confirmed', icon: CheckCircle },
    { key: 'Processing', label_bn: 'প্যাকিং চলছে', label_en: 'Processing', icon: Package },
    { key: 'Shipped', label_bn: 'ডেলিভারিতে বের হয়েছে', label_en: 'Shipped', icon: Truck },
    { key: 'Delivered', label_bn: 'সফলভাবে ডেলিভার্ড', label_en: 'Delivered', icon: CheckCircle }
  ];

  const fetchOrder = async (id, phone) => {
    if (!id.trim()) return;
    setLoading(true);
    setErrorMessage('');
    setOrder(null);

    try {
      let url = `/api/orders/${encodeURIComponent(id.trim())}`;
      if (phone.trim()) {
        url += `?phone=${encodeURIComponent(phone.trim())}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.order) {
        setOrder(data.order);
      } else {
        setErrorMessage(data.message || 'অর্ডার নম্বর অথবা মোবাইল নম্বরটি সঠিক নয়।');
      }
    } catch {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderIdInput) {
      fetchOrder(orderIdInput, phoneInput);
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrder(orderIdInput, phoneInput);
  };

  const getStepIndex = (currentStatus) => {
    if (currentStatus === 'Cancelled') return -1;
    return statusSteps.findIndex(s => s.key.toLowerCase() === (currentStatus || '').toLowerCase());
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-[#1b4d3e]">{t('home')}</Link>
        <ChevronRight size={12} />
        <span className="text-[#1b4d3e] font-semibold">{t('trackOrder')}</span>
      </div>

      <div className="text-center max-w-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          {lang === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Order Tracking'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          আপনার অর্ডার নম্বর ও ফোন নম্বর দিয়ে বর্তমান অবস্থান ও ডেলিভারি স্ট্যাটাস জানুন।
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              অর্ডার নম্বর (Order Number) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="যেমন: GFM-10076 অথবা 10076"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e] font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
              মোবাইল নম্বর (ঐচ্ছিক নিরাপত্তা যাচাই)
            </label>
            <input
              type="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="যে নম্বর দিয়ে অর্ডার করেছিলেন (যেমন: 01711223344)"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e] font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1b4d3e] hover:bg-[#13382c] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search size={16} />
            <span>{loading ? 'অনুসন্ধান চলছে...' : 'অর্ডার ট্র্যাক করুন'}</span>
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Order Status Display */}
      {order && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-8 animate-fadeIn">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
            <div>
              <span className="text-xs text-gray-400 font-medium">অর্ডার নম্বর</span>
              <h2 className="text-xl sm:text-2xl font-mono font-bold text-[#1b4d3e]">
                {order.order_number || `#GFM-${order.id}`}
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400 font-medium">অর্ডারের তারিখ</span>
              <p className="text-sm font-semibold text-gray-700">
                {new Date(order.created_at).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Visual Progress Stepper */}
          {order.status === 'Cancelled' ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800">
              <XCircle size={24} className="text-red-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">অর্ডারটি বাতিল করা হয়েছে (Cancelled)</h4>
                <p className="text-xs mt-0.5">কোনো প্রশ্নের জন্য সরাসরি আমাদের কাস্টমার সার্ভিসে যোগাযোগ করুন।</p>
              </div>
            </div>
          ) : (
            <div className="py-4">
              <div className="relative flex items-center justify-between">
                {/* Background Line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-0" />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1b4d3e] transition-all duration-500 -z-0"
                  style={{ width: `${Math.max(0, (currentStepIdx / (statusSteps.length - 1)) * 100)}%` }}
                />

                {statusSteps.map((step, idx) => {
                  const StepIcon = step.icon;
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition shadow-xs ${
                          isDone
                            ? 'bg-[#1b4d3e] text-white'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-emerald-200 scale-110' : ''}`}
                      >
                        <StepIcon size={18} />
                      </div>
                      <span className={`text-[10px] sm:text-xs font-semibold mt-2 text-center max-w-18 ${
                        isDone ? 'text-gray-900 font-bold' : 'text-gray-400'
                      }`}>
                        {lang === 'bn' ? step.label_bn : step.label_en}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timeline History */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-bold text-sm text-gray-800 mb-3">আপডেট বিবরণ (Timeline)</h3>
              <div className="space-y-3">
                {order.timeline.map((item, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#1b4d3e] mt-1.5 shrink-0" />
                    <div>
                      <span className="font-bold text-gray-800">{item.status}</span>
                      <p className="text-gray-600">{item.note}</p>
                      <span className="text-[10px] text-gray-400">{new Date(item.time).toLocaleString('bn-BD')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recipient & Total */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="font-bold text-gray-800 block mb-1">ডেলিভারি ঠিকানা:</span>
              <p>{order.customer_name} ({order.phone})</p>
              <p>{order.address}, {order.district}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="font-bold text-gray-800 block mb-1">সর্বমোট পরিমাণ:</span>
              <p className="text-base font-bold text-[#1b4d3e]">{formatPrice(order.total_amount)}</p>
              <p>পেমেন্ট মোড: {order.payment_method === 'cash_on_delivery' ? 'ক্যাশ অন ডেলিভারি' : 'অনলাইন পেমেন্ট'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
