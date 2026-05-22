import React, { useContext, useState } from 'react';
import { DbContext } from '../context/DbContext';

const Maintenance = ({ onOpenModal, showToast }) => {
  const { currentUser, db, resolveMaintenance } = useContext(DbContext);
  const [filter, setFilter] = useState(''); // '', 'pending', 'in-progress', 'resolved'

  if (!currentUser) return null;

  const isOp = currentUser.role === 'operator';
  const maintList = isOp 
    ? db.maintenance 
    : db.maintenance.filter(m => m.reporter === currentUser.name || m.location === currentUser.stallId);

  // Filter lists
  const filteredMaint = filter 
    ? maintList.filter(m => m.status === filter) 
    : maintList;

  const handleResolve = (id) => {
    const res = resolveMaintenance(id);
    if (res.success) {
      showToast('Maintenance ticket marked as resolved!', 'success');
    } else {
      showToast(res.error || 'Failed to resolve ticket', 'error');
    }
  };

  return (
    <div className="page active" id="page-maintenance">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Maintenance Requests</h2>
        <button className="btn btn-sm btn-green" onClick={() => onOpenModal('maintenance')}>
          + New Request
        </button>
      </div>

      <div className="chips" style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <div 
          className={`chip ${filter === '' ? 'active' : ''}`} 
          onClick={() => setFilter('')}
          style={{ cursor: 'pointer' }}
        >
          All ({maintList.length})
        </div>
        <div 
          className={`chip ${filter === 'pending' ? 'active' : ''}`} 
          onClick={() => setFilter('pending')}
          style={{ cursor: 'pointer' }}
        >
          Pending ({maintList.filter(m => m.status === 'pending').length})
        </div>
        <div 
          className={`chip ${filter === 'in-progress' ? 'active' : ''}`} 
          onClick={() => setFilter('in-progress')}
          style={{ cursor: 'pointer' }}
        >
          In Progress ({maintList.filter(m => m.status === 'in-progress').length})
        </div>
        <div 
          className={`chip ${filter === 'resolved' ? 'active' : ''}`} 
          onClick={() => setFilter('resolved')}
          style={{ cursor: 'pointer' }}
        >
          Resolved ({maintList.filter(m => m.status === 'resolved').length})
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Issue</th>
              <th>Location</th>
              <th>Reported By</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date Reported</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaint.map(m => (
              <tr key={m.id}>
                <td><strong>{m.issue}</strong></td>
                <td>{m.location}</td>
                <td>{m.reporter}</td>
                <td>
                  <span className={`status-badge ${m.priority === 'high' ? 'badge-reject' : m.priority === 'medium' ? 'badge-pend' : 'badge-avail'}`}>
                    {m.priority}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${m.status === 'resolved' ? 'badge-approv' : m.status === 'in-progress' ? 'badge-pend' : 'badge-reject'}`} style={{ textTransform: 'capitalize' }}>
                    {m.status}
                  </span>
                </td>
                <td>{m.date}</td>
                <td>
                  <div className="action-btns" style={{ display: 'flex', gap: '6px' }}>
                    {isOp && m.status !== 'resolved' && (
                      <button 
                        className="act-btn act-approve" 
                        onClick={() => handleResolve(m.id)} 
                        title="Mark Resolved"
                        style={{ border: 'none', cursor: 'pointer' }}
                      >
                        ✓
                      </button>
                    )}
                    <button 
                      className="act-btn act-view" 
                      onClick={() => showToast(`Ticket Details: "${m.desc || m.issue}"`, 'info')} 
                      title="View Details"
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      👁
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredMaint.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--gray-600)' }}>
                  No active maintenance tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Maintenance;
