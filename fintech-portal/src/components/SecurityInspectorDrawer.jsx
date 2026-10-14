import React from 'react';
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
  ExternalLink
} from 'lucide-react';

export default function SecurityInspectorDrawer({
  isOpen,
  onClose,
  latestEvent,
  auditBlocks,
  onVerifyLedger,
  verificationResult
}) {
  if (!isOpen) return null;

  const currentDisplay = latestEvent || {
    verdict: 'ALLOW',
    tool_name: 'get_account_balance',
    agent_id: 'agent-bank-01',
    role: 'BankingAssistant',
    risk_score: 5,
    cedar_decision: 'Decision.Allow',
    reason: 'Risk Score (5/100) within trusted baseline. Standing privilege denied, single-use ticket granted.',
    arguments: { account_id: 'ACC-101' },
    risk_factors: ['Base tool risk: +5', 'Agent role cleared: BankingAssistant'],
    execution_ticket_id: 'TICK-INIT-001'
  };

  const isBlocked = currentDisplay.verdict === 'DENY' || currentDisplay.verdict === 'BLOCKED';
  const isStepUp = currentDisplay.verdict === 'STEP_UP_REQUIRED';
  const riskColor = isBlocked ? '#f43f5e' : isStepUp ? '#f59e0b' : '#10b981';

  return (
    <aside style={{
      position: 'fixed',
      top: '70px',
      right: 0,
      bottom: 0,
      width: '420px',
      background: 'rgba(5, 8, 20, 0.94)',
      backdropFilter: 'blur(24px)',
      borderLeft: '1px solid var(--border-subtle)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-20px 0 50px rgba(0,0,0,0.8)'
    }}>
      {/* Drawer Header */}
      <div style={{
        padding: '18px 22px',
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
            <span style={{ fontSize: '0.62rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)' }}>
              NIST SP 800-207
            </span>
          </div>
          <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#fff', margin: '2px 0 0' }}>
            Zero-Trust Continuous Authorization
          </h3>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: 'var(--text-muted)',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Drawer Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Big Verdict Pill */}
        <div style={{
          padding: '14px 16px',
          borderRadius: '10px',
          background: isBlocked ? 'rgba(244, 63, 94, 0.12)' : isStepUp ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
          border: `1.5px solid ${riskColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isBlocked ? <ShieldAlert size={18} color="var(--accent-rose)" /> : <ShieldCheck size={18} color="var(--accent-emerald)" />}
              <span style={{ fontSize: '0.85rem', fontWeight: 900, color: riskColor }}>
                {isBlocked ? 'ACCESS DENIED' : isStepUp ? 'HITL STEP-UP REQUIRED' : 'ZERO-TRUST AUTHORIZED'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
              {currentDisplay.reason}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk Score</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: riskColor, lineHeight: 1 }}>
              {currentDisplay.risk_score}<span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/100</span>
            </div>
          </div>
        </div>

        {/* 4-Stage Security Inspection Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {/* Identity */}
          <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', marginBottom: '2px' }}>
              <Fingerprint size={13} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>Identity Claims</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {currentDisplay.role || 'BankingAssistant'}
            </div>
          </div>

          {/* AWS Cedar Engine */}
          <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,153,0,0.05)', border: '1px solid rgba(255,153,0,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff9900', marginBottom: '2px' }}>
              <Lock size={13} />
              <span style={{ fontSize: '0.68rem', fontWeight: 800 }}>AWS Cedar v4.12</span>
            </div>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              color: (currentDisplay.cedar_decision || '').includes('Deny') || isBlocked ? '#f87171' : '#34d399'
            }}>
              {currentDisplay.cedar_decision || (isBlocked ? 'Decision.Deny' : 'Decision.Allow')}
            </div>
          </div>

          {/* Blast Radius */}
          <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', marginBottom: '2px' }}>
              <Gauge size={13} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>Blast Radius</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
              {currentDisplay.risk_factors?.some(f => f.includes('VELOCITY') || f.includes('BLAST')) ? 'Trip Ceiling' : 'Nominal'}
            </div>
          </div>

          {/* Prompt Injection */}
          <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isBlocked ? 'var(--accent-rose)' : 'var(--accent-cyan)', marginBottom: '2px' }}>
              <ScanEye size={13} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>Prompt Integrity</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: isBlocked && currentDisplay.risk_factors?.some(f => f.includes('INJECTION')) ? '#f87171' : '#38bdf8' }}>
              {isBlocked && currentDisplay.risk_factors?.some(f => f.includes('INJECTION')) ? 'Adversarial Injection' : 'Clean Intent'}
            </div>
          </div>
        </div>

        {/* Parameters Inspected */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Intercepted Tool:</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{currentDisplay.tool_name}()</span>
          </div>
          <pre style={{ margin: 0, padding: '8px', background: 'rgba(0,0,0,0.4)', borderRadius: '6px', fontSize: '0.68rem', color: '#e2e8f0', fontFamily: 'var(--font-mono)', overflowX: 'auto' }}>
            {JSON.stringify(currentDisplay.arguments || {}, null, 2)}
          </pre>
        </div>

        {/* Factors Breakdown */}
        {currentDisplay.risk_factors && (
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Decision Factor Breakdown:
            </span>
            <ul style={{ margin: '0 0 0 16px', fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {currentDisplay.risk_factors.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Execution Nonce Ticket */}
        {currentDisplay.execution_ticket_id && (
          <div style={{
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            color: '#c084fc'
          }}>
            <Key size={14} style={{ flexShrink: 0 }} />
            <div>
              <span style={{ display: 'block', fontWeight: 800, color: '#e9d5ff' }}>Single-Use HMAC Nonce:</span>
              <span style={{ wordBreak: 'break-all' }}>{currentDisplay.execution_ticket_id}</span>
            </div>
          </div>
        )}

        {/* Audit Chain Verifier */}
        <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Merkle Ledger Chain
            </span>
            <button
              onClick={onVerifyLedger}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-cyan)',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Verify Cryptographic Chain
            </button>
          </div>

          {verificationResult && (
            <div style={{
              padding: '8px 10px',
              borderRadius: '6px',
              background: verificationResult.valid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              border: `1px solid ${verificationResult.valid ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`,
              fontSize: '0.68rem',
              color: verificationResult.valid ? '#34d399' : '#f87171'
            }}>
              {verificationResult.valid ? '✓ SHA-256 Chain 100% Intact' : '✗ Tampering Detected!'}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
