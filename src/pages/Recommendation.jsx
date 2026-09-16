import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import RecommendationCard from '../components/RecommendationCard';
import MarketCard from '../components/MarketCard';
import RiskBadge from '../components/RiskBadge';
import { mockHarvests, mockMarkets } from '../data/mockData';
import { getRecommendation, formatCurrency } from '../utils/predictionUtils';
import { FaSeedling, FaArrowRight, FaTable } from 'react-icons/fa';
import './Recommendation.css';

export default function Recommendation({ farmer }) {
  const location = useLocation();
  const navigate = useNavigate();
  const harvest = location.state?.harvest || mockHarvests[0];
  const [view, setView] = useState('cards');

  // Future: GET /api/recommendation
  const { action, reason, markets, bestMarket } = getRecommendation(harvest, mockMarkets);
  const crop = harvest.crop || harvest.cropType || 'Tomato';
  const qty = harvest.quantity || 100;

  const alternatives = ['Sell Today', 'Wait for a Better Price', 'Move Produce', 'Transport to Another Market']
    .filter(a => !action.includes(a.split(' ')[0]));

  return (
    <DashboardLayout farmer={farmer} pageTitle="Selling Recommendation">
      <div className="page-content">
        <h1 className="page-title">Selling Recommendation</h1>
        <p className="page-subtitle">Based on your crop condition and nearby market prices.</p>

        {/* Harvest summary */}
        <div className="card rec-harvest-summary" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--primary-bg)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary)', fontSize: '1.1rem'
            }}>
              <FaSeedling />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{crop} — {qty} kg</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                Harvested: {harvest.harvestDate || 'Today'}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                  {harvest.remainingShelfLife || harvest.predictedShelfLife || 3} Days
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Shelf Life</div>
              </div>
              <RiskBadge risk={harvest.spoilageRisk || 'Medium'} />
            </div>
          </div>
        </div>

        <div className="rec-main-grid">
          {/* Recommendation */}
          <RecommendationCard action={action} reasons={reason} alternatives={alternatives} />

          {/* Best market highlight */}
          <div className="card rec-best-market">
            <div className="section-title" style={{ marginBottom: 16 }}>Best Market Option</div>
            <MarketCard market={bestMarket} crop={crop} quantity={qty} isRecommended={true} />
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
              onClick={() => navigate('/markets')}
            >
              View All Markets <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Market comparison */}
        <div style={{ marginTop: 28 }}>
          <div className="section-header">
            <div className="section-title">Market Comparison</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={`btn btn-sm ${view === 'cards' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setView('cards')}
              >
                Cards
              </button>
              <button
                className={`btn btn-sm ${view === 'table' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setView('table')}
              >
                <FaTable /> Table
              </button>
            </div>
          </div>

          {view === 'cards' ? (
            <div className="grid-2">
              {markets.map((m, i) => (
                <MarketCard
                  key={m.id}
                  market={m}
                  crop={crop}
                  quantity={qty}
                  isRecommended={i === 0}
                />
              ))}
            </div>
          ) : (
            <div className="card table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Market</th>
                    <th>Distance</th>
                    <th>Travel Time</th>
                    <th>Price/kg</th>
                    <th>Transport Cost</th>
                    <th>Gross Value</th>
                    <th>Net Value</th>
                    <th>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map((m, i) => {
                    const price = m.prices?.[crop] || m.price || 0;
                    const gross = price * qty;
                    const net = gross - m.transportCost;
                    return (
                      <tr key={m.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{m.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{m.location}</div>
                        </td>
                        <td>{m.distance} km</td>
                        <td>{m.travelTime}</td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{price}</td>
                        <td>₹{m.transportCost}</td>
                        <td>{formatCurrency(gross)}</td>
                        <td style={{ fontWeight: 700 }}>{formatCurrency(net)}</td>
                        <td>
                          {i === 0 ? (
                            <span className="badge badge-success">Best Choice</span>
                          ) : (
                            <span className="badge badge-info">Alternative</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
