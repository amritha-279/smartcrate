import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import RecommendationCard from '../components/RecommendationCard';
import MarketCard from '../components/MarketCard';
import RiskBadge from '../components/RiskBadge';
import { useAuth } from '../context/AuthContext';
import { generateRecommendation, getLatestRecommendation } from '../services/recommendationService';
import { getHarvest } from '../services/harvestService';
import { FaSeedling, FaArrowRight, FaTable, FaSyncAlt } from 'react-icons/fa';
import './Recommendation.css';

export default function Recommendation({ onLogout }) {
  const { harvestId } = useParams();
  const navigate = useNavigate();
  const { farmer } = useAuth();
  const [harvest, setHarvest] = useState(null);
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('cards');

  const load = async () => {
    if (!harvestId) { setError('No harvest selected.'); setLoading(false); return; }
    setLoading(true);
    try {
      const [hRes, rRes] = await Promise.allSettled([
        getHarvest(harvestId),
        getLatestRecommendation(harvestId),
      ]);
      if (hRes.status === 'fulfilled') setHarvest(hRes.value.data);
      if (rRes.status === 'fulfilled') setRec(rRes.value.data);
    } catch {
      setError('Failed to load recommendation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [harvestId]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await generateRecommendation(harvestId);
      setRec(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate recommendation.');
    } finally {
      setGenerating(false);
    }
  };

  const crop = harvest?.crop || '';
  const qty = harvest?.quantity || 0;

  return (
    <DashboardLayout farmer={farmer} pageTitle="Selling Recommendation" onLogout={onLogout}>
      <div className="page-content">
        <h1 className="page-title">Selling Recommendation</h1>
        <p className="page-subtitle">Based on your crop condition and current market prices.</p>

        {loading ? (
          <div className="flex-center" style={{ padding: 40 }}><span className="spinner" /></div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <>
            {harvest && (
              <div className="card rec-harvest-summary" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.1rem' }}>
                    <FaSeedling />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{crop} — {qty} kg</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>Harvested: {harvest.harvestDate?.slice(0, 10)}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
                    {rec && <><div style={{ textAlign: 'center' }}><div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>{rec.remainingShelfLife} Days</div><div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Shelf Life</div></div><RiskBadge risk={rec.spoilageRisk} /></>}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
                {generating ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Generating...</> : <><FaSyncAlt /> {rec ? 'Regenerate' : 'Generate Recommendation'}</>}
              </button>
            </div>

            {!rec ? (
              <div className="alert alert-info">Click "Generate Recommendation" to get a selling decision based on the latest prediction and market prices.</div>
            ) : (
              <>
                <div className="rec-main-grid">
                  <RecommendationCard action={rec.action} reasons={rec.reasons} alternatives={[]} />
                  {rec.marketsConsidered?.[0] && (
                    <div className="card rec-best-market">
                      <div className="section-title" style={{ marginBottom: 16 }}>Best Market Option</div>
                      <MarketCard
                        market={{ name: rec.marketsConsidered[0].marketName, distance: rec.marketsConsidered[0].distance, travelTime: rec.marketsConsidered[0].travelTime, transportCost: rec.marketsConsidered[0].transportCost, prices: { [crop]: rec.marketsConsidered[0].pricePerKg } }}
                        crop={crop} quantity={qty} isRecommended={true}
                      />
                      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} onClick={() => navigate('/markets')}>
                        View All Markets <FaArrowRight />
                      </button>
                    </div>
                  )}
                </div>

                {rec.marketsConsidered?.length > 0 && (
                  <div style={{ marginTop: 28 }}>
                    <div className="section-header">
                      <div className="section-title">Market Comparison</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className={`btn btn-sm ${view === 'cards' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('cards')}>Cards</button>
                        <button className={`btn btn-sm ${view === 'table' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setView('table')}><FaTable /> Table</button>
                      </div>
                    </div>

                    {view === 'cards' ? (
                      <div className="grid-2">
                        {rec.marketsConsidered.map((m, i) => (
                          <MarketCard key={i} market={{ name: m.marketName, distance: m.distance, travelTime: m.travelTime, transportCost: m.transportCost, prices: { [crop]: m.pricePerKg } }} crop={crop} quantity={qty} isRecommended={i === 0} />
                        ))}
                      </div>
                    ) : (
                      <div className="card table-wrap">
                        <table>
                          <thead><tr><th>Market</th><th>Distance</th><th>Price/kg</th><th>Transport</th><th>Gross Value</th><th>Net Value</th><th>Safe to Travel</th></tr></thead>
                          <tbody>
                            {rec.marketsConsidered.map((m, i) => (
                              <tr key={i}>
                                <td style={{ fontWeight: 600 }}>{m.marketName}</td>
                                <td>{m.distance} km</td>
                                <td style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{m.pricePerKg}</td>
                                <td>₹{m.transportCost}</td>
                                <td>₹{m.grossValue?.toLocaleString('en-IN')}</td>
                                <td style={{ fontWeight: 700 }}>₹{m.netValue?.toLocaleString('en-IN')}</td>
                                <td>{m.safeToTravel ? <span className="badge badge-success">Yes</span> : <span className="badge badge-high">No</span>}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
