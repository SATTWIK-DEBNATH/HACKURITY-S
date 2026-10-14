import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Key,
  ShieldAlert,
  Bot
} from 'lucide-react';

export default function StepUpApprovalModal({ pendingApprovals, onResolve }) {
  if (!pendingApprovals || pendingApprovals.length === 0) return null;

  const current = pendingApprovals[0];

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="glass-panel"
          style={{
            maxWidth: '560px',
            width: '100%',
            padding: '24px',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            boxShadow: '0 0 50px rgba(245, 158, 11, 0.3)',
            position: 'relative'
          }}
        >
          {/* Urgent Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-amber)',
                border: '1px solid rgba(245, 158, 11, 0.4)'
              }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Step-Up Dual-Custody Approval Required
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                  NIST SP 800-207 Gate &bull; ID: {current.request_id}
                </span>
              </div>
            </div>

            <span className="badge badge-stepup" style={{ fontSize: '0.75rem' }}>
              Risk: {current.risk_score}/100
            </span>
          </div>

          {/* Warning Banner */}
          <div style={{
            padding: '10px 14px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderLeft: '3px solid var(--accent-amber)',
            borderRadius: '4px',
            fontSize: '0.8rem',
            color: '#fef08a',
            marginBottom: '16px'
          }}>
            Autonomous agent reached continuous authorization ceiling. Sensitive action execution halted pending Human-In-The-Loop review.
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Requesting Agent</span>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
                {current.agent_id}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Role: {current.role}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target Action</span>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                {current.tool_name}()
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Session: {current.session_id}
              </div>
            </div>
          </div>

          {/* Action Arguments */}
          <div style={{ marginBottom: '14px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Action Parameters Inspected by PEP:
            </span>
            <pre style={{ margin: '4px 0 0', padding: '10px', background: 'rgba(0,0,0,0.5)', borderRadius: '6px', fontSize: '0.75rem', color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
              {JSON.stringify(current.arguments, null, 2)}
            </pre>
          </div>

          {/* Risk Factors */}
          {current.risk_factors && (
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Why Step-Up Was Triggered:
              </span>
              <ul style={{ margin: '4px 0 0 16px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {current.risk_factors.map((factor, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>{factor}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              className="btn btn-danger"
              onClick={() => onResolve(current.request_id, false)}
              style={{ padding: '9px 18px', fontSize: '0.82rem' }}
            >
              <XCircle size={15} />
              <span>Reject & Revoke</span>
            </button>

            <button
              className="btn btn-primary"
              onClick={() => onResolve(current.request_id, true)}
              style={{ padding: '9px 18px', fontSize: '0.82rem' }}
            >
              <CheckCircle2 size={15} />
              <span>Approve & Issue Cryptographic Ticket</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
