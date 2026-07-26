import AppShell from '@/components/layout/AppShell';

export default function QuestsPage() {
  const quests = [
    { icon: '⚡', label: 'Earn 20 XP', progress: 0, goal: 20, color: 'var(--color-duo-yellow)' },
    { icon: '📖', label: 'Complete 3 lessons', progress: 1, goal: 3, color: 'var(--color-duo-blue)' },
    { icon: '🔥', label: 'Maintain your streak', progress: 1, goal: 1, color: 'var(--color-duo-orange)' },
  ];

  return (
    <AppShell>
      <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '1.5rem' }}>Daily Quests</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {quests.map((q) => (
            <div key={q.label} className="duo-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '2rem' }}>{q.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{q.label}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    {q.progress} / {q.goal}
                  </p>
                </div>
                {q.progress >= q.goal && (
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                )}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min((q.progress / q.goal) * 100, 100)}%`,
                    background: `linear-gradient(90deg, ${q.color}, ${q.color})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
