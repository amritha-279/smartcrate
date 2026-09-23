import React from 'react';
import { FaMapMarkerAlt, FaClock, FaRupeeSign, FaTruck, FaStar } from 'react-icons/fa';
import { formatCurrency } from '../utils/predictionUtils';

export default function MarketCard({ market, crop, quantity = 100, isRecommended = false }) {
  const price = market.prices?.[crop] || market.price || 0;
  const gross = price * quantity;
  const net = gross - (market.transportCost || 0);

  return (
    <div className={`card ${isRecommended ? 'recommended-card' : ''}`} style={{ position: 'relative' }}>
      {isRecommended && <div className="recommended-label"><FaStar style={{ marginRight: 4 }} />Best Choice</div>}

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: 2 }}>
          {market.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-light)', fontSize: '0.85rem' }}>
          <FaMapMarkerAlt /> {market.location}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 12px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: 2 }}>Distance</div>
          <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{market.distance} km</div>
        </div>
        <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 12px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: 2 }}>
            <FaClock style={{ marginRight: 3 }} />Travel Time
          </div>
          <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{market.travelTime}</div>
        </div>
        <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 12px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: 2 }}>
            <FaRupeeSign style={{ marginRight: 3 }} />Price/kg
          </div>
          <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{price}</div>
        </div>
        <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '8px 12px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: 2 }}>
            <FaTruck style={{ marginRight: 3 }} />Transport Cost
          </div>
          <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>₹{market.transportCost}</div>
        </div>
      </div>

      {crop && (
        <div style={{
          background: isRecommended ? 'var(--primary-bg)' : 'var(--bg)',
          borderRadius: 8, padding: '10px 14px',
          border: isRecommended ? '1px solid var(--border)' : 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-medium)', fontWeight: 600 }}>
              Expected Net Value
            </span>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: isRecommended ? 'var(--primary)' : 'var(--text-dark)' }}>
              {formatCurrency(net)}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: 2 }}>
            Gross {formatCurrency(gross)} − Transport {formatCurrency(market.transportCost)}
          </div>
        </div>
      )}
    </div>
  );
}
