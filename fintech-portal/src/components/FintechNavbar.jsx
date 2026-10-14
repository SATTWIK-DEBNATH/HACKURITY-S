import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, Send, Bell, Lock, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function FintechNavbar({
  securityDrawerOpen,
  setSecurityDrawerOpen,
  latestSecurityEvent,
  onOpenTransferModal
}) {
  const isAlert = latestSecurityEvent?.verdict === 'DENY' || latestSecurityEvent?.verdict === 'BLOCKED';
  const isStepUp = latestSecurityEvent?.verdict === 'STEP_UP_REQUIRED';

  return (
    <header style={{
      height: '68px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 10, 19, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px'
    }}>
      {/* Brand & Bank Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(56, 189, 248, 0.3)'
          }}>
            <span style={{ fontWeight: 900, fontSize: '1rem', color: '#ffffff' }}>A</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                APEX TREASURY
              </span>
              <span style={{
                fontSize: '0.62rem',
                padding: '2px 6px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.1)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}>
                PRIVATE BANK
              </span>
            </div>
          </div>
        </div>

        {/* Minimalist Account Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
          <span style={{ fontWeight: 600, color: '#f1f5f9' }}>Meridian Dynamics Corp</span>
          <span style={{ color: 'var(--text-muted)' }}>&bull; ACC-101</span>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)', marginLeft: '2px' }} />
        </div>
      </div>

      {/* Middle / Right: Clean Live Status & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '9999px',
          background: isAlert
            ? 'rgba(244, 63, 94, 0.1)'
            : isStepUp
            ? 'rgba(245, 158, 11, 0.1)'
            : 'rgba(16, 185, 129, 0.08)',
          border: `1px solid ${
            isAlert
              ? 'rgba(244, 63, 94, 0.3)'
              : isStepUp
              ? 'rgba(245, 158, 11, 0.3)'
              : 'rgba(16, 185, 129, 0.25)'
          }`
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: isAlert ? '#f43f5e' : isStepUp ? '#f59e0b' : '#10b981',
            boxShadow: `0 0 8px ${isAlert ? '#f43f5e' : isStepUp ? '#f59e0b' : '#10b981'}`
          }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isAlert ? '#fb7185' : isStepUp ? '#fbbf24' : '#34d399' }}>
            {isAlert ? 'Threat Intercepted' : isStepUp ? 'Dual-Custody Required' : 'SentinAgent Protected'}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '8px' }}>
            AWS Cedar v4.12
          </span>
        </div>

        {/* Send Wire Button */}
        <button onClick={onOpenTransferModal} className="btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
          <Send size={13} />
          <span>Send Wire</span>
        </button>

        {/* Inspector Toggle */}
        <button
          onClick={() => setSecurityDrawerOpen(!securityDrawerOpen)}
          className="btn-secondary"
          style={{
            padding: '8px 14px',
            fontSize: '0.82rem',
            background: securityDrawerOpen ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.05)',
            borderColor: securityDrawerOpen ? 'var(--accent-cyan)' : 'var(--border-subtle)'
          }}
        >
          <ShieldCheck size={14} color="var(--accent-cyan)" />
          <span>Security Inspector</span>
        </button>

        {/* User Avatar */}
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#f8fafc',
          cursor: 'pointer'
        }}>
          AS
        </div>
      </div>
    </header>
  );
}
