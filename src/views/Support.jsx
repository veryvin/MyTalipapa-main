import React, { useState } from 'react';

const FAQS = [
  { q: 'How do I pay my rent?', a: 'You can pay through the Payment History page or visit the market admin office.' },
  { q: 'How do I renew my rental?', a: 'Go to My Stall and click Renew Rental 30 days before expiration.' },
  { q: 'How to navigate to my stall?', a: 'Use the AR Navigation feature to get real-time directions.' },
  { q: 'What are the market rules?', a: 'Visit the Announcements page or contact the admin office.' }
];

const Support = ({ showToast }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !description.trim()) {
      showToast('Please select a category and fill in the description.', 'error');
      return;
    }
    showToast('Support ticket submitted successfully! Our operators will look into it shortly.', 'success');
    setCategory('');
    setDescription('');
  };

  return (
    <div className="page active" id="page-support">
      <h2 className="section-title">Support & Help Center</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Frequently Asked Questions</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                style={{ borderBottom: '1px solid var(--gray-200)', padding: '12px 0' }}
              >
                <div 
                  style={{ fontWeight: 600, fontSize: '13px', color: 'var(--green-deep)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => toggleFaq(index)}
                >
                  <span>❓ {faq.q}</span>
                  <span style={{ fontSize: '10px', color: 'var(--gray-400)' }}>
                    {openFaq === index ? '▲' : '▼'}
                  </span>
                </div>
                {openFaq === index && (
                  <div className="faq-ans" style={{ display: 'block', fontSize: '13px', color: 'var(--gray-600)', marginTop: '6px', lineHeight: 1.5 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Report an Issue / Contact Admin</div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="payment">Payment Issue</option>
                <option value="stall">Stall Problem</option>
                <option value="nav">Navigation Issue</option>
                <option value="account">Account Problem</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Describe the Issue</label>
              <textarea 
                className="form-input" 
                rows="4" 
                placeholder="Please describe your issue here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <button className="form-btn" type="submit">Submit Ticket</button>
          </form>

          <div style={{ marginTop: '20px', padding: '16px', background: 'var(--gray-100)', borderRadius: '10px' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--green-deep)', marginBottom: '8px' }}>
              📞 Contact Information
            </div>
            <div style={{ fontSize: '13px', color: 'var(--gray-600)', lineHeight: 1.8 }}>
              <strong>Office Hours:</strong> Mon–Sun · 8:00 AM–6:00 PM<br />
              <strong>Phone:</strong> (02) 8123-4567<br />
              <strong>Email:</strong> admin@mytalipapa.com<br />
              <strong>Location:</strong> Pandacan Public Market, Manila
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
