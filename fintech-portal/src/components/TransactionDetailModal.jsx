import React, { useState } from 'react';
import { X, CheckCircle2, Shield, Download, AlertTriangle, FileText, ExternalLink } from 'lucide-react';

export default function TransactionDetailModal({ transaction, onClose, onDisputeTransaction }) {
  if (!transaction) return null;

  const [disputed, setDisputed] = useState(false);
  const isCredit = transaction.amount > 0 || transaction.type === 'credit';
  const isAllow = transaction.verdict === 'ALLOW';
  const isBlocked = transaction.verdict === 'DENY' || transaction.verdict === 'BLOCKED';

  const handleDispute = () => {
    setDisputed(true);
    if (onDisputeTransaction) {
      onDisputeTransaction(transaction);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="fintech-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '28px',
          background: '#0d1322',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Transaction Receipt</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Amount & Merchant Header */}
        <div style={{ textAlign: 'center', padding: '16px 0 24px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            color: isCredit ? '#34d399' : '#ffffff',
            letterSpacing: '-0.03em'
          }}>
            {isCredit ? '+' : '-'}${Math.abs(transaction.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', marginTop: '4px' }}>
            {transaction.description || transaction.memo || 'Banking Transaction'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
            {transaction.time_str || transaction.timestamp || 'Today, 11:42 AM'}
          </div>
        </div>

        {/* Breakdown Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: '#94a3b8' }}>Account:</span>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{transaction.to_account || 'Advantage Checking (...4819)'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: '#94a3b8' }}>Category:</span>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{transaction.category || 'Vendor / Operations'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: '#94a3b8' }}>Transaction Reference:</span>
            <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              {transaction.ticket_id || transaction.id || 'TXN-99824'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: '#94a3b8' }}>Zero-Trust Verdict:</span>
            <span style={{
              color: isAllow ? '#34d399' : isBlocked ? '#fb7185' : '#fbbf24',
              fontWeight: 700
            }}>
              {transaction.verdict || 'ALLOW (Authorized)'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: '#94a3b8' }}>Risk Assessment:</span>
            <span style={{ color: '#94a3b8' }}>Score: {transaction.risk_score || 10}/100</span>
          </div>
        </div>

        {disputed && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#fbbf24',
            fontSize: '0.78rem',
            marginBottom: '16px'
          }}>
            Dispute ticket #DIS-8821 initiated. A provisional credit may be posted to your account within 24-48 business hours.
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => alert(`Downloading formal PDF receipt for ${transaction.id}...`)}
            className="btn-secondary"
            style={{ flex: 1, padding: '10px', fontSize: '0.82rem', justifyContent: 'center' }}
          >
            <Download size={14} />
            <span>Save Receipt</span>
          </button>

          {!isCredit && (
            <button
              onClick={handleDispute}
              disabled={disputed}
              className="btn-secondary"
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '0.82rem',
                justifyContent: 'center',
                color: disputed ? '#64748b' : '#f43f5e',
                borderColor: disputed ? 'transparent' : 'rgba(244, 63, 94, 0.3)'
              }}
            >
              <AlertTriangle size={14} />
              <span>{disputed ? 'Dispute Queued' : 'Dispute Charge'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
