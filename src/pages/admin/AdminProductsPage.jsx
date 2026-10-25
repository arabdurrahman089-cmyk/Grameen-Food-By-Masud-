import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminProductsPage() {
  const { lang, formatPrice, formatNumber } = useLanguage();
  const { authHeader } = useAdminAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name_bn: '',
    name_en: '',
    category_slug: 'rice-paddy',
    price: '',
    sale_price: '',
    unit: '১ কেজি',
    available_units: '১ কেজি, ৫ কেজি',
    stock: '50',
    origin: '',
    ingredients: '',
    evidence_disclaimer: 'প্রাকৃতিক খাদ্য উপাদান। কোনো কৃত্রিম রাসায়নিক রং বা প্রিজারভেটিভ ব্যবহার করা হয়নি।',
    description_bn: '',
    description_en: '',
    image_url: '',
    bestseller: false,
    featured: false,
    seasonal: false
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/products?limit=100').then(res => res.json()),
      fetch('/api/categories').then(res => res.json())
    ])
      .then(([prodData, catData]) => {
        if (prodData.success) setProducts(prodData.products);
        if (catData.success) setCategories(catData.categories);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name_bn: '',
      name_en: '',
      category_slug: categories[0]?.slug || 'rice-paddy',
      price: '',
      sale_price: '',
      unit: '১ কেজি',
      available_units: '১ কেজি, ৫ কেজি',
      stock: '50',
      origin: 'বাংলাদেশ',
      ingredients: '১০০% প্রাকৃতিক খাদ্য উপাদান',
      evidence_disclaimer: 'প্রাকৃতিক খাদ্য উপাদান। কোনো কৃত্রিম রাসায়নিক রং বা প্রিজারভেটিভ ব্যবহার করা হয়নি। চিকিৎসাগত কোনো অবাস্তব দাবি করা হয় না।',
      description_bn: '',
      description_en: '',
      image_url: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80',
      bestseller: false,
      featured: false,
      seasonal: false
    });
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name_bn: product.name_bn || '',
      name_en: product.name_en || '',
      category_slug: product.category_slug || 'rice-paddy',
      price: product.price ? product.price.toString() : '',
      sale_price: product.sale_price ? product.sale_price.toString() : '',
      unit: product.unit || '১ কেজি',
      available_units: (product.available_units || []).join(', ') || product.unit || '১ কেজি',
      stock: product.stock ? product.stock.toString() : '0',
      origin: product.origin || '',
      ingredients: product.ingredients || '',
      evidence_disclaimer: product.evidence_disclaimer || '',
      description_bn: product.description_bn || '',
      description_en: product.description_en || '',
      image_url: (product.images && product.images[0]) || '',
      bestseller: Boolean(product.bestseller),
      featured: Boolean(product.featured),
      seasonal: Boolean(product.seasonal)
    });
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploadingImage(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: authHeader(),
        body: data
      });
      const resData = await res.json();
      if (resData.success && resData.url) {
        setFormData(prev => ({ ...prev, image_url: resData.url }));
      } else {
        alert(resData.message || 'ছবি আপলোড ব্যর্থ হয়েছে।');
      }
    } catch {
      alert('সার্ভারে ছবি আপলোড করা যায়নি।');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে "${name}" মুছে ফেলতে চান?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: authHeader()
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert(data.message || 'পণ্য মুছে ফেলা সম্ভব হয়নি।');
      }
    } catch {
      alert('সার্ভারে যোগাযোগ করা যায়নি।');
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.name_bn.trim() || !formData.price || !formData.category_slug) {
      setFormError('পণ্যের নাম, ক্যাটাগরি এবং বিক্রয় মূল্য প্রদান আবশ্যক।');
      return;
    }

    const payload = {
      name_bn: formData.name_bn.trim(),
      name_en: formData.name_en.trim() || formData.name_bn.trim(),
      category_slug: formData.category_slug,
      price: Number(formData.price),
      sale_price: formData.sale_price ? Number(formData.sale_price) : Number(formData.price),
      unit: formData.unit.trim(),
      available_units: formData.available_units.split(',').map(s => s.trim()).filter(Boolean),
      stock: Number(formData.stock) || 0,
      origin: formData.origin.trim(),
      ingredients: formData.ingredients.trim(),
      evidence_disclaimer: formData.evidence_disclaimer.trim(),
      description_bn: formData.description_bn.trim(),
      description_en: formData.description_en.trim(),
      images: [formData.image_url || 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80'],
      bestseller: formData.bestseller,
      featured: formData.featured,
      seasonal: formData.seasonal
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setFormSuccess('পণ্য সফলভাবে সংরক্ষিত হয়েছে!');
        setTimeout(() => {
          setIsModalOpen(false);
          fetchData();
        }, 800);
      } else {
        setFormError(data.message || 'সংরক্ষণে ব্যর্থ হয়েছে।');
      }
    } catch {
      setFormError('সার্ভারে যোগাযোগ করা যায়নি।');
    }
  };

  // Filter & Sort Products
  const filteredProducts = products.filter(p => {
    if (categoryFilter !== 'all' && p.category_slug !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = (p.name_bn && p.name_bn.toLowerCase().includes(q)) ||
                    (p.name_en && p.name_en.toLowerCase().includes(q)) ||
                    (p.category_name && p.category_name.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  if (sortBy === 'price_asc') {
    filteredProducts.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
  } else if (sortBy === 'price_desc') {
    filteredProducts.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
  } else if (sortBy === 'stock') {
    filteredProducts.sort((a, b) => a.stock - b.stock);
  }

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Top action bar matching Image 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">পণ্য ব্যবস্থাপনা</h2>
          <p className="text-xs text-gray-500">সকল পণ্যের স্টক, মূল্য ও বিবরণ নিয়ন্ত্রণ করুন</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1b4d3e] hover:bg-[#13382c] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
        >
          <Plus size={16} />
          <span>নতুন পণ্য যোগ করুন</span>
        </button>
      </div>

      {/* Filter Toolbar matching Image 2 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="পণ্য খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1b4d3e]"
          />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-[#1b4d3e] cursor-pointer"
          >
            <option value="all">সব ক্যাটাগরি</option>
            {categories.map(c => (
              <option key={c.slug} value={c.slug}>{c.name_bn}</option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:border-[#1b4d3e] cursor-pointer"
          >
            <option value="newest">সর্ট করুন: নতুন</option>
            <option value="price_asc">দাম: কম থেকে বেশি</option>
            <option value="price_desc">দাম: বেশি থেকে কম</option>
            <option value="stock">স্টক: কম থেকে বেশি</option>
          </select>
        </div>
      </div>

      {/* Products Table matching Image 2 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#f8faf8] border-b border-gray-100 text-gray-500 font-semibold">
              <tr>
                <th className="py-3 px-4">ছবি</th>
                <th className="py-3 px-4">পণ্যের নাম</th>
                <th className="py-3 px-4">ক্যাটাগরি</th>
                <th className="py-3 px-4">দাম</th>
                <th className="py-3 px-4">স্টক</th>
                <th className="py-3 px-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    পণ্যসমূহ লোড হচ্ছে...
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    কোনো পণ্য পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const isLow = p.stock <= 10;
                  const isOut = p.stock <= 0;

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition">
                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <img
                          src={(p.images && p.images[0]) || ''}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                        />
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        <div>
                          <p>{p.name_bn}</p>
                          <span className="text-[10px] text-gray-400 font-normal">{p.unit}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-gray-600">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-medium">
                          {p.category_name || p.category_slug}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-[#1b4d3e]">
                        <div>
                          <span>{formatPrice(p.sale_price || p.price)}</span>
                          {p.sale_price && p.sale_price < p.price && (
                            <span className="block text-[10px] text-gray-400 line-through">
                              {formatPrice(p.price)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isOut
                            ? 'bg-red-100 text-red-800'
                            : isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {formatNumber(p.stock)}
                        </span>
                      </td>

                      {/* Actions: Edit (Green) & Delete (Red) matching Image 2 */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-lg bg-emerald-100 text-[#1b4d3e] hover:bg-[#1b4d3e] hover:text-white transition cursor-pointer"
                            title="সম্পাদনা করুন"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name_bn)}
                            className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination matching Image 2 */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            মোট {formatNumber(totalItems)}টি পণ্য
          </div>

          <div className="flex items-center gap-1 font-bold">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentPage === i + 1
                    ? 'bg-[#1b4d3e] text-white'
                    : 'border border-gray-200 hover:bg-gray-100 text-gray-700'
                }`}
              >
                {formatNumber(i + 1)}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">
                {editingProduct ? 'পণ্য সম্পাদনা করুন' : 'নতুন পণ্য যোগ করুন'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{formError}</span>
              </div>
            )}
            {formSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    পণ্যের বাংলা নাম <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_bn}
                    onChange={(e) => setFormData({ ...formData, name_bn: e.target.value })}
                    placeholder="যেমন: খাঁটি মধু (৫০০ গ্রাম)"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    ইংরেজি নাম (English Name)
                  </label>
                  <input
                    type="text"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    placeholder="Pure Honey (500g)"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    ক্যাটাগরি <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category_slug}
                    onChange={(e) => setFormData({ ...formData, category_slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#1b4d3e]"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name_bn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    নিয়মিত মূল্য (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="যেমন: 350"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    ডিসকাউন্ট অফার মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                    placeholder="যেমন: 280"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    মূল ইউনিট (Unit)
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="১ কেজি / ৫০০ গ্রাম / ১ লিটার"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    স্টক পরিমাণ
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="50"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    উৎস / জেলা
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="দিনাজপুর / সুন্দরবন / যশোর"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
                  />
                </div>
              </div>

              {/* Image Input */}
              <div className="space-y-2">
                <label className="block font-bold text-gray-700">
                  পণ্যের ছবি (URL বা ফাইল আপলোড)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e] text-xs font-mono"
                  />
                  <label className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl cursor-pointer flex items-center gap-1 text-xs font-semibold shrink-0">
                    <Upload size={14} />
                    <span>{uploadingImage ? 'আপলোড হচ্ছে...' : 'ফাইল আপলোড'}</span>
                    <input type="file" accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  পণ্যের বিস্তারিত বিবরণ
                </label>
                <textarea
                  rows={3}
                  value={formData.description_bn}
                  onChange={(e) => setFormData({ ...formData, description_bn: e.target.value })}
                  placeholder="খাঁটি স্বাদ ও সংগ্রহের বিস্তারিত..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e]"
                />
              </div>

              {/* Verified Disclaimer Notice */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  সতর্কতা ও নিশ্চয়তা সংক্রান্ত নোট (Verified Evidence)
                </label>
                <input
                  type="text"
                  value={formData.evidence_disclaimer}
                  onChange={(e) => setFormData({ ...formData, evidence_disclaimer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e] text-xs text-gray-600"
                />
              </div>

              {/* Flags */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-xs">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="rounded text-[#1b4d3e] accent-[#1b4d3e]"
                  />
                  <span>বেস্ট সেলার (Best Seller)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-xs">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-[#1b4d3e] accent-[#1b4d3e]"
                  />
                  <span>বিশেষ আকর্ষণ (Featured)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-xs">
                  <input
                    type="checkbox"
                    checked={formData.seasonal}
                    onChange={(e) => setFormData({ ...formData, seasonal: e.target.checked })}
                    className="rounded text-[#1b4d3e] accent-[#1b4d3e]"
                  />
                  <span>মৌসুমি শীতের পণ্য (Seasonal)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-50 transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1b4d3e] hover:bg-[#13382c] text-white font-bold rounded-xl text-xs shadow-md transition cursor-pointer"
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
