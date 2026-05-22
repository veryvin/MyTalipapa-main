import React, { useState, useContext, useEffect } from 'react';
import { DbContext } from '../../context/DbContext';

const AddStallModal = ({ isOpen, onClose, showToast }) => {
  const { addStall } = useContext(DbContext);
  const [num, setNum] = useState('');
  const [section, setSection] = useState('Vegetables');
  const [size, setSize] = useState('3m × 2m');
  const [rent, setRent] = useState(2500);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNum('');
      setSection('Vegetables');
      setSize('3m × 2m');
      setRent(2500);
      setDesc('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!num.trim()) {
      showToast('Please enter a stall number', 'error');
      return;
    }
    const res = addStall(num.trim(), section.toLowerCase(), size, rent, desc);
    if (res.success) {
      showToast(`Stall ${num} added successfully!`, 'success');
      onClose();
    } else {
      showToast(res.error || 'Error adding stall', 'error');
    }
  };

  return (
    <div className="modal-overlay open" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Add New Stall</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-grid">
            <div className="form-group">
              <label className="form-label">Stall Number</label>
              <input 
                className="form-input" 
                type="text" 
                placeholder="e.g. A-15"
                value={num}
                onChange={(e) => setNum(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Section</label>
              <select 
                className="form-input" 
                value={section}
                onChange={(e) => setSection(e.target.value)}
              >
                <option>Vegetables</option>
                <option>Fish</option>
                <option>Meat</option>
                <option>Dry Goods</option>
                <option>Snacks</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Size</label>
              <input 
                className="form-input" 
                type="text" 
                placeholder="3m × 2m"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Monthly Rent (₱)</label>
              <input 
                className="form-input" 
                type="number" 
                placeholder="2500"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              className="form-input" 
              rows="2" 
              placeholder="Brief description..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>
          </div>
          
          <button type="submit" className="form-btn">Add Stall</button>
        </form>
      </div>
    </div>
  );
};

export default AddStallModal;
