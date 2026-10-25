import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, AlertCircle, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

export default function ContactUsPage() {
  const { lang, t } = useLanguage();
  const { settings, cleanWhatsAppNumber, cleanPhoneNumber, mailtoUrl } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'কিভাবে অনলাইনে অর্ডার করব?',
      a: 'ওয়েবসাইটে আপনার পছন্দমতো পণ্যের ওপর ক্লিক করে "কার্টে যোগ করুন" অথবা "এখনই কিনুন" বাটনে চাপ দিন। এরপর আপনার নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা লিখে "অর্ডার নিশ্চিত করুন" চাপলেই অর্ডার সম্পন্ন হবে।'
    },
    {
      q: 'ডেলিভারি চার্জ কত এবং কত দিনে পাব?',
      a: 'ঢাকা সিটির ভেতরে ডেলিভারি চার্জ মাত্র ৳৭০ এবং সাধারণত ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ডেলিভারি দেওয়া হয়। ঢাকার বাইরে সমগ্র বাংলাদেশে চার্জ ৳১৩০ এবং সুন্দরবন/রেডএক্স কুরিয়ারের মাধ্যমে ২ থেকে ৩ কার্যদিবসের মধ্যে পৌঁছায়।'
    },
    {
      q: 'পণ্য পছন্দ না হলে কি রিটার্ন বা রিফান্ড পাওয়া যাবে?',
      a: 'হ্যাঁ, যদি কোনো পণ্য ক্ষতিগ্রস্ত অবস্থায় পৌঁছায় অথবা খাবারের মান নিয়ে যৌক্তিক অসন্তুষ্টি থাকে, তবে ডেলিভারি পাওয়ার সাথে সাথে আমাদের ফোনে বা হোয়াটসঅ্যাপে জানালে আমরা বিনামূল্যে রিপ্লেসমেন্ট বা পূর্ণ রিফান্ড নিশ্চিত করি।'
    },
    {
      q: 'খাবারের বিশুদ্ধতা ও মান নিশ্চিতের উপায় কি?',
      a: 'আমাদের প্রতিষ্ঠাতা মাসুদুর রহমান ব্যক্তিগতভাবে গ্রামীণ কৃষকদের মাঠ ও প্রক্রিয়াকরণস্থল পরিদর্শন করে গুণগত মান নিশ্চিত করেন। কোনো মধ্যস্বত্বভোগী ছাড়াই সরাসরি গ্রামের ঘানি ও চুলা থেকে পণ্য সংগৃহীত হয়।'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message || 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!');
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      } else {
        setErrorMsg(data.message || 'বার্তা পাঠাতে সমস্যা হয়েছে।');
      }
    } catch {
      setErrorMsg('সার্ভারে যোগাযোগ করা যায়নি।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">যোগাযোগ ও জিজ্ঞাসা</h1>
        <p className="text-sm text-gray-500">
          যেকোনো প্রশ্ন, মতামত, পাইকারি অর্ডার কিংবা অভিযোগের জন্য নির্দ্বিধায় আমাদের সাথে যোগাযোগ করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1b4d3e] text-white p-8 rounded-3xl shadow-md space-y-6">
            <h3 className="text-xl font-bold pb-3 border-b border-emerald-700/60">
              আমাদের ঠিকানা ও হেল্পলাইন
            </h3>

            <div className="space-y-5 text-sm text-emerald-100">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-700/60 flex items-center justify-center shrink-0 text-amber-300">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">সরাসরি ফোন কল</h4>
                  <a
                    href={`tel:${cleanPhoneNumber}`}
                    className="text-base font-bold text-amber-300 mt-0.5 block hover:underline"
                    title="সরাসরি কল দিন"
                  >
                    {settings.phone || '+880 1712 345678'}
                  </a>
                  <p className="text-xs text-emerald-300">সকাল ৯টা থেকে রাত ১০টা পর্যন্ত খোলা</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center shrink-0 text-[#25D366]">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">WhatsApp সাপোর্ট</h4>
                  <p className="text-base font-bold text-emerald-200 mt-0.5">{settings.whatsapp || '+880 1712 345678'}</p>
                  <a
                    href={`https://wa.me/${cleanWhatsAppNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-amber-300 underline font-semibold hover:text-white"
                  >
                    হোয়াটসঅ্যাপে চ্যাট শুরু করুন →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-700/60 flex items-center justify-center shrink-0 text-amber-300">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">ইমেইল ঠিকানা</h4>
                  <a
                    href={mailtoUrl}
                    className="text-sm font-semibold mt-0.5 block hover:underline hover:text-amber-300"
                    title="ইমেইল বা জিমেইল পাঠান"
                  >
                    {settings.email || 'info@grameenfood.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-700/60 flex items-center justify-center shrink-0 text-amber-300">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">অফিস ও প্যাকেজিং কেন্দ্র</h4>
                  {settings.mapLocationUrl ? (
                    <a
                      href={settings.mapLocationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm mt-0.5 leading-relaxed block hover:underline hover:text-amber-300"
                      title="গুগল ম্যাপে লোকেশন দেখুন"
                    >
                      {lang === 'bn' ? settings.address_bn : (settings.address_en || settings.address_bn)}
                    </a>
                  ) : (
                    <p className="text-sm mt-0.5 leading-relaxed">
                      {lang === 'bn' ? settings.address_bn : (settings.address_en || settings.address_bn)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs">
          <h2 className="text-xl font-bold text-gray-900 mb-2">আমাদের বার্তা পাঠান</h2>
          <p className="text-xs text-gray-500 mb-6">
            ফর্মটি পূরণ করে আপনার বার্তা পাঠালে আমরা দ্রুত যোগাযোগ করব।
          </p>

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-sm">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-red-800 text-sm">
              <AlertCircle size={18} className="text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  আপনার নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="যেমন: তানভীর হাসান"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="যেমন: 01712345678"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  ইমেইল (ঐচ্ছিক)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  বিষয়
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="যেমন: পাইকারি অর্ডার / পণ্য অনুসন্ধান"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                আপনার বার্তা লিখুন <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="আপনার বিস্তারিত জিজ্ঞাসা বা প্রশ্ন লিখুন..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-[#1b4d3e] hover:bg-[#13382c] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-400"
            >
              <Send size={16} />
              <span>{submitting ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-gray-900">সাধারণ জিজ্ঞাসা (FAQ)</h2>
          <p className="text-xs text-gray-500 mt-1">গ্রাহকদের সচরাচর করা কিছু সাধারণ প্রশ্ন ও উত্তর</p>
        </div>

        <div className="divide-y divide-gray-100 max-w-3xl mx-auto">
          {faqs.map((faq, i) => (
            <div key={i} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-gray-800 hover:text-[#1b4d3e] transition cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-[#1b4d3e]' : 'text-gray-400'}`} />
              </button>
              {openFaq === i && (
                <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed pl-1 animate-fadeIn">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
