import { useState, useEffect, useCallback } from 'react';
import type { Question, SlideDirection } from '../types';
import OptionCard from './OptionCard';
import ProgressBar from './ProgressBar';

interface QuestionScreenProps {
  question: Question;
  currentSelections: string[];
  onAnswer: (questionId: string, answerIds: string[]) => void;
  onBack: (() => void) | null;
  progress: { current: number; total: number };
  direction: SlideDirection;
  /** Interstitial message to show before this question */
  interstitial?: string | null;
  onDismissInterstitial?: () => void;
}

export default function QuestionScreen({
  question,
  currentSelections,
  onAnswer,
  onBack,
  progress,
  direction,
  interstitial,
  onDismissInterstitial,
}: QuestionScreenProps) {
  const [selected, setSelected] = useState<string[]>(currentSelections);
  const [animKey, setAnimKey] = useState(0);
  const [showInterstitial, setShowInterstitial] = useState(!!interstitial);

  // Reset on question change
  useEffect(() => {
    setSelected(currentSelections);
    setAnimKey((k) => k + 1);
    setShowInterstitial(!!interstitial);
  }, [question.id, currentSelections, interstitial]);

  const isMulti = question.type === 'multi-select';
  const isPills = question.type === 'horizontal-pills';
  const isYesNo = question.type === 'yes-no';

  const handleSelect = useCallback(
    (answerId: string) => {
      if (isMulti) {
        const option = question.answers.find((a) => a.id === answerId);

        if (option?.exclusive) {
          // Exclusive option: clear everything else
          setSelected([answerId]);
          return;
        }

        setSelected((prev) => {
          // Remove any exclusive selections when picking a normal option
          let next = prev.filter(
            (id) => !question.answers.find((a) => a.id === id)?.exclusive,
          );

          if (next.includes(answerId)) {
            next = next.filter((id) => id !== answerId);
          } else {
            // Enforce maxSelect
            if (question.maxSelect && next.length >= question.maxSelect) {
              return prev;
            }
            next = [...next, answerId];
          }
          return next;
        });
      } else {
        // Single-select: set and auto-advance after delay
        setSelected([answerId]);
        setTimeout(() => {
          onAnswer(question.id, [answerId]);
        }, 400);
      }
    },
    [isMulti, question, onAnswer],
  );

  const handleContinue = () => {
    if (selected.length > 0) {
      onAnswer(question.id, selected);
    }
  };

  const handleDismissInterstitial = () => {
    setShowInterstitial(false);
    onDismissInterstitial?.();
  };

  // Interstitial overlay
  if (showInterstitial && interstitial) {
    return (
      <div className="quiz-container flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
        <p className="text-text-secondary text-base leading-relaxed max-w-md mb-8 font-body">
          {interstitial}
        </p>
        <button
          type="button"
          onClick={handleDismissInterstitial}
          className="btn-primary"
        >
          Continue
        </button>
      </div>
    );
  }

  const slideClass =
    direction === 'forward' ? 'slide-enter-forward' : 'slide-enter-backward';

  return (
    <div className="quiz-container">
      <ProgressBar current={progress.current} total={progress.total} />

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-text-muted hover:text-text-primary text-sm mb-4 transition-colors font-body"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      )}

      <div key={animKey} className={slideClass}>
        <h2 className="font-heading text-xl sm:text-2xl font-semibold text-text-primary mb-2 leading-snug">
          {question.text}
        </h2>

        {question.subtext && (
          <p className="text-text-muted text-sm mb-6 font-body">
            {question.subtext}
          </p>
        )}

        {!question.subtext && <div className="mb-6" />}

        {/* Horizontal pills */}
        {isPills && (
          <div className="flex flex-wrap gap-3">
            {question.answers.map((opt) => (
              <OptionCard
                key={opt.id}
                label={opt.label}
                selected={selected.includes(opt.id)}
                onClick={() => handleSelect(opt.id)}
                variant="pill"
              />
            ))}
          </div>
        )}

        {/* Yes/No */}
        {isYesNo && (
          <div className="grid grid-cols-2 gap-4">
            {question.answers.map((opt) => (
              <OptionCard
                key={opt.id}
                label={opt.label}
                selected={selected.includes(opt.id)}
                onClick={() => handleSelect(opt.id)}
                variant="yes-no"
              />
            ))}
          </div>
        )}

        {/* Single-select cards */}
        {question.type === 'single-select' && (
          <div
            className={`grid gap-3 ${
              question.id === 'q1'
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1'
            }`}
          >
            {question.answers.map((opt) => (
              <OptionCard
                key={opt.id}
                label={opt.label}
                selected={selected.includes(opt.id)}
                onClick={() => handleSelect(opt.id)}
                variant={opt.id === 'unsure' ? 'unsure' : 'card'}
              />
            ))}
          </div>
        )}

        {/* Multi-select */}
        {isMulti && (
          <>
            <div className="grid grid-cols-1 gap-3">
              {question.answers.map((opt) => (
                <OptionCard
                  key={opt.id}
                  label={opt.label}
                  selected={selected.includes(opt.id)}
                  onClick={() => handleSelect(opt.id)}
                  showCheckbox
                />
              ))}
            </div>
            <div className="mt-6 sticky bottom-4">
              <button
                type="button"
                onClick={handleContinue}
                disabled={selected.length === 0}
                className="btn-primary w-full sm:w-auto"
              >
                Continue
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
