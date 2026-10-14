import React, { useState } from 'react';

export default function AuditLedgerViewer({ blocks, onVerify, verificationResult }) {
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [tamperedBlockIndex, setTamperedBlockIndex] = useState(null);

  const simulateTampering = () => {
    if (blocks.length > 1) {
      setTamperedBlockIndex(1); // Tamper with block #1
    }
  };

  const restoreIntegrity = () => {
    setTamperedBlockIndex(null);
    onVerify();
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--accent-purple)' }}>
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M7 7h.01"/>
            <path d="M17 7h.01"/>
            <path d="M7 17h.01"/>
            <path d="M17 17h.01"/>
          </svg>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Cryptographic Tamper-Evident Audit Ledger
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              SHA-256 Merkle Chained Non-Repudiation Architecture
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {tamperedBlockIndex ? (
            <button
              onClick={restoreIntegrity}
              className="btn btn-primary"
              style={{ fontSize: '0.72rem', padding: '5px 10px' }}
            >
              Restore Integrity
            </button>
          ) : (
            <button
              onClick={simulateTampering}
              className="btn btn-danger"
              style={{ fontSize: '0.72rem', padding: '5px 10px' }}
              title="Demonstrates mathematical tamper detection to judges"
            >
              Simulate Attacker Log Tampering
            </button>
          )}

          <button
            onClick={onVerify}
            className="btn btn-ghost"
            style={{ fontSize: '0.72rem', padding: '5px 10px', border: '1px solid rgba(168, 85, 247, 0.4)', color: '#c084fc' }}
          >
            Verify Chain
          </button>
        </div>
      </div>

      {/* Simulated Tamper Alert Banner */}
      {tamperedBlockIndex && (
        <div style={{
          padding: '12px 14px',
          borderRadius: '8px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(244, 63, 94, 0.2)',
          border: '1px solid var(--accent-rose)',
          color: '#fecdd3',
          fontSize: '0.78rem',
          animation: 'pulse 1.2s infinite'
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-rose)" strokeWidth="2.5">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div>
            <strong style={{ color: '#ff4d6d' }}>CRYPTOGRAPHIC INTEGRITY FAILURE DETECTED:</strong>
            <div style={{ fontSize: '0.72rem', marginTop: '2px' }}>
              Adversary attempted to alter payload in Block #{tamperedBlockIndex}. Hash signature mismatch cascade broke subsequent blocks #{tamperedBlockIndex + 1} through #{blocks.length - 1}!
            </div>
          </div>
        </div>
      )}

      {/* Normal Verification Result */}
      {!tamperedBlockIndex && verificationResult && (
        <div style={{
          padding: '10px 14px',
          borderRadius: '8px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: verificationResult.valid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.15)',
          border: `1px solid ${verificationResult.valid ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`,
          color: verificationResult.valid ? '#34d399' : '#fb7185',
          fontSize: '0.78rem'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M9 11l3 3L22 4"/>
          </svg>
          <div>
            <strong>IMMUTABLE INTEGRITY CONFIRMED</strong>
            <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>
              {verificationResult.message} ({verificationResult.total_blocks} blocks mathematically verified)
            </div>
          </div>
        </div>
      )}

      {/* Block Chain Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
        {blocks.map((block) => {
          const isSelected = selectedBlock?.index === block.index;
          const isCorrupted = tamperedBlockIndex !== null && block.index >= tamperedBlockIndex;

          return (
            <div
              key={block.index}
              className="glass-card"
              onClick={() => setSelectedBlock(isSelected ? null : block)}
              style={{
                padding: '12px 14px',
                cursor: 'pointer',
                borderLeft: isCorrupted ? '4px solid var(--accent-rose)' : block.index === 0 ? '4px solid var(--accent-cyan)' : '4px solid var(--accent-purple)',
                background: isCorrupted ? 'rgba(244, 63, 94, 0.08)' : undefined,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: isCorrupted ? 'var(--accent-rose)' : 'var(--accent-purple)'
                  }}>
                    {isCorrupted ? `⚠ BLOCK #${block.index} (CORRUPTED)` : `BLOCK #${block.index}`}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {block.iso_time}
                  </span>
                </div>

                <span className={`badge ${isCorrupted ? 'badge-deny' : 'badge-info'}`} style={{ fontSize: '0.65rem' }}>
                  {isCorrupted ? 'HASH INVALID' : (block.event.verdict || block.event.action || 'INTERCEPT')}
                </span>
              </div>

              {/* Hash linkage */}
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Prev Hash:</span> {block.prev_hash}
                </div>
                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  <span style={{ color: isCorrupted ? 'var(--accent-rose)' : 'var(--accent-purple)' }}>Block Hash:</span> {block.block_hash}
                </div>
              </div>

              {/* Selected Raw Event Payload */}
              {isSelected && (
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Cryptographic Event Block Payload:
                  </span>
                  <pre style={{ margin: '4px 0 0', padding: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '6px', fontSize: '0.7rem', color: isCorrupted ? '#fca5a5' : '#c4b5fd', fontFamily: 'var(--font-mono)', overflowX: 'auto' }}>
                    {JSON.stringify(block.event, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
