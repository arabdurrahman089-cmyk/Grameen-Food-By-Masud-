import React from 'react';
import { Truck, RotateCcw, ShieldCheck, FileText } from 'lucide-react';

export function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1b4d3e] flex items-center justify-center font-bold">
          <Truck size={24} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">ডেলিভারি ও শিপিং নীতি</h1>
          <p className="text-xs text-gray-400">সর্বশেষ সংস্করণ: অক্টোবর ২০২৫</p>
        </div>
      </div>

      <div className="prose text-sm text-gray-700 space-y-5 leading-relaxed bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">১. ডেলিভারির আওতা ও কুরিয়ার পার্টনার</h2>
          <p>Grameen Food by MASUD সুন্দরবন কুরিয়ার, এস এ পরিবহন, স্টিডফাস্ট এবং রেডএক্স-এর মাধ্যমে বাংলাদেশের সকল জেলা এবং উপজেলায় সফলভাবে ডেলিভারি নিশ্চিত করে থাকে।</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">২. ডেলিভারি চার্জ</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>ঢাকা সিটি কর্পোরেশন এলাকা:</strong> নিয়মিত চার্জ ৳৭০ (২৪-৪৮ ঘণ্টার মধ্যে হোম ডেলিভারি)।</li>
            <li><strong>ঢাকার বাইরে সমগ্র বাংলাদেশ:</strong> নিয়মিত চার্জ ৳১৩০ (২-৩ কার্যদিবসের মধ্যে)।</li>
            <li>৳২,০০০ বা তদূর্ধ্ব অর্ডারে সম্পূর্ণ <strong>ফ্রি ডেলিভারি</strong> সুবিধা প্রযোজ্য।</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">৩. প্যাকেজিং ও সুরক্ষা</h2>
          <p>তরল পণ্য (যেমন: খাঁটি মধু, সরিষার তেল, নলেন গুড়) ফুড-গ্রেড সিলগালা বোতলে এবং পিঠা-মিষ্টি বিশেষ প্লাস্টিক কনটেইনারে বাবল র‍্যাপ দিয়ে প্যাকিং করা হয় যাতে পরিবহনে কোনো অবস্থাতেই নষ্ট না হয়।</p>
        </section>
      </div>
    </div>
  );
}

export function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#b45309] flex items-center justify-center font-bold">
          <RotateCcw size={24} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">রিটার্ন ও রিফান্ড নীতি</h1>
          <p className="text-xs text-gray-400">খাবারের নিরাপত্তা ও গ্রাহক সন্তুষ্টির নিশ্চয়তা</p>
        </div>
      </div>

      <div className="prose text-sm text-gray-700 space-y-5 leading-relaxed bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">১. পণ্য গ্রহণের সময় যাচাইকরণ</h2>
          <p>ডেলিভারিম্যানের উপস্থিতিতে পার্সেল খুলে পণ্যের সিল বা বোতল অক্ষত আছে কিনা যাচাই করার অনুরোধ জানানো হচ্ছে। কোনো ভাঙা বা ক্ষতিগ্রস্ত প্যাকেট পাওয়া গেলে সঙ্গে সঙ্গে ডেলিভারিম্যানকে ফেরত দিন অথবা আমাদের হেল্পলাইনে কল করুন।</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">২. রিপ্লেসমেন্ট ও রিফান্ড সময়সীমা</h2>
          <p>পণ্য গ্রহণের ৪৮ ঘণ্টার মধ্যে যদি পণ্যের গুণগত মান বা স্বাদে দৃশ্যমান কোনো ত্রুটি লক্ষ্য করেন, তবে ছবি/ভিডিও সহ আমাদের হোয়াটসঅ্যাপ নম্বরে (০১৭১২-৩৪৫৬৭৮) পাঠান। আমরা কোনো অতিরিক্ত চার্জ ছাড়াই পুনরায় ফ্রেশ পণ্য পাঠিয়ে দেব অথবা ৩ কার্যদিবসের মধ্যে আপনার বিকাশ/নগদ অ্যাকাউন্টে সম্পূর্ণ টাকা রিফান্ড করব।</p>
        </section>
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1b4d3e] flex items-center justify-center font-bold">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">গোপনীয়তা নীতি (Privacy Policy)</h1>
          <p className="text-xs text-gray-400">তথ্য সুরক্ষায় আমাদের দৃঢ় অঙ্গীকার</p>
        </div>
      </div>

      <div className="prose text-sm text-gray-700 space-y-5 leading-relaxed bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">তথ্য সংগ্রহ ও ব্যবহার</h2>
          <p>অর্ডার প্রক্রিয়াকরণ ও ডেলিভারি যোগাযোগের জন্য শুধুমাত্র গ্রাহকের নাম, মোবাইল নম্বর এবং ঠিকানা সংগ্রহ করা হয়। Grameen Food by MASUD কোনো তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত তথ্য বিক্রয় বা অপব্যবহার করে না।</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">নিরাপত্তা ও এনক্রিপশন</h2>
          <p>আমাদের ওয়েবসাইট আধুনিক SSL এনক্রিপশন প্রযুক্তির মাধ্যমে সুরক্ষিত। গ্রাহকের অর্ডার এবং আর্থিক তথ্য নিরাপদ সার্ভারে সংরক্ষিত থাকে।</p>
        </section>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-800 flex items-center justify-center font-bold">
          <FileText size={24} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">ব্যবহারের সাধারণ শর্তাবলী (Terms & Conditions)</h1>
          <p className="text-xs text-gray-400">Grameen Food by MASUD</p>
        </div>
      </div>

      <div className="prose text-sm text-gray-700 space-y-5 leading-relaxed bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">১. অর্ডার নিশ্চয়তা</h2>
          <p>ওয়েবসাইটে প্রদর্শিত সকল পণ্যের মূল্য বাংলাদেশি টাকায় (BDT) নির্ধারিত। মৌসুমি পণ্যের ক্ষেত্রে ফসলের উৎপাদন ও প্রাপ্যতার ওপর ভিত্তি করে মূল্যে সামান্য তারতম্য হতে পারে, যা অর্ডারের সময় চূড়ান্তভাবে প্রদর্শিত হবে।</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-gray-900">২. গুণগত মান ও সত্যনিষ্ঠতা</h2>
          <p>আমরা কোনো অবাস্তব বা অপ্রমাণিত ভেষজ বা চিকিৎসাগত দাবি প্রচার করি না। আমাদের পণ্যসমূহ শতভাগ প্রাকৃতিক গ্রাম্য খাদ্যপণ্য হিসেবে পরিবেশন করা হয়।</p>
        </section>
      </div>
    </div>
  );
}
