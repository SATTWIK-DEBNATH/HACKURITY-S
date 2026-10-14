import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function ThreatActivityChart({ events }) {
  // Take last 12 events chronologically
  const chartData = events.slice(0, 12).reverse().map((ev, i) => ({
    name: ev.time_str || `#${i + 1}`,
    risk: ev.risk_score || 0,
    tool: ev.tool_name || 'action',
    verdict: ev.verdict || 'UNKNOWN'
  }));

  // If no events yet, show baseline
  if (chartData.length < 2) {
    chartData.unshift({ name: 'Baseline', risk: 5, tool: 'System Baseline', verdict: 'ALLOW' });
    chartData.push({ name: 'Monitoring', risk: 10, tool: 'Active Watch', verdict: 'ALLOW' });
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(5, 8, 17, 0.95)',
          border: '1px solid var(--border-highlight)',
          borderRadius: '8px',
          padding: '8px 12px',
          boxShadow: '0 0 15px rgba(0, 242, 254, 0.25)',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)'
        }}>
          <div style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{data.tool}()</div>
          <div style={{ color: data.risk > 80 ? 'var(--accent-rose)' : data.risk > 30 ? 'var(--accent-amber)' : 'var(--accent-emerald)', marginTop: '2px' }}>
            Risk Score: {data.risk} / 100 ({data.verdict})
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: '2px' }}>Time: {data.name}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', margin: '0 24px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="pulse-dot online" />
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Live Contextual Risk & Velocity Telemetry
          </h3>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Continuous Dynamic Threat Vector Tracking
        </span>
      </div>

      <div style={{ width: '100%', height: '110px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="riskAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
            <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="risk"
              stroke="#00f2fe"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#riskAreaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
