import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  'Analyzing your responses...',
  'Matching you with the right protocol...',
  'Preparing your personalized recommendation...',
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Step 2 at 1s
    timers.push(setTimeout(() => setStepIndex(1), 1000));
    // Step 3 at 2s
    timers.push(setTimeout(() => setStepIndex(2), 2000));
    // Complete at 3s
    timers.push(setTimeout(() => onComplete(), 3000));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="quiz-container flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* Animated dots */}
      <div className="mb-8">
        <span className="loading-dot" />
        <span className="loading-dot" />
        <span className="loading-dot" />
      </div>

      <div className="min-h-[60px]">
        {STEPS.map((text, i) => (
          <p
            key={text}
            className={`text-text-secondary text-base font-body transition-all duration-500 ${
              i === stepIndex
                ? 'opacity-100 translate-y-0'
                : i < stepIndex
                  ? 'opacity-0 -translate-y-2 absolute'
                  : 'opacity-0 translate-y-2 absolute'
            }`}
            style={{ position: i === stepIndex ? 'relative' : 'absolute' }}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}
