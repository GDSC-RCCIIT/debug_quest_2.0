import { Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useTransactions } from './hooks/useTransactions';

const formatDate = (dateString, index) => {
  const d = new Date(dateString);
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const year = d.getFullYear();

  return `${month}/${day}/${year}`;
};

export default function TransactionsTable({ allTransactions }) {
  const {
    data,
    page,
    loading,
    dateRange,
    handleNextPage,
    handlePrevPage,
    handleFilterChange
  } = useTransactions(allTransactions);

  return (
    <div className="bank-card bank-glass table-card">
      <div className="card-header">
        <h2>Recent Transactions</h2>
        <div className="table-actions">
          <div className="bank-search">
            <Search size={16} />
            <input type="text" placeholder="Search Ledgers..." />
          </div>
          <div className="filter-dropdown">
            <select 
              value={dateRange}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="bank-input"
              style={{ padding: '6px 10px', width: 'auto', background: 'var(--bank-glass-bg)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '4px' }}
            >
              <option value="All Time">All Time</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="Error_Trigger">Archived</option>
            </select>
          </div>
        </div>
      </div>
      <div className="table-wrapper" style={{ position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', zIndex: 10 }}>
            <Loader2 className="spinner" size={32} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}
        <table className="bank-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Recipient</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tx, idx) => (
              <tr key={tx.id} className={tx.status === 'Pending' ? 'row-glitch' : ''}>
                <td>{tx.id}</td>
                <td>{formatDate(tx.date, idx)}</td>
                <td>{tx.recipient}</td>
                <td>
                  <span className={`status ${tx.status.toLowerCase()}`}>
                    {tx.status}
                  </span>
                </td>
                <td className={`amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                  {tx.amount > 0 ? '+' : ''}₮ {Math.abs(tx.amount).toFixed(2)}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>No transactions found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <span>Page {page} of 3</span>
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={page === 1}><ChevronLeft size={16} /></button>
          <button className="active">{page}</button>
          <button onClick={handleNextPage} disabled={page >= 3}><ChevronRight size={16} /></button>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
