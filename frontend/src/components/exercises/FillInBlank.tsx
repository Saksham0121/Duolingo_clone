'use client';

import AudioButton from './AudioButton';

interface FillInBlankProps {
  prompt: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function FillInBlank({
  prompt,
  value,
  onChange,
  disabled = false,
}: FillInBlankProps) {
  // Split prompt around ___
  const parts = prompt.split('___');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '36rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <AudioButton text={prompt.replace('___', value || 'blank')} size="lg" />
        <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-text-secondary)' }}>
          Fill in the missing word:
        </h2>
      </div>

      <div
        className="duo-card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '2rem 1.5rem',
          fontSize: '1.5rem',
          fontWeight: 700,
          lineHeight: 2,
        }}
      >
        <span>{parts[0]}</span>
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="type word"
          className="fill-blank-input"
          style={{ width: `${Math.max(6, value.length + 2)}ch` }}
          autoFocus
        />
        <span>{parts[1] ?? ''}</span>
      </div>
    </div>
  );
}
