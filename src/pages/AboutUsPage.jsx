import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Users, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AboutUsPage() {
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold text-[#b45309] uppercase tracking-wider bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200">
          আমাদের গল্প ও ঐতিহ্য
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          গ্রামের খাঁটি স্বাদ পৌঁছে দিচ্ছি প্রতিটি বাঙালি পরিবারে
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          "Grameen Food by MASUD" শুধু একটি ব্যবসা নয়, এটি গ্রামবাংলার ঐতিহ্যবাহী খাদ্যাভ্যাস ও কৃষকদের অক্লান্ত পরিশ্রমকে সম্মান জানানোর একটি আন্তরিক উদ্যোগ।
        </p>
      </div>

      {/* Founder Story Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            <Heart size={14} className="text-red-500 fill-red-500" />
            <span>মাসুদের ভাবনা থেকে শুরু</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            "গ্রামের খাঁটি স্বাদ ফিরিয়ে আনাই আমাদের মূল ব্রত"
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            শহরের ব্যস্ত জীবনে ভেজাল ও রাসায়নিকযুক্ত খাবারের ভিড়ে আমরা প্রায় ভুলতে বসেছি আসল সরিষার তেলের ঝাঁঝ, মাঘের কুয়াশাভেজা ভোরের তরতাজা খেজুরের রস, কিংবা সুন্দরবনের আসল মধুর সুবাস।
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            মাসুদের নেতৃত্বে আমরা সরাসরি প্রান্তিক কৃষক, অভিজ্ঞ গাছি, মৌয়াল এবং গৃহিণীদের সাথে নিবিড়ভাবে কাজ করে থাকি। কোনো মধ্যস্বত্বভোগী বা কৃত্রিম প্রিজারভেটিভ ছাড়াই পণ্য প্রস্তুত করে সরাসরি আপনার রান্নাঘরে পৌঁছে দিই।
          </p>
          <div className="pt-2 flex items-center gap-4">
            <div className="border-l-4 border-[#1b4d3e] pl-4">
              <h4 className="font-bold text-gray-900">মোঃ মাসুদুর রহমান (মাসুদ)</h4>
              <p className="text-xs text-gray-500">প্রতিষ্ঠাতা ও পরিচালক, Grameen Food</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden aspect-4/3 shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
            alt="Bangladeshi Rural Sourcing"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6 text-white">
            <p className="text-xs font-medium">বাংলাদেশের সবুজ গ্রাম থেকেই শুরু আমাদের প্রতিটি পণ্যের যাত্রা</p>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Integrity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1b4d3e] flex items-center justify-center font-bold">
            <ShieldCheck size={24} />
          </div>
          <h3 className="font-bold text-base text-gray-900">শতভাগ ভেজালহীন</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            আমাদের কোনো খাদ্যে কৃত্রিম রং, ক্ষতিকর সুগন্ধি বা রাসায়নিক প্রিজারভেটিভ ব্যবহৃত হয় না।
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1b4d3e] flex items-center justify-center font-bold">
            <Users size={24} />
          </div>
          <h3 className="font-bold text-base text-gray-900">কৃষকদের ন্যায্যমূল্য</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            গ্রামের স্থানীয় উৎপাদক ও চাষীদের উপযুক্ত পারিশ্রমিক ও সম্মান নিশ্চিত করি।
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1b4d3e] flex items-center justify-center font-bold">
            <Sparkles size={24} />
          </div>
          <h3 className="font-bold text-base text-gray-900">ঐতিহ্যবাহী প্রস্তুতপ্রণালী</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            কাঠের ঘানিতে সরিষার তেল, মাটির চুলায় গুড় জ্বাল এবং রোদে শুকিয়ে তৈরি দেশি আচার।
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1b4d3e] flex items-center justify-center font-bold">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="font-bold text-base text-gray-900">নিরাপদ কুরিয়ার প্যাকিং</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            বিশেষ বাবল র‍্যাপ ও ফুড-গ্রেড বক্সে প্যাকেজিং নিশ্চিত করি যেন পণ্য নষ্ট না হয়।
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#1b4d3e] text-white p-8 sm:p-12 rounded-3xl text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold">গ্রামের আসল খাবারের স্বাদ নিতে চান?</h2>
        <p className="text-xs sm:text-sm text-emerald-200 max-w-md mx-auto">
          ক্যাশ অন ডেলিভারিতে সারা বাংলাদেশে ঘরে বসেই উপভোগ করুন খাঁটি পণ্য।
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#f59e0b] hover:bg-[#d97706] text-gray-950 font-bold rounded-full transition shadow-lg"
          >
            <span>পণ্যসমূহ দেখুন</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
