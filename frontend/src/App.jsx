import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import InteractiveTopology from './components/InteractiveTopology';
import ThreatActivityChart from './components/ThreatActivityChart';
import AttackLauncher from './components/AttackLauncher';
import InterceptionStream from './components/InterceptionStream';
import StepUpApprovalModal from './components/StepUpApprovalModal';
import AuditLedgerViewer from './components/AuditLedgerViewer';
import PolicyRulesEditor from './components/PolicyRulesEditor';
import CyberBackground from './components/CyberBackground';
import { cyberAudio } from './utils/cyberAudio';

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({
    total_intercepted: 0,
    allowed_count: 0,
    blocked_count: 0,
    step_up_count: 0,
    average_risk_score: 0,
    ledger_height: 1
  });
  const [scenarios, setScenarios] = useState([]);
  const [events, setEvents] = useState([]);
  const [latestEvent, setLatestEvent] = useState(null);
  const [auditBlocks, setAuditBlocks] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [policies, setPolicies] = useState({});
  const [verificationResult, setVerificationResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // Tabs for Left and Right Panels
  const [leftTab, setLeftTab] = useState('launcher'); // 'launcher' | 'policies'
  const [rightTab, setRightTab] = useState('stream');   // 'stream' | 'ledger'

  const wsRef = useRef(null);

  // Initial Data Fetch
  const fetchAllData = async () => {
    try {
      const [scRes, stRes, ledgerRes, stepRes, polRes] = await Promise.all([
        fetch('/api/scenarios').then(r => r.json()).catch(() => []),
        fetch('/api/stats').then(r => r.json()).catch(() => ({})),
        fetch('/api/audit/ledger').then(r => r.json()).catch(() => []),
        fetch('/api/step-up/pending').then(r => r.json()).catch(() => []),
        fetch('/api/policies').then(r => r.json()).catch(() => ({}))
      ]);

      if (Array.isArray(scRes)) setScenarios(scRes);
      if (stRes) setStats(stRes);
      if (Array.isArray(ledgerRes)) setAuditBlocks(ledgerRes);
      if (Array.isArray(stepRes)) setPendingApprovals(stepRes);
      if (polRes && typeof polRes === 'object') setPolicies(polRes);
    } catch (err) {
      console.error("Error fetching initial state:", err);
    }
  };

  const triggerAudioVerdict = (verdict) => {
    if (verdict === 'ALLOW' || verdict === 'STEP_UP_APPROVED') {
      cyberAudio.playAllow();
    } else if (verdict === 'DENY' || verdict === 'BLOCKED') {
      cyberAudio.playBlock();
    } else if (verdict === 'STEP_UP_REQUIRED') {
      cyberAudio.playStepUpAlert();
    }
  };

  // WebSocket Connection
  useEffect(() => {
    fetchAllData();

    const connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/stream`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'SCENARIO_EXECUTED') {
            const runs = msg.data.runs || [];
            const newEvs = runs.map(r => ({
              ...r.execution_result,
              agent_id: msg.data.agent?.agent_id,
              role: msg.data.agent?.role,
              tool_name: msg.data.scenario?.tool_name,
              arguments: msg.data.scenario?.arguments,
              time_str: new Date().toLocaleTimeString()
            }));
            if (newEvs.length > 0) {
              setLatestEvent(newEvs[0]);
              triggerAudioVerdict(newEvs[0].verdict || newEvs[0].status);
            }
            setEvents(prev => [...newEvs, ...prev]);
            fetchAllData();
          } else if (msg.type === 'CUSTOM_ACTION_INTERCEPTED') {
            const data = msg.data;
            const newEv = {
              ...data.verdict_result,
              agent_id: data.agent_id,
              role: data.role,
              tool_name: data.tool_name,
              arguments: data.arguments,
              time_str: new Date().toLocaleTimeString()
            };
            setLatestEvent(newEv);
            triggerAudioVerdict(newEv.verdict || newEv.status);
            setEvents(prev => [newEv, ...prev]);
            fetchAllData();
          } else if (msg.type === 'STEP_UP_RESOLVED') {
            fetchAllData();
          } else if (msg.type === 'POLICY_UPDATED') {
            fetchAllData();
          }
        } catch (e) {
          console.error("WS Parse error:", e);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    };

    connectWebSocket();

    const interval = setInterval(fetchAllData, 4000);

    return () => {
      clearInterval(interval);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const handleRunScenario = async (scenarioId, repeatCount = 1) => {
    cyberAudio.playClick();
    setIsRunning(true);
    try {
      const res = await fetch('/api/scenarios/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: scenarioId, repeat_count: repeatCount })
      });
      const data = await res.json();
      
      const runs = data.runs || [];
      const newEvs = runs.map(r => ({
        ...r.execution_result,
        agent_id: data.agent?.agent_id,
        role: data.agent?.role,
        tool_name: data.scenario?.tool_name,
        arguments: data.scenario?.arguments,
        time_str: new Date().toLocaleTimeString()
      }));
      if (newEvs.length > 0) {
        setLatestEvent(newEvs[0]);
        triggerAudioVerdict(newEvs[0].verdict || newEvs[0].status);
      }
      setEvents(prev => [...newEvs, ...prev]);
      fetchAllData();
    } catch (err) {
      console.error("Error running scenario:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunCustomAction = async (payload) => {
    cyberAudio.playClick();
    setIsRunning(true);
    try {
      const res = await fetch('/api/agent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const newEv = {
        ...data.verdict_result,
        agent_id: data.agent_id,
        role: data.role,
        tool_name: data.tool_name,
        arguments: data.arguments,
        time_str: new Date().toLocaleTimeString()
      };
      setLatestEvent(newEv);
      triggerAudioVerdict(newEv.verdict || newEv.status);
      setEvents(prev => [newEv, ...prev]);
      fetchAllData();
    } catch (err) {
      console.error("Error executing custom action:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleResolveStepUp = async (requestId, approved) => {
    try {
      if (approved) {
        cyberAudio.playAllow();
      } else {
        cyberAudio.playBlock();
      }
      const res = await fetch('/api/step-up/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          approved: approved,
          supervisor_id: 'Judge-Supervisor'
        })
      });
      await res.json();
      fetchAllData();
    } catch (err) {
      console.error("Error resolving step up:", err);
    }
  };

  const handleVerifyLedger = async () => {
    cyberAudio.playClick();
    try {
      const res = await fetch('/api/audit/verify', { method: 'POST' });
      const data = await res.json();
      setVerificationResult(data);
      if (data.valid) {
        cyberAudio.playAllow();
      } else {
        cyberAudio.playBlock();
      }
      setTimeout(() => setVerificationResult(null), 6000);
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  const handleUpdatePolicy = async (policyData) => {
    cyberAudio.playClick();
    try {
      await fetch('/api/policies/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policyData)
      });
      fetchAllData();
      alert(`Policy for ${policyData.tool_name} successfully updated live!`);
    } catch (err) {
      console.error("Policy update failed:", err);
    }
  };

  const handleExportAudit = () => {
    cyberAudio.playClick();
    const exportData = {
      timestamp: new Date().toISOString(),
      standard: "NIST SP 800-207 Zero-Trust Architecture",
      project: "SentinAgent (VeriAuth-ZTA)",
      stats: stats,
      audit_ledger: auditBlocks,
      intercepted_events: events
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SentinAgent_Audit_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Interactive Cyber Particle Constellation Canvas */}
      <CyberBackground />

      {/* Top Navbar with Audio FX & Confetti */}
      <Navbar
        isConnected={isConnected}
        onVerifyLedger={handleVerifyLedger}
        stats={stats}
        onExportAudit={handleExportAudit}
      />

      {/* Main KPI Stats Bar */}
      <StatsBar stats={stats} />

      {/* Dynamic Animated Zero-Trust Packet Inspection Topology */}
      <InteractiveTopology latestEvent={latestEvent} />

      {/* Live Contextual Risk & Velocity Telemetry Chart */}
      <ThreatActivityChart events={events} />

      {/* Main Workspace Split Grid */}
      <main style={{
        flex: 1,
        margin: '0 24px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        minHeight: '520px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Left Column: Attack Launcher OR Policy Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', padding: '0 4px' }}>
            <button
              onClick={() => {
                cyberAudio.playClick();
                setLeftTab('launcher');
              }}
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: leftTab === 'launcher' ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255,255,255,0.04)',
                color: leftTab === 'launcher' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: `1px solid ${leftTab === 'launcher' ? 'rgba(0, 242, 254, 0.4)' : 'var(--border-subtle)'}`,
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ⚡ Threat Launcher & Scenarios
            </button>

            <button
              onClick={() => {
                cyberAudio.playClick();
                setLeftTab('policies');
              }}
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: leftTab === 'policies' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.04)',
                color: leftTab === 'policies' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                border: `1px solid ${leftTab === 'policies' ? 'rgba(56, 189, 248, 0.4)' : 'var(--border-subtle)'}`,
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ⚙️ ABAC Policy Rules Matrix
            </button>
          </div>

          <div style={{ flex: 1, minHeight: 0 }}>
            {leftTab === 'launcher' ? (
              <AttackLauncher
                scenarios={scenarios}
                onRunScenario={handleRunScenario}
                onRunCustomAction={handleRunCustomAction}
                isRunning={isRunning}
              />
            ) : (
              <PolicyRulesEditor
                policies={policies}
                onUpdatePolicy={handleUpdatePolicy}
              />
            )}
          </div>
        </div>

        {/* Right Column: Interception Stream OR Audit Ledger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', padding: '0 4px' }}>
            <button
              onClick={() => {
                cyberAudio.playClick();
                setRightTab('stream');
              }}
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: rightTab === 'stream' ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255,255,255,0.04)',
                color: rightTab === 'stream' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                border: `1px solid ${rightTab === 'stream' ? 'rgba(0, 242, 254, 0.4)' : 'var(--border-subtle)'}`,
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              📡 Live PEP Interception Stream
            </button>

            <button
              onClick={() => {
                cyberAudio.playClick();
                setRightTab('ledger');
              }}
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: rightTab === 'ledger' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.04)',
                color: rightTab === 'ledger' ? '#c084fc' : 'var(--text-secondary)',
                border: `1px solid ${rightTab === 'ledger' ? 'rgba(168, 85, 247, 0.4)' : 'var(--border-subtle)'}`,
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🔗 Tamper-Proof Audit Chain ({auditBlocks.length})
            </button>
          </div>

          <div style={{ flex: 1, minHeight: 0 }}>
            {rightTab === 'stream' ? (
              <InterceptionStream
                events={events}
                onClearStream={() => setEvents([])}
              />
            ) : (
              <AuditLedgerViewer
                blocks={auditBlocks}
                onVerify={handleVerifyLedger}
                verificationResult={verificationResult}
              />
            )}
          </div>
        </div>
      </main>

      {/* Human-In-The-Loop Step-Up Modal */}
      <StepUpApprovalModal
        pendingApprovals={pendingApprovals}
        onResolve={handleResolveStepUp}
      />
    </div>
  );
}
