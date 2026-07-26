'use client';

import type { Exercise } from '@/types';
import MultipleChoice from './MultipleChoice';
import WordBank from './WordBank';
import MatchPairs from './MatchPairs';
import FillInBlank from './FillInBlank';
import TypeAnswer from './TypeAnswer';

interface ExerciseRendererProps {
  exercise: Exercise;
  // Generic answer state from parent
  mcSelected: string | null;
  setMcSelected: (val: string) => void;
  wbSelected: string[];
  setWbSelected: (words: string[] | ((prev: string[]) => string[])) => void;
  fibValue: string;
  setFibValue: (val: string) => void;
  taValue: string;
  setTaValue: (val: string) => void;
  onMatchPairsComplete: (matched: boolean) => void;
  disabled?: boolean;
}

export default function ExerciseRenderer({
  exercise,
  mcSelected,
  setMcSelected,
  wbSelected,
  setWbSelected,
  fibValue,
  setFibValue,
  taValue,
  setTaValue,
  onMatchPairsComplete,
  disabled = false,
}: ExerciseRendererProps) {
  switch (exercise.type) {
    case 'multiple_choice':
      return (
        <MultipleChoice
          prompt={exercise.prompt}
          options={exercise.options ?? []}
          selectedOption={mcSelected}
          onSelect={setMcSelected}
          disabled={disabled}
        />
      );

    case 'word_bank':
      return (
        <WordBank
          prompt={exercise.prompt}
          wordBank={exercise.word_bank ?? []}
          selectedWords={wbSelected}
          onSelectWord={(word) => setWbSelected((prev) => [...prev, word])}
          onRemoveWord={(index) =>
            setWbSelected((prev) => prev.filter((_, i) => i !== index))
          }
          disabled={disabled}
        />
      );

    case 'match_pairs':
      return (
        <MatchPairs
          prompt={exercise.prompt}
          pairs={exercise.pairs ?? []}
          onComplete={onMatchPairsComplete}
          disabled={disabled}
        />
      );

    case 'fill_blank':
      return (
        <FillInBlank
          prompt={exercise.prompt}
          value={fibValue}
          onChange={setFibValue}
          disabled={disabled}
        />
      );

    case 'type_answer':
      return (
        <TypeAnswer
          prompt={exercise.prompt}
          value={taValue}
          onChange={setTaValue}
          disabled={disabled}
        />
      );

    default:
      return <div>Unknown exercise type</div>;
  }
}
