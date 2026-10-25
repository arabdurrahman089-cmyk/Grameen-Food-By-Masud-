import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SettingsContext = createContext();

const defaultSettings = {
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
  mapLocationUrl: 'https://maps.google.com/?q=Gazipur,Bangladesh'
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('সেটিংস লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Clean WhatsApp number (keeps only digits for wa.me links, e.g. 8801712345678)
  const getCleanWhatsAppNumber = useCallback(() => {
    const raw = settings.whatsapp || '8801712345678';
    let digits = raw.replace(/[^0-9]/g, '');
    if (digits.startsWith('01')) {
      digits = '88' + digits;
    }
    return digits;
  }, [settings.whatsapp]);

  // Clean phone number for tel: links
  const getCleanPhoneNumber = useCallback(() => {
    const raw = settings.phone || '01712-345678';
    return raw.replace(/[^0-9+]/g, '');
  }, [settings.phone]);

  // Mailto link for Gmail / Email
  const getMailtoUrl = useCallback((subject = '') => {
    const email = settings.email || 'info@grameenfood.com';
    return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
  }, [settings.email]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        refreshSettings: fetchSettings,
        cleanWhatsAppNumber: getCleanWhatsAppNumber(),
        cleanPhoneNumber: getCleanPhoneNumber(),
        mailtoUrl: getMailtoUrl(),
        getMailtoUrl,
        loading,
        error
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
