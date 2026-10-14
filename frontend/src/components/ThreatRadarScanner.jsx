import React, { useEffect, useState } from 'react';

export default function ThreatRadarScanner({ latestEvent, stats }) {
  const [blips, setBlips] = useState([
    { id: 1, angle: 45, radius: 25, color: '#10b981', label: 'Triage' },
    { id: 2, angle: 180, radius: 40, color: '#38bdf8', label: 'Banking' }
  ]);

  useEffect(() => {
    if (!latestEvent) return;
    const isAttack = latestEvent.verdict === 'DENY' || latestEvent.verdict === 'BLOCKED';
    const isStepUp = latestEvent.verdict === 'STEP_UP_REQUIRED';

    const newBlip = {
      id: Date.now(),
      angle: Math.floor(Math.random() * 360),
      radius: isAttack ? Math.floor(Math.random() * 20 + 75) : isStepUp ? Math.floor(Math.random() * 20 + 45) : Math.floor(Math.random() * 25 + 15),
      color: isAttack ? '#f43f5e' : isStepUp ? '#f59e0b' : '#10b981',
      label: latestEvent.tool_name?.substring(0, 8) || 'Action'
    };

    setBlips(prev => [newBlip, ...prev.slice(0, 7)]);
  }, [latestEvent]);

  return (
    <div className="glass-card" style={{
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(0, 242, 254, 0.3)',
      boxShadow: '0 0 20px rgba(0, 242, 254, 0.1)'
    }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="pulse-dot online" />
          <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
            360° Threat Radar
          </span>
        </div>
        <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          R-RANGE: 0-100
        </span>
      </div>

      {/* Radar Canvas / Screen */}
      <div style={{
        position: 'relative',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 242, 254, 0.06) 0%, rgba(5, 8, 17, 0.95) 70%, #030712 100%)',
        border: '2px solid rgba(0, 242, 254, 0.4)',
        boxShadow: 'inset 0 0 30px rgba(0, 242, 254, 0.2), 0 0 15px rgba(0, 242, 254, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Radar Concentric Distance Rings */}
        <div style={{ position: 'absolute', width: '135px', height: '135px', borderRadius: '50%', border: '1px dashed rgba(0, 242, 254, 0.25)' }} />
        <div style={{ position: 'absolute', width: '90px', height: '90px', borderRadius: '50%', border: '1px solid rgba(0, 242, 254, 0.2)' }} />
        <div style={{ position: 'absolute', width: '45px', height: '45px', borderRadius: '50%', border: '1px solid rgba(0, 242, 254, 0.15)' }} />

        {/* Crosshairs */}
        <div style={{ position: 'absolute', width: '100%', height: '1px', background: 'rgba(0, 242, 254, 0.2)' }} />
        <div style={{ position: 'absolute', height: '100%', width: '1px', background: 'rgba(0, 242, 254, 0.2)' }} />

        {/* 360 Sweeping Radar Line */}
        <div style={{
          position: 'absolute',
          width: '50%',
          height: '50%',
          top: 0,
          left: '50%',
          transformOrigin: '0% 100%',
          background: 'conic-gradient(from 180deg at 0% 100%, rgba(0, 242, 254, 0.35) 0deg, rgba(0, 242, 254, 0.0) 50deg)',
          animation: 'radarSweep 3.2s linear infinite'
        }} />

        {/* Radar Blips */}
        {blips.map((blip) => {
          const rad = (blip.angle * Math.PI) / 180;
          const x = 90 + Math.cos(rad) * (blip.radius * 0.82) - 4;
          const y = 90 + Math.sin(rad) * (blip.radius * 0.82) - 4;

          return (
            <div
              key={blip.id}
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: blip.color,
                boxShadow: `0 0 10px ${blip.color}`,
                animation: 'pulse 1.4s infinite'
              }}
              title={blip.label}
            />
          );
        })}

        {/* Center Target Core */}
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--accent-cyan)',
          boxShadow: '0 0 8px var(--accent-cyan)',
          zIndex: 3
        }} />
      </div>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', marginTop: '10px', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>
        <span style={{ color: 'var(--accent-emerald)' }}>● Trusted (0-30)</span>
        <span style={{ color: 'var(--accent-amber)' }}>● Step-Up (31-80)</span>
        <span style={{ color: 'var(--accent-rose)' }}>● Threat (81+)</span>
      </div>
    </div>
  );
}
