import React, { useContext } from 'react';
import { DbContext } from '../context/DbContext';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const { currentUser, logoutUser, db } = useContext(DbContext);

  if (!currentUser) return null;

  const isOp = currentUser.role === 'operator';
  const pendingApps = db.applications.filter(a => a.status === 'pending').length;

  const items = isOp
    ? [
      {
        section: 'Main',
        items: [
          { icon: '📊', label: 'Dashboard', page: 'dashboard' },
          { icon: '🏪', label: 'Manage Stalls', page: 'manage-stalls' },
          { icon: '📋', label: 'Applications', page: 'applications', badge: pendingApps },
          { icon: '🔧', label: 'Maintenance', page: 'maintenance' },
          { icon: '📢', label: 'Announcements', page: 'announcements' },
        ],
      },
      {
        section: 'Navigation',
        items: [
          { icon: '🧭', label: 'AR Navigation', page: 'ar' },
          { icon: '🔄', label: '360° View', page: 'view360' },
          { icon: '🗺️', label: 'All Stalls', page: 'stalls' },
        ],
      },
      {
        section: 'Account',
        items: [
          { icon: '💳', label: 'Payments', page: 'payments' },
          { icon: '👤', label: 'Profile', page: 'profile' },
        ],
      },
    ]
    : [
      {
        section: 'Main',
        items: [
          { icon: '📊', label: 'Dashboard', page: 'dashboard' },
          { icon: '🏪', label: 'My Stall', page: 'mystall' },
          { icon: '🗺️', label: 'All Stalls', page: 'stalls' },
          { icon: '📋', label: 'Applications', page: 'applications' },
        ],
      },
      {
        section: 'Navigate',
        items: [
          { icon: '🧭', label: 'AR Navigation', page: 'ar' },
          { icon: '🔄', label: '360° View', page: 'view360' },
        ],
      },
      {
        section: 'More',
        items: [
          { icon: '💳', label: 'Payment History', page: 'payments' },
          { icon: '📢', label: 'Announcements', page: 'announcements' },
          { icon: '🔧', label: 'Maintenance', page: 'maintenance' },
          { icon: '👤', label: 'Profile', page: 'profile' },
          { icon: '❓', label: 'Support / Help', page: 'support' },
        ],
      },
    ];

  const avatarInit = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?';

  return (
    <aside className="sidebar" style={{ width: '240px', minWidth: '240px', flexShrink: 0 }}>
      <div className="sidebar-logo">
        <div className="logo">
          <div className="logo-icon">🏪</div>
          <span className="logo-text">My<span>Talipapa</span></span>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar" id="sb-avatar">{avatarInit}</div>
        <div className="user-info">
          <div className="user-name" id="sb-name">{currentUser.name}</div>
          <div className="user-role" id="sb-role">
            {currentUser.role === 'operator' ? 'Market Operator' : 'Stall Renter'}
          </div>
        </div>
      </div>

      <nav className="sidebar-nav" id="sidebar-nav">
        {items.map(sec => (
          <div className="nav-section" key={sec.section}>
            <div className="nav-section-label">{sec.section}</div>
            {sec.items.map(i => (
              <div
                key={i.page}
                className={`nav-item ${i.page === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(i.page)}
                data-page={i.page}
              >
                <span className="nav-icon">{i.icon}</span>
                <span>{i.label}</span>
                {i.badge > 0 && <span className="nav-badge">{i.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: 'center', display: 'flex', gap: '8px' }}
          onClick={logoutUser}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;