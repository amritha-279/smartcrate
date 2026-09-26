import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaLeaf, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/authService';
import './Login.css';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // mobile + otp passed from Login when farmer is not registered
  const { mobile: prefillMobile, otp: prefillOtp } = location.state || {};

  const [form, setForm] = useState({
    mobile: prefillMobile || '',
    otp: prefillOtp || '',
    name: '',
    location: '',
    village: '',
    district: '',
    state: '',
    preferredLanguage: 'Tamil',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setError('');
    if (!form.name.trim()) { setError('Name is required.'); return; }
    if (!form.mobile || !/^\d{10}$/.test(form.mobile)) { setError('Valid mobile number required.'); return; }
    setLoading(true);
    try {
      const res = await register(form);
      login(res.data.token, res.data.farmer);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand">
            <div className="login-brand-icon"><FaLeaf /></div>
            <span>SmartCrate</span>
          </div>
          <h2 className="login-left-title">Join SmartCrate</h2>
          <p className="login-left-desc">
            Create your farmer profile to start tracking harvests, predicting shelf life, and maximizing your income.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <div className="login-card-icon"><FaUserPlus /></div>
            <h2>Create Account</h2>
            <p>Complete your profile to get started</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input name="name" className="form-input" placeholder="Your full name" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number *</label>
            <div className="login-mobile-input">
              <span className="login-prefix">+91</span>
              <input
                name="mobile" type="tel" className="form-input"
                value={form.mobile}
                onChange={(e) => setForm(prev => ({ ...prev, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                disabled={!!prefillMobile}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Village / Town</label>
            <input name="village" className="form-input" placeholder="e.g. Bhavani" value={form.village} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">District</label>
            <input name="district" className="form-input" placeholder="e.g. Erode" value={form.district} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">State</label>
            <input name="state" className="form-input" placeholder="e.g. Tamil Nadu" value={form.state} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Preferred Language</label>
            <select name="preferredLanguage" className="form-input" value={form.preferredLanguage} onChange={handleChange}>
              {['Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Hindi', 'English'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><FaUserPlus /> Create Account</>}
          </button>
        </div>
      </div>
    </div>
  );
}
