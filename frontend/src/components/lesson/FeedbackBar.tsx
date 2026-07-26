'use client';

import { motion } from 'framer-motion';

interface FeedbackBarProps {
  result: 'correct' | 'wrong';
  correctAnswer?: string;
  onContinue: () => void;
}

export default function FeedbackBar({ result, correctAnswer, onContinue }: FeedbackBarProps) {
  const isCorrect = result === 'correct';

  return (
    <motion.div
      className={`feedback-bar ${result}`}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div>
        {isCorrect ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ fontSize: '1.75rem' }}>🎉</span>
            <div>
              <p style={{ fontWeight: 900, fontSize: '1.125rem', color: 'var(--color-correct-text)' }}>
                Excellent!
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-correct-text)', opacity: 0.8 }}>
                Keep it up!
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ fontSize: '1.75rem' }}>💔</span>
            <div>
              <p style={{ fontWeight: 900, fontSize: '1.0625rem', color: 'var(--color-wrong-text)' }}>
                Correct answer:
              </p>
              <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-wrong-text)' }}>
                {correctAnswer}
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onContinue}
        style={{
          backgroundColor: isCorrect ? 'var(--color-duo-green)' : 'var(--color-duo-red)',
          borderBottom: `4px solid ${isCorrect ? 'var(--color-duo-green-dark)' : 'var(--color-duo-red-dark)'}`,
          color: 'white',
          fontWeight: 900,
          fontSize: '1rem',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          border: 'none',
          borderRadius: '0.875rem',
          padding: '0.875rem 2rem',
          cursor: 'pointer',
          fontFamily: "'Nunito', sans-serif",
          transition: 'filter 0.15s',
          flexShrink: 0,
        }}
      >
        CONTINUE
      </button>
    </motion.div>
  );
}
