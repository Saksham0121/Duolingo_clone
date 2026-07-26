'use client';

import { useState } from 'react';
import { speakGermanText } from '@/lib/tts';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  showSlow?: boolean;
}

export default function AudioButton({ text, size = 'md', showSlow = true }: AudioButtonProps) {
  const [speakingNormal, setSpeakingNormal] = useState(false);
  const [speakingSlow, setSpeakingSlow] = useState(false);

  const handleSpeak = (slow: boolean = false) => {
    if (slow) {
      setSpeakingSlow(true);
      speakGermanText(text, 0.55);
      setTimeout(() => setSpeakingSlow(false), 2000);
    } else {
      setSpeakingNormal(true);
      speakGermanText(text, 0.9);
      setTimeout(() => setSpeakingNormal(false), 1800);
    }
  };

  const paddingMap = { sm: '0.4rem 0.6rem', md: '0.6rem 0.9rem', lg: '0.875rem 1.25rem' };
  const fontSizeMap = { sm: '1.25rem', md: '1.5rem', lg: '1.75rem' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {/* Normal speed speaker */}
      <button
        type="button"
        onClick={() => handleSpeak(false)}
        className="audio-btn"
        style={{
          padding: paddingMap[size],
          opacity: speakingNormal ? 0.7 : 1,
          transform: speakingNormal ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.15s ease',
        }}
        title="Listen at normal speed"
        aria-label="Listen audio normal"
      >
        <span style={{ fontSize: fontSizeMap[size] }}>
          {speakingNormal ? '🔊' : '🔈'}
        </span>
      </button>

      {/* Slow speed turtle */}
      {showSlow && (
        <button
          type="button"
          onClick={() => handleSpeak(true)}
          className="audio-btn"
          style={{
            padding: paddingMap[size],
            opacity: speakingSlow ? 0.7 : 1,
            transform: speakingSlow ? 'scale(0.95)' : 'scale(1)',
            borderColor: 'var(--color-duo-yellow)',
            transition: 'transform 0.15s ease',
          }}
          title="Listen at slow speed"
          aria-label="Listen audio slow"
        >
          <span style={{ fontSize: fontSizeMap[size] }}>
            🐢
          </span>
        </button>
      )}
    </div>
  );
}
