import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

export default function WhatsAppButton() {
  const { lang, t } = useLanguage();
  const { settings, cleanWhatsAppNumber } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const defaultText = lang === 'bn' 
    ? 'আসসালামু আলাইকুম! আমি গ্রামীণ ফুড by MASUD থেকে পণ্য অর্ডার করতে চাই।' 
    : 'Hello! I want to order authentic village food from Grameen Food by MASUD.';

  const handleSend = (e) => {
    e.preventDefault();
    const textToSend = message.trim() || defaultText;
    const url = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Mini Chat Box */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden animate-slideUp">
          <div className="bg-[#1b4d3e] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                🌾
              </div>
              <div>
                <h4 className="font-bold text-sm">Grameen Food Support</h4>
                <p className="text-[11px] text-emerald-200">সাধারণত ১ মিনিটে উত্তর দেয়া হয়</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 bg-emerald-50/50 space-y-3">
            <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs border border-emerald-100/60 text-xs text-gray-700">
              <p className="font-semibold text-emerald-800 mb-1">
                {lang === 'bn' ? 'স্বাগতম গ্রামীণ ফুড by MASUD-এ!' : 'Welcome to Grameen Food by MASUD!'}
              </p>
              <p>
                {lang === 'bn' 
                  ? 'কোন পণ্যটি আপনার পছন্দ হয়েছে? অথবা কোনো প্রশ্ন থাকলে সরাসরি মেসেজ দিন।' 
                  : 'Which traditional food would you like to order? Send us a message.'}
              </p>
            </div>

            <form onSubmit={handleSend} className="mt-2">
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={lang === 'bn' ? 'আপনার বার্তা লিখুন...' : 'Type your message...'}
                className="w-full p-2.5 text-xs bg-white border border-emerald-200 rounded-xl focus:outline-none focus:border-[#1b4d3e] resize-none"
              />
              <button
                type="submit"
                className="w-full mt-2 py-2 px-3 bg-[#25D366] hover:bg-[#1ebc59] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
              >
                <Send size={13} />
                <span>{lang === 'bn' ? 'হোয়াটসঅ্যাপে পাঠান' : 'Send to WhatsApp'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Pill Button matching Image 1 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 group cursor-pointer"
        aria-label="Order via WhatsApp"
      >
        <MessageCircle size={20} className="fill-white text-[#25D366]" />
        <div className="text-left leading-tight hidden sm:block">
          <p className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider">
            {lang === 'bn' ? 'WhatsApp-এ অর্ডার করুন' : 'Order on WhatsApp'}
          </p>
          <p className="text-xs font-extrabold tracking-wide">{settings.whatsapp || '+880 1712 345678'}</p>
        </div>
      </button>
    </div>
  );
}
