'use client';

import { useState, useEffect } from 'react';
import AudioButton from './AudioButton';

interface WordBankProps {
  prompt: string;
  wordBank: string[];
  selectedWords: string[];
  onSelectWord: (word: string, index: number) => void;
  onRemoveWord: (index: number) => void;
  disabled?: boolean;
}

export default function WordBank({
  prompt,
  wordBank,
  selectedWords,
  onSelectWord,
  onRemoveWord,
  disabled = false,
}: WordBankProps) {
  const [shuffledBank, setShuffledBank] = useState<string[]>([]);

  // Shuffle word bank on mount or whenever prompt/wordBank changes
  useEffect(() => {
    if (wordBank && wordBank.length > 0) {
      const arr = [...wordBank];
      // Simple Fisher-Yates shuffle
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      setShuffledBank(arr);
    }
  }, [prompt, wordBank]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', maxWidth: '36rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <AudioButton text={prompt} size="lg" />
        <h2 style={{ fontWeight: 800, fontSize: '1.375rem', color: 'var(--color-text-primary)' }}>
          {prompt}
        </h2>
      </div>

      {/* Answer Construction Area */}
      <div
        className="duo-card"
        style={{
          minHeight: '5rem',
          borderBottom: '3px solid var(--color-duo-blue)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.625rem',
          alignItems: 'center',
          padding: '1rem 1.25rem',
          backgroundColor: 'rgba(28, 176, 246, 0.05)',
        }}
      >
        {selectedWords.length === 0 ? (
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', fontStyle: 'italic' }}>
            Tap words below to build your translation...
          </span>
        ) : (
          selectedWords.map((word, idx) => (
            <button
              key={`selected-${word}-${idx}`}
              type="button"
              disabled={disabled}
              onClick={() => onRemoveWord(idx)}
              className="word-chip selected animate-pop"
              title="Click to send back"
              style={{
                cursor: disabled ? 'default' : 'pointer',
              }}
            >
              {word} ✕
            </button>
          ))
        )}
      </div>

      {/* Available Word Bank (Shuffled options) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
        {shuffledBank.map((word, idx) => {
          // Count occurrences of this word up to this index in shuffledBank vs selected
          const countInBank = shuffledBank.filter((w, i) => w === word && i <= idx).length;
          const countInSelected = selectedWords.filter((w) => w === word).length;
          const isUsed = countInBank <= countInSelected;

          return (
            <button
              key={`bank-${word}-${idx}`}
              type="button"
              disabled={disabled || isUsed}
              onClick={() => onSelectWord(word, idx)}
              className={`word-chip${isUsed ? ' used' : ''}`}
              style={{
                opacity: isUsed ? 0.2 : 1,
                transform: isUsed ? 'scale(0.95)' : 'scale(1)',
                cursor: isUsed || disabled ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}
