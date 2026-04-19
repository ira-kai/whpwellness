import type { UserAnswer, BundleKey } from '../types';
import {
  ALL_QUESTIONS,
  BRANCH_QUESTIONS,
  ABBREVIATED_BRANCH,
  GOAL_TO_BUNDLE_KEY,
} from '../data/questions';
import { BUNDLE_KEYS } from '../data/bundles';
import { tallyScores } from './scoring';

/**
 * Determines the full ordered list of question IDs the user will see,
 * given answers provided so far. This is recalculated after every answer
 * to handle dynamic branching.
 */
export function buildQuestionSequence(answers: UserAnswer[]): string[] {
  const answerMap = new Map(answers.map((a) => [a.questionId, a.answerIds]));
  const sequence: string[] = [];

  // 1. Universal questions: q1, q2, q3
  sequence.push('q1', 'q2', 'q3');

  const q1Answer = answerMap.get('q1')?.[0];
  const q3Answer = answerMap.get('q3')?.[0];

  if (!q1Answer) return sequence; // haven't answered Q1 yet

  // 2. Branch-specific questions
  if (q1Answer === 'unsure') {
    // Triage path
    sequence.push('q_triage_1', 'q_triage_2');

    // After triage, determine top bundle and route to abbreviated branch
    const triageBranch = getTriageBranch(answers, q3Answer);
    if (triageBranch) {
      const abbrev = ABBREVIATED_BRANCH[triageBranch];
      if (abbrev) {
        sequence.push(...abbrev);
      }
    }
  } else if (q1Answer === 'hormones' && q3Answer === 'male') {
    // Male selected hormones -> reroute to next-best branch
    const rerouteBranch = getMaleHormoneRerouteBranch(answers);
    if (rerouteBranch) {
      const branchQs = getBranchQuestionsByBundleKey(rerouteBranch);
      sequence.push(...branchQs);
    }
  } else if (q1Answer === 'hormones' && q3Answer !== 'female' && q3Answer !== 'prefer-not' && q3Answer) {
    // Unknown sex answer for hormones -- treat as available
    const branchQs = BRANCH_QUESTIONS[q1Answer];
    if (branchQs) sequence.push(...branchQs);
  } else {
    // Normal branch routing
    const branchQs = BRANCH_QUESTIONS[q1Answer];
    if (branchQs) sequence.push(...branchQs);
  }

  // 3. Safety gates
  sequence.push('q_safety_1');

  const safetyAnswer = answerMap.get('q_safety_1')?.[0];
  if (safetyAnswer === 'yes') {
    sequence.push('q_safety_1a');
  }

  // Pregnancy question only for female users
  if (q3Answer === 'female') {
    sequence.push('q_safety_2');
  }

  return sequence;
}

/** After triage questions, figure out which bundle branch to send user to. */
function getTriageBranch(answers: UserAnswer[], sex?: string): BundleKey | null {
  // Only use triage + universal answers for scoring
  const triageAnswers = answers.filter((a) =>
    ['q1', 'q2', 'q3', 'q_triage_1', 'q_triage_2'].includes(a.questionId)
  );

  if (!triageAnswers.some((a) => a.questionId === 'q_triage_2')) {
    return null; // haven't finished triage yet
  }

  const totals = tallyScores(triageAnswers, ALL_QUESTIONS);

  // If male, exclude hormone
  const eligible = BUNDLE_KEYS.filter((k) => !(sex === 'male' && k === 'hormone'));

  eligible.sort((a, b) => totals[b] - totals[a]);
  return eligible[0] ?? null;
}

/** When male user picks hormones, find next-best branch from their answers so far. */
function getMaleHormoneRerouteBranch(answers: UserAnswer[]): BundleKey | null {
  const totals = tallyScores(answers, ALL_QUESTIONS);
  // Remove hormone
  totals.hormone = 0;

  const ranked = BUNDLE_KEYS
    .filter((k) => k !== 'hormone')
    .sort((a, b) => totals[b] - totals[a]);

  return ranked[0] ?? 'stress';
}

/** Map BundleKey -> branch question IDs */
function getBranchQuestionsByBundleKey(bundleKey: BundleKey): string[] {
  const keyToBranch: Record<BundleKey, string> = {
    gut: 'gut',
    stress: 'stress',
    immune: 'immune',
    liver: 'detox',
    hormone: 'hormones',
    longevity: 'longevity',
    metabolic: 'metabolic',
  };
  const branch = keyToBranch[bundleKey];
  return BRANCH_QUESTIONS[branch] ?? [];
}

/** Get the question object by ID. */
export function getQuestionById(id: string) {
  return ALL_QUESTIONS.find((q) => q.id === id) ?? null;
}

/**
 * Calculate total number of questions the user will see,
 * and their current position.
 */
export function getProgress(
  currentQuestionId: string,
  answers: UserAnswer[],
): { current: number; total: number } {
  const sequence = buildQuestionSequence(answers);
  const idx = sequence.indexOf(currentQuestionId);
  return {
    current: idx >= 0 ? idx + 1 : 1,
    total: sequence.length,
  };
}

/** Get next question ID in the sequence, or null if done. */
export function getNextQuestionId(
  currentQuestionId: string,
  answers: UserAnswer[],
): string | null {
  const sequence = buildQuestionSequence(answers);
  const idx = sequence.indexOf(currentQuestionId);
  if (idx < 0 || idx >= sequence.length - 1) return null;
  return sequence[idx + 1];
}

/** Get previous question ID in the sequence, or null if at start. */
export function getPrevQuestionId(
  currentQuestionId: string,
  answers: UserAnswer[],
): string | null {
  const sequence = buildQuestionSequence(answers);
  const idx = sequence.indexOf(currentQuestionId);
  if (idx <= 0) return null;
  return sequence[idx - 1];
}

/** Check if the given question ID should show a male-hormone interstitial. */
export function shouldShowHormoneInterstitial(answers: UserAnswer[]): boolean {
  const q1 = answers.find((a) => a.questionId === 'q1')?.answerIds[0];
  const q3 = answers.find((a) => a.questionId === 'q3')?.answerIds[0];
  return q1 === 'hormones' && q3 === 'male';
}
