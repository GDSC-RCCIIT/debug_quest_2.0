import './BankHouse.css'
import { useState, useEffect } from 'react'
import { 
  Building2, Wallet, Activity, Users, FileText, 
  ShieldAlert, LifeBuoy, Bell, User, ShieldCheck, 
  ChevronLeft, ArrowRightLeft, AlertTriangle
} from 'lucide-react'

// Subcomponents
import { useBankData } from './bank-house/hooks/useBankData';
import TransactionsTable from './bank-house/TransactionsTable';
import TransferVault from './bank-house/TransferVault';
import BeneficiariesPanel from './bank-house/BeneficiariesPanel';

export default function BankHouse({ onBack }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [glitchText, setGlitchText] = useState('8,452,190.45')
  
  const { balance, savings, transferFunds, mockTransactions, mockBeneficiaries } = useBankData();
  const [selectedBen, setSelectedBen] = useState('');

  // Fake glitch effect for total balance
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitchText((prev) => {
          const chars = prev.split('')
          const randIdx = Math.floor(Math.random() * chars.length)
          if(chars[randIdx] !== '.' && chars[randIdx] !== ',') {
            chars[randIdx] = Math.floor(Math.random() * 9).toString()
          }
          return chars.join('')
        })
        setTimeout(() => setGlitchText((balance).toLocaleString('en-US', {minimumFractionDigits: 2})), 150)
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [balance])

  return (
    <main className="bank-house-shell">
      <div className="bank-noise" aria-hidden="true" />
      <div className="bank-glow bank-glow-cyan" aria-hidden="true" />
      <div className="bank-glow bank-glow-emerald" aria-hidden="true" />

      <div className="bank-page-wrap">
        <nav className="bank-navbar bank-glass">
          <div className="bank-nav-left">
            <button type="button" className="bank-back-link" onClick={onBack}>
              <ChevronLeft size={20} /> City
            </button>
            <div className="bank-title-group">
              <h1><Building2 className="bank-icon-title" /> Bank House <span>v2.1</span></h1>
              <p className="glitch-text-sm">Financial systems instability detected...</p>
            </div>
          </div>
          <div className="bank-nav-right">
            <div className="bank-security-badge pulse-warning">
              <ShieldAlert size={16} /> SYSTEM UNSTABLE
            </div>
            <button className="bank-icon-btn"><Bell size={20} /><span className="dot"></span></button>
            <button className="bank-icon-btn"><User size={20} /></button>
          </div>
        </nav>

        <section className="bank-layout-grid">
          <aside className="bank-sidebar bank-glass">
            <nav className="bank-side-nav">
              {[
                { id: 'dashboard', icon: Activity, label: 'Dashboard' },
                { id: 'accounts', icon: Wallet, label: 'Accounts' },
                { id: 'transfer', icon: ArrowRightLeft, label: 'Transfer Vault' },
                { id: 'beneficiaries', icon: Users, label: 'Beneficiaries' },
                { id: 'statements', icon: FileText, label: 'Statements' },
                { id: 'fraud', icon: ShieldCheck, label: 'Fraud Monitor' },
                { id: 'support', icon: LifeBuoy, label: 'Support' },
              ].map(item => (
                <button 
                  key={item.id} 
                  className={`bank-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon size={18} /> {item.label}
                </button>
              ))}
            </nav>
            <div className="bank-sys-status">
              <div className="status-bar"><div className="status-fill" style={{width: '42%'}}></div></div>
              <span>Network Sync: 42%</span>
            </div>
          </aside>

          <section className="bank-main-content">
            <div className="bank-summary-row">
              <div className="bank-card summary-card bank-glass">
                <h3>Total Balance</h3>
                <div className="balance-value glitch-target">₮ {glitchText}</div>
                <span className="trend positive">+12.5% this month</span>
              </div>
              <div className="bank-card summary-card bank-glass">
                <h3>Savings Vault</h3>
                <div className="balance-value">₮ {savings.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                <span className="trend positive">Locked</span>
              </div>
              <div className="bank-card summary-card bank-glass">
                <h3>Current Account</h3>
                <div className="balance-value">₮ {balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                <span className="trend negative hover-glitch">Pending holds</span>
              </div>
              <div className="bank-card summary-card bank-glass">
                <h3>Monthly Spend</h3>
                <div className="balance-value">₮ 42,850.20</div>
                <span className="trend negative">+8.2% vs last month</span>
              </div>
            </div>

            <div className="bank-content-grid">
              <div className="bank-center-panel">
                <TransactionsTable allTransactions={mockTransactions} />
                <TransferVault 
                    balance={balance} 
                    beneficiaries={mockBeneficiaries} 
                    onTransfer={transferFunds}
                    selectedBeneficiary={selectedBen}
                    setSelectedBeneficiary={setSelectedBen}
                />
              </div>

              <div className="bank-right-panel">
                <div className="bank-card bank-glass">
                  <h2>Security Alerts</h2>
                  <div className="alert-list">
                    <div className="alert-item critical">
                      <AlertTriangle size={16} />
                      <div className="alert-content">
                        <strong>Unauthorized Access Attempt</strong>
                        <span>Terminal 4A - 2 mins ago</span>
                      </div>
                    </div>
                    <div className="alert-item warning">
                      <ShieldAlert size={16} />
                      <div className="alert-content">
                        <strong>Large Transfer Pending</strong>
                        <span>₮ 89,000.00 awaiting clearance</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bank-card bank-glass chart-card">
                  <h2>Spending Overview</h2>
                  <div className="chart-placeholder">
                    {/* CSS driven simple bar chart */}
                    <div className="bar-chart">
                      <div className="bar" style={{height: '40%'}}></div>
                      <div className="bar" style={{height: '60%'}}></div>
                      <div className="bar" style={{height: '35%'}}></div>
                      <div className="bar" style={{height: '80%'}}></div>
                      <div className="bar active-bar" style={{height: '100%'}}></div>
                      <div className="bar" style={{height: '45%'}}></div>
                    </div>
                    <div className="chart-labels">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                    </div>
                  </div>
                </div>

                <BeneficiariesPanel 
                    beneficiaries={mockBeneficiaries} 
                    onSelectBeneficiary={(ben) => setSelectedBen(ben?.id || '')} 
                />
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}
