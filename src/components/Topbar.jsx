import React, { useContext, useState, useEffect, useRef } from 'react';
import { DbContext } from '../context/DbContext';

const Topbar = ({ currentPage }) => {
  const { currentUser, db, markNotificationRead, markNotificationsRead } = useContext(DbContext);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        panelOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [panelOpen]);

  if (!currentUser) return null;

  const pageTitles = {
    dashboard: 'Dashboard',
    stalls: 'All Stalls',
    ar: 'AR Navigation',
    view360: '360° Market View',
    mystall: 'My Stall',
    applications: 'Applications',
    payments: 'Payment History',
    maintenance: 'Maintenance',
    announcements: 'Announcements',
    'manage-stalls': 'Manage Stalls',
    'manage-renters': 'Manage Renters',
    profile: 'My Profile',
    support: 'Support & Help',
  };

  const currentTitle = pageTitles[currentPage] || currentPage;
  const avatarInit = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?';

  // Count unread
  const unreadCount = db.notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="topbar">
        <h1 className="topbar-title" id="topbar-title">{currentTitle}</h1>
        
        <div className="topbar-actions">
          <button 
            ref={triggerRef}
            className="icon-btn" 
            onClick={() => setPanelOpen(!panelOpen)}
            title="Notifications"
          >
            <span>🔔</span>
            {unreadCount > 0 && <div className="notif-dot"></div>}
          </button>
          
          <div 
            className="user-avatar" 
            id="tb-avatar" 
            style={{ cursor: 'pointer' }}
            title={`${currentUser.name} (${currentUser.role})`}
          >
            {avatarInit}
          </div>
        </div>
      </header>

      {/* NOTIFICATION PANEL */}
      <div 
        ref={panelRef}
        className={`notif-panel ${panelOpen ? 'open' : ''}`} 
        id="notifPanel"
        style={{
          boxShadow: panelOpen ? 'var(--shadow-lg)' : 'none'
        }}
      >
        <div className="notif-header">
          <h3>Notifications</h3>
          {unreadCount > 0 && (
            <button 
              className="btn btn-sm btn-ghost" 
              style={{ color: 'var(--green-bright)', fontSize: '11px', padding: '4px 8px' }}
              onClick={markNotificationsRead}
            >
              Mark all read
            </button>
          )}
        </div>
        
        <div id="notif-list" style={{ flex: 1, overflowY: 'auto' }}>
          {db.notifications.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--gray-400)' }}>
              No notifications yet.
            </div>
          ) : (
            db.notifications.map(n => (
              <div 
                key={n.id} 
                className={`notif-item ${n.read ? '' : 'unread'}`} 
                onClick={() => markNotificationRead(n.id)}
              >
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div className="notif-icon" style={{ background: n.bg }}>{n.icon}</div>
                  <div className="notif-content">
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-desc">{n.desc}</div>
                    <div className="notif-time">{n.time}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Topbar;
