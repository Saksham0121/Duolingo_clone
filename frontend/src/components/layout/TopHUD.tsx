'use client';

import { useState } from 'react';
import { useGame } from '@/context/GameContext';

function CourseSelector() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip((prev) => !prev)}
        className="hud-stat"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.2rem 0.4rem',
        }}
      >
        <span style={{ fontSize: '1.375rem', lineHeight: 1 }}>🇩🇪</span>
        <span style={{ fontWeight: 900, fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>18</span>
      </button>

      {/* Hover Tooltip */}
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: '0',
            backgroundColor: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            fontWeight: 800,
            fontSize: '0.75rem',
            padding: '0.4rem 0.75rem',
            borderRadius: '0.5rem',
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
            zIndex: 100,
            pointerEvents: 'none',
            border: '1px solid var(--color-bg-border)',
            letterSpacing: '0.02em',
          }}
        >
          Change Course — <span style={{ color: 'var(--color-duo-yellow)' }}>Coming Soon</span>
        </div>
      )}
    </div>
  );
}

export default function TopHUD() {
  const { state } = useGame();

  return (
    <header
      className="app-hud-header"
      style={{
        height: '3.5rem',
        backgroundColor: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-bg-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingInline: '1.25rem',
        gap: '0.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
        width: '100%',
      }}
    >
      {/* Course Flag */}
      <CourseSelector />

      {/* Streak */}
      <div className="hud-stat" title={`${state.streak}-day streak`}>
        <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>🔥</span>
        <span style={{ fontWeight: 900, fontSize: '0.9375rem', color: 'var(--color-duo-orange)' }}>{state.streak}</span>
      </div>

      {/* Total XP */}
      <div className="hud-stat" title={`${state.totalXp} total XP`}>
        <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>⚡</span>
        <span style={{ fontWeight: 900, fontSize: '0.9375rem', color: 'var(--color-duo-yellow)' }}>{state.totalXp.toLocaleString()}</span>
      </div>

      {/* Gems */}
      <div className="hud-stat" title={`${state.gems} gems`}>
        <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>💎</span>
        <span style={{ fontWeight: 900, fontSize: '0.9375rem', color: 'var(--color-duo-blue)' }}>{state.gems}</span>
      </div>

      {/* Hearts */}
      <div className="hud-stat" title={`${state.hearts}/${state.maxHearts} hearts`}>
        <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>❤️</span>
        <span style={{ fontWeight: 900, fontSize: '0.9375rem', color: '#ff4b4b' }}>{state.hearts}</span>
      </div>
    </header>
  );
}
