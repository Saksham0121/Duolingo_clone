'use client';

import { motion } from 'framer-motion';
import type { SkillWithProgress } from '@/types';

interface SkillNodeProps {
  skill: SkillWithProgress;
  unitColor: string;
  onClick: () => void;
  isNext: boolean; // the very next skill to unlock — gets the bouncing arrow
}

function CrownIndicator({ crowns }: { crowns: number }) {
  if (crowns === 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: '-0.25rem',
        right: '-0.25rem',
        backgroundColor: 'var(--color-duo-yellow)',
        borderRadius: '9999px',
        width: '1.625rem',
        height: '1.625rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8125rem',
        fontWeight: 900,
        border: '2.5px solid var(--color-bg-primary)',
        color: '#5a3e00',
        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
        zIndex: 5,
      }}
    >
      {crowns === 5 ? '👑' : crowns}
    </div>
  );
}

function ProgressRing({ progress, total, color }: { progress: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min(progress / total, 1) : 0;
  const r = 35;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <svg
      width="84"
      height="84"
      style={{ position: 'absolute', top: -6, left: -6, pointerEvents: 'none', zIndex: 4 }}
    >
      {/* Track */}
      <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
      {/* Fill */}
      <circle
        cx="42" cy="42" r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 42 42)"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  );
}

export default function SkillNode({ skill, unitColor, onClick, isNext }: SkillNodeProps) {
  const isLocked    = skill.is_locked;
  const isCompleted = skill.completed;
  const isActive    = !isLocked && !isCompleted;

  // Determine icon based on skill title / type
  const getIcon = () => {
    if (isCompleted) return '✓';
    if (isLocked) return '🔒';
    const lower = skill.title.toLowerCase();
    if (lower.includes('read') || lower.includes('book') || lower.includes('phrases')) return '📖';
    if (lower.includes('listen') || lower.includes('audio') || lower.includes('numbers')) return '🎧';
    return skill.icon_emoji || '⭐';
  };

  // Color shades for 3D sphere gradient and bevel shadow
  let baseColor = unitColor;
  let shadowColor = '#2b5a00'; // dark green default

  if (unitColor.toLowerCase().includes('1cb0f6') || unitColor.toLowerCase().includes('blue')) {
    baseColor = '#1cb0f6';
    shadowColor = '#0d8fd4';
  } else if (unitColor.toLowerCase().includes('ce82ff') || unitColor.toLowerCase().includes('purple')) {
    baseColor = '#ce82ff';
    shadowColor = '#a560e8';
  } else if (unitColor.toLowerCase().includes('ff9600') || unitColor.toLowerCase().includes('orange')) {
    baseColor = '#ff9600';
    shadowColor = '#e07b00';
  } else if (unitColor.toLowerCase().includes('58cc02') || unitColor.toLowerCase().includes('green')) {
    baseColor = '#58cc02';
    shadowColor = '#46a302';
  }

  if (isLocked) {
    baseColor = '#2d4a5e';
    shadowColor = '#1f3240';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.625rem', userSelect: 'none' }}>
      {/* Bouncing "START" arrow for the next available skill */}
      {isNext && (
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            backgroundColor: baseColor,
            color: 'white',
            fontWeight: 900,
            fontSize: '0.8125rem',
            padding: '0.3rem 0.875rem',
            borderRadius: '9999px',
            letterSpacing: '0.06em',
            boxShadow: `0 4px 16px ${baseColor}66`,
            border: '2px solid rgba(255,255,255,0.3)',
            zIndex: 10,
          }}
        >
          START ▼
        </motion.div>
      )}

      {/* Glossy 3D Sphere Button */}
      <motion.button
        whileHover={!isLocked ? { scale: 1.08, y: -2 } : {}}
        whileTap={!isLocked ? { scale: 0.96, y: 4 } : {}}
        onClick={isLocked ? undefined : onClick}
        style={{
          width: '4.5rem',
          height: '4.5rem',
          borderRadius: '9999px',
          background: isLocked
            ? 'linear-gradient(180deg, #3a586e 0%, #253a4a 100%)'
            : `linear-gradient(180deg, ${baseColor} 0%, ${shadowColor} 100%)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: isLocked ? 'not-allowed' : 'pointer',
          boxShadow: isLocked
            ? 'inset 0 2px 3px rgba(255,255,255,0.2), 0 6px 0 #192833, 0 8px 16px rgba(0,0,0,0.4)'
            : `inset 0 3px 4px rgba(255,255,255,0.45), inset 0 -4px 6px rgba(0,0,0,0.25), 0 8px 0 ${shadowColor}, 0 12px 24px rgba(0,0,0,0.4)`,
          opacity: isLocked ? 0.7 : 1,
          transition: 'box-shadow 0.15s ease, opacity 0.15s ease',
        }}
        aria-label={`${skill.title}${isLocked ? ' (locked)' : ''}`}
      >
        {/* Top Glossy Highlight (Crescent Glass Reflection) */}
        <div
          style={{
            position: 'absolute',
            top: '3px',
            left: '6px',
            right: '6px',
            height: '1.75rem',
            borderRadius: '9999px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Progress ring for active skill */}
        {isActive && (
          <ProgressRing
            progress={skill.completed_lessons}
            total={skill.total_lessons}
            color="#ffffff"
          />
        )}

        {/* Icon Inside Node */}
        <span
          style={{
            fontSize: '1.875rem',
            color: '#ffffff',
            fontWeight: 900,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            zIndex: 3,
            lineHeight: 1,
          }}
        >
          {getIcon()}
        </span>

        {/* Crown badge */}
        <CrownIndicator crowns={skill.crowns} />
      </motion.button>

      {/* Skill title label */}
      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: 800,
          color: isLocked ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
          letterSpacing: '0.02em',
          maxWidth: '5.5rem',
          textAlign: 'center',
          lineHeight: 1.25,
        }}
      >
        {skill.title}
      </span>
    </div>
  );
}
