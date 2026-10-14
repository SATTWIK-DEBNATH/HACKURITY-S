import React, { useState, useEffect } from 'react';
import { Crosshair, AlertTriangle, Zap, RefreshCw, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

const severityStyle = {
  CRITICAL: { bg: 'rgba(255, 100, 124, 0.15)', border: 'rgba(255, 100, 124, 0.35)', color: '#ff647c' },
  HIGH: { bg: 'rgba(255, 153, 0, 0.15)', border: 'rgba(255, 153, 0, 0.35)', color: '#ff9900' },
  MEDIUM: { bg: 'rgba(255, 198, 109, 0.15)', border: 'rgba(255, 198, 109, 0.35)', color: '#ffc66d' },
  LOW: { bg: 'rgba(101, 231, 245, 0.15)', border: 'rgba(101, 231, 245, 0.35)', color: 'var(--cyan)' },
};

export default function IncidentExplorer() {
  const [incidents, setIncidents] = useState([]);
  const [circuitBreaker, setCircuitBreaker] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const loadData = async () => {
    try {
      const incRes = await api.getIncidents();
      setIncidents(incRes.incidents || []);
      const cbRes = await api.getCircuitBreaker();
      if (cbRes.statuses?.length > 0) {
        setCircuitBreaker(cbRes.statuses[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleResetBreaker = async () => {
    await api.resetCircuitBreaker();
    loadData();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Correlated Threat Telemetry
        </span>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0' }}>
          Attack Chain & Incident Explorer
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '2px 0 0' }}>
          Behavioral attack chains correlated across multi-step agent actions and autonomous quarantine defense
        </p>
      </div>

      {/* Autonomous Circuit Breaker Banner */}
      {circuitBreaker && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px',
          background: circuitBreaker.state === 'QUARANTINED' ? 'rgba(255, 100, 124, 0.12)' : 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${circuitBreaker.state === 'QUARANTINED' ? 'rgba(255, 100, 124, 0.4)' : 'var(--line)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Zap size={20} color={circuitBreaker.state === 'QUARANTINED' ? '#ff647c' : '#ffc66d'} className={circuitBreaker.state === 'QUARANTINED' ? 'animate-pulse' : ''} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                Autonomous Circuit Breaker Posture: <span style={{ color: circuitBreaker.state === 'QUARANTINED' ? '#ff647c' : 'var(--green)' }}>{circuitBreaker.state}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '2px' }}>
                Failure threshold: {circuitBreaker.failureCount}/{circuitBreaker.maxFailures} consecutive violations in 60s &bull; Auto-isolation: {circuitBreaker.agentIdentity}
              </div>
            </div>
          </div>

          {circuitBreaker.state === 'QUARANTINED' && (
            <button
              onClick={handleResetBreaker}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 100, 124, 0.25)',
                border: '1px solid rgba(255, 100, 124, 0.4)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Reset Circuit Breaker
            </button>
          )}
        </div>
      )}

      {/* Incidents List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {incidents.map(inc => {
          const style = severityStyle[inc.severity] || severityStyle.HIGH;

          return (
            <div key={inc.id} className="console-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    background: style.bg,
                    border: `1px solid ${style.border}`,
                    color: style.color
                  }}>
                    {inc.severity}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>
                    {inc.id} &bull; {inc.description}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: 'rgba(109, 231, 174, 0.15)',
                  color: 'var(--green)',
                  fontWeight: 700
                }}>
                  {inc.status}
                </span>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--dim)', fontFamily: 'var(--font-mono)', marginBottom: '14px' }}>
                Subject: {inc.agentIdentity} &bull; Detected: {new Date(inc.detectedAt).toLocaleString()}
              </div>

              {/* Event Chain Timeline */}
              {inc.eventChain && (
                <div style={{ padding: '12px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line)' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' }}>
                    CORRELATED ATTACK TIMELINE
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {inc.eventChain.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem' }}>
                        <span style={{ color: 'var(--cyan)' }}>[{idx + 1}]</span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: '#ffffff' }}>{step.toolName}()</span>
                        <span style={{ color: 'var(--muted)' }}>&bull; {step.eventType}</span>
                        <span style={{ color: step.decision === 'DENY' ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>
                          &rarr; {step.decision}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
