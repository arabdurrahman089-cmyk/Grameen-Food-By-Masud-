import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, X, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminCategoriesPage() {
  const { lang, formatNumber } = useLanguage();
  const { authHeader } = useAdminAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name_bn: '',
    name_en: '',
    slug: '',
    icon: '🌾',
    image: '',
    description_bn: ''
  });

  const fetchCategories = () => {
    setLoading(true);
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCategories(data.categories);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name_bn: '',
      name_en: '',
      slug: '',
      icon: '🌾',
      image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=600&q=80',
      description_bn: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name_bn: cat.name_bn || '',
      name_en: cat.name_en || '',
      slug: cat.slug || '',
      icon: cat.icon || '🌾',
      image: cat.image || '',
      description_bn: cat.description_bn || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name_bn || !formData.slug) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchCategories();
      }
    } catch {
      alert('সংরক্ষণ ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">ক্যাটাগরি ব্যবস্থাপনা</h2>
          <p className="text-xs text-gray-500">পণ্যের বিভাগ তৈরি ও সম্পাদনা করুন</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1b4d3e] hover:bg-[#13382c] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
        >
          <Plus size={16} />
          <span>নতুন ক্যাটাগরি</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id || cat.slug}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs hover:shadow-xs transition flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <img
                src={cat.image}
                alt=""
                className="w-12 h-12 rounded-xl object-cover border border-gray-200"
              />
              <div>
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <span>{cat.icon}</span>
                  <span>{cat.name_bn}</span>
                </h4>
                <p className="text-xs text-gray-400">{cat.name_en}</p>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                  {formatNumber(cat.count || 0)} টি পণ্য
                </span>
              </div>
            </div>

            <button
              onClick={() => handleOpenEdit(cat)}
              className="p-2 rounded-xl bg-gray-50 hover:bg-[#1b4d3e] text-gray-600 hover:text-white transition cursor-pointer"
              title="সম্পাদনা"
            >
              <Edit2 size={15} />
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                {editingCategory ? 'ক্যাটাগরি সম্পাদনা' : 'নতুন ক্যাটাগরি'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-gray-700 mb-1">বাংলা নাম *</label>
                <input
                  type="text"
                  required
                  value={formData.name_bn}
                  onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">English Name</label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">স্লাগ (URL Slug) *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ইমোজি আইকন</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ছবির URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1b4d3e] text-white rounded-xl font-bold"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
