import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import MarketCard from '../components/MarketCard';
import { useAuth } from '../context/AuthContext';
import { getMarkets, getLatestPricesForCrop } from '../services/marketService';
import { FaSearch, FaSort, FaFilter, FaSyncAlt } from 'react-icons/fa';
import './Markets.css';

const cropTypes = ['Tomato', 'Onion', 'Banana', 'Potato', 'Carrot', 'Brinjal', 'Okra', 'Cabbage'];

export default function Markets({ onLogout }) {
  const { farmer } = useAuth();
  const [markets, setMarkets] = useState([]);
  const [prices, setPrices] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCrop, setFilterCrop] = useState('Tomato');
  const [sortBy, setSortBy] = useState('distance');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [mRes, pRes] = await Promise.all([
        getMarkets(),
        getLatestPricesForCrop(filterCrop),
      ]);
      setMarkets(mRes.data);
      setPrices(pRes.data);
    } catch {
      setError('Failed to load market data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filterCrop]);

  // Build a price map: marketId -> modalPrice
  const priceMap = {};
  prices.forEach(p => { priceMap[p.marketId?._id || p.marketId] = p.modalPrice; });

  const filtered = markets
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.location.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'distance') return (a.distance || 0) - (b.distance || 0);
      if (sortBy === 'price') return (priceMap[b._id] || 0) - (priceMap[a._id] || 0);
      return 0;
    });

  return (
    <DashboardLayout farmer={farmer} pageTitle="Nearby Markets" onLogout={onLogout}>
      <div className="page-content">
        <h1 className="page-title">Nearby Markets</h1>
        <p className="page-subtitle">Compare prices across markets to find the best option for your produce.</p>

        <div className="markets-filters card" style={{ marginBottom: 24 }}>
          <div className="markets-filter-row">
            <div className="markets-search">
              <FaSearch className="markets-search-icon" />
              <input type="text" className="form-input" placeholder="Search markets..." value={search}
                onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaFilter style={{ color: 'var(--text-light)' }} />
                <select className="form-input" style={{ width: 'auto' }} value={filterCrop} onChange={e => setFilterCrop(e.target.value)}>
                  {cropTypes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaSort style={{ color: 'var(--text-light)' }} />
                <select className="form-input" style={{ width: 'auto' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="distance">Sort by Distance</option>
                  <option value="price">Sort by Price</option>
                </select>
              </div>
              <button className="btn btn-outline btn-sm" onClick={load}><FaSyncAlt /> Refresh</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: 40 }}><span className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><FaSearch /><p>No markets found.</p></div>
        ) : (
          <>
            <div className="markets-price-bar card" style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-medium)', marginBottom: 12 }}>
                {filterCrop} — Latest Modal Prices
              </div>
              <div className="markets-price-list">
                {markets.map(m => (
                  <div key={m._id} className="markets-price-item">
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-medium)' }}>{m.name}</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                      {priceMap[m._id] ? `₹${priceMap[m._id]}/kg` : '—'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{m.distance ? `${m.distance} km` : ''}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid-2">
              {filtered.map(market => (
                <MarketCard
                  key={market._id}
                  market={{ ...market, prices: { [filterCrop]: priceMap[market._id] } }}
                  crop={filterCrop}
                  quantity={100}
                  isRecommended={market.isRecommended}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
