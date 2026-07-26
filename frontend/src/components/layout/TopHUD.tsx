'use client';

import { useGame } from '@/context/GameContext';
import Image from 'next/image';

export default function TopHUD() {
  const { state } = useGame();

  const hearts = Array.from({ length: state.maxHearts }, (_, i) => i < state.hearts);

  return (
    <header
      style={{
        height: '3.5rem',
        backgroundColor: 'var(--color-bg-card)',
        borderBottom: '1px solid var(--color-bg-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingInline: '1.5rem',
        gap: '0.25rem',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
      }}
    >
      {/* Flag */}
      <div className="hud-stat" style={{ marginRight: '0.5rem' }}>
        <span style={{ fontSize: '1.375rem' }}>🇩🇪</span>
      </div>

      {/* Streak */}
      <div className="hud-stat" title={`${state.streak}-day streak`}>
        <span style={{ fontSize: '1.25rem' }}>🔥</span>
        <span style={{ color: 'var(--color-duo-orange)' }}>{state.streak}</span>
      </div>

      <div style={{ width: '1px', height: '1.5rem', backgroundColor: 'var(--color-bg-border)', margin: '0 0.25rem' }} />

      {/* XP */}
      <div className="hud-stat" title={`${state.totalXp} total XP`}>
        <span style={{ fontSize: '1.25rem' }}>⚡</span>
        <span style={{ color: 'var(--color-duo-yellow)' }}>{state.totalXp.toLocaleString()}</span>
      </div>

      <div style={{ width: '1px', height: '1.5rem', backgroundColor: 'var(--color-bg-border)', margin: '0 0.25rem' }} />

      {/* Gems */}
      <div className="hud-stat" title={`${state.gems} gems`}>
        <span style={{ fontSize: '1.25rem' }}>💎</span>
        <span style={{ color: 'var(--color-duo-blue)' }}>{state.gems}</span>
      </div>

      <div style={{ width: '1px', height: '1.5rem', backgroundColor: 'var(--color-bg-border)', margin: '0 0.25rem' }} />

      {/* Hearts */}
      <div className="hud-stat" title={`${state.hearts}/${state.maxHearts} hearts`}>
        {hearts.map((full, i) => (
          <span
            key={i}
            className={`heart-icon${full ? '' : ' empty'}`}
            style={{ fontSize: '1.25rem', lineHeight: 1 }}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Avatar */}
      {state.avatarUrl && (
        <>
          <div style={{ width: '1px', height: '1.5rem', backgroundColor: 'var(--color-bg-border)', margin: '0 0.5rem' }} />
          <Image
            src={state.avatarUrl}
            alt={state.username}
            width={32}
            height={32}
            style={{ borderRadius: '9999px', border: '2px solid var(--color-bg-border)' }}
          />
        </>
      )}
    </header>
  );
}
