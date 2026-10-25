import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  Download, 
  X, 
  Printer, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package, 
  XCircle, 
  Filter, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminOrdersPage() {
  const { lang, formatPrice, formatNumber } = useLanguage();
  const { authHeader } = useAdminAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchOrders = () => {
    setLoading(true);
    let url = `/api/orders?status=${statusFilter}`;
    if (searchQuery.trim()) {
      url += `&search=${encodeURIComponent(searchQuery.trim())}`;
    }

    fetch(url, { headers: authHeader() })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    setUpdatingStatus(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader()
        },
        body: JSON.stringify({ status: newStatus, note: statusNote })
      });
      const data = await res.json();
      if (data.success && data.order) {
        setSelectedOrder(data.order);
        setOrders(prev => prev.map(o => o.id === data.order.id ? data.order : o));
        setStatusNote('');
        alert('অর্ডার স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!');
      } else {
        alert(data.message || 'স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।');
      }
    } catch {
      alert('সার্ভারে যোগাযোগ করা যায়নি।');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleExportCSV = () => {
    window.open('/api/orders/export/csv', '_blank');
  };

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

  // Pagination calculation
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header matching Image 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">অর্ডার ব্যবস্থাপনা</h2>
          <p className="text-xs text-gray-500">গ্রাহকদের অর্ডার পর্যবেক্ষণ ও স্ট্যাটাস আপডেট করুন</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition cursor-pointer"
        >
          <Download size={16} />
          <span>অর্ডার রিপোর্ট (CSV এক্সপোর্ট)</span>
        </button>
      </div>

      {/* Filter Tabs matching Image 2 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { key: 'all', label: 'সব অর্ডার' },
          { key: 'Pending', label: 'পেন্ডিং (Pending)' },
          { key: 'Confirmed', label: 'কনফার্মড' },
          { key: 'Processing', label: 'প্রসেসিং' },
          { key: 'Shipped', label: 'শিফট (Shipped)' },
          { key: 'Delivered', label: 'ডেলিভার্ড' },
          { key: 'Cancelled', label: 'বাতিল' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setStatusFilter(tab.key);
              setCurrentPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-[#1b4d3e] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অর্ডার নং, নাম, মোবাইল বা জেলা দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1b4d3e]"
          />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </form>

        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
          মোট {formatNumber(totalItems)} টি অর্ডার
        </span>
      </div>

      {/* Orders Table matching Image 2 middle-bottom */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#f8faf8] border-b border-gray-100 text-gray-500 font-semibold">
              <tr>
                <th className="py-3 px-4">অর্ডার নং</th>
                <th className="py-3 px-4">গ্রাহক</th>
                <th className="py-3 px-4">পরিমাণ</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4">তারিখ</th>
                <th className="py-3 px-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    অর্ডার লোড হচ্ছে...
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    কোনো অর্ডার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/70 transition">
                    {/* Order No */}
                    <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                      {o.order_number || `#${o.id}`}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4 font-medium text-gray-800">
                      <div>
                        <p>{o.customer_name}</p>
                        <p className="text-[11px] text-gray-400 font-mono">{o.phone}</p>
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 font-bold text-[#1b4d3e]">
                      {formatPrice(o.total_amount)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(o.status)}`}>
                        {o.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                      {new Date(o.created_at || Date.now()).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                    </td>

                    {/* Action button "দেখুন" matching Image 2 */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleViewOrder(o)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 text-[#1b4d3e] hover:bg-[#1b4d3e] hover:text-white font-semibold text-xs transition cursor-pointer"
                      >
                        দেখুন
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Image 2 */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            মোট {formatNumber(totalItems)}টি অর্ডার
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

      {/* VIEW / UPDATE ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-xs text-gray-400">অর্ডার ইনভয়েস</span>
                <h3 className="font-bold text-lg text-gray-900 font-mono">
                  {selectedOrder.order_number || `#${selectedOrder.id}`}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Recipient Details */}
            <div className="p-4 bg-gray-50 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700">
              <div>
                <h4 className="font-bold text-gray-900 mb-1">গ্রাহকের ঠিকানা:</h4>
                <p className="font-semibold text-gray-800">{selectedOrder.customer_name}</p>
                <p className="font-mono text-gray-600">{selectedOrder.phone}</p>
                <p className="mt-1">{selectedOrder.address}, {selectedOrder.district}</p>
                {selectedOrder.notes && (
                  <p className="mt-1 text-amber-800 italic">নির্দেশনা: {selectedOrder.notes}</p>
                )}
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">পেমেন্ট ও তারিখ:</h4>
                <p>পদ্ধতি: <span className="font-semibold">{selectedOrder.payment_method}</span></p>
                <p>পেমেন্ট স্ট্যাটাস: <span className="font-semibold">{selectedOrder.payment_status}</span></p>
                <p className="text-gray-400 mt-1">তারিখ: {new Date(selectedOrder.created_at).toLocaleString('bn-BD')}</p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="font-bold text-xs uppercase text-gray-500 mb-2">অর্ডারকৃত পণ্যসমূহ:</h4>
              <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-gray-400">{item.unit || '১ কেজি'} × {formatNumber(item.quantity)}</p>
                    </div>
                    <span className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-right text-xs space-y-1">
                <p className="text-gray-500">উপমোট: <span className="font-semibold">{formatPrice(selectedOrder.subtotal)}</span></p>
                <p className="text-gray-500">ডেলিভারি চার্জ: <span className="font-semibold">{formatPrice(selectedOrder.delivery_fee)}</span></p>
                <p className="text-base font-bold text-[#1b4d3e]">সর্বমোট: {formatPrice(selectedOrder.total_amount)}</p>
              </div>
            </div>

            {/* Status Update Form */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
              <h4 className="font-bold text-xs uppercase text-emerald-950">অর্ডার স্ট্যাটাস আপডেট করুন:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs font-semibold focus:outline-none"
                >
                  <option value="Pending">Pending (অপেক্ষমান)</option>
                  <option value="Confirmed">Confirmed (নিশ্চিত)</option>
                  <option value="Processing">Processing (প্রসেসিং/প্যাকিং)</option>
                  <option value="Shipped">Shipped (কুরিয়ারে হস্তান্তর)</option>
                  <option value="Delivered">Delivered (ডেলিভারি সম্পন্ন)</option>
                  <option value="Cancelled">Cancelled (বাতিল)</option>
                </select>

                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="নোট বা কুরিয়ার ট্র্যাকিং নং..."
                  className="px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                className="w-full py-2 bg-[#1b4d3e] text-white font-bold text-xs rounded-xl hover:bg-[#13382c] transition cursor-pointer"
              >
                {updatingStatus ? 'আপডেট হচ্ছে...' : 'স্ট্যাটাস সেভ করুন'}
              </button>
            </div>

            {/* Print Button */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
              >
                <Printer size={15} />
                <span>প্রিন্ট করুন</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-xl text-xs font-bold hover:bg-gray-300 transition cursor-pointer"
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
