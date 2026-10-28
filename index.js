require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'grameen_food_masud_jwt_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());

// Public / uploads folders
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Serve static frontend in production if built
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('শুধুমাত্র ইমেজ ফাইল আপলোড করা যাবে।'));
    }
  }
});

// Admin Auth Middleware
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'অননুমোদিত প্রবেশাধিকার। দয়া করে লগইন করুন।' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'টোকেন মেয়াদোত্তীর্ণ বা অকার্যকর।' });
  }
}

// ============================================
// AUTH & ADMIN ROUTES
// ============================================
app.post('/api/admin/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'ইমেইল/ইউজারনেম এবং পাসওয়ার্ড প্রদান করুন।' });
  }

  const admin = db.get('admin');
  const isMatchIdentifier =
    identifier.trim().toLowerCase() === admin.email.toLowerCase() ||
    identifier.trim().toLowerCase() === admin.username.toLowerCase();

  if (!isMatchIdentifier) {
    return res.status(401).json({ success: false, message: 'ভুল ইমেইল অথবা ইউজারনেম।' });
  }

  const isPasswordValid = bcrypt.compareSync(password, admin.password);
  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'পাসওয়ার্ড সঠিক নয়।' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    success: true,
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      username: admin.username,
      email: admin.email,
      role: admin.role
    }
  });
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  const admin = db.get('admin');
  res.json({
    success: true,
    admin: {
      id: admin.id,
      name: admin.name,
      username: admin.username,
      email: admin.email,
      role: admin.role
    }
  });
});

app.put('/api/admin/password', requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' });
  }

  const admin = db.get('admin');
  const isMatch = bcrypt.compareSync(currentPassword, admin.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'বর্তমান পাসওয়ার্ড সঠিক নয়।' });
  }

  const hashed = bcrypt.hashSync(newPassword, 10);
  admin.password = hashed;
  db.set('admin', admin);

  res.json({ success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে।' });
});

// Admin Dashboard Summary Statistics
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const products = db.get('products') || [];
  const orders = db.get('orders') || [];

  const totalProducts = products.length;
  const totalOrders = orders.length;

  const validOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const lowStockCount = products.filter(p => Number(p.stock) <= 10).length;

  // Last 7 days sales calculation
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' });

    const dayTotal = validOrders
      .filter(o => o.created_at && o.created_at.startsWith(dateStr))
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

    days.push({
      date: dateStr,
      label: dayLabel,
      revenue: dayTotal
    });
  }

  // Recent 5 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  res.json({
    success: true,
    stats: {
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockCount,
      recentOrders,
      salesChart: days
    }
  });
});

// ============================================
// FILE UPLOAD ROUTE
// ============================================
app.post('/api/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'কোনো ফাইল আপলোড করা হয়নি।' });
  }
  const url = `/uploads/${req.file.filename}`;
  res.json({ success: true, url });
});

// ============================================
// PRODUCTS API
// ============================================
app.get('/api/products', (req, res) => {
  let products = db.get('products') || [];
  const { category, search, minPrice, maxPrice, sort, featured, bestseller, seasonal, page = 1, limit = 50 } = req.query;

  // Filter category
  if (category && category !== 'all') {
    products = products.filter(p => p.category_slug === category || p.category_name === category);
  }

  // Filter search
  if (search) {
    const q = search.trim().toLowerCase();
    products = products.filter(p =>
      p.name_bn.toLowerCase().includes(q) ||
      (p.name_en && p.name_en.toLowerCase().includes(q)) ||
      (p.description_bn && p.description_bn.toLowerCase().includes(q)) ||
      (p.category_name && p.category_name.toLowerCase().includes(q)) ||
      (p.origin && p.origin.toLowerCase().includes(q))
    );
  }

  // Filter flags
  if (featured === 'true') products = products.filter(p => p.featured);
  if (bestseller === 'true') products = products.filter(p => p.bestseller);
  if (seasonal === 'true') products = products.filter(p => p.seasonal);

  // Price range
  if (minPrice) products = products.filter(p => (p.sale_price || p.price) >= Number(minPrice));
  if (maxPrice) products = products.filter(p => (p.sale_price || p.price) <= Number(maxPrice));

  // Sorting
  if (sort === 'price_asc') {
    products.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
  } else if (sort === 'price_desc') {
    products.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
  } else if (sort === 'rating') {
    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === 'bestseller') {
    products.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
  } else {
    // Newest first by default
    products.sort((a, b) => b.id - a.id);
  }

  // Pagination
  const total = products.length;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = products.slice(startIndex, startIndex + limitNum);

  res.json({
    success: true,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    products: paginated
  });
});

app.get('/api/products/:id', (req, res) => {
  const products = db.get('products') || [];
  const idOrSlug = req.params.id;

  const product = products.find(p => p.id == idOrSlug || p.slug === idOrSlug);
  if (!product) {
    return res.status(404).json({ success: false, message: 'পণ্যটি খুঁজে পাওয়া যায়নি।' });
  }

  // Fetch 4 related products in same category
  const related = products
    .filter(p => p.id !== product.id && p.category_slug === product.category_slug)
    .slice(0, 4);

  res.json({ success: true, product, related });
});

app.post('/api/products', requireAdmin, (req, res) => {
  const products = db.get('products') || [];
  const {
    name_bn,
    name_en,
    category_slug,
    price,
    sale_price,
    unit,
    available_units,
    stock,
    origin,
    ingredients,
    evidence_disclaimer,
    description_bn,
    description_en,
    images,
    bestseller,
    featured,
    seasonal
  } = req.body;

  if (!name_bn || !price || !category_slug) {
    return res.status(400).json({ success: false, message: 'পণ্যের নাম, ক্যাটাগরি এবং মূল্য আবশ্যক।' });
  }

  const categories = db.get('categories') || [];
  const cat = categories.find(c => c.slug === category_slug);

  const priceNum = Number(price);
  const salePriceNum = sale_price ? Number(sale_price) : priceNum;
  const discountPercent = priceNum > salePriceNum ? Math.round(((priceNum - salePriceNum) / priceNum) * 100) : 0;

  const newId = products.length > 0 ? Math.max(...products.map(p => Number(p.id) || 0)) + 1 : 1;
  const slug = `product-${newId}-${Date.now().toString().slice(-4)}`;

  const newProduct = {
    id: newId,
    slug,
    name_bn,
    name_en: name_en || name_bn,
    category_slug,
    category_id: cat ? cat.id : 1,
    category_name: cat ? cat.name_bn : 'সাধারণ',
    price: priceNum,
    sale_price: salePriceNum,
    discount_percent: discountPercent,
    unit: unit || '১ কেজি',
    available_units: available_units && available_units.length ? available_units : [unit || '১ কেজি'],
    stock: Number(stock) || 0,
    rating: 5.0,
    review_count: 0,
    bestseller: Boolean(bestseller),
    featured: Boolean(featured),
    seasonal: Boolean(seasonal),
    origin: origin || 'বাংলাদেশ',
    ingredients: ingredients || '',
    evidence_disclaimer: evidence_disclaimer || 'প্রাকৃতিক খাদ্যপণ্য। কোনো কৃত্রিম রাসায়নিক প্রিজারভেটিভ নেই।',
    description_bn: description_bn || '',
    description_en: description_en || '',
    images: images && images.length ? images : ['https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80']
  };

  products.unshift(newProduct);
  db.set('products', products);

  res.status(201).json({ success: true, message: 'পণ্য সফলভাবে যুক্ত হয়েছে।', product: newProduct });
});

app.put('/api/products/:id', requireAdmin, (req, res) => {
  const products = db.get('products') || [];
  const id = req.params.id;
  const index = products.findIndex(p => p.id == id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'পণ্য খুঁজে পাওয়া যায়নি।' });
  }

  const existing = products[index];
  const updateData = req.body;

  const priceNum = updateData.price !== undefined ? Number(updateData.price) : existing.price;
  const salePriceNum = updateData.sale_price !== undefined ? Number(updateData.sale_price) : existing.sale_price;
  const discountPercent = priceNum > salePriceNum ? Math.round(((priceNum - salePriceNum) / priceNum) * 100) : 0;

  const updatedProduct = {
    ...existing,
    ...updateData,
    price: priceNum,
    sale_price: salePriceNum,
    discount_percent: discountPercent,
    stock: updateData.stock !== undefined ? Number(updateData.stock) : existing.stock
  };

  products[index] = updatedProduct;
  db.set('products', products);

  res.json({ success: true, message: 'পণ্য সফলভাবে আপডেট করা হয়েছে।', product: updatedProduct });
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  let products = db.get('products') || [];
  const id = req.params.id;
  const initialLen = products.length;

  products = products.filter(p => p.id != id);
  if (products.length === initialLen) {
    return res.status(404).json({ success: false, message: 'পণ্য খুঁজে পাওয়া যায়নি।' });
  }

  db.set('products', products);
  res.json({ success: true, message: 'পণ্যটি মুছে ফেলা হয়েছে।' });
});

// ============================================
// CATEGORIES API
// ============================================
app.get('/api/categories', (req, res) => {
  const categories = db.get('categories') || [];
  const products = db.get('products') || [];

  // Calculate real product count per category
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: products.filter(p => p.category_slug === cat.slug).length
  }));

  res.json({ success: true, categories: categoriesWithCounts });
});

app.post('/api/categories', requireAdmin, (req, res) => {
  const categories = db.get('categories') || [];
  const { name_bn, name_en, slug, icon, image, description_bn, description_en } = req.body;

  if (!name_bn || !slug) {
    return res.status(400).json({ success: false, message: 'ক্যাটাগরির নাম ও স্লাগ আবশ্যক।' });
  }

  const existingIndex = categories.findIndex(c => c.slug === slug);
  if (existingIndex > -1) {
    categories[existingIndex] = { ...categories[existingIndex], ...req.body };
  } else {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    categories.push({
      id: newId,
      name_bn,
      name_en: name_en || name_bn,
      slug,
      icon: icon || '🌾',
      image: image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      description_bn: description_bn || '',
      description_en: description_en || ''
    });
  }

  db.set('categories', categories);
  res.json({ success: true, message: 'ক্যাটাগরি সংরক্ষিত হয়েছে।', categories });
});

// ============================================
// ORDERS API
// ============================================
app.get('/api/orders', requireAdmin, (req, res) => {
  let orders = db.get('orders') || [];
  const { status, search } = req.query;

  if (status && status !== 'all') {
    orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.trim().toLowerCase();
    orders = orders.filter(o =>
      (o.order_number && o.order_number.toLowerCase().includes(q)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
      (o.phone && o.phone.includes(q)) ||
      (o.district && o.district.toLowerCase().includes(q))
    );
  }

  // Sort newest first
  orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json({ success: true, orders });
});

// Track order or get order by ID
app.get('/api/orders/:id', (req, res) => {
  const orders = db.get('orders') || [];
  const idOrNum = req.params.id;
  const phone = req.query.phone;

  const order = orders.find(o =>
    o.id == idOrNum ||
    (o.order_number && o.order_number.toLowerCase() === idOrNum.toLowerCase())
  );

  if (!order) {
    return res.status(404).json({ success: false, message: 'অর্ডারটি খুঁজে পাওয়া যায়নি।' });
  }

  // If tracking by phone is requested, verify matching phone
  if (phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const cleanOrderPhone = (order.phone || '').replace(/[^0-9]/g, '');
    if (!cleanOrderPhone.endsWith(cleanPhone.slice(-10))) {
      return res.status(403).json({ success: false, message: 'প্রদত্ত মোবাইল নম্বরের সাথে অর্ডার মেলেনি।' });
    }
  }

  res.json({ success: true, order });
});

// Create Order (Checkout)
app.post('/api/orders', (req, res) => {
  const { customer_name, phone, address, district, notes, items, payment_method } = req.body;

  if (!customer_name || !phone || !address || !items || !items.length) {
    return res.status(400).json({ success: false, message: 'অনুগ্রহ করে সকল আবশ্যক তথ্য এবং অন্তত একটি পণ্য নির্বাচন করুন।' });
  }

  // Validate phone (Bangladeshi 11 digit format check)
  const phoneClean = phone.replace(/[^0-9]/g, '');
  if (phoneClean.length < 11) {
    return res.status(400).json({ success: false, message: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)।' });
  }

  const settings = db.get('settings') || {};
  const isDhaka = (district || '').toLowerCase().includes('ঢাকা') || (district || '').toLowerCase().includes('dhaka');
  const delivery_fee = isDhaka ? (settings.deliveryFeeDhaka || 70) : (settings.deliveryFeeOutside || 130);

  // Calculate items subtotal
  let subtotal = 0;
  const processedItems = items.map(item => {
    const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
    subtotal += itemTotal;
    return {
      product_id: item.product_id || item.id,
      name: item.name || item.name_bn,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      unit: item.unit || '১ কেজি',
      image: item.image || '',
      total: itemTotal
    };
  });

  const total_amount = subtotal + delivery_fee;
  const orders = db.get('orders') || [];

  const nextNum = 10077 + orders.length;
  const orderId = `${nextNum}`;
  const orderNumber = `GFM-${nextNum}`;

  const now = new Date().toISOString();
  const newOrder = {
    id: orderId,
    order_number: orderNumber,
    customer_name: customer_name.trim(),
    phone: phone.trim(),
    address: address.trim(),
    district: district || (isDhaka ? 'ঢাকা' : 'ঢাকার বাইরে'),
    notes: notes || '',
    items: processedItems,
    subtotal,
    delivery_fee,
    discount: 0,
    total_amount,
    payment_method: payment_method || 'cash_on_delivery',
    payment_status: payment_method === 'bkash_gateway' ? 'paid' : 'unpaid',
    status: 'Pending',
    created_at: now,
    timeline: [
      {
        status: 'Pending',
        time: now,
        note: 'অর্ডার সফলভাবে জমা হয়েছে। শীঘ্রই কাস্টমার কেয়ার থেকে যোগাযোগ করা হবে।'
      }
    ]
  };

  orders.unshift(newOrder);
  db.set('orders', orders);

  // Update stock counts
  const products = db.get('products') || [];
  processedItems.forEach(item => {
    const prod = products.find(p => p.id == item.product_id);
    if (prod && prod.stock > 0) {
      prod.stock = Math.max(0, prod.stock - item.quantity);
    }
  });
  db.set('products', products);

  res.status(201).json({
    success: true,
    message: 'আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে!',
    order: newOrder
  });
});

// Update order status
app.put('/api/orders/:id/status', requireAdmin, (req, res) => {
  const orders = db.get('orders') || [];
  const id = req.params.id;
  const { status, note } = req.body;

  const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'অকার্যকর স্ট্যাটাস।' });
  }

  const order = orders.find(o => o.id == id || o.order_number === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'অর্ডারটি খুঁজে পাওয়া যায়নি।' });
  }

  order.status = status;
  if (!order.timeline) order.timeline = [];
  order.timeline.push({
    status,
    time: new Date().toISOString(),
    note: note || `অর্ডার স্ট্যাটাস পরিবর্তন করা হয়েছে: ${status}`
  });

  db.set('orders', orders);
  res.json({ success: true, message: 'অর্ডার স্ট্যাটাস সফলভাবে আপডেট হয়েছে।', order });
});

// Export orders to CSV
app.get('/api/orders/export/csv', requireAdmin, (req, res) => {
  const orders = db.get('orders') || [];

  // CSV with UTF-8 BOM so Excel displays Bengali properly
  const bom = '\uFEFF';
  const headers = ['Order No', 'Customer Name', 'Phone', 'District', 'Address', 'Items', 'Subtotal', 'Delivery Fee', 'Total Amount', 'Payment Method', 'Status', 'Date'];

  const rows = orders.map(o => {
    const itemsSummary = (o.items || []).map(i => `${i.name} (${i.quantity}x)`).join('; ');
    return [
      `"${o.order_number || o.id}"`,
      `"${(o.customer_name || '').replace(/"/g, '""')}"`,
      `"${o.phone || ''}"`,
      `"${(o.district || '').replace(/"/g, '""')}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      o.subtotal || 0,
      o.delivery_fee || 0,
      o.total_amount || 0,
      `"${o.payment_method || ''}"`,
      `"${o.status || ''}"`,
      `"${(o.created_at || '').slice(0, 10)}"`
    ].join(',');
  });

  const csvContent = bom + headers.join(',') + '\n' + rows.join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="grameen-food-orders.csv"');
  res.send(csvContent);
});

// ============================================
// INQUIRIES API (Contact Us)
// ============================================
app.post('/api/inquiries', (req, res) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, message: 'নাম, মোবাইল নম্বর এবং বার্তা আবশ্যক।' });
  }

  const inquiries = db.get('inquiries') || [];
  const newInquiry = {
    id: Date.now(),
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : '',
    subject: subject ? subject.trim() : 'সাধারণ জিজ্ঞাসা',
    message: message.trim(),
    status: 'unread',
    created_at: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  db.set('inquiries', inquiries);

  res.json({ success: true, message: 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। ধন্যবাদ!' });
});

app.get('/api/inquiries', requireAdmin, (req, res) => {
  const inquiries = db.get('inquiries') || [];
  res.json({ success: true, inquiries });
});

app.put('/api/inquiries/:id/status', requireAdmin, (req, res) => {
  const inquiries = db.get('inquiries') || [];
  const inq = inquiries.find(i => i.id == req.params.id);
  if (!inq) {
    return res.status(404).json({ success: false, message: 'মেসেজ পাওয়া যায়নি।' });
  }
  inq.status = req.body.status || 'read';
  db.set('inquiries', inquiries);
  res.json({ success: true, inquiry: inq });
});

// Newsletter subscription
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন।' });
  }
  const subscribers = db.get('subscribers') || [];
  if (!subscribers.some(s => s.email === email)) {
    subscribers.push({ id: Date.now(), email, created_at: new Date().toISOString() });
    db.set('subscribers', subscribers);
  }
  res.json({ success: true, message: 'ধন্যবাদ! আমাদের নিউজলেটারে সাবস্ক্রিপশন সম্পন্ন হয়েছে।' });
});

// ============================================
// BANNERS & PROMOTIONS API
// ============================================
app.get('/api/banners', (req, res) => {
  const banners = db.get('banners') || [];
  const promotions = db.get('promotions') || [];
  res.json({ success: true, banners, promotions });
});

app.put('/api/banners', requireAdmin, (req, res) => {
  const { banners, promotions } = req.body;
  if (banners) db.set('banners', banners);
  if (promotions) db.set('promotions', promotions);
  res.json({ success: true, message: 'ব্যানার ও অফার সফলভাবে আপডেট হয়েছে।' });
});

// Reviews API
app.get('/api/reviews', (req, res) => {
  const reviews = db.get('reviews') || [];
  res.json({ success: true, reviews });
});

// ============================================
// SETTINGS API
// ============================================
app.get('/api/settings', (req, res) => {
  const settings = db.get('settings') || {};
  // Whitelist public fields only - never expose private secrets
  const publicKeys = [
    'siteName', 'tagline', 'tagline_en', 'phone', 'whatsapp', 'email',
    'address_bn', 'address_en', 'currency', 'deliveryFeeDhaka', 'deliveryFeeOutside',
    'freeDeliveryThreshold', 'minOrderAmount', 'announcement_bn', 'announcement_en',
    'bkashMerchantNumber', 'nagadMerchantNumber', 'mapLocationUrl', 'facebookUrl',
    'youtubeUrl', 'instagramUrl'
  ];
  const sanitized = {};
  publicKeys.forEach(key => {
    if (settings[key] !== undefined) {
      sanitized[key] = settings[key];
    }
  });
  res.json({ success: true, settings: sanitized });
});

app.put('/api/settings', requireAdmin, (req, res) => {
  const body = req.body || {};
  const allowedKeys = [
    'siteName', 'tagline', 'tagline_en', 'phone', 'whatsapp', 'email',
    'address_bn', 'address_en', 'currency', 'deliveryFeeDhaka', 'deliveryFeeOutside',
    'freeDeliveryThreshold', 'minOrderAmount', 'announcement_bn', 'announcement_en',
    'bkashMerchantNumber', 'nagadMerchantNumber', 'mapLocationUrl', 'facebookUrl',
    'youtubeUrl', 'instagramUrl'
  ];

  // Validation
  if (body.email !== undefined) {
    const emailTrim = String(body.email).trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrim)) {
      return res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে সঠিক ইমেইল বা জিমেইল ঠিকানা দিন (যেমন: info@grameenfood.com)।'
      });
    }
  }

  if (body.whatsapp !== undefined) {
    const waDigits = String(body.whatsapp).replace(/[^0-9]/g, '');
    if (waDigits.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে সঠিক WhatsApp নম্বর দিন (কমপক্ষে ১০ ডিজিট)।'
      });
    }
  }

  if (body.phone !== undefined) {
    const phoneDigits = String(body.phone).replace(/[^0-9]/g, '');
    if (phoneDigits.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে সঠিক ফোন নম্বর দিন (কমপক্ষে ১০ ডিজিট)।'
      });
    }
  }

  if (body.address_bn !== undefined && !String(body.address_bn).trim()) {
    return res.status(400).json({
      success: false,
      message: 'ব্যবসার ঠিকানা (বাংলা) ফাঁকা রাখা যাবে না।'
    });
  }

  const currentSettings = db.get('settings') || {};
  const updated = { ...currentSettings };

  // Only assign whitelisted properties
  allowedKeys.forEach(k => {
    if (body[k] !== undefined) {
      updated[k] = body[k];
    }
  });

  db.set('settings', updated);
  res.json({
    success: true,
    message: 'সেটিংস সফলভাবে সংরক্ষিত ও আপডেট হয়েছে।',
    settings: updated
  });
});

// Fallback to React index.html for client-side routing if built
if (fs.existsSync(distDir)) {
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(distDir, 'index.html'));
    }
    next();
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`🌾 Grameen Food by MASUD server is running on http://localhost:${PORT}`);
});
