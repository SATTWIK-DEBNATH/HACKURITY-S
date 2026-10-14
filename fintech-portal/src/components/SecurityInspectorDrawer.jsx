import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Fingerprint,
  Gauge,
  ScanEye,
  FileText,
  Database,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function SecurityInspectorDrawer({
  isOpen,
  onClose,
  latestEvent,
  auditBlocks,
  onVerifyLedger,
  verificationResult
}) {
  const [activeTab, setActiveTab] = useState('decision'); // 'decision' | 'cedar' | 'merkle'

  if (!isOpen) return null;

  const currentDisplay = latestEvent || {
    verdict: 'ALLOW',
    tool_name: 'transfer_funds',
    agent_id: 'agent-treasury-01',
    role: 'TransactionExecutionAgent',
    risk_score: 15,
    cedar_decision: 'Decision.Allow',
    reason: 'Risk Score (15/100) within autonomous baseline. Single-use ticket issued.',
    arguments: { from_account: 'ACC-101', to_account: 'ACC-102', amount: 250 },
    risk_factors: ['Base tool risk: +15', 'Agent role cleared: TransactionExecutionAgent'],
    execution_ticket: {
      ticket_id: 'TICK-E7B73F99CE16',
      hmac_sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      expires_in_seconds: 30
    }
  };

  const isBlocked = currentDisplay.verdict === 'DENY' || currentDisplay.verdict === 'BLOCKED';
  const isStepUp = currentDisplay.verdict === 'STEP_UP_REQUIRED';
  const riskColor = isBlocked ? '#f43f5e' : isStepUp ? '#f59e0b' : '#10b981';

  return (
    <>
      {/* Dimmed Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 90,
          transition: 'opacity 0.2s ease'
        }}
      />

      {/* Slide-out Drawer */}
      <aside style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '460px',
        maxWidth: '90vw',
        background: '#0a0e1a',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                SENTINAGENT CONTROL PLANE
              </span>
              <span style={{ fontSize: '0.62rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)' }}>
                NIST SP 800-207
              </span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0' }}>
              Zero-Trust Continuous Authorization
            </h3>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: 'var(--text-muted)',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', padding: '10px 20px', borderBottom: '1px solid var(--border-subtle)', gap: '6px' }}>
          {[
            { id: 'decision', label: '1. Verdict & Risk' },
            { id: 'cedar', label: '2. AWS Cedar Policy' },
            { id: 'merkle', label: '3. Merkle Audit' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '7px 0',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: activeTab === tab.id ? 700 : 500,
                background: activeTab === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeTab === 'decision' && (
            <>
              {/* Verdict Banner */}
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                background: isBlocked ? 'rgba(244, 63, 94, 0.1)' : isStepUp ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                border: `1px solid ${isBlocked ? 'rgba(244, 63, 94, 0.3)' : isStepUp ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: riskColor }}>
                    {currentDisplay.verdict === 'ALLOW' ? 'DECISION: PERMIT' : currentDisplay.verdict === 'STEP_UP_REQUIRED' ? 'DECISION: DUAL-CUSTODY STEP-UP' : 'DECISION: FORBID (DENIED)'}
                  </span>
                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#ffffff', fontWeight: 700 }}>
                    Score: {currentDisplay.risk_score || 0}/100
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#e2e8f0', margin: '8px 0 0', lineHeight: '1.4' }}>
                  {currentDisplay.reason}
                </p>
              </div>

              {/* Tool & Principal Details */}
              <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Invocation Context
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '8px', fontSize: '0.75rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Agent Role</span>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>{currentDisplay.role || 'AutonomousAgent'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>Target Tool</span>
                    <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{currentDisplay.tool_name}()</span>
                  </div>
                </div>
              </div>

              {/* Single Use Ticket */}
              {currentDisplay.execution_ticket && (
                <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.06)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                    <Key size={14} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Single-Use HMAC Execution Ticket</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#ffffff', wordBreak: 'break-all' }}>
                    {currentDisplay.execution_ticket.ticket_id}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                    PEP Sandboxed: Ticket automatically invalidated after 30 seconds or upon execution.
                  </span>
                </div>
              )}
            </>
          )}

          {activeTab === 'cedar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f97316' }}>
                  AWS Cedar v4.12 Strict Default-Deny
                </span>
                <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  Automated formal verification engine. No requests are permitted unless matching an explicit permit AST rule.
                </p>
              </div>

              <div style={{
                background: '#040711',
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: '#38bdf8',
                lineHeight: '1.5',
                overflowX: 'auto'
              }}>
                <pre style={{ margin: 0 }}>{`// AWS Cedar Formal Policy Active:
permit (
  principal in Role::"TransactionExecutionAgent",
  action == Action::"execute_action",
  resource in ResourceType::"financial_api"
) when {
  context.risk_score <= 40 &&
  context.amount <= 500
};

forbid (
  principal,
  action,
  resource in ResourceType::"database"
) when {
  context.operation in ["drop_table", "truncate"]
};`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'merkle' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>SHA-256 Merkle Chain</span>
                <button onClick={onVerifyLedger} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.68rem' }}>
                  Verify Integrity
                </button>
              </div>

              {verificationResult && (
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: verificationResult.valid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                  color: verificationResult.valid ? '#34d399' : '#fb7185',
                  fontSize: '0.72rem'
                }}>
                  {verificationResult.valid ? '✓ Complete audit chain verified intact from Genesis!' : '✗ Tampering detected!'}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
                {auditBlocks.map(b => (
                  <div key={b.index} style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c084fc', fontWeight: 700 }}>
                      <span>BLOCK #{b.index} &bull; {b.event?.verdict || 'INITIALIZED'}</span>
                      <span style={{ color: 'var(--text-muted)' }}>Risk: {b.event?.risk_score || 0}</span>
                    </div>
                    <div style={{ color: 'var(--accent-cyan)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Hash: {b.block_hash}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
