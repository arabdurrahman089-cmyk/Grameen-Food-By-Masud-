import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAdminAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('admin@grameenfood.com');
  const [password, setPassword] = useState('admin12345');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to admin dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(identifier, password);
    setLoading(false);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message || 'ইউজারনেম বা পাসওয়ার্ড সঠিক নয়।');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7f4] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background rustic graphic */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 C30,40 70,60 100,100 L0,100 Z" fill="#1b4d3e" />
        </svg>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Back to website button */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#1b4d3e] transition"
          >
            <ArrowLeft size={14} />
            <span>মূল ওয়েবসাইটে ফিরে যান</span>
          </Link>
        </div>

        {/* Card matching Image 2 mockup */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-gray-100 space-y-6">
          {/* Logo & Header matching Image 2 */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-[#1b4d3e] flex items-center justify-center text-white mx-auto shadow-md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-[#fde047]">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Grameen Food</h2>
              <p className="text-xs font-semibold text-[#b45309]">by MASUD</p>
            </div>
            <div className="pt-2">
              <h1 className="text-xl font-bold text-gray-800">Admin Login</h1>
              <p className="text-xs text-gray-500">শুধুমাত্র অনুমোদিত ব্যক্তিদের জন্য</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form matching Image 2 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                ইমেইল / ইউজারনেম
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Mail size={16} />
                </span>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@grameenfood.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e] focus:ring-2 focus:ring-[#1b4d3e]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-[#1b4d3e] focus:ring-2 focus:ring-[#1b4d3e]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#1b4d3e] accent-[#1b4d3e]"
                />
                <span>আমাকে মনে রাখুন</span>
              </label>

              <button
                type="button"
                onClick={() => alert('এডমিন পাসওয়ার্ড রিসেট করতে সার্ভারের .env ফাইলের ADMIN_PASSWORD আপডেট করুন অথবা সেভ করা ডাটায় সেটিংস ব্যবহার করুন।')}
                className="text-[#1b4d3e] hover:underline"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1b4d3e] hover:bg-[#13382c] text-white font-bold rounded-xl shadow-md transition cursor-pointer disabled:bg-gray-400"
            >
              {loading ? 'যাচাই করা হচ্ছে...' : 'লগইন'}
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-[11px] text-emerald-900 leading-tight">
            <p className="font-semibold text-emerald-950 mb-0.5">ডিফল্ট এডমিন তথ্য:</p>
            <p>ইউজার: <span className="font-mono font-bold">admin@grameenfood.com</span></p>
            <p>পাসওয়ার্ড: <span className="font-mono font-bold">admin12345</span></p>
          </div>

          <p className="text-center text-[11px] text-gray-400">
            © 2025 Grameen Food by MASUD. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
