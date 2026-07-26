'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import LeaderboardRow from '@/components/leaderboard/LeaderboardRow';
import { getLeaderboard } from '@/lib/api';
import { useGame } from '@/context/GameContext';
import type { LeaderboardEntry } from '@/types';

export default function LeaderboardsPage() {
  const { state } = useGame();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard(state.userId)
      .then(setEntries)
      .catch((err) => console.error('Failed to load leaderboard:', err))
      .finally(() => setLoading(false));
  }, [state.userId]);

  return (
    <AppShell>
      <div style={{ maxWidth: '36rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* League Header */}
        <div
          className="duo-card"
          style={{
            textAlign: 'center',
            background: 'linear-gradient(185deg, var(--color-bg-card), var(--color-bg-elevated))',
            padding: '2rem 1.5rem',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🛡️</div>
          <h1 style={{ fontWeight: 900, fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>
            Bronze League
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Top 5 advance to the Silver League next week!
          </p>
        </div>

        {/* Leaderboard Entries */}
        <div className="duo-card" style={{ padding: '0.5rem 0' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
              Loading leaderboard...
            </div>
          ) : (
            entries.map((entry) => (
              <LeaderboardRow key={entry.username} entry={entry} />
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
