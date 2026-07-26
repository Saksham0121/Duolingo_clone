import AppShell from '@/components/layout/AppShell';

export default function PracticePage() {
  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', textAlign: 'center' }}>
        <span style={{ fontSize: '4rem' }}>🎯</span>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>Practice</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
          Adaptive practice sessions — <strong style={{ color: 'var(--color-duo-blue)' }}>Coming Soon</strong>
        </p>
      </div>
    </AppShell>
  );
}
