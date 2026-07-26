'use client';

import { useGame } from '@/context/GameContext';

export default function TopHUD() {
  const { state } = useGame();

  const hearts = Array.from({ length: state.maxHearts }, (_, i) => i < state.hearts);

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
      <div className="hud-stat" title="German Course">
        <span style={{ fontSize: '1.375rem', lineHeight: 1 }}>🇩🇪</span>
        <span style={{ fontWeight: 900, fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>18</span>
      </div>

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
