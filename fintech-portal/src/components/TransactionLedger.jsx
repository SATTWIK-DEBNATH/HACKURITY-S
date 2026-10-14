import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Key,
  FileCode
} from 'lucide-react';

export default function TransactionLedger({ transactions, onInspectTransaction }) {
  return (
    <div className="fintech-glass" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Real-Time Settlement Ledger
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
            Protected Transactions & Invocations
          </h3>
        </div>

        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          Continuous NIST SP 800-207 Verification
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            No recent activity recorded yet. Use the transfer modal or AI Copilot to execute actions!
          </div>
        ) : (
          transactions.map((tx, idx) => {
            const isBlocked = tx.verdict === 'DENY' || tx.verdict === 'BLOCKED';
            const isStepUp = tx.verdict === 'STEP_UP_REQUIRED';
            const isAllowed = tx.verdict === 'ALLOW' || tx.verdict === 'STEP_UP_APPROVED';

            return (
              <div
                key={tx.id || idx}
                onClick={() => onInspectTransaction && onInspectTransaction(tx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: isBlocked
                    ? 'rgba(244, 63, 94, 0.05)'
                    : isStepUp
                    ? 'rgba(245, 158, 11, 0.05)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isBlocked ? 'rgba(244, 63, 94, 0.2)' : isStepUp ? 'rgba(245, 158, 11, 0.2)' : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                {/* Left: Icon & Description */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: isBlocked
                      ? 'rgba(244, 63, 94, 0.15)'
                      : isStepUp
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isBlocked ? '#f87171' : isStepUp ? '#fbbf24' : '#34d399'
                  }}>
                    {isBlocked ? <ShieldAlert size={18} /> : isStepUp ? <Clock size={18} /> : <ArrowUpRight size={18} />}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                      {tx.description || tx.tool_name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      Counterparty: {tx.to_account || tx.counterparty || 'Core Ledger'} &bull; {tx.time_str || 'Just now'}
                    </div>
                  </div>
                </div>

                {/* Middle: SentinAgent Verification Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isAllowed && (
                    <span className="badge-status badge-allowed">
                      <ShieldCheck size={12} /> Cedar Permitted
                    </span>
                  )}
                  {isStepUp && (
                    <span className="badge-status badge-stepup">
                      <Clock size={12} /> HITL Dual-Custody Held
                    </span>
                  )}
                  {isBlocked && (
                    <span className="badge-status badge-blocked">
                      <ShieldAlert size={12} /> ZTA Blocked
                    </span>
                  )}

                  {tx.ticket_id && (
                    <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)', background: 'rgba(139, 92, 246, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      {tx.ticket_id.substring(0, 10)}...
                    </span>
                  )}
                </div>

                {/* Right: Amount */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: isBlocked ? '#64748b' : '#f8fafc'
                  }}>
                    {isBlocked ? '[BLOCKED]' : `-$${Number(tx.amount || 0).toFixed(2)}`}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    Risk: {tx.risk_score || 0}/100
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
