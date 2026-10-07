import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import RiskBadge from '../components/RiskBadge';
import { useAuth } from '../context/AuthContext';
import { getHarvests } from '../services/harvestService';
import { FaHistory, FaSearch } from 'react-icons/fa';

export default function History({ onLogout }) {
  const { farmer } = useAuth();
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getHarvests()
      .then(res => setHarvests(res.data))
      .catch(() => setError('Failed to load harvest history.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = harvests.filter(h =>
    h.crop.toLowerCase().includes(search.toLowerCase()) ||
    (h.status || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout farmer={farmer} pageTitle="Harvest History" onLogout={onLogout}>
      <div className="page-content">
        <h1 className="page-title">Harvest History</h1>
        <p className="page-subtitle">View all your harvest batches and their status.</p>

        <div className="card" style={{ marginBottom: 24, padding: '14px 20px' }}>
          <div style={{ position: 'relative', maxWidth: 360 }}>
            <FaSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input type="text" className="form-input" placeholder="Search by crop or status..." value={search}
              onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
          </div>
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: 40 }}><span className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><FaHistory /><p>No harvest records found.</p></div>
        ) : (
          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Crop</th><th>Variety</th><th>Quantity</th><th>Harvest Date</th>
                  <th>Maturity</th><th>Storage</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(h => (
                  <tr key={h._id}>
                    <td style={{ fontWeight: 600 }}>{h.crop}</td>
                    <td>{h.variety || '—'}</td>
                    <td>{h.quantity} kg</td>
                    <td>{h.harvestDate?.slice(0, 10)}</td>
                    <td>{h.maturityStage || '—'}</td>
                    <td>{h.storageType || '—'}</td>
                    <td><span className={`badge ${h.status === 'Active' ? 'badge-success' : h.status === 'Sold' ? 'badge-info' : 'badge-medium'}`}>{h.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid-3" style={{ marginTop: 24 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{harvests.length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Total Batches</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{harvests.filter(h => h.status === 'Active').length}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Active</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{harvests.reduce((s, h) => s + (h.quantity || 0), 0)} kg</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Total Quantity</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
