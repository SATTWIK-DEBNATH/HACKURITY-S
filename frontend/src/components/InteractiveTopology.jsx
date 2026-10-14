import React, { useState, useEffect } from 'react';

export default function InteractiveTopology({ latestEvent }) {
  const [animationState, setAnimationState] = useState('idle'); // 'idle' | 'in_flight' | 'evaluating' | 'allowed' | 'blocked' | 'step_up'
  const [packetDetails, setPacketDetails] = useState(null);

  useEffect(() => {
    if (!latestEvent) return;

    setPacketDetails(latestEvent);
    setAnimationState('in_flight');

    const t1 = setTimeout(() => {
      setAnimationState('evaluating');
    }, 450);

    const t2 = setTimeout(() => {
      if (latestEvent.verdict === 'ALLOW' || latestEvent.verdict === 'STEP_UP_APPROVED') {
        setAnimationState('allowed');
      } else if (latestEvent.verdict === 'DENY' || latestEvent.verdict === 'BLOCKED') {
        setAnimationState('blocked');
      } else if (latestEvent.verdict === 'STEP_UP_REQUIRED') {
        setAnimationState('step_up');
      }
    }, 950);

    const t3 = setTimeout(() => {
      setAnimationState('idle');
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [latestEvent]);

  return (
    <div className="glass-panel" style={{
      margin: '0 24px 20px',
      padding: '18px 24px',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(0, 242, 254, 0.25)',
      boxShadow: '0 0 35px rgba(0, 242, 254, 0.08)'
    }}>
      {/* Background Cyber Circuit Glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at 50% 20%, rgba(0, 242, 254, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: animationState === 'blocked' ? 'var(--accent-rose)' : animationState === 'step_up' ? 'var(--accent-amber)' : 'var(--accent-cyan)',
            boxShadow: `0 0 12px ${animationState === 'blocked' ? 'var(--accent-rose)' : animationState === 'step_up' ? 'var(--accent-amber)' : 'var(--accent-cyan)'}`
          }} />
          <h2 style={{ fontSize: '0.88rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
            Dynamic Zero-Trust Packet Inspection & Flow Topology
          </h2>
        </div>

        {/* Live Packet Status Chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {animationState !== 'idle' && packetDetails && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              background: animationState === 'blocked' ? 'rgba(244, 63, 94, 0.2)' : animationState === 'allowed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 242, 254, 0.2)',
              border: `1px solid ${animationState === 'blocked' ? 'var(--accent-rose)' : animationState === 'allowed' ? 'var(--accent-emerald)' : 'var(--accent-cyan)'}`,
              color: animationState === 'blocked' ? '#fda4af' : animationState === 'allowed' ? '#6ee7b7' : '#67e8f9',
              animation: 'pulse 1s infinite'
            }}>
              <span>Packet: {packetDetails.tool_name}()</span>
              <span>&bull;</span>
              <span>State: {animationState.toUpperCase()}</span>
            </div>
          )}
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            NIST SP 800-207 Interception Fabric
          </span>
        </div>
      </div>

      {/* Visual Interactive Flow Canvas (SVG Node Network) */}
      <div style={{ position: 'relative', width: '100%', height: '140px', background: 'rgba(3, 7, 18, 0.4)', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
        
        {/* SVG Connecting Cables */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
          <defs>
            <linearGradient id="cableGradCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.2)" />
              <stop offset="50%" stopColor="rgba(0, 242, 254, 0.8)" />
              <stop offset="100%" stopColor="rgba(56, 189, 248, 0.2)" />
            </linearGradient>
            <filter id="laserGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Static connection lines */}
          <line x1="120" y1="70" x2="260" y2="70" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="360" y1="70" x2="520" y2="70" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="660" y1="70" x2="820" y2="70" stroke="rgba(255,255,255,0.12)" strokeWidth="2" strokeDasharray="4 4" />

          {/* Animated In-Flight Particle */}
          {animationState === 'in_flight' && (
            <circle cx="200" cy="70" r="6" fill="#00f2fe" filter="url(#laserGlow)">
              <animate attributeName="cx" from="100" to="580" dur="0.45s" repeatCount="1" />
            </circle>
          )}

          {/* Animated Allowed Packet crossing into vault */}
          {animationState === 'allowed' && (
            <circle cx="740" cy="70" r="7" fill="#10b981" filter="url(#laserGlow)">
              <animate attributeName="cx" from="600" to="900" dur="0.5s" repeatCount="1" />
            </circle>
          )}

          {/* Blocked Shockwave Animation */}
          {animationState === 'blocked' && (
            <circle cx="590" cy="70" r="28" fill="none" stroke="#f43f5e" strokeWidth="3" opacity="0.8">
              <animate attributeName="r" from="10" to="55" dur="0.6s" repeatCount="1" />
              <animate attributeName="opacity" from="1" to="0" dur="0.6s" repeatCount="1" />
            </circle>
          )}
        </svg>

        {/* Node 1: Untrusted Request / Prompts */}
        <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '90px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(244,63,94,0.15) 0%, rgba(225,29,72,0.3) 100%)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            boxShadow: '0 0 20px rgba(244, 63, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fb7185'
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>Untrusted Source</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Ticket / Email / User</div>
          </div>
        </div>

        {/* Node 2: Autonomous Agent Swarm (Workload Identity) */}
        <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(14,165,233,0.3) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="18" x="3" y="3" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <circle cx="15.5" cy="8.5" r="1.5"/>
              <path d="M9 15h6"/>
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>AI Agent Swarm</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>Agent-WID Signed</div>
          </div>
        </div>

        {/* Node 3: SentinAgent PEP + PDP Core (The Center of Defense) */}
        <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '140px' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '16px',
            background: animationState === 'blocked'
              ? 'linear-gradient(135deg, rgba(244,63,94,0.3) 0%, rgba(225,29,72,0.5) 100%)'
              : animationState === 'allowed'
              ? 'linear-gradient(135deg, rgba(16,185,129,0.3) 0%, rgba(5,150,105,0.5) 100%)'
              : animationState === 'step_up'
              ? 'linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(217,119,6,0.5) 100%)'
              : 'linear-gradient(135deg, rgba(0,242,254,0.2) 0%, rgba(79,172,254,0.4) 100%)',
            border: `2px solid ${
              animationState === 'blocked' ? 'var(--accent-rose)'
              : animationState === 'allowed' ? 'var(--accent-emerald)'
              : animationState === 'step_up' ? 'var(--accent-amber)'
              : 'var(--accent-cyan)'
            }`,
            boxShadow: `0 0 30px ${
              animationState === 'blocked' ? 'rgba(244, 63, 94, 0.4)'
              : animationState === 'allowed' ? 'rgba(16, 185, 129, 0.4)'
              : 'rgba(0, 242, 254, 0.4)'
            }`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            transition: 'all 0.3s ease'
          }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              {animationState === 'blocked' ? (
                <path d="m15 9-6 6 M9 9l6 6" stroke="var(--accent-rose)" strokeWidth="3"/>
              ) : animationState === 'allowed' ? (
                <path d="m9 12 2 2 4-4" stroke="var(--accent-emerald)" strokeWidth="3"/>
              ) : (
                <path d="M12 8v4 M12 16h.01"/>
              )}
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              SentinAgent Gateway
            </div>
            <div style={{ fontSize: '0.62rem', color: '#67e8f9', fontFamily: 'var(--font-mono)' }}>
              PEP Interceptor &bull; PDP
            </div>
          </div>
        </div>

        {/* Node 4: Continuous PDP Decision Engines (Sub-card) */}
        <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(147,51,234,0.3) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c084fc'
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>Risk & ABAC Matrix</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Velocity & Blast Radius</div>
          </div>
        </div>

        {/* Node 5: Protected Core Resources (Vault) */}
        <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '100px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.3) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34d399'
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>Protected Core</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Bank API & PII Vault</div>
          </div>
        </div>

      </div>
    </div>
  );
}
