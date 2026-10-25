import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('gfm_admin_token') || null);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('gfm_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Verify token with backend
      fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAdminUser(data.admin);
            localStorage.setItem('gfm_admin_user', JSON.stringify(data.admin));
          } else {
            logout();
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (identifier, password) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setAdminUser(data.admin);
        localStorage.setItem('gfm_admin_token', data.token);
        localStorage.setItem('gfm_admin_user', JSON.stringify(data.admin));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'লগইন ব্যর্থ হয়েছে।' };
      }
    } catch (err) {
      return { success: false, message: 'সার্ভারে সংযোগ করা সম্ভব হয়নি।' };
    }
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('gfm_admin_token');
    localStorage.removeItem('gfm_admin_user');
  };

  const authHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        adminUser,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        authHeader
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
