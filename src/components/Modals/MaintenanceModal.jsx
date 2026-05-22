import React, { useState, useContext, useEffect } from 'react';
import { DbContext } from '../../context/DbContext';

const MaintenanceModal = ({ isOpen, onClose, showToast }) => {
  const { submitMaintenance } = useContext(DbContext);
  const [issue, setIssue] = useState('Broken Light');
  const [priority, setPriority] = useState('Medium');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIssue('Broken Light');
      setPriority('Medium');
      setDesc('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = submitMaintenance(issue, priority, desc);
    if (res.success) {
      showToast('Maintenance request submitted successfully!', 'success');
      onClose();
    } else {
      showToast(res.error || 'Error submitting request', 'error');
    }
  };

  return (
    <div className="modal-overlay open" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Submit Maintenance Request</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Issue Type</label>
            <select 
              className="form-input"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            >
              <option>Broken Light</option>
              <option>Water Leak</option>
              <option>Damaged Floor</option>
              <option>Broken Signage</option>
              <option>Clogged Drain</option>
              <option>Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select 
              className="form-input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-input" 
              rows="3" 
              placeholder="Describe the issue..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            ></textarea>
          </div>
          
          <button type="submit" className="form-btn">Submit Request</button>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceModal;
