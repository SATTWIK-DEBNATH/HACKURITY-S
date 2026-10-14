import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Activity,
  FileText,
  Users,
  Crosshair,
  Search,
  FlaskConical,
  BarChart3,
  Network,
  Landmark,
  Bot,
  ArrowLeft,
  Check,
  X,
  Zap,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { api, useSSE } from '../services/api';

const navItems = [
  { to: '/console', icon: BarChart3, label: 'Overview' },
  { to: '/accounts', icon: Landmark, label: 'Account Portal' },
  { to: '/finance', icon: Bot, label: 'AI Finance Bot' },
  { to: '/graph', icon: Network, label: 'Security Graph' },
  { to: '/monitor', icon: Activity, label: 'Live Monitor' },
  { to: '/incidents', icon: Crosshair, label: 'Incidents' },
  { to: '/policies', icon: FileText, label: 'Policies' },
  { to: '/identity', icon: Users, label: 'Identity' },
  { to: '/attack-lab', icon: FlaskConical, label: 'Attack Lab' },
  { to: '/audit', icon: Search, label: 'Audit Explorer' }
];

export default function ConsoleLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingApproval, setPendingApproval] = useState(null);
  const [circuitBreaker, setCircuitBreaker] = useState(null);
  const [healthStatus, setHealthStatus] = useState('ONLINE');

  const checkPendingApprovals = async () => {
    try {
      const res = await api.getApprovals();
      const active = res.approvals?.find(a => a.status === 'pending');
      setPendingApproval(active || null);
    } catch { /* ignore */ }
  };

  const checkCircuitBreaker = async () => {
    try {
      const res = await api.getCircuitBreaker();
      if (res.statuses?.length > 0) {
        setCircuitBreaker(res.statuses[0]);
      }
    } catch { /* ignore */ }
  };

  useEffect(() => {
    checkPendingApprovals();
    checkCircuitBreaker();
    const interval = setInterval(() => {
      checkPendingApprovals();
      checkCircuitBreaker();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleDecision = async (decision) => {
    if (!pendingApproval) return;
    try {
      await api.decideApproval(pendingApproval.id, decision, 'security-admin@demo.local');
      setPendingApproval(null);
      checkPendingApprovals();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetBreaker = async () => {
    try {
      await api.resetCircuitBreaker();
      checkCircuitBreaker();
    } catch (err) {
      console.error(err);
    }
  };

  const currentNav = navItems.find(item => item.to === location.pathname) || { label: 'Security Console' };

  return (
    <div className="console-shell">
      {/* 1. Left Sidebar */}
      <aside className="console-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        <div>
          {/* Logo & Brand */}
          <div style={{ padding: '20px 18px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--cyan), #3b82f6)',
                display: 'grid',
                placeItems: 'center',
                color: '#07090d'
              }}>
                <Shield size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h1 style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.08em', color: '#ffffff', margin: 0 }}>
                  MCP SENTINEL
                </h1>
                <p style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--dim)', margin: '2px 0 0' }}>
                  ZERO-TRUST AGENTIC SIDECAR
                </p>
              </div>
            </div>

            {/* Return to Home Landing Page Button */}
            <button
              onClick={() => navigate('/')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                marginTop: '14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--line)',
                color: 'var(--muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--line-bright)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--line)'; }}
            >
              <ArrowLeft size={14} />
              <span>&larr; Return to Landing Page</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--cyan)' : 'var(--muted)',
                    background: isActive ? 'rgba(101, 231, 245, 0.1)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(101, 231, 245, 0.25)' : 'transparent'}`,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.to === '/attack-lab' && (
                    <span style={{ fontSize: '0.6rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(255, 100, 124, 0.15)', color: '#ff647c' }}>
                      8 Labs
                    </span>
                  )}
                  {item.to === '/policies' && (
                    <span style={{ fontSize: '0.6rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(109, 231, 174, 0.15)', color: '#6de7ae' }}>
                      Cedar
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Circuit Breaker Status */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--line)' }}>
          {circuitBreaker?.state === 'QUARANTINED' ? (
            <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255, 100, 124, 0.12)', border: '1px solid rgba(255, 100, 124, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff647c', fontSize: '0.75rem', fontWeight: 700 }}>
                <Zap size={14} className="animate-pulse" />
                <span>Agent Quarantined</span>
              </div>
              <p style={{ fontSize: '0.65rem', color: '#ffc66d', margin: '4px 0 8px' }}>
                Circuit breaker tripped (3 violations).
              </p>
              <button
                onClick={handleResetBreaker}
                style={{
                  width: '100%',
                  padding: '5px 0',
                  borderRadius: '6px',
                  background: 'rgba(255, 100, 124, 0.2)',
                  border: '1px solid rgba(255, 100, 124, 0.4)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Reset Breaker
              </button>
            </div>
          ) : (
            <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6de7ae', fontSize: '0.75rem', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6de7ae' }} />
                <span>Zero-Trust Enforced</span>
              </div>
              <p style={{ fontSize: '0.68rem', color: 'var(--dim)', margin: '4px 0 0' }}>
                Strict Default-Deny &bull; Cedar AST v4.12
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* 2. Main Console Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {/* Console Header Bar */}
        <header className="console-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>
              MCP Sentinel /
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
              {currentNav.label}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Status Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '9999px',
              background: 'rgba(109, 231, 174, 0.1)',
              border: '1px solid rgba(109, 231, 174, 0.25)',
              fontSize: '0.72rem',
              color: '#6de7ae',
              fontWeight: 600
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6de7ae' }} />
              <span>Policy Engine Online</span>
            </div>

            {/* Quick Reset State Button */}
            <button
              onClick={async () => { await api.reset(); window.location.reload(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--line)',
                color: 'var(--muted)',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
              title="Reset all demo transactions, approvals, and mock state"
            >
              <RotateCcw size={13} />
              <span>Reset State</span>
            </button>
          </div>
        </header>

        {/* Pending Approval Global Alert Banner */}
        {pendingApproval && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(255, 198, 109, 0.15), rgba(255, 100, 124, 0.15))',
            borderBottom: '1px solid rgba(255, 198, 109, 0.3)',
            padding: '12px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={18} color="#ffc66d" />
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffc66d' }}>
                  HITL Step-Up Dual-Custody Approval Required
                </span>
                <span style={{ fontSize: '0.75rem', color: '#f4f7fb', marginLeft: '8px' }}>
                  Refund request of <strong>${pendingApproval.amount?.toFixed(2)}</strong> for {pendingApproval.accountId} requires human supervisor sign-off.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => handleDecision('approve')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  background: '#10b981',
                  color: '#07090d',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Check size={14} /> Approve
              </button>
              <button
                onClick={() => handleDecision('reject')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  background: 'rgba(255, 100, 124, 0.2)',
                  color: '#ff647c',
                  border: '1px solid rgba(255, 100, 124, 0.4)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <X size={14} /> Reject
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main style={{ flex: 1, padding: '24px 28px', minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
