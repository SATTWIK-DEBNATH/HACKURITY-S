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
  { day: 'Mon', inflow: 12500, outflow: 4200 },
  { day: 'Tue', inflow: 18400, outflow: 8900 },
  { day: 'Wed', inflow: 9200, outflow: 12100 },
  { day: 'Thu', inflow: 24500, outflow: 6400 },
  { day: 'Fri', inflow: 31200, outflow: 14800 },
  { day: 'Sat', inflow: 8100, outflow: 2100 },
  { day: 'Sun', inflow: 6400, outflow: 1500 }
];

export default function CashflowChart() {
  return (
    <div className="fintech-glass" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Weekly Liquidity Volume
          </span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
            Treasury Cashflow & Settlement
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.72rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00f2fe' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Settled Inflows</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Protected Outflows</span>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', height: '180px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={val => `$${val/1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(5, 8, 20, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#fff',
                fontFamily: 'var(--font-mono)'
              }}
            />
            <Area type="monotone" dataKey="inflow" stroke="#00f2fe" strokeWidth={2} fillOpacity={1} fill="url(#inflowGrad)" />
            <Area type="monotone" dataKey="outflow" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#outflowGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
