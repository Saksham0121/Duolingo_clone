'use client';

import { useEffect, useState } from 'react';
import UserAvatar from '@/components/ui/UserAvatar';
import AppShell from '@/components/layout/AppShell';
import AchievementBadge from '@/components/profile/AchievementBadge';
import { useGame } from '@/context/GameContext';
import { getUserAchievements } from '@/lib/api';
import type { Achievement } from '@/types';

export default function ProfilePage() {
  const { state } = useGame();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (state.userId) {
      getUserAchievements(state.userId)
        .then(setAchievements)
        .catch((err) => console.error('Failed to load achievements:', err));
    }
  }, [state.userId]);

  const stats = [
    { icon: '🔥', label: 'Day streak', value: state.streak },
    { icon: '⚡', label: 'Total XP', value: state.totalXp },
    { icon: '🏆', label: 'Current League', value: 'Bronze' },
    { icon: '🇩🇪', label: 'Course', value: 'German' },
  ];

  return (
    <AppShell>
      <div style={{ maxWidth: '42rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* User Header */}
        <div className="duo-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.75rem' }}>
          <UserAvatar
            username={state.username || 'Learner'}
            avatarUrl={state.avatarUrl}
            size={80}
            showBadge={true}
            badgeIcon="⚡"
          />

          <div>
            <h1 style={{ fontWeight: 900, fontSize: '1.75rem', color: 'var(--color-text-primary)' }}>
              {state.username}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              Joined July 2026
            </p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div>
          <h2 style={{ fontWeight: 900, fontSize: '1.375rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            Statistics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="duo-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <h2 style={{ fontWeight: 900, fontSize: '1.375rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            Achievements ({achievements.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {achievements.length > 0 ? (
              achievements.map((ach) => (
                <AchievementBadge key={ach.id} achievement={ach} />
              ))
            ) : (
              <div className="duo-card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                No achievements unlocked yet. Complete lessons to earn badges!
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
