'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLeaderboard } from '@/lib/api';
import { useGame } from '@/context/GameContext';
import type { LeaderboardEntry } from '@/types';
import Image from 'next/image';

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
            {e.avatar_url && (
              <Image src={e.avatar_url} alt={e.username} width={24} height={24} style={{ borderRadius: '9999px' }} />
            )}
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

// ── Exported combined panel ────────────────────────────────────────────────
export default function RightPanel() {
  return (
    <>
      <SuperPromoCard />
      <LeaderboardSnippet />
      <DailyQuestsSnippet />
    </>
  );
}
