import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminBannersPage() {
  const { authHeader } = useAdminAuth();

  const [banners, setBanners] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState('');

  useEffect(() => {
    fetch('/api/banners')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBanners(data.banners || []);
          setPromotions(data.promotions || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveSuccess('');

    try {
      const res = await fetch('/api/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ banners, promotions })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess('ব্যানারসমূহ সফলভাবে সংরক্ষিত হয়েছে!');
        setTimeout(() => setSaveSuccess(''), 4000);
      }
    } catch {
      alert('ব্যানার আপডেট ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">ব্যানার ও অফার ম্যানেজমেন্ট</h2>
        <p className="text-xs text-gray-500">হোমপেজের মূল হিরো ব্যানার এবং ৩টি প্রমোশনাল কার্ডের লেখা ও ছবি পরিবর্তন করুন</p>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{saveSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Hero Slides */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
            হোমপেজ হিরো স্লাইডার
          </h3>

          <div className="space-y-6">
            {banners.map((b, idx) => (
              <div key={b.id || idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 text-xs sm:text-sm">
                <div className="font-bold text-gray-700">স্লাইড #{idx + 1}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">ব্যাজ টেক্সট</label>
                    <input
                      type="text"
                      value={b.badge_bn}
                      onChange={(e) => {
                        const copy = [...banners];
                        copy[idx].badge_bn = e.target.value;
                        setBanners(copy);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">মূল শিরোনাম (Title)</label>
                    <input
                      type="text"
                      value={b.title_bn}
                      onChange={(e) => {
                        const copy = [...banners];
                        copy[idx].title_bn = e.target.value;
                        setBanners(copy);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">সাবটাইটেল</label>
                  <input
                    type="text"
                    value={b.subtitle_bn}
                    onChange={(e) => {
                      const copy = [...banners];
                      copy[idx].subtitle_bn = e.target.value;
                      setBanners(copy);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">ছবির URL</label>
                  <input
                    type="text"
                    value={b.image}
                    onChange={(e) => {
                      const copy = [...banners];
                      copy[idx].image = e.target.value;
                      setBanners(copy);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-mono text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Seasonal Promo Cards */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
            ৩টি সিজনাল প্রমোশনাল ব্যানার
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            {promotions.map((p, idx) => (
              <div key={p.id || idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                <span className="font-bold text-gray-700 block">কার্ড #{idx + 1}</span>
                <div>
                  <label className="block font-semibold mb-1">শিরোনাম</label>
                  <input
                    type="text"
                    value={p.title_bn}
                    onChange={(e) => {
                      const copy = [...promotions];
                      copy[idx].title_bn = e.target.value;
                      setPromotions(copy);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">সাবটাইটেল</label>
                  <input
                    type="text"
                    value={p.subtitle_bn}
                    onChange={(e) => {
                      const copy = [...promotions];
                      copy[idx].subtitle_bn = e.target.value;
                      setPromotions(copy);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">ছবির URL</label>
                  <input
                    type="text"
                    value={p.image}
                    onChange={(e) => {
                      const copy = [...promotions];
                      copy[idx].image = e.target.value;
                      setPromotions(copy);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white font-mono text-[11px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-[#1b4d3e] hover:bg-[#13382c] text-white font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer text-sm"
        >
          <Save size={16} />
          <span>সকল ব্যানার পরিবর্তন সেভ করুন</span>
        </button>
      </form>
    </div>
  );
}
