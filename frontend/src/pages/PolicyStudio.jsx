import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FileText, Check, X, Save, RotateCcw, Sparkles, ArrowRight, ShieldCheck, AlertCircle, Code, Cpu } from 'lucide-react';

export default function PolicyStudio() {
  const [policies, setPolicies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [validation, setValidation] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Cedar Copilot State
  const [showCopilot, setShowCopilot] = useState(false);
  const [copilotPrompt, setCopilotPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copilotResult, setCopilotResult] = useState(null);

  useEffect(() => {
    api.getPolicies().then(r => {
      if (r && r.policies && r.policies.length > 0) {
        setPolicies(r.policies);
        setSelected(r.policies[0].name);
        setEditContent(r.policies[0].content);
      }
    }).catch(console.error);
  }, []);

  const selectPolicy = (name) => {
    const p = policies.find(pol => pol.name === name);
    if (p) {
      setSelected(name);
      setEditContent(p.content);
      setValidation(null);
      setMessage('');
    }
  };

  const handleValidate = async () => {
    try {
      const result = await api.validatePolicy(editContent);
      setValidation(result);
    } catch (err) {
      setValidation({ valid: false, errors: [String(err)] });
    }
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const result = await api.updatePolicy(selected, editContent);
      if (result.success) {
        setMessage('Policy updated and enforced across active Cedar runtime');
        setValidation({ valid: true, errors: [] });
        const r = await api.getPolicies();
        if (r && r.policies) setPolicies(r.policies);
      } else {
        setMessage(`Update failed: ${result.errors?.join(', ')}`);
        setValidation({ valid: false, errors: result.errors });
      }
    } catch (err) {
      setMessage(`Error: ${err}`);
    }
    setSaving(false);
  };

  const handleReset = () => {
    const p = policies.find(pol => pol.name === selected);
    if (p) {
      setEditContent(p.content);
      setValidation(null);
      setMessage('');
    }
  };

  const handleGeneratePolicy = async () => {
    if (!copilotPrompt.trim()) return;
    setGenerating(true);
    try {
      const res = await api.generatePolicy(copilotPrompt);
      setCopilotResult(res);
    } catch (err) {
      setCopilotResult({ valid: false, errors: [String(err)], explanation: 'Synthesis failed' });
    }
    setGenerating(false);
  };

  const handleInsertCopilot = () => {
    if (!copilotResult?.generatedPolicy) return;
    setEditContent(prev => prev + '\n\n' + copilotResult.generatedPolicy);
    setShowCopilot(false);
    setMessage('Policy inserted from Cedar Copilot! Click Save to apply.');
  };

  const examplePrompts = [
    'Allow financial remediation agent to issue refunds up to $75 only on active accounts',
    'Block all refunds and account reads on suspended accounts',
    'Forbid shell command execution and bash execution for all agents',
    'Allow read-only analyst to read active accounts only',
  ];

  return (
    <div className="p-6 h-full flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Policy Studio & Cedar Copilot
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              AWS Cedar v3.2 Engine
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Formal policy specification, static AST validation, and AI-assisted Cedar synthesis
          </p>
        </div>
        <button
          onClick={() => setShowCopilot(!showCopilot)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-cyan-900/30 transition border border-cyan-400/30"
        >
          <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
          Cedar Copilot (Natural Language)
        </button>
      </div>

      {/* Cedar Copilot Panel */}
      {showCopilot && (
        <div className="p-5 bg-gray-900/90 border border-cyan-500/30 rounded-xl space-y-4 backdrop-blur-md shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Cedar Copilot — Natural Language to Formal Cedar Policy
            </h3>
            <button onClick={() => setShowCopilot(false)} className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-gray-800">
              ✕ Close
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={copilotPrompt}
              onChange={(e) => setCopilotPrompt(e.target.value)}
              placeholder="e.g. Allow financial agent to issue refund up to $100 on active accounts"
              className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 font-mono"
              onKeyDown={(e) => e.key === 'Enter' && handleGeneratePolicy()}
            />
            <button
              onClick={handleGeneratePolicy}
              disabled={generating}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shrink-0"
            >
              {generating ? 'Synthesizing AST...' : 'Synthesize Cedar'}
            </button>
          </div>

          {/* Quick Example Pills */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-gray-400 uppercase font-mono mr-1">Sample Prompts:</span>
            {examplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => setCopilotPrompt(p)}
                className="text-[11px] bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white px-2.5 py-1 rounded-md border border-gray-700/60 transition text-left"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Generated Result */}
          {copilotResult && (
            <div className="mt-3 p-4 bg-gray-950/90 border border-gray-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                  {copilotResult.valid ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                  )}
                  {copilotResult.explanation || 'AST Validation Complete'}
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold ${
                  copilotResult.valid
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {copilotResult.valid ? 'CEDAR VALIDATED' : 'SYNTAX ERROR'}
                </span>
              </div>

              {copilotResult.generatedPolicy && (
                <pre className="p-3 bg-gray-900/90 rounded-lg font-mono text-xs text-cyan-300 overflow-x-auto border border-gray-800 leading-relaxed">
                  {copilotResult.generatedPolicy}
                </pre>
              )}

              {copilotResult.valid && (
                <button
                  onClick={handleInsertCopilot}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition shadow-md"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Insert into Active Policy Editor
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Studio Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        {/* Policy Files Sidebar */}
        <div className="w-full md:w-56 bg-gray-900/60 border border-gray-800 rounded-xl p-3 flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-xs font-semibold text-gray-400 tracking-wider">POLICY STORE</h3>
            <span className="text-[10px] text-gray-500 font-mono">{policies.length} Files</span>
          </div>
          <div className="space-y-1 overflow-y-auto flex-1">
            {policies.map(p => (
              <button
                key={p.name}
                onClick={() => selectPolicy(p.name)}
                className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition ${
                  selected === p.name
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium'
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{p.name}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800/80 text-[11px] text-gray-500">
            Policies define zero-trust boundary for AI tools & financial mutations.
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-950/70">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-gray-300 font-medium">{selected || 'No policy selected'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-400 hover:text-white bg-gray-800 rounded border border-gray-700/60 transition"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
              <button
                onClick={handleValidate}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded transition"
              >
                <Check className="w-3 h-3" /> Validate
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 px-3 py-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded disabled:opacity-50 transition"
              >
                <Save className="w-3 h-3" /> {saving ? 'Saving...' : 'Deploy Policy'}
              </button>
            </div>
          </div>

          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="flex-1 p-4 bg-gray-950/50 text-gray-200 font-mono text-xs resize-none focus:outline-none leading-relaxed selection:bg-cyan-900/40"
            spellCheck={false}
          />

          {/* Status Bar */}
          <div className="px-4 py-2.5 border-t border-gray-800 bg-gray-950/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {validation && (
                validation.valid ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                    <Check className="w-3.5 h-3.5" /> Valid Cedar Syntax
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-rose-400 font-mono">
                    <X className="w-3.5 h-3.5" /> {validation.errors?.join(', ') || 'Validation error'}
                  </span>
                )
              )}
              {message && <span className="text-gray-400 font-medium">{message}</span>}
            </div>
            <div className="flex items-center gap-4 text-gray-500 font-mono text-[11px]">
              <span>Format: Cedar Policy DSL</span>
              <span>{editContent.split('\n').length} lines</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
