import React, { useContext, useState, useEffect } from 'react';
import { DbContext } from '../context/DbContext';

const SECTIONS = [
  { label: 'SECTION A — VEGETABLES', key: 'vegetables', stalls: ['A-01', 'A-02', 'A-03', 'A-04', 'A-05', 'A-12'], icon: '🥬' },
  { label: 'SECTION B — FISH', key: 'fish', stalls: ['B-01', 'B-02', 'B-05', 'B-06'], icon: '🐟' },
  { label: 'SECTION C — MEAT', key: 'meat', stalls: ['C-01', 'C-08'], icon: '🥩' },
  { label: 'SECTION D — DRY GOODS', key: 'dry', stalls: ['D-01', 'D-10', 'D-11'], icon: '📦' },
  { label: 'SECTION E — SNACKS', key: 'snacks', stalls: ['E-01', 'E-03', 'E-07'], icon: '🍱' },
];

const StallsMap = ({ onOpenApplyModal, showToast, setCurrentPage }) => {
  const { db, currentUser } = useContext(DbContext);
  const [secFilter, setSecFilter] = useState('');
  const [statFilter, setStatFilter] = useState('');
  const [selectedStall, setSelectedStall] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = (stall) => {
    setSelectedStall(stall);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  // Filtered stalls list for cards grid
  const filteredStalls = db.stalls.filter(s => {
    const matchesSec = !secFilter || s.section === secFilter;
    const matchesStat = !statFilter || s.status === statFilter;
    return matchesSec && matchesStat;
  });

  return (
    <div className="page active" id="page-stalls">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Market Stall Directory</h2>
      </div>

      {/* VISUAL MAP VIEW */}
      <div className="market-map-container">
        <div className="map-header">
          <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--green-deep)' }}>Visual Market Blueprint</span>
          <div className="map-legend">
            <div className="legend-item"><div className="legend-dot l-avail"></div>Available</div>
            <div className="legend-item"><div className="legend-dot l-occup"></div>Occupied</div>
            <div className="legend-item"><div className="legend-dot l-resrv"></div>Reserved</div>
          </div>
        </div>
        
        <div className="map-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', borderRadius: '10px', padding: '8px 14px', marginBottom: '12px', fontWeight: 700, color: 'var(--gray-600)', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            🚪 ENTRANCE & EXIT → CENTRAL AISLE PATHWAYS →
          </div>
          
          <div className="market-grid">
            {SECTIONS.map(sec => {
              // Match stalls in this section from DB
              const sectionStalls = sec.stalls
                .map(id => db.stalls.find(s => s.id === id))
                .filter(Boolean);

              return (
                <div key={sec.key} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, color: 'var(--green-deep)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {sec.icon} {sec.label}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '12px', background: 'rgba(64,145,108,0.05)', borderRadius: '12px', border: '1px solid rgba(64,145,108,0.1)' }}>
                    {sectionStalls.map(s => (
                      <div 
                        key={s.id}
                        className={`stall-box ${s.status} ${selectedStall?.id === s.id && drawerOpen ? 'selected' : ''}`}
                        onClick={() => openDrawer(s)}
                        title={`${s.id} - ${s.status}`}
                      >
                        <div className="stall-num">{s.id}</div>
                        <div className="stall-type" style={{ textTransform: 'capitalize' }}>
                          {s.section.substr(0, 3)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="table-toolbar" style={{ borderRadius: '14px', marginBottom: '16px' }}>
        <select 
          className="filter-select"
          value={secFilter}
          onChange={(e) => setSecFilter(e.target.value)}
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
          value={statFilter}
          onChange={(e) => setStatFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="reserved">Reserved</option>
        </select>
      </div>

      {/* STALLS LIST CARDS GRID */}
      <div className="stats-grid" id="stalls-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {filteredStalls.map(s => (
          <div 
            key={s.id}
            onClick={() => openDrawer(s)}
            style={{
              background: '#fff',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: `2px solid ${selectedStall?.id === s.id && drawerOpen ? 'var(--green-deep)' : 'transparent'}`
            }}
            className="stall-card"
          >
            <div 
              style={{
                height: '80px',
                background: s.status === 'available' 
                  ? 'linear-gradient(135deg,#d8f3dc,#95d5b2)' 
                  : s.status === 'occupied' 
                  ? 'linear-gradient(135deg,#ffe8cc,#f4a261)' 
                  : 'linear-gradient(135deg,#ffe0e0,#e63946)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px'
              }}
            >
              {s.section === 'vegetables' && '🥬'}
              {s.section === 'fish' && '🐟'}
              {s.section === 'meat' && '🥩'}
              {s.section === 'dry' && '📦'}
              {s.section === 'snacks' && '🍱'}
            </div>
            
            <div style={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, color: 'var(--green-deep)', fontSize: '15px' }}>{s.id}</span>
                <span className={`status-badge ${s.status === 'available' ? 'badge-avail' : s.status === 'occupied' ? 'badge-occup' : 'badge-resrv'}`} style={{ fontSize: '10px' }}>
                  {s.status}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray-600)', textTransform: 'capitalize', marginBottom: '6px' }}>
                {s.section} · {s.size}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--green-mid)', marginBottom: '8px' }}>
                ₱{s.rent.toLocaleString()}<span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--gray-600)' }}>/month</span>
              </div>
              
              {s.status === 'available' && currentUser.role === 'renter' && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenApplyModal(s.id);
                  }}
                  className="btn btn-sm btn-green"
                  style={{ width: '100%' }}
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredStalls.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div className="es-icon">🔍</div>
            <p>No stalls match your filter</p>
          </div>
        )}
      </div>

      {/* STALL SLIDE OUT DETAILS PANEL */}
      <div 
        className={`stall-detail ${drawerOpen ? 'open' : ''}`} 
        id="stallDetail"
        style={{
          boxShadow: drawerOpen ? 'var(--shadow-lg)' : 'none'
        }}
      >
        {selectedStall && (
          <>
            <div className="detail-header">
              <button className="detail-close" onClick={closeDrawer}>✕</button>
              <h3 id="dd-stall-num">Stall {selectedStall.id}</h3>
              <p id="dd-section" style={{ textTransform: 'capitalize' }}>{selectedStall.section} Section</p>
            </div>
            
            <div className="detail-body">
              <div className="detail-info">
                <div className="info-item">
                  <div className="info-label">Status</div>
                  <div id="dd-status" style={{ marginTop: '4px' }}>
                    <span className={`status-badge ${selectedStall.status === 'available' ? 'badge-avail' : selectedStall.status === 'occupied' ? 'badge-occup' : 'badge-resrv'}`}>
                      {selectedStall.status}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Dimensions</div>
                  <div className="info-value" id="dd-size">{selectedStall.size}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Monthly Rent</div>
                  <div className="info-value" id="dd-rent">₱{selectedStall.rent.toLocaleString()}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Category</div>
                  <div className="info-value" id="dd-sect2" style={{ textTransform: 'capitalize' }}>{selectedStall.section}</div>
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <div className="info-label">Description</div>
                <div id="dd-desc" style={{ fontSize: '13px', color: 'var(--gray-600)', marginTop: '6px', lineHeight: 1.5 }}>
                  {selectedStall.desc}
                </div>
              </div>
              
              <div 
                className="detail-360" 
                onClick={() => {
                  setCurrentPage('view360');
                  closeDrawer();
                }}
              >
                <div className="view-360-btn">🔄 View Panoramic 360°</div>
              </div>
            </div>
            
            <div className="detail-actions" id="dd-actions">
              {currentUser.role === 'renter' && selectedStall.status === 'available' ? (
                <>
                  <button 
                    className="btn btn-green"
                    onClick={() => {
                      onOpenApplyModal(selectedStall.id);
                      closeDrawer();
                    }}
                  >
                    Apply Now
                  </button>
                  <button className="btn btn-ghost" onClick={closeDrawer} style={{ color: 'var(--gray-800)' }}>Cancel</button>
                </>
              ) : (
                <button className="btn btn-ghost" onClick={closeDrawer} style={{ color: 'var(--gray-800)', width: '100%' }}>Close Details</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StallsMap;
