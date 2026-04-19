// quiz/scoring.ts — Supplement bundle recommendation scoring engine
// Used by the React quiz app to map user answers → bundle recommendations

// ─── Types ───────────────────────────────────────────────────────────────────

export type BundleKey =
  | "gut"
  | "stress"
  | "immune"
  | "liver"
  | "hormone"
  | "longevity"
  | "metabolic";

/** Points added to each bundle when this answer is selected */
export type ScoreMap = Partial<Record<BundleKey, number>>;

export interface AnswerOption {
  id: string;
  label: string;
  scores: ScoreMap;
}

export interface Question {
  id: string;
  text: string;
  /** Optional subtitle or helper text */
  subtext?: string;
  answers: AnswerOption[];
  /** If true, user can pick multiple answers (scores stack) */
  multiSelect?: boolean;
}

/** A single answer the user gave */
export interface UserAnswer {
  questionId: string;
  /** One or more answer IDs (multiple if multiSelect question) */
  answerIds: string[];
}

export interface BundleInfo {
  key: BundleKey;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  /** Shopify/Wix product slugs included in this bundle */
  productSlugs: string[];
}

export interface ScoredBundle {
  bundle: BundleInfo;
  score: number;
  /** 0–100, how strongly the answers pointed here vs other bundles */
  confidence: number;
}

export interface QuizResult {
  primary: ScoredBundle;
  secondary: ScoredBundle | null;
  /** All bundles ranked by score, highest first */
  allScores: ScoredBundle[];
}

// ─── Bundle Catalog ──────────────────────────────────────────────────────────

export const BUNDLES: Record<BundleKey, BundleInfo> = {
  gut: {
    key: "gut",
    name: "GI Restore Protocol",
    slug: "gi-restore-protocol",
    tagline: "Rebuild your gut from the ground up",
    price: 284,
    productSlugs: [
      "gi-restore",
      "probiotic-blend",
      "digestive-enzymes",
      "l-glutamine",
    ],
  },
  stress: {
    key: "stress",
    name: "Adrenal Resilience Bundle",
    slug: "adrenal-resilience-bundle",
    tagline: "Calm your stress response naturally",
    price: 189,
    productSlugs: ["adrenal-support", "ashwagandha", "magnesium-glycinate"],
  },
  immune: {
    key: "immune",
    name: "Immune Defense Protocol",
    slug: "immune-defense-protocol",
    tagline: "Strengthen your body's natural defenses",
    price: 103,
    productSlugs: ["immune-support", "vitamin-d3-k2", "zinc"],
  },
  liver: {
    key: "liver",
    name: "Liver Detox Protocol",
    slug: "liver-detox-protocol",
    tagline: "Support your body's detox pathways",
    price: 156,
    productSlugs: ["liver-support", "milk-thistle", "nac"],
  },
  hormone: {
    key: "hormone",
    name: "Women's Hormone Balance",
    slug: "womens-hormone-balance",
    tagline: "Restore hormonal harmony",
    price: 167,
    productSlugs: ["hormone-balance", "dim", "vitex", "evening-primrose"],
  },
  longevity: {
    key: "longevity",
    name: "Cellular Vitality Protocol",
    slug: "cellular-vitality-protocol",
    tagline: "Age well at the cellular level",
    price: 212,
    productSlugs: ["nad-plus", "resveratrol", "coq10", "omega-3"],
  },
  metabolic: {
    key: "metabolic",
    name: "Metabolic Support Protocol",
    slug: "metabolic-support-protocol",
    tagline: "Balance blood sugar and metabolism",
    price: 147,
    productSlugs: ["berberine", "chromium", "alpha-lipoic-acid"],
  },
};

// ─── Scoring Engine ──────────────────────────────────────────────────────────

/**
 * Tally raw scores from user answers against a question bank.
 * Returns a map of bundle key → total points.
 */
export function tallyScores(
  answers: UserAnswer[],
  questions: Question[]
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
 * Minimum score gap (as fraction of max score) for the secondary recommendation
 * to be shown. If the #2 bundle scores less than 40% of the #1 bundle,
 * we don't show a secondary — the primary is a strong enough signal.
 */
const SECONDARY_THRESHOLD = 0.4;

/**
 * Take raw score totals and produce a ranked QuizResult.
 *
 * Tie-breaking: if two bundles have the same score, prefer the cheaper one
 * (better value for the customer). If still tied, both are shown.
 */
export function computeResult(
  totals: Record<BundleKey, number>
): QuizResult {
  const maxScore = Math.max(...Object.values(totals), 1); // avoid div-by-zero

  // Build scored list, sorted by score desc then price asc (tie-break)
  const scored: ScoredBundle[] = (Object.keys(totals) as BundleKey[])
    .map((key) => ({
      bundle: BUNDLES[key],
      score: totals[key],
      confidence: Math.round((totals[key] / maxScore) * 100),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Tie-break: cheaper bundle wins
      return a.bundle.price - b.bundle.price;
    });

  const primary = scored[0];

  // Only show secondary if it scored meaningfully relative to primary
  const runner = scored[1];
  const secondary =
    runner && runner.score >= primary.score * SECONDARY_THRESHOLD
      ? runner
      : null;

  return { primary, secondary, allScores: scored };
}

/**
 * Main entry point: takes user answers + question bank, returns the result.
 */
export function scoreQuiz(
  answers: UserAnswer[],
  questions: Question[]
): QuizResult {
  const totals = tallyScores(answers, questions);
  return computeResult(totals);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Get bundle info by key */
export function getBundle(key: BundleKey): BundleInfo {
  return BUNDLES[key];
}

/** All bundle keys */
export const BUNDLE_KEYS: BundleKey[] = Object.keys(BUNDLES) as BundleKey[];
