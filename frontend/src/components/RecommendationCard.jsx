import React from 'react';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const actionColors = {
  'Sell Today': 'var(--risk-high)',
  'Wait for a Better Price': 'var(--risk-low)',
  'Move Produce': 'var(--risk-medium)',
};

export default function RecommendationCard({ action, reasons = [], alternatives = [] }) {
  const isTransport = action?.startsWith('Transport');
  const color = isTransport ? 'var(--primary)' : (actionColors[action] || 'var(--primary)');

  return (
    <div className="card" style={{
      border: `2px solid ${color}`,
      background: `linear-gradient(135deg, ${color}08 0%, var(--white) 100%)`,
    }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 64, height: 64, borderRadius: '50%',
          background: `${color}18`, color, fontSize: '1.8rem', marginBottom: 12
        }}>
          <FaArrowRight />
        </div>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>
          Your Recommendation
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1.2 }}>
          {action}
        </div>
      </div>

      {reasons.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-dark)', marginBottom: 10 }}>Why?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reasons.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <FaCheckCircle style={{ color, marginTop: 3, flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-medium)' }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {alternatives.length > 0 && (
        <div>
          <hr className="divider" />
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-medium)', marginBottom: 10 }}>
            Alternative Actions
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {alternatives.map((alt, i) => (
              <span key={i} style={{
                padding: '5px 14px', borderRadius: 20,
                background: 'var(--bg)', color: 'var(--text-medium)',
                fontSize: '0.82rem', fontWeight: 600,
                border: '1px solid var(--border)'
              }}>
                {alt}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
