import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowRight, 
  ChevronRight, 
  Tag, 
  MessageSquare, 
  Image as ImageIcon, 
  Truck, 
  FileText, 
  Settings, 
  CheckCircle2, 
  Smartphone, 
  Monitor 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminDashboardPage() {
  const { lang, formatPrice, formatNumber } = useLanguage();
  const { authHeader } = useAdminAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats', {
      headers: authHeader()
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Pending': return 'Pending';
      case 'Confirmed': return 'Confirmed';
      case 'Processing': return 'Processing';
      case 'Shipped': return 'Shipped';
      case 'Delivered': return 'Delivered';
      case 'Cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1b4d3e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = stats?.salesChart || [];
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 10000);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">ড্যাশবোর্ড</h2>
        <p className="text-xs text-gray-500">Grameen Food by MASUD - Admin Panel Overview</p>
      </div>

      {/* 1. TOP 4 METRIC CARDS matching Image 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: মোট পণ্য */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500">মোট পণ্য</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              {formatNumber(stats?.totalProducts || 0)}
            </h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              (+২ আজ যোগ হয়েছে)
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package size={24} />
          </div>
        </div>

        {/* Card 2: মোট অর্ডার */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500">মোট অর্ডার</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              {formatNumber(stats?.totalOrders || 0)}
            </h3>
            <p className="text-[11px] text-blue-600 font-medium mt-1">
              (+৫ আজ)
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Card 3: মোট বিক্রয় */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500">মোট বিক্রয়</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              {formatPrice(stats?.totalRevenue || 0)}
            </h3>
            <p className="text-[11px] text-amber-600 font-medium mt-1">
              (+৳ ৫,২৩০ আজ)
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>

        {/* Card 4: লো-স্টক পণ্য */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500">লো-স্টক পণ্য</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              {formatNumber(stats?.lowStockCount || 0)}
            </h3>
            <p className="text-[11px] text-red-600 font-medium mt-1">
              (স্টক &lt; ১০)
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* 2. SALES CHART & RECENT ORDERS matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Chart (7 days) matching Image 2 */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-sm sm:text-base">
              সাম্প্রতিক বিক্রয় (গত ৭ দিন)
            </h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              লাইভ ডাটা
            </span>
          </div>

          {/* SVG Line Chart */}
          <div className="h-56 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1b4d3e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1b4d3e" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="30" y1="20" x2="490" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="70" x2="490" y2="70" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="120" x2="490" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="160" x2="490" y2="160" stroke="#e2e8f0" strokeWidth="1" />

              {/* Y Axis labels */}
              <text x="5" y="25" fill="#94a3b8" fontSize="9">15,000</text>
              <text x="5" y="75" fill="#94a3b8" fontSize="9">10,000</text>
              <text x="5" y="125" fill="#94a3b8" fontSize="9">5,000</text>
              <text x="15" y="165" fill="#94a3b8" fontSize="9">0</text>

              {/* Area & Line */}
              {chartData.length > 1 && (
                <>
                  <polygon
                    points={`30,160 ${chartData.map((d, i) => {
                      const x = 30 + (i * (460 / (chartData.length - 1)));
                      const y = 160 - Math.min(140, (d.revenue / maxRevenue) * 140);
                      return `${x},${y}`;
                    }).join(' ')} 490,160`}
                    fill="url(#chartGradient)"
                  />
                  <polyline
                    fill="none"
                    stroke="#1b4d3e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartData.map((d, i) => {
                      const x = 30 + (i * (460 / (chartData.length - 1)));
                      const y = 160 - Math.min(140, (d.revenue / maxRevenue) * 140);
                      return `${x},${y}`;
                    }).join(' ')}
                  />

                  {/* Data Points */}
                  {chartData.map((d, i) => {
                    const x = 30 + (i * (460 / (chartData.length - 1)));
                    const y = 160 - Math.min(140, (d.revenue / maxRevenue) * 140);
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="4" fill="#1b4d3e" stroke="#ffffff" strokeWidth="2" />
                        <text x={x} y="175" textAnchor="middle" fill="#64748b" fontSize="9">
                          {d.label || d.date.slice(5)}
                        </text>
                      </g>
                    );
                  })}
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Latest Orders Table matching Image 2 */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-sm sm:text-base">সর্বশেষ অর্ডার</h3>
            <Link to="/admin/orders" className="text-xs font-bold text-[#1b4d3e] hover:underline flex items-center gap-1">
              <span>সব দেখুন</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-gray-400 font-semibold border-b border-gray-100 pb-2">
                  <th className="py-2">অর্ডার নং</th>
                  <th className="py-2">গ্রাহক</th>
                  <th className="py-2">পরিমাণ</th>
                  <th className="py-2">স্ট্যাটাস</th>
                  <th className="py-2 text-right">তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(stats?.recentOrders || []).map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-2.5 font-mono font-bold text-gray-800">
                      {o.order_number || `#${o.id}`}
                    </td>
                    <td className="py-2.5 text-gray-700 font-medium">
                      {o.customer_name}
                    </td>
                    <td className="py-2.5 font-bold text-[#1b4d3e]">
                      {formatPrice(o.total_amount)}
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(o.status)}`}>
                        {getStatusLabel(o.status)}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-400 text-right">
                      {new Date(o.created_at || Date.now()).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. QUICK NAVIGATION MENU CARDS matching Image 2 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
          এডমিন প্যানেলের অন্যান্য মেনু
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/categories"
            className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#1b4d3e]/30 shadow-2xs hover:shadow-xs transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1b4d3e] flex items-center justify-center">
                <Tag size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800 group-hover:text-[#1b4d3e]">ক্যাটাগরি ব্যবস্থাপনা</h4>
                <p className="text-[11px] text-gray-400">নতুন ক্যাটাগরি যোগ করুন, সম্পাদনা করুন</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-[#1b4d3e] group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            to="/admin/inquiries"
            className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#1b4d3e]/30 shadow-2xs hover:shadow-xs transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800 group-hover:text-blue-600">গ্রাহক যোগাযোগ</h4>
                <p className="text-[11px] text-gray-400">গ্রাহকের মেসেজ ও ইনকোয়ারি দেখুন</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            to="/admin/banners"
            className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#1b4d3e]/30 shadow-2xs hover:shadow-xs transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ImageIcon size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800 group-hover:text-amber-600">ব্যানার ম্যানেজমেন্ট</h4>
                <p className="text-[11px] text-gray-400">হোমপেজ ব্যানার আপলোড ও ম্যানেজ করুন</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            to="/admin/delivery"
            className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#1b4d3e]/30 shadow-2xs hover:shadow-xs transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800 group-hover:text-purple-600">ডেলিভারি সেটিংস</h4>
                <p className="text-[11px] text-gray-400">ডেলিভারি চার্জ ও ন্যূনতম অর্ডার সেট করুন</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            to="/admin/reports"
            className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#1b4d3e]/30 shadow-2xs hover:shadow-xs transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1b4d3e] flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800 group-hover:text-[#1b4d3e]">রিপোর্ট ও এক্সপোর্ট</h4>
                <p className="text-[11px] text-gray-400">অর্ডার রিপোর্ট ডাউনলোড করুন (CSV)</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-[#1b4d3e] group-hover:translate-x-0.5 transition" />
          </Link>

          <Link
            to="/admin/settings"
            className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#1b4d3e]/30 shadow-2xs hover:shadow-xs transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                <Settings size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800 group-hover:text-gray-900">সেটিংস</h4>
                <p className="text-[11px] text-gray-400">সাইটের সাধারণ সেটিংস পরিবর্তন করুন</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-900 group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>

      {/* 4. STEP-BY-STEP ONBOARDING GUIDE matching Image 2 bottom */}
      <div className="bg-emerald-50/60 border border-emerald-100 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-200/60">
          <div>
            <h3 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#1b4d3e] text-white text-xs flex items-center justify-center">✓</span>
              <span>এডমিন প্যানেলে কিভাবে প্রবেশ করবেন?</span>
            </h3>
            <p className="text-xs text-emerald-800 mt-1">
              আপনি নিচের ধাপগুলো অনুসরণ করে সহজেই এডমিন প্যানেলে যেকোনো সময় কাজ করতে পারেন।
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 bg-emerald-100/80 px-3 py-1.5 rounded-full">
            <Monitor size={14} />
            <span>ডেস্কটপ ও মোবাইল—দুইতেই কাজ করে</span>
          </div>
        </div>

        {/* 5 Onboarding Steps matching Image 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#1b4d3e] text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h4 className="font-bold text-xs text-gray-900">ওয়েবসাইটে যান</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              আপনার ব্রাউজারে খুলুন মূল সাইট বা ডোমেইন।
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#1b4d3e] text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h4 className="font-bold text-xs text-gray-900">লগইন পেজে যান</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              উপরের মেনুতে 'Admin' লিংকে ক্লিক করুন অথবা /admin লিখুন।
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#1b4d3e] text-white font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h4 className="font-bold text-xs text-gray-900">ইউজারনেম ও পাসওয়ার্ড</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              আপনার দেওয়া এডমিন ইমেইল ও পাসওয়ার্ড ব্যবহার করুন।
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#1b4d3e] text-white font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h4 className="font-bold text-xs text-gray-900">লগইন করুন</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              সঠিক তথ্য দিলে আপনি ড্যাশবোর্ডে প্রবেশ করবেন।
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-emerald-100 shadow-2xs space-y-2">
            <span className="w-7 h-7 rounded-full bg-[#1b4d3e] text-white font-bold text-xs flex items-center justify-center">
              5
            </span>
            <h4 className="font-bold text-xs text-gray-900">এখন আপনার কাজ শুরু</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              পণ্য, অর্ডার, ক্যাটাগরি, ব্যানার ইত্যাদি সহজে ম্যানেজ করুন।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
