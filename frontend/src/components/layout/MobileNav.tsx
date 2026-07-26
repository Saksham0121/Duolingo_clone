'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/learn',        label: 'Learn',        icon: '🏠' },
  { href: '/practice',     label: 'Practice',     icon: '🎯' },
  { href: '/leaderboards', label: 'Rankings',     icon: '🏆' },
  { href: '/quests',       label: 'Quests',       icon: '⚡' },
  { href: '/shop',         label: 'Shop',         icon: '🛒' },
  { href: '/profile',      label: 'Profile',      icon: '👤' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="app-mobile-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4rem',
        backgroundColor: 'var(--color-bg-card)',
        borderTop: '1px solid var(--color-bg-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50,
        paddingInline: '0.5rem',
      }}
    >
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.15rem',
              color: isActive ? 'var(--color-duo-green)' : 'var(--color-text-secondary)',
              textDecoration: 'none',
              fontSize: '0.75rem',
              fontWeight: 800,
              flex: 1,
              padding: '0.25rem 0',
            }}
          >
            <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{icon}</span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
