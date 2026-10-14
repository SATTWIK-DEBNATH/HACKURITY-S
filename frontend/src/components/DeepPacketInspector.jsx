import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ShieldX,
  Cpu,
  Lock,
  Unlock,
  KeyRound,
  Fingerprint,
  Gauge,
  ScanEye
} from 'lucide-react';

export default function DeepPacketInspector({ latestEvent }) {
  const ev = latestEvent || {
    tool_name: 'get_account_balance',
    agent_id: 'agent-bank-01',
    role: 'BankingAssistant',
    risk_score: 5,
    verdict: 'ALLOW',
    reason: 'Risk Score (5/100) within trusted baseline',
    arguments: { account_id: 'ACC-101' },
    risk_factors: ['Base tool risk: +5']
  };

  const isBlocked = ev.verdict === 'DENY' || ev.verdict === 'BLOCKED';
  const isStepUp = ev.verdict === 'STEP_UP_REQUIRED';

  const layers = [
    {
      title: '1. Workload Attestation',
      badge: 'JWT VERIFIED',
      desc: 'Cryptographic signature & Agent-WID verified',
      status: 'pass',
      icon: <Fingerprint size={16} />
    },
    {
      title: '2. ABAC Least-Privilege',
      badge: isBlocked ? 'ROLE FORBIDDEN' : 'PERMITTED',
      desc: isBlocked ? `Role '${ev.role}' lacks tool clearance` : `Role cleared for ${ev.tool_name}()`,
      status: isBlocked ? 'fail' : 'pass',
      icon: <Lock size={16} />
    },
    {
      title: '3. Cumulative Blast Radius',
      badge: ev.risk_factors?.some(f => f.includes('VELOCITY') || f.includes('BLAST')) ? 'VELOCITY BREACH' : 'NORMAL (1.2 op/m)',
      desc: 'Cumulative frequency & dollar volume tracking',
      status: ev.risk_factors?.some(f => f.includes('VELOCITY') || f.includes('BLAST')) ? 'warn' : 'pass',
      icon: <Gauge size={16} />
    },
    {
      title: '4. Prompt Injection Scanner',
      badge: isBlocked && ev.risk_factors?.some(f => f.includes('INJECTION')) ? 'THREAT DETECTED' : 'CLEAR',
      desc: 'Adversarial jailbreak heuristics & parameter drift',
      status: isBlocked && ev.risk_factors?.some(f => f.includes('INJECTION')) ? 'fail' : 'pass',
      icon: <ScanEye size={16} />
    },
    {
      title: '5. JIT Ticket Dispatch',
      badge: isBlocked ? 'DENIED / REVOKED' : isStepUp ? 'STEP-UP HELD' : 'HMAC TICKET MINTED',
      desc: isBlocked ? 'Non-bypassable sandbox rejected action' : isStepUp ? 'Awaiting supervisor signature' : 'Single-use execution nonce issued',
      status: isBlocked ? 'fail' : isStepUp ? 'warn' : 'pass',
      icon: <KeyRound size={16} />
    }
  ];

  return (
    <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={19} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Continuous Deep Packet Inspection (DPI) Gateway
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Target:</span>
          <strong style={{ color: 'var(--accent-amber)' }}>{ev.tool_name}()</strong>
          <span className={`badge ${isBlocked ? 'badge-deny' : isStepUp ? 'badge-stepup' : 'badge-allow'}`} style={{ fontSize: '0.65rem' }}>
            {ev.verdict || 'STANDBY'}
          </span>
        </div>
      </div>

      {/* 5-Stage Visual Security Pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
        {layers.map((layer, idx) => {
          const isPass = layer.status === 'pass';
          const isFail = layer.status === 'fail';
          const isWarn = layer.status === 'warn';

          const accentColor = isFail ? 'var(--accent-rose)' : isWarn ? 'var(--accent-amber)' : 'var(--accent-emerald)';
          const bgColor = isFail ? 'rgba(244, 63, 94, 0.12)' : isWarn ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.08)';
          const borderColor = isFail ? 'rgba(244, 63, 94, 0.45)' : isWarn ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.3)';

          return (
            <motion.div
              key={idx}
              whileHover={{ y: -2 }}
              style={{
                background: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                padding: '12px 10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '120px',
                position: 'relative'
              }}
            >
              {/* Top Row: Icon + Mini LED */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ color: accentColor }}>
                  {layer.icon}
                </div>
                <div style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: accentColor,
                  boxShadow: `0 0 8px ${accentColor}`
                }} />
              </div>

              {/* Title & Badge */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {layer.title}
                </div>
                <div style={{
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: accentColor,
                  background: 'rgba(0,0,0,0.3)',
                  padding: '2px 5px',
                  borderRadius: '3px',
                  display: 'inline-block',
                  marginBottom: '4px'
                }}>
                  {layer.badge}
                </div>
              </div>

              {/* Description */}
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', lineHeight: '1.25' }}>
                {layer.desc}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
