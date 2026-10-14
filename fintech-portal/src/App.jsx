import React, { useState, useEffect, useRef } from 'react';
import TopUtilityBar from './components/TopUtilityBar';
import BankNavbar from './components/BankNavbar';
import AccountsView from './components/AccountsView';
import PayAndTransferView from './components/PayAndTransferView';
import CardManagementView from './components/CardManagementView';
import FinancialHealthView from './components/FinancialHealthView';
import StatementsView from './components/StatementsView';
import SecurityCenterView from './components/SecurityCenterView';
import TransferModal from './components/TransferModal';
import MobileDepositModal from './components/MobileDepositModal';
import TransactionDetailModal from './components/TransactionDetailModal';
import SecurityInspectorDrawer from './components/SecurityInspectorDrawer';
import DualCustodyModal from './components/DualCustodyModal';
import AIConciergeWidget from './components/AIConciergeWidget';
import confetti from 'canvas-confetti';

export default function App() {
  const [activePortal, setActivePortal] = useState('personal');
  const [activeTab, setActiveTab] = useState('accounts');
  const [isCardFrozen, setIsCardFrozen] = useState(false);

  // Modals state
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [securityDrawerOpen, setSecurityDrawerOpen] = useState(false);
  const [stepUpRequest, setStepUpRequest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Accounts state
  const [accounts, setAccounts] = useState([
    {
      id: 'ACC-101',
      name: 'Advantage Plus Checking',
      accountType: 'Personal Checking',
      category: 'checking',
      balance: 28450.75,
      routingNumber: '021000021'
    },
    {
      id: 'ACC-102',
      name: 'Advantage High-Yield Savings',
      accountType: 'Preferred Savings',
      category: 'savings',
      balance: 94120.00,
      apy: '4.35%'
    },
    {
      id: 'ACC-9024',
      name: 'Customized Cash Rewards Visa',
      accountType: 'Credit Card',
      type: 'credit',
      category: 'credit',
      balance: 1420.50,
      limit: 30000.00,
      cashback: 485.20
    },
    {
      id: 'ACC-1104',
      name: 'Treasury Reserve Wealth Portfolio',
      accountType: 'Investment Account',
      type: 'investment',
      category: 'investment',
      balance: 46850.00,
      ytdReturn: '+11.2%'
    }
  ]);

  // Transactions Ledger
  const [transactions, setTransactions] = useState([
    {
      id: 'TXN-9021',
      description: 'Meridian Corp Corporate Payroll Direct Deposit',
      category: 'Payroll & Income',
      tool_name: 'direct_deposit',
      to_account: 'Advantage Checking (...4819)',
      amount: 9450.00,
      verdict: 'ALLOW',
      risk_score: 5,
      ticket_id: 'TICK-99A10-PAYROLL',
      time_str: 'Today, 08:30 AM',
      type: 'credit'
    },
    {
      id: 'TXN-9020',
      description: 'AWS Cloud Infrastructure - Monthly Hosting',
      category: 'Cloud Infrastructure',
      tool_name: 'transfer_funds',
      to_account: 'ACC-102 (AWS Cloud)',
      amount: -250.00,
      verdict: 'ALLOW',
      risk_score: 12,
      ticket_id: 'TICK-E7B73F99CE16',
      time_str: 'Yesterday, 03:14 PM',
      type: 'debit'
    },
    {
      id: 'TXN-9019',
      description: 'Linear Orbit SaaS Tooling Subscription #4821',
      category: 'Software & Tools',
      tool_name: 'transfer_funds',
      to_account: 'Linear Orbit Inc',
      amount: -29.50,
      verdict: 'ALLOW',
      risk_score: 8,
      ticket_id: 'TICK-6CE84880CCCB',
      time_str: 'Oct 12, 11:20 AM',
      type: 'debit'
    },
    {
      id: 'TXN-9018',
      description: 'Emergency Contractor Hardware Wire Settlement',
      category: 'Hardware Operations',
      tool_name: 'transfer_funds',
      to_account: 'Acme Hardware Supplies',
      amount: -1250.00,
      verdict: 'STEP_UP_REQUIRED',
      risk_score: 65,
      ticket_id: 'REQ-A8824-STEPUP',
      time_str: 'Oct 11, 04:45 PM',
      type: 'debit'
    },
    {
      id: 'TXN-9017',
      description: 'Whole Foods Market Organic Groceries',
      category: 'Groceries & Dining',
      tool_name: 'pos_purchase',
      to_account: 'Cash Rewards Visa (...9024)',
      amount: -184.20,
      verdict: 'ALLOW',
      risk_score: 10,
      ticket_id: 'TICK-POS-8812',
      time_str: 'Oct 10, 06:12 PM',
      type: 'debit'
    }
  ]);

  const [latestSecurityEvent, setLatestSecurityEvent] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [auditBlocks, setAuditBlocks] = useState([]);

  // Handle Internal & Wire Transfers
  const handleExecuteAction = async ({ agent_role, tool_name, arguments: args, prompt }) => {
    setIsSubmitting(true);
    const amountVal = parseFloat(args.amount || 0);

    // If transfer exceeds $500, trigger Step-Up
    if (amountVal > 500) {
      const stepReq = {
        request_id: `REQ-${Date.now().toString(36).toUpperCase()}`,
        tool_name: tool_name,
        arguments: args,
        amount: amountVal,
        agent_id: 'agent-llama70b-live',
        role: agent_role || 'TransactionExecutionAgent',
        risk_score: 65,
        risk_factors: [`High-value transaction: $${amountVal.toFixed(2)} exceeds $500.00 autonomous threshold`]
      };
      setStepUpRequest(stepReq);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_role: agent_role || 'TransactionExecutionAgent',
          tool_name: tool_name,
          arguments: args,
          prompt: prompt || `User transfer request`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setLatestSecurityEvent(data);
      }
    } catch (e) {
      // Local fallback
    }

    // Update balances locally
    setAccounts(prev => prev.map(acc => {
      if (acc.id === args.from_account) return { ...acc, balance: Math.max(0, acc.balance - amountVal) };
      if (acc.id === args.to_account) return { ...acc, balance: acc.balance + amountVal };
      return acc;
    }));

    // Add transaction to ledger
    setTransactions(prev => [
      {
        id: `TXN-${Date.now().toString(36).toUpperCase()}`,
        description: args.memo || `Transfer to ${args.to_account}`,
        category: 'Account Transfer',
        tool_name: tool_name,
        to_account: args.to_account,
        amount: -amountVal,
        verdict: 'ALLOW',
        risk_score: 15,
        ticket_id: `TICK-${Date.now().toString(16).toUpperCase()}`,
        time_str: 'Just now',
        type: 'debit'
      },
      ...prev
    ]);

    setIsSubmitting(false);
    setTransferModalOpen(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  // Step-Up Approval Resolution
  const handleResolveStepUp = (approved) => {
    if (approved && stepUpRequest) {
      const amt = stepUpRequest.amount;
      setAccounts(prev => prev.map(acc => {
        if (acc.id === stepUpRequest.arguments.from_account) return { ...acc, balance: Math.max(0, acc.balance - amt) };
        if (acc.id === stepUpRequest.arguments.to_account) return { ...acc, balance: acc.balance + amt };
        return acc;
      }));

      setTransactions(prev => [
        {
          id: `TXN-${Date.now().toString(36).toUpperCase()}`,
          description: stepUpRequest.arguments.memo || `Approved Transfer to ${stepUpRequest.arguments.to_account}`,
          category: 'Approved Wire',
          tool_name: stepUpRequest.tool_name,
          to_account: stepUpRequest.arguments.to_account,
          amount: -amt,
          verdict: 'ALLOW',
          risk_score: 65,
          ticket_id: `TICK-APPROVED-${Date.now().toString(16).toUpperCase()}`,
          time_str: 'Just now (Dual-Custody Approved)',
          type: 'debit'
        },
        ...prev
      ]);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
    setStepUpRequest(null);
  };

  // Mobile Deposit Resolution
  const handleDepositSuccess = ({ amount: depositAmount, account }) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === account) return { ...acc, balance: acc.balance + depositAmount };
      return acc;
    }));

    setTransactions(prev => [
      {
        id: `TXN-DEP-${Date.now().toString(36).toUpperCase()}`,
        description: 'Mobile Check Deposit (Cleared Endorsement)',
        category: 'Check Deposit',
        tool_name: 'mobile_check_deposit',
        to_account: 'Advantage Checking (...4819)',
        amount: depositAmount,
        verdict: 'ALLOW',
        risk_score: 10,
        ticket_id: `TICK-CHECK-${Date.now().toString(16).toUpperCase()}`,
        time_str: 'Just now',
        type: 'credit'
      },
      ...prev
    ]);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      {/* 1. TOP UTILITY BAR (FDIC, Portal Switcher, Locator) */}
      <TopUtilityBar activePortal={activePortal} onSelectPortal={setActivePortal} />

      {/* 2. MAIN BANK NAVBAR (Logo Placeholder, Tabs, Quick Actions, Profile) */}
      <BankNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTransferModal={() => setTransferModalOpen(true)}
        onOpenBillPayModal={() => { setActiveTab('transfer'); }}
        onToggleSecurityDrawer={() => setSecurityDrawerOpen(!securityDrawerOpen)}
        notificationCount={3}
      />

      {/* 3. PRIMARY CONTENT STAGE */}
      <main style={{ flex: 1, padding: '32px', maxWidth: '1440px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {activeTab === 'accounts' && (
          <AccountsView
            accounts={accounts}
            transactions={transactions}
            onOpenTransferModal={() => setTransferModalOpen(true)}
            onOpenZelleModal={() => { setActiveTab('transfer'); }}
            onOpenBillPayModal={() => { setActiveTab('transfer'); }}
            onOpenDepositModal={() => setDepositModalOpen(true)}
            onSelectTransaction={tx => setSelectedTransaction(tx)}
            onToggleFreezeCard={() => setIsCardFrozen(!isCardFrozen)}
            isCardFrozen={isCardFrozen}
          />
        )}

        {activeTab === 'transfer' && (
          <PayAndTransferView
            accounts={accounts}
            onExecuteTransfer={handleExecuteAction}
            onOpenStepUp={setStepUpRequest}
          />
        )}

        {activeTab === 'cards' && (
          <CardManagementView
            isCardFrozen={isCardFrozen}
            onToggleFreezeCard={() => setIsCardFrozen(!isCardFrozen)}
          />
        )}

        {activeTab === 'invest' && (
          <FinancialHealthView />
        )}

        {activeTab === 'security' && (
          <SecurityCenterView />
        )}

        {activeTab === 'statements' && (
          <StatementsView />
        )}
      </main>

      {/* ============================================================== */}
      {/* 4. MODALS & SLIDE-IN DRAWERS                                   */}
      {/* ============================================================== */}

      {/* Transfer Funds Modal */}
      <TransferModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        onExecute={handleExecuteAction}
        isSubmitting={isSubmitting}
      />

      {/* Mobile Check Deposit Modal */}
      <MobileDepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onDepositSuccess={handleDepositSuccess}
      />

      {/* Transaction Detail Receipt Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onDisputeTransaction={tx => alert(`Dispute submitted for transaction ${tx.id}. An investigation ticket has been opened.`)}
      />

      {/* Dual Custody Approval Modal (Step-Up Floor) */}
      <DualCustodyModal
        isOpen={!!stepUpRequest}
        approvalRequest={stepUpRequest}
        onResolve={handleResolveStepUp}
      />

      {/* Security Inspector Drawer */}
      <SecurityInspectorDrawer
        isOpen={securityDrawerOpen}
        onClose={() => setSecurityDrawerOpen(false)}
        latestEvent={latestSecurityEvent}
        pendingApprovals={pendingApprovals}
        auditBlocks={auditBlocks}
      />

      {/* 5. FLOATING AI BANKING CONCIERGE (Llama 70B & Sentinel Gated) */}
      <AIConciergeWidget
        accounts={accounts}
        isCardFrozen={isCardFrozen}
        onToggleFreezeCard={() => setIsCardFrozen(!isCardFrozen)}
      />
    </div>
  );
}
