import React from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, Bell, ArrowRightLeft, Lock, ExternalLink } from 'lucide-react';

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
      height: '70px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(5, 8, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px'
    }}>
      {/* Brand & Bank Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 50%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
        }}>
          <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#030712', fontFamily: 'var(--font-mono)' }}>A</span>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
              APEX TREASURY
            </h1>
            <span style={{
              fontSize: '0.62rem',
              padding: '2px 7px',
              borderRadius: '9999px',
              background: 'rgba(0, 242, 254, 0.12)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              fontWeight: 700
            }}>
              PRIVATE BANK
            </span>
          </div>
          <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>
            Meridian Dynamics Corp &bull; Account ACC-101
          </p>
        </div>
      </div>

      {/* Middle: SentinAgent Continuous Protection Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(17, 24, 54, 0.6)',
        padding: '6px 14px',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isAlert ? '#f43f5e' : isStepUp ? '#f59e0b' : '#10b981',
            boxShadow: `0 0 10px ${isAlert ? '#f43f5e' : isStepUp ? '#f59e0b' : '#10b981'}`
          }} />
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            ZTA Continuous Authorization:
          </span>
        </div>

        <span style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          color: isAlert ? '#f87171' : isStepUp ? '#fbbf24' : '#34d399'
        }}>
          {latestSecurityEvent ? (latestSecurityEvent.verdict || 'ACTIVE (0 STANDING PRIVILEGE)') : 'ACTIVE (0 STANDING PRIVILEGE)'}
        </span>

        <span style={{ fontSize: '0.68rem', color: '#ff9900', fontWeight: 700, borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '8px' }}>
          AWS Cedar v4.12
        </span>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onOpenTransferModal}
          className="btn-primary"
          style={{ padding: '8px 14px', fontSize: '0.78rem' }}
        >
          <ArrowRightLeft size={14} />
          <span>New Wire Transfer</span>
        </button>

        {/* Toggle Security Inspector Drawer */}
        <button
          onClick={() => setSecurityDrawerOpen(!securityDrawerOpen)}
          style={{
            background: securityDrawerOpen ? 'rgba(0, 242, 254, 0.18)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${securityDrawerOpen ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
            color: securityDrawerOpen ? 'var(--accent-cyan)' : 'var(--text-primary)',
            padding: '8px 14px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 700,
            transition: 'all 0.2s ease'
          }}
        >
          {isAlert ? <ShieldAlert size={15} color="#f43f5e" /> : <ShieldCheck size={15} color="var(--accent-cyan)" />}
          <span>SentinAgent ZTA Inspector</span>
        </button>

        {/* User Avatar */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1e293b, #334155)',
          border: '1.5px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '0.8rem',
          color: '#f8fafc'
        }}>
          AS
        </div>
      </div>
    </header>
  );
}
