'use client';

import { useEffect, useState } from 'react';
import UserAvatar from '@/components/ui/UserAvatar';
import AppShell from '@/components/layout/AppShell';
import AchievementBadge from '@/components/profile/AchievementBadge';
import { useGame } from '@/context/GameContext';
import { getUserAchievements, simulateMissedDay } from '@/lib/api';
import type { Achievement } from '@/types';

export default function ProfilePage() {
  const { state, reload } = useGame();
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

  const handleSimulateMissedDay = async () => {
    try {
      await simulateMissedDay(state.userId);
      await reload();
      alert('Simulated missed day! Streak reset to 0. Complete a lesson to restart your streak from 1.');
    } catch (err) {
      console.error('Failed to simulate missed day:', err);
    }
  };

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
              Joined July 2026 · Simplified Auth Mode
            </p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 900, fontSize: '1.375rem', color: 'var(--color-text-primary)' }}>
              Statistics
            </h2>
            <button
              type="button"
              onClick={handleSimulateMissedDay}
              style={{
                background: 'none',
                border: '2px solid var(--color-duo-orange)',
                color: 'var(--color-duo-orange)',
                borderRadius: '0.75rem',
                padding: '0.4rem 0.875rem',
                fontWeight: 800,
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontFamily: "'Nunito', sans-serif",
              }}
              title="Test streak reset logic"
            >
              🧪 Test Streak Reset
            </button>
          </div>
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

        {/* Placeholder / Mocked Features Section */}
        <div>
          <h2 style={{ fontWeight: 900, fontSize: '1.375rem', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            Features & Roadmap
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Speech Recognition */}
            <div className="duo-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.75rem' }}>🎙️</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-duo-yellow)', backgroundColor: 'rgba(255,200,0,0.15)', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>
                  COMING SOON
                </span>
              </div>
              <p style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Speech & Pronunciation</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Real-time voice analysis exercises</p>
            </div>

            {/* Friends & Social */}
            <div className="duo-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.75rem' }}>👥</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-duo-yellow)', backgroundColor: 'rgba(255,200,0,0.15)', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>
                  COMING SOON
                </span>
              </div>
              <p style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Friends & Social Quest</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Follow friends & monthly quests</p>
            </div>

            {/* Multi-Language */}
            <div className="duo-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.75rem' }}>🌐</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-duo-yellow)', backgroundColor: 'rgba(255,200,0,0.15)', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>
                  COMING SOON
                </span>
              </div>
              <p style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Multi-Language Courses</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Spanish, French, Japanese courses</p>
            </div>

            {/* Simplified Auth */}
            <div className="duo-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.75rem' }}>🔐</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-duo-blue)', backgroundColor: 'rgba(28,176,246,0.15)', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>
                  ACTIVE (MOCKED)
                </span>
              </div>
              <p style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Simplified Learner Auth</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Default learner profile persistent state</p>
            </div>
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
