import React, { useState } from 'react';
import { MapPin, Phone, HelpCircle, Globe, Shield, ExternalLink, Calendar } from 'lucide-react';

export default function TopUtilityBar({ activePortal = 'personal', onSelectPortal }) {
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [showLocator, setShowLocator] = useState(false);

  return (
    <div style={{
      height: '32px',
      background: '#040711',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      fontSize: '0.72rem',
      color: '#94a3b8',
      userSelect: 'none'
    }}>
      {/* Left: Portals Navigation (Commercial, Personal, Wealth Management) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {[
          { id: 'personal', label: 'Personal Banking' },
          { id: 'business', label: 'Small Business' },
          { id: 'wealth', label: 'Wealth Management' },
          { id: 'commercial', label: 'Commercial & Institutional' }
        ].map(portal => (
          <button
            key={portal.id}
            onClick={() => onSelectPortal && onSelectPortal(portal.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px 0',
              cursor: 'pointer',
              color: activePortal === portal.id ? '#38bdf8' : '#94a3b8',
              fontWeight: activePortal === portal.id ? 700 : 500,
              borderBottom: activePortal === portal.id ? '2px solid #38bdf8' : '2px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            {portal.label}
          </button>
        ))}
      </div>

      {/* Right: Quick Utilities */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981' }}>
          <Shield size={12} />
          <span style={{ fontWeight: 600 }}>Member FDIC &bull; Equal Housing Lender</span>
        </div>

        <button
          onClick={() => alert("Branch & ATM Locator: 4 Locations within 2 miles of your IP location (Financial District Flagship, Grand Central Plaza, Midtown Tower, Wall Street Reserve).")}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontSize: '0.72rem'
          }}
        >
          <MapPin size={12} />
          <span>Locations & ATMs</span>
        </button>

        <button
          onClick={() => alert("Private Banking Concierge: 1-800-432-1000 (Available 24/7 Priority Support)")}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            fontSize: '0.72rem'
          }}
        >
          <Phone size={12} />
          <span>Contact Us</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <Globe size={12} />
          <span style={{ fontWeight: 600 }}>{selectedLanguage}</span>
        </div>
      </div>
    </div>
  );
}
