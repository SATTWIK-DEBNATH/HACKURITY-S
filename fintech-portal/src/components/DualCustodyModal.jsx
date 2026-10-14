import React from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

export default function DualCustodyModal({ pendingApprovals, onResolve }) {
  if (!pendingApprovals || pendingApprovals.length === 0) return null;

  const current = pendingApprovals[0];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(16px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="fintech-glass" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '28px',
        border: '1.5px solid var(--accent-amber)',
        boxShadow: '0 0 50px rgba(245, 158, 11, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid var(--accent-amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24'
          }}>
            <Clock size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              NIST SP 800-207 DUAL CUSTODY
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff', margin: '2px 0 0' }}>
              Step-Up Authorization Required
            </h2>
          </div>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '16px' }}>
          Autonomous agent <strong>{current.agent_id}</strong> ({current.role}) initiated a sensitive financial dispatch that exceeds autonomous policy limits ($500.00). An authorized treasury officer must review and sign.
        </p>

        {/* Transaction Details */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '10px',
          padding: '14px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '18px',
          fontSize: '0.75rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Action:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              {current.tool_name}()
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Transfer Value:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontWeight: 800, fontSize: '0.9rem' }}>
              ${Number(current.arguments?.amount || 0).toFixed(2)} USD
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Recipient Account:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: '#fff' }}>
              {current.arguments?.to_account || 'ACC-102'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Calculated Risk Score:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontWeight: 800 }}>
              {current.risk_score}/100
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onResolve(current.request_id, false)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid var(--accent-rose)',
              color: '#f87171',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <XCircle size={16} />
            <span>Reject & Block</span>
          </button>

          <button
            onClick={() => onResolve(current.request_id, true)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              color: '#030712',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)'
            }}
          >
            <CheckCircle2 size={16} />
            <span>Approve & Dispatch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
