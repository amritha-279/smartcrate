import React from 'react';

export default function DashboardCard({ title, value, subtitle, icon, color = 'var(--primary)', trend }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-medium)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </span>
        {icon && (
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color, fontSize: '1.2rem'
          }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1.1 }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{subtitle}</div>
      )}
      {trend && (
        <div style={{ fontSize: '0.82rem', color: trend.up ? 'var(--risk-low)' : 'var(--risk-high)', fontWeight: 600 }}>
          {trend.up ? '▲' : '▼'} {trend.label}
        </div>
      )}
    </div>
  );
}
