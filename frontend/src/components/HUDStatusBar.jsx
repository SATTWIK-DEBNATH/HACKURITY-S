import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Clock,
  Radio,
  Terminal,
  Server
} from 'lucide-react';

export default function HUDStatusBar({ latestEvent, stats }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0'));
    };
    updateTime();
    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, []);

  const isBlocked = latestEvent && (latestEvent.verdict === 'DENY' || latestEvent.verdict === 'BLOCKED');
  const isStepUp = latestEvent && latestEvent.verdict === 'STEP_UP_REQUIRED';

  const defconLevel = isBlocked ? 'DEFCON 1: ATTACK REPELLED' : isStepUp ? 'DEFCON 2: STEP-UP ACTIVE' : 'DEFCON 5: CONTINUOUS GUARDIAN';
  const defconColor = isBlocked ? 'var(--accent-rose)' : isStepUp ? 'var(--accent-amber)' : 'var(--accent-emerald)';

  return (
    <div style={{
      margin: '0 24px 14px',
      padding: '8px 18px',
      background: 'rgba(5, 8, 17, 0.75)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '0.72rem',
      fontFamily: 'var(--font-mono)'
    }}>
      {/* Defcon Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          padding: '3px 8px',
          borderRadius: '4px',
          background: isBlocked ? 'rgba(244, 63, 94, 0.2)' : isStepUp ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.15)',
          border: `1px solid ${defconColor}`,
          color: defconColor,
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <ShieldAlert size={13} />
          <span>{defconLevel}</span>
        </div>

        <span style={{ color: 'var(--text-muted)' }}>|</span>

        {/* Active Workload Attestations */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
          <span>Agent-WID Attestations:</span>
          <span style={{ color: '#38bdf8' }}>TriageAgent [CLEARANCE: L1]</span>
          <span style={{ color: '#818cf8' }}>BankingAgent [CLEARANCE: L2]</span>
          <span style={{ color: '#c084fc' }}>ExecutionAgent [CLEARANCE: L3]</span>
        </div>
      </div>

      {/* Military Timestamp & Engine Health */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Server size={12} color="var(--accent-cyan)" />
          <span style={{ color: 'var(--accent-cyan)' }}>PDP Latency: 1.4ms</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#e2e8f0' }}>
          <Clock size={12} color="var(--accent-blue)" />
          <span>UTC {timeStr}</span>
        </div>
      </div>
    </div>
  );
}
