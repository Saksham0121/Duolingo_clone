'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import LessonHeader from '@/components/lesson/LessonHeader';
import FeedbackBar from '@/components/lesson/FeedbackBar';
import LessonComplete from '@/components/lesson/LessonComplete';
import OutOfHearts from '@/components/lesson/OutOfHearts';
import ExerciseRenderer from '@/components/exercises/ExerciseRenderer';

import { toast } from 'react-hot-toast';
import { useGame } from '@/context/GameContext';
import { getLessonExercises, completeLesson, reportWrongAnswer, refillHearts as apiRefillHearts } from '@/lib/api';
import type { LessonWithExercises, Exercise } from '@/types';

// Extend Exercise with optional retry flag
interface QueueExercise extends Exercise {
  isRetry?: boolean;
}

// Helper to normalize strings for comparison with German Umlaut tolerance (u->ü, a->ä, o->ö, ss->ß)
function normalize(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/ä|ae/g, "a")
    .replace(/ö|oe/g, "o")
    .replace(/ü|ue/g, "u")
    .replace(/ß/g, "ss")
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "")
    .replace(/\s+/g, " ");
}

// Helper to generate a helpful hint for re-queued exercises
function getExerciseHint(exercise: QueueExercise): string {
  const ans = exercise.correct_answer.trim();
  const firstWord = ans.split(' ')[0];

  switch (exercise.type) {
    case 'multiple_choice':
      return `💡 Hint: The correct option starts with "${ans.slice(0, 4)}..."`;
    case 'word_bank':
      return `💡 Hint: First word in the translation is "${firstWord}"`;
    case 'fill_blank':
      return `💡 Hint: Missing word starts with "${ans.slice(0, 2)}..."`;
    case 'type_answer':
      return `💡 Hint: Answer is ${ans.length} letters long and starts with "${ans.slice(0, 2)}..."`;
    case 'match_pairs':
      return `💡 Hint: Pay close attention to vocabulary pair matches`;
    default:
      return `💡 Hint: Starts with "${ans.slice(0, 3)}..."`;
  }
}

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const resolvedParams = use(params);
  const lessonId = parseInt(resolvedParams.lessonId, 10);
  const router = useRouter();
  const { state, loseHeart, setHearts, addXp, reload } = useGame();

  const [lessonData, setLessonData] = useState<LessonWithExercises | null>(null);
  const [loading, setLoading] = useState(true);

  // Lesson queue & progress state
  const [exerciseQueue, setExerciseQueue] = useState<QueueExercise[]>([]);
  const [initialTotalCount, setInitialTotalCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);

  // Per-exercise user input state
  const [mcSelected, setMcSelected] = useState<string | null>(null);
  const [wbSelected, setWbSelected] = useState<string[]>([]);
  const [fibValue, setFibValue] = useState('');
  const [taValue, setTaValue] = useState('');
  const [matchPairsDone, setMatchPairsDone] = useState(false);

  // Status state
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isOutOfHearts, setIsOutOfHearts] = useState(false);
  const [earnedXp, setEarnedXp] = useState(10);

  const fetchLesson = useCallback(async () => {
    try {
      const data = await getLessonExercises(lessonId);
      setLessonData(data);
      setExerciseQueue(data.exercises);
      setInitialTotalCount(data.exercises.length);
    } catch (err) {
      console.error('Failed to fetch lesson:', err);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-primary)' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{ width: '3rem', height: '3rem', border: '4px solid var(--color-bg-elevated)', borderTop: '4px solid var(--color-duo-green)', borderRadius: '9999px' }}
        />
      </div>
    );
  }

  if (!lessonData || !exerciseQueue.length) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', backgroundColor: 'var(--color-bg-primary)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Lesson not found</h2>
        <button className="btn-duo-green" onClick={() => router.push('/learn')}>
          BACK TO LEARN
        </button>
      </div>
    );
  }

  const currentEx = exerciseQueue[currentIndex];

  // Check if answer is provided and user can click CHECK
  const hasAnswer = () => {
    if (!currentEx) return false;
    switch (currentEx.type) {
      case 'multiple_choice': return mcSelected !== null;
      case 'word_bank': return wbSelected.length > 0;
      case 'fill_blank': return fibValue.trim().length > 0;
      case 'type_answer': return taValue.trim().length > 0;
      case 'match_pairs': return matchPairsDone;
      default: return false;
    }
  };

  const handleCheck = async () => {
    if (!currentEx || feedback) return;

    let isCorrect = false;

    switch (currentEx.type) {
      case 'multiple_choice':
        isCorrect = normalize(mcSelected || '') === normalize(currentEx.correct_answer);
        break;
      case 'word_bank':
        isCorrect = normalize(wbSelected.join(' ')) === normalize(currentEx.correct_answer);
        break;
      case 'fill_blank':
        isCorrect = normalize(fibValue) === normalize(currentEx.correct_answer);
        break;
      case 'type_answer':
        isCorrect = normalize(taValue) === normalize(currentEx.correct_answer);
        break;
      case 'match_pairs':
        isCorrect = matchPairsDone;
        break;
    }

    if (isCorrect) {
      setFeedback('correct');
      setCompletedCount((prev) => prev + 1);
    } else {
      setFeedback('wrong');
      setMistakesCount((prev) => prev + 1);

      // Re-queue the failed exercise at the end of the lesson queue!
      setExerciseQueue((prevQueue) => [
        ...prevQueue,
        { ...currentEx, isRetry: true },
      ]);

      // Deduct heart via context & API
      loseHeart();
      try {
        const res = await reportWrongAnswer(state.userId);
        if (res.data.hearts_remaining <= 0) {
          setIsOutOfHearts(true);
        }
      } catch (e) {
        console.error('Failed to report wrong answer:', e);
      }
    }
  };

  const handleContinue = async () => {
    // Reset exercise input state
    setFeedback(null);
    setMcSelected(null);
    setWbSelected([]);
    setFibValue('');
    setTaValue('');
    setMatchPairsDone(false);

    if (currentIndex + 1 < exerciseQueue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // All exercises in queue completed!
      try {
        const xp = mistakesCount === 0 ? 15 : 10;
        setEarnedXp(xp);
        const res = await completeLesson({
          user_id: state.userId,
          lesson_id: lessonId,
          xp_earned: 10,
          mistakes: mistakesCount,
        });
        const finalXp = res.data?.xp_earned ?? xp;
        addXp(finalXp);
        toast.success(`+${finalXp} XP Earned! ⚡`);
        reload();
        setIsCompleted(true);
      } catch (e) {
        console.error('Failed to mark lesson complete:', e);
        const xp = mistakesCount === 0 ? 15 : 10;
        addXp(xp);
        toast.success(`+${xp} XP Earned! ⚡`);
        reload();
        setIsCompleted(true);
      }
    }
  };

  const handleRefillHearts = async () => {
    try {
      await apiRefillHearts(state.userId);
      setHearts(state.maxHearts);
      setIsOutOfHearts(false);
    } catch (e) {
      console.error('Failed to refill hearts:', e);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <LessonHeader
        current={completedCount}
        total={initialTotalCount}
        onExit={() => router.push('/learn')}
      />

      {/* Exercise Content */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem 8rem',
          maxWidth: '48rem',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Re-queued Question Hint Banner */}
        {currentEx?.isRetry && !feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: 'rgba(255, 200, 0, 0.15)',
              border: '2px solid var(--color-duo-yellow)',
              borderRadius: '0.875rem',
              padding: '0.75rem 1.25rem',
              marginBottom: '1.5rem',
              color: 'var(--color-duo-yellow)',
              fontWeight: 800,
              fontSize: '0.9375rem',
              width: '100%',
              maxWidth: '36rem',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(255, 200, 0, 0.1)',
            }}
          >
            {getExerciseHint(currentEx)}
          </motion.div>
        )}

        <ExerciseRenderer
          exercise={currentEx}
          mcSelected={mcSelected}
          setMcSelected={setMcSelected}
          wbSelected={wbSelected}
          setWbSelected={setWbSelected}
          fibValue={fibValue}
          setFibValue={setFibValue}
          taValue={taValue}
          setTaValue={setTaValue}
          onMatchPairsComplete={(matched) => setMatchPairsDone(matched)}
          disabled={feedback !== null}
        />
      </main>

      {/* Action Footer (Check Button) */}
      {!feedback && (
        <footer
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '1.25rem 2rem',
            backgroundColor: 'var(--color-bg-card)',
            borderTop: '1px solid var(--color-bg-border)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 20,
          }}
        >
          <button
            className="btn-duo-green"
            disabled={!hasAnswer()}
            onClick={handleCheck}
            style={{ padding: '0.875rem 3rem' }}
          >
            CHECK
          </button>
        </footer>
      )}

      {/* Feedback Bar on Check */}
      {feedback && (
        <FeedbackBar
          result={feedback}
          correctAnswer={currentEx.correct_answer}
          onContinue={handleContinue}
        />
      )}

      {/* Lesson Completion Modal */}
      {isCompleted && (
        <LessonComplete
          xpEarned={earnedXp}
          mistakes={mistakesCount}
          streak={state.streak}
          onContinue={() => router.push('/learn')}
        />
      )}

      {/* Out of Hearts Modal */}
      {isOutOfHearts && (
        <OutOfHearts
          onRefill={handleRefillHearts}
          onQuit={() => router.push('/learn')}
        />
      )}
    </div>
  );
}
