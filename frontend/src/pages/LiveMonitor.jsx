import React, { useState, useEffect } from 'react';
import { Radio, Eye, ShieldCheck, ShieldAlert, Clock, Filter, X } from 'lucide-react';
import { api } from '../services/api';

export default function LiveMonitor() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterDecision, setFilterDecision] = useState('ALL'); // 'ALL' | 'ALLOW' | 'DENY'

  const loadEvents = async () => {
    try {
      const params = {};
      if (filterDecision !== 'ALL') params.decision = filterDecision;
      const res = await api.getEvents(params);
      setEvents(res.events || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEvents();
    const interval = setInterval(loadEvents, 3000);
    return () => clearInterval(interval);
  }, [filterDecision]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Real-Time Authorization Telemetry
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 0' }}>
            Live Security Monitor
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '2px 0 0' }}>
            Live feed of tool invocations intercepted and evaluated by Sentinel's proxy sidecar
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', border: '1px solid var(--line)' }}>
          {['ALL', 'ALLOW', 'DENY'].map(f => (
            <button
              key={f}
              onClick={() => setFilterDecision(f)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: filterDecision === f ? 'rgba(101, 231, 245, 0.15)' : 'transparent',
                color: filterDecision === f ? 'var(--cyan)' : 'var(--muted)',
                border: 'none',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {f === 'ALL' ? 'All Invocations' : f === 'ALLOW' ? 'Permitted' : 'Blocked'}
            </button>
          ))}
        </div>
      </div>

      {/* Events Feed Container */}
      <div className="console-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)', fontSize: '0.8rem' }}>
              No security events matching filter. Run a scenario in the Attack Lab to trigger telemetry!
            </div>
          ) : (
            events.map(ev => {
              const isAllowed = ev.decision === 'ALLOW';

              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: isAllowed ? 'rgba(109, 231, 174, 0.03)' : 'rgba(255, 100, 124, 0.04)',
                    border: `1px solid ${isAllowed ? 'rgba(109, 231, 174, 0.2)' : 'rgba(255, 100, 124, 0.25)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = isAllowed ? 'var(--green)' : 'var(--red)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = isAllowed ? 'rgba(109, 231, 174, 0.2)' : 'rgba(255, 100, 124, 0.25)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isAllowed ? <ShieldCheck size={18} color="var(--green)" /> : <ShieldAlert size={18} color="var(--red)" />}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                          {ev.toolName}()
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--dim)' }}>
                          &bull; {ev.action}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                        {ev.agentIdentity}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        background: isAllowed ? 'rgba(109, 231, 174, 0.15)' : 'rgba(255, 100, 124, 0.15)',
                        color: isAllowed ? 'var(--green)' : 'var(--red)'
                      }}>
                        {ev.decision}
                      </span>
                      <div style={{ fontSize: '0.65rem', color: 'var(--dim)', marginTop: '4px' }}>
                        Risk: {ev.riskAssessment?.overallScore || 0}/100
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Selected Event JSON Inspector Modal */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          display: 'grid',
          placeItems: 'center',
          padding: '20px'
        }}>
          <div style={{ width: '100%', maxWidth: '640px', padding: '24px', borderRadius: '14px', background: '#0a0e19', border: '1px solid var(--line-bright)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  Security Event Telemetry Record
                </h3>
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}>
                  ID: {selectedEvent.id}
                </span>
              </div>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <pre style={{
              background: '#05070c',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--line)',
              fontSize: '0.72rem',
              color: '#65e7f5',
              fontFamily: 'var(--font-mono)',
              maxHeight: '380px',
              overflowY: 'auto'
            }}>
              {JSON.stringify(selectedEvent, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
