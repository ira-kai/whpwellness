// ─── Core Types ─────────────────────────────────────────────────────────────

export type BundleKey =
  | 'gut'
  | 'stress'
  | 'immune'
  | 'liver'
  | 'hormone'
  | 'longevity'
  | 'metabolic';

export type ScoreMap = Partial<Record<BundleKey, number>>;

export type QuestionType =
  | 'single-select'
  | 'multi-select'
  | 'horizontal-pills'
  | 'yes-no';

export interface AnswerOption {
  id: string;
  label: string;
  scores: ScoreMap;
  /** If true, selecting this clears all other selections (for "None" options) */
  exclusive?: boolean;
}

export interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: QuestionType;
  answers: AnswerOption[];
  /** Max selections for multi-select (default unlimited) */
  maxSelect?: number;
  /** Branch this question belongs to */
  branch?: string;
}

export interface UserAnswer {
  questionId: string;
  answerIds: string[];
}

export interface BundleInfo {
  key: BundleKey;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  productSlugs: string[];
  products: { name: string; description: string }[];
}

export interface ScoredBundle {
  bundle: BundleInfo;
  score: number;
  confidence: number;
}

export interface QuizResult {
  primary: ScoredBundle;
  secondary: ScoredBundle | null;
  tertiary: ScoredBundle | null;
  allScores: ScoredBundle[];
  confidenceLevel: 'high' | 'medium' | 'low';
}

export type Screen = 'intro' | 'quiz' | 'email' | 'loading' | 'results';

export interface SafetyFlags {
  takingMedications: boolean;
  medicationTypes: string[];
  pregnant: 'no' | 'yes' | 'trying' | null;
}

export type SlideDirection = 'forward' | 'backward';
