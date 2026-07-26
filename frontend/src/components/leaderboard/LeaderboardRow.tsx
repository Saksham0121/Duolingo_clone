'use client';

import UserAvatar from '@/components/ui/UserAvatar';
import type { LeaderboardEntry } from '@/types';

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
}

export default function LeaderboardRow({ entry }: LeaderboardRowProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div
      className={`lb-row${entry.is_current_user ? ' current-user' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '0.875rem 1.25rem',
      }}
    >
      <div
        style={{
          width: '2rem',
          fontWeight: 900,
          fontSize: '1.125rem',
          textAlign: 'center',
          color: entry.rank <= 3 ? 'var(--color-duo-yellow)' : 'var(--color-text-muted)',
        }}
      >
        {getRankBadge(entry.rank)}
      </div>

      <UserAvatar
        username={entry.username}
        avatarUrl={entry.avatar_url}
        size={40}
        showBadge={entry.rank <= 3}
        badgeIcon={entry.rank === 1 ? '👑' : entry.rank === 2 ? '⚡' : '🌟'}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontWeight: 800,
            fontSize: '1rem',
            color: entry.is_current_user ? 'var(--color-duo-blue)' : 'var(--color-text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {entry.username} {entry.is_current_user && '(You)'}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          {entry.league} League
        </p>
      </div>

      <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--color-duo-yellow)' }}>
        {entry.weekly_xp} XP
      </div>
    </div>
  );
}
