import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Send,
  FileText,
  Globe,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Search,
  DollarSign,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PayAndTransferView({
  accounts,
  onExecuteTransfer,
  onOpenStepUp
}) {
  const [subTab, setSubTab] = useState('internal'); // 'internal', 'zelle', 'bills', 'wire'

  // Internal Transfer State
  const [fromAccount, setFromAccount] = useState('ACC-101');
  const [toAccount, setToAccount] = useState('ACC-102');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [internalSuccess, setInternalSuccess] = useState(false);

  // Zelle State
  const [zelleRecipient, setZelleRecipient] = useState('');
  const [zelleAmount, setZelleAmount] = useState('');
  const [zelleMemo, setZelleMemo] = useState('');
  const [zelleSuccess, setZelleSuccess] = useState(false);

  // Bill Pay State
  const [selectedBiller, setSelectedBiller] = useState('biller-1');
  const [billAmount, setBillAmount] = useState('142.50');
  const [billSuccess, setBillSuccess] = useState(false);

  // Wire State
  const [wireType, setWireType] = useState('domestic');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [wireAmount, setWireAmount] = useState('');

  const billers = [
    { id: 'biller-1', name: 'ConEdison Electric & Gas', category: 'Utilities', due: 'Nov 02, 2026', amount: 142.50, autoPay: true },
    { id: 'biller-2', name: 'AT&T Wireless & Fiber', category: 'Telecommunications', due: 'Nov 06, 2026', amount: 185.00, autoPay: false },
    { id: 'biller-3', name: 'MetLife Home Insurance', category: 'Insurance', due: 'Nov 15, 2026', amount: 310.00, autoPay: true },
    { id: 'biller-4', name: 'Chase Auto Finance Lease', category: 'Auto Loan', due: 'Nov 20, 2026', amount: 620.00, autoPay: true }
  ];

  const zelleContacts = [
    { name: 'Sarah Jenkins', identifier: 'sarah.j@meridian.io', avatar: 'SJ' },
    { name: 'David Chen', identifier: '(212) 555-0192', avatar: 'DC' },
    { name: 'Emily Thorne', identifier: 'emily.thorne@cloudops.com', avatar: 'ET' },
    { name: 'Marcus Brody', identifier: '(415) 555-8821', avatar: 'MB' }
  ];

  const handleInternalTransfer = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    if (onExecuteTransfer) {
      onExecuteTransfer({
        agent_role: 'TransactionExecutionAgent',
        tool_name: 'transfer_funds',
        arguments: {
          from_account: fromAccount,
          to_account: toAccount,
          amount: val,
          memo: memo || 'Internal Account Liquidity Transfer'
        },
        prompt: `Transfer $${val.toFixed(2)} from ${fromAccount} to ${toAccount}`
      });
    }

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    setInternalSuccess(true);
    setTimeout(() => {
      setInternalSuccess(false);
      setAmount('');
      setMemo('');
    }, 3000);
  };

  const handleZelleSend = (e) => {
    e.preventDefault();
    const val = parseFloat(zelleAmount);
    if (!val || !zelleRecipient) return;

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setZelleSuccess(true);
    setTimeout(() => {
      setZelleSuccess(false);
      setZelleAmount('');
      setZelleMemo('');
    }, 3500);
  };

  const handlePayBill = (e) => {
    e.preventDefault();
    setBillSuccess(true);
    setTimeout(() => {
      setBillSuccess(false);
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Sub-Navigation */}
      <div className="fintech-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>Pay & Transfer Hub</h1>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              Seamlessly move money, send P2P payments, settle commercial invoices, and schedule recurring bill payments.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <ShieldCheck size={14} style={{ color: '#38bdf8' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8' }}>Continuous PEP Enforcement Active</span>
          </div>
        </div>

        {/* Sub-Tabs Pills */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
          {[
            { id: 'internal', label: 'Between My Accounts', icon: ArrowLeftRight },
            { id: 'zelle', label: 'Send with Zelle®', icon: Send },
            { id: 'bills', label: 'Pay Bills & Autopay', icon: FileText },
            { id: 'wire', label: 'Wire Transfer (Domestic/Intl)', icon: Globe }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 16px',
                  borderRadius: '9px',
                  background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(56, 189, 248, 0.3)' : 'transparent'}`,
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} style={{ color: isActive ? '#38bdf8' : 'currentColor' }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. INTERNAL TRANSFERS SUB-TAB                                  */}
      {/* ============================================================== */}
      {subTab === 'internal' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
          <div className="fintech-card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
              Transfer Between My Accounts
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '22px' }}>
              Transfers between internal deposit and credit accounts settle immediately with zero service fees.
            </p>

            {internalSuccess && (
              <div style={{
                padding: '14px 18px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <CheckCircle2 size={18} />
                <span>Transfer of ${parseFloat(amount || 0).toFixed(2)} completed successfully! Balance updated.</span>
              </div>
            )}

            <form onSubmit={handleInternalTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    From Account
                  </label>
                  <select
                    value={fromAccount}
                    onChange={e => setFromAccount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    <option value="ACC-101" style={{ background: '#0d1322' }}>Advantage Checking (...4819) - $28,450.75</option>
                    <option value="ACC-102" style={{ background: '#0d1322' }}>Advantage Savings (...3391) - $94,120.00</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                    To Account
                  </label>
                  <select
                    value={toAccount}
                    onChange={e => setToAccount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    <option value="ACC-102" style={{ background: '#0d1322' }}>Advantage Savings (...3391) - $94,120.00</option>
                    <option value="ACC-101" style={{ background: '#0d1322' }}>Advantage Checking (...4819) - $28,450.75</option>
                    <option value="ACC-9024" style={{ background: '#0d1322' }}>Customized Cash Rewards Visa (...9024)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Transfer Amount ($ USD)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 700 }}>$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 30px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                    required
                  />
                </div>
              </div>

              {/* Quick Amount Preset Chips */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {[100, 250, 500, 1000, 2500].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toString())}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      color: '#94a3b8',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    ${val}
                  </button>
                ))}
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Transfer Memo / Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Monthly Savings allocation or Emergency buffer"
                  value={memo}
                  onChange={e => setMemo(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '12px 28px', fontSize: '0.9rem' }}
                >
                  <ArrowLeftRight size={16} />
                  <span>Execute Transfer Now</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar Guidance & Security Policies */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="fintech-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <ShieldCheck size={18} style={{ color: '#10b981' }} />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>Transfer Limits & Policy</h3>
              </div>
              <ul style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6, paddingLeft: '18px' }}>
                <li><strong>Autonomous Limit:</strong> Instant transfers up to $500.00 execute automatically.</li>
                <li><strong>Step-Up Threshold:</strong> Transfers exceeding $500.00 require secondary approval.</li>
                <li><strong>Daily Maximum:</strong> $25,000.00 for verified Diamond Tier clients.</li>
                <li><strong>Settlement Time:</strong> Instantaneous 24/7/365 settlement.</li>
              </ul>
            </div>

            <div className="fintech-card" style={{ padding: '22px', background: 'linear-gradient(135deg, rgba(8, 47, 73, 0.4) 0%, rgba(15, 23, 42, 0.7) 100%)' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>
                Smart Cash Management
              </span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                Earn 4.35% APY on idle cash
              </h4>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', lineHeight: 1.4 }}>
                Keep your checking balance optimized for monthly expenses, and sweep excess cash into your Advantage High-Yield Savings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. SEND WITH ZELLE® SUB-TAB                                    */}
      {/* ============================================================== */}
      {subTab === 'zelle' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px' }}>
          <div className="fintech-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 900,
                fontSize: '0.9rem'
              }}>
                Z
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Send Money with Zelle®</h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '22px' }}>
              Fast, safe, and free way to send money directly between U.S. bank accounts using only an email address or mobile number.
            </p>

            {zelleSuccess && (
              <div style={{
                padding: '14px 18px',
                borderRadius: '10px',
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                color: '#d8b4fe',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <CheckCircle2 size={18} />
                <span>Payment of ${parseFloat(zelleAmount || 0).toFixed(2)} sent to {zelleRecipient}! Delivered in minutes.</span>
              </div>
            )}

            <form onSubmit={handleZelleSend} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Recipient (Email or U.S. Mobile Phone)
                </label>
                <input
                  type="text"
                  placeholder="e.g. name@example.com or (555) 123-4567"
                  value={zelleRecipient}
                  onChange={e => setZelleRecipient(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Frequent Zelle Contacts Chips */}
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                  Recent Contacts
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {zelleContacts.map(c => (
                    <button
                      key={c.identifier}
                      type="button"
                      onClick={() => setZelleRecipient(c.identifier)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        color: '#94a3b8',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#7c3aed',
                        color: '#fff',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {c.avatar}
                      </span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Amount ($ USD)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 700 }}>$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={zelleAmount}
                    onChange={e => setZelleAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 30px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                    required
                  />
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  Daily Zelle sending limit: $2,500.00 available ($0 used today)
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Reason / What is this for?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dinner split, contractor deposit, rent share"
                  value={zelleMemo}
                  onChange={e => setZelleMemo(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    padding: '12px 28px',
                    fontSize: '0.9rem',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
                  }}
                >
                  <Send size={15} />
                  <span>Send ${parseFloat(zelleAmount || 0).toFixed(2)} with Zelle®</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right: Zelle Safety Guidance */}
          <div className="fintech-card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
              Zelle® Safety Checklist
            </h3>
            <ul style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6, paddingLeft: '18px' }}>
              <li>Only send money to people you know and trust.</li>
              <li>Money moves directly into the recipient's bank account in minutes and cannot be canceled.</li>
              <li>Meridian Apex will never call you asking for a one-time passcode or security code.</li>
              <li>Protected by Sentinel biometric identity and real-time behavioral heuristics.</li>
            </ul>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. BILL PAY & SCHEDULED PAYMENTS SUB-TAB                       */}
      {/* ============================================================== */}
      {subTab === 'bills' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
          <div className="fintech-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Enrolled Billers & E-Bills</h2>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                  Manage verified payees, view electronic utility statements, and schedule recurring payments.
                </p>
              </div>

              <button
                onClick={() => alert("Add New Payee: Search from over 25,000 national utilities, telecom, credit, and mortgage providers.")}
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '7px 12px' }}
              >
                <Plus size={14} />
                <span>Add Payee</span>
              </button>
            </div>

            {billSuccess && (
              <div style={{
                padding: '14px 18px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <CheckCircle2 size={18} />
                <span>Payment scheduled! Confirmation #BP-99824 generated.</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {billers.map(biller => (
                <div
                  key={biller.id}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: selectedBiller === biller.id ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${selectedBiller === biller.id ? 'rgba(56, 189, 248, 0.3)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                  onClick={() => { setSelectedBiller(biller.id); setBillAmount(biller.amount.toString()); }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8'
                    }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{biller.name}</div>
                      <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
                        {biller.category} &bull; Due: {biller.due}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                      ${biller.amount.toFixed(2)}
                    </div>
                    <span style={{
                      fontSize: '0.65rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: biller.autoPay ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                      color: biller.autoPay ? '#34d399' : '#94a3b8',
                      fontWeight: 600
                    }}>
                      {biller.autoPay ? 'Autopay ON' : 'Manual Pay'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Pay Panel for Selected Biller */}
          <div className="fintech-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
              Submit Payment
            </h3>

            <form onSubmit={handlePayBill} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Paying To</label>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
                  {billers.find(b => b.id === selectedBiller)?.name}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Pay From Account</label>
                <select style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}>
                  <option style={{ background: '#0d1322' }}>Advantage Checking (...4819)</option>
                  <option style={{ background: '#0d1322' }}>Advantage Savings (...3391)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Payment Amount ($ USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={billAmount}
                  onChange={e => setBillAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontWeight: 700
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Payment Date</label>
                <input
                  type="date"
                  defaultValue="2026-10-16"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ marginTop: '10px', padding: '11px', width: '100%' }}
              >
                <span>Authorize & Pay Bill</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. WIRE TRANSFERS (DOMESTIC & INTERNATIONAL) SUB-TAB           */}
      {/* ============================================================== */}
      {subTab === 'wire' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
          <div className="fintech-card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>Domestic & International Wire</h2>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '20px' }}>
              Same-day Fedwire settlement. Domestic cutoff: 5:00 PM ET. International SWIFT cutoff: 4:30 PM ET.
            </p>

            <form onSubmit={e => { e.preventDefault(); alert(`Wire transfer of $${wireAmount} submitted for dual-custody verification.`); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#fff', cursor: 'pointer' }}>
                  <input type="radio" checked={wireType === 'domestic'} onChange={() => setWireType('domestic')} />
                  <span>Domestic Wire (U.S.)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#fff', cursor: 'pointer' }}>
                  <input type="radio" checked={wireType === 'intl'} onChange={() => setWireType('intl')} />
                  <span>International Wire (SWIFT / BIC)</span>
                </label>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Beneficiary Legal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Global Logistics Corp"
                  value={beneficiaryName}
                  onChange={e => setBeneficiaryName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                    {wireType === 'domestic' ? 'ABA Routing (9 Digits)' : 'SWIFT / BIC Code'}
                  </label>
                  <input
                    type="text"
                    placeholder={wireType === 'domestic' ? '021000021' : 'BOFAUS3N'}
                    value={routingNumber}
                    onChange={e => setRoutingNumber(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Account / IBAN Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 99120482910"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.85rem' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Amount in USD</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={wireAmount}
                  onChange={e => setWireAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '12px', marginTop: '10px' }}>
                <Globe size={16} />
                <span>Submit Wire for Dual-Custody Approval</span>
              </button>
            </form>
          </div>

          <div className="fintech-card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
              Wire Compliance & Dual-Custody
            </h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 }}>
              In accordance with federal Bank Secrecy Act (BSA) and NIST SP 800-207 guidelines, outgoing wires exceeding $500.00 require cryptographic token signing and secondary supervisor clearance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
