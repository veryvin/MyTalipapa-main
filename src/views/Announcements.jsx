import React, { useContext, useState } from 'react';
import { DbContext } from '../context/DbContext';

const Announcements = ({ onOpenModal, showToast }) => {
  const { currentUser, db, deleteAnnouncement } = useContext(DbContext);
  const [filter, setFilter] = useState('all'); // 'all', 'general', 'reminder', 'emergency'

  if (!currentUser) return null;

  const isOp = currentUser.role === 'operator';
  const anns = db.announcements;

  // Filter list
  const filteredAnns = filter === 'all' 
    ? anns 
    : anns.filter(a => a.category === filter);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    const res = deleteAnnouncement(id);
    if (res.success) {
      showToast('Announcement deleted successfully!', 'success');
    } else {
      showToast('Failed to delete announcement', 'error');
    }
  };

  const getCatIcon = (cat) => {
    const icons = { general: '📢', reminder: '⏰', emergency: '🚨' };
    return icons[cat] || '📢';
  };

  const getCatBg = (cat) => {
    const bgs = { general: '#e8f5e9', reminder: '#fff3cd', emergency: '#fce4ec' };
    return bgs[cat] || '#e8f5e9';
  };

  return (
    <div className="page active" id="page-announcements">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Bulletin Announcements</h2>
        {isOp && (
          <button className="btn btn-sm btn-green" onClick={() => onOpenModal('announcement')}>
            + New Announcement
          </button>
        )}
      </div>

      <div className="chips" style={{ marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <div 
          className={`chip ${filter === 'all' ? 'active' : ''}`} 
          onClick={() => setFilter('all')}
          style={{ cursor: 'pointer' }}
        >
          All
        </div>
        <div 
          className={`chip ${filter === 'general' ? 'active' : ''}`} 
          onClick={() => setFilter('general')}
          style={{ cursor: 'pointer' }}
        >
          General
        </div>
        <div 
          className={`chip ${filter === 'reminder' ? 'active' : ''}`} 
          onClick={() => setFilter('reminder')}
          style={{ cursor: 'pointer' }}
        >
          Reminders
        </div>
        <div 
          className={`chip ${filter === 'emergency' ? 'active' : ''}`} 
          onClick={() => setFilter('emergency')}
          style={{ cursor: 'pointer' }}
        >
          Emergencies
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredAnns.map(a => (
          <div 
            key={a.id} 
            className={`ann-card ${a.category}`}
            style={{
              background: '#fff',
              borderRadius: '14px',
              padding: '18px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start',
              borderLeft: `4px solid ${
                a.category === 'emergency' 
                  ? '#e63946' 
                  : a.category === 'reminder' 
                  ? 'var(--amber)' 
                  : 'var(--green-bright)'
              }`
            }}
          >
            <div 
              className="ann-icon-wrap" 
              style={{ 
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0,
                background: getCatBg(a.category) 
              }}
            >
              {getCatIcon(a.category)}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span className="ann-title" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--green-deep)' }}>
                  {a.title}
                </span>
                <span className={`ann-priority ${a.priority === 'high' ? 'p-high' : 'p-normal'}`}>
                  {a.priority} Priority
                </span>
              </div>
              
              <div className="ann-desc" style={{ fontSize: '13px', color: 'var(--gray-600)', marginTop: '6px', lineHeight: 1.5 }}>
                {a.msg}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', fontSize: '11px', color: 'var(--gray-400)' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span>Posted: {a.date}</span>
                  <span style={{ textTransform: 'capitalize' }}>Category: {a.category}</span>
                </div>
                {isOp && (
                  <button 
                    className="act-btn act-del" 
                    onClick={() => handleDelete(a.id)} 
                    title="Delete Announcement"
                    style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredAnns.length === 0 && (
          <div className="empty-state" style={{ marginTop: '20px' }}>
            <div className="es-icon" style={{ fontSize: '48px', marginBottom: '10px' }}>📢</div>
            <p>No announcements in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
