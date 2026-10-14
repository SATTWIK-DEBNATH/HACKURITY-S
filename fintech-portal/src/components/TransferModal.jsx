import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, AlertCircle, Lock } from 'lucide-react';

export default function TransferModal({ isOpen, onClose, onExecuteTransfer, isSubmitting }) {
  const [toAccount, setToAccount] = useState('ACC-102');
  const [recipientName, setRecipientName] = useState('Bob Johnson (Verified Supplier)');
  const [amount, setAmount] = useState('250');
  const [memo, setMemo] = useState('Invoice #8841 Payment');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onExecuteTransfer({
      to_account: toAccount,
      recipient_name: recipientName,
      amount: parseFloat(amount) || 0,
      memo: memo
    });
  };

  const numAmount = parseFloat(amount) || 0;
  const willRequireStepUp = numAmount > 500;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(12px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="fintech-glass" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '28px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.15)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: 'var(--text-muted)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Treasury Wire Dispatch
          </span>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fff', marginTop: '4px' }}>
            Send Commercial Funds
          </h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Instant domestic wire transfer &bull; Continuous PEP proxy protected
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Source Account */}
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Originating Account
            </label>
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>ACC-101 (Primary Operating)</span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>Active</span>
            </div>
          </div>

          {/* Recipient */}
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Recipient Account & Name
            </label>
            <select
              value={toAccount}
              onChange={(e) => {
                setToAccount(e.target.value);
                if (e.target.value === 'ACC-102') setRecipientName('Bob Johnson (Verified Supplier)');
                else if (e.target.value === 'ACC-999') setRecipientName('Apex Offshore Escrow ACC-999');
                else setRecipientName('New External Counterparty');
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.8rem'
              }}
            >
              <option value="ACC-102">ACC-102 &bull; Bob Johnson (Verified Supplier)</option>
              <option value="ACC-999">ACC-999 &bull; Offshore Vendor Vault</option>
              <option value="CUSTOM">Custom External Wire</option>
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Transfer Amount ($ USD)</label>
              <span style={{ fontSize: '0.68rem', color: willRequireStepUp ? 'var(--accent-amber)' : 'var(--accent-emerald)', fontWeight: 700 }}>
                {willRequireStepUp ? '⚠️ Exceeds $500 &bull; Triggers HITL Step-Up' : '✓ <= $500 &bull; Fast-Path Permitted'}
              </span>
            </div>

            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: `1.5px solid ${willRequireStepUp ? 'var(--accent-amber)' : 'var(--border-subtle)'}`,
                color: '#fff',
                fontSize: '1.25rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 800
              }}
            />

            {/* Quick Amount Pills */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              {[100, 250, 500, 1250, 5000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(String(val))}
                  style={{
                    flex: 1,
                    padding: '5px 0',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    borderRadius: '6px',
                    background: Number(amount) === val ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    color: Number(amount) === val ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    border: `1px solid ${Number(amount) === val ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer'
                  }}
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>

          {/* Memo */}
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Reference / Invoice Memo
            </label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '0.78rem'
              }}
            />
          </div>

          {/* SentinAgent Security Guarantee Notice */}
          <div style={{
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'rgba(255, 153, 0, 0.08)',
            border: '1px solid rgba(255, 153, 0, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.68rem',
            color: '#fed7aa'
          }}>
            <Lock size={14} color="#ff9900" style={{ flexShrink: 0 }} />
            <span>
              <strong>AWS Cedar Zero-Trust Policy Active:</strong> Dispatches under $500 are authorized with a single-use ticket; dispatches over $500 require dual-custody supervisor approval.
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.88rem', marginTop: '4px' }}
          >
            {isSubmitting ? 'Evaluating Zero-Trust Policy...' : 'Authorize & Dispatch Wire'}
          </button>
        </form>
      </div>
    </div>
  );
}
