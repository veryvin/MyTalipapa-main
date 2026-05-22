import React, { useState, useContext, useEffect } from 'react';
import { DbContext } from '../../context/DbContext';

const AnnouncementModal = ({ isOpen, onClose, showToast }) => {
  const { postAnnouncement } = useContext(DbContext);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('normal');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setCategory('general');
      setPriority('normal');
      setMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !msg.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    const res = postAnnouncement(title.trim(), category, priority, msg.trim());
    if (res.success) {
      showToast('Announcement posted successfully!', 'success');
      onClose();
    } else {
      showToast(res.error || 'Error posting announcement', 'error');
    }
  };

  return (
    <div className="modal-overlay open" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Post Announcement</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input 
              className="form-input" 
              type="text" 
              placeholder="Announcement title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="modal-grid">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="general">General</option>
                <option value="reminder">Reminder</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select 
                className="form-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea 
              className="form-input" 
              rows="3" 
              placeholder="Announcement message..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              required
            ></textarea>
          </div>
          
          <button type="submit" className="form-btn">Post Announcement</button>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementModal;
