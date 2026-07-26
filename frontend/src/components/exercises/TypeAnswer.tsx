'use client';

import AudioButton from './AudioButton';

interface TypeAnswerProps {
  prompt: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function TypeAnswer({
  prompt,
  value,
  onChange,
  disabled = false,
}: TypeAnswerProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '36rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <AudioButton text={prompt} size="lg" />
        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            TYPE THE GERMAN TRANSLATION
          </p>
          <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>
            {prompt}
          </h2>
        </div>
      </div>

      <textarea
        rows={3}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type in German..."
        className="type-answer-input"
        autoFocus
      />
    </div>
  );
}
