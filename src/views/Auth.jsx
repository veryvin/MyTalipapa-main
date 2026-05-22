import React, { useState, useContext, useEffect } from 'react';
import { DbContext } from '../context/DbContext';

const Auth = ({ initialTab, onBackToLanding, showToast }) => {
  const { loginUser, registerUser, db } = useContext(DbContext);
  
  const [activeTab, setActiveTab] = useState(initialTab || 'login');
  const [selectedRole, setSelectedRole] = useState('renter');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regAgree, setRegAgree] = useState(false);

  // Sync tab with initialTab changes
  useEffect(() => {
    setActiveTab(initialTab || 'login');
  }, [initialTab]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPass) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    const res = loginUser(loginEmail.trim(), loginPass);
    if (res.success) {
      showToast(`Welcome back, ${res.user.name.split(' ')[0]}! 👋`, 'success');
    } else {
      showToast(res.error || 'Invalid credentials', 'error');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regUser.trim() || !regEmail.trim() || !regPass) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    if (regPass !== regConfirm) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (!regAgree) {
      showToast('Please agree to the Terms and Conditions', 'error');
      return;
    }
    const res = registerUser(
      regName.trim(), 
      regUser.trim(), 
      regEmail.trim(), 
      regPhone.trim(), 
      selectedRole, 
      regPass
    );
    if (res.success) {
      showToast('Account created successfully! Welcome aboard! 🎉', 'success');
    } else {
      showToast(res.error || 'Error creating account', 'error');
    }
  };

  const handleQuickLogin = (role) => {
    const res = loginUser(role, '1234');
    if (res.success) {
      showToast(`Logged in as Demo ${role.charAt(0).toUpperCase() + role.slice(1)}! 👋`, 'success');
    } else {
      showToast(res.error, 'error');
    }
  };

  // Generate minimap states (20 items representing alphabetical booths)
  const miniMapStates = [
    'avail', 'avail', 'occup', 'resrv', 'avail', 'occup', 'avail', 'avail', 'occup', 'avail',
    'resrv', 'avail', 'occup', 'avail', 'avail', 'occup', 'avail', 'avail', 'occup', 'avail'
  ];

  return (
    <div id="auth-screen" className="screen">
      {/* LEFT ASPECT */}
      <div className="auth-left">
        <div className="auth-left-bg"></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="logo" style={{ marginBottom: '40px', cursor: 'pointer' }} onClick={onBackToLanding}>
            <div className="logo-icon">🏪</div>
            <span className="logo-text">My<span>Talipapa</span></span>
          </div>
          <h2>Your Smart <span>Market</span><br />Companion</h2>
          <p>Access real-time stall availability, AR-powered navigation, and complete rental management — all in one platform.</p>
        </div>
        
        <div className="auth-market-map" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Live Market Map
          </div>
          <div className="mini-map" id="miniMap">
            {miniMapStates.map((state, i) => {
              const row = String.fromCharCode(65 + Math.floor(i / 4));
              const num = ((i % 4) + 1).toString().padStart(2, '0');
              return (
                <div key={i} className={`mstall ${state}`} style={{ fontSize: '8px', color: 'rgba(255,255,255,0.7)' }}>
                  {row}-{num}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <div className="legend-item" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <div className="legend-dot l-avail" style={{ width: '8px', height: '8px', borderRadius: '2px' }}></div>Available
            </div>
            <div className="legend-item" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <div className="legend-dot l-occup" style={{ width: '8px', height: '8px', borderRadius: '2px' }}></div>Occupied
            </div>
            <div className="legend-item" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <div className="legend-dot l-resrv" style={{ width: '8px', height: '8px', borderRadius: '2px' }}></div>Reserved
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', position: 'relative', zIndex: 2 }}>
          © 2026 MyTalipapa · Pandacan, Manila
        </div>
      </div>

      {/* RIGHT ASPECT */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-tabs">
            <div 
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} 
              onClick={() => setActiveTab('login')}
            >
              Sign In
            </div>
            <div 
              className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`} 
              onClick={() => setActiveTab('register')}
            >
              Create Account
            </div>
          </div>

          {/* SIGN IN VIEW */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} id="form-login">
              <div className="form-title">Welcome Back!</div>
              <div className="form-sub">Sign in to continue to your account.</div>
              
              <div className="form-group">
                <label className="form-label">Username or Email</label>
                <input 
                  className="form-input" 
                  type="text" 
                  placeholder="Enter your username or email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  className="form-input" 
                  type="password" 
                  placeholder="Enter your password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  required
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: 'var(--gray-600)' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--green-bright)' }} /> Remember me
                </label>
                <a href="#forgot" style={{ fontSize: '13px', color: 'var(--green-bright)', fontWeight: 600 }} onClick={(e) => { e.preventDefault(); showToast('Demo forgot password!', 'warning'); }}>
                  Forgot Password?
                </a>
              </div>

              {/* DEMO LOGINS */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Quick Demo Login
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button"
                    className="btn btn-sm" 
                    style={{ background: '#e8f5e9', color: '#2e7d32', border: 'none', flex: 1 }}
                    onClick={() => handleQuickLogin('operator')}
                  >
                    🔑 Operator
                  </button>
                  <button 
                    type="button"
                    className="btn btn-sm" 
                    style={{ background: '#e3f2fd', color: '#1565c0', border: 'none', flex: 1 }}
                    onClick={() => handleQuickLogin('renter')}
                  >
                    👤 Renter
                  </button>
                </div>
              </div>

              <button type="submit" className="form-btn">Sign In →</button>
              <div className="form-footer">
                Don't have an account? <a onClick={() => setActiveTab('register')}>Register here</a>
              </div>
            </form>
          )}

          {/* REGISTRATION VIEW */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} id="form-register">
              <div className="form-title">Create Account</div>
              <div className="form-sub">Join MyTalipapa and manage stalls easily.</div>
              
              <div style={{ marginBottom: '18px' }}>
                <div className="form-label" style={{ marginBottom: '8px' }}>Select Role</div>
                <div className="role-selector">
                  <div 
                    className={`role-card ${selectedRole === 'renter' ? 'selected' : ''}`} 
                    onClick={() => setSelectedRole('renter')}
                  >
                    <span className="role-icon">🛒</span>
                    <div className="role-name">Stall Renter</div>
                    <div className="role-desc">Browse & apply for stalls</div>
                  </div>
                  <div 
                    className={`role-card ${selectedRole === 'operator' ? 'selected' : ''}`} 
                    onClick={() => setSelectedRole('operator')}
                  >
                    <span className="role-icon">🏢</span>
                    <div className="role-name">Market Operator</div>
                    <div className="role-desc">Manage stalls & renters</div>
                  </div>
                </div>
              </div>

              <div className="modal-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    className="form-input" 
                    type="text" 
                    placeholder="Juan Dela Cruz"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input 
                    className="form-input" 
                    type="text" 
                    placeholder="juan123"
                    value={regUser}
                    onChange={(e) => setRegUser(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  className="form-input" 
                  type="email" 
                  placeholder="juan@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  className="form-input" 
                  type="tel" 
                  placeholder="09123456789"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />
              </div>

              <div className="modal-grid">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input 
                    className="form-input" 
                    type="password" 
                    placeholder="••••••••"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input 
                    className="form-input" 
                    type="password" 
                    placeholder="••••••••"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    required
                  />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: 'var(--gray-600)', marginBottom: '16px', cursor: 'pointer', lineHeight: 1.5 }}>
                <input 
                  type="checkbox" 
                  checked={regAgree}
                  onChange={(e) => setRegAgree(e.target.checked)}
                  style={{ accentColor: 'var(--green-bright)', marginTop: '2px', flexShrink: 0 }} 
                />
                <span>
                  I agree to the <a href="#terms" style={{ color: 'var(--green-bright)', fontWeight: 600 }} onClick={(e) => e.preventDefault()}>Terms and Conditions</a> and <a href="#privacy" style={{ color: 'var(--green-bright)', fontWeight: 600 }} onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                </span>
              </label>

              <button type="submit" className="form-btn">Create Account →</button>
              <div className="form-footer">
                Already have an account? <a onClick={() => setActiveTab('login')}>Sign in instead</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
