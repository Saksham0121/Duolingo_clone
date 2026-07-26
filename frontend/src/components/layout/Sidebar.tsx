'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGame } from '@/context/GameContext';

const NAV_ITEMS = [
  { href: '/learn',        label: 'LEARN',        icon: '🏠' },
  { href: '/practice',     label: 'PRACTICE',     icon: '🎯' },
  { href: '/leaderboards', label: 'LEADERBOARDS', icon: '🏆' },
  { href: '/quests',       label: 'QUESTS',       icon: '⚡' },
  { href: '/shop',         label: 'SHOP',         icon: '🛒' },
  { href: '/profile',      label: 'PROFILE',      icon: '👤' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state } = useGame();

  return (
    <aside
      className="app-sidebar"
      style={{
        width: '14rem',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-card)',
        borderRight: '1px solid var(--color-bg-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 0.75rem',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Link
        href="/learn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          paddingLeft: '0.5rem',
          textDecoration: 'none',
        }}
      >
        <span
          style={{
            padding: 6,
            color: 'var(--color-duo-green)',
            fontWeight: 900,
            fontSize: '1.375rem',
            letterSpacing: '-0.01em',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          duolingo
        </span>
      </Link>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} className={`sidebar-item${isActive ? ' active' : ''}`}>
              <span style={{ fontSize: '1.375rem', lineHeight: 1 }}>{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}

        {/* MORE item */}
        <button
          className="sidebar-item"
          style={{ background: 'none', border: '2px solid transparent', cursor: 'pointer', width: '100%' }}
        >
          <span style={{ fontSize: '1.375rem' }}>···</span>
          <span>MORE</span>
        </button>
      </nav>

      {/* Bottom promo card */}
      <div
        style={{
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-bg-border)',
          borderRadius: '0.875rem',
          padding: '1rem',
          marginTop: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🧩</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: '0.875rem',
              color: 'var(--color-text-primary)',
              lineHeight: 1.3,
            }}
          >
            {state.loaded ? `${state.username},` : 'Keep it up!'} learn German daily!
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
          Duolingo makes it easy!
        </p>
        <Link href="/learn">
          <button
            style={{
              background: 'none',
              border: '2px solid var(--color-duo-blue)',
              color: 'var(--color-duo-blue)',
              borderRadius: '0.5rem',
              padding: '0.4rem 0.75rem',
              fontWeight: 800,
              fontSize: '0.75rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              width: '100%',
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            START LEARNING
          </button>
        </Link>
      </div>
    </aside>
  );
}
