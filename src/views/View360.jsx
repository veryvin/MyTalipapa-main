import React, { useContext, useState, useRef, useEffect } from 'react';
import { DbContext } from '../context/DbContext';

const LAYOUT = [
  'A-01', 'A-02', 'A-03', 'A-04', 'A-05', 'A-12', 'B-01', 'B-02', 'B-05', 'B-06',
  'C-01', 'C-08', 'D-01', 'D-10', 'D-11', 'E-01', 'E-03', 'E-07', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', ''
];

const View360 = ({ onOpenApplyModal, showToast }) => {
  const { db } = useContext(DbContext);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [selectedStallId, setSelectedStallId] = useState(null);
  
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const sceneRef = useRef(null);

  const handleMove = (dir) => {
    const delta = {
      up: { x: 5, y: 0 },
      down: { x: -5, y: 0 },
      left: { x: 0, y: -8 },
      right: { x: 0, y: 8 }
    };
    
    setRot(prev => ({
      x: Math.max(-30, Math.min(30, prev.x + delta[dir].x)),
      y: prev.y + delta[dir].y
    }));
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    if (sceneRef.current) {
      sceneRef.current.style.transition = 'none';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = (e.clientX - dragStart.current.x) * 0.3;
    const dy = (e.clientY - dragStart.current.y) * 0.2;
    
    dragStart.current = { x: e.clientX, y: e.clientY };
    
    setRot(prev => ({
      x: Math.max(-30, Math.min(30, prev.x - dy)),
      y: prev.y + dx
    }));
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
      if (sceneRef.current) {
        sceneRef.current.style.transition = 'transform 0.3s ease';
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleSelectStall = (stallId) => {
    const s = db.stalls.find(x => x.id === stallId);
    if (!s) return;
    
    setSelectedStallId(stallId);
    showToast(`Panorama Focused: ${s.id} · ${s.section.toUpperCase()} · ₱${s.rent.toLocaleString()}/mo (${s.status})`, 'success');
  };

  const selectedStall = db.stalls.find(s => s.id === selectedStallId);

  return (
    <div className="page active" id="page-view360">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 className="section-title" style={{ margin: 0 }}>360° Panorama Explorer</h2>
          <p style={{ fontSize: '13px', color: 'var(--gray-600)', marginTop: '4px' }}>Explore the market blueprint like you're standing in the aisle</p>
        </div>
        <button 
          className="btn btn-sm btn-green" 
          onClick={() => handleSelectStall(db.stalls[Math.floor(Math.random() * db.stalls.length)]?.id)}
        >
          🎲 Random Stall
        </button>
      </div>

      <div className="view360-container">
        <div 
          ref={sceneRef}
          className="view360-scene" 
          id="v360scene"
          style={{
            transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
            transition: isDragging.current ? 'none' : 'transform 0.3s ease'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          {/* PANORAMIC STALL BOOTHS GRID */}
          <div className="v360-grid" id="v360grid">
            {LAYOUT.map((id, i) => {
              if (!id) return <div key={i} className="v360-stall" style={{ background: 'rgba(0,0,0,0.1)' }}></div>;
              const s = db.stalls.find(x => x.id === id);
              if (!s) return <div key={i} className="v360-stall"></div>;
              
              const color = s.status === 'available' 
                ? 'rgba(64,145,108,0.5)' 
                : s.status === 'occupied' 
                ? 'rgba(244,162,97,0.5)' 
                : 'rgba(230,57,70,0.4)';
                
              return (
                <div 
                  key={s.id} 
                  className={`v360-stall ${selectedStallId === s.id ? 'hl' : ''}`}
                  style={{ background: color }}
                  onClick={() => handleSelectStall(s.id)}
                  title={s.id}
                >
                  {s.id}
                </div>
              );
            })}
          </div>

          {/* HUD INTERACTIVE OVERLAYS */}
          <div className="v360-hud">
            <div className="v360-crosshair"></div>
            <div className="v360-label" style={{ top: '20px', left: '20px' }}>📍 You are at the Central Entrance</div>
            
            {selectedStall && (
              <div className="v360-label" style={{ top: '60px', left: '20px' }}>
                🎯 Selected: {selectedStall.id} — {selectedStall.section.toUpperCase()} — ₱{selectedStall.rent.toLocaleString()}/mo ({selectedStall.status.toUpperCase()})
              </div>
            )}
            
            <div className="v360-label" style={{ bottom: '20px', right: '120px' }}>Pandacan Talipapa</div>
            <div className="v360-nav-hint">🖱️ Click on any stall to select · Drag with cursor to rotate panorama view</div>
          </div>

          {/* COMPASS DIRECTION ARROWS */}
          <div className="v360-direction-btns" onMouseDown={(e) => e.stopPropagation()}>
            <button className="v360-arrow" onClick={() => handleMove('up')}>↑</button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="v360-arrow" onClick={() => handleMove('left')}>←</button>
              <button className="v360-arrow" onClick={() => handleMove('right')}>→</button>
            </div>
            <button className="v360-arrow" onClick={() => handleMove('down')}>↓</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View360;
