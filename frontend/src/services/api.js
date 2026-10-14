// MCP Sentinel Unified Client API Service
// Connects to /api endpoints when backend is available,
// with comprehensive deterministic mock state fallback for high-fidelity offline execution.

class MockStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.accounts = [
      {
        id: 'ACC-1001',
        name: 'Alice Smith',
        email: 'alice.smith@meridian.corp',
        balance: 124500.00,
        currency: 'USD',
        status: 'active',
        createdAt: '2024-01-15T08:00:00Z',
        accountNumber: 'ACC-1001-9982',
        routingNumber: '021000021',
        accountType: 'checking',
        tier: 'Platinum Enterprise',
        dailyLimit: 25000,
        creditScore: 785
      },
      {
        id: 'ACC-1002',
        name: 'Bob Johnson',
        email: 'bob.johnson@acme-supplies.io',
        balance: 4250.00,
        currency: 'USD',
        status: 'active',
        createdAt: '2024-03-10T11:30:00Z',
        accountNumber: 'ACC-1002-3319',
        routingNumber: '021000021',
        accountType: 'checking',
        tier: 'Verified Supplier',
        dailyLimit: 10000,
        creditScore: 720
      }
    ];

    this.transactions = [
      {
        id: 'TXN-2001',
        accountId: 'ACC-1001',
        type: 'debit',
        amount: 250.00,
        currency: 'USD',
        memo: 'AWS Cloud Infrastructure - Monthly Hosting',
        merchantName: 'Amazon Web Services',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: 'completed',
        riskScore: 12,
        category: 'cloud_services',
        channel: 'online'
      },
      {
        id: 'TXN-2002',
        accountId: 'ACC-1001',
        type: 'debit',
        amount: 29.50,
        currency: 'USD',
        memo: 'SaaS Tooling Subscription #4821',
        merchantName: 'Linear Orbit Inc',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: 'completed',
        riskScore: 8,
        category: 'software',
        channel: 'online'
      },
      {
        id: 'TXN-2003',
        accountId: 'ACC-1001',
        type: 'debit',
        amount: 1250.00,
        currency: 'USD',
        memo: 'Emergency Contractor Hardware Wire',
        merchantName: 'Acme Hardware Supplies',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: 'completed',
        riskScore: 45,
        category: 'contractor_wire',
        channel: 'wire'
      },
      {
        id: 'TXN-2004',
        accountId: 'ACC-1001',
        type: 'credit',
        amount: 18400.00,
        currency: 'USD',
        memo: 'Client Invoice Settlement #8841',
        merchantName: 'Meridian Capital Partners',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
        status: 'completed',
        riskScore: 5,
        category: 'receivables',
        channel: 'wire'
      }
    ];

    this.approvals = [];
    this.circuitBreakerState = 'NORMAL';
    this.quarantinedAgent = null;

    this.auditEvents = [
      {
        id: 'EVT-9001',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        correlationId: 'corr-init-001',
        agentIdentity: 'spiffe://demo.local/agent/finance-assistant',
        toolName: 'read_account',
        action: 'account:read',
        resourceId: 'ACC-1001',
        eventType: 'AUTHORIZATION_DECISION',
        decision: 'ALLOW',
        policyId: 'cedar_policy_01_read_account',
        riskAssessment: { overallScore: 8, level: 'LOW', factors: ['Trusted agent role', 'Read-only operation'] },
        previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
        eventHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      },
      {
        id: 'EVT-9002',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        correlationId: 'corr-init-002',
        agentIdentity: 'spiffe://demo.local/agent/finance-assistant',
        toolName: 'transfer_funds',
        action: 'funds:transfer',
        resourceId: 'ACC-1002',
        eventType: 'AUTHORIZATION_DECISION',
        decision: 'ALLOW',
        policyId: 'cedar_policy_02_transfer_funds',
        riskAssessment: { overallScore: 18, level: 'LOW', factors: ['Transfer amount ($250) <= $500 threshold'] },
        previousHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        eventHash: '8b7f2bb1a8a34d8e8749a4f61f71a7428782a4d33932cfeb40d437a34e0293a1'
      },
      {
        id: 'EVT-9003',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        correlationId: 'corr-init-003',
        agentIdentity: 'spiffe://demo.local/agent/untrusted-triage',
        toolName: 'export_customer_data',
        action: 'data:export',
        resourceId: 'DATABASE_CUSTOMERS',
        eventType: 'AUTHORIZATION_DECISION',
        decision: 'DENY',
        policyId: 'cedar_policy_05_forbid_pii_export',
        riskAssessment: { overallScore: 92, level: 'CRITICAL', factors: ['Unmasked PII export attempt', 'Untrusted sink destination'] },
        previousHash: '8b7f2bb1a8a34d8e8749a4f61f71a7428782a4d33932cfeb40d437a34e0293a1',
        eventHash: '39a2f7c0411a7bb296a2e921d7b1f3c399580b2d69904975d03a110a221f7c39'
      }
    ];

    this.policies = [
      {
        name: '01_read_account.cedar',
        loadedAt: '2024-10-14T08:00:00Z',
        content: `// Policy 1: Allow Finance Assistant to read customer accounts\npermit(\n  principal in Role::"FinanceAssistant",\n  action in [Action::"read_account", Action::"list_transactions"],\n  resource in ResourceType::"Account"\n) when {\n  context.identity_verified == true\n};`
      },
      {
        name: '02_issue_refund.cedar',
        loadedAt: '2024-10-14T08:00:00Z',
        content: `// Policy 2: Autonomous Refund Threshold (Max $50.00)\npermit(\n  principal in Role::"FinanceAssistant",\n  action == Action::"issue_refund",\n  resource in ResourceType::"Transaction"\n) when {\n  context.amount <= 50.00 &&\n  context.identity_verified == true\n};`
      },
      {
        name: '03_step_up_approval.cedar',
        loadedAt: '2024-10-14T08:00:00Z',
        content: `// Policy 3: HITL Step-Up Gate for Refunds > $50.00\npermit(\n  principal in Role::"FinanceAssistant",\n  action == Action::"issue_refund",\n  resource in ResourceType::"Transaction"\n) when {\n  context.amount > 50.00 &&\n  context.human_approval_signature != ""\n};`
      },
      {
        name: '04_sandbox_isolation.cedar',
        loadedAt: '2024-10-14T08:00:00Z',
        content: `// Policy 4: Absolute Forbid on Destructive Database DDL\nforbid(\n  principal,\n  action in [Action::"drop_table", Action::"truncate_table"],\n  resource in ResourceType::"Database"\n);`
      },
      {
        name: '05_forbid_pii_export.cedar',
        loadedAt: '2024-10-14T08:00:00Z',
        content: `// Policy 5: Strict Data Loss Prevention (PII Export)\nforbid(\n  principal,\n  action == Action::"export_customer_data",\n  resource in ResourceType::"CustomerRecord"\n) when {\n  context.destination != "internal_audit_vault"\n};`
      }
    ];

    this.identities = [
      {
        name: 'Financial Remediation Agent',
        uri: 'spiffe://demo.local/agent/financial-remediation',
        tokens: [
          {
            id: 'tok-9921-a',
            scope: 'ledger.read, ledger.refund',
            issuedAt: '2024-10-14T08:00:00Z',
            expiresAt: '2024-10-15T08:00:00Z',
            status: 'ACTIVE',
            algorithm: 'EdDSA (Ed25519)'
          }
        ]
      },
      {
        name: 'Customer Service Triage Bot',
        uri: 'spiffe://demo.local/agent/triage-bot',
        tokens: [
          {
            id: 'tok-4412-b',
            scope: 'tickets.read, inquiry.submit',
            issuedAt: '2024-10-14T09:00:00Z',
            expiresAt: '2024-10-14T21:00:00Z',
            status: 'ACTIVE',
            algorithm: 'EdDSA (Ed25519)'
          }
        ]
      }
    ];

    this.incidents = [
      {
        id: 'INC-301',
        sessionId: 'sess-attack-demo-01',
        agentIdentity: 'spiffe://demo.local/agent/injected-agent',
        severity: 'HIGH',
        description: 'Prompt injection attempted via invoice memo to exfiltrate unmasked customer SSN database.',
        detectedAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        status: 'CONTAINED',
        eventChain: [
          { eventId: 'EVT-9003', timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), toolName: 'export_customer_data', eventType: 'AUTHORIZATION_DECISION', decision: 'DENY' }
        ]
      }
    ];
  }
}

const mockStore = new MockStore();

// Live SSE or Mock Subscription
export function useSSE(callback) {
  return {
    connect: () => {
      // If window.EventSource supported, attempt /api/events/stream
      try {
        const es = new EventSource('/api/events/stream');
        es.onmessage = (e) => {
          try { callback(JSON.parse(e.data)); } catch { /* ignore */ }
        };
        return () => es.close();
      } catch {
        return () => {};
      }
    },
    disconnect: () => {}
  };
}

export const api = {
  getHealth: async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) return await res.json();
    } catch { /* fallback */ }
    return { status: 'ONLINE', policyEngineReady: true, version: '1.0.0-zta' };
  },

  getMetrics: async () => {
    try {
      const res = await fetch('/api/metrics');
      if (res.ok) return await res.json();
    } catch { /* fallback */ }
    const total = mockStore.auditEvents.length;
    const allowed = mockStore.auditEvents.filter(e => e.decision === 'ALLOW').length;
    const blocked = mockStore.auditEvents.filter(e => e.decision === 'DENY').length;
    return {
      totalInvocations: total + 1280,
      allowedRequests: allowed + 1242,
      blockedRequests: blocked + 38,
      approvalRequired: mockStore.approvals.filter(a => a.status === 'pending').length,
      distinctAgents: 4,
      activeIncidents: mockStore.incidents.filter(i => i.status !== 'RESOLVED').length,
      recentViolations: 3,
      avgAuthzLatencyMs: 1.84,
      p50LatencyMs: 1.25,
      p95LatencyMs: 2.80,
      p99LatencyMs: 4.15
    };
  },

  getEvents: async (params = {}) => {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`/api/events?${qs}`);
      if (res.ok) return await res.json();
    } catch { /* fallback */ }
    let events = [...mockStore.auditEvents];
    if (params.decision) events = events.filter(e => e.decision === params.decision);
    if (params.tool) events = events.filter(e => e.toolName === params.tool);
    return { events };
  },

  getEvent: async (id) => {
    const found = mockStore.auditEvents.find(e => e.id === id);
    return found || mockStore.auditEvents[0];
  },

  verifyIntegrity: async () => {
    try {
      const res = await fetch('/api/audit/verify', { method: 'POST' });
      if (res.ok) return await res.json();
    } catch { /* fallback */ }
    return { valid: true, brokenAt: null, checkedCount: mockStore.auditEvents.length };
  },

  getPolicies: async () => {
    try {
      const res = await fetch('/api/cedar/policies');
      if (res.ok) {
        const data = await res.json();
        if (data.policies) {
          return {
            policies: [{ name: 'sentinagent_rules.cedar', loadedAt: new Date().toISOString(), content: data.policies }]
          };
        }
      }
    } catch { /* fallback */ }
    return { policies: mockStore.policies };
  },

  updatePolicy: async (filename, content) => {
    const existing = mockStore.policies.find(p => p.name === filename);
    if (existing) {
      existing.content = content;
      existing.loadedAt = new Date().toISOString();
    } else {
      mockStore.policies.push({ name: filename, content, loadedAt: new Date().toISOString() });
    }
    return { success: true };
  },

  validatePolicy: async (content) => {
    const hasPermitOrForbid = content.includes('permit') || content.includes('forbid');
    return { valid: hasPermitOrForbid, errors: hasPermitOrForbid ? [] : ['Policy must contain permit or forbid statement'] };
  },

  generatePolicy: async (prompt) => {
    return {
      prompt,
      generatedPolicy: `// Auto-generated Cedar Policy for: ${prompt}\npermit(\n  principal in Role::"FinanceAssistant",\n  action == Action::"custom_action",\n  resource in ResourceType::"ProtectedResource"\n) when {\n  context.risk_score <= 30\n};`,
      explanation: 'Evaluated intent and synthesized default-deny permit constraint scoped by principal role and risk score threshold.',
      valid: true
    };
  },

  getIdentities: async () => {
    return { identities: mockStore.identities };
  },

  issueToken: async (params) => {
    const newToken = {
      id: `tok-${Date.now().toString(36)}`,
      scope: params.scope || 'ledger.read',
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      status: 'ACTIVE',
      algorithm: 'EdDSA (Ed25519)'
    };
    if (mockStore.identities[0]) {
      mockStore.identities[0].tokens.unshift(newToken);
    }
    return { success: true, token: newToken };
  },

  revokeToken: async (tokenId, reason) => {
    for (const id of mockStore.identities) {
      const tok = id.tokens.find(t => t.id === tokenId);
      if (tok) {
        tok.status = 'REVOKED';
        tok.revocationReason = reason;
      }
    }
    return { success: true };
  },

  getIncidents: async () => {
    return { incidents: mockStore.incidents };
  },

  getCircuitBreaker: async () => {
    return {
      statuses: [
        {
          agentIdentity: 'spiffe://demo.local/agent/financial-remediation',
          state: mockStore.circuitBreakerState,
          failureCount: mockStore.circuitBreakerState === 'QUARANTINED' ? 3 : 0,
          maxFailures: 3,
          quarantinedAt: mockStore.circuitBreakerState === 'QUARANTINED' ? new Date().toISOString() : null
        }
      ]
    };
  },

  resetCircuitBreaker: async () => {
    mockStore.circuitBreakerState = 'NORMAL';
    mockStore.quarantinedAgent = null;
    return { success: true };
  },

  getApprovals: async () => {
    return { approvals: mockStore.approvals };
  },

  decideApproval: async (id, decision, decidedBy = 'security-admin@demo.local') => {
    const app = mockStore.approvals.find(a => a.id === id);
    if (app) {
      app.status = decision === 'approve' ? 'approved' : 'rejected';
      app.decidedBy = decidedBy;
      app.decidedAt = new Date().toISOString();
    }
    return { success: true, approval: app };
  },

  // Account Portal APIs
  getAccounts: async () => {
    return { accounts: mockStore.accounts };
  },

  getAccount: async (id) => {
    const acct = mockStore.accounts.find(a => a.id === id) || mockStore.accounts[0];
    const txns = mockStore.transactions.filter(t => t.accountId === acct.id);
    return { account: acct, transactions: txns };
  },

  getAnalytics: async (id) => {
    return {
      monthlyInflow: 24800.00,
      monthlyOutflow: 8900.00,
      netYield: 4.2,
      riskTrend: [
        { day: 'Mon', score: 10 },
        { day: 'Tue', score: 14 },
        { day: 'Wed', score: 8 },
        { day: 'Thu', score: 15 },
        { day: 'Fri', score: 12 },
        { day: 'Sat', score: 5 },
        { day: 'Sun', score: 4 }
      ]
    };
  },

  disputeTransaction: async (txId, reason) => {
    const tx = mockStore.transactions.find(t => t.id === txId);
    if (tx) {
      tx.status = 'disputed';
      tx.disputeReason = reason;
    }
    return { success: true, message: `Dispute filed for ${txId}. Investigation ticket queued.` };
  },

  freezeAccount: async (id, frozen) => {
    const acct = mockStore.accounts.find(a => a.id === id);
    if (acct) {
      acct.status = frozen ? 'suspended' : 'active';
    }
    return { success: true, status: acct?.status };
  },

  // AI Finance Bot APIs
  sendFinanceChat: async (message, accountId = 'ACC-1001', sessionId = 'sess-fin') => {
    const lower = message.toLowerCase();

    // Check for Attack: Prompt Injection
    if (lower.includes('override') || lower.includes('dump') || lower.includes('ssn') || lower.includes('ignore')) {
      const auditEvt = {
        id: `EVT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        correlationId: `corr-${Date.now()}`,
        agentIdentity: 'spiffe://demo.local/agent/finance-assistant',
        toolName: 'export_customer_data',
        action: 'data:export',
        resourceId: 'DATABASE_CUSTOMERS',
        eventType: 'AUTHORIZATION_DECISION',
        decision: 'DENY',
        policyId: 'cedar_policy_05_forbid_pii_export',
        riskAssessment: { overallScore: 95, level: 'CRITICAL', factors: ['Prompt injection instruction detected', 'Attempted unauthorized data exfiltration'] }
      };
      mockStore.auditEvents.unshift(auditEvt);

      return {
        reply: "⚠️ **Security Alert: Action Intercepted**\n\nThe requested prompt contained an unauthorized instruction to extract sensitive customer data. Sentinel's runtime inspection flagged the memo, and AWS Cedar Policy #5 denied execution.",
        toolActivities: [
          {
            toolName: 'export_customer_data',
            args: { scope: 'ALL_UNMASKED_PII', destination: 'external_sink' },
            output: 'FORBIDDEN: Cedar Policy 5 violation',
            isError: true,
            securityDecision: {
              decision: 'DENY',
              reason: 'Strict PII Export Prohibition',
              policyId: 'cedar_policy_05_forbid_pii_export',
              riskScore: 95
            }
          }
        ]
      };
    }

    // Check for Step-Up Refund > $50
    if (lower.includes('refund') && (lower.includes('120') || lower.includes('100') || lower.includes('150') || lower.includes('high'))) {
      const pendingRef = {
        id: `appr-${Date.now()}`,
        confirmationId: `REF-${Date.now().toString(36).toUpperCase()}`,
        transactionId: 'TXN-2003',
        accountId: accountId,
        amount: 120.00,
        currency: 'USD',
        reason: 'Customer dispute #9914 - Exceeds autonomous threshold',
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      mockStore.approvals.unshift(pendingRef);

      return {
        reply: "I have prepared a refund for **$120.00** regarding transaction TXN-2003. Because this amount exceeds the **$50.00 autonomous threshold**, an explicit Human-in-the-Loop (HITL) supervisor approval has been queued pursuant to NIST SP 800-207.",
        pendingRefund: pendingRef,
        toolActivities: [
          {
            toolName: 'issue_refund',
            args: { transactionId: 'TXN-2003', amount: 120.00, reason: 'Customer dispute' },
            output: 'PAUSED: Awaiting human supervisor approval',
            securityDecision: {
              decision: 'STEP_UP_REQUIRED',
              reason: 'Amount exceeds $50.00 autonomous threshold (Policy 3)',
              riskScore: 65
            }
          }
        ]
      };
    }

    // Check for Benign Refund <= $50
    if (lower.includes('refund') || lower.includes('29.50')) {
      const auditEvt = {
        id: `EVT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        correlationId: `corr-${Date.now()}`,
        agentIdentity: 'spiffe://demo.local/agent/finance-assistant',
        toolName: 'issue_refund',
        action: 'funds:refund',
        resourceId: 'TXN-2002',
        eventType: 'AUTHORIZATION_DECISION',
        decision: 'ALLOW',
        policyId: 'cedar_policy_02_issue_refund',
        riskAssessment: { overallScore: 22, level: 'LOW', factors: ['Amount ($29.50) <= $50.00 cap'] }
      };
      mockStore.auditEvents.unshift(auditEvt);

      const targetAcc = mockStore.accounts.find(a => a.id === accountId);
      if (targetAcc) targetAcc.balance += 29.50;

      return {
        reply: "Refund of **$29.50** for TXN-2002 has been successfully issued. The request was evaluated against Cedar Policy #2, approved within autonomous limits, and signed with single-use ticket TICK-99A1.",
        toolActivities: [
          {
            toolName: 'issue_refund',
            args: { transactionId: 'TXN-2002', amount: 29.50 },
            output: { success: true, ticket_id: 'TICK-99A1-AUTONOMOUS', settled_amount: 29.50 },
            securityDecision: {
              decision: 'ALLOW',
              reason: 'Within autonomous limit ($29.50 <= $50.00)',
              riskScore: 22
            }
          }
        ]
      };
    }

    // Default: Check Account Balance
    const targetAcc = mockStore.accounts.find(a => a.id === accountId) || mockStore.accounts[0];
    return {
      reply: `Your available liquidity for **${targetAcc.name}** (${targetAcc.id}) is **$${targetAcc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${targetAcc.currency}**. All recent transactions are verified by MCP Sentinel continuous authorization.`,
      toolActivities: [
        {
          toolName: 'get_account_balance',
          args: { account_id: accountId },
          output: { balance: targetAcc.balance, status: targetAcc.status },
          securityDecision: {
            decision: 'ALLOW',
            reason: 'Read operation cleared under Cedar Policy 1',
            riskScore: 5
          }
        }
      ]
    };
  },

  resetFinance: async () => {
    mockStore.reset();
    return { success: true };
  },

  // Attack Lab Simulation
  simulate: async (scenarioId) => {
    switch (scenarioId) {
      case 'legitimate-refund':
        return {
          scenario: 'Legitimate Refund ($29.50)',
          decision: 'ALLOW',
          riskScore: 18,
          tool: 'issue_refund',
          policyId: '02_issue_refund.cedar',
          explanation: 'Amount $29.50 is within the autonomous $50 threshold. Single-use ticket issued.',
          auditHash: 'a71829f0c293847a98214bfe39201a4f'
        };
      case 'step-up-approval':
        const approval = {
          id: `step-${Date.now()}`,
          amount: 120.00,
          account: 'ACC-1001',
          recipient: 'ACC-1002',
          reason: 'Refund exceeds $50.00 autonomous threshold',
          status: 'pending'
        };
        mockStore.approvals.unshift(approval);
        return {
          scenario: 'HITL Step-Up Approval ($120.00)',
          decision: 'STEP_UP_REQUIRED',
          riskScore: 65,
          tool: 'issue_refund',
          approval,
          explanation: 'Exceeds autonomous limit. NIST SP 800-207 Dual-Custody Approval queued for human supervisor.'
        };
      case 'excessive-refund':
        return {
          scenario: 'Excessive Refund ($500.00)',
          decision: 'DENY',
          riskScore: 88,
          tool: 'issue_refund',
          policyId: '02_issue_refund.cedar',
          explanation: 'Violates max refund ceiling. Denied by Cedar Policy Engine.'
        };
      case 'circuit-breaker-quarantine':
        mockStore.circuitBreakerState = 'QUARANTINED';
        mockStore.quarantinedAgent = 'spiffe://demo.local/agent/financial-remediation';
        return {
          scenario: 'Autonomous Circuit Breaker Quarantine',
          decision: 'QUARANTINED',
          riskScore: 99,
          tool: 'all_tools',
          explanation: '3 consecutive violations detected in 60s. Circuit breaker tripped; agent isolated and tokens revoked.'
        };
      case 'cross-account':
        return {
          scenario: 'Cross-Account Access Violation',
          decision: 'DENY',
          riskScore: 82,
          tool: 'read_account',
          explanation: 'Agent token scoped strictly to ACC-1001. Cross-tenant read to ACC-1002 blocked.'
        };
      case 'prompt-injection':
        return {
          scenario: 'Prompt Injection in Memo Field',
          decision: 'DENY',
          riskScore: 94,
          tool: 'export_customer_data',
          explanation: 'Untrusted invoice memo parsed: instruction override detected and quarantined by proxy.'
        };
      default:
        return {
          scenario: scenarioId,
          decision: 'DENY',
          riskScore: 75,
          explanation: 'Action blocked by default-deny policy.'
        };
    }
  },

  reset: async () => {
    mockStore.reset();
    return { success: true };
  },

  getComplianceReport: async () => {
    return {
      reportId: 'REP-2024-ZTA-089',
      generatedAt: new Date().toISOString(),
      chainIntegrity: true,
      rootHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      totalEventsVerified: mockStore.auditEvents.length + 1280,
      standards: [
        {
          name: 'NIST SP 800-207 Zero-Trust Architecture',
          code: 'NIST-ZTA',
          status: 'COMPLIANT',
          controls: [
            { id: 'ZTA-01', description: 'Continuous verification of all tool requests', enforcementMechanism: 'Cedar Engine AST Pre-flight', status: 'PASS' },
            { id: 'ZTA-02', description: 'Zero standing privileges with single-use tickets', enforcementMechanism: 'HMAC-SHA256 Execution Nonce', status: 'PASS' },
            { id: 'ZTA-03', description: 'Dual-custody for high-impact actions', enforcementMechanism: 'HITL Supervisor Approval Gate', status: 'PASS' }
          ]
        },
        {
          name: 'OWASP Top 10 for Large Language Models',
          code: 'OWASP-LLM',
          status: 'COMPLIANT',
          controls: [
            { id: 'LLM-01', description: 'Prompt Injection Defense', enforcementMechanism: 'Proxy Untrusted Input Taint Inspection', status: 'PASS' },
            { id: 'LLM-02', description: 'Sensitive Information Disclosure', enforcementMechanism: 'Post-Execution Regex PII Redactor', status: 'PASS' },
            { id: 'LLM-06', description: 'Excessive Agency & Ambient Authority', enforcementMechanism: 'Fail-Closed MCP Tool Proxy Sandbox', status: 'PASS' }
          ]
        }
      ]
    };
  }
};
