import React, { useState, useContext, useEffect } from 'react';
import { DbContext } from '../../context/DbContext';

const ApplyModal = ({ stallId, isOpen, onClose, showToast }) => {
  const { submitApplication } = useContext(DbContext);
  const [biz, setBiz] = useState('Vegetable Retail');
  const [msg, setMsg] = useState('');

  // Reset fields when opened for a new stall
  useEffect(() => {
    if (isOpen) {
      setBiz('Vegetable Retail');
      setMsg('');
    }
  }, [isOpen, stallId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = submitApplication(stallId, biz, msg);
    if (res.success) {
      showToast('Application submitted successfully!', 'success');
      onClose();
    } else {
      showToast(res.error || 'Error submitting application', 'error');
    }
  };

  return (
    <div className="modal-overlay open" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Apply for Stall <span id="apply-stall-id">{stallId}</span></h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Business Type</label>
            <select 
              className="form-input" 
              value={biz} 
              onChange={(e) => setBiz(e.target.value)}
            >
              <option>Vegetable Retail</option>
              <option>Fish Retail</option>
              <option>Meat Vendor</option>
              <option>General Goods</option>
              <option>Snacks & Drinks</option>
              <option>Dry Goods</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Message to Operator</label>
            <textarea 
              className="form-input" 
              rows="3" 
              placeholder="Briefly describe your business..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div style={{ background: 'var(--green-pale)', borderRadius: '12px', padding: '14px', marginBottom: '16px', fontSize: '13px', color: 'var(--green-mid)' }}>
            <strong>📋 Note:</strong> Your application will be reviewed by the market operator. You will be notified once it's approved or rejected.
          </div>
          
          <button type="submit" className="form-btn">Submit Application</button>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
