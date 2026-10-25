import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';

// Public Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import { ShippingPolicyPage, ReturnPolicyPage, PrivacyPolicyPage, TermsPage } from './pages/PolicyPages';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminInquiriesPage from './pages/admin/AdminInquiriesPage';
import AdminBannersPage from './pages/admin/AdminBannersPage';
import AdminDeliveryPage from './pages/admin/AdminDeliveryPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Public Layout Wrapper
function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/shop" element={<PublicLayout><ShopPage /></PublicLayout>} />
        <Route path="/product/:id" element={<PublicLayout><ProductDetailsPage /></PublicLayout>} />
        <Route path="/category/:slug" element={<PublicLayout><CategoryPage /></PublicLayout>} />
        <Route path="/cart" element={<PublicLayout><CartPage /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
        <Route path="/order-confirmation/:orderId" element={<PublicLayout><OrderConfirmationPage /></PublicLayout>} />
        <Route path="/track-order" element={<PublicLayout><OrderTrackingPage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutUsPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactUsPage /></PublicLayout>} />
        <Route path="/policy/shipping" element={<PublicLayout><ShippingPolicyPage /></PublicLayout>} />
        <Route path="/policy/returns" element={<PublicLayout><ReturnPolicyPage /></PublicLayout>} />
        <Route path="/policy/privacy" element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} />
        <Route path="/policy/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Admin Protected Suite */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="inquiries" element={<AdminInquiriesPage />} />
          <Route path="banners" element={<AdminBannersPage />} />
          <Route path="delivery" element={<AdminDeliveryPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}
