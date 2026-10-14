import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Plane,
  Shield,
  ShieldAlert,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  DollarSign,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CardManagementView({
  isCardFrozen,
  onToggleFreezeCard
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [atmLimit, setAtmLimit] = useState(1000);
  const [cashbackRedeemed, setCashbackRedeemed] = useState(false);
  const [travelNoticeActive, setTravelNoticeActive] = useState(true);
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Virtual card generator state
  const [virtualCard, setVirtualCard] = useState(null);

  // Countdown timer for revealing full card number
  useEffect(() => {
    let interval = null;
    if (showNumbers && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setShowNumbers(false);
    }
    return () => clearInterval(interval);
  }, [showNumbers, timerSeconds]);

  const handleRevealCard = () => {
    if (showNumbers) {
      setShowNumbers(false);
      setTimerSeconds(0);
    } else {
      setShowNumbers(true);
      setTimerSeconds(30);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeemCashback = () => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setCashbackRedeemed(true);
  };

  const handleGenerateVirtualCard = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const randomCvv = Math.floor(100 + Math.random() * 900);
    setVirtualCard({
      number: `4821 9912 3418 ${randomSuffix}`,
      cvv: randomCvv.toString(),
      exp: '11/27',
      limit: 350.00
    });
    confetti({ particleCount: 40, spread: 50 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Top Banner */}
      <div className="fintech-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>Card Controls & Virtual Shield</h1>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              Manage physical Visa Infinite card locks, issue disposable virtual cards, adjust ATM limits, and submit international travel notices.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isCardFrozen ? '#fb7185' : '#34d399' }}>
              {isCardFrozen ? 'Card Locked' : 'Card Active & Protected'}
            </span>
            <label className="switch-container">
              <input type="checkbox" checked={!isCardFrozen} onChange={onToggleFreezeCard} />
              <span className="switch-slider" />
            </label>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '24px' }}>
        {/* ============================================================ */}
        {/* LEFT: 3D CARD VISUALIZER                                     */}
        {/* ============================================================ */}
        <div className="fintech-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary Metal Card</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Apex Customized Cash Rewards</h3>
            </div>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              <RotateCcw size={13} />
              <span>{isFlipped ? 'Show Front' : 'Flip to Back'}</span>
            </button>
          </div>

          {/* 3D Flippable Card Stage */}
          <div className="card-perspective" style={{ width: '100%', maxWidth: '380px', height: '220px' }}>
            <div className={`card-flip-inner ${isFlipped ? 'is-flipped' : ''}`}>
              {/* FRONT OF CARD */}
              <div
                className="card-front"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: isCardFrozen
                    ? 'linear-gradient(135deg, #0f172a 0%, #0369a1 50%, #082f49 100%)'
                    : 'linear-gradient(135deg, #0284c7 0%, #1e1b4b 60%, #09090b 100%)',
                  border: isCardFrozen ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  filter: isCardFrozen ? 'grayscale(0.3) brightness(0.9)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Frozen Overlay Badge */}
                {isCardFrozen && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: 'rgba(244, 63, 94, 0.85)',
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em'
                  }}>
                    FROZEN / LOCKED
                  </div>
                )}

                {/* Card Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: '#38bdf8' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em' }}>MERIDIAN APEX</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, opacity: 0.85, letterSpacing: '0.08em' }}>VISA INFINITE</span>
                </div>

                {/* EMV Chip & Contactless */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', margin: '14px 0 6px 0' }}>
                  <div className="metal-chip" />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
                    <path d="M8.5 16.5a5 5 0 0 1 0-9M12 19a9 9 0 0 0 0-14M15.5 21.5a13 13 0 0 0 0-19" />
                  </svg>
                </div>

                {/* 16 Digit Number */}
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  fontFamily: 'var(--font-mono)',
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  {showNumbers ? '4582 9912 3841 9024' : '4582 •••• •••• 9024'}
                </div>

                {/* Cardholder Name & Expiry */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.72rem', letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.9 }}>
                  <div>
                    <span style={{ fontSize: '0.58rem', display: 'block', color: 'rgba(255,255,255,0.6)' }}>CARDHOLDER</span>
                    <strong>ALEXANDER VANCE</strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.58rem', display: 'block', color: 'rgba(255,255,255,0.6)' }}>VALID THRU</span>
                    <strong>08/29</strong>
                  </div>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div
                className="card-back"
                style={{
                  padding: '20px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'linear-gradient(135deg, #090d16 0%, #1e293b 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7)',
                  color: '#fff'
                }}
              >
                {/* Magnetic Strip */}
                <div style={{ width: '100%', height: '42px', background: '#020617', margin: '4px 0 14px 0' }} />

                {/* Signature Strip & CVV */}
                <div style={{ padding: '0 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      flex: 1,
                      height: '32px',
                      background: '#e2e8f0',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 10px',
                      color: '#0f172a',
                      fontFamily: 'cursive',
                      fontSize: '0.85rem'
                    }}>
                      Alexander Vance
                    </div>
                    <div style={{
                      padding: '6px 10px',
                      borderRadius: '4px',
                      background: '#ffffff',
                      color: '#020617',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem'
                    }}>
                      {showNumbers ? '892' : '•••'}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                    CVV Security Code: 3-digit security code for online verification
                  </span>
                </div>

                <div style={{ padding: '0 24px', fontSize: '0.62rem', color: '#64748b', lineHeight: 1.3 }}>
                  Issued by Meridian Apex Federal Reserve. Unauthorized use is prohibited. Found cards return to nearest branch.
                </div>
              </div>
            </div>
          </div>

          {/* Reveal Credentials Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '380px' }}>
            <button
              onClick={handleRevealCard}
              className="btn-secondary"
              style={{ flex: 1, padding: '10px', fontSize: '0.8rem', justifyContent: 'center' }}
            >
              {showNumbers ? <EyeOff size={15} /> : <Eye size={15} />}
              <span>{showNumbers ? `Hide (${timerSeconds}s)` : 'Reveal Number & CVV'}</span>
            </button>

            <button
              onClick={() => handleCopy('4582991238419024')}
              className="btn-secondary"
              style={{ padding: '10px 14px', fontSize: '0.8rem' }}
              title="Copy 16 Digits"
            >
              {copied ? <Check size={15} style={{ color: '#10b981' }} /> : <Copy size={15} />}
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT: CARD PREFERENCES, REWARDS & CONTROLS                  */}
        {/* ============================================================ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Cash Back Rewards Redemption Box */}
          <div className="fintech-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.3) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>Cash Back Rewards Balance</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                  {cashbackRedeemed ? '$0.00' : '$485.20'}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  3% on Online Shopping &bull; 2% on Grocery &bull; 1% all other purchases
                </span>
              </div>

              <button
                onClick={handleRedeemCashback}
                disabled={cashbackRedeemed}
                className="btn-primary"
                style={{
                  background: cashbackRedeemed ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  fontSize: '0.8rem',
                  padding: '9px 16px',
                  boxShadow: cashbackRedeemed ? 'none' : '0 2px 10px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Sparkles size={14} />
                <span>{cashbackRedeemed ? 'Redeemed!' : 'Redeem to Checking'}</span>
              </button>
            </div>
          </div>

          {/* Virtual Card Generator */}
          <div className="fintech-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff' }}>Virtual Disposable Cards</h3>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                  Single-use or merchant-locked virtual numbers for safe online shopping without revealing your real card.
                </p>
              </div>

              <button
                onClick={handleGenerateVirtualCard}
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '8px 12px' }}
              >
                <RefreshCw size={13} />
                <span>Generate</span>
              </button>
            </div>

            {virtualCard ? (
              <div style={{
                padding: '14px',
                borderRadius: '10px',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                    {virtualCard.number}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                    CVV: {virtualCard.cvv} &bull; EXP: {virtualCard.exp} &bull; Max Limit: ${virtualCard.limit.toFixed(2)}
                  </div>
                </div>
                <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: '#38bdf8', color: '#000', fontWeight: 700 }}>
                  SINGLE USE
                </span>
              </div>
            ) : (
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                No active virtual card generated. Click "Generate" to create one instantly.
              </div>
            )}
          </div>

          {/* Daily ATM Withdrawal Limits Slider */}
          <div className="fintech-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={16} style={{ color: '#38bdf8' }} />
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>Daily ATM Withdrawal Limit</h3>
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>${atmLimit}</span>
            </div>
            <input
              type="range"
              min="200"
              max="2500"
              step="100"
              value={atmLimit}
              onChange={e => setAtmLimit(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#38bdf8', margin: '10px 0' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
              <span>$200 Min</span>
              <span>$1,000 Standard</span>
              <span>$2,500 Diamond Max</span>
            </div>
          </div>

          {/* Travel Notice Status */}
          <div className="fintech-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <Plane size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>International Travel Notice</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Tokyo, Japan (Oct 20 &ndash; Nov 05, 2026)</div>
              </div>
            </div>

            <button
              onClick={() => alert("Travel notice updated: Overseas chip & contactless payments enabled without fraud disruption.")}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px' }}
            >
              Modify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
