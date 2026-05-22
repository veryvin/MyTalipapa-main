import React, { useContext } from 'react';
import { DbContext } from '../context/DbContext';

const MyStall = ({ setCurrentPage, onOpenModal, showToast }) => {
  const { currentUser, db } = useContext(DbContext);

  if (!currentUser) return null;

  const s = db.stalls.find(x => x.id === currentUser.stallId);

  const handleDownload = (docName) => {
    showToast(`${docName} downloaded successfully!`, 'success');
  };

  return (
    <div className="page active" id="page-mystall">
      {!s ? (
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <div className="es-icon" style={{ fontSize: '64px', marginBottom: '20px' }}>🏪</div>
          <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--green-deep)', marginBottom: '10px' }}>
            You don't have an assigned stall yet.
          </p>
          <p style={{ color: 'var(--gray-600)', marginBottom: '20px' }}>
            Apply for a rental stall to get started with your business.
          </p>
          <button className="btn btn-green" onClick={() => setCurrentPage('stalls')}>
            Browse Available Stalls
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>My Stall</h2>
            <span className="status-badge badge-approv" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2e7d32', display: 'inline-block' }}></span>
              Active Lease
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div className="card">
              <div className="card-header">
                <div className="card-title">Stall Information</div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="info-item">
                    <div className="info-label">Stall No.</div>
                    <div className="info-value">{s.id}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Section</div>
                    <div className="info-value" style={{ textTransform: 'capitalize' }}>{s.section}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Status</div>
                    <div className="info-value">
                      <span className="status-badge badge-avail" style={{ textTransform: 'capitalize' }}>
                        {s.status}
                      </span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Size</div>
                    <div className="info-value">{s.size}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Monthly Rent</div>
                    <div className="info-value">₱{s.rent.toLocaleString()}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Lease Start</div>
                    <div className="info-value">May 1, 2026</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  <button className="btn btn-sm btn-green" onClick={() => setCurrentPage('view360')}>
                    🔄 View 360°
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={() => setCurrentPage('ar')}>
                    🧭 Navigate
                  </button>
                  <button 
                    className="btn btn-sm" 
                    style={{ background: '#fff3cd', color: '#856404', border: 'none', fontWeight: 600 }} 
                    onClick={() => onOpenModal('maintenance')}
                  >
                    🔧 Maintenance
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="card-title">Payment Overview</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="info-item">
                  <div className="info-label">Monthly Rent</div>
                  <div className="info-value">₱{s.rent.toLocaleString()}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Due Date</div>
                  <div className="info-value" style={{ color: 'var(--amber-dark)' }}>June 5, 2026</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Balance Outstanding</div>
                  <div className="info-value" style={{ color: 'var(--green-bright)' }}>₱0.00</div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => showToast('Online payment portal is currently down for maintenance. Please pay at the admin office.', 'warning')}
                  >
                    Pay Now
                  </button>
                  <button className="btn btn-sm btn-outline" onClick={() => setCurrentPage('payments')}>
                    Payment History
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Documents & Permits</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div 
                style={{
                  background: 'var(--gray-100)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  border: '1px solid var(--gray-200)'
                }}
                className="doc-card"
                onClick={() => handleDownload('Lease_Agreement_Stall_' + s.id + '.pdf')}
              >
                <span style={{ fontSize: '32px' }}>📄</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green-deep)' }}>Rental Agreement</div>
                  <div style={{ fontSize: '11px', color: 'var(--gray-600)', marginTop: '2px' }}>Click to download PDF</div>
                </div>
              </div>

              <div 
                style={{
                  background: 'var(--gray-100)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  border: '1px solid var(--gray-200)'
                }}
                className="doc-card"
                onClick={() => handleDownload('Stall_Permit_' + s.id + '.pdf')}
              >
                <span style={{ fontSize: '32px' }}>📋</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green-deep)' }}>Stall Permit</div>
                  <div style={{ fontSize: '11px', color: 'var(--gray-600)', marginTop: '2px' }}>Click to download PDF</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyStall;
