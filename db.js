const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data generator
function getInitialData() {
  const salt = bcrypt.genSaltSync(10);
  const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'admin12345';
  const hashedAdminPassword = bcrypt.hashSync(defaultAdminPassword, salt);

  return {
    admin: {
      id: 'admin_1',
      username: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@grameenfood.com',
      password: hashedAdminPassword,
      name: 'MASUD (Administrator)',
      role: 'super_admin'
    },
    settings: {
      siteName: 'Grameen Food by MASUD',
      tagline: 'গ্রামের স্বাদ, ঘরের ভালোবাসা',
      tagline_en: 'Taste of Village, Love of Home',
      phone: '01712-345678',
      whatsapp: '+8801712345678',
      email: 'info@grameenfood.com',
      address_bn: 'গ্রাম: রাজাপুর, থানা: কালিয়াকৈর, জেলা: গাজীপুর, বাংলাদেশ',
      address_en: 'Vill: Rajapur, Thana: Kaliakair, Dist: Gazipur, Bangladesh',
      currency: '৳',
      deliveryFeeDhaka: 70,
      deliveryFeeOutside: 130,
      freeDeliveryThreshold: 2000,
      minOrderAmount: 200,
      announcement_bn: 'সারা বাংলাদেশে কুরিয়ারে ডেলিভারি | নিজের এলাকায় ক্যাশ অন ডেলিভারি | যোগাযোগ: ০১৭১২-৩৪৫৬৭৮',
      announcement_en: 'Courier delivery all over Bangladesh | Cash on Delivery in local areas | Contact: 01712-345678',
      bkashMerchantNumber: '01712-345678',
      nagadMerchantNumber: '01712-345678'
    },
    categories: [
      {
        id: 1,
        slug: 'rice-paddy',
        name_bn: 'চাল ও ধান',
        name_en: 'Rice & Paddy',
        icon: '🌾',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
        description_bn: 'গ্রামের ঐতিহ্যবাহী পুষ্টিকর আতপ, চিনিগুঁড়া ও বাসমতী চাল',
        description_en: 'Authentic traditional nutritious paddy and processed aromatic rice'
      },
      {
        id: 2,
        slug: 'pulses-grains',
        name_bn: 'ডাল ও শস্য',
        name_en: 'Pulses & Grains',
        icon: '🌱',
        image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=600&q=80',
        description_bn: 'দেশি মসুর, খেসারি, মুগ ও মাষকলাই ডাল',
        description_en: 'Native red lentils, mung beans and country grains'
      },
      {
        id: 3,
        slug: 'honey',
        name_bn: 'খাঁটি মধু',
        name_en: 'Pure Honey',
        icon: '🍯',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
        description_bn: 'সুন্দরবন ও গ্রামবাংলার প্রাকৃতিক চাকের খাঁটি মধু',
        description_en: 'Wild honeycomb pure honey from the Sundarbans & villages'
      },
      {
        id: 4,
        slug: 'date-juice',
        name_bn: 'খেজুরের রস',
        name_en: 'Date Palm Juice',
        icon: '🏺',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
        description_bn: 'শীতের সকালের বরফ ঠান্ডা সুমিষ্ট খাঁটি খেজুরের রস',
        description_en: 'Fresh morning date palm raw juice from winter palms'
      },
      {
        id: 5,
        slug: 'jaggery-patali',
        name_bn: 'খেজুরের গুড় ও পাটালি',
        name_en: 'Date Jaggery & Patali',
        icon: '🪵',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        description_bn: 'যশোর ও ঝিনাইদহের ঐতিহ্যবাহী সুবাসিত নলেন গুড় ও পাটালি',
        description_en: 'Authentic winter Nolen Gur & Patali jaggery cakes'
      },
      {
        id: 6,
        slug: 'sweets-mithai',
        name_bn: 'দেশি মিঠাই ও মিষ্টি',
        name_en: 'Traditional Sweets',
        icon: '🍬',
        image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80',
        description_bn: 'খাঁটি ছানার তৈরি মিষ্টি, খাস্তা গজা ও মচমচে জিলাপি',
        description_en: 'Traditional cottage cheese sweets and village confections'
      },
      {
        id: 7,
        slug: 'mustard-oil',
        name_bn: 'সরিষার তেল',
        name_en: 'Mustard Oil',
        icon: '🌻',
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
        description_bn: 'কাঠের ঘানি ভাঙা শতভাগ খাঁটি ঝাঁঝালো দেশি সরিষার তেল',
        description_en: 'Cold-pressed wooden ghani 100% pure mustard oil'
      },
      {
        id: 8,
        slug: 'ghee-dairy',
        name_bn: 'ঘি ও দুগ্ধজাত পণ্য',
        name_en: 'Ghee & Dairy Products',
        icon: '🧈',
        image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
        description_bn: 'ঘাসের দেশি গাভীর দুধের খাঁটি দানাদার সুবাসিত ঘি',
        description_en: 'Aroma-rich granular pure cow ghee and dairy'
      },
      {
        id: 9,
        slug: 'pickles-homemade',
        name_bn: 'আচার ও ঘরোয়া খাবার',
        name_en: 'Pickles & Homemade Food',
        icon: '🫙',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        description_bn: 'নানী-দাদীর হাতের স্বাদে তৈরি রোদ-শুকানো আম, জলপাই ও রসুনের আচার',
        description_en: 'Sun-dried traditional homemade mango, olive & garlic pickles'
      },
      {
        id: 10,
        slug: 'other-products',
        name_bn: 'অন্যান্য দেশি ও গ্রামীণ পণ্য',
        name_en: 'Other Rural Products',
        icon: '🌿',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
        description_bn: 'হাতে ভাজা মুড়ি, চিঁড়া, খাঁটি কাসুন্দি ও গ্রামীণ মসলা',
        description_en: 'Handmade puffed rice, flattened rice, and country spices'
      }
    ],
    products: [
      {
        id: 1,
        slug: 'deshi-atap-rice-5kg',
        name_bn: 'দেশি আতপ চাল (৫ কেজি)',
        name_en: 'Deshi Atap Rice (5 kg)',
        category_slug: 'rice-paddy',
        category_id: 1,
        category_name: 'চাল ও ধান',
        price: 260,
        sale_price: 220,
        discount_percent: 15,
        unit: '৫ কেজি',
        available_units: ['১ কেজি', '৫ কেজি', '১০ কেজি'],
        stock: 42,
        rating: 4.8,
        review_count: 36,
        bestseller: true,
        featured: true,
        seasonal: false,
        origin: 'দিনাজপুর, বাংলাদেশ',
        ingredients: '১০০% প্রাকৃতিক দেশি আতপ ধান থেকে প্রক্রিয়াজাত unpolished চাল',
        evidence_disclaimer: 'প্রাকৃতিক ও নির্ভেজাল খাবার। কোনো রাসায়নিক পলিশ বা প্রিজারভেটিভ ব্যবহার করা হয়নি।',
        description_bn: 'উত্তরবঙ্গের কৃষকদের মাঠ থেকে সরাসরি সংগৃহীত দেশি সুগন্ধি আতপ চাল। পায়েস, পোলাও ও যেকোনো উৎসবের জন্য অসাধারণ। পলিশ ছাড়া আসল পুষ্টি সমৃদ্ধ।',
        description_en: 'Naturally processed indigenous unpolished Atap rice harvested directly from farmers in Dinajpur. Perfect for festive celebrations, desserts, and traditional khichuri.',
        images: [
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 2,
        slug: 'deshi-masoor-dal-1kg',
        name_bn: 'মসুর ডাল (১ কেজি)',
        name_en: 'Deshi Masoor Dal (1 kg)',
        category_slug: 'pulses-grains',
        category_id: 2,
        category_name: 'ডাল ও শস্য',
        price: 150,
        sale_price: 120,
        discount_percent: 20,
        unit: '১ কেজি',
        available_units: ['৫০০ গ্রাম', '১ কেজি', '২ কেজি', '৫ কেজি'],
        stock: 65,
        rating: 4.7,
        review_count: 28,
        bestseller: true,
        featured: true,
        seasonal: false,
        origin: 'কুষ্টিয়া, বাংলাদেশ',
        ingredients: '১০০% দেশি ছোট দানার মসুর ডাল',
        evidence_disclaimer: 'কোনো কৃত্রিম রং বা রাসায়নিক ছাড়াই প্রাকৃতিকভাবে রোদে শুকানো।',
        description_bn: 'দেশি ছোট দানার খাঁটি মসুর ডাল। অতি সহজে সেদ্ধ হয় এবং রান্না করার পর লোভনীয় ঘ্রাণ ও অতুলনীয় স্বাদ পাওয়া যায়।',
        description_en: 'Small grain deshi red lentils cultivated in the fertile lands of Kushtia. Cooks swiftly with rich natural taste and aroma.',
        images: [
          'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 3,
        slug: 'pure-honey-500g',
        name_bn: 'খাঁটি মধু (৫০০ গ্রাম)',
        name_en: 'Pure Wild Honey (500g)',
        category_slug: 'honey',
        category_id: 3,
        category_name: 'খাঁটি মধু',
        price: 700,
        sale_price: 550,
        discount_percent: 21,
        unit: '৫০০ গ্রাম',
        available_units: ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি'],
        stock: 35,
        rating: 4.9,
        review_count: 52,
        bestseller: true,
        featured: true,
        seasonal: false,
        origin: 'সুন্দরবন, বাংলাদেশ',
        ingredients: 'প্রাকৃতিক বুনো চাক থেকে সংগৃহীত কাঁচা অপরিশোধিত মধু',
        evidence_disclaimer: 'শতভাগ প্রাকৃতিক খাদ্যপণ্য। কোনো চিনি মেশানো হয় না। তবে এটি কোনো রোগের চিকিৎসায় ওষুধের বিকল্প নয়।',
        description_bn: 'সুন্দরবনের গভীর জঙ্গল থেকে অভিজ্ঞ মৌয়ালদের দ্বারা সংগৃহীত খাঁটি মধু। এতে রয়েছে প্রাকৃতিক এনজাইম, খনিজ ও অনন্য বুনো সৌরভ।',
        description_en: 'Authentic raw wild bee honey ethically gathered from the mangrove forests of the Sundarbans. Packed with natural antioxidants and unadulterated goodness.',
        images: [
          'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 4,
        slug: 'khejurer-raw-ras-1l',
        name_bn: 'খেজুরের রস (১ লিটার)',
        name_en: 'Fresh Date Palm Juice (1 Litre)',
        category_slug: 'date-juice',
        category_id: 4,
        category_name: 'খেজুরের রস',
        price: 200,
        sale_price: 150,
        discount_percent: 25,
        unit: '১ লিটার',
        available_units: ['১ লিটার', '২ লিটার', '৫ লিটার'],
        stock: 15,
        rating: 4.6,
        review_count: 19,
        bestseller: true,
        featured: true,
        seasonal: true,
        origin: 'যশোর, বাংলাদেশ',
        ingredients: 'শীতের সকালে গাছ থেকে সংগ্রহ করা তাজা কাঁচা খেজুরের রস',
        evidence_disclaimer: 'জালবিহীন কাঁচা রস ফুটানোর পর পান করার পরামর্শ দেয়া হয়। সম্পূর্ণ প্রাকৃতিক ও নিপা ভাইরাস প্রতিরোধী আধুনিক কভার ব্যবহৃত।',
        description_bn: 'শীতের কুয়াশাভেজা ভোরবেলায় সংগৃহীত খাঁটি খেজুরের রস। সুরক্ষার জন্য প্রতিটি গাছে বিশেষ নেট ব্যবহার করা হয় যাতে বাদুড় প্রবেশ করতে না পারে।',
        description_en: 'Chilled morning raw date juice collected from carefully protected date palm trees in Jessore with safety netting.',
        images: [
          'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 5,
        slug: 'patali-gur-1kg',
        name_bn: 'পাটালি গুড় (১ কেজি)',
        name_en: 'Patali Gur / Date Jaggery Slab (1 kg)',
        category_slug: 'jaggery-patali',
        category_id: 5,
        category_name: 'খেজুরের গুড় ও পাটালি',
        price: 220,
        sale_price: 180,
        discount_percent: 18,
        unit: '১ কেজি',
        available_units: ['১ কেজি', '২ কেজি', '৫ কেজি'],
        stock: 28,
        rating: 4.8,
        review_count: 44,
        bestseller: true,
        featured: true,
        seasonal: true,
        origin: 'যশোর ও ফরিদপুর, বাংলাদেশ',
        ingredients: '১০০% খাঁটি খেজুরের রস ও ঐতিহ্যবাহী মাটির চুলায় প্রস্তুত',
        evidence_disclaimer: 'কোনো চিনি, হাইড্রোজ বা রাসায়নিক রং মেশানো নেই। গাঢ় প্রাকৃতিক সৌরভ ও রঙ।',
        description_bn: 'শীতকালীন পিঠাপুলির আসল সঙ্গী। খাঁটি খেজুরের রস নিবিড়ভাবে জ্বাল দিয়ে শক্ত পাটালি তৈরি করা হয়। মুখে দিলেই গলে যাবে আর মন ছুঁয়ে যাবে খাঁটি ঘ্রাণে।',
        description_en: 'Solid golden-brown date palm jaggery slab crafted with firewood simmered pure sap. Traditional soul of winter sweets and pitha.',
        images: [
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 6,
        slug: 'chanar-misti-1kg',
        name_bn: 'ছানার মিষ্টি (১ কেজি)',
        name_en: 'Chhanar Traditional Sweets (1 kg)',
        category_slug: 'sweets-mithai',
        category_id: 6,
        category_name: 'দেশি মিঠাই ও মিষ্টি',
        price: 350,
        sale_price: 280,
        discount_percent: 20,
        unit: '১ কেজি',
        available_units: ['৫০০ গ্রাম', '১ কেজি', '২ কেজি'],
        stock: 20,
        rating: 4.7,
        review_count: 31,
        bestseller: true,
        featured: true,
        seasonal: false,
        origin: 'টাঙ্গাইল ও নাটোর, বাংলাদেশ',
        ingredients: 'খাঁটি গাভীর দুধের ছানা ও চিনি',
        evidence_disclaimer: 'প্রতিদিন তাজা প্রস্তুতকৃত। কোনো প্রিজারভেটিভ নেই। ফ্রিজে রেখে ৩-৪ দিন সংরক্ষণযোগ্য।',
        description_bn: 'গ্রামের গাভীর দুধ থেকে বিশেষ প্রক্রিয়ায় ছানা কেটে তৈরি করা নরম তুলতুলে সুস্বাদু মিষ্টি। অতিথি আপ্যায়ন ও ঘরোয়া আনন্দের সঙ্গী।',
        description_en: 'Mouth-watering traditional Bengali sweet confections made from freshly curdled pure cow milk chhana.',
        images: [
          'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 7,
        slug: 'ghani-sorishar-tel-1l',
        name_bn: 'সরিষার তেল (১ লিটার)',
        name_en: 'Cold-Pressed Mustard Oil (1 Litre)',
        category_slug: 'mustard-oil',
        category_id: 7,
        category_name: 'সরিষার তেল',
        price: 300,
        sale_price: 250,
        discount_percent: 17,
        unit: '১ লিটার',
        available_units: ['৫০০ মিলি', '১ লিটার', '২ লিটার', '৫ লিটার'],
        stock: 50,
        rating: 4.9,
        review_count: 67,
        bestseller: true,
        featured: true,
        seasonal: false,
        origin: 'মানিকগঞ্জ ও সিরাজগঞ্জ, বাংলাদেশ',
        ingredients: '১০০% দেশি মাঘী ও টরি সরিষা বীজ',
        evidence_disclaimer: 'ঘানি ভাঙা প্রথম চাপের অপরিশোধিত তেল। কোনো কৃত্রিম গন্ধ বা ক্ষতিকর দ্রাবক নেই।',
        description_bn: 'কাঠের ঘানিতে ধীরে ধীরে ভাঙানো খাঁটি দেশি সরিষার তেল। খাঁটি সরিষার চোখ ধাঁধানো ঝাঁঝ এবং অসাধারণ স্বাদ ও গন্ধ বজায় রয়েছে। যেকোনো ভর্তা ও রান্নায় অতুলনীয়।',
        description_en: 'Authentic slow cold-pressed mustard oil with pungent natural aroma and distinctive warmth. Essential for Bengali mashed bhartas and curries.',
        images: [
          'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 8,
        slug: 'gavir-khati-ghee-500g',
        name_bn: 'গাভীর খাঁটি ঘি (৫০০ গ্রাম)',
        name_en: 'Pure Cow Deshi Ghee (500g)',
        category_slug: 'ghee-dairy',
        category_id: 8,
        category_name: 'ঘি ও দুগ্ধজাত পণ্য',
        price: 950,
        sale_price: 850,
        discount_percent: 11,
        unit: '৫০০ গ্রাম',
        available_units: ['২৫০ গ্রাম', '৫০০ গ্রাম', '১ কেজি'],
        stock: 30,
        rating: 5.0,
        review_count: 48,
        bestseller: false,
        featured: true,
        seasonal: false,
        origin: 'পাবনা ও সিরাজগঞ্জ, বাংলাদেশ',
        ingredients: 'ঘাস খাওয়া গাভীর দুধের মাখন থেকে তৈরি খাঁটি ঘি',
        evidence_disclaimer: 'সম্পূর্ণ রাসায়নিক ও ডালডামুক্ত। দানাদার টেক্সচার ও তীব্র প্রাকৃতিক ঘ্রাণ।',
        description_bn: 'গ্রামের মুক্ত মাঠে চড়ে বেড়ানো গাভীর খাঁটি দুধের মাখন জ্বাল দিয়ে প্রস্তুতকৃত দানাদার সুবাসিত ঘি। গরম ভাতে কিংবা পোলাও-বিরিয়ানিতে এক চামচ দিলেই চমৎকার স্বাদ ছড়াবে।',
        description_en: 'Artisan clarified butter (Ghee) produced from pasture-fed village cows in Pabna. Characterized by its golden granular texture and irresistible fragrance.',
        images: [
          'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 9,
        slug: 'ghoroa-aam-achar-400g',
        name_bn: 'আমের ঘরোয়া আচার (৪০০ গ্রাম)',
        name_en: 'Homemade Mango Pickle (400g)',
        category_slug: 'pickles-homemade',
        category_id: 9,
        category_name: 'আচার ও ঘরোয়া খাবার',
        price: 260,
        sale_price: 220,
        discount_percent: 15,
        unit: '৪০০ গ্রাম',
        available_units: ['৪০০ গ্রাম', '৮০০ গ্রাম'],
        stock: 38,
        rating: 4.8,
        review_count: 29,
        bestseller: false,
        featured: true,
        seasonal: false,
        origin: 'রাজশাহী, বাংলাদেশ',
        ingredients: 'কাঁচা আম, খাঁটি সরিষার তেল, পাঁচফোড়ন, মেথি, শুকনো মরিচ ও ভিনেগার',
        evidence_disclaimer: 'রোদে শুকিয়ে ঐতিহ্যবাহী গ্রাম্য পদ্ধতিতে তৈরি। কোনো কৃত্রিম প্রিজারভেটিভ বা রঙ নেই।',
        description_bn: 'গ্রামের মা-চাচীদের হাতের ছোঁয়ায় তৈরি খাঁটি সরিষার তেলের ঝাঁঝালো আমের আচার। রোদ খাইয়ে তৈরি করায় আচারের স্বাদ দীর্ঘকাল অক্ষুণ্ণ থাকে।',
        description_en: 'Sun-cured tart and spicy raw mango pickle steeped in cold-pressed mustard oil with village spices and whole roasted seeds.',
        images: [
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 10,
        slug: 'nolen-jhola-gur-1kg',
        name_bn: 'নলেন ঝোলা গুড় (১ কেজি)',
        name_en: 'Nolen Jhola Liquid Date Jaggery (1 kg)',
        category_slug: 'jaggery-patali',
        category_id: 5,
        category_name: 'খেজুরের গুড় ও পাটালি',
        price: 270,
        sale_price: 220,
        discount_percent: 19,
        unit: '১ কেজি',
        available_units: ['১ কেজি', '২ কেজি', '৫ কেজি'],
        stock: 22,
        rating: 4.9,
        review_count: 37,
        bestseller: false,
        featured: true,
        seasonal: true,
        origin: 'যশোর, বাংলাদেশ',
        ingredients: 'শীতের সুগন্ধি প্রথম খেজুর রসের খাঁটি ঝোলা গুড়',
        evidence_disclaimer: 'কোনো চিনি বা কৃত্রিম ঘনকারী উপাদান মেশানো হয়নি। কাঁচের বয়ামে বা ফুড-গ্রেড বোতলে সংরক্ষিত।',
        description_bn: 'শীতের সকালের ঐতিহ্যবাহী চিতই পিঠা ও রসুনের সাথে খাওয়ার প্রিয় নলেন ঝোলা গুড়। তরল ও সুবাসিত এই গুড় যেকোনো মিষ্টান্নের স্বাদ দ্বিগুণ করে তোলে।',
        description_en: 'Liquid date palm syrup known as Jhola Gur. The quintessential drizzle for hot steamed winter chitoi pitha.',
        images: [
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 11,
        slug: 'chinigura-rice-5kg',
        name_bn: 'সুগন্ধি চিনিগুঁড়া চাল (৫ কেজি)',
        name_en: 'Aromatic Chinigura Rice (5 kg)',
        category_slug: 'rice-paddy',
        category_id: 1,
        category_name: 'চাল ও ধান',
        price: 650,
        sale_price: 580,
        discount_percent: 11,
        unit: '৫ কেজি',
        available_units: ['১ কেজি', '২ কেজি', '৫ কেজি', '১০ কেজি'],
        stock: 40,
        rating: 4.9,
        review_count: 45,
        bestseller: false,
        featured: true,
        seasonal: false,
        origin: 'দিনাজপুর, বাংলাদেশ',
        ingredients: '১০০% দিনাজপুরি চিনিগুঁড়া ধান',
        evidence_disclaimer: 'প্রাকৃতিক ও সুগন্ধযুক্ত। কোনো কৃত্রিম পারফিউম বা কেমিক্যাল ব্যবহার করা হয় না।',
        description_bn: 'আসল দিনাজপুরি চিনিগুঁড়া চাল। ছোট দানার এই চাল রান্না করলে ঘরভরা সুবাস ছড়ায়। সেরা পোলাও, বিরিয়ানি ও ক্ষীরের জন্য অতুলনীয়।',
        description_en: 'Famous small grain Chinigura aromatic rice from Dinajpur. Celebrated for rich natural fragrance in authentic Bangladeshi polao.',
        images: [
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80'
        ]
      },
      {
        id: 12,
        slug: 'hate-bhaja-muri-1kg',
        name_bn: 'হাতে ভাজা দেশি মুড়ি (১ কেজি)',
        name_en: 'Hand-Roasted Puffed Rice (1 kg)',
        category_slug: 'other-products',
        category_id: 10,
        category_name: 'অন্যান্য দেশি ও গ্রামীণ পণ্য',
        price: 130,
        sale_price: 110,
        discount_percent: 15,
        unit: '১ কেজি',
        available_units: ['১ কেজি', '২ কেজি'],
        stock: 55,
        rating: 4.8,
        review_count: 22,
        bestseller: false,
        featured: false,
        seasonal: false,
        origin: 'শেরপুর, বাংলাদেশ',
        ingredients: 'লবণ-পানিতে ভেজানো দেশি ধান ও বালুতে হাতে ভাজা',
        evidence_disclaimer: 'সম্পূর্ণ ইউরিয়া সার ও কেমিক্যাল মুক্ত। খাঁটি মাটির হাঁড়িতে হাতে ভাজা।',
        description_bn: 'ইউরিয়া সার বা কেমিক্যাল ছাড়াই মাটির হাঁড়িতে গরম বালুতে হাতে ভাজা দেশি চালের মচমচে মুড়ি। সরিষার তেল ও কাঁচামরিচ দিয়ে মেখে খাওয়ার মতো দারুণ খাবার।',
        description_en: 'Traditional chemical-free crunchy puffed rice hand-roasted over sand in earthen pots by village artisans.',
        images: [
          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
        ]
      }
    ],
    orders: [
      {
        id: '10076',
        order_number: 'GFM-10076',
        customer_name: 'রহিম উদ্দিন',
        phone: '01711223344',
        address: 'বাসা ১২, রোড ৪, সেক্টর ৯, উত্তরা, ঢাকা',
        district: 'ঢাকা',
        notes: 'দুপুরের আগে ডেলিভারি দিলে ভালো হয়।',
        items: [
          { product_id: 1, name: 'দেশি আতপ চাল (৫ কেজি)', price: 220, quantity: 2, total: 440 },
          { product_id: 3, name: 'খাঁটি মধু (৫০০ গ্রাম)', price: 550, quantity: 1, total: 550 },
          { product_id: 7, name: 'সরিষার তেল (১ লিটার)', price: 250, quantity: 1, total: 250 }
        ],
        subtotal: 1240,
        delivery_fee: 70,
        discount: 60,
        total_amount: 1250,
        payment_method: 'cash_on_delivery',
        payment_status: 'unpaid',
        status: 'Pending',
        created_at: '2025-10-11T10:15:00Z',
        timeline: [
          { status: 'Pending', time: '2025-10-11T10:15:00Z', note: 'অর্ডার গৃহীত হয়েছে।' }
        ]
      },
      {
        id: '10075',
        order_number: 'GFM-10075',
        customer_name: 'সুমাইয়া আক্তার',
        phone: '01822334455',
        address: 'জিইসি মোড়, নাসিরাবাদ, চট্টগ্রাম',
        district: 'চট্টগ্রাম',
        notes: '',
        items: [
          { product_id: 8, name: 'গাভীর খাঁটি ঘি (৫০০ গ্রাম)', price: 850, quantity: 1, total: 850 }
        ],
        subtotal: 850,
        delivery_fee: 130,
        discount: 0,
        total_amount: 980,
        payment_method: 'cash_on_delivery',
        payment_status: 'unpaid',
        status: 'Confirmed',
        created_at: '2025-10-11T09:30:00Z',
        timeline: [
          { status: 'Pending', time: '2025-10-11T09:30:00Z', note: 'অর্ডার গ্রহণ সম্পন্ন।' },
          { status: 'Confirmed', time: '2025-10-11T10:00:00Z', note: 'গ্রাহকের ফোনে অর্ডার নিশ্চিত করা হয়েছে।' }
        ]
      },
      {
        id: '10074',
        order_number: 'GFM-10074',
        customer_name: 'আব্দুল্লাহ',
        phone: '01933445566',
        address: 'নিউ মার্কেট এরিয়া, রাজশাহী',
        district: 'রাজশাহী',
        notes: 'প্যাকেজিং শক্ত করবেন যেন কাঁচের পাত্র না ভাঙে।',
        items: [
          { product_id: 3, name: 'খাঁটি মধু (৫০০ গ্রাম)', price: 550, quantity: 2, total: 1100 },
          { product_id: 5, name: 'পাটালি গুড় (১ কেজি)', price: 180, quantity: 3, total: 540 },
          { product_id: 7, name: 'সরিষার তেল (১ লিটার)', price: 250, quantity: 2, total: 500 },
          { product_id: 9, name: 'আমের ঘরোয়া আচার (৪০০ গ্রাম)', price: 220, quantity: 1, total: 220 }
        ],
        subtotal: 2360,
        delivery_fee: 130,
        discount: 60,
        total_amount: 2430,
        payment_method: 'bkash_gateway',
        payment_status: 'paid',
        status: 'Processing',
        created_at: '2025-10-10T15:20:00Z',
        timeline: [
          { status: 'Pending', time: '2025-10-10T15:20:00Z', note: 'অর্ডার জমা হয়েছে।' },
          { status: 'Confirmed', time: '2025-10-10T16:00:00Z', note: 'পেমেন্ট ভেরিফাই হয়েছে।' },
          { status: 'Processing', time: '2025-10-11T08:30:00Z', note: 'পণ্য গুদাম থেকে প্যাকিং করা হচ্ছে।' }
        ]
      },
      {
        id: '10073',
        order_number: 'GFM-10073',
        customer_name: 'নাসির উদ্দিন',
        phone: '01644556677',
        address: 'চৌহাট্টা, সিলেট সদর, সিলেট',
        district: 'সিলেট',
        notes: '',
        items: [
          { product_id: 11, name: 'সুগন্ধি চিনিগুঁড়া চাল (৫ কেজি)', price: 580, quantity: 1, total: 580 },
          { product_id: 2, name: 'মসুর ডাল (১ কেজি)', price: 120, quantity: 2, total: 240 },
          { product_id: 9, name: 'আমের ঘরোয়া আচার (৪০০ গ্রাম)', price: 220, quantity: 1, total: 220 }
        ],
        subtotal: 1040,
        delivery_fee: 130,
        discount: 50,
        total_amount: 1120,
        payment_method: 'cash_on_delivery',
        payment_status: 'unpaid',
        status: 'Shipped',
        created_at: '2025-10-10T11:45:00Z',
        timeline: [
          { status: 'Pending', time: '2025-10-10T11:45:00Z', note: 'অর্ডার জমা হয়েছে।' },
          { status: 'Confirmed', time: '2025-10-10T12:00:00Z', note: 'অর্ডার নিশ্চিত হয়েছে।' },
          { status: 'Processing', time: '2025-10-10T14:30:00Z', note: 'প্যাকিং শেষ।' },
          { status: 'Shipped', time: '2025-10-11T09:00:00Z', note: 'রেডএক্স কুরিয়ারে হস্তান্তর করা হয়েছে। ট্র্যাকিং নং: RDX88902' }
        ]
      },
      {
        id: '10072',
        order_number: 'GFM-10072',
        customer_name: 'ফারহানা',
        phone: '01755667788',
        address: 'বনানী ব্লক ডি, ঢাকা',
        district: 'ঢাকা',
        notes: '',
        items: [
          { product_id: 4, name: 'খেজুরের রস (১ লিটার)', price: 150, quantity: 2, total: 300 },
          { product_id: 6, name: 'ছানার মিষ্টি (১ কেজি)', price: 280, quantity: 1, total: 280 },
          { product_id: 12, name: 'হাতে ভাজা দেশি মুড়ি (১ কেজি)', price: 110, quantity: 1, total: 110 }
        ],
        subtotal: 690,
        delivery_fee: 70,
        discount: 0,
        total_amount: 760,
        payment_method: 'cash_on_delivery',
        payment_status: 'paid',
        status: 'Delivered',
        created_at: '2025-10-09T14:10:00Z',
        timeline: [
          { status: 'Pending', time: '2025-10-09T14:10:00Z', note: 'অর্ডার জমা হয়েছে।' },
          { status: 'Confirmed', time: '2025-10-09T14:30:00Z', note: 'অর্ডার নিশ্চিত।' },
          { status: 'Processing', time: '2025-10-09T16:00:00Z', note: 'প্যাকেজিং শেষ।' },
          { status: 'Shipped', time: '2025-10-10T09:30:00Z', note: 'রাইডার ডেলিভারির জন্য বের হয়েছে।' },
          { status: 'Delivered', time: '2025-10-10T13:45:00Z', note: 'গ্রাহকের নিকট সফলভাবে ডেলিভারি সম্পন্ন।' }
        ]
      },
      {
        id: '10071',
        order_number: 'GFM-10071',
        customer_name: 'মোঃ করিম',
        phone: '01866778899',
        address: 'সদর রোড, বরিশাল',
        district: 'বরিশাল',
        notes: '',
        items: [
          { product_id: 8, name: 'গাভীর খাঁটি ঘি (৫০০ গ্রাম)', price: 850, quantity: 1, total: 850 },
          { product_id: 3, name: 'খাঁটি মধু (৫০০ গ্রাম)', price: 550, quantity: 1, total: 550 }
        ],
        subtotal: 1400,
        delivery_fee: 160,
        discount: 0,
        total_amount: 1560,
        payment_method: 'cash_on_delivery',
        payment_status: 'unpaid',
        status: 'Cancelled',
        created_at: '2025-10-08T18:00:00Z',
        timeline: [
          { status: 'Pending', time: '2025-10-08T18:00:00Z', note: 'অর্ডার জমা হয়েছে।' },
          { status: 'Cancelled', time: '2025-10-09T10:00:00Z', note: 'গ্রাহকের অনুরোধে অর্ডার বাতিল করা হয়েছে।' }
        ]
      },
      {
        id: '10070',
        order_number: 'GFM-10070',
        customer_name: 'সালমা আক্তার',
        phone: '01977889900',
        address: 'খান জাহান আলী রোড, খুলনা',
        district: 'খুলনা',
        notes: '',
        items: [
          { product_id: 8, name: 'গাভীর খাঁটি ঘি (৫০০ গ্রাম)', price: 850, quantity: 1, total: 850 }
        ],
        subtotal: 850,
        delivery_fee: 130,
        discount: 0,
        total_amount: 980,
        payment_method: 'cash_on_delivery',
        payment_status: 'paid',
        status: 'Delivered',
        created_at: '2025-10-08T12:00:00Z',
        timeline: [
          { status: 'Pending', time: '2025-10-08T12:00:00Z', note: 'অর্ডার জমা হয়েছে।' },
          { status: 'Delivered', time: '2025-10-10T16:00:00Z', note: 'ডেলিভারি সম্পন্ন।' }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        author: 'রফিকুল ইসলাম',
        location: 'ঢাকা',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: '১০ অক্টোবর ২০২৫',
        comment_bn: 'চালের মান খুবই ভালো। প্যাকেজিংও চমৎকার। অবশ্যই আবার অর্ডার করব।'
      },
      {
        id: 2,
        author: 'নাসরিন আক্তার',
        location: 'চট্টগ্রাম',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: '৯ অক্টোবর ২০২৫',
        comment_bn: 'খাঁটি মধু পেয়ে খুব খুশি। ঘ্রাণ অসাধারণ। গ্রামীণ ফুডের উপর ভরসা করা যায়।'
      },
      {
        id: 3,
        author: 'করিম হোসেন',
        location: 'রাজশাহী',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        rating: 5,
        date: '৮ অক্টোবর ২০২৫',
        comment_bn: 'পাটালি গুড়ের স্বাদ এক কথায় অসাধারণ। গ্রামের আসল স্বাদ পেয়েছি।'
      }
    ],
    banners: [
      {
        id: 1,
        badge_bn: 'প্রকৃতির সেরা উপহার',
        badge_en: 'Nature’s Best Gift',
        title_bn: 'গ্রামের স্বাদ, ঘরের ভালোবাসা',
        title_en: 'Taste of Village, Love of Home',
        subtitle_bn: 'গ্রামবাংলার ঐতিহ্যবাহী খাবার ও দেশি পণ্য এখন এক জায়গায়।',
        subtitle_en: 'Traditional village foods & authentic rural items delivered to your doorstep.',
        cta_text_bn: 'এখনই কেনাকাটা করুন',
        cta_text_en: 'Shop Now',
        cta_link: '/shop',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
        active: true
      },
      {
        id: 2,
        badge_bn: 'শীতের সুবাসিত আয়োজন',
        badge_en: 'Winter Special Edition',
        title_bn: 'খেজুরের খাঁটি রস ও দানাদার গুড়',
        title_en: 'Pure Date Palm Juice & Granular Jaggery',
        subtitle_bn: 'যশোর ও ফরিদপুরের গাছীদের তৈরি খাঁটি পাটালি ও সুস্বাদু নলেন গুড়।',
        subtitle_en: 'Freshly gathered date juice and fragrant jaggery straight from village palms.',
        cta_text_bn: 'গুড়ের সংগ্রহ দেখুন',
        cta_text_en: 'Explore Jaggery',
        cta_link: '/category/jaggery-patali',
        image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1600&q=80',
        active: true
      }
    ],
    promotions: [
      {
        id: 1,
        title_bn: 'খেজুরের রস ও গুড়',
        subtitle_bn: 'শীতের সেরা উপহার',
        title_en: 'Date Juice & Jaggery',
        subtitle_en: 'Winter Special Gift',
        link: '/category/jaggery-patali',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
        bg: 'from-amber-800/80 to-amber-950/90'
      },
      {
        id: 2,
        title_bn: 'দেশি মিঠাই ও মিষ্টি',
        subtitle_bn: 'পারিবারিক আনন্দের সেরা পছন্দ',
        title_en: 'Traditional Sweets & Mithai',
        subtitle_en: 'Best Choice for Family Joy',
        link: '/category/sweets-mithai',
        image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80',
        bg: 'from-orange-800/80 to-stone-900/90'
      },
      {
        id: 3,
        title_bn: 'আচার ও ঘরোয়া খাবার',
        subtitle_bn: 'প্রাকৃতিক উপকরণে তৈরি',
        title_en: 'Pickles & Homemade Food',
        subtitle_en: 'Made with Natural Spices',
        link: '/category/pickles-homemade',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        bg: 'from-emerald-900/80 to-stone-900/90'
      }
    ],
    inquiries: [
      {
        id: 1,
        name: 'তানভীর আহমেদ',
        phone: '01719876543',
        email: 'tanvir@gmail.com',
        subject: 'পাইকারি অর্ডারের জন্য যোগাযোগ',
        message: 'আমি মিষ্টি ও খাঁটি গুড় পাইকারি হিসেবে অর্ডার করতে আগ্রহী। রেট চার্ট পাঠাবেন কি?',
        status: 'read',
        created_at: '2025-10-11T12:00:00Z'
      }
    ],
    subscribers: [
      { id: 1, email: 'customer1@example.com', created_at: '2025-10-10T12:00:00Z' }
    ]
  };
}

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = getInitialData();
        this.save();
      }
    } catch (err) {
      console.error('Error loading database, resetting with seed data:', err);
      this.data = getInitialData();
      this.save();
    }
  }

  save() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  // Helpers
  get(key) {
    return this.data[key];
  }

  set(key, val) {
    this.data[key] = val;
    this.save();
  }
}

const db = new Database();
module.exports = db;
