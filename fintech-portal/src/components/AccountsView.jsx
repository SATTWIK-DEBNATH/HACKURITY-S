import React, { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Send,
  Plus,
  ArrowLeftRight,
  FileText,
  Lock,
  Unlock,
  Shield,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import CashflowChart from './CashflowChart';

export default function AccountsView({
  accounts,
  transactions,
  onOpenTransferModal,
  onOpenZelleModal,
  onOpenBillPayModal,
  onOpenDepositModal,
  onSelectTransaction,
  onToggleFreezeCard,
  isCardFrozen = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [hideBalances, setHideBalances] = useState(false);

  // Compute total net worth
  const totalNetWorth = accounts.reduce((acc, a) => {
    if (a.type === 'credit') return acc - a.balance;
    return acc + a.balance;
  }, 0);

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    const matchSearch =
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.memo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.tool_name?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchSearch) return false;
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'CREDIT') return tx.amount > 0 || tx.type === 'credit';
    if (selectedFilter === 'DEBIT') return tx.amount < 0 || tx.type === 'debit';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* ============================================================== */}
      {/* 1. TOP NET WORTH & WELCOME BANNER                              */}
      {/* ============================================================== */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(8, 47, 73, 0.3) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '28px 32px',
        boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Liquid Net Worth
            </span>
            <button
              onClick={() => setHideBalances(!hideBalances)}
              title={hideBalances ? "Show Balances" : "Hide Balances"}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {hideBalances ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginTop: '6px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff', margin: 0 }}>
              {hideBalances ? '••••••••' : `$${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#34d399',
              fontSize: '0.78rem',
              fontWeight: 700
            }}>
              <TrendingUp size={13} />
              <span>+$3,240.50 (+2.2%) this month</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '0.8rem', color: '#94a3b8' }}>
            <span>Available Cash: <strong style={{ color: '#fff' }}>{hideBalances ? '••••' : '$122,570.75'}</strong></span>
            <span>&bull;</span>
            <span>Investment Assets: <strong style={{ color: '#fff' }}>{hideBalances ? '••••' : '$46,850.00'}</strong></span>
            <span>&bull;</span>
            <span>Credit Used: <strong style={{ color: '#f87171' }}>{hideBalances ? '••••' : '$1,420.50'}</strong></span>
          </div>
        </div>

        {/* Quick Action Suite */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onOpenTransferModal}
            className="btn-primary"
            style={{ padding: '11px 20px', fontSize: '0.88rem' }}
          >
            <ArrowLeftRight size={16} />
            <span>Transfer Funds</span>
          </button>
          <button
            onClick={onOpenZelleModal}
            className="btn-secondary"
            style={{ padding: '11px 18px', fontSize: '0.88rem', borderColor: 'rgba(168, 85, 247, 0.3)' }}
          >
            <Send size={15} style={{ color: '#c084fc' }} />
            <span>Send with Zelle®</span>
          </button>
          <button
            onClick={onOpenDepositModal}
            className="btn-secondary"
            style={{ padding: '11px 18px', fontSize: '0.88rem' }}
          >
            <Camera size={15} style={{ color: '#38bdf8' }} />
            <span>Deposit Check</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. ACCOUNTS SUMMARY GRID                                       */}
      {/* ============================================================== */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Primary Deposit & Credit Accounts
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#38bdf8', cursor: 'pointer', fontWeight: 600 }}>
            Manage Display Preferences &bull; Reorder
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {accounts.map(account => {
            const isCredit = account.type === 'credit';
            const isSavings = account.type === 'savings';
            const isInvestment = account.type === 'investment';

            return (
              <div
                key={account.id}
                className="fintech-card"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {account.accountType || account.category || 'Bank Account'}
                      </span>
                      <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                        {account.name}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Account &bull;&bull;&bull;&bull; {account.id?.slice(-4) || '9921'}
                      </span>
                    </div>

                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      background: isCredit
                        ? 'rgba(244, 63, 94, 0.1)'
                        : isSavings
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(56, 189, 248, 0.1)',
                      color: isCredit
                        ? '#fb7185'
                        : isSavings
                        ? '#34d399'
                        : '#38bdf8',
                      border: `1px solid ${isCredit ? 'rgba(244,63,94,0.2)' : isSavings ? 'rgba(16,185,129,0.2)' : 'rgba(56,189,248,0.2)'}`
                    }}>
                      {isCredit ? 'LINE: $30,000' : isSavings ? '4.35% APY' : isInvestment ? '+11.2% YTD' : 'ACTIVE'}
                    </span>
                  </div>

                  {/* Balance Display */}
                  <div style={{ marginTop: '16px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {isCredit ? 'Current Balance' : 'Available Balance'}
                    </span>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginTop: '2px' }}>
                      {hideBalances ? '••••••••' : `$${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </div>
                    {isCredit ? (
                      <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
                        $485.20 Cash Back available to redeem
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Ledger: ${((account.balance || 0) + 250).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Account Actions Bar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onOpenTransferModal(); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#38bdf8',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Transfer</span>
                    <ChevronRight size={13} />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); alert(`Downloading PDF Statement for ${account.name}...`); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Statements
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. CASHFLOW ANALYTICS & RECENT TRANSACTIONS                   */}
      {/* ============================================================== */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: '20px' }}>
        {/* Left: Monthly Cashflow Analytics */}
        <div className="fintech-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Cashflow & Spending Dynamics</h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                Automated monthly categorization & liquidity trend
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                Inflow: $18,400
              </span>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
                Outflow: $12,650
              </span>
            </div>
          </div>

          {/* Cashflow Chart */}
          <div style={{ height: '240px', width: '100%' }}>
            <CashflowChart />
          </div>
        </div>

        {/* Right: Quick Services & Card Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Credit Card Interactive Preview */}
          <div className="fintech-card" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                Preferred Card Control
              </span>
              <button
                onClick={onToggleFreezeCard}
                style={{
                  background: isCardFrozen ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: `1px solid ${isCardFrozen ? '#f43f5e' : '#10b981'}`,
                  color: isCardFrozen ? '#fb7185' : '#34d399',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {isCardFrozen ? <Lock size={12} /> : <Unlock size={12} />}
                <span>{isCardFrozen ? 'CARD FROZEN' : 'ACTIVE / UNLOCKED'}</span>
              </button>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '12px',
              background: isCardFrozen
                ? 'linear-gradient(135deg, #1e293b 0%, #0c4a6e 100%)'
                : 'linear-gradient(135deg, #0284c7 0%, #1e1b4b 100%)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              color: '#fff'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.04em' }}>APEX SIGNATURE</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.8 }}>VISA INFINITE</span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.14em', margin: '18px 0 10px 0', fontFamily: 'var(--font-mono)' }}>
                4582 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 9024
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', opacity: 0.85 }}>
                <span>ALEXANDER VANCE</span>
                <span>EXP 08/29</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={() => alert("Virtual Single-Use Card generated with $500 limit: 4912-8821-3910-1192 (CVV: 401)")}
                className="btn-secondary"
                style={{ padding: '8px', fontSize: '0.75rem', justifyContent: 'center' }}
              >
                <span>Virtual Card</span>
              </button>
              <button
                onClick={() => alert("Cash Back of $485.20 has been directly deposited into your Advantage Checking account!")}
                className="btn-secondary"
                style={{ padding: '8px', fontSize: '0.75rem', justifyContent: 'center', color: '#10b981' }}
              >
                <span>Redeem $485.20</span>
              </button>
            </div>
          </div>

          {/* Quick Services Pill Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div className="action-pill-btn" onClick={onOpenZelleModal}>
              <Send size={18} style={{ color: '#c084fc' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Zelle®</span>
            </div>
            <div className="action-pill-btn" onClick={onOpenBillPayModal}>
              <FileText size={18} style={{ color: '#38bdf8' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Bill Pay</span>
            </div>
            <div className="action-pill-btn" onClick={onOpenDepositModal}>
              <Camera size={18} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Deposit</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. RECENT TRANSACTIONS LEDGER                                  */}
      {/* ============================================================== */}
      <div className="fintech-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Live Transaction Ledger</h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
              Protected by NIST SP 800-207 Zero-Trust PEP Interceptor
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              width: '240px'
            }}>
              <Search size={14} style={{ color: '#64748b' }} />
              <input
                type="text"
                placeholder="Search merchant, memo..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.78rem',
                  outline: 'none',
                  width: '100%'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {['ALL', 'CREDIT', 'DEBIT'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: selectedFilter === filter ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: selectedFilter === filter ? '#38bdf8' : '#94a3b8',
                    border: `1px solid ${selectedFilter === filter ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>

            <button
              onClick={() => alert("Exporting all transactions to CSV...")}
              style={{
                background: 'none',
                border: '1px solid var(--border-subtle)',
                color: '#94a3b8',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <Download size={13} />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 14px' }}>Date & Time</th>
                <th style={{ padding: '12px 14px' }}>Description / Merchant</th>
                <th style={{ padding: '12px 14px' }}>Account</th>
                <th style={{ padding: '12px 14px' }}>Category</th>
                <th style={{ padding: '12px 14px' }}>Security Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => {
                const isCredit = tx.amount > 0 || tx.type === 'credit';
                const isAllow = tx.verdict === 'ALLOW';
                const isBlocked = tx.verdict === 'DENY' || tx.verdict === 'BLOCKED';
                const isStepUp = tx.verdict === 'STEP_UP_REQUIRED';

                return (
                  <tr
                    key={tx.id}
                    onClick={() => onSelectTransaction && onSelectTransaction(tx)}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px', color: '#94a3b8', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {tx.time_str || tx.timestamp?.slice(0, 10) || 'Today, 11:42 AM'}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 600, color: '#ffffff' }}>
                        {tx.description || tx.memo || 'Wire Settlement'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                        Ref: {tx.ticket_id || tx.id}
                      </div>
                    </td>
                    <td style={{ padding: '14px', color: '#94a3b8' }}>
                      {tx.to_account || 'Advantage Checking (...4819)'}
                    </td>
                    <td style={{ padding: '14px', color: '#94a3b8' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        fontSize: '0.7rem'
                      }}>
                        {tx.category || 'Operations'}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className={`badge-status ${isAllow ? 'badge-allowed' : isBlocked ? 'badge-blocked' : 'badge-stepup'}`}>
                        {isAllow ? <CheckCircle2 size={12} /> : isBlocked ? <Shield size={12} /> : <Clock size={12} />}
                        <span>{isAllow ? 'AUTHORIZED' : isBlocked ? 'BLOCKED' : 'STEP-UP'}</span>
                      </span>
                    </td>
                    <td style={{
                      padding: '14px',
                      textAlign: 'right',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      color: isCredit ? '#34d399' : '#ffffff'
                    }}>
                      {isCredit ? '+' : '-'}${Math.abs(tx.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
