import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';
import { createHarvest } from '../services/harvestService';
import { postSensorReading, getLatestReading } from '../services/sensorService';
import {
  FaSeedling, FaThermometerHalf, FaTint, FaFlask,
  FaCheckCircle, FaChartLine, FaMicrochip, FaWifi,
  FaSyncAlt, FaCalendarAlt, FaClock, FaRobot, FaLock
} from 'react-icons/fa';
import './AddHarvest.css';

const cropTypes = [
  'Tomato', 'Onion', 'Banana', 'Potato', 'Carrot',
  'Brinjal', 'Okra', 'Cabbage', 'Cauliflower', 'Spinach',
  'Mango', 'Grapes', 'Papaya', 'Guava', 'Pomegranate',
];

const todayDate = () => new Date().toISOString().split('T')[0];
const currentTime = () => new Date().toTimeString().slice(0, 5);

const initialForm = {
  crop: '', variety: '', quantity: '',
  harvestDate: todayDate(), harvestTime: currentTime(),
  maturityStage: '', storageType: '', storageCondition: '',
};

export default function AddHarvest({ onLogout }) {
  const navigate = useNavigate();
  const { farmer } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedHarvestId, setSavedHarvestId] = useState(null);
  const [sensorLoading, setSensorLoading] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const [sensorError, setSensorError] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setForm(prev => ({ ...prev, harvestDate: todayDate(), harvestTime: currentTime() }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  /**
   * In development: posts a simulated sensor reading to the backend.
   * In production: the ESP32 posts directly to POST /api/sensors/readings.
   * The frontend polls GET /api/sensors/readings/:harvestId for the latest reading.
   */
  const handleFetchSensorData = async () => {
    if (!savedHarvestId) {
      setSensorError('Save the harvest first, then fetch sensor data.');
      return;
    }
    setSensorLoading(true);
    setSensorError('');
    try {
      if (import.meta.env.DEV) {
        // Dev simulator: post a simulated reading on behalf of the device
        const simulated = {
          harvestId: savedHarvestId,
          temperature: parseFloat((26 + Math.random() * 10).toFixed(1)),
          humidity: parseFloat((55 + Math.random() * 25).toFixed(1)),
          ethylene: parseFloat((0.8 + Math.random() * 3).toFixed(2)),
          voc: parseFloat((0.4 + Math.random() * 1.8).toFixed(2)),
          co2: parseFloat((400 + Math.random() * 300).toFixed(0)),
        };
        await postSensorReading(simulated);
      }
      // Poll latest reading (works for both real ESP32 and simulator)
      const res = await getLatestReading(savedHarvestId);
      setSensorData(res.data);
    } catch (err) {
      setSensorError(err.response?.data?.message || 'Failed to fetch sensor data.');
    } finally {
      setSensorLoading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.crop) e.crop = 'Crop type is required.';
    if (!form.quantity || isNaN(form.quantity) || +form.quantity <= 0) e.quantity = 'Enter a valid quantity.';
    if (!form.harvestDate) e.harvestDate = 'Harvest date is required.';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    setApiError('');
    try {
      const res = await createHarvest({
        ...form,
        quantity: Number(form.quantity),
        farmerLocation: farmer?.location,
      });
      setSavedHarvestId(res.data._id);
      setSaved(true);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save harvest.');
    } finally {
      setSaving(false);
    }
  };

  const handleGoToPredict = () => {
    if (savedHarvestId) navigate(`/prediction/${savedHarvestId}`);
  };

  return (
    <DashboardLayout farmer={farmer} pageTitle="Add Harvest" onLogout={onLogout}>
      <div className="page-content">
        <h1 className="page-title">Add New Harvest</h1>
        <p className="page-subtitle">Fill in your crop details. Sensor data is fetched from the IoT device after saving.</p>

        {saved && (
          <div className="alert alert-success">
            <FaCheckCircle /> Harvest saved! Now fetch sensor data, then go to Prediction.
          </div>
        )}
        {apiError && <div className="alert alert-error">{apiError}</div>}

        <div className="add-harvest-grid">
          {/* Crop Details */}
          <div className="card">
            <div className="add-harvest-section-title"><FaSeedling /> Crop Details</div>
            <div className="auto-section-label"><FaSeedling style={{ fontSize: '0.8rem' }} /> Enter manually</div>
            <div className="form-row-2">
              <InputField label="Crop Type" name="crop" type="select"
                value={form.crop} onChange={handleChange}
                options={cropTypes} error={errors.crop} required />
              <InputField label="Variety" name="variety" type="text"
                value={form.variety} onChange={handleChange} placeholder="e.g. Hybrid, Nendran" />
            </div>
            <InputField label="Quantity (kg)" name="quantity" type="number"
              value={form.quantity} onChange={handleChange}
              placeholder="e.g. 120" error={errors.quantity} required min="1" />
            <InputField label="Storage Type" name="storageType" type="text"
              value={form.storageType} onChange={handleChange} placeholder="e.g. Open Shed, Cold Room" />

            <hr className="divider" />
            <div className="auto-section-label"><FaRobot style={{ fontSize: '0.8rem' }} /> Auto-filled by system</div>
            <div className="form-row-2">
              <div className="auto-field">
                <div className="auto-field-icon"><FaCalendarAlt /></div>
                <div className="auto-field-body">
                  <div className="auto-field-label">Harvest Date</div>
                  <div className="auto-field-value">{form.harvestDate}</div>
                </div>
                <span className="badge badge-info">Auto</span>
              </div>
              <div className="auto-field">
                <div className="auto-field-icon"><FaClock /></div>
                <div className="auto-field-body">
                  <div className="auto-field-label">Harvest Time</div>
                  <div className="auto-field-value">{form.harvestTime}</div>
                </div>
                <span className="badge badge-info">Auto</span>
              </div>
            </div>
          </div>

          {/* Sensor Data */}
          <div className="card">
            <div className="add-harvest-section-title"><FaMicrochip /> Sensor Data</div>
            <div className="sensor-panel">
              <div className="sensor-panel-left">
                <div className="sensor-status-dot" style={{ background: sensorData ? 'var(--risk-low)' : '#aaa' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                    {sensorData ? 'Sensor Data Received' : 'Hardware Sensor'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                    {sensorData
                      ? `Source: ${sensorData.source} — ${new Date(sensorData.timestamp).toLocaleTimeString()}`
                      : saved ? 'Click to fetch live readings from device' : 'Save harvest first to enable sensor fetch'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className={`btn btn-sm ${sensorData ? 'btn-outline' : 'btn-primary'}`}
                onClick={handleFetchSensorData}
                disabled={sensorLoading || !saved}
              >
                {sensorLoading
                  ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Reading...</>
                  : sensorData ? <><FaSyncAlt /> Refresh</> : <><FaWifi /> Fetch Sensor Data</>}
              </button>
            </div>

            {sensorError && <div className="alert alert-error" style={{ marginBottom: 12 }}>{sensorError}</div>}

            {!sensorData && !sensorLoading && (
              <div className="sensor-placeholder">
                <FaMicrochip style={{ fontSize: '2rem', color: 'var(--border)', marginBottom: 8 }} />
                <p>{saved ? 'Sensor readings will appear here after fetching.' : 'Save the harvest first.'}</p>
              </div>
            )}

            {sensorData && (
              <div className="form-row-2">
                {[
                  { label: 'Temperature', value: `${sensorData.temperature} °C`, icon: <FaThermometerHalf />, bg: '#fff5f5', color: 'var(--risk-high)' },
                  { label: 'Humidity', value: `${sensorData.humidity} %`, icon: <FaTint />, bg: '#ebf8ff', color: '#2b6cb0' },
                  { label: 'Ethylene', value: `${sensorData.ethylene} ppm`, icon: <FaFlask />, bg: '#f0fff4', color: 'var(--risk-low)' },
                  { label: 'VOC', value: `${sensorData.voc} ppm`, icon: <FaFlask />, bg: '#fffaf0', color: 'var(--risk-medium)' },
                ].map(({ label, value, icon, bg, color }) => (
                  <div className="sensor-field" key={label}>
                    <div className="sensor-field-icon" style={{ background: bg, color }}>{icon}</div>
                    <div className="sensor-field-body">
                      <div className="sensor-field-label">{label}</div>
                      <div className="sensor-field-value">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="add-harvest-actions">
          <button className="btn btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || saved}>
            {saving
              ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</>
              : <><FaCheckCircle /> Save Harvest</>}
          </button>
          {saved && (
            <button className="btn btn-outline" onClick={handleGoToPredict} disabled={!sensorData}>
              <FaChartLine /> View Prediction
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
