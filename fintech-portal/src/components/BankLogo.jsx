import React from 'react';

/**
 * BankLogo Component
 * 
 * NOTE FOR USER:
 * When you are ready to provide your custom bank logo,
 * you can pass `logoUrl="/path/to/your-logo.svg"` or replace the content
 * inside the marked container below!
 */
export default function BankLogo({
  logoUrl = null,
  size = 'md',
  showText = true,
  subtitle = 'PRIVATE BANK & TRUST'
}) {
  const dimensions = {
    sm: { icon: 30, text: '0.95rem', sub: '0.55rem', gap: '8px' },
    md: { icon: 38, text: '1.15rem', sub: '0.62rem', gap: '12px' },
    lg: { icon: 48, text: '1.4rem', sub: '0.72rem', gap: '14px' }
  }[size] || { icon: 38, text: '1.15rem', sub: '0.62rem', gap: '12px' };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: dimensions.gap, userSelect: 'none' }}>
      {/* ============================================================== */}
      {/* LOGO CONTAINER: Easily customizable for your custom logo       */}
      {/* ============================================================== */}
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Bank Logo"
          style={{
            width: `${dimensions.icon}px`,
            height: `${dimensions.icon}px`,
            objectFit: 'contain'
          }}
        />
      ) : (
        /* Sleek Blank Geometric Crest Placeholder */
        <div
          title="Bank Logo Placeholder (Ready for your custom logo)"
          style={{
            width: `${dimensions.icon}px`,
            height: `${dimensions.icon}px`,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 50%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle architectural pillar lines representing security & stability */}
          <svg
            width="60%"
            height="60%"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M14 10v11M12 2L2 7h20L12 2z" />
          </svg>
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%)',
              pointerEvents: 'none'
            }}
          />
        </div>
      )}

      {/* Brand Typography */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: dimensions.text,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                lineHeight: 1.1
              }}
            >
              MERIDIAN APEX
            </span>
            <span
              style={{
                fontSize: '0.6rem',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            >
              Federal Reserve
            </span>
          </div>
          <span
            style={{
              fontSize: dimensions.sub,
              letterSpacing: '0.12em',
              color: '#94a3b8',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginTop: '2px'
            }}
          >
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
}
