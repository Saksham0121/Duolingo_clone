'use client';

import AudioButton from './AudioButton';

interface MultipleChoiceProps {
  prompt: string;
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  disabled?: boolean;
}

export default function MultipleChoice({
  prompt,
  options,
  selectedOption,
  onSelect,
  disabled = false,
}: MultipleChoiceProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '36rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <AudioButton text={prompt} size="lg" />
        <h2 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>
          {prompt}
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {options.map((option, idx) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={idx}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(option)}
              className={`btn-option${isSelected ? ' selected' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '1.125rem',
                minHeight: '4.5rem',
              }}
            >
              <span
                style={{
                  width: '1.75rem',
                  height: '1.75rem',
                  borderRadius: '0.5rem',
                  border: '2px solid var(--color-bg-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: isSelected ? 'var(--color-duo-blue)' : 'var(--color-text-muted)',
                  borderColor: isSelected ? 'var(--color-duo-blue)' : 'var(--color-bg-border)',
                }}
              >
                {idx + 1}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
