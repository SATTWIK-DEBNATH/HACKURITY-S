import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  CreditCard,
  Bot,
  FileCheck2,
  Shield,
  Lock
} from 'lucide-react';

export default function FintechSidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'overview', label: 'Treasury Overview', icon: LayoutDashboard },
    { id: 'transfers', label: 'Wires & Payments', icon: ArrowRightLeft },
    { id: 'copilot', label: 'AI Agent Copilot', icon: Bot, badge: 'ZTA' },
    { id: 'cards', label: 'Corporate Cards', icon: CreditCard },
    { id: 'audit', label: 'Merkle Audit Log', icon: FileCheck2 }
  ];

  return (
    <aside style={{
      width: '230px',
      borderRight: '1px solid var(--border-subtle)',
      background: 'rgba(7, 10, 19, 0.6)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 14px'
    }}>
      <div>
        <div style={{
          fontSize: '0.68rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '0 12px 14px'
        }}>
          Menu
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '9px',
                  background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.2)' : 'transparent'}`,
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.15s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.25)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Security Status Box */}
      <div style={{
        padding: '14px',
        borderRadius: '12px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Shield size={14} color="#10b981" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f8fafc' }}>Zero-Trust Engine</span>
        </div>
        <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
          Strict Default-Deny. Every agent tool invocation requires single-use HMAC tickets.
        </p>
      </div>
    </aside>
  );
}
