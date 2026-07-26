'use client';

import Sidebar from '@/components/layout/Sidebar';
import TopHUD from '@/components/layout/TopHUD';
import MobileNav from '@/components/layout/MobileNav';
import { type ReactNode } from 'react';

/**
 * AppShell — the responsive layout used by all main pages.
 * Left: Sidebar (desktop) | Center: Main content | Right: Contextual panel (desktop lg+)
 * Bottom: Mobile nav (mobile <768px)
 */
export default function AppShell({
  children,
  rightPanel,
}: {
  children: ReactNode;
  rightPanel?: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      {/* Left sidebar (desktop) */}
      <Sidebar />

      {/* Center + right */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopHUD />

        <div
          className="app-main-container"
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            gap: '2rem',
            padding: '2rem',
            maxWidth: '72rem',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {/* Main content */}
          <main style={{ flex: 1, minWidth: 0 }}>{children}</main>

          {/* Right panel (hides automatically on screens <1024px) */}
          {rightPanel && (
            <aside
              className="app-right-panel"
              style={{
                width: '22rem',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'sticky',
                top: '1.5rem',
                alignSelf: 'flex-start',
                maxHeight: 'calc(100vh - 3rem)',
                overflowY: 'auto',
              }}
            >
              {rightPanel}
            </aside>
          )}
        </div>
      </div>

      {/* Mobile bottom navigation (shows automatically on screens <768px) */}
      <MobileNav />
    </div>
  );
}
