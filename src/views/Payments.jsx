import React, { useContext, useState } from 'react';
import { DbContext } from '../context/DbContext';

const Payments = ({ showToast }) => {
  const { currentUser, db } = useContext(DbContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // '', 'paid', 'unpaid'

  if (!currentUser) return null;

  const isOp = currentUser.role === 'operator';
  const payments = isOp 
    ? db.payments 
    : db.payments.filter(p => p.renter === currentUser.name);

  // Compute metrics
  const totalCollected = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalUnpaid = payments
    .filter(p => p.status === 'unpaid')
    .reduce((sum, p) => sum + p.amount, 0);

  // Filter list
  const filteredPays = payments.filter(p => {
    const target = isOp ? p.renter : p.stallId;
    const matchesSearch = target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePayNow = (amount, stallId) => {
    showToast(`Online check-out portal is simulated for Stall ${stallId} (₱${amount.toLocaleString()}). Online payments are down, please visit Market Office.`, 'warning');
  };

  const handleExport = () => {
    showToast('Payment ledger exported successfully as CSV!', 'success');
  };

  return (
    <div className="page active" id="page-payments">
      <div className="payment-summary" style={{ background: 'linear-gradient(135deg,var(--green-deep),var(--green-mid))', borderRadius: 'var(--radius)', padding: '24px', color: '#fff', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="pay-label" style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px' }}>
              {isOp ? 'Total Collected (All Time)' : 'Total Rent Paid'}
            </div>
            <div className="pay-amount" style={{ fontFamily: "'Space Mono', monospace", fontSize: '36px', fontWeight: 700 }}>
              ₱{totalCollected.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="pay-label" style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px' }}>
              Total Balance Unpaid
            </div>
            <div className="pay-amount" style={{ fontFamily: "'Space Mono', monospace", fontSize: '36px', fontWeight: 700, color: '#ffd6a5' }}>
              ₱{totalUnpaid.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <div className="table-toolbar" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--gray-200)', flexWrap: 'wrap' }}>
          <input 
            className="search-input" 
            placeholder={isOp ? "Search renter name..." : "Search stall ID..."}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, maxWidth: '280px' }}
          />
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          {isOp && (
            <button className="btn btn-sm btn-green" onClick={handleExport} style={{ marginLeft: 'auto' }}>
              ⬇ Export Ledger
            </button>
          )}
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>{isOp ? 'Renter Name' : 'Stall No.'}</th>
              <th>Billing Month</th>
              <th>Rent Amount</th>
              <th>Lease Due Date</th>
              <th>Payment Date</th>
              <th>Lease Status</th>
              {!isOp && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPays.map(p => (
              <tr key={p.id}>
                <td><strong>{isOp ? p.renter : p.stallId}</strong></td>
                <td>{p.month}</td>
                <td>₱{p.amount.toLocaleString()}</td>
                <td>{p.due}</td>
                <td>{p.paid || '—'}</td>
                <td>
                  <span className={`status-badge ${p.status === 'paid' ? 'badge-approv' : 'badge-reject'}`}>
                    {p.status}
                  </span>
                </td>
                {!isOp && (
                  <td>
                    {p.status === 'paid' ? (
                      <button 
                        className="act-btn act-view" 
                        onClick={() => showToast(`Receipt details for ${p.month}: Renter: ${p.renter}, Stall: ${p.stallId}, Paid: ₱${p.amount.toLocaleString()} on ${p.paid}`, 'info')}
                        title="View Receipt"
                        style={{ border: 'none', cursor: 'pointer' }}
                      >
                        🧾
                      </button>
                    ) : (
                      <button 
                        className="btn btn-sm btn-primary" 
                        onClick={() => handlePayNow(p.amount, p.stallId)}
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {filteredPays.length === 0 && (
              <tr>
                <td colSpan={isOp ? 6 : 7} style={{ textAlign: 'center', padding: '30px', color: 'var(--gray-600)' }}>
                  No payment ledger matches your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
