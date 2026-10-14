import React from 'react';
import {
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  CreditCard,
  Bot,
  FileCheck2,
  Shield,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function FintechSidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'overview', label: 'Treasury Overview', icon: LayoutDashboard },
    { id: 'accounts', label: 'Accounts & Vaults', icon: Wallet },
    { id: 'transfers', label: 'Wire & Payments', icon: ArrowRightLeft },
    { id: 'copilot', label: 'SentinCopilot AI', icon: Bot, badge: 'Protected' },
    { id: 'cards', label: 'Corporate Platinum', icon: CreditCard },
    { id: 'audit', label: 'Merkle Audit Log', icon: FileCheck2 }
  ];

  return (
    <aside style={{
      width: '240px',
      borderRight: '1px solid var(--border-subtle)',
      background: 'rgba(5, 8, 20, 0.65)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px'
    }}>
      <div>
        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px 12px' }}>
          Banking Menu
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(0, 242, 254, 0.12)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? 'rgba(0, 242, 254, 0.25)' : 'transparent'}`,
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
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
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Security Status Footnote */}
      <div style={{
        padding: '14px',
        borderRadius: '12px',
        background: 'rgba(17, 24, 54, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Shield size={14} color="var(--accent-emerald)" />
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f8fafc' }}>Zero-Trust Enforced</span>
        </div>
        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
          All AI agent tool dispatches are isolated via non-bypassable PEP proxy.
        </p>
      </div>
    </aside>
  );
}
