import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Mail, Phone, Clock, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminInquiriesPage() {
  const { lang } = useLanguage();
  const { authHeader } = useAdminAuth();

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const fetchInquiries = () => {
    setLoading(true);
    fetch('/api/inquiries', { headers: authHeader() })
      .then(res => res.json())
      .then(data => {
        if (data.success) setInquiries(data.inquiries);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleMarkStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(prev => ({ ...prev, status }));
        }
      }
    } catch {
      alert('স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">গ্রাহক যোগাযোগ ও ইনকোয়ারি</h2>
        <p className="text-xs text-gray-500">গ্রাহকদের পাঠানো বার্তা ও মতামত পর্যবেক্ষণ করুন</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#f8faf8] border-b border-gray-100 text-gray-500 font-semibold">
              <tr>
                <th className="py-3 px-4">গ্রাহক</th>
                <th className="py-3 px-4">মোবাইল / ইমেইল</th>
                <th className="py-3 px-4">বিষয়</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4">তারিখ</th>
                <th className="py-3 px-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">মেসেজ লোড হচ্ছে...</td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">কোনো বার্তা পাওয়া যায়নি।</td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3 px-4 font-bold text-gray-800">{inq.name}</td>
                    <td className="py-3 px-4 text-gray-600">
                      <p className="font-mono">{inq.phone}</p>
                      {inq.email && <p className="text-[11px] text-gray-400">{inq.email}</p>}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-700">{inq.subject || 'সাধারণ'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        inq.status === 'read' ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {inq.status === 'read' ? 'পঠিত' : 'নতুন'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {new Date(inq.created_at || Date.now()).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedInquiry(inq);
                          if (inq.status !== 'read') {
                            handleMarkStatus(inq.id, 'read');
                          }
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-50 text-[#1b4d3e] font-bold text-xs hover:bg-[#1b4d3e] hover:text-white transition"
                      >
                        পড়ুন
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">বার্তা বিস্তারিত</h3>
              <button onClick={() => setSelectedInquiry(null)} className="text-gray-400 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <p><strong>নাম:</strong> {selectedInquiry.name}</p>
                <p><strong>ফোন:</strong> <span className="font-mono">{selectedInquiry.phone}</span></p>
                {selectedInquiry.email && <p><strong>ইমেইল:</strong> {selectedInquiry.email}</p>}
                <p><strong>বিষয়:</strong> {selectedInquiry.subject}</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-800 mb-1">গ্রাহকের বার্তা:</h4>
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-gray-800 leading-relaxed">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <a
                href={`tel:${selectedInquiry.phone}`}
                className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs hover:bg-emerald-800 transition"
              >
                সরাসরি কল দিন
              </a>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-xl text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
