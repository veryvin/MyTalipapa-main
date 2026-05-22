import React, { useContext, useState } from 'react';
import { DbContext } from '../context/DbContext';

const POSITIONS = [
  { x: 15, y: 20 }, { x: 30, y: 35 }, { x: 50, y: 15 }, { x: 65, y: 40 }, { x: 75, y: 25 },
  { x: 25, y: 55 }, { x: 45, y: 60 }, { x: 60, y: 65 }, { x: 80, y: 55 }, { x: 35, y: 75 },
  { x: 55, y: 75 }, { x: 70, y: 70 }, { x: 20, y: 40 }, { x: 40, y: 30 }
];

const ArNavigation = ({ showToast, onOpenApplyModal }) => {
  const { db } = useContext(DbContext);
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState('camera'); // 'camera' or 'map'
  const [searchQuery, setSearchQuery] = useState('');

  const handleZoom = (d) => {
    setZoom(prev => Math.max(0.7, Math.min(1.5, prev + d * 0.1)));
  };

  const availableCount = db.stalls.filter(s => s.status === 'available').length;

  // Filter markers based on search query
  const filteredMarkers = db.stalls.slice(0, 14).filter(s => {
    if (!searchQuery) return true;
    return s.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
           s.section.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="page active" id="page-ar">
      <div className="ar-container">
        {/* AR VIEWPORT SCREEN */}
        <div 
          className="ar-viewport" 
          id="ar-viewport"
          style={{
            transform: `scale(${zoom})`,
            transition: 'transform 0.2s ease',
            background: mode === 'map' 
              ? '#e8f4f0' 
              : 'linear-gradient(160deg,#1a3d2b 0%,#2d6a4f 30%,#3a7d57 60%,#4a9a6a 100%)'
          }}
        >
          {/* BACKGROUND MARKET MATRIX */}
          <div 
            className="ar-bg-market"
            style={{
              opacity: mode === 'map' ? 0.85 : 0.15
            }}
          >
            {Array(24).fill(0).map((_, i) => (
              <div key={i} className="ar-bg-stall" style={{ border: mode === 'map' ? '1px dashed var(--green-mid)' : '' }}></div>
            ))}
          </div>

          {/* ACTIVE ABSOLUTE MARKER PINS */}
          <div className="ar-overlay" id="ar-overlay">
            {filteredMarkers.map((s, i) => {
              const pos = POSITIONS[i] || { x: 50, y: 50 };
              const color = s.status === 'available' ? 'pin-green' : s.status === 'occupied' ? 'pin-amber' : 'pin-red';
              
              return (
                <div 
                  key={s.id}
                  className="ar-stall-marker" 
                  style={{
                    position: 'absolute',
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -100%)',
                    cursor: 'pointer'
                  }}
                  onClick={() => showToast(`Stall details: ${s.id} is ${s.status}. Size: ${s.size}. Monthly Rent: ₱${s.rent.toLocaleString()}`, 'info')}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className={`ar-marker-pin ${color}`}>
                      <span>{s.id.split('-')[1]}</span>
                    </div>
                    <div className="ar-marker-label">
                      {s.id} · ₱{s.rent.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HUD OVERLAYS */}
        <div className="ar-hud">
          {/* SEARCH BOX */}
          <div className="ar-search-bar">
            <span style={{ fontSize: '16px' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search stall or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* ZOOM CONTROL BUTTONS */}
          <div className="ar-controls">
            <button className="ar-ctrl-btn" onClick={() => handleZoom(1)} title="Zoom In">+</button>
            <button className="ar-ctrl-btn" onClick={() => handleZoom(-1)} title="Zoom Out">−</button>
          </div>

          {/* COMPASS ROSE */}
          <div className="ar-compass-rose">
            <div className="ar-compass-inner">
              <div className="ar-compass-n">N</div>
              <div className="ar-compass-s">S</div>
            </div>
          </div>

          {/* FOOTER INFORMATIONAL SUMMARY */}
          <div className="ar-info-bar">
            <div className="ar-info-text">
              <strong>Smart Navigation Active</strong>
              <span>{availableCount} available stalls showing in real-time</span>
            </div>
            
            <div className="ar-mode-toggle">
              <button 
                className={`ar-mode-btn ${mode === 'camera' ? 'active' : ''}`}
                onClick={() => setMode('camera')}
              >
                📹 Camera
              </button>
              <button 
                className={`ar-mode-btn ${mode === 'map' ? 'active' : ''}`}
                onClick={() => setMode('map')}
              >
                🗺️ Blueprint
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArNavigation;
