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
        top: '-0.625rem',
        right: '-0.375rem',
        backgroundColor: 'var(--color-duo-yellow)',
        borderRadius: '9999px',
        width: '1.5rem',
        height: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: 900,
        border: '2px solid var(--color-bg-primary)',
        color: '#5a3e00',
      }}
    >
      {crowns === 5 ? '👑' : crowns}
    </div>
  );
}

function ProgressRing({ progress, total, color }: { progress: number; total: number; color: string }) {
  const pct = total > 0 ? Math.min(progress / total, 1) : 0;
  const r = 34;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <svg
      width="80"
      height="80"
      style={{ position: 'absolute', top: -4, left: -4, pointerEvents: 'none' }}
    >
      {/* Track */}
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
      {/* Fill */}
      <circle
        cx="40" cy="40" r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 40 40)"
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
    </svg>
  );
}

export default function SkillNode({ skill, unitColor, onClick, isNext }: SkillNodeProps) {
  const isLocked    = skill.is_locked;
  const isCompleted = skill.completed;
  const isActive    = !isLocked && !isCompleted;

  let bgColor   = unitColor;
  let nodeStyle: React.CSSProperties = {};

  if (isLocked) {
    bgColor = 'var(--color-bg-elevated)';
    nodeStyle = { opacity: 0.6 };
  } else if (isCompleted) {
    // slightly darker shade of the unit color
    nodeStyle = { filter: 'brightness(0.85)' };
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      {/* Bouncing "START" arrow for the next available skill */}
      {isNext && (
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            backgroundColor: unitColor,
            color: 'white',
            fontWeight: 900,
            fontSize: '0.8125rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            letterSpacing: '0.05em',
            boxShadow: `0 4px 16px ${unitColor}55`,
          }}
        >
          START ▼
        </motion.div>
      )}

      {/* Node button */}
      <motion.button
        whileHover={!isLocked ? { scale: 1.1 } : {}}
        whileTap={!isLocked ? { scale: 0.95 } : {}}
        onClick={isLocked ? undefined : onClick}
        className={`skill-node${isLocked ? ' locked' : ''}${isCompleted ? ' completed' : ''}${isActive ? ' active' : ''}`}
        style={{
          backgroundColor: bgColor,
          ...nodeStyle,
          position: 'relative',
          boxShadow: isActive
            ? `0 6px 0 ${unitColor}99, 0 8px 20px ${unitColor}44`
            : isCompleted
            ? `0 4px 0 ${unitColor}77`
            : '0 4px 0 var(--color-text-muted)',
        }}
        aria-label={`${skill.title}${isLocked ? ' (locked)' : ''}`}
      >
        {/* Progress ring for active skill */}
        {isActive && (
          <ProgressRing
            progress={skill.completed_lessons}
            total={skill.total_lessons}
            color="white"
          />
        )}

        {/* Icon */}
        {isCompleted ? (
          <span style={{ fontSize: '1.875rem' }}>✓</span>
        ) : isLocked ? (
          <span style={{ fontSize: '1.875rem' }}>🔒</span>
        ) : (
          <span style={{ fontSize: '1.875rem' }}>{skill.icon_emoji}</span>
        )}

        {/* Crown badge */}
        <CrownIndicator crowns={skill.crowns} />
      </motion.button>

      {/* Skill title tooltip on hover — shown as a small label */}
      <span
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: isLocked ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
          letterSpacing: '0.02em',
          maxWidth: '5rem',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {skill.title}
      </span>
    </div>
  );
}
