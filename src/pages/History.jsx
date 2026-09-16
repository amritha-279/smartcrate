import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import RiskBadge from '../components/RiskBadge';
import { mockHistory } from '../data/mockData';
import { formatCurrency } from '../utils/predictionUtils';
import { FaHistory, FaSearch } from 'react-icons/fa';

export default function History({ farmer }) {
  const [search, setSearch] = useState('');

  const filtered = mockHistory.filter(h =>
    h.crop.toLowerCase().includes(search.toLowerCase()) ||
    h.marketSold.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout farmer={farmer} pageTitle="Harvest History">
      <div className="page-content">
        <h1 className="page-title">Harvest History</h1>
        <p className="page-subtitle">View all your past harvest batches and selling records.</p>

        <div className="card" style={{ marginBottom: 24, padding: '14px 20px' }}>
          <div style={{ position: 'relative', maxWidth: 360 }}>
            <FaSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by crop or market..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <FaHistory />
            <p>No harvest history found.</p>
          </div>
        ) : (
          <div className="card table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Quantity</th>
                  <th>Harvest Date</th>
                  <th>Shelf Life</th>
                  <th>Risk</th>
                  <th>Market Sold</th>
                  <th>Price/kg</th>
                  <th>Total Earned</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(h => (
                  <tr key={h.id}>
                    <td style={{ fontWeight: 600 }}>{h.crop}</td>
                    <td>{h.quantity} kg</td>
                    <td>{h.harvestDate}</td>
                    <td>{h.predictedShelfLife} days</td>
                    <td><RiskBadge risk={h.risk} /></td>
                    <td>{h.marketSold}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{h.sellingPrice}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(h.totalEarned)}</td>
                    <td>
                      <span className="badge badge-success">{h.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        <div className="grid-3" style={{ marginTop: 24 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {mockHistory.length}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Total Batches Sold</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {mockHistory.reduce((s, h) => s + h.quantity, 0)} kg
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Total Quantity Sold</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {formatCurrency(mockHistory.reduce((s, h) => s + h.totalEarned, 0))}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Total Earnings</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
