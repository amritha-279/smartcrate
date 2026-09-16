import React from 'react';

export default function ProgressBar({ value, max = 100, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const barColor = color || (pct > 60 ? 'var(--risk-low)' : pct > 30 ? 'var(--risk-medium)' : 'var(--risk-high)');
  return (
    <div>
      <div className="progress-bar-wrap">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.8rem', color: 'var(--text-light)' }}>
        <span>{value} days remaining</span>
        <span>{pct}%</span>
      </div>
    </div>
  );
}
