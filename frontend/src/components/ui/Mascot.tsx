'use client';

import { motion } from 'framer-motion';

interface MascotProps {
  state?: 'idle' | 'happy' | 'sad' | 'celebrating';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Mascot({ state = 'idle', size = 'md' }: MascotProps) {
  const sizeMap = {
    sm: '2rem',
    md: '3.5rem',
    lg: '5rem',
    xl: '7rem',
  };

  const emojiMap = {
    idle: '🦉',
    happy: '🦉✨',
    sad: '🦉💔',
    celebrating: '🦉🎉',
  };

  const animations = {
    idle: {
      y: [0, -6, 0],
      rotate: [0, 2, -2, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
    },
    happy: {
      scale: [1, 1.2, 1],
      y: [0, -12, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' as const },
    },
    sad: {
      rotate: [-5, 5, -5],
      transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    celebrating: {
      scale: [1, 1.25, 1],
      rotate: [0, 15, -15, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  return (
    <motion.div
      animate={animations[state]}
      style={{
        fontSize: sizeMap[size],
        lineHeight: 1,
        display: 'inline-block',
        userSelect: 'none',
        filter: 'drop-shadow(0 4px 12px rgba(88, 204, 2, 0.3))',
      }}
    >
      {emojiMap[state]}
    </motion.div>
  );
}
