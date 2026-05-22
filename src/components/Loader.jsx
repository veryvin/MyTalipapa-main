import React, { useEffect, useState } from 'react';

const Loader = () => {
  const [visible, setVisible] = useState(true);
  const [rendered, setRendered] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, 1600);

    const removeTimer = setTimeout(() => {
      setRendered(false);
    }, 1900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!rendered) return null;

  return (
    <div 
      className="loader-overlay" 
      id="loader"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: visible ? 'all' : 'none'
      }}
    >
      <div className="loader-logo">My<span>Talipapa</span></div>
      <div style={{ fontSize: '13px', color: 'var(--gray-400)' }}>Smart Market Navigation System</div>
      <div className="loader-bar">
        <div className="loader-fill"></div>
      </div>
    </div>
  );
};

export default Loader;
