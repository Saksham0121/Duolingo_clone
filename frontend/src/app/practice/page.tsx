'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import AppShell from '@/components/layout/AppShell';
import MultipleChoice from '@/components/exercises/MultipleChoice';
import WordBank from '@/components/exercises/WordBank';
import FillInBlank from '@/components/exercises/FillInBlank';
import TypeAnswer from '@/components/exercises/TypeAnswer';
import { useGame } from '@/context/GameContext';
import { completeLesson } from '@/lib/api';
import type { Exercise } from '@/types';

// Seeded exercise pool for timed practice
const PRACTICE_EXERCISES: Exercise[] = [
  {
    id: 101,
    type: 'multiple_choice',
    prompt: 'How do you say "Hello" in German?',
    correct_answer: 'Hallo',
    options: ['Hallo', 'Guten Tag', 'Tschüss', 'Danke'],
    order_index: 1,
  },
  {
    id: 102,
    type: 'word_bank',
    prompt: 'Translate: "Good morning!"',
    correct_answer: 'Guten Morgen',
    word_bank: ['Guten', 'Morgen', 'Abend', 'Nacht', 'Hallo'],
    order_index: 2,
  },
  {
    id: 103,
    type: 'fill_blank',
    prompt: 'Ich heiße ___. (Alex)',
    correct_answer: 'Alex',
    order_index: 3,
  },
  {
    id: 104,
    type: 'type_answer',
    prompt: 'How do you say "Thank you very much" in German?',
    correct_answer: 'Vielen Dank',
    order_index: 4,
  },
  {
    id: 105,
    type: 'multiple_choice',
    prompt: 'What does "Tschüss" mean?',
    correct_answer: 'Bye',
    options: ['Bye', 'Hello', 'Please', 'Yes'],
    order_index: 5,
  },
];

export default function PracticePage() {
  const router = useRouter();
  const { state, addXp } = useGame();

  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [timeLeft, setTimeLeft] = useState<number>(60); // 60-second timed mode
  const [exerciseIdx, setExerciseIdx] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [totalXpEarned, setTotalXpEarned] = useState<number>(0);

  // Exercise input states
  const [mcSelected, setMcSelected] = useState<string | null>(null);
  const [wbSelected, setWbSelected] = useState<string[]>([]);
  const [fibValue, setFibValue] = useState<string>('');
  const [taValue, setTaValue] = useState<string>('');

  // Feedback state
  const [feedback, setFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    solution: string;
  }>({ show: false, isCorrect: false, solution: '' });

  const currentExercise = PRACTICE_EXERCISES[exerciseIdx % PRACTICE_EXERCISES.length];

  const finishPractice = useCallback(async () => {
    setGameState('completed');
    const finalXp = totalXpEarned + 20; // completion bonus
    addXp(finalXp);
    try {
      await completeLesson({
        user_id: state.userId,
        lesson_id: 1,
        xp_earned: finalXp,
      });
    } catch (e) {
      console.error('Failed to register practice XP:', e);
    }
  }, [totalXpEarned, addXp, state.userId]);

  // Timer loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      finishPractice();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft, finishPractice]);

  const startPractice = () => {
    setGameState('playing');
    setTimeLeft(60);
    setExerciseIdx(0);
    setCorrectCount(0);
    setComboStreak(0);
    setTotalXpEarned(0);
    resetAnswerState();
  };

  const resetAnswerState = () => {
    setMcSelected(null);
    setWbSelected([]);
    setFibValue('');
    setTaValue('');
    setFeedback({ show: false, isCorrect: false, solution: '' });
  };

  const handleCheck = () => {
    let isCorrect = false;
    let answerString = '';

    switch (currentExercise.type) {
      case 'multiple_choice':
        answerString = mcSelected ?? '';
        isCorrect = answerString.trim().toLowerCase() === currentExercise.correct_answer.trim().toLowerCase();
        break;
      case 'word_bank':
        answerString = wbSelected.join(' ');
        isCorrect = answerString.trim().toLowerCase() === currentExercise.correct_answer.trim().toLowerCase();
        break;
      case 'fill_blank':
        answerString = fibValue;
        isCorrect = answerString.trim().toLowerCase() === currentExercise.correct_answer.trim().toLowerCase();
        break;
      case 'type_answer':
        answerString = taValue;
        isCorrect = answerString.trim().toLowerCase() === currentExercise.correct_answer.trim().toLowerCase();
        break;
    }

    if (isCorrect) {
      const newStreak = comboStreak + 1;
      setComboStreak(newStreak);
      setCorrectCount((prev) => prev + 1);
      const earnedXp = 10 + Math.min(newStreak * 2, 10);
      setTotalXpEarned((prev) => prev + earnedXp);
      setFeedback({ show: true, isCorrect: true, solution: '' });
    } else {
      setComboStreak(0);
      setFeedback({
        show: true,
        isCorrect: false,
        solution: currentExercise.correct_answer,
      });
    }
  };

  const handleContinue = () => {
    resetAnswerState();
    setExerciseIdx((prev) => prev + 1);
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '42rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* INTRO SCREEN */}
        {gameState === 'intro' && (
          <div
            className="duo-card"
            style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <span style={{ fontSize: '4.5rem' }}>⏱️</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>
              60-Second Timed Practice
            </h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem', maxWidth: '28rem', lineHeight: 1.5 }}>
              Answer as many rapid-fire questions as you can in 60 seconds to build combo multipliers and earn bonus XP!
            </p>

            <button
              onClick={startPractice}
              className="btn-duo-green"
              style={{ fontSize: '1.125rem', padding: '0.875rem 2.5rem', marginTop: '1rem' }}
            >
              START TIMED PRACTICE
            </button>
          </div>
        )}

        {/* PLAYING ARENA */}
        {gameState === 'playing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Bar with Countdown Timer */}
            <div className="duo-card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⏱️</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontWeight: 800, fontSize: '0.875rem' }}>
                  <span>TIME REMAINING</span>
                  <span style={{ color: timeLeft <= 10 ? 'var(--color-duo-red)' : 'var(--color-duo-orange)' }}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="progress-bar" style={{ height: '0.75rem' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${(timeLeft / 60) * 100}%`,
                      backgroundColor: timeLeft <= 10 ? 'var(--color-duo-red)' : 'var(--color-duo-orange)',
                    }}
                  />
                </div>
              </div>

              {/* Combo Multiplier Badge */}
              {comboStreak > 1 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    backgroundColor: 'var(--color-duo-yellow)',
                    color: '#5a3e00',
                    fontWeight: 900,
                    fontSize: '0.875rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                  }}
                >
                  🔥 {comboStreak}x Combo!
                </motion.div>
              )}
            </div>

            {/* Exercise Card */}
            <div className="duo-card" style={{ padding: '2rem' }}>
              {currentExercise.type === 'multiple_choice' && (
                <MultipleChoice
                  prompt={currentExercise.prompt}
                  options={currentExercise.options ?? []}
                  selectedOption={mcSelected}
                  onSelect={setMcSelected}
                  disabled={feedback.show}
                />
              )}
              {currentExercise.type === 'word_bank' && (
                <WordBank
                  prompt={currentExercise.prompt}
                  wordBank={currentExercise.word_bank ?? []}
                  selectedWords={wbSelected}
                  onSelectWord={(word) => setWbSelected((prev) => [...prev, word])}
                  onRemoveWord={(index) => setWbSelected((prev) => prev.filter((_, i) => i !== index))}
                  disabled={feedback.show}
                />
              )}
              {currentExercise.type === 'fill_blank' && (
                <FillInBlank
                  prompt={currentExercise.prompt}
                  value={fibValue}
                  onChange={setFibValue}
                  disabled={feedback.show}
                />
              )}
              {currentExercise.type === 'type_answer' && (
                <TypeAnswer
                  prompt={currentExercise.prompt}
                  value={taValue}
                  onChange={setTaValue}
                  disabled={feedback.show}
                />
              )}
            </div>

            {/* Submit / Check Button */}
            {!feedback.show && (
              <button
                className="btn-duo-green"
                onClick={handleCheck}
                style={{ alignSelf: 'center', minWidth: '12rem', fontSize: '1.125rem' }}
              >
                CHECK
              </button>
            )}

            {/* Feedback footer */}
            {feedback.show && (
              <div
                style={{
                  backgroundColor: feedback.isCorrect ? 'rgba(88, 204, 2, 0.15)' : 'rgba(255, 75, 75, 0.15)',
                  border: `2px solid ${feedback.isCorrect ? 'var(--color-duo-green)' : 'var(--color-duo-red)'}`,
                  borderRadius: '1rem',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h3 style={{ fontWeight: 900, color: feedback.isCorrect ? 'var(--color-duo-green)' : 'var(--color-duo-red)' }}>
                    {feedback.isCorrect ? 'Awesome!' : 'Correct Solution:'}
                  </h3>
                  {!feedback.isCorrect && (
                    <p style={{ color: 'var(--color-text-primary)', fontWeight: 700, marginTop: '0.25rem' }}>
                      {feedback.solution}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleContinue}
                  className={feedback.isCorrect ? 'btn-duo-green' : 'btn-duo-red'}
                  style={{ padding: '0.6rem 1.5rem', fontSize: '1rem' }}
                >
                  CONTINUE
                </button>
              </div>
            )}
          </div>
        )}

        {/* END SUMMARY SCREEN */}
        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="duo-card"
            style={{
              textAlign: 'center',
              padding: '3rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            <span style={{ fontSize: '4.5rem' }}>🎉</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>
              Practice Complete!
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', maxWidth: '24rem' }}>
              <div className="duo-card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '2rem' }}>⚡</span>
                <p style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--color-duo-yellow)' }}>
                  +{totalXpEarned + 20} XP
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Total XP Earned</p>
              </div>

              <div className="duo-card" style={{ padding: '1.25rem' }}>
                <span style={{ fontSize: '2rem' }}>🎯</span>
                <p style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--color-duo-green)' }}>
                  {correctCount}
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Correct Answers</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/learn')}
              className="btn-duo-green"
              style={{ fontSize: '1.125rem', padding: '0.875rem 2.5rem', marginTop: '1rem' }}
            >
              CONTINUE TO LEARN
            </button>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
