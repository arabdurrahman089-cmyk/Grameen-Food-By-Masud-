import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  ShoppingBag, 
  MessageSquare, 
  Image as ImageIcon, 
  Truck, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Calendar, 
  User, 
  ExternalLink 
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function AdminLayout() {
  const { isAuthenticated, adminUser, logout, loading } = useAdminAuth();
  const { lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f7f4]">
        <div className="w-10 h-10 border-4 border-[#1b4d3e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { name: 'ড্যাশবোর্ড', path: '/admin', icon: LayoutDashboard },
    { name: 'পণ্য ব্যবস্থাপনা', path: '/admin/products', icon: Package },
    { name: 'ক্যাটাগরি', path: '/admin/categories', icon: Tag },
    { name: 'অর্ডারসমূহ', path: '/admin/orders', icon: ShoppingBag },
    { name: 'গ্রাহক যোগাযোগ', path: '/admin/inquiries', icon: MessageSquare },
    { name: 'ব্যানার ম্যানেজমেন্ট', path: '/admin/banners', icon: ImageIcon },
    { name: 'ডেলিভারি সেটিংস', path: '/admin/delivery', icon: Truck },
    { name: 'রিপোর্ট ও এক্সপোর্ট', path: '/admin/reports', icon: FileText },
    { name: 'সেটিংস', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const currentDateFormatted = new Date().toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#f3f7f4] flex">
      {/* SIDEBAR FOR DESKTOP & MOBILE matching Image 2 */}
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#13382c] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Header matching Image 2 */}
          <div className="p-4 sm:p-5 border-b border-emerald-900/60 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1b4d3e] flex items-center justify-center text-white border border-emerald-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-[#fde047]">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-sm tracking-tight leading-tight">Grameen Food</h2>
                <p className="text-[10px] text-amber-300 font-semibold uppercase">by MASUD</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg text-emerald-300 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links matching Image 2 */}
          <nav className="p-3 space-y-1 text-xs sm:text-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[#1b4d3e] text-white font-bold shadow-xs'
                      : 'text-emerald-100/80 hover:bg-emerald-950/60 hover:text-white'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-amber-300' : 'text-emerald-300'} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-emerald-900/60 space-y-1">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-200/80 hover:bg-emerald-950/60 hover:text-white transition"
          >
            <ExternalLink size={16} />
            <span>মূল ওয়েবসাইট ভিউ</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-300 hover:bg-red-950/40 hover:text-red-200 transition cursor-pointer"
          >
            <LogOut size={16} />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar matching Image 2 */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-bold text-base sm:text-lg text-gray-800">
                {navItems.find(i => i.path === location.pathname)?.name || 'এডমিন প্যানেল'}
              </h1>
              <p className="text-[11px] text-gray-400 hidden sm:block">Grameen Food by MASUD - Admin Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Date Display matching Image 2 */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
              <Calendar size={14} className="text-[#1b4d3e]" />
              <span>তারিখ: {currentDateFormatted}</span>
            </div>

            {/* Profile Avatar Badge matching Image 2 */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1b4d3e] text-amber-300 flex items-center justify-center font-bold text-xs">
                M
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <span className="font-bold text-gray-800 block">{adminUser?.username || 'admin'}</span>
                <span className="text-[10px] text-gray-400">{adminUser?.role || 'Administrator'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
