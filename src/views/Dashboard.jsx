import React, { useContext } from 'react';
import { DbContext } from '../context/DbContext';

const Dashboard = ({ setCurrentPage, onOpenModal }) => {
  const { currentUser, db } = useContext(DbContext);

  if (!currentUser) return null;

  const isOp = currentUser.role === 'operator';

  // OPERATOR ANALYTICS
  const availCount = db.stalls.filter(s => s.status === 'available').length;
  const occupCount = db.stalls.filter(s => s.status === 'occupied').length;
  const totalCount = db.stalls.length;
  const pendingApps = db.applications.filter(a => a.status === 'pending');
  const pendingCount = pendingApps.length;
  const totalRevenue = db.stalls.filter(s => s.status === 'occupied').reduce((sum, s) => sum + s.rent, 0);

  // RENTER ANALYTICS
  const myStall = db.stalls.find(s => s.id === currentUser.stallId);
  const myPays = db.payments.filter(p => p.renter === currentUser.name);
  const totalPaid = myPays.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="page active" id="page-dashboard">
      {isOp ? (
        // ==================== OPERATOR VIEW ====================
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: '#e8f5e9' }}>🏪</div>
                <span className="stat-trend trend-up">+2</span>
              </div>
              <div className="stat-value">{totalCount}</div>
              <div className="stat-label">Total Stalls</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: '#d8f3dc' }}>✅</div>
                <span className="stat-trend trend-up">↑</span>
              </div>
              <div className="stat-value">{availCount}</div>
              <div className="stat-label">Available Stalls</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: '#fff3cd' }}>📋</div>
                <span className={`stat-trend ${pendingCount > 0 ? 'trend-down' : 'trend-up'}`}>{pendingCount}</span>
              </div>
              <div className="stat-value">{pendingCount}</div>
              <div className="stat-label">Pending Applications</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: '#e8f4fd' }}>💰</div>
                <span className="stat-trend trend-up">+5%</span>
              </div>
              <div className="stat-value" style={{ fontSize: '20px' }}>₱{totalRevenue.toLocaleString()}</div>
              <div className="stat-label">Monthly Revenue</div>
            </div>
          </div>

          <div className="dash-grid">
            <div className="card">
              <div className="card-header">
                <div className="card-title">Pending Applications</div>
                <button className="card-action btn-sm btn-ghost" onClick={() => setCurrentPage('applications')} style={{ border: 'none', background: 'transparent' }}>
                  View All →
                </button>
              </div>
              {pendingApps.slice(0, 3).map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--gray-200)' }}>
                  <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '14px', background: 'var(--green-light)' }}>
                    {a.applicant.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{a.applicant}</div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-600)' }}>Stall {a.stallId} · {a.biz}</div>
                  </div>
                  <span className="status-badge badge-pend">Pending</span>
                </div>
              ))}
              {pendingCount === 0 && (
                <p style={{ fontSize: '13px', color: 'var(--gray-400)', padding: '10px 0', textAlign: 'center' }}>
                  No pending applications
                </p>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Maintenance Alerts</div>
                <button className="card-action btn-sm btn-ghost" onClick={() => setCurrentPage('maintenance')} style={{ border: 'none', background: 'transparent' }}>
                  View All →
                </button>
              </div>
              {db.maintenance.filter(m => m.status !== 'resolved').slice(0, 3).map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--gray-200)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: m.priority === 'high' ? '#fce4ec' : m.priority === 'medium' ? '#fff3cd' : '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    🔧
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{m.issue}</div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-600)' }}>{m.location}</div>
                  </div>
                  <span className={`status-badge ${m.priority === 'high' ? 'badge-reject' : m.priority === 'medium' ? 'badge-pend' : 'badge-avail'}`}>
                    {m.priority}
                  </span>
                </div>
              ))}
              {db.maintenance.filter(m => m.status !== 'resolved').length === 0 && (
                <p style={{ fontSize: '13px', color: 'var(--gray-400)', padding: '10px 0', textAlign: 'center' }}>
                  No active maintenance tickets
                </p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Recent Announcements</div>
              <button className="card-action btn-sm btn-ghost" onClick={() => setCurrentPage('announcements')} style={{ border: 'none', background: 'transparent' }}>
                View All →
              </button>
            </div>
            {db.announcements.slice(0, 2).map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--gray-200)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.category === 'emergency' ? '#e63946' : a.category === 'reminder' ? '#f4a261' : '#40916c', flexShrink: 0 }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{a.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--gray-600)' }}>{a.date}</div>
                </div>
                <span className={`status-badge ${a.category === 'emergency' ? 'badge-reject' : a.category === 'reminder' ? 'badge-pend' : 'badge-avail'}`}>
                  {a.category}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        // ==================== RENTER VIEW ====================
        <>
          <div style={{ background: 'linear-gradient(135deg,var(--green-deep),var(--green-mid))', borderRadius: '20px', padding: '24px', color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '13px', opacity: .7, marginBottom: '4px' }}>Welcome back 👋</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 700 }}>{currentUser.name}</div>
              <div style={{ fontSize: '13px', opacity: .7, marginTop: '4px' }}>
                {myStall ? `Stall ${myStall.id} · ${myStall.section.toUpperCase()}` : 'No stall assigned yet'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn btn-primary" onClick={() => setCurrentPage('ar')}>🧭 Navigate</button>
              <button className="btn btn-ghost" onClick={() => setCurrentPage('stalls')}>Browse Stalls</button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: '#e8f5e9' }}>🏪</div>
              </div>
              <div className="stat-value">{myStall ? 1 : 0}</div>
              <div className="stat-label">My Stall{myStall ? ` (${myStall.id})` : ''}</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: '#d8f3dc' }}>✅</div>
              </div>
              <div className="stat-value">{myStall ? 'Active' : 'None'}</div>
              <div className="stat-label">Rental Status</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: '#fff3cd' }}>📅</div>
              </div>
              <div className="stat-value" style={{ fontSize: '18px' }}>Jun 5</div>
              <div className="stat-label">Next Payment Due</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon" style={{ background: '#e8f4fd' }}>💳</div>
              </div>
              <div className="stat-value" style={{ fontSize: '18px' }}>₱{totalPaid.toLocaleString()}</div>
              <div className="stat-label">Total Paid</div>
            </div>
          </div>

          <div className="dash-grid">
            <div className="card">
              <div className="card-header">
                <div className="card-title">My Stall Information</div>
                <button className="card-action btn-sm btn-ghost" onClick={() => setCurrentPage('mystall')} style={{ border: 'none', background: 'transparent' }}>
                  Details →
                </button>
              </div>
              {myStall ? (
                <>
                  <div className="detail-info" style={{ marginTop: 0 }}>
                    <div className="info-item">
                      <div className="info-label">Stall No.</div>
                      <div className="info-value">{myStall.id}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Section</div>
                      <div className="info-value" style={{ textTransform: 'capitalize' }}>{myStall.section}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Monthly Rent</div>
                      <div className="info-value">₱{myStall.rent.toLocaleString()}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">Size</div>
                      <div className="info-value">{myStall.size}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button className="btn btn-sm btn-green" onClick={() => setCurrentPage('view360')}>🔄 View 360°</button>
                    <button className="btn btn-sm btn-outline" onClick={() => setCurrentPage('ar')}>🧭 Navigate</button>
                  </div>
                </>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--gray-600)', padding: '10px 0' }}>
                  No stall assigned. <a onClick={() => setCurrentPage('stalls')} style={{ color: 'var(--green-bright)', cursor: 'pointer', fontWeight: 600 }}>Browse available stalls →</a>
                </p>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Recent Announcements</div>
                <button className="card-action btn-sm btn-ghost" onClick={() => setCurrentPage('announcements')} style={{ border: 'none', background: 'transparent' }}>
                  View All →
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {db.announcements.slice(0, 3).map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--gray-200)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.category === 'emergency' ? '#e63946' : a.category === 'reminder' ? '#f4a261' : '#40916c', marginTop: '5px', flexShrink: 0 }}></div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-600)' }}>{a.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Quick Navigation</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
              {[
                { icon: '🗺️', label: 'Market Map', page: 'stalls' },
                { icon: '🧭', label: 'AR Navigate', page: 'ar' },
                { icon: '🔄', label: '360° View', page: 'view360' },
                { icon: '💳', label: 'Payments', page: 'payments' },
                { icon: '📢', label: 'News', page: 'announcements' },
                { icon: '🔧', label: 'Maintenance', page: 'maintenance' },
                { icon: '📋', label: 'Applications', page: 'applications' },
                { icon: '👤', label: 'Profile', page: 'profile' }
              ].map(item => (
                <div 
                  key={item.label}
                  onClick={() => setCurrentPage(item.page)} 
                  style={{
                    background: 'var(--gray-100)',
                    borderRadius: '12px',
                    padding: '14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  className="quick-nav-chip"
                >
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{item.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green-deep)' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
