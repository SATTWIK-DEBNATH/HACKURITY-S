import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Laptop,
  Tablet,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Fingerprint,
  Radio,
  FileCode
} from 'lucide-react';

export default function SecurityCenterView() {
  const [passkeyEnabled, setPasskeyEnabled] = useState(true);
  const [sessions, setSessions] = useState([
    { id: 'sess-1', device: 'Windows 11 Enterprise (Current Session)', location: 'New York, NY, USA', ip: '198.51.100.24', current: true, icon: Laptop },
    { id: 'sess-2', device: 'Apple iPhone 16 Pro (Mobile Banking App)', location: 'New York, NY, USA', ip: '172.56.21.88', current: false, icon: Smartphone },
    { id: 'sess-3', device: 'Apple iPad Pro 13" (Safari Browser)', location: 'San Francisco, CA, USA', ip: '192.0.2.71', current: false, icon: Tablet }
  ]);

  const [revokedNotice, setRevokedNotice] = useState(false);

  const handleRevokeOtherSessions = () => {
    setSessions(prev => prev.filter(s => s.current));
    setRevokedNotice(true);
    setTimeout(() => setRevokedNotice(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Top Banner */}
      <div className="fintech-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>Zero-Trust Security & Fraud Shield</h1>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              Compliant with NIST SP 800-207 Zero-Trust Architecture. Real-time cryptographic token attestation, FIDO2 passkeys, and active device monitoring.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.82rem', fontWeight: 700 }}>
            <ShieldCheck size={18} />
            <span>PROTECTION LEVEL: MAXIMUM</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* ============================================================ */}
        {/* LEFT: AUTHENTICATION & MULTI-FACTOR CONTROLS                 */}
        {/* ============================================================ */}
        <div className="fintech-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
            Authentication & Credential Security
          </h2>

          {/* FIDO2 Biometrics Passkey */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <Fingerprint size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>FIDO2 WebAuthn / FaceID Passkey</div>
                <div style={{ fontSize: '0.73rem', color: '#64748b' }}>Hardware-backed cryptographic biometric sign-in</div>
              </div>
            </div>

            <label className="switch-container">
              <input type="checkbox" checked={passkeyEnabled} onChange={() => setPasskeyEnabled(!passkeyEnabled)} />
              <span className="switch-slider" />
            </label>
          </div>

          {/* Dual-Custody Approval Floor */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                <Key size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Dual-Custody Human Step-Up Floor</div>
                <div style={{ fontSize: '0.73rem', color: '#64748b' }}>Transactions &gt; $500.00 require secondary approval ticket</div>
              </div>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700 }}>$500.00 LIMIT</span>
          </div>

          {/* Cryptographic SHA-256 Merkle Chain Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                <FileCode size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Immutable Audit Chain</div>
                <div style={{ fontSize: '0.73rem', color: '#64748b' }}>All transactions hashed and chained with SHA-256 Merkle tree</div>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>VERIFIED</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT: ACTIVE SESSIONS & DEVICE REVOCATION                   */}
        {/* ============================================================ */}
        <div className="fintech-card" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>Active Sessions & Devices</h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                Authorized devices with valid SPIFFE / HMAC workload tokens
              </p>
            </div>

            {sessions.length > 1 && (
              <button
                onClick={handleRevokeOtherSessions}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 12px', color: '#f43f5e' }}
              >
                <LogOut size={13} />
                <span>Revoke Others</span>
              </button>
            )}
          </div>

          {revokedNotice && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              fontSize: '0.78rem',
              marginBottom: '14px'
            }}>
              All other active sessions have been terminated. Cryptographic tokens revoked.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sessions.map(s => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: s.current ? 'rgba(56, 189, 248, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${s.current ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} style={{ color: s.current ? '#38bdf8' : '#64748b' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                        {s.device}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        {s.location} &bull; IP: {s.ip}
                      </div>
                    </div>
                  </div>

                  {s.current ? (
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)' }}>
                      CURRENT
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                      Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
