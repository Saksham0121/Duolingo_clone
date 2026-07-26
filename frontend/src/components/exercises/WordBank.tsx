'use client';

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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '36rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <AudioButton text={prompt} size="lg" />
        <h2 style={{ fontWeight: 800, fontSize: '1.375rem', color: 'var(--color-text-primary)' }}>
          {prompt}
        </h2>
      </div>

      {/* Answer Construction Area */}
      <div
        style={{
          minHeight: '4.5rem',
          borderBottom: '2px solid var(--color-bg-border)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center',
          paddingBottom: '0.75rem',
        }}
      >
        {selectedWords.map((word, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onRemoveWord(idx)}
            className="word-chip selected animate-pop"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Available Word Bank */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', justifyContent: 'center', marginTop: '1rem' }}>
        {wordBank.map((word, idx) => {
          // Count occurrences in wordBank vs selected
          const countInBank = wordBank.filter((w, i) => w === word && i <= idx).length;
          const countInSelected = selectedWords.filter((w) => w === word).length;
          const isUsed = countInBank <= countInSelected;

          return (
            <button
              key={idx}
              type="button"
              disabled={disabled || isUsed}
              onClick={() => onSelectWord(word, idx)}
              className={`word-chip${isUsed ? ' used' : ''}`}
            >
              {word}
            </button>
          );
        })}
      </div>
    </div>
  );
}
