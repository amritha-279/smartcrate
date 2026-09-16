import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLeaf, FaMobileAlt, FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import './Login.css';

// Future: Replace with POST /api/auth/send-otp and POST /api/auth/verify-otp
const MOCK_OTP = '1234';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = () => {
    setError('');
    if (!/^\d{10}$/.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setSuccess(`OTP sent to +91 ${mobile}. (Demo OTP: ${MOCK_OTP})`);
    }, 1200);
  };

  const handleVerifyOtp = () => {
    setError('');
    if (!otp) { setError('Please enter the OTP.'); return; }
    if (otp !== MOCK_OTP) { setError('Invalid OTP. Please try again. (Demo OTP: 1234)'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('sc_auth', JSON.stringify({ mobile, loggedIn: true }));
      onLogin && onLogin();
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand">
            <div className="login-brand-icon"><FaLeaf /></div>
            <span>SmartCrate</span>
          </div>
          <h2 className="login-left-title">
            Helping Farmers Make Smarter Decisions
          </h2>
          <p className="login-left-desc">
            Predict shelf life, compare market prices, and get the best selling recommendation for your harvest.
          </p>
          <div className="login-features">
            <div className="login-feature"><FaShieldAlt /> Secure & Private</div>
            <div className="login-feature"><FaMobileAlt /> Mobile OTP Login</div>
            <div className="login-feature"><FaLeaf /> Farmer Friendly</div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <button className="login-back" onClick={() => navigate('/')}>
            <FaArrowLeft /> Back to Home
          </button>

          <div className="login-card-header">
            <div className="login-card-icon"><FaMobileAlt /></div>
            <h2>Farmer Login</h2>
            <p>Enter your mobile number to receive an OTP</p>
          </div>

          {success && (
            <div className="alert alert-success">{success}</div>
          )}
          {error && (
            <div className="alert alert-error">{error}</div>
          )}

          <div className="form-group">
            <label className="form-label">Mobile Number *</label>
            <div className="login-mobile-input">
              <span className="login-prefix">+91</span>
              <input
                type="tel"
                className="form-input"
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                disabled={otpSent}
                maxLength={10}
              />
            </div>
          </div>

          {!otpSent ? (
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Send OTP'}
            </button>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Enter OTP *</label>
                <input
                  type="text"
                  className="form-input login-otp-input"
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                />
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px', marginBottom: 10 }}
                onClick={handleVerifyOtp}
                disabled={loading}
              >
                {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'Verify OTP & Login'}
              </button>
              <button
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { setOtpSent(false); setOtp(''); setSuccess(''); setError(''); }}
              >
                Change Mobile Number
              </button>
            </>
          )}

          <div className="login-demo-note">
            <span className="demo-badge">Demo Mode</span>
            Use any 10-digit number and OTP: <strong>1234</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
