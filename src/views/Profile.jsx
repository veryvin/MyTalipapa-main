import React, { useContext, useState } from 'react';
import { DbContext } from '../context/DbContext';

const Profile = ({ showToast }) => {
  const { currentUser, db, updateProfile } = useContext(DbContext);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');

  if (!currentUser) return null;

  const isOp = currentUser.role === 'operator';

  // Compute stats
  const stallsCount = isOp 
    ? db.stalls.length 
    : (currentUser.stallId ? 1 : 0);

  const appsCount = isOp
    ? db.applications.length
    : db.applications.filter(a => a.applicant === currentUser.name).length;

  const paymentsCount = isOp
    ? db.payments.length
    : db.payments.filter(p => p.renter === currentUser.name && p.status === 'paid').length;

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and Email are required fields.', 'error');
      return;
    }
    const res = updateProfile(name, email, phone, address);
    if (res.success) {
      showToast('Profile details updated successfully!', 'success');
    } else {
      showToast(res.error || 'Failed to update profile details', 'error');
    }
  };

  return (
    <div className="page active" id="page-profile">
      <h2 className="section-title">My Profile</h2>
      
      <div className="profile-card" style={{ background: '#fff', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
        <div className="profile-cover" style={{ height: '120px', background: 'linear-gradient(135deg,var(--green-deep),var(--green-bright))' }}></div>
        <div className="profile-info" style={{ padding: '0 24px 24px' }}>
          <div 
            className="profile-avatar"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--green-bright)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 700,
              color: '#fff',
              border: '4px solid #fff',
              marginTop: '-40px',
              marginBottom: '12px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-name" style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: 'var(--green-deep)', fontWeight: 700 }}>
            {currentUser.name}
          </div>
          <div className="profile-role-badge" style={{ display: 'inline-block', background: 'var(--green-pale)', color: 'var(--green-mid)', padding: '4px 12px', borderRadius: '100px', fontSize: '12px', fontWeight: 700, marginTop: '4px', textTransform: 'capitalize' }}>
            {currentUser.role === 'operator' ? 'Market Operator' : 'Stall Renter'}
          </div>
          
          <div className="profile-details" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '20px' }}>
            <div className="profile-stat" style={{ textAlign: 'center', padding: '12px', background: 'var(--gray-100)', borderRadius: '12px' }}>
              <div className="ps-value" style={{ fontFamily: "'Space Mono', monospace", fontSize: '20px', fontWeight: 700, color: 'var(--green-deep)' }}>
                {stallsCount}
              </div>
              <div className="ps-label" style={{ fontSize: '11px', color: 'var(--gray-600)', marginTop: '4px' }}>
                {isOp ? 'Total Stalls' : 'My Stalls'}
              </div>
            </div>
            <div className="profile-stat" style={{ textAlign: 'center', padding: '12px', background: 'var(--gray-100)', borderRadius: '12px' }}>
              <div className="ps-value" style={{ fontFamily: "'Space Mono', monospace", fontSize: '20px', fontWeight: 700, color: 'var(--green-deep)' }}>
                {appsCount}
              </div>
              <div className="ps-label" style={{ fontSize: '11px', color: 'var(--gray-600)', marginTop: '4px' }}>
                Applications
              </div>
            </div>
            <div className="profile-stat" style={{ textAlign: 'center', padding: '12px', background: 'var(--gray-100)', borderRadius: '12px' }}>
              <div className="ps-value" style={{ fontFamily: "'Space Mono', monospace", fontSize: '20px', fontWeight: 700, color: 'var(--green-deep)' }}>
                {isOp ? paymentsCount : paymentsCount}
              </div>
              <div className="ps-label" style={{ fontSize: '11px', color: 'var(--gray-600)', marginTop: '4px' }}>
                {isOp ? 'Total Payments' : 'Payments Made'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Personal Information</div>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name</label>
              <input 
                className="form-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Dela Cruz"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Username</label>
              <input 
                className="form-input" 
                value={currentUser.username} 
                readOnly 
                style={{ background: 'var(--gray-100)', cursor: 'not-allowed' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email Address</label>
              <input 
                className="form-input" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan@email.com"
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number</label>
              <input 
                className="form-input" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 6789"
              />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label">Residential Address</label>
            <input 
              className="form-input" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your street address, city"
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-green" type="submit">
              Save Changes
            </button>
            <button 
              className="btn btn-outline" 
              type="button" 
              onClick={() => showToast('Update password feature coming soon!', 'info')}
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
