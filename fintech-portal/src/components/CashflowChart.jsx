import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const data = [
  { day: 'Mon', inflow: 14500, outflow: 4200 },
  { day: 'Tue', inflow: 18200, outflow: 6900 },
  { day: 'Wed', inflow: 12400, outflow: 11100 },
  { day: 'Thu', inflow: 26800, outflow: 5400 },
  { day: 'Fri', inflow: 34100, outflow: 12800 },
  { day: 'Sat', inflow: 8900, outflow: 2100 },
  { day: 'Sun', inflow: 7200, outflow: 1800 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '10px 14px',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        fontSize: '0.75rem'
      }}>
        <div style={{ color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}>{label}</div>
        <div style={{ color: '#38bdf8', fontWeight: 700 }}>
          Inflows: ${payload[0]?.value?.toLocaleString()}
        </div>
        <div style={{ color: '#a855f7', fontWeight: 700 }}>
          Outflows: ${payload[1]?.value?.toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
};

export default function CashflowChart() {
  return (
    <div className="fintech-card" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Treasury Analytics
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: '2px 0 0' }}>
            Weekly Liquidity & Settlement Cashflow
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Settled Inflows</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Protected Outflows</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: '170px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="inflow" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#inflowGrad)" />
            <Area type="monotone" dataKey="outflow" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#outflowGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
