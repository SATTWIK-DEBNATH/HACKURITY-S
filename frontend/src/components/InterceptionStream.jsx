import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  Key,
  ChevronDown,
  ChevronUp,
  Radio,
  FileCode,
  Trash2
} from 'lucide-react';

export default function InterceptionStream({ events, onClearStream }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'ALLOW':
      case 'STEP_UP_COMPLETED':
      case 'STEP_UP_APPROVED':
        return (
          <span className="badge badge-allow">
            <ShieldCheck size={12} />
            <span>ALLOWED</span>
          </span>
        );
      case 'DENY':
      case 'STEP_UP_REJECTED':
      case 'BLOCKED':
        return (
          <span className="badge badge-deny">
            <ShieldAlert size={12} />
            <span>BLOCKED</span>
          </span>
        );
      case 'STEP_UP_REQUIRED':
        return (
          <span className="badge badge-stepup">
            <Clock size={12} />
            <span>STEP-UP</span>
          </span>
        );
      default:
        return <span className="badge badge-info">{verdict}</span>;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={18} color="var(--accent-cyan)" className="pulse-icon" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            Live Zero-Trust PEP Interception Stream
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            ({events.length} events)
          </span>
        </div>

        {events.length > 0 && (
          <button
            onClick={onClearStream}
            className="btn btn-ghost"
            style={{ fontSize: '0.7rem', padding: '4px 8px' }}
          >
            <Trash2 size={12} />
            <span>Clear Stream</span>
          </button>
        )}
      </div>

      {/* Stream List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
        {events.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', padding: '40px 20px', textAlign: 'center' }}>
            <Radio size={40} strokeWidth={1.2} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ fontSize: '0.85rem' }}>Awaiting agent tool invocations...</p>
            <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Click "Launch Test" on any scenario to observe continuous PDP interception.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {events.map((ev, index) => {
              const isExpanded = expandedId === index;
              const riskColor = ev.risk_score <= 30 ? 'var(--accent-emerald)' : ev.risk_score <= 80 ? 'var(--accent-amber)' : 'var(--accent-rose)';

              return (
                <motion.div
                  key={`${ev.audit_block_hash || index}-${index}`}
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card"
                  onClick={() => toggleExpand(index)}
                  style={{
                    padding: '14px 16px',
                    cursor: 'pointer',
                    borderLeft: `3px solid ${riskColor}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  {/* Row 1: Agent & Verdict */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
                        {ev.agent_id || 'AutonomousAgent'}
                      </span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                        {ev.role || 'Agent'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Risk:</span>
                        <strong style={{ color: riskColor }}>{ev.risk_score}/100</strong>
                      </div>
                      {getVerdictBadge(ev.verdict || ev.status)}
                    </div>
                  </div>

                  {/* Row 2: Tool & Args */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        ⚡ {ev.tool_name}()
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {JSON.stringify(ev.arguments || {})}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {ev.time_str || 'Just now'}
                    </span>
                  </div>

                  {/* Reason Snippet */}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {ev.reason}
                  </div>

                  {/* Expanded Details Accordion */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ marginTop: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}
                    >
                      {/* Risk Factors Breakdown */}
                      {ev.risk_factors && ev.risk_factors.length > 0 && (
                        <div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            Risk Factors Evaluated by PDP:
                          </span>
                          <ul style={{ margin: '4px 0 0 16px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {ev.risk_factors.map((f, fi) => (
                              <li key={fi} style={{ marginBottom: '2px' }}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Result or Execution Output */}
                      {ev.result && (
                        <div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent-emerald)', textTransform: 'uppercase' }}>
                            Protected Tool Execution Output:
                          </span>
                          <pre style={{ margin: '4px 0 0', padding: '8px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontSize: '0.72rem', color: '#a7f3d0', fontFamily: 'var(--font-mono)', overflowX: 'auto' }}>
                            {JSON.stringify(ev.result, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Execution Ticket Info */}
                      {ev.execution_ticket_id && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)' }}>
                          <Key size={13} />
                          <span>Single-Use Cryptographic Ticket: {ev.execution_ticket_id}</span>
                        </div>
                      )}

                      {/* Cryptographic Hash */}
                      {ev.audit_block_hash && (
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                          Ledger Block SHA-256: <code style={{ color: 'var(--text-secondary)' }}>{ev.audit_block_hash}</code>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
