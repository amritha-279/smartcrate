import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardCard from '../components/DashboardCard';
import HarvestCard from '../components/HarvestCard';
import { useAuth } from '../context/AuthContext';
import { getHarvests } from '../services/harvestService';
import {
  FaSeedling, FaChartLine, FaStore, FaHistory,
  FaExclamationTriangle, FaCheckCircle, FaLeaf, FaClock
} from 'react-icons/fa';
import './Dashboard.css';

const quickActions = [
  { label: 'Add Harvest', icon: <FaSeedling />, path: '/add-harvest', color: 'var(--primary)' },
  { label: 'Check Prediction', icon: <FaChartLine />, path: '/prediction', color: '#2b6cb0' },
  { label: 'View Markets', icon: <FaStore />, path: '/markets', color: '#c05621' },
  { label: 'View History', icon: <FaHistory />, path: '/history', color: '#6b46c1' },
];

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const { farmer } = useAuth();
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getHarvests('Active')
      .then(res => setHarvests(res.data))
      .catch(() => setError('Failed to load harvests.'))
      .finally(() => setLoading(false));
  }, []);

  const highRisk = harvests.filter(h => h.latestPrediction?.spoilageRisk === 'High').length;
  const medRisk = harvests.filter(h => h.latestPrediction?.spoilageRisk === 'Medium').length;

  return (
    <DashboardLayout farmer={farmer} pageTitle="Dashboard" onLogout={onLogout}>
      <div className="page-content">
        <div className="dashboard-welcome">
          <div>
            <h1 className="page-title">Welcome back, {farmer?.name?.split(' ')[0] || 'Farmer'}! 👋</h1>
            <p className="page-subtitle">Here's an overview of your harvest and market status today.</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/add-harvest')}>
            <FaSeedling /> Add New Harvest
          </button>
        </div>

        <div className="grid-4" style={{ marginBottom: 28 }}>
          <DashboardCard title="Active Batches" value={harvests.length} subtitle="Currently being monitored" icon={<FaLeaf />} color="var(--primary)" />
          <DashboardCard title="High Risk Batches" value={highRisk} subtitle="Require immediate action" icon={<FaExclamationTriangle />} color="var(--risk-high)" />
          <DashboardCard title="Medium Risk" value={medRisk} subtitle="Monitor closely" icon={<FaClock />} color="var(--risk-medium)" />
          <DashboardCard title="Safe Batches" value={harvests.length - highRisk - medRisk} subtitle="Good condition" icon={<FaCheckCircle />} color="var(--risk-low)" />
        </div>

        <div className="section-header"><div className="section-title">Quick Actions</div></div>
        <div className="grid-4" style={{ marginBottom: 32 }}>
          {quickActions.map((action) => (
            <button key={action.path} className="dashboard-quick-action" onClick={() => navigate(action.path)} style={{ '--action-color': action.color }}>
              <div className="quick-action-icon">{action.icon}</div>
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        <div className="section-header">
          <div className="section-title">Active Harvest Batches</div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/history')}>View All</button>
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: 40 }}><span className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : harvests.length === 0 ? (
          <div className="empty-state">
            <FaSeedling />
            <p>No active harvest batches. Add your first harvest to get started.</p>
            <button className="btn btn-primary" onClick={() => navigate('/add-harvest')}>Add Harvest</button>
          </div>
        ) : (
          <div className="grid-3">
            {harvests.map((harvest) => (
              <HarvestCard key={harvest._id} harvest={harvest} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
