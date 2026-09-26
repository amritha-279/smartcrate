import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import NotificationCard from '../components/NotificationCard';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markRead, markAllRead } from '../services/notificationService';
import { FaBell, FaCheckDouble } from 'react-icons/fa';

export default function Notifications({ onLogout }) {
  const { farmer } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getNotifications()
      .then(res => setNotifications(res.data))
      .catch(() => setError('Failed to load notifications.'))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {}
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout farmer={farmer} pageTitle="Notifications" onLogout={onLogout}>
      <div className="page-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">
              {unread > 0 ? `You have ${unread} unread notification${unread > 1 ? 's' : ''}.` : 'All notifications are read.'}
            </p>
          </div>
          {unread > 0 && (
            <button className="btn btn-outline btn-sm" onClick={handleMarkAllRead}>
              <FaCheckDouble /> Mark All as Read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: 40 }}><span className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="empty-state"><FaBell /><p>No notifications yet.</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.map(n => (
              <NotificationCard key={n._id} notification={n} onMarkRead={() => handleMarkRead(n._id)} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
