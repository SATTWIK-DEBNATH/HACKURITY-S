import React, { useState, useEffect } from 'react';
import {
  Landmark, Shield, AlertTriangle, CheckCircle, Clock,
  ArrowUpRight, ArrowDownLeft, RefreshCw, RotateCcw,
  Search, Filter, Lock, Unlock, Sparkles, Bot, AlertOctagon,
  ChevronRight, ExternalLink, X, FileText, Check, ShieldAlert,
  CreditCard, TrendingUp, Zap
} from 'lucide-react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AccountPortal() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('ACC-1001');
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [freezing, setFreezing] = useState(false);
  const [disputeMsg, setDisputeMsg] = useState(null);

  const loadData = async (accId) => {
    try {
      const accsRes = await api.getAccounts();
      setAccounts(accsRes.accounts || []);

      const current = await api.getAccount(accId);
      setAccount(current.account);
      setTransactions(current.transactions || []);

      const anRes = await api.getAnalytics(accId);
      setAnalytics(anRes);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData(selectedAccountId);
  }, [selectedAccountId]);

  const handleFreezeToggle = async () => {
    if (!account) return;
    setFreezing(true);
    const newStatus = account.status === 'active';
    await api.freezeAccount(account.id, newStatus);
    setAccount(prev => ({ ...prev, status: newStatus ? 'suspended' : 'active' }));
    setFreezing(false);
  };

  const handleDispute = async (txId) => {
    const res = await api.disputeTransaction(txId, 'Customer flagged charge via Account Portal');
    setDisputeMsg(res.message);
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'disputed' } : t));
    setTimeout(() => {
      setDisputeMsg(null);
      setSelectedTxn(null);
    }, 2500);
  };

  const filteredTxns = transactions.filter(t => {
    const matchesSearch = t.memo.toLowerCase().includes(search.toLowerCase()) || (t.merchantName && t.merchantName.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || t.type === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header & Account Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Simulated Commercial Ledger
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0' }}>
            Account & Treasury Portal
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '2px 0 0' }}>
            Protected banking environment demonstrating zero-trust continuous authorization for financial actions
          </p>
        </div>

        {/* Account Selector Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select
            value={selectedAccountId}
            onChange={e => setSelectedAccountId(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--line-bright)',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {accounts.map(a => (
              <option key={a.id} value={a.id} style={{ background: '#0d1119' }}>
                {a.id} &bull; {a.name} (${a.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Balance Card & Titanium Debit Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Left: Balance Card */}
        <div className="console-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)' }}>
              Primary Operating Balance ({account?.accountNumber || 'ACC-1001-9982'})
            </span>
            <span style={{
              fontSize: '0.68rem',
              padding: '2px 8px',
              borderRadius: '9999px',
              background: account?.status === 'active' ? 'rgba(109, 231, 174, 0.15)' : 'rgba(255, 100, 124, 0.15)',
              color: account?.status === 'active' ? 'var(--green)' : 'var(--red)',
              fontWeight: 700
            }}>
              {account?.status === 'active' ? '● ACCOUNT ACTIVE' : '✕ SUSPENDED / FROZEN'}
            </span>
          </div>

          <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff', letterSpacing: '-0.02em' }}>
            ${account?.balance ? Number(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '124,500.00'}
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--line)', fontSize: '0.75rem' }}>
            <div>
              <span style={{ color: 'var(--dim)', display: 'block' }}>Routing (Wire/ACH)</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#ffffff' }}>{account?.routingNumber || '021000021'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--dim)', display: 'block' }}>Account Holder</span>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>{account?.name || 'Alice Smith'}</span>
            </div>
            <div>
              <span style={{ color: 'var(--dim)', display: 'block' }}>Autonomous Limit</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>$500.00 / call</span>
            </div>
          </div>
        </div>

        {/* Right: Titanium Card & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="metal-credit-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="metal-chip" />
                <span style={{ fontSize: '0.68rem', color: '#94a3b8', letterSpacing: '0.08em', fontWeight: 700 }}>DEBIT</span>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.04em', color: '#ffffff' }}>APEX PLATINUM</span>
            </div>

            <div>
              <div style={{
                fontSize: '1.1rem',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.16em',
                color: account?.status === 'suspended' ? 'var(--dim)' : '#f8fafc',
                marginBottom: '8px'
              }}>
                {account?.status === 'suspended' ? '•••• •••• •••• 9812 (FROZEN)' : '4582 9912 3841 9812'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontSize: '0.55rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Cardholder</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0' }}>{account?.name?.toUpperCase() || 'ALICE SMITH'}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.55rem', color: '#64748b', textTransform: 'uppercase', display: 'block' }}>Expires</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#e2e8f0' }}>09/29</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleFreezeToggle}
              disabled={freezing}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--line)',
                color: account?.status === 'active' ? 'var(--red)' : 'var(--green)',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              {account?.status === 'active' ? <Lock size={13} /> : <Unlock size={13} />}
              <span>{account?.status === 'active' ? 'Freeze Account & Card' : 'Unfreeze Account'}</span>
            </button>
            <button
              onClick={() => navigate('/finance')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'rgba(101, 231, 245, 0.1)',
                border: '1px solid rgba(101, 231, 245, 0.3)',
                color: 'var(--cyan)',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Bot size={13} />
              <span>Launch AI Finance Bot &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="console-card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Recent Transactions ({filteredTxns.length})
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--dim)', margin: '2px 0 0' }}>
              Every entry is verified by Cedar Policy before settlement
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Search memo or merchant..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--line)',
                color: '#ffffff',
                fontSize: '0.75rem'
              }}
            />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--line)',
                color: '#ffffff',
                fontSize: '0.75rem'
              }}
            >
              <option value="all" style={{ background: '#0d1119' }}>All Types</option>
              <option value="debit" style={{ background: '#0d1119' }}>Debits</option>
              <option value="credit" style={{ background: '#0d1119' }}>Credits</option>
              <option value="refund" style={{ background: '#0d1119' }}>Refunds</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filteredTxns.map(tx => (
            <div
              key={tx.id}
              onClick={() => setSelectedTxn(tx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--line)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'var(--line-bright)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'; e.currentTarget.style.borderColor = 'var(--line)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: tx.type === 'credit' ? 'rgba(109, 231, 174, 0.12)' : 'rgba(101, 231, 245, 0.12)',
                  display: 'grid',
                  placeItems: 'center',
                  color: tx.type === 'credit' ? 'var(--green)' : 'var(--cyan)'
                }}>
                  {tx.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                    {tx.memo}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--dim)', marginTop: '2px' }}>
                    {tx.merchantName} &bull; {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; Risk: {tx.riskScore}/100
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: tx.type === 'credit' ? 'var(--green)' : '#ffffff'
                }}>
                  {tx.type === 'credit' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: tx.status === 'disputed' ? 'rgba(255, 100, 124, 0.15)' : 'rgba(109, 231, 174, 0.12)',
                  color: tx.status === 'disputed' ? 'var(--red)' : 'var(--green)'
                }}>
                  {tx.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Details & Dispute Modal */}
      {selectedTxn && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          display: 'grid',
          placeItems: 'center',
          padding: '20px'
        }}>
          <div style={{ width: '100%', maxWidth: '460px', padding: '24px', borderRadius: '14px', background: '#0a0e19', border: '1px solid var(--line-bright)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Transaction Verification Detail
              </h3>
              <button onClick={() => setSelectedTxn(null)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            {disputeMsg ? (
              <div style={{ padding: '16px', borderRadius: '8px', background: 'rgba(109, 231, 174, 0.15)', color: 'var(--green)', fontSize: '0.8rem', textAlign: 'center' }}>
                ✓ {disputeMsg}
              </div>
            ) : (
              <>
                <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--line)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dim)' }}>TRANSACTION ID</div>
                  <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>{selectedTxn.id}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dim)', marginTop: '8px' }}>MEMO</div>
                  <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>{selectedTxn.memo}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dim)', marginTop: '8px' }}>SETTLEMENT AMOUNT</div>
                  <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#ffffff' }}>${Number(selectedTxn.amount).toFixed(2)} USD</div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleDispute(selectedTxn.id)}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      borderRadius: '8px',
                      background: 'rgba(255, 100, 124, 0.15)',
                      border: '1px solid rgba(255, 100, 124, 0.3)',
                      color: 'var(--red)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    File Dispute / Request Refund
                  </button>
                  <button
                    onClick={() => { setSelectedTxn(null); navigate('/audit'); }}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      borderRadius: '8px',
                      background: 'rgba(101, 231, 245, 0.1)',
                      border: '1px solid rgba(101, 231, 245, 0.3)',
                      color: 'var(--cyan)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    View in Audit Chain &rarr;
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
