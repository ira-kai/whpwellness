import type { BundleKey, QuizResult, ScoredBundle, UserAnswer, Question, SafetyFlags } from '../types';
import { BUNDLES, BUNDLE_KEYS } from '../data/bundles';

/** Tally raw scores from user answers against a question bank. */
export function tallyScores(
  answers: UserAnswer[],
  questions: Question[],
): Record<BundleKey, number> {
  const totals: Record<BundleKey, number> = {
    gut: 0,
    stress: 0,
    immune: 0,
    liver: 0,
    hormone: 0,
    longevity: 0,
    metabolic: 0,
  };

  const questionMap = new Map(questions.map((q) => [q.id, q]));

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId);
    if (!question) continue;

    for (const answerId of answer.answerIds) {
      const opt = question.answers.find((a) => a.id === answerId);
      if (!opt) continue;

      for (const [bundle, points] of Object.entries(opt.scores)) {
        totals[bundle as BundleKey] += points;
      }
    }
  }

  return totals;
}

/**
 * Handle male-hormone reroute: if user selected "hormones" in Q1 but is male,
 * redistribute the +3 from Q1: +2 to next-highest, +1 to third-highest.
 */
export function applyMaleHormoneRedistribution(
  totals: Record<BundleKey, number>,
): Record<BundleKey, number> {
  const adjusted = { ...totals };
  // Remove the hormone goal points
  adjusted.hormone = Math.max(0, adjusted.hormone - 3);

  // Find top two non-hormone bundles
  const ranked = BUNDLE_KEYS
    .filter((k) => k !== 'hormone')
    .sort((a, b) => adjusted[b] - adjusted[a]);

  if (ranked.length >= 1) adjusted[ranked[0]] += 2;
  if (ranked.length >= 2) adjusted[ranked[1]] += 1;

  return adjusted;
}

const SECONDARY_THRESHOLD = 0.4;

/** Compute result from raw totals. */
export function computeResult(
  totals: Record<BundleKey, number>,
  q1Answer?: string,
  sex?: string,
): QuizResult {
  let adjustedTotals = { ...totals };

  // Block hormone bundle for male users
  if (sex === 'male') {
    adjustedTotals.hormone = 0;
  }

  const maxScore = Math.max(...Object.values(adjustedTotals), 1);

  const scored: ScoredBundle[] = BUNDLE_KEYS
    .map((key) => ({
      bundle: BUNDLES[key],
      score: adjustedTotals[key],
      confidence: Math.round((adjustedTotals[key] / maxScore) * 100),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Tie-break 1: Q1 goal match wins
      const aIsGoal = q1Answer && a.bundle.key === goalToBundleKey(q1Answer);
      const bIsGoal = q1Answer && b.bundle.key === goalToBundleKey(q1Answer);
      if (aIsGoal && !bIsGoal) return -1;
      if (bIsGoal && !aIsGoal) return 1;
      // Tie-break 2: cheaper bundle wins
      return a.bundle.price - b.bundle.price;
    });

  const primary = scored[0];
  const runner = scored[1];
  const third = scored[2];

  const secondary =
    runner && runner.score >= primary.score * SECONDARY_THRESHOLD
      ? runner
      : null;

  // Tertiary: within 5 points of primary
  const tertiary =
    third && primary.score - third.score <= 5
      ? third
      : null;

  // Confidence level based on top score
  let confidenceLevel: 'high' | 'medium' | 'low';
  if (primary.score >= 8) {
    confidenceLevel = 'high';
  } else if (primary.score >= 5) {
    confidenceLevel = 'medium';
  } else {
    confidenceLevel = 'low';
  }

  return { primary, secondary, tertiary, allScores: scored, confidenceLevel };
}

function goalToBundleKey(goal: string): BundleKey | null {
  const map: Record<string, BundleKey> = {
    gut: 'gut',
    stress: 'stress',
    immune: 'immune',
    detox: 'liver',
    hormones: 'hormone',
    longevity: 'longevity',
    metabolic: 'metabolic',
  };
  return map[goal] ?? null;
}

/** Main entry point: user answers + question bank -> result. */
export function scoreQuiz(
  answers: UserAnswer[],
  questions: Question[],
  q1Answer?: string,
  sex?: string,
): QuizResult {
  let totals = tallyScores(answers, questions);

  // Handle male user who selected hormones goal
  if (sex === 'male' && q1Answer === 'hormones') {
    totals = applyMaleHormoneRedistribution(totals);
  }

  return computeResult(totals, q1Answer, sex);
}

/** Build safety flags from user answers. */
export function extractSafetyFlags(answers: UserAnswer[]): SafetyFlags {
  const safetyAnswer = answers.find((a) => a.questionId === 'q_safety_1');
  const medTypeAnswer = answers.find((a) => a.questionId === 'q_safety_1a');
  const pregnancyAnswer = answers.find((a) => a.questionId === 'q_safety_2');

  return {
    takingMedications: safetyAnswer?.answerIds.includes('yes') ?? false,
    medicationTypes: medTypeAnswer?.answerIds ?? [],
    pregnant: (pregnancyAnswer?.answerIds[0] as 'no' | 'yes' | 'trying') ?? null,
  };
}
