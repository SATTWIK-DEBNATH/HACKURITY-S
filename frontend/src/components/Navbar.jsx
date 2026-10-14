import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Volume2,
  VolumeX,
  FileSpreadsheet,
  CheckCircle2,
  Zap,
  Activity
} from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';

export default function Navbar({ isConnected, onVerifyLedger, stats, onExportAudit }) {
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const toggleAudio = () => {
    cyberAudio.muted = !isAudioMuted;
    setIsAudioMuted(!isAudioMuted);
    if (isAudioMuted) {
      cyberAudio.playClick();
    }
  };

  const handleVerifyWithConfetti = () => {
    cyberAudio.playClick();
    onVerifyLedger();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.15 },
      colors: ['#00f2fe', '#10b981', '#a855f7']
    });
  };

  return (
    <header className="glass-panel" style={{
      margin: '16px 24px',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Brand & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 25px rgba(0, 242, 254, 0.45)',
          color: '#050811'
        }}>
          <ShieldCheck size={26} strokeWidth={2.4} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: '900', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SENTINAGENT
            </h1>
            <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>ZERO-TRUST PDP/PEP</span>
            <span className="badge badge-allow" style={{ fontSize: '0.65rem' }}>NIST SP 800-207</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Continuous Authorization & Cryptographic Policy Engine for Autonomous AI Workflows
          </p>
        </div>
      </div>

      {/* Live Status & Quick Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Stream Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid var(--border-subtle)' }}>
          <div className={`pulse-dot ${isConnected ? 'online' : ''}`} style={{ backgroundColor: isConnected ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}></div>
          <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: isConnected ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: 600 }}>
            {isConnected ? 'LIVE PEP FABRIC' : 'OFFLINE'}
          </span>
        </div>

        {/* Audio FX Toggle */}
        <button
          onClick={toggleAudio}
          className="btn btn-ghost"
          style={{ padding: '7px 11px', fontSize: '0.75rem' }}
          title={isAudioMuted ? "Enable cyber alert sound effects" : "Mute cyber audio"}
        >
          {isAudioMuted ? <VolumeX size={15} color="var(--text-muted)" /> : <Volume2 size={15} color="var(--accent-cyan)" />}
          <span>{isAudioMuted ? "Audio Off" : "Audio FX"}</span>
        </button>

        {/* Export SOC Audit Report */}
        <button
          className="btn btn-ghost"
          onClick={onExportAudit}
          style={{ fontSize: '0.75rem', padding: '7px 12px', border: '1px solid rgba(0, 242, 254, 0.3)' }}
          title="Download JSON cryptographic audit report"
        >
          <FileSpreadsheet size={15} />
          <span>Audit JSON</span>
        </button>

        {/* Cryptographic Verify Button with Confetti */}
        <button
          className="btn btn-primary"
          onClick={handleVerifyWithConfetti}
          style={{ fontSize: '0.78rem', padding: '7px 14px' }}
        >
          <CheckCircle2 size={16} />
          <span>Verify Hash Chain</span>
        </button>
      </div>
    </header>
  );
}
