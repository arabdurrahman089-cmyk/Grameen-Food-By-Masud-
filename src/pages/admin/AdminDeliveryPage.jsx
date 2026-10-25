import React, { useState, useEffect } from 'react';
import { Truck, Save, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminDeliveryPage() {
  const { authHeader } = useAdminAuth();
  const { formatPrice } = useLanguage();

  const [settings, setSettings] = useState({
    deliveryFeeDhaka: 70,
    deliveryFeeOutside: 130,
    freeDeliveryThreshold: 2000,
    minOrderAmount: 200,
    announcement_bn: ''
  });
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('ডেলিভারি সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch {
      alert('সংরক্ষণ ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">ডেলিভারি ও শিপিং সেটিংস</h2>
        <p className="text-xs text-gray-500">ঢাকা ও ঢাকার বাইরে কুরিয়ার চার্জ এবং ফ্রি ডেলিভারির শর্ত নির্ধারণ করুন</p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-5 text-xs sm:text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              ঢাকা সিটির ভেতরে ডেলিভারি চার্জ (৳)
            </label>
            <input
              type="number"
              required
              value={settings.deliveryFeeDhaka}
              onChange={(e) => setSettings({ ...settings, deliveryFeeDhaka: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-[#1b4d3e]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              ঢাকার বাইরে সারা বাংলাদেশে চার্জ (৳)
            </label>
            <input
              type="number"
              required
              value={settings.deliveryFeeOutside}
              onChange={(e) => setSettings({ ...settings, deliveryFeeOutside: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-[#1b4d3e]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-bold text-gray-700 mb-1">
              ফ্রি ডেলিভারির ন্যূনতম অর্ডার পরিমাণ (৳)
            </label>
            <input
              type="number"
              required
              value={settings.freeDeliveryThreshold}
              onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-[#1b4d3e]"
            />
            <p className="text-[11px] text-gray-400 mt-1">কার্ট এই টাকার সমান বা বেশি হলে ডেলিভারি চার্জ ফ্রি হবে।</p>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              সর্বনিম্ন অর্ডার গ্রহণযোগ্যতা (৳)
            </label>
            <input
              type="number"
              required
              value={settings.minOrderAmount}
              onChange={(e) => setSettings({ ...settings, minOrderAmount: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-bold text-[#1b4d3e]"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-gray-700 mb-1">
            শীর্ষ অ্যানাউন্সমেন্ট বার নোটিশ (Announcement Bar)
          </label>
          <input
            type="text"
            value={settings.announcement_bn}
            onChange={(e) => setSettings({ ...settings, announcement_bn: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1b4d3e] hover:bg-[#13382c] text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
          >
            <Save size={16} />
            <span>সংরক্ষণ করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
}
