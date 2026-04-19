import { useState, useCallback } from 'react';
import type { Screen, UserAnswer, QuizResult, SafetyFlags, SlideDirection } from './types';
import IntroScreen from './components/IntroScreen';
import QuestionScreen from './components/QuestionScreen';
import EmailCapture from './components/EmailCapture';
import LoadingScreen from './components/LoadingScreen';
import ResultsScreen from './components/ResultsScreen';
import {
  buildQuestionSequence,
  getQuestionById,
  getProgress,
  getNextQuestionId,
  getPrevQuestionId,
  shouldShowHormoneInterstitial,
} from './lib/quiz-engine';
import { scoreQuiz, extractSafetyFlags } from './lib/scoring';
import { ALL_QUESTIONS } from './data/questions';

export default function App() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState('q1');
  const [direction, setDirection] = useState<SlideDirection>('forward');
  const [result, setResult] = useState<QuizResult | null>(null);
  const [safetyFlags, setSafetyFlags] = useState<SafetyFlags>({
    takingMedications: false,
    medicationTypes: [],
    pregnant: null,
  });
  const [interstitialShown, setInterstitialShown] = useState(false);

  const getAnswer = useCallback(
    (qId: string) => answers.find((a) => a.questionId === qId)?.answerIds ?? [],
    [answers],
  );

  const q1Answer = getAnswer('q1')[0];
  const q3Answer = getAnswer('q3')[0];

  const handleStart = () => {
    setScreen('quiz');
    setCurrentQuestionId('q1');
  };

  const handleAnswer = useCallback(
    (questionId: string, answerIds: string[]) => {
      // Upsert answer
      const updated = [
        ...answers.filter((a) => a.questionId !== questionId),
        { questionId, answerIds },
      ];
      setAnswers(updated);
      setDirection('forward');

      // Check if this was the last question
      const sequence = buildQuestionSequence(updated);
      const idx = sequence.indexOf(questionId);

      if (idx >= sequence.length - 1) {
        // Quiz complete -> email capture
        setScreen('email');
        return;
      }

      // Advance to next question
      const nextId = sequence[idx + 1];
      if (nextId) {
        setCurrentQuestionId(nextId);
      }
    },
    [answers],
  );

  const handleBack = useCallback(() => {
    setDirection('backward');
    const prevId = getPrevQuestionId(currentQuestionId, answers);
    if (prevId) {
      setCurrentQuestionId(prevId);
    }
  }, [currentQuestionId, answers]);

  const handleEmail = (_email: string) => {
    // In production, send email to backend/Klaviyo/etc.
    setScreen('loading');
  };

  const handleSkipEmail = () => {
    setScreen('loading');
  };

  const handleLoadingComplete = useCallback(() => {
    const quizResult = scoreQuiz(answers, ALL_QUESTIONS, q1Answer, q3Answer);
    const flags = extractSafetyFlags(answers);
    setResult(quizResult);
    setSafetyFlags(flags);
    setScreen('results');
  }, [answers, q1Answer, q3Answer]);

  // Determine interstitial for male-hormone reroute
  const showInterstitial =
    currentQuestionId !== 'q1' &&
    currentQuestionId !== 'q2' &&
    currentQuestionId !== 'q3' &&
    shouldShowHormoneInterstitial(answers) &&
    !interstitialShown;

  const interstitialMessage = showInterstitial
    ? "Our Hormone Balance bundle is formulated for estrogen-related concerns. Based on your answers, we think these might be a better fit for you."
    : null;

  // Render screens
  if (screen === 'intro') {
    return <IntroScreen onStart={handleStart} />;
  }

  if (screen === 'email') {
    return <EmailCapture onSubmit={handleEmail} onSkip={handleSkipEmail} />;
  }

  if (screen === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (screen === 'results' && result) {
    return <ResultsScreen result={result} safetyFlags={safetyFlags} />;
  }

  // Quiz screen
  const question = getQuestionById(currentQuestionId);
  if (!question) {
    // Fallback: go to email capture
    setScreen('email');
    return null;
  }

  const progress = getProgress(currentQuestionId, answers);
  const prevId = getPrevQuestionId(currentQuestionId, answers);

  return (
    <QuestionScreen
      question={question}
      currentSelections={getAnswer(question.id)}
      onAnswer={handleAnswer}
      onBack={prevId ? handleBack : null}
      progress={progress}
      direction={direction}
      interstitial={interstitialMessage}
      onDismissInterstitial={() => setInterstitialShown(true)}
    />
  );
}
