import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [farmer, setFarmer] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // true while checking stored token

  useEffect(() => {
    const token = localStorage.getItem('sc_token');
    if (!token) { setLoading(false); return; }
    getMe()
      .then((res) => {
        setFarmer(res.data);
        setIsLoggedIn(true);
      })
      .catch(() => {
        localStorage.removeItem('sc_token');
        localStorage.removeItem('sc_farmer');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, farmerData) => {
    localStorage.setItem('sc_token', token);
    localStorage.setItem('sc_farmer', JSON.stringify(farmerData));
    setFarmer(farmerData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_farmer');
    setFarmer(null);
    setIsLoggedIn(false);
  };

  const updateFarmer = (updatedFarmer) => {
    setFarmer(updatedFarmer);
    localStorage.setItem('sc_farmer', JSON.stringify(updatedFarmer));
  };

  return (
    <AuthContext.Provider value={{ farmer, isLoggedIn, loading, login, logout, updateFarmer }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
