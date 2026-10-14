import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Volume2,
  VolumeX,
  FileSpreadsheet,
  CheckCircle2,
  Activity,
  Layers,
  Lock
} from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';

export default function LiquidNavbar({ isConnected, stats, onVerifyLedger, onExportAudit }) {
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const toggleAudio = () => {
    cyberAudio.muted = !isAudioMuted;
    setIsAudioMuted(!isAudioMuted);
    if (isAudioMuted) {
      cyberAudio.playClick();
    }
  };

  const handleVerify = () => {
    cyberAudio.playClick();
    onVerifyLedger();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.12 },
      colors: ['#00f2fe', '#10b981', '#38bdf8']
    });
  };

  return (
    <header style={{
      margin: '16px 24px 14px',
      padding: '12px 20px',
      background: 'rgba(10, 15, 29, 0.75)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative',
      zIndex: 10,
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
    }}>
      {/* Brand & Zero-Trust Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #00f2fe 0%, #38bdf8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#040711',
          boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
        }}>
          <ShieldCheck size={22} strokeWidth={2.4} />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
              SENTINAGENT
            </h1>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(0, 242, 254, 0.15)',
              color: '#38bdf8',
              border: '1px solid rgba(0, 242, 254, 0.35)'
            }}>
              ZERO-TRUST PDP/PEP
            </span>
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              fontFamily: 'var(--font-mono)',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.35)'
            }}>
              NIST SP 800-207
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Continuous Authorization Policy Engine for Autonomous AI Workflows
          </p>
        </div>
      </div>

      {/* Center Minimal Metric Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={13} color="var(--accent-cyan)" />
          <span style={{ color: 'var(--text-muted)' }}>Intercepted:</span>
          <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{stats.total_intercepted ?? 0}</strong>
        </div>

        <div style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#10b981' }}>●</span>
          <span style={{ color: 'var(--text-muted)' }}>Allowed:</span>
          <strong style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>{stats.allowed_count ?? 0}</strong>
        </div>

        <div style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#f43f5e' }}>●</span>
          <span style={{ color: 'var(--text-muted)' }}>Blocked:</span>
          <strong style={{ color: '#fb7185', fontFamily: 'var(--font-mono)' }}>{stats.blocked_count ?? 0}</strong>
        </div>

        <div style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#f59e0b' }}>●</span>
          <span style={{ color: 'var(--text-muted)' }}>Step-Up:</span>
          <strong style={{ color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>{stats.step_up_count ?? 0}</strong>
        </div>

        <div style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={13} color="var(--accent-purple)" />
          <span style={{ color: 'var(--text-muted)' }}>Audit Height:</span>
          <strong style={{ color: '#c084fc', fontFamily: 'var(--font-mono)' }}>{stats.ledger_height ?? 1} blocks</strong>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={toggleAudio}
          className="btn btn-ghost"
          style={{ padding: '6px 10px', fontSize: '0.72rem' }}
          title={isAudioMuted ? "Enable audio FX" : "Mute audio"}
        >
          {isAudioMuted ? <VolumeX size={14} color="var(--text-muted)" /> : <Volume2 size={14} color="var(--accent-cyan)" />}
          <span>{isAudioMuted ? "Muted" : "Audio FX"}</span>
        </button>

        <button
          onClick={onExportAudit}
          className="btn btn-ghost"
          style={{ padding: '6px 11px', fontSize: '0.72rem', border: '1px solid rgba(0, 242, 254, 0.3)' }}
          title="Download compliance audit JSON"
        >
          <FileSpreadsheet size={14} />
          <span>Audit JSON</span>
        </button>

        <button
          onClick={handleVerify}
          className="btn btn-primary"
          style={{ padding: '6px 14px', fontSize: '0.75rem' }}
        >
          <CheckCircle2 size={14} />
          <span>Verify Hash Chain</span>
        </button>
      </div>
    </header>
  );
}
