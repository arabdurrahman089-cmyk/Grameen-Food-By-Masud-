import React, { useState, useEffect } from 'react';
import { Settings, Lock, Save, CheckCircle2, AlertCircle, Phone, MessageCircle, Mail, MapPin, Globe } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function AdminSettingsPage() {
  const { authHeader } = useAdminAuth();
  const { refreshSettings } = useSettings();

  const [storeSettings, setStoreSettings] = useState({
    siteName: 'Grameen Food by MASUD',
    tagline: 'গ্রামের স্বাদ, ঘরের ভালোবাসা',
    tagline_en: 'Taste of Village, Love of Home',
    phone: '01712-345678',
    whatsapp: '+8801712345678',
    email: 'info@grameenfood.com',
    address_bn: 'গ্রাম: রাজাপুর, থানা: কালিয়াকৈর, জেলা: গাজীপুর, বাংলাদেশ',
    address_en: 'Vill: Rajapur, Thana: Kaliakair, Dist: Gazipur, Bangladesh',
    mapLocationUrl: 'https://maps.google.com/?q=Gazipur,Bangladesh',
    announcement_bn: 'সারা বাংলাদেশে কুরিয়ারে ডেলিভারি | নিজের এলাকায় ক্যাশ অন ডেলিভারি | যোগাযোগ: ০১৭১২-৩৪৫৬৭৮',
    announcement_en: 'Courier delivery all over Bangladesh | Cash on Delivery in local areas | Contact: 01712-345678',
    facebookUrl: 'https://facebook.com',
    youtubeUrl: 'https://youtube.com',
    instagramUrl: 'https://instagram.com'
  });

  const [loading, setLoading] = useState(true);
  const [storeSuccess, setStoreSuccess] = useState('');
  const [storeError, setStoreError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [isSavingPw, setIsSavingPw] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setStoreSettings(prev => ({ ...prev, ...data.settings }));
        }
      })
      .catch(err => {
        console.error('Failed to load settings:', err);
        setStoreError('সেটিংস লোড করতে সমস্যা হয়েছে।');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveStore = async (e) => {
    e.preventDefault();
    setStoreSuccess('');
    setStoreError('');

    // --- Validation Rules ---
    // 1. Email / Gmail Validation
    const emailTrim = (storeSettings.email || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrim || !emailRegex.test(emailTrim)) {
      setStoreError('অনুগ্রহ করে একটি সঠিক ইমেইল বা জিমেইল ঠিকানা দিন (যেমন: info@grameenfood.com)।');
      return;
    }

    // 2. WhatsApp Number Validation (at least 10 digits)
    const waDigits = (storeSettings.whatsapp || '').replace(/[^0-9]/g, '');
    if (waDigits.length < 10) {
      setStoreError('অনুগ্রহ করে একটি সঠিক WhatsApp নম্বর দিন (কমপক্ষে ১০ ডিজিট, যেমন: +8801712345678)।');
      return;
    }

    // 3. Phone Number Validation
    const phoneDigits = (storeSettings.phone || '').replace(/[^0-9]/g, '');
    if (phoneDigits.length < 10) {
      setStoreError('অনুগ্রহ করে সঠিক কন্টাক্ট ফোন নম্বর দিন (যেমন: 01712-345678)।');
      return;
    }

    // 4. Business Location / Address Validation
    if (!(storeSettings.address_bn || '').trim()) {
      setStoreError('ব্যবসার বাংলা ঠিকানা ফাঁকা রাখা যাবে না।');
      return;
    }

    setIsSaving(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(storeSettings)
      });
      const data = await res.json();

      if (data.success) {
        setStoreSuccess('স্টোর ও কন্টাক্ট সেটিংস সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে!');
        // Refresh global settings in state
        if (refreshSettings) {
          refreshSettings();
        }
        setTimeout(() => setStoreSuccess(''), 5000);
      } else {
        setStoreError(data.message || 'সেটিংস আপডেট ব্যর্থ হয়েছে।');
      }
    } catch {
      setStoreError('সার্ভারে যোগাযোগ করা যায়নি। অনুগ্রহ করে ইন্টারনেট সংযোগ চেক করুন।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (newPassword.length < 6) {
      setPwError('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('নতুন পাসওয়ার্ড দুটি মিলছে না।');
      return;
    }

    setIsSavingPw(true);

    try {
      const res = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setPwSuccess(data.message || 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPwSuccess(''), 5000);
      } else {
        setPwError(data.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।');
      }
    } catch {
      setPwError('সার্ভারে যোগাযোগ করা যায়নি।');
    } finally {
      setIsSavingPw(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">সাধারণ সেটিংস ও যোগাযোগ তথ্য</h2>
        <p className="text-xs text-gray-500">
          WhatsApp নম্বর, জিমেইল ঠিকানা, ব্যবসার লোকেশন এবং ওয়েবসাইটের সার্বিক কন্টাক্ট তথ্য নিয়ন্ত্রণ করুন
        </p>
      </div>

      {/* Store Info & Contact Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-6">
        <div className="pb-3 border-b border-gray-100">
          <h3 className="font-bold text-base text-gray-800 flex items-center gap-2">
            <Settings size={18} className="text-[#1b4d3e]" />
            <span>ওয়েবসাইটের যোগাযোগ ও ব্যবসায়িক তথ্য</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            এখানে সংরক্ষিত তথ্য ওয়েবসাইটের হেডার, ফুটার, কন্টাক্ট পেজ ও WhatsApp বাটনে তাৎক্ষণিক কার্যকর হবে।
          </p>
        </div>

        {storeSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{storeSuccess}</span>
          </div>
        )}

        {storeError && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-800 flex items-center gap-2 animate-shake">
            <AlertCircle size={16} className="text-red-600 shrink-0" />
            <span>{storeError}</span>
          </div>
        )}

        <form onSubmit={handleSaveStore} className="space-y-5 text-xs sm:text-sm">
          {/* WhatsApp & Email Section */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/70 space-y-4">
            <h4 className="font-bold text-xs uppercase text-emerald-950 tracking-wider">
              প্রধান কন্টাক্ট চ্যানেলসমূহ
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <MessageCircle size={15} className="text-[#25D366]" />
                  <span>WhatsApp নম্বর *</span>
                </label>
                <input
                  type="text"
                  required
                  value={storeSettings.whatsapp || ''}
                  onChange={(e) => setStoreSettings({ ...storeSettings, whatsapp: e.target.value })}
                  placeholder="যেমন: +8801712345678"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-mono text-xs sm:text-sm focus:outline-none focus:border-[#1b4d3e] focus:ring-2 focus:ring-[#1b4d3e]/20"
                />
                <p className="text-[11px] text-gray-400 mt-1">ফ্লোটিং বাটন ও ডায়রেক্ট অর্ডারে ব্যবহৃত হয়</p>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Mail size={15} className="text-amber-500" />
                  <span>জিমেইল / ইমেইল ঠিকানা *</span>
                </label>
                <input
                  type="email"
                  required
                  value={storeSettings.email || ''}
                  onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                  placeholder="যেমন: info@grameenfood.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm focus:outline-none focus:border-[#1b4d3e] focus:ring-2 focus:ring-[#1b4d3e]/20"
                />
                <p className="text-[11px] text-gray-400 mt-1">ক্লিক করলে সরাসরি ইমেইল/জিমেইল ওপেন হবে</p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <Phone size={15} className="text-[#1b4d3e]" />
                <span>হেল্পলাইন ফোন নম্বর *</span>
              </label>
              <input
                type="text"
                required
                value={storeSettings.phone || ''}
                onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                placeholder="যেমন: 01712-345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-mono text-xs sm:text-sm focus:outline-none focus:border-[#1b4d3e] focus:ring-2 focus:ring-[#1b4d3e]/20 max-w-sm"
              />
            </div>
          </div>

          {/* Business Location & Address */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
            <h4 className="font-bold text-xs uppercase text-gray-700 tracking-wider flex items-center gap-1.5">
              <MapPin size={15} className="text-[#1b4d3e]" />
              <span>ব্যবসার ঠিকানা ও গুগল ম্যাপ লোকেশন</span>
            </h4>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                অফিস ও গোডাউনের সম্পূর্ণ ঠিকানা (বাংলা) *
              </label>
              <input
                type="text"
                required
                value={storeSettings.address_bn || ''}
                onChange={(e) => setStoreSettings({ ...storeSettings, address_bn: e.target.value })}
                placeholder="যেমন: গ্রাম: রাজাপুর, থানা: কালিয়াকৈর, জেলা: গাজীপুর, বাংলাদেশ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#1b4d3e]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                ঠিকানা (ইংরেজি - English Address)
              </label>
              <input
                type="text"
                value={storeSettings.address_en || ''}
                onChange={(e) => setStoreSettings({ ...storeSettings, address_en: e.target.value })}
                placeholder="Vill: Rajapur, Thana: Kaliakair, Dist: Gazipur, Bangladesh"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#1b4d3e]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                গুগল ম্যাপ লোকেশন লিংক (Google Maps URL - ঐচ্ছিক)
              </label>
              <input
                type="url"
                value={storeSettings.mapLocationUrl || ''}
                onChange={(e) => setStoreSettings({ ...storeSettings, mapLocationUrl: e.target.value })}
                placeholder="https://maps.google.com/?q=..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-mono text-xs focus:outline-none focus:border-[#1b4d3e]"
              />
            </div>
          </div>

          {/* Store Name & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">স্টোরের নাম</label>
              <input
                type="text"
                value={storeSettings.siteName || ''}
                onChange={(e) => setStoreSettings({ ...storeSettings, siteName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">ট্যাগলাইন (বাংলা)</label>
              <input
                type="text"
                value={storeSettings.tagline || ''}
                onChange={(e) => setStoreSettings({ ...storeSettings, tagline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              হেডার অ্যানাউন্সমেন্ট বার নোটিশ (Announcement Bar)
            </label>
            <input
              type="text"
              value={storeSettings.announcement_bn || ''}
              onChange={(e) => setStoreSettings({ ...storeSettings, announcement_bn: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-[#1b4d3e] hover:bg-[#13382c] text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:bg-gray-400 text-xs sm:text-sm"
            >
              <Save size={16} />
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'কন্টাক্ট ও স্টোর সেটিংস সেভ করুন'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security: Change Admin Password */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-5">
        <h3 className="font-bold text-base text-gray-800 pb-2 border-b border-gray-100 flex items-center gap-2">
          <Lock size={18} className="text-[#1b4d3e]" />
          <span>এডমিন পাসওয়ার্ড পরিবর্তন (নিরাপত্তা)</span>
        </h3>

        {pwError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-800 flex items-center gap-2 animate-shake">
            <AlertCircle size={16} />
            <span>{pwError}</span>
          </div>
        )}

        {pwSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 size={16} />
            <span>{pwSuccess}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 text-xs sm:text-sm max-w-md">
          <div>
            <label className="block font-bold text-gray-700 mb-1">বর্তমান পাসওয়ার্ড *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">নতুন পাসওয়ার্ড * (কমপক্ষে ৬ অক্ষর)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন *</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
            />
          </div>

          <button
            type="submit"
            disabled={isSavingPw}
            className="px-5 py-2.5 bg-gray-800 hover:bg-black text-white font-bold rounded-xl shadow-md transition cursor-pointer text-xs sm:text-sm disabled:bg-gray-400"
          >
            {isSavingPw ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
          </button>
        </form>
      </div>
    </div>
  );
}
