import React, { useState } from 'react';
import {
  Landmark,
  ArrowLeftRight,
  CreditCard,
  TrendingUp,
  ShieldCheck,
  FileText,
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
  Send,
  Sparkles,
  Lock,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import BankLogo from './BankLogo';

export default function BankNavbar({
  activeTab,
  setActiveTab,
  onOpenTransferModal,
  onOpenBillPayModal,
  notificationCount = 3,
  onToggleSecurityDrawer,
  userProfile = {
    name: 'Alexander Vance',
    tier: 'Diamond Honors',
    accountsCount: 4,
    avatarInitials: 'AV'
  }
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Direct Deposit Received',
      detail: '+$9,450.00 from Meridian Corp Payroll settled in Advantage Checking',
      time: '25m ago',
      unread: true,
      icon: CheckCircle2,
      color: '#10b981'
    },
    {
      id: 'notif-2',
      title: 'Security Notice: New Travel Advisory',
      detail: 'Travel notice for Tokyo, Japan (Oct 20 - Nov 05) successfully activated',
      time: '2h ago',
      unread: true,
      icon: ShieldCheck,
      color: '#38bdf8'
    },
    {
      id: 'notif-3',
      title: 'Monthly e-Statement Ready',
      detail: 'Your September 2026 statement is available for download in Documents',
      time: '1d ago',
      unread: false,
      icon: FileText,
      color: '#94a3b8'
    }
  ];

  const navItems = [
    { id: 'accounts', label: 'Accounts', icon: Landmark },
    { id: 'transfer', label: 'Pay & Transfer', icon: ArrowLeftRight },
    { id: 'cards', label: 'Cards & Limits', icon: CreditCard },
    { id: 'invest', label: 'Invest & Plan', icon: TrendingUp },
    { id: 'security', label: 'Security & Shield', icon: ShieldCheck },
    { id: 'statements', label: 'Statements', icon: FileText }
  ];

  return (
    <header style={{
      height: '74px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(7, 10, 19, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px'
    }}>
      {/* Brand & Blank Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div
          onClick={() => setActiveTab('accounts')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {/* Modular Bank Logo Component */}
          <BankLogo size="md" subtitle="PREMIER PRIVATE BANK" />
        </div>

        {/* Primary Banking Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`bank-tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} style={{ color: isActive ? '#38bdf8' : 'currentColor' }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls: Quick Actions & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Quick Transfer Button */}
        <button
          onClick={onOpenTransferModal}
          className="btn-primary"
          style={{
            padding: '8px 16px',
            fontSize: '0.82rem',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)'
          }}
        >
          <ArrowLeftRight size={14} />
          <span>Transfer</span>
        </button>

        {/* Quick Bill Pay Button */}
        <button
          onClick={onOpenBillPayModal}
          className="btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.82rem' }}
        >
          <Send size={14} style={{ color: '#38bdf8' }} />
          <span>Pay Bills</span>
        </button>

        {/* Zero-Trust Sentinel Shield Drawer Toggle */}
        <button
          onClick={onToggleSecurityDrawer}
          title="Open Zero-Trust Policy & Interception Drawer"
          style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: '#38bdf8',
            padding: '8px 12px',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
        >
          <ShieldCheck size={14} />
          <span>Sentinel Guard</span>
        </button>

        {/* Notifications Icon with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '9px',
              background: showNotifications ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#f43f5e',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(244, 63, 94, 0.5)'
              }}>
                {notificationCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '340px',
              background: '#0d1322',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.7)',
              padding: '16px',
              zIndex: 100
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Alerts & Activity</span>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map(n => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      style={{
                        display: 'flex',
                        gap: '10px',
                        padding: '10px',
                        borderRadius: '9px',
                        background: n.unread ? 'rgba(56, 189, 248, 0.05)' : 'transparent',
                        border: n.unread ? '1px solid rgba(56, 189, 248, 0.15)' : '1px solid transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ marginTop: '2px' }}>
                        <Icon size={16} style={{ color: n.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{n.title}</span>
                          <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{n.time}</span>
                        </div>
                        <p style={{ fontSize: '0.73rem', color: '#94a3b8', marginTop: '2px', lineHeight: 1.3 }}>{n.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '5px 12px 5px 6px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
            }}>
              {userProfile.avatarInitials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.1 }}>
                {userProfile.name}
              </span>
              <span style={{ fontSize: '0.62rem', color: '#38bdf8', fontWeight: 600 }}>
                {userProfile.tier}
              </span>
            </div>
            <ChevronDown size={14} style={{ color: '#64748b', marginLeft: '4px' }} />
          </div>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '48px',
              right: 0,
              width: '260px',
              background: '#0d1322',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.7)',
              padding: '12px',
              zIndex: 100
            }}>
              <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '8px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{userProfile.name}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Client ID: ACC-1001-9982</div>
                <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '4px', fontWeight: 600 }}>
                  Diamond Honors &bull; Private Client
                </div>
              </div>
              <button
                onClick={() => { setActiveTab('security'); setShowProfileMenu(false); }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <ShieldCheck size={14} style={{ color: '#38bdf8' }} />
                <span>Security & Privacy Settings</span>
              </button>
              <button
                onClick={() => { setActiveTab('statements'); setShowProfileMenu(false); }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <FileText size={14} style={{ color: '#10b981' }} />
                <span>e-Documents & Statements</span>
              </button>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '6px 0' }} />
              <button
                onClick={() => { alert("Session securely closed. Zero-trust tokens wiped."); setShowProfileMenu(false); }}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#f43f5e',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <LogOut size={14} />
                <span>Sign Out & Lock Portal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
