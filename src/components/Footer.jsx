import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, CreditCard, Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { lang, t } = useLanguage();
  const { settings, cleanPhoneNumber, mailtoUrl } = useSettings();

  return (
    <footer className="bg-[#13382c] text-emerald-100 pt-12 pb-6 border-t-4 border-[#1b4d3e]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-emerald-900/60">
          {/* Column 1: Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#1b4d3e] flex items-center justify-center text-white border border-[#237651]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#fde047]">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-lg text-white tracking-wide">Grameen Food</h4>
                <p className="text-[11px] text-amber-300 font-semibold uppercase">by MASUD</p>
              </div>
            </div>
            <p className="text-sm text-emerald-200/90 leading-relaxed mb-4">
              {lang === 'bn'
                ? 'গ্রামবাংলার খাঁটি, নির্ভেজাল ও ঐতিহ্যবাহী খাবার পৌঁছে দিচ্ছি সারা বাংলাদেশের ঘরে ঘরে। প্রকৃতি থেকে সরাসরি আপনার টেবিলে।'
                : 'Delivering authentic, unadulterated traditional Bangladeshi village foods directly from farmers to your doorstep.'}
            </p>
            <div className="flex items-center gap-3 text-white">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#1b4d3e] hover:bg-[#237651] flex items-center justify-center transition" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#1b4d3e] hover:bg-[#237651] flex items-center justify-center transition" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-[#1b4d3e] hover:bg-[#237651] flex items-center justify-center transition" aria-label="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h5 className="font-bold text-white text-base mb-4 pb-1 border-b border-emerald-800/80 inline-block">
              {lang === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}
            </h5>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              <li>
                <Link to="/" className="hover:text-amber-300 transition block py-0.5">{t('home')}</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-amber-300 transition block py-0.5">{t('allProducts')}</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-300 transition block py-0.5">{t('aboutUs')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-300 transition block py-0.5">{t('contact')}</Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-amber-300 transition block py-0.5">{t('trackOrder')}</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h5 className="font-bold text-white text-base mb-4 pb-1 border-b border-emerald-800/80 inline-block">
              {lang === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
            </h5>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              <li>
                <Link to="/category/rice-paddy" className="hover:text-amber-300 transition block py-0.5">চাল ও ধান</Link>
              </li>
              <li>
                <Link to="/category/pulses-grains" className="hover:text-amber-300 transition block py-0.5">ডাল ও শস্য</Link>
              </li>
              <li>
                <Link to="/category/honey" className="hover:text-amber-300 transition block py-0.5">খাঁটি মধু</Link>
              </li>
              <li>
                <Link to="/category/date-juice" className="hover:text-amber-300 transition block py-0.5">খেজুরের রস</Link>
              </li>
              <li>
                <Link to="/category/jaggery-patali" className="hover:text-amber-300 transition block py-0.5">খেজুরের গুড় ও পাটালি</Link>
              </li>
              <li>
                <Link to="/shop" className="text-amber-300 hover:underline transition block py-0.5 font-medium">আরও দেখুন →</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Secure Payment */}
          <div>
            <h5 className="font-bold text-white text-base mb-4 pb-1 border-b border-emerald-800/80 inline-block">
              {lang === 'bn' ? 'যোগাযোগ ও ঠিকানা' : 'Contact & Address'}
            </h5>
            <ul className="space-y-3 text-sm text-emerald-200/90 mb-5">
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <a
                  href={`tel:${cleanPhoneNumber}`}
                  className="hover:text-amber-300 transition"
                  title={lang === 'bn' ? 'সরাসরি কল করুন' : 'Call us'}
                >
                  {settings.phone || '+880 1712 345678'}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <a
                  href={mailtoUrl}
                  className="hover:text-amber-300 transition underline underline-offset-2"
                  title={lang === 'bn' ? 'ইমেইল বা জিমেইল পাঠান' : 'Send email'}
                >
                  {settings.email || 'info@grameenfood.com'}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-amber-400 shrink-0 mt-0.5" />
                {settings.mapLocationUrl ? (
                  <a
                    href={settings.mapLocationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-amber-300 transition"
                    title={lang === 'bn' ? 'গুগল ম্যাপে লোকেশন দেখুন' : 'View on Google Maps'}
                  >
                    {lang === 'bn' ? settings.address_bn : (settings.address_en || settings.address_bn)}
                  </a>
                ) : (
                  <span>
                    {lang === 'bn' ? settings.address_bn : (settings.address_en || settings.address_bn)}
                  </span>
                )}
              </li>
            </ul>

            <div className="pt-2">
              <h6 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-amber-400" />
                {lang === 'bn' ? 'নিরাপদ লেনদেন' : 'Secure Payment'}
              </h6>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-[#1b4d3e] text-emerald-100 font-medium border border-emerald-800">
                  ক্যাশ অন ডেলিভারি
                </span>
                <span className="px-2.5 py-1 rounded bg-[#1b4d3e] text-emerald-100 font-medium border border-emerald-800">
                  বিকাশ / নগদ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Policies */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-300/70">
          <p>© 2025 Grameen Food by MASUD, সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <Link to="/policy/privacy" className="hover:text-white transition">গোপনীয়তা নীতি</Link>
            <span>•</span>
            <Link to="/policy/terms" className="hover:text-white transition">শর্তাবলী</Link>
            <span>•</span>
            <Link to="/policy/returns" className="hover:text-white transition">রিটার্ন ও রিফান্ড নীতি</Link>
            <span>•</span>
            <Link to="/policy/shipping" className="hover:text-white transition">ডেলিভারি নীতি</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
