import React from 'react';

export default function AgentTopology({ activeScenario }) {
  return (
    <div className="glass-panel" style={{ padding: '16px 20px', margin: '0 24px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent-cyan)' }}>
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Zero-Trust Architectural Interception Pipeline
          </h3>
        </div>

        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Standing Privileges: <strong style={{ color: 'var(--accent-rose)' }}>ELIMINATED</strong> • Continuous Verification: <strong style={{ color: 'var(--accent-emerald)' }}>ACTIVE</strong>
        </span>
      </div>

      {/* Pipeline Diagram */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1.3fr auto 1.4fr auto 1fr',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        background: 'rgba(0,0,0,0.25)',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
        overflowX: 'auto'
      }}>
        {/* Node 1: Untrusted Inputs */}
        <div className="glass-card" style={{ padding: '12px', textAlign: 'center', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-rose)', fontWeight: 600 }}>UNTRUSTED INPUT</div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: '4px' }}>User / Adversary</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>Tickets, PDFs, Prompt Injections</div>
        </div>

        {/* Arrow */}
        <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', textAlign: 'center' }}>→</div>

        {/* Node 2: Autonomous Agent Swarm */}
        <div className="glass-card" style={{ padding: '12px', textAlign: 'center', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-blue)', fontWeight: 600 }}>WORKLOAD IDENTITY</div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: '4px' }}>Autonomous AI Agent</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>Ephemeral Signed JWT Claims</div>
        </div>

        {/* Arrow */}
        <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', textAlign: 'center' }}>→</div>

        {/* Node 3: SentinAgent PEP + PDP Core (The Star of the Show!) */}
        <div className="glass-card" style={{
          padding: '12px',
          textAlign: 'center',
          background: 'rgba(0, 242, 254, 0.08)',
          border: '1px solid rgba(0, 242, 254, 0.4)',
          boxShadow: '0 0 15px rgba(0, 242, 254, 0.15)'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 800 }}>SENTINAGENT GATEWAY</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'white', marginTop: '2px' }}>PEP Interceptor + PDP Engine</div>
          <div style={{ fontSize: '0.65rem', color: '#67e8f9', marginTop: '4px' }}>
            ABAC Rules • Blast Radius • HITL Step-Up • Hash Chain
          </div>
        </div>

        {/* Arrow */}
        <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', textAlign: 'center' }}>→</div>

        {/* Node 4: Protected Target Tools */}
        <div className="glass-card" style={{ padding: '12px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>PROTECTED RESOURCES</div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: '4px' }}>Protected APIs & DB</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>Executed only with signed ticket</div>
        </div>
      </div>
    </div>
  );
}
