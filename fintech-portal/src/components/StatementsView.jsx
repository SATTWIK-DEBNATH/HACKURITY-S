import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Shield,
  Search,
  Lock,
  Copy,
  Check
} from 'lucide-react';

export default function StatementsView() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedDocType, setSelectedDocType] = useState('STATEMENTS'); // 'STATEMENTS', 'TAX', 'DEPOSIT'
  const [copiedRouting, setCopiedRouting] = useState(false);

  const statements = [
    { id: 'stmt-09-26', month: 'September 2026', date: 'Sep 30, 2026', size: '2.4 MB', accounts: 'Advantage Checking (...4819), Savings (...3391)' },
    { id: 'stmt-08-26', month: 'August 2026', date: 'Aug 31, 2026', size: '2.1 MB', accounts: 'Advantage Checking (...4819), Savings (...3391)' },
    { id: 'stmt-07-26', month: 'July 2026', date: 'Jul 31, 2026', size: '2.6 MB', accounts: 'Advantage Checking (...4819), Savings (...3391)' },
    { id: 'stmt-06-26', month: 'June 2026', date: 'Jun 30, 2026', size: '1.9 MB', accounts: 'Advantage Checking (...4819), Savings (...3391)' },
    { id: 'stmt-05-26', month: 'May 2026', date: 'May 31, 2026', size: '2.3 MB', accounts: 'Advantage Checking (...4819), Savings (...3391)' }
  ];

  const taxDocuments = [
    { id: 'tax-1099-25', name: 'Form 1099-INT (Interest Income)', taxYear: '2025', interestEarned: '$3,842.10', status: 'Available' },
    { id: 'tax-1099-div', name: 'Form 1099-DIV (Dividend & Distributions)', taxYear: '2025', interestEarned: '$2,190.50', status: 'Available' },
    { id: 'tax-1099-b', name: 'Form 1099-B (Proceeds from Broker Transactions)', taxYear: '2025', interestEarned: '$14,250.00', status: 'Available' }
  ];

  const handleCopyRouting = () => {
    navigator.clipboard?.writeText('021000021');
    setCopiedRouting(true);
    setTimeout(() => setCopiedRouting(false), 2000);
  };

  const handleDownloadStatement = (stmt) => {
    // Generate clean banking statement text file for immediate download
    const content = `========================================================================\nMERIDIAN APEX PRIVATE BANK & TRUST — OFFICIAL ACCOUNT STATEMENT\nStatement Period: ${stmt.month}\nAccount Holder: Alexander Vance\nAccount Number: ****-****-****-4819\nRouting / ABA: 021000021\nStatement Date: ${stmt.date}\n========================================================================\n\nSUMMARY OF DEPOSIT ACCOUNTS:\n1. Advantage Checking (...4819): $28,450.75 (Available) / $28,700.75 (Ledger)\n2. Advantage Savings (...3391):  $94,120.00 (4.35% APY)\n3. Signature Rewards Visa:       -$1,420.50 (Paid in Full)\n\nTRANSACTIONS LOGGED: 48 Cleared Debits / 12 Credits\nTotal Deposits: +$18,400.00\nTotal Withdrawals: -$12,650.00\n\nNIST SP 800-207 Zero-Trust Authorization Signature:\nSHA-256 Merkle Block Hash: e8b9f10a8c2d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8\nMember FDIC. Equal Housing Lender. © 2026 Meridian Apex Bank.\n========================================================================`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Meridian_Apex_Statement_${stmt.month.replace(' ', '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Top Banner */}
      <div className="fintech-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>Statements & Document Center</h1>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              Access official monthly bank statements, IRS tax forms (1099-INT), and pre-filled Direct Deposit authorization forms.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['STATEMENTS', 'TAX', 'DEPOSIT'].map(t => (
              <button
                key={t}
                onClick={() => setSelectedDocType(t)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: selectedDocType === t ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedDocType === t ? '#38bdf8' : '#94a3b8',
                  border: `1px solid ${selectedDocType === t ? 'rgba(56, 189, 248, 0.3)' : 'var(--border-subtle)'}`
                }}
              >
                {t === 'STATEMENTS' ? 'e-Statements' : t === 'TAX' ? 'Tax Documents (1099)' : 'Direct Deposit Form'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. MONTHLY E-STATEMENTS                                        */}
      {/* ============================================================== */}
      {selectedDocType === 'STATEMENTS' && (
        <div className="fintech-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              Available Monthly Account Statements
            </h2>

            <div style={{ display: 'flex', gap: '6px' }}>
              {['2026', '2025', '2024'].map(y => (
                <button
                  key={y}
                  onClick={() => setSelectedYear(y)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: selectedYear === y ? '#38bdf8' : 'rgba(255, 255, 255, 0.05)',
                    color: selectedYear === y ? '#000' : '#94a3b8',
                    border: 'none'
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {statements.map(stmt => (
              <div
                key={stmt.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8'
                  }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff' }}>{stmt.month}</div>
                    <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '2px' }}>
                      Period closed {stmt.date} &bull; {stmt.size} &bull; PDF format
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadStatement(stmt)}
                  className="btn-primary"
                  style={{ fontSize: '0.78rem', padding: '8px 14px' }}
                >
                  <Download size={14} />
                  <span>Download Statement</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. TAX DOCUMENTS (1099)                                        */}
      {/* ============================================================== */}
      {selectedDocType === 'TAX' && (
        <div className="fintech-card" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            Tax Documents & Reporting Forms
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '20px' }}>
            Official IRS 1099-INT interest and 1099-DIV dividend distribution statements for tax filing.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {taxDocuments.map(doc => (
              <div
                key={doc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>{doc.name}</div>
                  <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '2px' }}>
                    Tax Year: {doc.taxYear} &bull; Total Reported: {doc.interestEarned}
                  </div>
                </div>

                <button
                  onClick={() => alert(`Downloading IRS ${doc.name} for tax year ${doc.taxYear}...`)}
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '8px 14px' }}
                >
                  <Download size={14} />
                  <span>Download IRS Form</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. DIRECT DEPOSIT FORM                                         */}
      {/* ============================================================== */}
      {selectedDocType === 'DEPOSIT' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
          <div className="fintech-card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
              Direct Deposit Authorization Form
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '20px' }}>
              Provide this official authorization to your employer, payroll provider, or government agency to receive paycheck deposits up to 2 days early.
            </p>

            <div style={{
              padding: '24px',
              borderRadius: '12px',
              background: '#040711',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Bank Name:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Meridian Apex Private Bank & Trust</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ABA Routing Number:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>021000021</span>
                  <button onClick={handleCopyRouting} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    {copiedRouting ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Account Number:</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>99120482910</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Account Type:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981' }}>Checking (DDA)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Account Holder:</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Alexander Vance</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={() => alert("Printing Official Pre-filled Direct Deposit Form...")}
                className="btn-primary"
                style={{ padding: '11px 20px', fontSize: '0.85rem' }}
              >
                <Printer size={15} />
                <span>Print Pre-filled Form</span>
              </button>
              <button
                onClick={() => alert("Downloading PDF Direct Deposit Packet...")}
                className="btn-secondary"
                style={{ padding: '11px 18px', fontSize: '0.85rem' }}
              >
                <Download size={15} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          <div className="fintech-card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>Early Paycheck Advantage</h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6 }}>
              Receive eligible payroll funds up to 2 days prior to standard scheduled settlement date at no additional fee.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
