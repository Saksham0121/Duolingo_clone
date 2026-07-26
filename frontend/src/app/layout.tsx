import type { Metadata } from 'next';
import './globals.css';
import { GameProvider } from '@/context/GameContext';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Duolingo Clone — Learn German',
  description:
    'A full-stack Duolingo clone. Learn German with gamified lessons, streaks, hearts, and a leaderboard.',
  keywords: ['duolingo', 'german', 'language learning', 'clone'],
  openGraph: {
    title: 'Duolingo Clone — Learn German',
    description: 'Gamified language learning — German course with XP, streaks, and hearts.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <GameProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1f3240',
                color: '#ffffff',
                border: '1px solid #2d4a5e',
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 700,
                borderRadius: '0.75rem',
              },
              success: {
                iconTheme: { primary: '#58cc02', secondary: '#ffffff' },
                duration: 2000,
              },
              error: {
                iconTheme: { primary: '#ff4b4b', secondary: '#ffffff' },
                duration: 3000,
              },
            }}
          />
        </GameProvider>
      </body>
    </html>
  );
}
