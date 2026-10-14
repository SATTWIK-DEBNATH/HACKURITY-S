import React, { useState, useEffect } from 'react';
import { Shield, Server, Database, Bot, Lock, AlertTriangle, CheckCircle2, XCircle, Zap, RefreshCw, Eye } from 'lucide-react';
import { api, useSSE } from '../services/api';

export default function SecurityGraph() {
  const [activeMode, setActiveMode] = useState('normal'); // 'normal' | 'attack' | 'quarantine' | 'approval'
  const [selectedNode, setSelectedNode] = useState(null);
  const [circuitStatus, setCircuitStatus] = useState(null);

  useEffect(() => {
    loadCircuitStatus();
  }, []);

  const loadCircuitStatus = async () => {
    try {
      const res = await api.getCircuitBreaker();
      if (res.statuses?.length > 0) {
        setCircuitStatus(res.statuses[0]);
        if (res.statuses[0].state === 'QUARANTINED') {
          setActiveMode('quarantine');
        }
      }
    } catch { /* ignore */ }
  };

  const nodes = [
    {
      id: 'agent',
      label: 'Financial Remediation Agent',
      sublabel: 'spiffe://demo.local/agent/financial-remediation',
      type: 'agent',
      status: activeMode === 'quarantine' ? 'alert' : 'active',
      x: 100,
      y: 220,
      icon: Bot,
      details: {
        'Identity Subject': 'spiffe://demo.local/agent/financial-remediation',
        'Algorithm': 'EdDSA (Ed25519) Signed JWT',
        'Authorized Scope': 'ledger.read, ledger.refund (Max $50)',
        'Status': activeMode === 'quarantine' ? 'QUARANTINED BY CIRCUIT BREAKER' : 'ACTIVE & VERIFIED',
      },
    },
    {
      id: 'sidecar',
      label: 'MCP Sentinel Proxy',
      sublabel: 'Zero-Trust stdio Interceptor',
      type: 'proxy',
      status: activeMode === 'attack' ? 'warning' : 'safe',
      x: 340,
      y: 220,
      icon: Shield,
      details: {
        'Inspection Mode': 'Deterministic Multi-Stage Pre-flight',
        'Checks Enforced': 'Path Traversal, SSRF, Shell Injection, Payload Depth',
        'Fail-Closed Posture': 'Enabled (All unexpected tools blocked)',
        'Response Scanning': 'Regex Secret Redaction + Prompt Injection Taint',
      },
    },
    {
      id: 'engine',
      label: 'AWS Cedar Policy Engine',
      sublabel: 'Default-Deny Formal Verifier',
      type: 'engine',
      status: activeMode === 'approval' ? 'warning' : 'safe',
      x: 580,
      y: 110,
      icon: Lock,
      details: {
        'Policy Engine': 'Cedar v4.12 AST Evaluator',
        'Evaluation Latency': 'Sub-millisecond (Local C-bindings)',
        'HITL Step-Up Trigger': 'Refunds > $50.00 require human signature',
        'Default Posture': 'Strict Default-Deny',
      },
    },
    {
      id: 'tool',
      label: 'Finance MCP Tool Server',
      sublabel: 'Local Stdio Tool Execution',
      type: 'tool',
      status: activeMode === 'attack' || activeMode === 'quarantine' ? 'alert' : 'safe',
      x: 580,
      y: 330,
      icon: Server,
      details: {
        'Transport': 'stdio / JSON-RPC 2.0',
        'Tools Exposed': 'read_account, list_transactions, issue_refund',
        'Execution Sandbox': 'Single-use HMAC ticket required',
        'State': activeMode === 'attack' ? 'BLOCKED - CALL NEVER REACHED' : 'READY',
      },
    },
    {
      id: 'resource',
      label: 'Simulated Ledger Database',
      sublabel: 'Protected Financial Vault',
      type: 'resource',
      status: 'safe',
      x: 820,
      y: 220,
      icon: Database,
      details: {
        'Resource Type': 'Simulated Commercial Ledger',
        'Tamper Proofing': 'SHA-256 Merkle hash chained blocks',
        'Immutability': 'Forward-linked parent hash pointers',
        'Audit Verification': 'Live verified integrity',
      },
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--cyan)';
      case 'safe': return 'var(--green)';
      case 'warning': return 'var(--amber)';
      case 'alert': return 'var(--red)';
      default: return 'var(--muted)';
    }
  };

  const selectedOrFirst = selectedNode || nodes[1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header and Mode Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Authorization Architecture Explorer
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0' }}>
            Live Security Graph
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '2px 0 0' }}>
            Interactive topology showing data paths, policy decision points, and circuit breakers
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '10px', border: '1px solid var(--line)' }}>
          {[
            { id: 'normal', label: 'Normal Traffic', color: 'var(--green)' },
            { id: 'attack', label: 'Injection Blocked', color: 'var(--red)' },
            { id: 'quarantine', label: 'Circuit Breaker', color: '#ff647c' },
            { id: 'approval', label: 'HITL Step-Up', color: 'var(--amber)' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMode(m.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                background: activeMode === m.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: activeMode === m.id ? m.color : 'var(--muted)',
                border: `1px solid ${activeMode === m.id ? m.color : 'transparent'}`,
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas + Inspector Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '16px' }}>
        {/* SVG Interactive Topology Canvas */}
        <div className="console-card" style={{ height: '480px', position: 'relative', overflow: 'hidden', background: '#050810' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {/* Bezier Connections */}
            <path
              d="M 216 260 C 278 260, 278 260, 340 260"
              stroke={activeMode === 'quarantine' ? '#ff647c' : 'rgba(101, 231, 245, 0.4)'}
              strokeWidth="2"
              fill="none"
              strokeDasharray={activeMode === 'quarantine' ? '4 4' : 'none'}
            />
            <path
              d="M 456 240 C 518 240, 518 150, 580 150"
              stroke="rgba(101, 231, 245, 0.4)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 456 270 C 518 270, 518 370, 580 370"
              stroke={activeMode === 'attack' ? '#ff647c' : 'rgba(101, 231, 245, 0.4)'}
              strokeWidth="2"
              fill="none"
              strokeDasharray={activeMode === 'attack' ? '4 4' : 'none'}
            />
            <path
              d="M 696 370 C 758 370, 758 260, 820 260"
              stroke="rgba(109, 231, 174, 0.4)"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* Render Graph Nodes */}
          {nodes.map(n => {
            const Icon = n.icon;
            const isSelected = selectedOrFirst?.id === n.id;
            const statusColor = getStatusColor(n.status);

            return (
              <div
                key={n.id}
                onClick={() => setSelectedNode(n)}
                style={{
                  position: 'absolute',
                  left: `${n.x}px`,
                  top: `${n.y}px`,
                  transform: 'translate(-50%, -50%)',
                  width: '180px',
                  padding: '14px',
                  borderRadius: '12px',
                  background: isSelected ? 'rgba(15, 23, 42, 0.95)' : 'rgba(10, 14, 26, 0.85)',
                  border: `1px solid ${isSelected ? statusColor : 'var(--line)'}`,
                  boxShadow: isSelected ? `0 0 25px ${statusColor}40` : '0 10px 25px rgba(0,0,0,0.5)',
                  cursor: 'pointer',
                  zIndex: 10,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Icon size={16} color={statusColor} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>
                    {n.label}
                  </span>
                </div>
                <div style={{ fontSize: '0.62rem', color: 'var(--dim)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {n.sublabel}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Component Details Sidebar */}
        <aside className="console-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Component Inspector
            </span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0' }}>
              {selectedOrFirst.label}
            </h3>
            <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>
              Type: {selectedOrFirst.type?.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(selectedOrFirst.details || {}).map(([k, v]) => (
              <div key={k} style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--dim)', textTransform: 'uppercase' }}>{k}</div>
                <div style={{ fontSize: '0.75rem', color: '#f8fafc', fontWeight: 600, marginTop: '2px', wordBreak: 'break-all' }}>{v}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
