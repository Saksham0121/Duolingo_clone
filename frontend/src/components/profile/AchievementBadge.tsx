'use client';

import Image from 'next/image';
import type { Achievement } from '@/types';

interface AchievementBadgeProps {
  achievement: Achievement;
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const iconMap: Record<string, string> = {
    first_lesson: '🎯',
    streak_7: '🔥',
    streak_30: '👑',
    xp_100: '⚡',
    xp_500: '🌟',
  };

  const icon = iconMap[achievement.badge_type] ?? '🏆';

  return (
    <div
      className="duo-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
      }}
    >
      <div className="achievement-badge" style={{ flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
          {achievement.badge_name}
        </h4>
        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', margin: '0.2rem 0' }}>
          {achievement.badge_description}
        </p>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          Unlocked {new Date(achievement.earned_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
