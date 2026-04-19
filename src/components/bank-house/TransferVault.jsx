import { useState } from 'react';
import { ShieldCheck, Send } from 'lucide-react';

export default function TransferVault({ balance, beneficiaries, onTransfer, selectedBeneficiary, setSelectedBeneficiary }) {
  const [amount, setAmount] = useState('');
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTransfer = async () => {
    if (!amount || !selectedBeneficiary || isSubmitting) return;

    window.setTimeout(() => {
      setIsSubmitting(true);
    }, 0);

    setToast('Transfer Initiated - Processing...');
    
    setTimeout(() => {
      setToast('Transfer Successful!');
      setTimeout(() => setToast(null), 3500);
    }, 400);

    try {
      await onTransfer(parseFloat(amount), selectedBeneficiary);
      setAmount('');
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 250);
    }
  };

  return (
    <div className="bank-card bank-glass transfer-vault relative">
      {toast && (
        <div 
          className={`absolute top-2 right-2 px-4 py-2 rounded shadow border ${
            toast.includes('Processing') 
              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50' 
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
          }`}
          style={{ zIndex: 50, transition: 'all 0.3s' }}
        >
          {toast}
        </div>
      )}
      <div className="card-header">
        <h2>Transfer Vault</h2>
        <ShieldCheck className="text-emerald-400" size={24} />
      </div>
      <div className="transfer-form">
        <div className="form-group">
          <label>From Account</label>
          <select className="bank-input">
            <option>Current (₮ {balance.toLocaleString('en-US', {minimumFractionDigits: 2})})</option>
          </select>
        </div>
        <div className="form-group">
          <label>To Beneficiary</label>
          <select 
            className="bank-input" 
            value={selectedBeneficiary || ""}
            onChange={(e) => setSelectedBeneficiary(e.target.value)}
          >
            <option value="">Select Beneficiary...</option>
            {beneficiaries.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Amount (₮)</label>
          <div className="amount-input-wrap">
            <span className="currency-symbol">₮</span>
            <input 
              type="number" 
              className="bank-input amount-input" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button className="max-btn" onClick={() => setAmount(balance.toString())}>MAX</button>
          </div>
        </div>
        <button className="bank-btn primary-btn w-full flex items-center justify-center gap-2" style={{ marginTop: '1rem' }} onClick={handleTransfer} disabled={isSubmitting}>
          <Send size={18} /> INITIALIZE TRANSFER
        </button>
      </div>
    </div>
  );
}
