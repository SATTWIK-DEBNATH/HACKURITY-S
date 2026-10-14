import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Key, ShieldCheck, ShieldX, GitBranch, Plus, Trash2, Clock, AlertTriangle, Fingerprint, Lock, CheckCircle2 } from 'lucide-react';

export default function IdentityView() {
  const [identities, setIdentities] = useState([]);
  const [delegations, setDelegations] = useState([]);
  const [revocations, setRevocations] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [newMaxRefund, setNewMaxRefund] = useState(50);
  const [newTtl, setNewTtl] = useState(300);

  const load = async () => {
    try {
      const [id, del, rev] = await Promise.all([
        api.getIdentities(),
        api.getDelegations(),
        api.getRevocations()
      ]);
      if (id && id.identities) setIdentities(id.identities);
      if (del && del.delegations) setDelegations(del.delegations);
      if (rev && rev.revocations) setRevocations(rev.revocations);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleIssueToken = async (subjectUri) => {
    try {
      const caps = subjectUri.includes('read-only')
        ? ['ledger.read', 'customer.read']
        : ['ledger.read', 'customer.read', 'ledger.refund'];

      await api.issueToken({
        subject: subjectUri,
        capabilities: caps,
        authorizedResources: ['ACC-1001'],
        maxRefundAmount: Number(newMaxRefund) || 50,
        ttlSeconds: Number(newTtl) || 300,
      });
      setMessage(`Cryptographic capability token issued for ${subjectUri.split('/').pop()}`);
      setShowIssueModal(false);
      await load();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage(`Token issuance failed: ${err}`);
    }
  };

  const handleRevoke = async (tokenId) => {
    try {
      await api.revokeToken(tokenId, 'Manual operator revocation from Sentinel Console');
      setMessage(`Token ${tokenId.slice(0, 14)}... successfully revoked`);
      await load();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage(`Revocation failed: ${err}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-cyan-400" />
              Agent Identity & Delegation Matrix
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Ed25519 Capability Tokens
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Zero-trust SPIFFE identities, short-lived scoped JWT tokens, and bounded delegation chains
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            Local demo identity provider — not production SPIRE
          </span>
        </div>
      </div>

      {message && (
        <div className="text-xs text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-4 py-3 rounded-xl flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Identities Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-mono">
            Active Agent Principals ({identities.length})
          </h3>
          <span className="text-xs text-gray-500">Each principal is isolated to least-privilege tool capabilities</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {identities.map(id => (
            <div key={id.uri} className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 hover:border-gray-700/80 transition shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white tracking-wide">
                        {id.name.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-800 text-gray-300">
                        {id.tokens.filter(t => !t.revoked).length} Active Tokens
                      </span>
                    </div>
                    <span className="text-xs font-mono text-cyan-400/80 mt-0.5 block">{id.uri}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedAgent(id.uri);
                    setShowIssueModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/25 transition font-medium self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> Issue Scoped Token
                </button>
              </div>

              {/* Tokens list */}
              {id.tokens && id.tokens.length > 0 ? (
                <div className="space-y-2">
                  {id.tokens.map((tok) => (
                    <div
                      key={tok.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between text-xs p-3 rounded-lg border transition ${
                        tok.revoked
                          ? 'bg-rose-950/20 border-rose-500/20 opacity-70'
                          : 'bg-gray-950/60 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3 mb-2 sm:mb-0">
                        {tok.revoked ? (
                          <ShieldX className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-mono">
                            <span className={tok.revoked ? 'line-through text-gray-500' : 'text-gray-200'}>
                              {tok.id.slice(0, 20)}...
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                              tok.revoked ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {tok.revoked ? 'REVOKED' : 'VALID'}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                            <span>Scopes: <strong className="text-cyan-300">{tok.capabilities?.join(', ')}</strong></span>
                            {tok.maxRefundAmount && (
                              <span>• Ceiling: <strong className="text-amber-300">${tok.maxRefundAmount}</strong></span>
                            )}
                            {tok.authorizedResources && (
                              <span>• Res: <strong className="text-gray-300">{tok.authorizedResources.join(', ')}</strong></span>
                            )}
                          </div>
                        </div>
                      </div>

                      {!tok.revoked && (
                        <button
                          onClick={() => handleRevoke(tok.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-rose-400 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-md transition font-medium self-end sm:self-auto"
                        >
                          <Trash2 className="w-3 h-3" /> Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic py-2">No active tokens assigned to this workload identity</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Delegation Chains Section */}
      {delegations.length > 0 && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              Agent-to-Agent Delegation Chains (Attenuated Capabilities)
            </h3>
            <span className="text-xs text-gray-500">Child tokens cannot exceed parent permissions</span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {delegations.map((d) => (
              <div key={d.id} className="p-3.5 bg-gray-950/70 rounded-lg border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-cyan-400 font-semibold">{d.parentIdentity?.split('/').pop()}</span>
                    <span className="text-gray-500">─── delegated to ───►</span>
                    <span className="text-indigo-300 font-semibold">{d.childIdentity?.split('/').pop()}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.revoked ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {d.revoked ? 'REVOKED' : 'ACTIVE CHAIN'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Attenuated Child Capabilities: <span className="font-mono text-gray-300">{d.childCapabilities?.join(', ')}</span>
                  </p>
                </div>
                <div className="text-[11px] font-mono text-gray-500 shrink-0">
                  Chain ID: {d.id?.slice(0, 12)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issue Token Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-750 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                Issue Workload Capability Token
              </h3>
              <button onClick={() => setShowIssueModal(false)} className="text-xs text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Target Subject Principal</label>
                <div className="p-2.5 bg-gray-950 border border-gray-800 rounded-lg font-mono text-cyan-300 truncate">
                  {selectedAgent}
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Maximum Authorized Refund Ceiling ($)</label>
                <input
                  type="number"
                  value={newMaxRefund}
                  onChange={(e) => setNewMaxRefund(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
                <span className="text-[11px] text-gray-500 mt-1 block">Ceilings above $50 will trigger human supervisor step-up</span>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Token TTL (Seconds)</label>
                <input
                  type="number"
                  value={newTtl}
                  onChange={(e) => setNewTtl(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                onClick={() => setShowIssueModal(false)}
                className="px-3.5 py-2 text-xs text-gray-400 hover:text-white rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleIssueToken(selectedAgent)}
                className="px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition shadow-md shadow-cyan-900/30"
              >
                Sign & Deploy Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
