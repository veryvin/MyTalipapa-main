import React, { useContext, useState } from 'react';
import { DbContext } from '../context/DbContext';

const ManageStalls = ({ onOpenModal, showToast, setCurrentPage }) => {
  const { db, currentUser, deleteStall } = useContext(DbContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [selectedStall, setSelectedStall] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!currentUser || currentUser.role !== 'operator') return null;

  const handleOpenDrawer = (stall) => {
    setSelectedStall(stall);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm(`Are you sure you want to delete Stall ${id}?`)) return;
    const res = deleteStall(id);
    if (res.success) {
      showToast(`Stall ${id} deleted successfully!`, 'success');
      if (selectedStall?.id === id) {
        setDrawerOpen(false);
      }
    } else {
      showToast(res.error || 'Failed to delete stall', 'error');
    }
  };

  // Filter stalls
  const filteredStalls = db.stalls.filter(s => {
    const matchesSearch = s.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection = !sectionFilter || s.section === sectionFilter;
    const matchesStatus = !statusFilter || s.status === statusFilter;
    return matchesSearch && matchesSection && matchesStatus;
  });

  return (
    <div className="page active" id="page-manage-stalls">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Manage Stalls</h2>
        <button className="btn btn-green btn-sm" onClick={() => onOpenModal('add-stall')}>
          + Add New Stall
        </button>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--gray-200)', flexWrap: 'wrap' }}>
          <input 
            className="search-input" 
            placeholder="Search stall number..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, maxWidth: '240px' }}
          />
          <select 
            className="filter-select"
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
          >
            <option value="">All Sections</option>
            <option value="vegetables">Vegetables</option>
            <option value="fish">Fish</option>
            <option value="meat">Meat</option>
            <option value="dry">Dry Goods</option>
            <option value="snacks">Snacks</option>
          </select>
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Stall No.</th>
              <th>Section</th>
              <th>Dimensions</th>
              <th>Status</th>
              <th>Assigned Renter</th>
              <th>Monthly Rent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStalls.map(s => (
              <tr key={s.id}>
                <td><strong>{s.id}</strong></td>
                <td style={{ textTransform: 'capitalize' }}>{s.section}</td>
                <td>{s.size}</td>
                <td>
                  <span className={`status-badge ${s.status === 'available' ? 'badge-avail' : s.status === 'occupied' ? 'badge-occup' : 'badge-resrv'}`}>
                    {s.status}
                  </span>
                </td>
                <td>{s.renter || '—'}</td>
                <td>₱{s.rent.toLocaleString()}</td>
                <td>
                  <div className="action-btns" style={{ display: 'flex', gap: '6px' }}>
                    <button 
                      className="act-btn act-view" 
                      onClick={() => handleOpenDrawer(s)} 
                      title="View Details"
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      👁
                    </button>
                    <button 
                      className="act-btn act-edit" 
                      onClick={() => showToast(`Edit feature for Stall ${s.id} is coming soon!`, 'info')} 
                      title="Edit Stall"
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      ✏️
                    </button>
                    <button 
                      className="act-btn act-del" 
                      onClick={() => handleDelete(s.id)} 
                      title="Delete Stall"
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredStalls.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--gray-600)' }}>
                  No stalls match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DRAWER FOR STALL DETAILS */}
      <div 
        className={`stall-detail ${drawerOpen ? 'open' : ''}`}
        style={{
          boxShadow: drawerOpen ? 'var(--shadow-lg)' : 'none',
          position: 'fixed',
          right: drawerOpen ? '0' : '-400px',
          top: 0,
          height: '100vh',
          width: '380px',
          background: '#fff',
          zIndex: 1000,
          transition: 'right 0.3s ease',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {selectedStall && (
          <>
            <div className="detail-header" style={{ padding: '20px', background: 'var(--green-deep)', color: '#fff', position: 'relative' }}>
              <button 
                className="detail-close" 
                onClick={handleCloseDrawer}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: '#fff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
              <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '22px' }}>Stall {selectedStall.id}</h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.7, textTransform: 'capitalize' }}>{selectedStall.section} Section</p>
            </div>
            
            <div className="detail-body" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              <div className="detail-info" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div className="info-item" style={{ background: 'var(--gray-100)', borderRadius: '10px', padding: '12px' }}>
                  <div className="info-label" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gray-600)', textTransform: 'uppercase' }}>Status</div>
                  <div style={{ marginTop: '4px' }}>
                    <span className={`status-badge ${selectedStall.status === 'available' ? 'badge-avail' : selectedStall.status === 'occupied' ? 'badge-occup' : 'badge-resrv'}`}>
                      {selectedStall.status}
                    </span>
                  </div>
                </div>
                <div className="info-item" style={{ background: 'var(--gray-100)', borderRadius: '10px', padding: '12px' }}>
                  <div className="info-label" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gray-600)', textTransform: 'uppercase' }}>Dimensions</div>
                  <div className="info-value" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--green-deep)', marginTop: '4px' }}>{selectedStall.size}</div>
                </div>
                <div className="info-item" style={{ background: 'var(--gray-100)', borderRadius: '10px', padding: '12px' }}>
                  <div className="info-label" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gray-600)', textTransform: 'uppercase' }}>Monthly Rent</div>
                  <div className="info-value" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--green-deep)', marginTop: '4px' }}>₱{selectedStall.rent.toLocaleString()}</div>
                </div>
                <div className="info-item" style={{ background: 'var(--gray-100)', borderRadius: '10px', padding: '12px' }}>
                  <div className="info-label" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gray-600)', textTransform: 'uppercase' }}>Assigned To</div>
                  <div className="info-value" style={{ fontSize: '16px', fontWeight: 700, color: 'var(--green-deep)', marginTop: '4px' }}>{selectedStall.renter || '—'}</div>
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <div className="info-label" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gray-600)', textTransform: 'uppercase' }}>Description</div>
                <div style={{ fontSize: '13px', color: 'var(--gray-600)', marginTop: '6px', lineHeight: 1.5 }}>
                  {selectedStall.desc}
                </div>
              </div>
              
              <div 
                className="detail-360"
                onClick={() => {
                  setCurrentPage('view360');
                  handleCloseDrawer();
                }}
                style={{
                  background: 'linear-gradient(135deg,var(--green-mid),var(--green-bright))',
                  borderRadius: '12px',
                  height: '160px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginBottom: '16px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div className="view-360-btn" style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--green-deep)', padding: '10px 20px', borderRadius: '100px', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                  🔄 View Panoramic 360°
                </div>
              </div>
            </div>
            
            <div className="detail-actions" style={{ display: 'flex', gap: '10px', padding: '20px', borderTop: '1px solid var(--gray-200)', flexShrink: 0 }}>
              <button 
                className="btn btn-outline" 
                onClick={() => {
                  setCurrentPage('ar');
                  handleCloseDrawer();
                }}
                style={{ flex: 1 }}
              >
                🧭 AR Locate
              </button>
              <button className="btn btn-ghost" onClick={handleCloseDrawer} style={{ color: 'var(--gray-800)', flex: 1 }}>Close Details</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageStalls;
