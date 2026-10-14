import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  Save,
  Check,
  DollarSign,
  AlertOctagon,
  Info
} from 'lucide-react';

export default function PolicyRulesEditor({ policies, onUpdatePolicy }) {
  const [selectedTool, setSelectedTool] = useState('transfer_funds');
  const [editedRule, setEditedRule] = useState(null);

  const currentRule = editedRule || policies[selectedTool];

  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    setEditedRule(null);
  };

  const handleThresholdChange = (val) => {
    setEditedRule({
      ...currentRule,
      requires_step_up_above_val: parseFloat(val) || 0
    });
  };

  const handleBaseRiskChange = (val) => {
    setEditedRule({
      ...currentRule,
      base_risk: parseInt(val) || 0
    });
  };

  const toggleRole = (role) => {
    const roles = currentRule.allowed_roles || [];
    const newRoles = roles.includes(role)
      ? roles.filter(r => r !== role)
      : [...roles, role];
    setEditedRule({
      ...currentRule,
      allowed_roles: newRoles
    });
  };

  const handleSave = () => {
    if (!currentRule) return;
    onUpdatePolicy({
      tool_name: selectedTool,
      allowed_roles: currentRule.allowed_roles,
      base_risk: currentRule.base_risk,
      requires_step_up_above_val: currentRule.requires_step_up_above_val
    });
  };

  const allAvailableRoles = [
    'BankingAssistant',
    'TriageAgent',
    'TransactionExecutionAgent',
    'SupervisorAgent',
    'ComplianceExecutive',
    'SuperAdmin'
  ];

  if (!policies || Object.keys(policies).length === 0) {
    return <div className="glass-panel" style={{ padding: '20px' }}>Loading policies...</div>;
  }

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} color="var(--accent-blue)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
            ABAC Policy & Blast Radius Matrix
          </h2>
        </div>

        <button
          onClick={handleSave}
          className="btn btn-primary"
          style={{ fontSize: '0.75rem', padding: '6px 12px' }}
        >
          <Save size={14} />
          <span>Save & Apply Live</span>
        </button>
      </div>

      {/* Tool Selector Tabs */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px' }}>
        {Object.keys(policies).map((t) => (
          <button
            key={t}
            onClick={() => handleToolSelect(t)}
            style={{
              padding: '6px 10px',
              fontSize: '0.72rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              background: selectedTool === t ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.04)',
              color: selectedTool === t ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              border: `1px solid ${selectedTool === t ? 'rgba(0, 242, 254, 0.4)' : 'var(--border-subtle)'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {t}()
          </button>
        ))}
      </div>

      {/* Policy Details Editor */}
      {currentRule && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto' }}>
          <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Description</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginTop: '2px' }}>
              {currentRule.description}
            </div>
          </div>

          {/* Base Risk Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Base Tool Risk Score</span>
              <strong style={{ color: currentRule.base_risk <= 30 ? 'var(--accent-emerald)' : currentRule.base_risk <= 80 ? 'var(--accent-amber)' : 'var(--accent-rose)', fontFamily: 'var(--font-mono)' }}>
                {currentRule.base_risk} / 100
              </strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={currentRule.base_risk}
              onChange={(e) => handleBaseRiskChange(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
            />
          </div>

          {/* Step-Up Ceiling */}
          {currentRule.requires_step_up_above_val !== Infinity && (
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Step-Up Human Approval Ceiling ($ USD)
              </label>
              <input
                type="number"
                value={currentRule.requires_step_up_above_val}
                onChange={(e) => handleThresholdChange(e.target.value)}
                style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontSize: '0.8rem' }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                Actions above this threshold trigger Step-Up approval before execution.
              </span>
            </div>
          )}

          {/* Allowed Agent Roles Checklist */}
          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Authorized Agent Roles (Workload Attestation)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {allAvailableRoles.map((role) => {
                const isChecked = (currentRule.allowed_roles || []).includes(role);
                return (
                  <div
                    key={role}
                    onClick={() => toggleRole(role)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: isChecked ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${isChecked ? 'rgba(56, 189, 248, 0.35)' : 'var(--border-subtle)'}`,
                      fontSize: '0.75rem',
                      color: isChecked ? 'var(--accent-blue)' : 'var(--text-muted)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      style={{ accentColor: 'var(--accent-blue)' }}
                    />
                    <span>{role}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
