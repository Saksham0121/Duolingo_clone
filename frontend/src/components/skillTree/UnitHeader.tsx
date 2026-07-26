'use client';

import type { Unit } from '@/types';

interface UnitHeaderProps {
  unit: Unit;
  isExpanded?: boolean;
}

export default function UnitHeader({ unit }: UnitHeaderProps) {
  return (
    <div
      className="unit-banner animate-slide-down"
      style={{
        backgroundColor: unit.color_hex,
        boxShadow: `0 8px 24px ${unit.color_hex}66`,
        borderRadius: '1rem',
      }}
    >
      <div>
        <p
          className="unit-banner-title"
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '0.25rem',
          }}
        >
          {unit.title}
        </p>
        {unit.description && (
          <p className="unit-banner-desc" style={{ fontWeight: 900, fontSize: '1.25rem', color: 'white' }}>
            {unit.description}
          </p>
        )}
      </div>

      {/* Guidebook button */}
      <button
        className="unit-guidebook-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'rgba(255,255,255,0.2)',
          border: '2px solid rgba(255,255,255,0.5)',
          borderRadius: '0.75rem',
          padding: '0.5rem 1rem',
          color: 'white',
          fontWeight: 800,
          fontSize: '0.875rem',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          fontFamily: "'Nunito', sans-serif",
          letterSpacing: '0.04em',
          flexShrink: 0,
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.3)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.2)';
        }}
      >
        <span>📖</span>
        GUIDEBOOK
      </button>
    </div>
  );
}
