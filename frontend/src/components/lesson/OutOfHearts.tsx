'use client';

import { motion } from 'framer-motion';

interface OutOfHeartsProps {
  onRefill: () => void;
  onQuit: () => void;
}

export default function OutOfHearts({ onRefill, onQuit }: OutOfHeartsProps) {
  return (
    <div className="modal-overlay">
      <motion.div
        className="modal-content"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Broken heart mascot */}
        <motion.div
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '4rem', marginBottom: '1rem' }}
        >
          💔
        </motion.div>

        <h2 style={{ fontWeight: 900, fontSize: '1.75rem', marginBottom: '0.5rem', color: 'var(--color-duo-red)' }}>
          Out of Hearts!
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
          You've run out of hearts. Refill to keep learning or come back later!
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Hearts refill automatically over time — or use gems to refill now.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            className="btn-duo-green"
            style={{ width: '100%', textAlign: 'center' }}
            onClick={onRefill}
          >
            💎 REFILL HEARTS (350 gems)
          </button>
          <button
            onClick={onQuit}
            style={{
              background: 'none',
              border: '2px solid var(--color-bg-border)',
              color: 'var(--color-text-secondary)',
              fontWeight: 800,
              fontSize: '0.9375rem',
              padding: '0.875rem',
              borderRadius: '0.875rem',
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif",
              transition: 'border-color 0.15s',
            }}
          >
            QUIT LESSON
          </button>
        </div>
      </motion.div>
    </div>
  );
}
