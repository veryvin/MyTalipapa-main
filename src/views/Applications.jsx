import React, { useContext, useState } from 'react';
import { DbContext } from '../context/DbContext';

const Applications = ({ setCurrentPage, showToast }) => {
  const { currentUser, db, reviewApplication } = useContext(DbContext);
  const [filter, setFilter] = useState(''); // '', 'pending', 'approved', 'rejected'

  if (!currentUser) return null;

  const isOp = currentUser.role === 'operator';
  const apps = isOp 
    ? db.applications 
    : db.applications.filter(a => a.userId === currentUser.id || a.applicant === currentUser.name);

  // Filter application list
  const filteredApps = filter 
    ? apps.filter(a => a.status === filter) 
    : apps;

  const handleReview = (id, newStatus) => {
    const res = reviewApplication(id, newStatus);
    if (res.success) {
      showToast(`Application successfully ${newStatus}!`, 'success');
    } else {
      showToast(res.error || 'Failed to review application', 'error');
    }
  };

  return (
    <div className="page active" id="page-applications">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Lease Applications</h2>
        {!isOp && (
          <button className="btn btn-green btn-sm" onClick={() => setCurrentPage('stalls')}>
            + New Application
          </button>
        )}
      </div>

      <div className="chips" style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <div 
          className={`chip ${filter === '' ? 'active' : ''}`} 
          onClick={() => setFilter('')}
          style={{ cursor: 'pointer' }}
        >
          All ({apps.length})
        </div>
        <div 
          className={`chip ${filter === 'pending' ? 'active' : ''}`} 
          onClick={() => setFilter('pending')}
          style={{ cursor: 'pointer' }}
        >
          Pending ({apps.filter(a => a.status === 'pending').length})
        </div>
        <div 
          className={`chip ${filter === 'approved' ? 'active' : ''}`} 
          onClick={() => setFilter('approved')}
          style={{ cursor: 'pointer' }}
        >
          Approved ({apps.filter(a => a.status === 'approved').length})
        </div>
        <div 
          className={`chip ${filter === 'rejected' ? 'active' : ''}`} 
          onClick={() => setFilter('rejected')}
          style={{ cursor: 'pointer' }}
        >
          Rejected ({apps.filter(a => a.status === 'rejected').length})
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Stall</th>
              <th>Business Type</th>
              <th>Date Applied</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.map(a => (
              <tr key={a.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="user-avatar" style={{ width: '28px', height: '28px', fontSize: '11px', background: 'var(--green-light)' }}>
                      {a.applicant.charAt(0)}
                    </div>
                    <span>{a.applicant}</span>
                  </div>
                </td>
                <td><strong>Stall {a.stallId}</strong></td>
                <td>{a.biz}</td>
                <td>{a.date}</td>
                <td>
                  <span className={`status-badge ${a.status === 'approved' ? 'badge-approv' : a.status === 'rejected' ? 'badge-reject' : 'badge-pend'}`} style={{ fontSize: '11px' }}>
                    {a.status}
                  </span>
                </td>
                <td>
                  <div className="action-btns" style={{ display: 'flex', gap: '6px' }}>
                    {isOp && a.status === 'pending' && (
                      <>
                        <button 
                          className="act-btn act-approve" 
                          onClick={() => handleReview(a.id, 'approved')} 
                          title="Approve Application"
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          ✓
                        </button>
                        <button 
                          className="act-btn act-reject" 
                          onClick={() => handleReview(a.id, 'rejected')} 
                          title="Reject Application"
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </>
                    )}
                    <button 
                      className="act-btn act-view" 
                      onClick={() => showToast(`Message from applicant: "${a.msg || 'No message provided.'}"`, 'info')} 
                      title="View Details"
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      👁
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredApps.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--gray-600)' }}>
                  No applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;
