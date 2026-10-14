import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Gauge,
  Database
} from 'lucide-react';

export default function StatsBar({ stats }) {
  const getRiskColor = (score) => {
    if (score <= 30) return 'var(--accent-emerald)';
    if (score <= 80) return 'var(--accent-amber)';
    return 'var(--accent-rose)';
  };

  const metricCards = [
    {
      label: 'Total Interceptions',
      value: stats.total_intercepted ?? 0,
      subtext: 'Continuous PEP Evaluations',
      color: 'var(--accent-cyan)',
      icon: <Activity size={20} />
    },
    {
      label: 'Direct Allowed',
      value: stats.allowed_count ?? 0,
      subtext: 'Risk <= 30 (Fast Path)',
      color: 'var(--accent-emerald)',
      icon: <ShieldCheck size={20} />
    },
    {
      label: 'Attacks Blocked',
      value: stats.blocked_count ?? 0,
      subtext: 'Prompt Injection / Unauthorized',
      color: 'var(--accent-rose)',
      icon: <AlertTriangle size={20} />
    },
    {
      label: 'HITL Step-Up',
      value: stats.step_up_count ?? 0,
      subtext: 'Dual-Custody Approvals',
      color: 'var(--accent-amber)',
      icon: <UserCheck size={20} />
    },
    {
      label: 'Average Risk Score',
      value: `${stats.average_risk_score ?? 0}`,
      subtext: 'Contextual Multi-factor Score',
      color: getRiskColor(stats.average_risk_score ?? 0),
      icon: <Gauge size={20} />
    },
    {
      label: 'Immutable Audit Chain',
      value: `${stats.ledger_height ?? 1} BLOCKS`,
      subtext: 'SHA-256 Tamper-Proof',
      color: 'var(--accent-purple)',
      icon: <Database size={20} />
    }
  ];

  return (
    <div style={{ margin: '0 24px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', position: 'relative', zIndex: 1 }}>
      {metricCards.map((card, idx) => (
        <motion.div
          key={idx}
          whileHover={{ y: -3, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="glass-card"
          style={{ padding: '16px 20px', position: 'relative', overflow: 'hidden' }}
        >
          {/* Subtle colored accent glow top */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: card.color, opacity: 0.8 }} />
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {card.label}
            </span>
            <div style={{ color: card.color, opacity: 0.9 }}>
              {card.icon}
            </div>
          </div>

          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: card.color, letterSpacing: '-0.02em', marginBottom: '4px' }}>
            {card.value}
          </div>

          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {card.subtext}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
