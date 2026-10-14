import React, { useState } from 'react';
import { Camera, X, CheckCircle2, ShieldCheck, Upload, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MobileDepositModal({ isOpen, onClose, onDepositSuccess }) {
  if (!isOpen) return null;

  const [amount, setAmount] = useState('');
  const [targetAccount, setTargetAccount] = useState('ACC-101');
  const [frontCaptured, setFrontCaptured] = useState(false);
  const [backCaptured, setBackCaptured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !frontCaptured || !backCaptured) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      if (onDepositSuccess) {
        onDepositSuccess({
          amount: parseFloat(amount),
          account: targetAccount
        });
      }
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        setFrontCaptured(false);
        setBackCaptured(false);
        onClose();
      }, 2500);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="fintech-card"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '28px',
          background: '#0d1322',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
              <Camera size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>Mobile Check Deposit</h2>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Deposit checks directly from your mobile camera or device</span>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={48} style={{ color: '#10b981' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Check Deposit Accepted!</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              ${parseFloat(amount).toFixed(2)} will be credited to Advantage Checking. Immediate availability: $225.00 today, remaining balance next business day.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Deposit to Account
              </label>
              <select
                value={targetAccount}
                onChange={e => setTargetAccount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.85rem'
                }}
              >
                <option value="ACC-101" style={{ background: '#0d1322' }}>Advantage Checking (...4819)</option>
                <option value="ACC-102" style={{ background: '#0d1322' }}>Advantage Savings (...3391)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Check Amount ($ USD)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 700 }}>$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 28px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 700
                  }}
                  required
                />
              </div>
            </div>

            {/* Check Photos Simulation Stage */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Front of Check */}
              <div
                onClick={() => setFrontCaptured(!frontCaptured)}
                style={{
                  height: '110px',
                  borderRadius: '10px',
                  border: `2px dashed ${frontCaptured ? '#10b981' : 'rgba(255, 255, 255, 0.2)'}`,
                  background: frontCaptured ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {frontCaptured ? (
                  <>
                    <CheckCircle2 size={24} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>Front Captured ✓</span>
                  </>
                ) : (
                  <>
                    <Camera size={22} style={{ color: '#94a3b8' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Tap for Front Photo</span>
                  </>
                )}
              </div>

              {/* Back of Check */}
              <div
                onClick={() => setBackCaptured(!backCaptured)}
                style={{
                  height: '110px',
                  borderRadius: '10px',
                  border: `2px dashed ${backCaptured ? '#10b981' : 'rgba(255, 255, 255, 0.2)'}`,
                  background: backCaptured ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {backCaptured ? (
                  <>
                    <CheckCircle2 size={24} style={{ color: '#10b981' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>Back Endorsed ✓</span>
                  </>
                ) : (
                  <>
                    <Camera size={22} style={{ color: '#94a3b8' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>Tap for Back Photo</span>
                  </>
                )}
              </div>
            </div>

            <div style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.4 }}>
              * Make sure the back of the check is signed with "For Mobile Deposit Only at Meridian Apex".
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" onClick={onClose} className="btn-secondary" style={{ padding: '10px 16px' }}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={!frontCaptured || !backCaptured || !amount || isSubmitting}
                className="btn-primary"
                style={{
                  padding: '10px 22px',
                  opacity: (!frontCaptured || !backCaptured || !amount || isSubmitting) ? 0.5 : 1
                }}
              >
                {isSubmitting ? 'Verifying Endorsement...' : 'Submit Deposit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
