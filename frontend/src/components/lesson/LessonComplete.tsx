'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface LessonCompleteProps {
  xpEarned: number;
  mistakes: number;
  streak: number;
  onContinue: () => void;
}

// Confetti component
function Confetti() {
  const colors = ['#58cc02', '#ffc800', '#ff9600', '#1cb0f6', '#ce82ff', '#ff4b4b'];
  const pieces = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 1.5,
  }));

  return (
    <>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </>
  );
}

export default function LessonComplete({ xpEarned, mistakes, streak, onContinue }: LessonCompleteProps) {
  const accuracy = mistakes === 0 ? 100 : Math.max(0, Math.round((1 - mistakes / 10) * 100));

  const stats = [
    { icon: '⚡', label: 'XP Earned',  value: `+${xpEarned}`, color: 'var(--color-duo-yellow)' },
    { icon: '✅', label: 'Accuracy',   value: `${accuracy}%`, color: 'var(--color-duo-green)' },
    { icon: '🔥', label: 'Streak',     value: `${streak} days`, color: 'var(--color-duo-orange)' },
    { icon: '💔', label: 'Mistakes',   value: mistakes,       color: mistakes === 0 ? 'var(--color-duo-green)' : 'var(--color-duo-red)' },
  ];

  return (
    <div className="modal-overlay">
      <Confetti />
      <motion.div
        className="modal-content"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        style={{ maxWidth: '28rem' }}
      >
        {/* Mascot */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '5rem', marginBottom: '0.5rem' }}
        >
          🦉
        </motion.div>

        <h2 style={{ fontWeight: 900, fontSize: '2rem', marginBottom: '0.25rem', color: 'var(--color-duo-green)' }}>
          Lesson Complete!
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.75rem', fontSize: '1rem' }}>
          {mistakes === 0 ? '🎯 Perfect score!' : 'Great work! Keep practicing!'}
        </p>

        {/* Stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            marginBottom: '1.75rem',
          }}
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: 'var(--color-bg-elevated)',
                borderRadius: '0.875rem',
                padding: '0.875rem',
                textAlign: 'center',
                border: `1px solid var(--color-bg-border)`,
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
              <div style={{ fontWeight: 900, fontSize: '1.25rem', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        <button
          className="btn-duo-green"
          style={{ width: '100%', textAlign: 'center' }}
          onClick={onContinue}
        >
          CONTINUE
        </button>
      </motion.div>
    </div>
  );
}
