'use client';

import { useState, useEffect } from 'react';

interface MatchPairsProps {
  prompt: string;
  pairs: Array<{ left: string; right: string }>;
  onComplete: (matched: boolean) => void;
  disabled?: boolean;
}

export default function MatchPairs({
  prompt,
  pairs,
  onComplete,
  disabled = false,
}: MatchPairsProps) {
  const [leftSelected, setLeftSelected] = useState<string | null>(null);
  const [rightSelected, setRightSelected] = useState<string | null>(null);
  const [matchedLeft, setMatchedLeft] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<boolean>(false);

  // Shuffle right options
  const [shuffledRight, setShuffledRight] = useState<string[]>([]);

  useEffect(() => {
    const rights = pairs.map((p) => p.right);
    setShuffledRight([...rights].sort(() => Math.random() - 0.5));
  }, [pairs]);

  const handleSelectLeft = (left: string) => {
    if (disabled || matchedLeft.includes(left)) return;
    setLeftSelected(left);
    checkPair(left, rightSelected);
  };

  const handleSelectRight = (right: string) => {
    if (disabled) return;
    // Find left that matches this right to check if right is already matched
    const matchingPair = pairs.find((p) => p.right === right);
    if (matchingPair && matchedLeft.includes(matchingPair.left)) return;

    setRightSelected(right);
    checkPair(leftSelected, right);
  };

  const checkPair = (l: string | null, r: string | null) => {
    if (!l || !r) return;

    const pair = pairs.find((p) => p.left === l);
    if (pair && pair.right === r) {
      // Correct match!
      const newMatched = [...matchedLeft, l];
      setMatchedLeft(newMatched);
      setLeftSelected(null);
      setRightSelected(null);

      if (newMatched.length === pairs.length) {
        onComplete(true);
      }
    } else {
      // Wrong match
      setWrongPair(true);
      setTimeout(() => {
        setLeftSelected(null);
        setRightSelected(null);
        setWrongPair(false);
      }, 500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '36rem' }}>
      <h2 style={{ fontWeight: 800, fontSize: '1.375rem', color: 'var(--color-text-primary)' }}>
        {prompt}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {pairs.map((p) => {
            const isMatched = matchedLeft.includes(p.left);
            const isSelected = leftSelected === p.left;
            const isWrong = wrongPair && isSelected;

            return (
              <button
                key={p.left}
                type="button"
                disabled={disabled || isMatched}
                onClick={() => handleSelectLeft(p.left)}
                className={`pair-chip${isMatched ? ' matched' : ''}${isSelected ? ' selected' : ''}${isWrong ? ' wrong' : ''}`}
              >
                {p.left}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {shuffledRight.map((r, idx) => {
            const pair = pairs.find((p) => p.right === r);
            const isMatched = pair ? matchedLeft.includes(pair.left) : false;
            const isSelected = rightSelected === r;
            const isWrong = wrongPair && isSelected;

            return (
              <button
                key={idx}
                type="button"
                disabled={disabled || isMatched}
                onClick={() => handleSelectRight(r)}
                className={`pair-chip${isMatched ? ' matched' : ''}${isSelected ? ' selected' : ''}${isWrong ? ' wrong' : ''}`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
