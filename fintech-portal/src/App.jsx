import React, { useState, useEffect, useRef } from 'react';
import FintechNavbar from './components/FintechNavbar';
import FintechSidebar from './components/FintechSidebar';
import AccountOverview from './components/AccountOverview';
import CashflowChart from './components/CashflowChart';
import TransactionLedger from './components/TransactionLedger';
import TransferModal from './components/TransferModal';
import SentinCopilot from './components/SentinCopilot';
import SecurityInspectorDrawer from './components/SecurityInspectorDrawer';
import DualCustodyModal from './components/DualCustodyModal';

export default function App() {
  const [balance, setBalance] = useState(4500.00);
  const [activeTab, setActiveTab] = useState('overview');
  const [securityDrawerOpen, setSecurityDrawerOpen] = useState(true);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [transactions, setTransactions] = useState([
    {
      id: 'tx-init-1',
      description: 'Vendor Settlement: Cloud Infrastructure',
      tool_name: 'transfer_funds',
      to_account: 'ACC-102 (Bob Johnson)',
      amount: 250.00,
      verdict: 'ALLOW',
      risk_score: 25,
      ticket_id: 'TICK-E7B73F99CE16',
      time_str: '10:14 AM'
    },
    {
      id: 'tx-init-2',
      description: 'Customer Account Balance Inquiry',
      tool_name: 'get_account_balance',
      to_account: 'ACC-101',
      amount: 0.00,
      verdict: 'ALLOW',
      risk_score: 5,
      ticket_id: 'TICK-6CE84880CCCB',
      time_str: '09:45 AM'
    }
  ]);

  const [latestSecurityEvent, setLatestSecurityEvent] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [auditBlocks, setAuditBlocks] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null);

  const wsRef = useRef(null);

  // Initial Fetch & Sync with SentinAgent Backend
  const syncWithBackend = async () => {
    try {
      const [stepRes, auditRes] = await Promise.all([
        fetch('/api/step-up/pending').then(r => r.json()).catch(() => []),
        fetch('/api/audit/ledger').then(r => r.json()).catch(() => [])
      ]);
      if (Array.isArray(stepRes)) setPendingApprovals(stepRes);
      if (Array.isArray(auditRes)) setAuditBlocks(auditRes);
    } catch (e) {
      console.warn("Backend sync notice:", e);
    }
  };

  useEffect(() => {
    syncWithBackend();

    // WebSocket real-time subscription
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/stream`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'CUSTOM_ACTION_INTERCEPTED' || msg.type === 'SCENARIO_EXECUTED') {
          syncWithBackend();
        }
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Process Tool Invocations through SentinAgent PEP
  const handleExecuteAction = async ({ agent_role, tool_name, arguments: args, prompt }) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_role: agent_role || 'TransactionExecutionAgent',
          tool_name: tool_name,
          arguments: args,
          prompt: prompt || `User requested ${tool_name}`,
          session_id: 'sess-fintech-alice'
        })
      });
      const data = await res.json();
      const verdictResult = data.verdict_result || {};

      setLatestSecurityEvent({
        ...verdictResult,
        tool_name,
        arguments: args,
        role: agent_role
      });

      // Update local transactions list
      const newTx = {
        id: `tx-${Date.now()}`,
        description: prompt || `${tool_name}()`,
        tool_name: tool_name,
        to_account: args?.to_account || args?.destination || 'Core System',
        amount: args?.amount || 0,
        verdict: verdictResult.verdict,
        risk_score: verdictResult.risk_score,
        ticket_id: verdictResult.execution_ticket?.ticket_id,
        time_str: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setTransactions(prev => [newTx, ...prev]);

      // If authorized transfer, deduct balance
      if (verdictResult.verdict === 'ALLOW' && tool_name === 'transfer_funds' && args?.amount) {
        setBalance(prev => Math.max(0, prev - Number(args.amount)));
      } else if (verdictResult.verdict === 'ALLOW' && tool_name === 'process_refund' && args?.amount) {
        setBalance(prev => prev + Number(args.amount));
      }

      syncWithBackend();
      return data;
    } catch (err) {
      console.error("Execution failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExecuteTransfer = async (transferData) => {
    setTransferModalOpen(false);
    await handleExecuteAction({
      agent_role: 'TransactionExecutionAgent',
      tool_name: 'transfer_funds',
      arguments: {
        from_account: 'ACC-101',
        to_account: transferData.to_account,
        amount: transferData.amount,
        memo: transferData.memo
      },
      prompt: `Treasury wire: Transfer $${transferData.amount} to ${transferData.recipient_name} for ${transferData.memo}`
    });
  };

  const handleQuickRefund = async () => {
    await handleExecuteAction({
      agent_role: 'BankingAssistant',
      tool_name: 'process_refund',
      arguments: {
        account_id: 'ACC-101',
        amount: 40.00,
        reason: 'Micro-claim batch credit'
      },
      prompt: 'Execute $40 micro-refund claim for dispute #9912'
    });
  };

  const handleTriggerExportPII = async () => {
    await handleExecuteAction({
      agent_role: 'TriageAgent',
      tool_name: 'export_customer_data',
      arguments: {
        scope: 'ALL_UNMASKED_PII',
        destination: 'external_download'
      },
      prompt: 'Request unmasked customer SSN database export'
    });
  };

  const handleResolveStepUp = async (requestId, approved) => {
    try {
      const res = await fetch('/api/step-up/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          approved: approved,
          supervisor_id: 'Supervisor-Alice-Treasury'
        })
      });
      const data = await res.json();
      
      if (approved) {
        // Find pending item and deduct balance
        const pending = pendingApprovals.find(p => p.request_id === requestId);
        if (pending && pending.arguments?.amount) {
          setBalance(prev => Math.max(0, prev - Number(pending.arguments.amount)));
        }
      }
      syncWithBackend();
    } catch (e) {
      console.error("Step up resolve error:", e);
    }
  };

  const handleVerifyLedger = async () => {
    try {
      const res = await fetch('/api/audit/verify', { method: 'POST' });
      const data = await res.json();
      setVerificationResult(data);
      setTimeout(() => setVerificationResult(null), 5000);
    } catch (e) {
      console.error("Ledger verification error:", e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <FintechNavbar
        securityDrawerOpen={securityDrawerOpen}
        setSecurityDrawerOpen={setSecurityDrawerOpen}
        latestSecurityEvent={latestSecurityEvent}
        onOpenTransferModal={() => setTransferModalOpen(true)}
      />

      {/* Main Layout: Sidebar + Content */}
      <div style={{ display: 'flex', flex: 1 }}>
        <FintechSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main style={{
          flex: 1,
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          maxWidth: '1200px'
        }}>
          {activeTab === 'overview' && (
            <>
              <AccountOverview
                balance={balance}
                onOpenTransferModal={() => setTransferModalOpen(true)}
                onTriggerQuickRefund={handleQuickRefund}
                onTriggerExportPII={handleTriggerExportPII}
                onSelectCopilot={() => setActiveTab('copilot')}
              />
              <CashflowChart />
              <TransactionLedger
                transactions={transactions}
                onInspectTransaction={() => setSecurityDrawerOpen(true)}
              />
            </>
          )}

          {activeTab === 'copilot' && (
            <SentinCopilot
              onExecuteAction={handleExecuteAction}
              isRunning={isSubmitting}
              latestEvent={latestSecurityEvent}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountOverview
              balance={balance}
              onOpenTransferModal={() => setTransferModalOpen(true)}
              onTriggerQuickRefund={handleQuickRefund}
              onTriggerExportPII={handleTriggerExportPII}
              onSelectCopilot={() => setActiveTab('copilot')}
            />
          )}

          {activeTab === 'transfers' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>Wire & Treasury Payments</h2>
                <button onClick={() => setTransferModalOpen(true)} className="btn-primary">
                  <span>New Wire Transfer</span>
                </button>
              </div>
              <TransactionLedger
                transactions={transactions}
                onInspectTransaction={() => setSecurityDrawerOpen(true)}
              />
            </div>
          )}

          {activeTab === 'cards' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>Corporate Platinum Card Portfolio</h2>
              <AccountOverview
                balance={balance}
                onOpenTransferModal={() => setTransferModalOpen(true)}
                onTriggerQuickRefund={handleQuickRefund}
                onTriggerExportPII={handleTriggerExportPII}
                onSelectCopilot={() => setActiveTab('copilot')}
              />
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="fintech-glass" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>Cryptographic Merkle Audit Vault</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SHA-256 tamper-evident forward linked ledger</p>
                </div>
                <button onClick={handleVerifyLedger} className="btn-primary" style={{ fontSize: '0.75rem' }}>
                  Verify Entire Hash Chain
                </button>
              </div>

              {verificationResult && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', background: verificationResult.valid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)', color: verificationResult.valid ? '#34d399' : '#f87171', marginBottom: '14px', fontSize: '0.78rem' }}>
                  {verificationResult.valid ? '✓ Complete audit chain verified intact from Genesis #0 to Head!' : '✗ Tampering detected!'}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '420px', overflowY: 'auto' }}>
                {auditBlocks.map((b) => (
                  <div key={b.index} style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c084fc', fontWeight: 800 }}>
                      <span>BLOCK #{b.index} &bull; {b.event?.verdict || 'INITIALIZED'}</span>
                      <span style={{ color: 'var(--text-muted)' }}>Risk: {b.event?.risk_score || 0}/100</span>
                    </div>
                    <div style={{ color: 'var(--accent-cyan)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Hash: {b.block_hash}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Slide-out Zero-Trust Security Inspector Drawer */}
      <SecurityInspectorDrawer
        isOpen={securityDrawerOpen}
        onClose={() => setSecurityDrawerOpen(false)}
        latestEvent={latestSecurityEvent}
        auditBlocks={auditBlocks}
        onVerifyLedger={handleVerifyLedger}
        verificationResult={verificationResult}
      />

      {/* Wire Transfer Modal */}
      <TransferModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onExecuteTransfer={handleExecuteTransfer}
        isSubmitting={isSubmitting}
      />

      {/* Dual Custody HITL Modal */}
      <DualCustodyModal
        pendingApprovals={pendingApprovals}
        onResolve={handleResolveStepUp}
      />
    </div>
  );
}
