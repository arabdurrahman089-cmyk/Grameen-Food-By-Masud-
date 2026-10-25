import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CheckCircle2, AlertCircle, ArrowRight, MessageCircle, ChevronRight, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const BANGLADESH_DISTRICTS = [
  'ঢাকা (Dhaka)', 'গাজীপুর (Gazipur)', 'নারায়ণগঞ্জ (Narayanganj)', 'টাঙ্গাইল (Tangail)', 
  'নরসিংদী (Narsingdi)', 'মানিকগঞ্জ (Manikganj)', 'মুন্সীগঞ্জ (Munshiganj)', 'কিশোরগঞ্জ (Kishoreganj)',
  'চট্টগ্রাম (Chattogram)', 'কক্সবাজার (Cox\'s Bazar)', 'কুমিল্লা (Cumilla)', 'ফেনী (Feni)', 
  'ব্রাহ্মণবাড়িয়া (Brahmanbaria)', 'নোয়াখালী (Noakhali)', 'চাঁদপুর (Chandpur)', 'সিলেট (Sylhet)', 
  'মৌলভীবাজার (Moulvibazar)', 'হবিগঞ্জ (Habiganj)', 'সুনামগঞ্জ (Sunamganj)', 'রাজশাহী (Rajshahi)', 
  'বগুড়া (Bogura)', 'পাবনা (Pabna)', 'সিরাজগঞ্জ (Sirajganj)', 'নাটোর (Natore)', 'নওগাঁ (Naogaon)', 
  'চাঁপাইনবাবগঞ্জ (Chapai Nawabganj)', 'দিনাজপুর (Dinajpur)', 'রংপুর (Rangpur)', 'কুড়িগ্রাম (Kurigram)', 
  'গাইবান্ধা (Gaibandha)', 'নীলফামারী (Nilphamari)', 'লালমনিরহাট (Lalmonirhat)', 'পঞ্চগড় (Panchagarh)', 
  'ঠাকুরগাঁও (Thakurgaon)', 'খুলনা (Khulna)', 'যশোর (Jashore)', 'কুষ্টিয়া (Kushtia)', 'সাতক্ষীরা (Satkhira)', 
  'বাগেরহাট (Bagerhat)', 'ঝিনাইদহ (Jhenaidah)', 'চুয়াডাঙ্গা (Chuadanga)', 'মেহেরপুর (Meherpur)', 
  'মাগুরা (Magura)', 'নড়াইল (Narail)', 'বরিশাল (Barishal)', 'পটুয়াখালী (Patuakhali)', 'ভোলা (Bhola)', 
  'পিরোজপুর (Pirojpur)', 'বরগুনা (Barguna)', 'ঝালকাঠি (Jhalokati)', 'ময়মনসিংহ (Mymensingh)', 
  'জামালপুর (Jamalpur)', 'নেত্রকোণা (Netrokona)', 'শেরপুর (Sherpur)', 'ফরিদপুর (Faridpur)', 
  'গোপালগঞ্জ (Gopalganj)', 'মাদারীপুর (Madaripur)', 'রাজবাড়ী (Rajbari)', 'শরীয়তপুর (Shariatpur)'
];

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { lang, formatPrice, formatNumber, t } = useLanguage();
  const navigate = useNavigate();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('ঢাকা (Dhaka)');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery'); // 'cash_on_delivery', 'bkash_gateway', 'whatsapp_order'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Delivery calculation: Dhaka is ৳70, Outside Dhaka is ৳130
  const isDhaka = district.includes('ঢাকা') || district.toLowerCase().includes('dhaka');
  const deliveryFee = isDhaka ? 70 : 130;
  const grandTotal = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{t('emptyCart')}</h2>
        <p className="text-sm text-gray-500 mb-6">চেকআউট করার জন্য প্রথমে কিছু পণ্য কার্টে যোগ করুন।</p>
        <Link to="/shop" className="px-6 py-3 bg-[#1b4d3e] text-white font-bold rounded-full">
          শপে যান
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!customerName.trim()) {
      setErrorMsg('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11 || (!cleanPhone.startsWith('01') && !cleanPhone.startsWith('8801'))) {
      setErrorMsg('অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 01712345678)।');
      return;
    }

    if (!address.trim() || address.trim().length < 10) {
      setErrorMsg('অনুগ্রহ করে বিস্তারিত ডেলিভারি ঠিকানা দিন (বাড়ি, রোড, এলাকা)।');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer_name: customerName.trim(),
        phone: cleanPhone,
        district,
        address: address.trim(),
        notes: notes.trim(),
        payment_method: paymentMethod,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          name: item.name_bn,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
          image: item.image
        }))
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (data.success && data.order) {
        clearCart();
        navigate(`/order-confirmation/${data.order.id || data.order.order_number}`, {
          state: { order: data.order }
        });
      } else {
        setErrorMsg(data.message || 'অর্ডার গ্রহণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setErrorMsg('সার্ভারে যোগাযোগ করা যায়নি। আপনার ইন্টারনেট চেক করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-[#1b4d3e]">{t('home')}</Link>
        <ChevronRight size={12} />
        <Link to="/cart" className="hover:text-[#1b4d3e]">{t('shoppingCart')}</Link>
        <ChevronRight size={12} />
        <span className="text-[#1b4d3e] font-semibold">{t('checkout')}</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            ডেলিভারি তথ্য ও চেকআউট
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            নিচের ফর্মটি পূরণ করে আপনার অর্ডারটি সম্পন্ন করুন।
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-sm animate-shake">
          <AlertCircle size={20} className="shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-gray-800 pb-3 border-b border-gray-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1b4d3e] text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>গ্রাহকের ঠিকানা ও তথ্য</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  আপনার নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="যেমন: মোঃ আব্দুল্লাহ"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e] focus:ring-2 focus:ring-[#1b4d3e]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="যেমন: 01712345678"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e] focus:ring-2 focus:ring-[#1b4d3e]/20 font-mono"
                />
                <p className="text-[11px] text-gray-400 mt-1">অর্ডার নিশ্চিত করতে এই নম্বরে ফোন করা হতে পারে।</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  ডেলিভারির জেলা <span className="text-red-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e] focus:ring-2 focus:ring-[#1b4d3e]/20 bg-white cursor-pointer"
                >
                  {BANGLADESH_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <p className="text-[11px] text-emerald-800 font-medium mt-1">
                  ডেলিভারি চার্জ: {isDhaka ? 'ঢাকা সিটিতে ৳৭০' : 'ঢাকার বাইরে সমগ্র বাংলাদেশে ৳১৩০'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা/উপজেলা) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="যেমন: বাড়ি # ১২, রোড # ৪, ব্লক # সি, বনানী, ঢাকা"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e] focus:ring-2 focus:ring-[#1b4d3e]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  অতিরিক্ত নির্দেশনা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="যেমন: কাঁচের বয়াম সতর্কতার সাথে পাঠাবেন"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-gray-800 pb-3 border-b border-gray-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1b4d3e] text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>পেমেন্ট পদ্ধতি নির্বাচন করুন</span>
            </h2>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition cursor-pointer ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-[#1b4d3e] bg-emerald-50/40'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                  className="mt-1 w-4 h-4 text-[#1b4d3e] accent-[#1b4d3e]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">ক্যাশ অন ডেলিভারি (Cash on Delivery)</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-[#1b4d3e]">জনপ্রিয়</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    পণ্য হাতে পেয়ে চেক করে ডেলিভারি ম্যানের কাছে মূল্য পরিশোধ করুন।
                  </p>
                </div>
              </label>

              {/* Option 2: bKash / Nagad Gateway Placeholder (Prepared Integration Point) */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition cursor-pointer ${
                  paymentMethod === 'bkash_gateway'
                    ? 'border-[#1b4d3e] bg-emerald-50/40'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bkash_gateway'}
                  onChange={() => setPaymentMethod('bkash_gateway')}
                  className="mt-1 w-4 h-4 text-[#1b4d3e] accent-[#1b4d3e]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">বিকাশ / নগদ / কার্ড (অনলাইন গেটওয়ে)</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">গেটওয়ে ইন্টিগ্রেশন মোড</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    সরাসরি বিকাশ, নগদ বা ডেবিট/ক্রেডিট কার্ডের মাধ্যমে তাৎক্ষণিক নিরাপদ পেমেন্ট।
                  </p>

                  {paymentMethod === 'bkash_gateway' && (
                    <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                      <p className="font-bold flex items-center gap-1">
                        <Lock size={12} /> নিরাপদ বাংলাদেশি গেটওয়ে সংযোগস্থল প্রস্তুত:
                      </p>
                      <p>মার্চেন্ট কি ও লাইভ ক্রেডেনশিয়াল প্রদান করা হলে এটি স্বয়ংক্রিয়ভাবে সরাসরি ব্যাংকিং নেটওয়ার্কের সাথে যুক্ত হবে। অর্ডারের পর কাস্টমার সাপোর্ট থেকে পেমেন্ট লিংক এসএমএস করা হবে।</p>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 3: WhatsApp Direct */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition cursor-pointer ${
                  paymentMethod === 'whatsapp_order'
                    ? 'border-[#1b4d3e] bg-emerald-50/40'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'whatsapp_order'}
                  onChange={() => setPaymentMethod('whatsapp_order')}
                  className="mt-1 w-4 h-4 text-[#1b4d3e] accent-[#1b4d3e]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">হোয়াটসঅ্যাপের মাধ্যমে অর্ডার ও পেমেন্ট</span>
                    <MessageCircle size={16} className="text-[#25D366]" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    অর্ডার জমা দেওয়ার পর সরাসরি হোয়াটসঅ্যাপে প্রতিনিধির সাথে কথা বলে চূড়ান্ত করুন।
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6 sticky top-24">
            <h3 className="font-bold text-gray-900 text-lg pb-3 border-b border-gray-100">
              আপনার অর্ডারের সারসংক্ষেপ
            </h3>

            {/* Items mini list */}
            <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-2">
              {cartItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 line-clamp-1">{item.name_bn}</p>
                      <p className="text-gray-400">{item.unit} × {formatNumber(item.quantity)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-3 pt-3 border-t border-gray-100 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>উপমোট (Subtotal)</span>
                <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি চার্জ ({isDhaka ? 'ঢাকা' : 'ঢাকার বাইরে'})</span>
                <span className="font-bold text-emerald-800">{formatPrice(deliveryFee)}</span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-extrabold text-gray-900">
                <span>সর্বমোট প্রদেয় বিল</span>
                <span className="text-[#1b4d3e] text-2xl">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#1b4d3e] hover:bg-[#13382c] text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
            >
              {isSubmitting ? (
                <span>অর্ডার প্রস্তুত হচ্ছে...</span>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>অর্ডার নিশ্চিত করুন ({formatPrice(grandTotal)})</span>
                </>
              )}
            </button>

            <div className="space-y-2 text-center text-xs text-gray-400 pt-2">
              <p className="flex items-center justify-center gap-1.5 text-emerald-700 font-medium">
                <Truck size={14} /> সারা দেশে ২ থেকে ৩ কর্মদিবসের মধ্যে দ্রুত ডেলিভারি
              </p>
              <p>আপনার অর্ডার নম্বর পরবর্তী পেজে প্রদান করা হবে এবং এসএমএস করা হবে।</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
