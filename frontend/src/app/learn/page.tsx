'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import AppShell from '@/components/layout/AppShell';
import SkillNode from '@/components/skillTree/SkillNode';
import UnitHeader from '@/components/skillTree/UnitHeader';
import RightPanel from '@/components/skillTree/RightPanel';

import { BBQChefMascot, WateringGardenerMascot, CampfireMascot, GuitaristMascot, TreasureChestNode } from '@/components/ui/PathMascots';
import { useGame } from '@/context/GameContext';
import { getCourseWithUnits } from '@/lib/api';
import type { CourseWithUnits, SkillWithProgress, Lesson } from '@/types';

// ── Smooth S-wave positions for continuous winding path ─────────────────────
const S_CURVE_OFFSETS = [0, 65, 120, 65, 0, -65, -120, -65];

// ── Lesson picker popup ────────────────────────────────────────────────────
function LessonPicker({
  skill,
  unitColor,
  onClose,
  onSelect,
}: {
  skill: SkillWithProgress;
  unitColor: string;
  onClose: () => void;
  onSelect: (lesson: Lesson) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 10 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <motion.div
        style={{
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-bg-border)',
          borderRadius: '1.25rem',
          padding: '1.5rem',
          width: '100%',
          maxWidth: '22rem',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '3rem', height: '3rem', borderRadius: '9999px',
              backgroundColor: unitColor, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', flexShrink: 0,
            }}
          >
            {skill.icon_emoji}
          </div>
          <div>
            <p style={{ fontWeight: 900, fontSize: '1.0625rem' }}>{skill.title}</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              {skill.completed_lessons}/{skill.total_lessons} lessons · {skill.xp_earned} XP earned
            </p>
          </div>
        </div>

        {/* Lesson list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {skill.lessons.map((lesson, i) => {
            const isDone = i < skill.completed_lessons;
            const isAvail = i === skill.completed_lessons;
            return (
              <button
                key={lesson.id}
                onClick={() => isDone || isAvail ? onSelect(lesson) : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  background: isDone
                    ? 'rgba(88,204,2,0.1)'
                    : isAvail
                    ? `${unitColor}22`
                    : 'var(--color-bg-elevated)',
                  border: `2px solid ${isDone ? 'var(--color-duo-green)' : isAvail ? unitColor : 'var(--color-bg-border)'}`,
                  cursor: isDone || isAvail ? 'pointer' : 'not-allowed',
                  opacity: !isDone && !isAvail ? 0.5 : 1,
                  fontFamily: "'Nunito', sans-serif",
                  width: '100%',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>
                  {isDone ? '✅' : isAvail ? '▶️' : '🔒'}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
                    {lesson.title}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    Lesson {lesson.order_index}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Start button */}
        {skill.lessons.length > 0 && (
          <button
            className="btn-duo-green"
            style={{ width: '100%', textAlign: 'center' }}
            onClick={() => {
              const nextLesson = skill.lessons[skill.completed_lessons] ?? skill.lessons[skill.lessons.length - 1];
              onSelect(nextLesson);
            }}
          >
            {skill.completed ? 'PRACTICE AGAIN' : 'START LESSON'}
          </button>
        )}

        {/* Legendary Challenge Option for Completed Skills */}
        {skill.completed && (
          <button
            style={{
              width: '100%',
              textAlign: 'center',
              marginTop: '0.75rem',
              background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
              color: 'white',
              border: 'none',
              borderRadius: '0.875rem',
              padding: '0.75rem 1rem',
              fontWeight: 900,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontFamily: "'Nunito', sans-serif",
            }}
            onClick={() => {
              const firstLesson = skill.lessons[0];
              if (firstLesson) onSelect(firstLesson);
            }}
          >
            <span>👑</span> LEGENDARY CHALLENGE (+50 XP)
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Mascot between units ───────────────────────────────────────────────────
function UnitMascot({ color }: { color: string }) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '1.5rem 0',
        color: 'var(--color-text-secondary)',
        fontSize: '0.875rem',
        fontWeight: 700,
      }}
    >
      <span style={{ fontSize: '3.5rem', filter: `drop-shadow(0 4px 12px ${color}66)` }}>⭐</span>
    </motion.div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function LearnPage() {
  const router = useRouter();
  const [course, setCourse] = useState<CourseWithUnits | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<{ skill: SkillWithProgress; color: string } | null>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setScaleFactor(0.3);
      } else if (w < 768) {
        setScaleFactor(0.55);
      } else {
        setScaleFactor(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { reload: reloadUserGame } = useGame();

  const load = useCallback(async () => {
    try {
      const data = await getCourseWithUnits(1, 1);
      setCourse(data);
    } catch (e) {
      console.error('Failed to load course:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    reloadUserGame();
  }, [load, reloadUserGame]);

  // Find the first non-completed, non-locked skill (the "next" skill)
  const findNextSkillId = () => {
    if (!course) return -1;
    for (const unit of course.units) {
      for (const skill of unit.skills) {
        if (!skill.is_locked && !skill.completed) return skill.id;
      }
    }
    return -1;
  };
  const nextSkillId = findNextSkillId();

  if (loading) {
    return (
      <AppShell rightPanel={<RightPanel />}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ width: '2.5rem', height: '2.5rem', border: '4px solid var(--color-bg-elevated)', borderTop: '4px solid var(--color-duo-green)', borderRadius: '9999px' }}
          />
        </div>
      </AppShell>
    );
  }

  if (!course) {
    return (
      <AppShell rightPanel={<RightPanel />}>
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>Could not load course.</p>
          <p>Make sure the backend is running at <code>http://localhost:8000</code></p>
        </div>
      </AppShell>
    );
  }

  // Cumulative index across all units so the winding curve continues seamlessly
  let globalSkillCounter = 0;

  return (
    <AppShell rightPanel={<RightPanel />}>
      {/* Units and skill path */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem' }}>
        {course.units.map((unit, unitIdx) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: unitIdx * 0.15, duration: 0.4 }}
            style={{ position: 'relative' }}
          >
            {/* Sticky Unit Header — stays fixed at top of window while scrolling within the unit */}
            <div style={{ position: 'sticky', top: '1rem', zIndex: 25, marginBottom: '1.5rem' }}>
              <UnitHeader unit={unit} />
            </div>

            {/* Skill nodes in continuous S-curve */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.75rem',
                paddingInline: '1rem',
              }}
            >
              {unit.skills.map((skill, skillInUnitIdx) => {
                const currentSkillIdx = globalSkillCounter++;

                // Structured per-unit symmetric zigzag math (Unit 1 curves Right, Unit 2 curves Left, Unit 3 curves Right)
                const unitDirection = unitIdx % 2 === 0 ? 1 : -1;
                const unitOffsets = [0, 75, 135];
                const rawOffset = unitOffsets[skillInUnitIdx % unitOffsets.length] * unitDirection;
                const xOffset = Math.round(rawOffset * scaleFactor);
                const isNext = skill.id === nextSkillId;

                // Render EXACTLY 1 living character mascot per unit inside the curve void!
                const isUnitMascotSlot = skillInUnitIdx === 1;

                return (
                  <div
                    key={skill.id}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    {/* Exactly 1 mascot per unit placed on the opposite side of tree expansion, vertically centered */}
                    {isUnitMascotSlot && scaleFactor >= 0.75 && (
                      <div
                        style={{
                          position: 'absolute',
                          left: unitIdx % 2 === 0 ? 'calc(50% - 220px)' : undefined,
                          right: unitIdx % 2 === 1 ? 'calc(50% - 220px)' : undefined,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          zIndex: 2,
                        }}
                      >
                        {unitIdx === 0 && <BBQChefMascot size={120} />}
                        {unitIdx === 1 && <WateringGardenerMascot size={120} />}
                        {unitIdx === 2 && <CampfireMascot size={115} />}
                        {unitIdx >= 3 && <GuitaristMascot size={115} />}
                      </div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, x: 0 }}
                      animate={{ opacity: 1, scale: 1, x: xOffset }}
                      transition={{ delay: unitIdx * 0.1 + (currentSkillIdx % 3) * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
                    >
                      <SkillNode
                        skill={skill}
                        unitColor={unit.color_hex}
                        isNext={isNext}
                        onClick={() => setSelectedSkill({ skill, color: unit.color_hex })}
                      />
                    </motion.div>
                  </div>
                );
              })}

              {/* Milestone Golden Treasure Chest Node */}
              <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                <TreasureChestNode size={72} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lesson picker modal */}
      <AnimatePresence>
        {selectedSkill && (
          <LessonPicker
            skill={selectedSkill.skill}
            unitColor={selectedSkill.color}
            onClose={() => setSelectedSkill(null)}
            onSelect={(lesson) => {
              setSelectedSkill(null);
              router.push(`/lesson/${lesson.id}`);
            }}
          />
        )}
      </AnimatePresence>
    </AppShell>
  );
}
