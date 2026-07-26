'use client';

import { useGame } from '@/context/GameContext';

interface LessonHeaderProps {
  current: number;      // 0-indexed current exercise
  total: number;
  onExit: () => void;
}

export default function LessonHeader({ current, total, onExit }: LessonHeaderProps) {
  const { state } = useGame();
  const pct = total > 0 ? (current / total) * 100 : 0;
  const hearts = Array.from({ length: state.maxHearts }, (_, i) => i < state.hearts);

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.5rem',
        backgroundColor: 'var(--color-bg-primary)',
        borderBottom: '1px solid var(--color-bg-border)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Exit button */}
      <button
        onClick={onExit}
        aria-label="Exit lesson"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-text-muted)',
          fontSize: '1.5rem',
          cursor: 'pointer',
          lineHeight: 1,
          padding: '0.25rem',
          borderRadius: '0.5rem',
          flexShrink: 0,
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-duo-red)')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)')}
      >
        ✕
      </button>

      {/* Progress bar */}
      <div className="progress-bar" style={{ flex: 1 }}>
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      {/* Hearts */}
      <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
        {hearts.map((full, i) => (
          <span key={i} className={`heart-icon${full ? '' : ' empty'}`}>
            ❤️
          </span>
        ))}
      </div>
    </header>
  );
}
