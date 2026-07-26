import AppShell from '@/components/layout/AppShell';

export default function ShopPage() {
  const items = [
    { icon: '❤️', name: 'Heart Refill', cost: '350 💎', desc: 'Refill all hearts instantly' },
    { icon: '🛡️', name: 'Streak Freeze', cost: '200 💎', desc: 'Protect your streak for one day' },
    { icon: '⚡', name: 'XP Boost', cost: '100 💎', desc: 'Double XP for 30 minutes' },
    { icon: '🎨', name: 'Outfit — Knight', cost: '500 💎', desc: 'Dress up your Duo owl' },
  ];

  return (
    <AppShell>
      <div style={{ maxWidth: '36rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Shop</h1>
          <div className="hud-stat">
            <span>💎</span>
            <span style={{ color: 'var(--color-duo-blue)' }}>975</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {items.map((item) => (
            <div key={item.name} className="duo-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
              <p style={{ fontWeight: 800, marginBottom: '0.25rem' }}>{item.name}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>{item.desc}</p>
              <button
                style={{
                  background: 'none',
                  border: '2px solid var(--color-duo-blue)',
                  color: 'var(--color-duo-blue)',
                  borderRadius: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  fontWeight: 800,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  fontFamily: "'Nunito', sans-serif",
                }}
              >
                {item.cost}
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          💡 Purchases are mocked — no real transactions
        </p>
      </div>
    </AppShell>
  );
}
