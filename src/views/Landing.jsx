import React from 'react';

const Landing = ({ onNavigateToAuth }) => {
  return (
    <div id="landing" className="screen">
      <div className="land-bg"></div>
      <div className="land-grid"></div>
      
      <nav>
        <div className="logo">
          <div className="logo-icon">🏪</div>
          <span className="logo-text">My<span>Talipapa</span></span>
        </div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-btns">
          <button className="btn btn-ghost" onClick={() => onNavigateToAuth('login')}>Login</button>
          <button className="btn btn-primary" onClick={() => onNavigateToAuth('register')}>Register</button>
        </div>
      </nav>

      <div className="hero">
        <div>
          <div className="hero-badge">🌿 Now with AR Navigation</div>
          <h1>Welcome to <em>MyTalipapa</em></h1>
          <p>Smart Stall Navigation & Management System. Find available market stalls using AR navigation and 360° viewing — right from your phone.</p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={() => onNavigateToAuth('register')}>Get Started Free</button>
            <button className="btn btn-ghost btn-lg" onClick={() => onNavigateToAuth('login')}>Explore the Market</button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-tags">
            <div className="ftag">📍 Stall A-12 — Available</div>
            <div className="ftag">🥬 Vegetables Section</div>
            <div className="ftag">₱2,500 / month</div>
          </div>
          <div className="phone-mockup">
            <div className="phone-frame">
              <div className="phone-screen">
                <div className="phone-notch"></div>
                <div className="ar-demo">
                  <div className="ar-compass">🧭</div>
                  <div className="ar-stall-card">
                    <div className="ar-stall-dot dot-green"></div>
                    <div className="ar-stall-info">
                      <strong>Stall A-12</strong>
                      <span>Vegetables · ₱2,500/mo</span>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#40916c' }}>AVAIL</span>
                  </div>
                  
                  <div className="ar-stall-card">
                    <div className="ar-stall-dot dot-amber"></div>
                    <div className="ar-stall-info">
                      <strong>Stall B-05</strong>
                      <span>Fish · ₱2,800/mo</span>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#f4a261' }}>OCCUP</span>
                  </div>

                  <div className="ar-stall-card">
                    <div className="ar-stall-dot dot-green"></div>
                    <div className="ar-stall-info">
                      <strong>Stall C-08</strong>
                      <span>Meat · ₱2,600/mo</span>
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: '#40916c' }}>AVAIL</span>
                  </div>
                  
                  <div className="ar-pin">📍 You are here</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="features-strip">
        <div className="feat-item">
          <span className="feat-icon">🧭</span>
          <h3>Smart Navigation</h3>
          <p>Navigate through public market stalls using AR guidance</p>
        </div>
        <div className="feat-item">
          <span className="feat-icon">🏪</span>
          <h3>Stall Availability</h3>
          <p>Check available and occupied stalls in real-time</p>
        </div>
        <div className="feat-item">
          <span className="feat-icon">🔄</span>
          <h3>360° Stall View</h3>
          <p>Preview stalls before renting with immersive 360° view</p>
        </div>
        <div className="feat-item">
          <span className="feat-icon">💳</span>
          <h3>Rental Monitoring</h3>
          <p>Track payments and rental status conveniently</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
