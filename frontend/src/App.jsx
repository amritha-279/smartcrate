import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddHarvest from './pages/AddHarvest';
import Prediction from './pages/Prediction';
import Markets from './pages/Markets';
import Recommendation from './pages/Recommendation';
import History from './pages/History';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

import './styles/global.css';

function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  if (loading) return <div className="flex-center" style={{ minHeight: '100vh' }}><span className="spinner" /></div>;
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isLoggedIn, farmer, loading } = useAuth();
  if (loading) return <div className="flex-center" style={{ minHeight: '100vh' }}><span className="spinner" /></div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (farmer?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/add-harvest" element={<ProtectedRoute><AddHarvest /></ProtectedRoute>} />
      <Route path="/prediction/:harvestId?" element={<ProtectedRoute><Prediction /></ProtectedRoute>} />
      <Route path="/markets" element={<ProtectedRoute><Markets /></ProtectedRoute>} />
      <Route path="/recommendation/:harvestId?" element={<ProtectedRoute><Recommendation /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
