import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  PieChart,
  Target,
  Award,
  Calendar,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';

export default function FinancialHealthView() {
  const [ficoScore, setFicoScore] = useState(785);

  const creditFactors = [
    { factor: 'Payment History', rating: 'Exceptional', impact: 'High Impact', value: '100% on-time', color: '#10b981' },
    { factor: 'Credit Card Utilization', rating: 'Excellent', impact: 'High Impact', value: '4.7% ($1,420 of $30k)', color: '#10b981' },
    { factor: 'Average Age of Credit', rating: 'Good', impact: 'Medium Impact', value: '7 yrs, 4 mos', color: '#38bdf8' },
    { factor: 'Total Accounts Open', rating: 'Good', impact: 'Low Impact', value: '11 accounts', color: '#38bdf8' },
    { factor: 'Hard Inquiries (12 mo)', rating: 'Exceptional', impact: 'Low Impact', value: '0 inquiries', color: '#10b981' }
  ];

  const savingsGoals = [
    { title: 'Emergency Liquid Reserve', target: 50000, current: 50000, color: '#10b981', status: 'Goal Met' },
    { title: 'Tax & Treasury Obligations', target: 35000, current: 28450, color: '#38bdf8', status: 'On Track' },
    { title: 'Vacation Property Downpayment', target: 120000, current: 44120, color: '#a855f7', status: 'In Progress' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Top Banner */}
      <div className="fintech-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>Financial Health & Credit Planning</h1>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              Free FICO® Score 8 monitoring, credit profile breakdown, cashflow velocity, and target savings goal tracking.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', fontSize: '0.78rem', fontWeight: 700 }}>
            <Award size={16} />
            <span>Diamond Client Credit Tier</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr', gap: '24px' }}>
        {/* ============================================================ */}
        {/* LEFT: FICO SCORE GAUGE BOX                                   */}
        {/* ============================================================ */}
        <div className="fintech-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            FICO® Score 8 based on Equifax® Data
          </span>

          {/* Radial Score Meter */}
          <div style={{ position: 'relative', width: '220px', height: '140px', marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="220" height="130" viewBox="0 0 200 110">
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * (ficoScore - 300) / 550)}
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="40%" stopColor="#f59e0b" />
                  <stop offset="70%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            <div style={{ position: 'absolute', bottom: '10px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {ficoScore}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Exceptional
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.7rem', color: '#64748b', marginTop: '10px' }}>
            <span>Poor (300)</span>
            <span>Fair (580)</span>
            <span>Good (670)</span>
            <span>Very Good (740)</span>
            <span>Exceptional (800+)</span>
          </div>

          <div style={{ marginTop: '24px', padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', width: '100%', textAlign: 'left', fontSize: '0.75rem', color: '#94a3b8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 600, marginBottom: '4px' }}>
              <Sparkles size={14} />
              <span>Score Analysis</span>
            </div>
            Your credit score puts you in the top 15% of U.S. consumers. You qualify for our lowest prime lending interest rates and maximum credit line eligibility.
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT: CREDIT FACTORS TABLE                                 */}
        {/* ============================================================ */}
        <div className="fintech-card" style={{ padding: '26px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
            Key Credit Factor Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {creditFactors.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>{item.factor}</div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.impact}</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: item.color }}>{item.rating}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SAVINGS GOALS & MILESTONES                                     */}
      {/* ============================================================== */}
      <div className="fintech-card" style={{ padding: '26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Target Savings Goals & Milestones</h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
              Automated smart deposit sweeps into target liquidity buckets
            </p>
          </div>

          <button
            onClick={() => alert("Create New Goal: Define target balance, deadline, and automated round-up rules.")}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '7px 14px' }}
          >
            <span>+ Create Goal</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {savingsGoals.map((goal, idx) => {
            const pct = Math.min(100, Math.round((goal.current / goal.target) * 100));
            return (
              <div
                key={idx}
                style={{
                  padding: '18px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{goal.title}</h4>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: goal.color }}>{goal.status}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>${goal.current.toLocaleString()}</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>${goal.target.toLocaleString()} ({pct}%)</span>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: goal.color, borderRadius: '4px', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
