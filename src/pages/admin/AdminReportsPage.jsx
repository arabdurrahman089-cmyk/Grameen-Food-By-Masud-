import React, { useState, useEffect } from 'react';
import { Download, FileText, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminReportsPage() {
  const { authHeader } = useAdminAuth();
  const { formatPrice, formatNumber } = useLanguage();

  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch('/api/admin/stats', { headers: authHeader() })
      .then(res => res.json())
      .then(data => {
        if (data.success) setStats(data.stats);
      });
  }, []);

  const handleDownloadCSV = () => {
    window.open('/api/orders/export/csv', '_blank');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">রিপোর্ট ও ডাটা এক্সপোর্ট</h2>
        <p className="text-xs text-gray-500">গ্রাহকদের অর্ডারের পূর্ণ বিবরণ এবং সেলস রিপোর্ট এক্সেল বা CSV ফাইল আকারে নামিয়ে নিন</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded-2xl">
            <span className="text-xs text-gray-500">মোট বিক্রয়</span>
            <p className="text-xl font-extrabold text-[#1b4d3e] mt-1">
              {formatPrice(stats?.totalRevenue || 0)}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl">
            <span className="text-xs text-gray-500">মোট অর্ডার</span>
            <p className="text-xl font-extrabold text-blue-600 mt-1">
              {formatNumber(stats?.totalOrders || 0)}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl">
            <span className="text-xs text-gray-500">তালিকাভুক্ত পণ্য</span>
            <p className="text-xl font-extrabold text-emerald-700 mt-1">
              {formatNumber(stats?.totalProducts || 0)}
            </p>
          </div>
        </div>

        <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1b4d3e] text-white flex items-center justify-center shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900">অর্ডার এক্সপোর্ট ফাইল (CSV / Excel)</h4>
              <p className="text-xs text-gray-600 mt-0.5">
                বাংলা ফন্ট ও ইউটিএফ-৮ (UTF-8 BOM) সহ তৈরি, মাইক্রোসফট এক্সেলে সরাসরি পড়া যাবে।
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadCSV}
            className="px-5 py-3 bg-[#1b4d3e] hover:bg-[#13382c] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Download size={16} />
            <span>CSV ডাউনলোড করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
