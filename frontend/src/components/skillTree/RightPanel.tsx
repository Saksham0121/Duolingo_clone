'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLeaderboard } from '@/lib/api';
import { useGame } from '@/context/GameContext';
import type { LeaderboardEntry } from '@/types';
import UserAvatar from '@/components/ui/UserAvatar';

// ── Super Promo Card ───────────────────────────────────────────────────────
function SuperPromoCard() {
  return (
    <div
      className="duo-card"
      style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span
          style={{
            background: 'linear-gradient(135deg, #ce82ff, #7c3aed)',
            color: 'white',
            fontWeight: 900,
            fontSize: '0.75rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            letterSpacing: '0.06em',
          }}
        >
          SUPER
        </span>
        <span style={{ fontSize: '1.5rem' }}>🦋</span>
      </div>
      <p style={{ fontWeight: 800, fontSize: '1rem' }}>Try Super for free</p>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
        No ads, personalized practice, and unlimited Legendary!
      </p>
      <button className="btn-duo-green" style={{ textAlign: 'center', width: '100%', marginTop: '0.25rem' }}>
        TRY 1 WEEK FREE
      </button>
    </div>
  );
}

// ── Leaderboard Snippet ────────────────────────────────────────────────────
function LeaderboardSnippet() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const { state } = useGame();

  useEffect(() => {
    getLeaderboard(state.userId).then(setEntries).catch(() => {});
  }, [state.userId]);

  const top3 = entries.slice(0, 3);
  const myEntry = entries.find((e) => e.is_current_user);

  return (
    <div className="duo-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            LEADERBOARDS
          </p>
          <p style={{ fontWeight: 800, fontSize: '0.9375rem' }}>
            {myEntry ? `You're rank #${myEntry.rank}!` : 'Congratulations!'}
          </p>
          {myEntry && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              {myEntry.weekly_xp} XP this week · {myEntry.league} League
            </p>
          )}
        </div>
        <span style={{ fontSize: '2rem' }}>🏆</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {top3.map((e, i) => (
          <div key={e.username} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 800, width: '1.25rem', color: 'var(--color-text-muted)' }}>
              {i + 1}
            </span>
            <UserAvatar username={e.username} avatarUrl={e.avatar_url} size={28} />
            <span style={{ flex: 1, fontWeight: 700, fontSize: '0.875rem', color: e.is_current_user ? 'var(--color-duo-blue)' : 'var(--color-text-primary)' }}>
              {e.username}
            </span>
            <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--color-duo-yellow)' }}>
              {e.weekly_xp} XP
            </span>
          </div>
        ))}
      </div>

      <Link href="/leaderboards">
        <button
          style={{
            width: '100%',
            background: 'none',
            border: '2px solid var(--color-bg-border)',
            borderRadius: '0.75rem',
            padding: '0.625rem',
            color: 'var(--color-duo-blue)',
            fontWeight: 800,
            fontSize: '0.875rem',
            cursor: 'pointer',
            letterSpacing: '0.04em',
            fontFamily: "'Nunito', sans-serif",
            transition: 'background 0.15s',
          }}
        >
          GO TO LEADERBOARDS
        </button>
      </Link>
    </div>
  );
}

// ── Daily Quests Snippet ───────────────────────────────────────────────────
function DailyQuestsSnippet() {
  const { state } = useGame();
  const goalXp = 20;
  const earnedToday = Math.min(state.weeklyXp % 50, goalXp); // rough daily estimate

  return (
    <div className="duo-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
        <p style={{ fontWeight: 800 }}>Daily Quests</p>
        <Link href="/quests" style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-duo-blue)', textDecoration: 'none' }}>
          VIEW ALL
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.75rem' }}>⚡</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.375rem' }}>Earn {goalXp} XP</p>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min((earnedToday / goalXp) * 100, 100)}%` }}
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            {earnedToday} / {goalXp}
          </p>
        </div>
        <span style={{ fontSize: '1.5rem' }}>🎁</span>
      </div>
    </div>
  );
}

// ── Course Switcher Component with "Coming Soon" Tooltip ────────────────────
function CourseSelector() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontWeight: 800,
          fontSize: '0.9375rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.2rem 0.4rem',
          borderRadius: '0.5rem',
          transition: 'all 0.15s ease',
        }}
      >
        <span style={{ fontSize: '1.25rem' }}>🇩🇪</span>
        <span style={{ color: 'var(--color-text-primary)' }}>18</span>
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

// ── HUD Header inside Right Panel (Exact Match to Screenshot!) ─────────────
function PanelHUDHeader() {
  const { state } = useGame();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.25rem 0.25rem 0.75rem',
        width: '100%',
      }}
    >
      {/* Course Selector Flag */}
      <CourseSelector />

      {/* Streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, fontSize: '0.9375rem' }} title={`${state.streak}-day streak`}>
        <span style={{ fontSize: '1.125rem' }}>🔥</span>
        <span style={{ color: 'var(--color-duo-orange)' }}>{state.streak}</span>
      </div>

      {/* Gems */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, fontSize: '0.9375rem' }} title={`${state.gems} gems`}>
        <span style={{ fontSize: '1.125rem' }}>💎</span>
        <span style={{ color: 'var(--color-duo-blue)' }}>{state.gems}</span>
      </div>

      {/* Hearts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 800, fontSize: '0.9375rem' }} title={`${state.hearts}/${state.maxHearts} hearts`}>
        <span style={{ fontSize: '1.125rem', color: '#ff4b4b' }}>❤️</span>
        <span style={{ color: '#ff4b4b' }}>{state.hearts}</span>
      </div>
    </div>
  );
}

// ── Exported combined panel ────────────────────────────────────────────────
export default function RightPanel() {
  return (
    <>
      <PanelHUDHeader />
      <SuperPromoCard />
      <LeaderboardSnippet />
      <DailyQuestsSnippet />
    </>
  );
}
