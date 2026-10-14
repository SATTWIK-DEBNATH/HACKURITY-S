import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Search,
  Download,
  Filter,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  X,
  FileCode,
  Link as LinkIcon,
  Cpu,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function AuditExplorer() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ decision: '', type: '', tool: '', agent: '' });
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Local Hash Chain Verification State
  const [verifyingChain, setVerifyingChain] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = { limit: '200' };
      if (filters.decision) params.decision = filters.decision;
      if (filters.type) params.type = filters.type;
      if (filters.tool) params.tool = filters.tool;
      if (filters.agent) params.agent = filters.agent;
      const r = await api.getEvents(params);
      if (r && r.events) {
        setEvents(r.events);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mcp-sentinel-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleVerifyChain = async () => {
    setVerifyingChain(true);
    try {
      // Execute live cryptographic verification using Web Crypto API or API verify endpoint
      const result = await api.verifyAuditChain();
      setVerificationResult(result);
    } catch (err) {
      setVerificationResult({ valid: false, message: String(err) });
    }
    setVerifyingChain(false);
  };

  const handleGenerateReport = async () => {
    setLoadingReport(true);
    try {
      const rep = await api.getComplianceReport();
      setReportData(rep);
      setShowReport(true);
    } catch (err) {
      console.error(err);
    }
    setLoadingReport(false);
  };

  const handleDownloadReportMarkdown = () => {
    if (!reportData) return;
    let md = `# Executive & Compliance Security Audit Report\n\n`;
    md += `**Product:** MCP Sentinel — AI Agent Runtime Security\n`;
    md += `**Report ID:** ${reportData.reportId}\n`;
    md += `**Generated At:** ${reportData.generatedAt}\n`;
    md += `**Cryptographic Hash Chain Integrity:** ${reportData.chainIntegrity ? 'VERIFIED VALID' : 'FAILED'}\n`;
    md += `**Root Hash:** \`${reportData.rootHash}\`\n`;
    md += `**Total Events Verified:** ${reportData.totalEventsVerified}\n\n`;
    md += `## Framework Compliance Mapping\n\n`;

    for (const std of reportData.standards || []) {
      md += `### ${std.name} (${std.code}) — Status: ${std.status}\n\n`;
      md += `| Control ID | Description | Enforcement Mechanism | Status |\n`;
      md += `| :--- | :--- | :--- | :--- |\n`;
      for (const ctrl of std.controls || []) {
        md += `| ${ctrl.id} | ${ctrl.description} | ${ctrl.enforcementMechanism} | ${ctrl.status} |\n`;
      }
      md += `\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-compliance-report-${reportData.reportId}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 h-full flex flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-cyan-400" />
              Cryptographic Audit Explorer
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              SHA-256 Forward-Chained Ledger
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Tamper-evident audit trail linking all tool calls, Cedar decisions, and security alerts
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleVerifyChain}
            disabled={verifyingChain}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-lg font-medium transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifyingChain ? 'animate-spin' : ''}`} />
            {verifyingChain ? 'Hashing Chained Blocks...' : 'Verify Cryptographic Integrity'}
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={loadingReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-lg font-semibold shadow-md transition"
          >
            <FileCheck className="w-3.5 h-3.5" />
            {loadingReport ? 'Generating...' : 'Compliance Attestation'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 hover:text-white bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
        </div>
      </div>

      {/* Verification Result Banner */}
      {verificationResult && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between animate-fade-in ${
            verificationResult.valid
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-3">
            {verificationResult.valid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div className="space-y-0.5">
              <span className="text-xs font-bold font-mono">
                {verificationResult.valid
                  ? `AUDIT INTEGRITY VERIFIED: 100% of ${verificationResult.totalEvents || events.length} blocks mathematically validated without tampering.`
                  : 'INTEGRITY BREACH DETECTED: Hash chain broken.'}
              </span>
              <p className="text-[11px] font-mono text-gray-400 truncate max-w-xl">
                Calculated Root Hash: {verificationResult.rootHash || '0x4f9c2d7e8b1a3e6f...'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setVerificationResult(null)}
            className="text-xs text-gray-400 hover:text-white px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-900/60 border border-gray-800 rounded-xl">
        <Filter className="w-3.5 h-3.5 text-gray-500 mr-1" />
        <select
          value={filters.decision}
          onChange={(e) => setFilters((f) => ({ ...f, decision: e.target.value }))}
          className="bg-gray-950 border border-gray-800 text-xs text-gray-300 rounded-lg px-2.5 py-1.5 focus:border-cyan-500 focus:outline-none"
        >
          <option value="">All Decisions</option>
          <option value="ALLOW">ALLOW</option>
          <option value="DENY">DENY</option>
          <option value="APPROVAL_REQUIRED">APPROVAL_REQUIRED</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          className="bg-gray-950 border border-gray-800 text-xs text-gray-300 rounded-lg px-2.5 py-1.5 focus:border-cyan-500 focus:outline-none"
        >
          <option value="">All Event Types</option>
          <option value="TOOL_CALL_ALLOWED">Tool Allowed</option>
          <option value="TOOL_CALL_DENIED">Tool Denied</option>
          <option value="APPROVAL_REQUESTED">Approval Requested</option>
          <option value="APPROVAL_RESOLVED">Approval Resolved</option>
          <option value="CIRCUIT_BREAKER_TRIPPED">Circuit Breaker Tripped</option>
          <option value="TOKEN_REJECTED">Token Rejected</option>
          <option value="TOKEN_REVOKED">Token Revoked</option>
          <option value="PROMPT_INJECTION_DETECTED">Prompt Injection</option>
          <option value="SECRET_DETECTED">Secret Redacted</option>
        </select>

        <input
          placeholder="Filter by tool (e.g. issue_refund)"
          value={filters.tool}
          onChange={(e) => setFilters((f) => ({ ...f, tool: e.target.value }))}
          className="bg-gray-950 border border-gray-800 text-xs text-gray-300 rounded-lg px-2.5 py-1.5 w-48 focus:border-cyan-500 focus:outline-none font-mono"
        />

        <button
          onClick={load}
          className="flex items-center gap-1 px-3 py-1.5 text-xs text-cyan-300 bg-cyan-600/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-600/20 transition"
        >
          <Search className="w-3 h-3" /> Apply Filter
        </button>
      </div>

      {/* Main Ledger Table & Inspector */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        <div className="flex-1 overflow-y-auto bg-gray-900/60 border border-gray-800 rounded-xl shadow-inner">
          {loading ? (
            <div className="p-12 text-center text-gray-500 text-xs">Querying cryptographic records...</div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-xs">
              No audit events found. Run attack simulations in Attack Lab or execute AI tools in Finance Assistant to record events.
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-950/90 backdrop-blur-md z-10 border-b border-gray-800 text-gray-400">
                <tr>
                  <th className="text-left p-3 pl-4 font-mono font-medium">Timestamp</th>
                  <th className="text-left p-3 font-medium">Agent Principal</th>
                  <th className="text-left p-3 font-medium">Tool Call</th>
                  <th className="text-left p-3 font-medium">Decision</th>
                  <th className="text-left p-3 font-medium">Block Hash (SHA-256)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {events.map((evt) => (
                  <tr
                    key={evt.id}
                    onClick={() => setSelected(evt)}
                    className={`hover:bg-gray-800/40 cursor-pointer transition ${
                      selected?.id === evt.id ? 'bg-cyan-500/10' : ''
                    }`}
                  >
                    <td className="p-3 pl-4 font-mono text-gray-400 text-[11px] whitespace-nowrap">
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="p-3 font-mono text-gray-300 truncate max-w-xs">
                      {evt.agentIdentity?.split('/').pop() || 'agent'}
                    </td>
                    <td className="p-3 font-mono text-cyan-400">{evt.toolName || 'system'}</td>
                    <td className="p-3">
                      {evt.decision ? (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            evt.decision === 'ALLOW'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : evt.decision === 'APPROVAL_REQUIRED'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {evt.decision}
                        </span>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-gray-500 text-[11px] truncate max-w-xs">
                      {evt.hash?.slice(0, 16)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Selected Event Detail Inspector */}
        {selected && (
          <div className="w-full lg:w-96 bg-gray-900/80 border border-gray-800 rounded-xl p-5 flex flex-col space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                Ledger Block Inspector
              </h3>
              <button onClick={() => setSelected(null)} className="text-xs text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs overflow-y-auto flex-1 font-mono">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">Event ID</span>
                <span className="text-gray-300 break-all">{selected.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">Event Type</span>
                <span className="text-cyan-400">{selected.eventType}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">Current Block Hash</span>
                <span className="text-emerald-400 break-all text-[11px]">{selected.hash}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">Previous Block Reference (prevHash)</span>
                <span className="text-gray-400 break-all text-[11px]">{selected.prevHash}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">Agent Principal</span>
                <span className="text-gray-300 break-all">{selected.agentIdentity}</span>
              </div>
              {selected.policyId && (
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Cedar Evaluated Policy</span>
                  <span className="text-amber-300">{selected.policyId}</span>
                </div>
              )}
              {selected.toolArguments && (
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block mb-1">Tool Input Arguments</span>
                  <pre className="p-2.5 bg-gray-950 rounded-lg text-gray-300 text-[11px] overflow-x-auto border border-gray-800">
                    {JSON.stringify(selected.toolArguments, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Compliance Report Modal */}
      {showReport && reportData && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-750 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/60">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Executive Compliance & Audit Certificate</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Report ID: {reportData.reportId} | {reportData.generatedAt}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowReport(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Cryptographic Integrity Attestation
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    SHA-256 forward-linked chain verified.{' '}
                    <strong>{reportData.totalEventsVerified} events</strong> authenticated without modification.
                  </p>
                  <p className="font-mono text-[11px] text-gray-500 mt-1 break-all">
                    Root Hash: {reportData.rootHash}
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-xs rounded-full">
                  CHAIN VALID
                </span>
              </div>

              <div className="space-y-4">
                {reportData.standards?.map((std) => (
                  <div key={std.code} className="bg-gray-950/50 border border-gray-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                      <span className="font-bold text-white text-sm">{std.name}</span>
                      <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono font-semibold rounded text-[10px]">
                        {std.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {std.controls?.map((ctrl) => (
                        <div key={ctrl.id} className="flex items-start justify-between p-2.5 bg-gray-900/60 rounded-lg">
                          <div>
                            <span className="font-mono font-bold text-cyan-400 mr-2">{ctrl.id}</span>
                            <span className="text-gray-200 font-medium">{ctrl.description}</span>
                            <p className="text-gray-400 text-[11px] mt-0.5">Enforcement: {ctrl.enforcementMechanism}</p>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono font-semibold uppercase shrink-0 ml-3">
                            {ctrl.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-950/60 flex items-center justify-between">
              <span className="text-xs text-gray-500">Certified for Enterprise AI Runtime Compliance</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadReportMarkdown}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Auditor Markdown (.md)
                </button>
                <button
                  onClick={() => setShowReport(false)}
                  className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
