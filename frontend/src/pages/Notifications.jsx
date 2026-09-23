import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import NotificationCard from '../components/NotificationCard';
import { mockNotifications } from '../data/mockData';
import { FaBell, FaCheckDouble } from 'react-icons/fa';

export default function Notifications({ farmer, onLogout }) {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
            <button className="btn btn-outline btn-sm" onClick={markAllRead}>
              <FaCheckDouble /> Mark All as Read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <FaBell />
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.map(n => (
              <NotificationCard key={n.id} notification={n} onMarkRead={markRead} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
