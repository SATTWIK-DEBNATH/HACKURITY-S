import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Key,
  FileCode,
  Search,
  Filter
} from 'lucide-react';

export default function TransactionLedger({ transactions, onInspectTransaction }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'SETTLED' | 'BLOCKED' | 'STEP_UP'

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'SETTLED') return tx.verdict === 'ALLOW' || tx.verdict === 'STEP_UP_APPROVED';
    if (filter === 'BLOCKED') return tx.verdict === 'DENY' || tx.verdict === 'BLOCKED';
    if (filter === 'STEP_UP') return tx.verdict === 'STEP_UP_REQUIRED';
    return true;
  });

  return (
    <div className="fintech-card" style={{ padding: '22px' }}>
      {/* Header and Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Settlement History
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: '2px 0 0' }}>
            Protected Autonomous Transactions
          </h3>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.03)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          {[
            { id: 'ALL', label: 'All Activity' },
            { id: 'SETTLED', label: 'Settled' },
            { id: 'BLOCKED', label: 'Blocked Attacks' },
            { id: 'STEP_UP', label: 'Dual-Custody' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                background: filter === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: filter === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: filter === tab.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            No transactions match this filter. Try executing a scenario in the sandbox above!
          </div>
        ) : (
          filteredTransactions.map((tx, idx) => {
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
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: isBlocked
                    ? 'rgba(244, 63, 94, 0.03)'
                    : isStepUp
                    ? 'rgba(245, 158, 11, 0.03)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${
                    isBlocked
                      ? 'rgba(244, 63, 94, 0.2)'
                      : isStepUp
                      ? 'rgba(245, 158, 11, 0.2)'
                      : 'var(--border-subtle)'
                  }`,
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                {/* Left: Icon & Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: isBlocked
                      ? 'rgba(244, 63, 94, 0.12)'
                      : isStepUp
                      ? 'rgba(245, 158, 11, 0.12)'
                      : 'rgba(56, 189, 248, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {isBlocked ? (
                      <ShieldAlert size={17} color="#fb7185" />
                    ) : isStepUp ? (
                      <Clock size={17} color="#fbbf24" />
                    ) : (
                      <ArrowUpRight size={17} color="#38bdf8" />
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                      {tx.description}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <span>{tx.time_str || 'Today'}</span>
                      <span>&bull;</span>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{tx.tool_name}()</span>
                      {tx.ticket_id && (
                        <>
                          <span>&bull;</span>
                          <span style={{ color: 'var(--accent-cyan)' }}>Ticket {tx.ticket_id.slice(0, 10)}...</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Status Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {tx.amount > 0 && (
                    <div style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      color: isBlocked ? 'var(--text-muted)' : '#ffffff',
                      textDecoration: isBlocked ? 'line-through' : 'none'
                    }}>
                      -${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  )}

                  <span className={`badge-status ${isBlocked ? 'badge-blocked' : isStepUp ? 'badge-stepup' : 'badge-allowed'}`}>
                    {isBlocked ? '✕ Intercepted' : isStepUp ? '⚠ Dual-Custody' : '✓ Settled'}
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
