import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import InputField from '../components/InputField';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/farmerService';
import { FaUser, FaEdit, FaCheckCircle } from 'react-icons/fa';

// farmerService wraps PUT /api/farmers/profile
import api from '../services/api';
const farmerService = { updateProfile: (data) => api.put('/farmers/profile', data) };

const languages = ['Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Hindi', 'English'];

export default function Profile({ onLogout }) {
  const { farmer, updateFarmer } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(farmer || {});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await farmerService.updateProfile(form);
      updateFarmer(res.data);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout farmer={farmer} pageTitle="My Profile" onLogout={onLogout}>
      <div className="page-content">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">View and update your farmer profile information.</p>

        {saved && <div className="alert alert-success"><FaCheckCircle /> Profile updated successfully!</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
          <div className="card" style={{ textAlign: 'center', alignSelf: 'start' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--accent)', color: '#7a4f00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, margin: '0 auto 14px' }}>
              {form.name?.charAt(0) || 'F'}
            </div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-dark)', marginBottom: 4 }}>{form.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 4 }}>{form.mobile}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: 16 }}>{form.location || form.district}</div>
            <span className="badge badge-success">Active Farmer</span>
            <hr className="divider" />
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
              Member since {farmer?.joinedDate ? new Date(farmer.joinedDate).getFullYear() : '—'}
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div className="section-title"><FaUser style={{ marginRight: 8 }} />Personal Information</div>
              {!editing ? (
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}><FaEdit /> Edit Profile</button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => { setEditing(false); setForm(farmer); }}>Cancel</button>
                  <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={loading}>
                    {loading ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <><FaCheckCircle /> Save</>}
                  </button>
                </div>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <InputField label="Full Name" name="name" value={form.name || ''} onChange={handleChange} disabled={!editing} required />
              <InputField label="Mobile Number" name="mobile" value={form.mobile || ''} onChange={handleChange} disabled={true} />
              <InputField label="Village / Town" name="village" value={form.village || ''} onChange={handleChange} disabled={!editing} />
              <InputField label="District" name="district" value={form.district || ''} onChange={handleChange} disabled={!editing} />
              <InputField label="State" name="state" value={form.state || ''} onChange={handleChange} disabled={!editing} />
              <InputField label="Preferred Language" name="preferredLanguage" type="select"
                value={form.preferredLanguage || 'English'} onChange={handleChange}
                options={languages} disabled={!editing} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
