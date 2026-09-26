import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import RiskBadge from '../components/RiskBadge';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { getLatestPrediction } from '../services/predictionService';
import { getHarvest } from '../services/harvestService';
import { getLatestReading } from '../services/sensorService';
import { FaSeedling, FaThermometerHalf, FaTint, FaFlask, FaLightbulb, FaArrowRight, FaSyncAlt } from 'react-icons/fa';
import './Prediction.css';

export default function Prediction({ onLogout }) {
  const { harvestId } = useParams();
  const navigate = useNavigate();
  const { farmer } = useAuth();
  const [harvest, setHarvest] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [sensor, setSensor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    if (!harvestId) { setError('No harvest selected.'); setLoading(false); return; }
    setLoading(true);
    try {
      const [hRes, pRes, sRes] = await Promise.allSettled([
        getHarvest(harvestId),
        getLatestPrediction(harvestId),
        getLatestReading(harvestId),
      ]);
      if (hRes.status === 'fulfilled') setHarvest(hRes.value.data);
      if (pRes.status === 'fulfilled') setPrediction(pRes.value.data);
      if (sRes.status === 'fulfilled') setSensor(sRes.value.data);
    } catch {
      setError('Failed to load prediction data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [harvestId]);

  if (loading) return <DashboardLayout farmer={farmer} pageTitle="Prediction" onLogout={onLogout}><div className="flex-center" style={{ padding: 60 }}><span className="spinner" /></div></DashboardLayout>;
  if (error) return <DashboardLayout farmer={farmer} pageTitle="Prediction" onLogout={onLogout}><div className="page-content"><div className="alert alert-error">{error}</div></DashboardLayout>;

  const shelfLife = prediction?.remainingShelfLife;
  const risk = prediction?.spoilageRisk;
  const circleColor = risk === 'High' ? 'var(--risk-high)' : risk === 'Medium' ? 'var(--risk-medium)' : 'var(--risk-low)';

  return (
    <DashboardLayout farmer={farmer} pageTitle="Shelf-Life Prediction" onLogout={onLogout}>
      <div className="page-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 className="page-title">Shelf-Life Prediction</h1>
            <p className="page-subtitle">
              {prediction?.source === 'ml_model'
                ? <span className="badge badge-success">ML Model</span>
                : <span className="demo-badge">Rule-Based Fallback</span>}
              &nbsp;Results based on latest sensor readings.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={load}><FaSyncAlt /> Refresh</button>
            {harvestId && (
              <button className="btn btn-primary" onClick={() => navigate(`/recommendation/${harvestId}`)}>
                Get Recommendation <FaArrowRight />
              </button>
            )}
          </div>
        </div>

        {!prediction ? (
          <div className="alert alert-warning">No prediction available yet. Add sensor data for this harvest first.</div>
        ) : (
          <div className="prediction-grid">
            <div className="card prediction-main-card">
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
                  <FaSeedling style={{ marginRight: 6 }} />{harvest?.crop}
                </div>
                <div className="prediction-circle" style={{ '--circle-color': circleColor }}>
                  <div className="prediction-circle-inner">
                    <div className="prediction-circle-value">{shelfLife?.toFixed(1)}</div>
                    <div className="prediction-circle-unit">Days</div>
                  </div>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-medium)', marginBottom: 16 }}>Remaining Shelf Life</div>
                <RiskBadge risk={risk} />
              </div>

              {prediction.shelfLifeConfidence && (
                <div className="prediction-confidence">
                  <span>Prediction Confidence</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, background: 'var(--border)', borderRadius: 20, height: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${(prediction.shelfLifeConfidence * 100).toFixed(0)}%`, height: '100%', background: 'var(--primary)', borderRadius: 20 }} />
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', minWidth: 36 }}>{(prediction.shelfLifeConfidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 16, fontSize: '0.78rem', color: 'var(--text-light)', textAlign: 'center' }}>
                Predicted at: {new Date(prediction.predictedAt).toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {sensor && (
                <div className="card">
                  <div className="section-title" style={{ marginBottom: 16 }}>Latest Sensor Readings</div>
                  <div className="prediction-conditions">
                    {[
                      { label: 'Temperature', value: `${sensor.temperature}°C`, icon: <FaThermometerHalf />, bg: '#fff5f5', color: 'var(--risk-high)' },
                      { label: 'Humidity', value: `${sensor.humidity}%`, icon: <FaTint />, bg: '#ebf8ff', color: '#2b6cb0' },
                      { label: 'Ethylene', value: `${sensor.ethylene} ppm`, icon: <FaFlask />, bg: '#f0fff4', color: 'var(--risk-low)' },
                      { label: 'VOC', value: `${sensor.voc} ppm`, icon: <FaFlask />, bg: '#fffaf0', color: 'var(--risk-medium)' },
                    ].map(({ label, value, icon, bg, color }) => (
                      <div className="condition-item" key={label}>
                        <div className="condition-icon" style={{ background: bg, color }}>{icon}</div>
                        <div><div className="condition-label">{label}</div><div className="condition-value">{value}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card prediction-summary-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <FaLightbulb style={{ color: 'var(--accent)', fontSize: '1.1rem' }} />
                  <div className="section-title">Summary</div>
                </div>
                <div className="prediction-summary-items">
                  <div className="summary-item"><span>Crop</span><strong>{harvest?.crop}</strong></div>
                  <div className="summary-item"><span>Quantity</span><strong>{harvest?.quantity} kg</strong></div>
                  <div className="summary-item"><span>Harvest Date</span><strong>{harvest?.harvestDate?.slice(0, 10)}</strong></div>
                  <div className="summary-item"><span>Storage</span><strong>{harvest?.storageType || '—'}</strong></div>
                  <div className="summary-item"><span>Maturity</span><strong>{harvest?.maturityStage || '—'}</strong></div>
                  <div className="summary-item"><span>Risk</span><strong>{risk}</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
