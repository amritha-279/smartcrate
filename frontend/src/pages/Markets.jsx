import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import MarketCard from '../components/MarketCard';
import { mockMarkets, cropTypes } from '../data/mockData';
import { FaSearch, FaSort, FaFilter } from 'react-icons/fa';
import './Markets.css';

export default function Markets({ farmer, onLogout }) {
  const [search, setSearch] = useState('');
  const [filterCrop, setFilterCrop] = useState('Tomato');
  const [sortBy, setSortBy] = useState('distance');

  const filtered = mockMarkets
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'price') return (b.prices[filterCrop] || 0) - (a.prices[filterCrop] || 0);
      return 0;
    });

  return (
    <DashboardLayout farmer={farmer} pageTitle="Nearby Markets" onLogout={onLogout}>
      <div className="page-content">
        <h1 className="page-title">Nearby Markets</h1>
        <p className="page-subtitle">Compare prices and distances to find the best market for your produce.</p>

        {/* Filters */}
        <div className="markets-filters card" style={{ marginBottom: 24 }}>
          <div className="markets-filter-row">
            <div className="markets-search">
              <FaSearch className="markets-search-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Search markets..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaFilter style={{ color: 'var(--text-light)' }} />
                <select className="form-input" style={{ width: 'auto' }}
                  value={filterCrop} onChange={e => setFilterCrop(e.target.value)}>
                  {cropTypes.slice(0, 8).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaSort style={{ color: 'var(--text-light)' }} />
                <select className="form-input" style={{ width: 'auto' }}
                  value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="distance">Sort by Distance</option>
                  <option value="price">Sort by Price</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Price summary bar */}
        <div className="markets-price-bar card" style={{ marginBottom: 24 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-medium)', marginBottom: 12 }}>
            {filterCrop} Prices Across Markets
          </div>
          <div className="markets-price-list">
            {mockMarkets.map(m => (
              <div key={m.id} className="markets-price-item">
                <div style={{ fontSize: '0.82rem', color: 'var(--text-medium)' }}>{m.name}</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                  ₹{m.prices[filterCrop] || '--'}/kg
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{m.distance} km</div>
              </div>
            ))}
          </div>
        </div>

        {/* Market cards */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <FaSearch />
            <p>No markets found matching your search.</p>
          </div>
        ) : (
          <div className="grid-2">
            {filtered.map(market => (
              <MarketCard
                key={market.id}
                market={market}
                crop={filterCrop}
                quantity={100}
                isRecommended={market.isRecommended}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
