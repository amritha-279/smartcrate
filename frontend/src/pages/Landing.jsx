import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaLeaf, FaSeedling, FaChartLine, FaStore, FaLightbulb,
  FaCheckCircle, FaMobileAlt, FaCloudSun, FaRupeeSign, FaArrowRight
} from 'react-icons/fa';
import './Landing.css';

const steps = [
  { icon: <FaSeedling />, title: 'Add Harvest', desc: 'Enter your crop details, quantity, and harvest date.' },
  { icon: <FaChartLine />, title: 'Check Crop Condition', desc: 'Input temperature, humidity, and gas levels for analysis.' },
  { icon: <FaStore />, title: 'Analyze Market', desc: 'View nearby market prices, distances, and travel times.' },
  { icon: <FaLightbulb />, title: 'Get Recommendation', desc: 'Receive a clear action: Sell Today, Wait, or Transport.' },
];

const features = [
  { icon: <FaChartLine />, title: 'Shelf-Life Prediction', desc: 'AI-powered prediction of remaining shelf life based on crop conditions.' },
  { icon: <FaStore />, title: 'Market Price Comparison', desc: 'Compare prices across nearby markets to maximize your earnings.' },
  { icon: <FaLightbulb />, title: 'Smart Recommendations', desc: 'Get clear, actionable selling decisions tailored to your crop.' },
  { icon: <FaCloudSun />, title: 'Environmental Monitoring', desc: 'Track temperature, humidity, and gas levels affecting your produce.' },
  { icon: <FaRupeeSign />, title: 'Profit Optimization', desc: 'Calculate net value after transport costs for each market.' },
  { icon: <FaMobileAlt />, title: 'Mobile Friendly', desc: 'Access SmartCrate from any device, anywhere in the field.' },
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <div className="landing-nav-icon"><FaLeaf /></div>
          <span>SmartCrate</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <FaLeaf /> Intelligent AgriTech Platform
          </div>
          <h1 className="landing-hero-title">
            Know Your Crop.<br />Know Your Market.<br />
            <span>Make the Right Decision.</span>
          </h1>
          <p className="landing-hero-desc">
            SmartCrate helps smallholder farmers predict crop shelf life, assess spoilage risk,
            and decide the best time and place to sell their harvest — maximizing income and
            reducing post-harvest losses.
          </p>
          <div className="landing-hero-btns">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
              Get Started Free <FaArrowRight />
            </button>
          </div>
          <div className="landing-hero-stats">
            <div className="hero-stat"><span>248+</span><p>Farmers</p></div>
            <div className="hero-stat"><span>512+</span><p>Harvests Tracked</p></div>
            <div className="hero-stat"><span>18+</span><p>Markets</p></div>
          </div>
        </div>
        <div className="landing-hero-visual">
          <div className="hero-card-demo">
            <div className="hero-card-header">
              <FaSeedling /> Tomato Batch
            </div>
            <div className="hero-card-row"><span>Quantity</span><strong>120 kg</strong></div>
            <div className="hero-card-row"><span>Shelf Life</span><strong>3 Days</strong></div>
            <div className="hero-card-row"><span>Spoilage Risk</span>
              <span className="badge badge-medium">Medium</span>
            </div>
            <div className="hero-card-rec">
              <FaLightbulb /> Sell Today
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="landing-section" id="how">
        <div className="landing-section-inner">
          <div className="landing-section-label">Simple Process</div>
          <h2 className="landing-section-title">How SmartCrate Works</h2>
          <p className="landing-section-desc">Four simple steps to make the best selling decision for your harvest.</p>
          <div className="landing-steps">
            {steps.map((s, i) => (
              <div className="landing-step" key={i}>
                <div className="step-number">{i + 1}</div>
                <div className="step-icon">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-section landing-section-alt" id="features">
        <div className="landing-section-inner">
          <div className="landing-section-label">Key Features</div>
          <h2 className="landing-section-title">Everything You Need</h2>
          <p className="landing-section-desc">SmartCrate gives farmers the tools to make informed decisions about their produce.</p>
          <div className="landing-features">
            {features.map((f, i) => (
              <div className="landing-feature-card" key={i}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="landing-cta-inner">
          <h2>Ready to Maximize Your Harvest Income?</h2>
          <p>Join hundreds of farmers already using SmartCrate to make smarter selling decisions.</p>
          <button className="btn btn-accent btn-lg" onClick={() => navigate('/login')}>
            Start Using SmartCrate <FaArrowRight />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-logo">
            <div className="landing-nav-icon"><FaLeaf /></div>
            <div>
              <div style={{ fontWeight: 800, color: 'white' }}>SmartCrate</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Intelligent Crop Management</div>
            </div>
          </div>
          <div className="landing-footer-links">
            <a href="#features">Features</a>
            <a href="#how">How It Works</a>
          </div>
          <div className="landing-footer-copy">
            © 2025 SmartCrate. Built for smallholder farmers.
          </div>
        </div>
      </footer>
    </div>
  );
}
