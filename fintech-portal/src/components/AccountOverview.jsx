import React, { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  Lock,
  Unlock,
  AlertTriangle,
  Download,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function AccountOverview({
  balance,
  onOpenTransferModal,
  onTriggerQuickRefund,
  onTriggerExportPII,
  onSelectCopilot
}) {
  const [copied, setCopied] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  const handleCopyCard = () => {
    navigator.clipboard?.writeText('4582 9912 3841 9812');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Greeting & Total Treasury Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Treasury & Commercial Liquidity
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginTop: '2px' }}>
            Good afternoon, Alice
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onTriggerExportPII}
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '8px 12px' }}
            title="Attempts to export unmasked customer SSNs (SentinAgent will intercept & block via Cedar Policy 5)"
          >
            <Download size={14} />
            <span>Export Statement (PII)</span>
          </button>

          <button
            onClick={onOpenTransferModal}
            className="btn-primary"
            style={{ fontSize: '0.75rem', padding: '8px 14px' }}
          >
            <ArrowUpRight size={14} />
            <span>Send Funds</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Metric Tiles & Metallic Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '20px' }}>
        {/* Left Column: Account Balances */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Primary Operating Checking ACC-101 */}
          <div className="fintech-glass fintech-card-hover" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Primary Operating Account (ACC-101)
              </span>
              <span className="badge-status badge-allowed">
                Zero-Trust Active
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#fff', letterSpacing: '-0.03em' }}>
                ${Number(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                <TrendingUp size={13} /> +3.8% this week
              </span>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Routing: </span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>021000021</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Account: </span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>ACC-101-9982</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Autonomous Limit: </span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)' }}>$500.00 / call</span>
              </div>
            </div>
          </div>

          {/* Secondary Sub-Accounts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="fintech-glass fintech-card-hover" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Treasury Reserve Vault
              </span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
                $38,750.00
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--accent-emerald)', display: 'block', marginTop: '4px' }}>
                5.15% APY Yield
              </span>
            </div>

            <div className="fintech-glass fintech-card-hover" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Micro-Claims Refund Buffer
              </span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
                $5,000.00
              </span>
              <button
                onClick={onTriggerQuickRefund}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                  padding: 0
                }}
              >
                <RefreshCw size={11} /> Execute $40 Micro-Refund
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Physical & Virtual Titanium Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="metal-credit-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="metal-chip" />
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', letterSpacing: '0.1em', fontWeight: 800 }}>
                  DEBIT
                </span>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.05em', color: '#fff' }}>
                APEX PLATINUM
              </span>
            </div>

            <div>
              <div style={{
                fontSize: '1.15rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.18em',
                color: isFrozen ? '#64748b' : '#f8fafc',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                marginBottom: '10px'
              }}>
                {isFrozen ? '•••• •••• •••• 9812' : '4582 9912 3841 9812'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontSize: '0.58rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Cardholder</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.04em' }}>ALICE SMITH</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.58rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Expires</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#e2e8f0' }}>09/29</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Controls */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsFrozen(!isFrozen)}
              className="btn-secondary"
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.72rem' }}
            >
              {isFrozen ? <Unlock size={13} color="var(--accent-emerald)" /> : <Lock size={13} color="var(--accent-rose)" />}
              <span>{isFrozen ? 'Unfreeze Card' : 'Freeze Card'}</span>
            </button>

            <button
              onClick={handleCopyCard}
              className="btn-secondary"
              style={{ flex: 1, padding: '8px 12px', fontSize: '0.72rem' }}
            >
              {copied ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
              <span>{copied ? 'Copied Number' : 'Copy Number'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
