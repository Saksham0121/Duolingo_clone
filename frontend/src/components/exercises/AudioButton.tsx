'use client';

import { useState } from 'react';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function AudioButton({ text, size = 'md' }: AudioButtonProps) {
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE'; // German TTS
    utterance.rate = 0.9;     // Slightly slower for learners

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const paddingMap = { sm: '0.4rem 0.6rem', md: '0.75rem 1rem', lg: '1rem 1.5rem' };
  const fontSizeMap = { sm: '1.25rem', md: '1.5rem', lg: '2rem' };

  return (
    <button
      type="button"
      onClick={speak}
      className="audio-btn"
      style={{
        padding: paddingMap[size],
        opacity: speaking ? 0.8 : 1,
      }}
      title="Listen to German pronunciation"
      aria-label="Listen audio"
    >
      <span style={{ fontSize: fontSizeMap[size] }}>
        {speaking ? '🔊' : '🔈'}
      </span>
    </button>
  );
}
