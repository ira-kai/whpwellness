import type { Question } from '../types';

// ─── Universal Questions ────────────────────────────────────────────────────

export const q1: Question = {
  id: 'q1',
  text: "What's bringing you here today?",
  subtext: 'Pick the area that feels most pressing right now.',
  type: 'single-select',
  answers: [
    { id: 'gut', label: 'Digestive comfort', scores: { gut: 3 } },
    { id: 'stress', label: 'Stress & energy', scores: { stress: 3 } },
    { id: 'immune', label: 'Immune strength', scores: { immune: 3 } },
    { id: 'detox', label: 'Detox & cleansing', scores: { liver: 3 } },
    { id: 'hormones', label: 'Hormone balance', scores: { hormone: 3 } },
    { id: 'longevity', label: 'Healthy aging & vitality', scores: { longevity: 3 } },
    { id: 'metabolic', label: 'Blood sugar & metabolism', scores: { metabolic: 3 } },
    { id: 'unsure', label: "I'm not sure \u2014 help me figure it out", scores: {} },
  ],
};

export const q2: Question = {
  id: 'q2',
  text: "What's your age range?",
  subtext: 'This helps us consider what your body needs at this stage of life.',
  type: 'horizontal-pills',
  answers: [
    { id: '18-29', label: '18\u201329', scores: { immune: 1 } },
    { id: '30-39', label: '30\u201339', scores: { stress: 1 } },
    { id: '40-49', label: '40\u201349', scores: { hormone: 1, longevity: 1 } },
    { id: '50-59', label: '50\u201359', scores: { longevity: 2, metabolic: 1 } },
    { id: '60+', label: '60+', scores: { longevity: 2, immune: 1 } },
  ],
};

export const q3: Question = {
  id: 'q3',
  text: 'What sex were you assigned at birth?',
  subtext: 'We ask because hormone and nutrient needs can differ significantly.',
  type: 'single-select',
  answers: [
    { id: 'female', label: 'Female', scores: {} },
    { id: 'male', label: 'Male', scores: {} },
    { id: 'prefer-not', label: 'Prefer not to say', scores: {} },
  ],
};

// ─── Gut Health Branch ──────────────────────────────────────────────────────

export const q_gut_1: Question = {
  id: 'q_gut_1',
  text: 'How often do you experience bloating or digestive discomfort?',
  type: 'single-select',
  branch: 'gut',
  answers: [
    { id: 'rarely', label: 'Rarely \u2014 my digestion is mostly fine', scores: { gut: 0 } },
    { id: 'weekly', label: 'A few times a week', scores: { gut: 1 } },
    { id: 'daily', label: 'Most days', scores: { gut: 2 } },
    { id: 'after-meals', label: 'Almost every time I eat', scores: { gut: 3 } },
  ],
};

export const q_gut_2: Question = {
  id: 'q_gut_2',
  text: 'Do any of these sound familiar?',
  subtext: 'Select all that apply.',
  type: 'multi-select',
  branch: 'gut',
  answers: [
    { id: 'food-sensitivity', label: "Certain foods just don't agree with me anymore", scores: { gut: 1 } },
    { id: 'antibiotics', label: "I've taken antibiotics in the past year", scores: { gut: 1 } },
    { id: 'irregularity', label: 'My digestion is unpredictable day to day', scores: { gut: 1 } },
    { id: 'diagnosed', label: "I've been told I have IBS, SIBO, or leaky gut", scores: { gut: 2 } },
    { id: 'none', label: 'None of these', scores: { gut: 0 }, exclusive: true },
  ],
};

export const q_gut_3: Question = {
  id: 'q_gut_3',
  text: 'How would you describe your energy after meals?',
  type: 'single-select',
  branch: 'gut',
  answers: [
    { id: 'fine', label: "I feel fine \u2014 meals don't really affect my energy", scores: { gut: 0 } },
    { id: 'sluggish', label: 'I often feel sluggish or heavy after eating', scores: { gut: 1, metabolic: 1 } },
    { id: 'bloat-crash', label: "Bloated and tired \u2014 like my body is working overtime", scores: { gut: 2 } },
  ],
};

export const q_gut_4: Question = {
  id: 'q_gut_4',
  text: 'Have you tried probiotics or digestive enzymes before?',
  type: 'single-select',
  branch: 'gut',
  answers: [
    { id: 'never', label: 'No, this would be new for me', scores: { gut: 1 } },
    { id: 'some-help', label: 'Yes, and they helped a little', scores: { gut: 2 } },
    { id: 'no-help', label: "Yes, but they didn't make a difference", scores: { gut: 2 } },
    { id: 'currently', label: "Yes, I'm taking some now but want something better", scores: { gut: 3 } },
  ],
};

// ─── Stress & Adrenal Branch ────────────────────────────────────────────────

export const q_stress_1: Question = {
  id: 'q_stress_1',
  text: 'Which best describes your energy pattern most days?',
  type: 'single-select',
  branch: 'stress',
  answers: [
    { id: 'wired-tired', label: 'Wired but tired \u2014 my mind races but my body is exhausted', scores: { stress: 3 } },
    { id: 'flat', label: 'Flat and drained \u2014 I struggle to get going', scores: { stress: 2, longevity: 1 } },
    { id: 'rollercoaster', label: 'Up and down \u2014 I crash hard in the afternoon', scores: { stress: 2, metabolic: 1 } },
    { id: 'mostly-ok', label: "Mostly steady \u2014 I'm looking for an edge", scores: { stress: 1 } },
  ],
};

export const q_stress_2: Question = {
  id: 'q_stress_2',
  text: "How's your sleep these days?",
  type: 'single-select',
  branch: 'stress',
  answers: [
    { id: 'fine', label: 'I sleep well most nights', scores: { stress: 0 } },
    { id: 'fall-asleep', label: 'I have trouble falling asleep', scores: { stress: 2 } },
    { id: 'stay-asleep', label: 'I fall asleep fine but wake up at 2\u20133 AM', scores: { stress: 3 } },
    { id: 'both', label: 'Both \u2014 falling asleep AND staying asleep are hard', scores: { stress: 3 } },
  ],
};

export const q_stress_3: Question = {
  id: 'q_stress_3',
  text: 'How long have you been feeling this way?',
  type: 'single-select',
  branch: 'stress',
  answers: [
    { id: 'recent', label: "It's fairly new \u2014 the last few weeks", scores: { stress: 1 } },
    { id: 'months', label: 'Several months', scores: { stress: 2 } },
    { id: 'year-plus', label: "Over a year \u2014 it's become my normal", scores: { stress: 3 } },
  ],
};

export const q_stress_4: Question = {
  id: 'q_stress_4',
  text: 'Do you rely on caffeine to get through the day?',
  type: 'single-select',
  branch: 'stress',
  answers: [
    { id: 'no', label: 'Not really \u2014 I can take it or leave it', scores: { stress: 0 } },
    { id: 'moderate', label: "I need my morning coffee but that's it", scores: { stress: 1 } },
    { id: 'heavy', label: 'Multiple cups, and I still feel drained', scores: { stress: 2 } },
    { id: 'anxious', label: 'Caffeine makes me jittery or anxious now', scores: { stress: 3 } },
  ],
};

// ─── Immune Branch ──────────────────────────────────────────────────────────

export const q_immune_1: Question = {
  id: 'q_immune_1',
  text: 'How often do you tend to get sick?',
  type: 'single-select',
  branch: 'immune',
  answers: [
    { id: 'rarely', label: 'Rarely \u2014 maybe once a year or less', scores: { immune: 1 } },
    { id: 'few', label: "A few times a year \u2014 more than I'd like", scores: { immune: 2 } },
    { id: 'often', label: 'It feels like I catch everything going around', scores: { immune: 3 } },
  ],
};

export const q_immune_2: Question = {
  id: 'q_immune_2',
  text: 'When you do get sick, how quickly do you bounce back?',
  type: 'single-select',
  branch: 'immune',
  answers: [
    { id: 'fast', label: "Pretty quickly \u2014 a few days and I'm fine", scores: { immune: 0 } },
    { id: 'slow', label: "It lingers \u2014 I'm not fully right for a week or more", scores: { immune: 2 } },
    { id: 'very-slow', label: 'It takes me out for a long time, or it comes in waves', scores: { immune: 3 } },
  ],
};

export const q_immune_3: Question = {
  id: 'q_immune_3',
  text: 'Any of these apply to you?',
  subtext: 'Select all that apply.',
  type: 'multi-select',
  branch: 'immune',
  answers: [
    { id: 'seasonal', label: 'I struggle more during certain seasons', scores: { immune: 1 } },
    { id: 'autoimmune', label: 'I have an autoimmune condition', scores: { immune: 1, liver: 1 } },
    { id: 'travel', label: 'I travel frequently or am around crowds often', scores: { immune: 1 } },
    { id: 'chronic', label: 'I deal with chronic low-grade inflammation', scores: { immune: 1, longevity: 1 } },
    { id: 'none', label: 'None of these', scores: { immune: 0 }, exclusive: true },
  ],
};

// ─── Liver Detox Branch ─────────────────────────────────────────────────────

export const q_detox_1: Question = {
  id: 'q_detox_1',
  text: 'Do any of these ring true for you?',
  subtext: 'Select all that apply.',
  type: 'multi-select',
  branch: 'detox',
  answers: [
    { id: 'brain-fog', label: 'Brain fog or mental cloudiness', scores: { liver: 1, longevity: 1 } },
    { id: 'skin', label: 'Skin issues (acne, rashes, dullness)', scores: { liver: 2 } },
    { id: 'chemical', label: 'Sensitivity to chemicals, fragrances, or fumes', scores: { liver: 2 } },
    { id: 'fatigue', label: 'Unexplained fatigue even with enough sleep', scores: { liver: 1, stress: 1 } },
    { id: 'none', label: 'None of these', scores: { liver: 0 }, exclusive: true },
  ],
};

export const q_detox_2: Question = {
  id: 'q_detox_2',
  text: 'How often do you consume alcohol?',
  type: 'single-select',
  branch: 'detox',
  answers: [
    { id: 'never', label: 'Rarely or never', scores: { liver: 0 } },
    { id: 'social', label: 'Socially \u2014 a few times a month', scores: { liver: 1 } },
    { id: 'regular', label: 'A few times a week', scores: { liver: 2 } },
    { id: 'daily', label: 'Most days', scores: { liver: 3 } },
  ],
};

export const q_detox_3: Question = {
  id: 'q_detox_3',
  text: 'Have you ever had known exposure to mold, heavy metals, or environmental toxins?',
  type: 'single-select',
  branch: 'detox',
  answers: [
    { id: 'yes', label: 'Yes, or I suspect so', scores: { liver: 3 } },
    { id: 'unsure', label: "I'm not sure", scores: { liver: 1 } },
    { id: 'no', label: 'No', scores: { liver: 0 } },
  ],
};

export const q_detox_4: Question = {
  id: 'q_detox_4',
  text: "How would you describe your body's \"reset\" ability?",
  type: 'single-select',
  branch: 'detox',
  answers: [
    { id: 'good', label: 'I bounce back well from indulgences or late nights', scores: { liver: 0 } },
    { id: 'slow', label: 'It takes me a day or two to feel right again', scores: { liver: 1 } },
    { id: 'poor', label: "My body seems to hold onto everything \u2014 I feel sluggish a lot", scores: { liver: 2 } },
  ],
};

// ─── Women's Hormone Branch ─────────────────────────────────────────────────

export const q_hormone_1: Question = {
  id: 'q_hormone_1',
  text: 'Where are you in your hormonal journey?',
  type: 'single-select',
  branch: 'hormone',
  answers: [
    { id: 'cycling', label: 'Still having regular periods', scores: { hormone: 1 } },
    { id: 'irregular', label: 'Periods are becoming irregular or unpredictable', scores: { hormone: 2 } },
    { id: 'peri', label: 'Perimenopause (symptoms starting, periods shifting)', scores: { hormone: 3 } },
    { id: 'post', label: 'Menopause or post-menopause', scores: { hormone: 3, longevity: 1 } },
  ],
};

export const q_hormone_2: Question = {
  id: 'q_hormone_2',
  text: 'Which of these do you experience?',
  subtext: 'Select all that apply.',
  type: 'multi-select',
  branch: 'hormone',
  answers: [
    { id: 'pms', label: 'PMS \u2014 mood swings, irritability, cravings before your period', scores: { hormone: 2 } },
    { id: 'cramps', label: 'Painful cramps or heavy periods', scores: { hormone: 2 } },
    { id: 'hot-flashes', label: 'Hot flashes or night sweats', scores: { hormone: 2 } },
    { id: 'hair', label: 'Hair thinning or changes in hair/skin', scores: { hormone: 1 } },
    { id: 'mood', label: 'Mood changes that feel hormone-driven', scores: { hormone: 1, stress: 1 } },
    { id: 'none', label: 'None of these', scores: { hormone: 0 }, exclusive: true },
  ],
};

export const q_hormone_3: Question = {
  id: 'q_hormone_3',
  text: 'How much do these symptoms affect your daily life?',
  type: 'single-select',
  branch: 'hormone',
  answers: [
    { id: 'minor', label: "They're annoying but manageable", scores: { hormone: 1 } },
    { id: 'moderate', label: 'They disrupt my routine several days a month', scores: { hormone: 2 } },
    { id: 'significant', label: 'They significantly impact my quality of life', scores: { hormone: 3 } },
  ],
};

export const q_hormone_4: Question = {
  id: 'q_hormone_4',
  text: 'Have you tried hormone-related supplements before?',
  type: 'single-select',
  branch: 'hormone',
  answers: [
    { id: 'no', label: 'No, this is new territory for me', scores: { hormone: 1 } },
    { id: 'some', label: "I've tried a few things with mixed results", scores: { hormone: 2 } },
    { id: 'looking', label: "Yes, and I'm looking for something more comprehensive", scores: { hormone: 3 } },
  ],
};

// ─── Cellular Vitality / Longevity Branch ───────────────────────────────────

export const q_longevity_1: Question = {
  id: 'q_longevity_1',
  text: "What's motivating your interest in healthy aging?",
  type: 'single-select',
  branch: 'longevity',
  answers: [
    { id: 'proactive', label: "I'm being proactive \u2014 I want to age well", scores: { longevity: 2 } },
    { id: 'noticing', label: "I'm noticing changes \u2014 less energy, slower recovery, foggy thinking", scores: { longevity: 3 } },
    { id: 'family', label: 'Family history has me paying attention', scores: { longevity: 2 } },
  ],
};

export const q_longevity_2: Question = {
  id: 'q_longevity_2',
  text: 'Which of these concerns resonate with you?',
  subtext: 'Select all that apply.',
  type: 'multi-select',
  branch: 'longevity',
  answers: [
    { id: 'cognitive', label: 'Mental sharpness \u2014 memory, focus, clarity', scores: { longevity: 1, stress: 1 } },
    { id: 'joints', label: 'Joint comfort and mobility', scores: { longevity: 2 } },
    { id: 'inflammation', label: 'Chronic aches or inflammation', scores: { longevity: 2 } },
    { id: 'cardiovascular', label: 'Heart and cardiovascular health', scores: { longevity: 1 } },
    { id: 'none', label: "None specifically \u2014 I just want to stay ahead of it", scores: { longevity: 1 } },
  ],
};

export const q_longevity_3: Question = {
  id: 'q_longevity_3',
  text: 'How active are you?',
  type: 'single-select',
  branch: 'longevity',
  answers: [
    { id: 'sedentary', label: "Not very \u2014 I'd like to be more active", scores: { longevity: 1, metabolic: 1 } },
    { id: 'moderate', label: 'Moderately active \u2014 I move a few times a week', scores: { longevity: 1 } },
    { id: 'active', label: 'Very active \u2014 I exercise regularly', scores: { longevity: 2 } },
  ],
};

export const q_longevity_4: Question = {
  id: 'q_longevity_4',
  text: 'Are you interested in NAD+ or longevity-specific nutrients?',
  subtext: 'NAD+ supports cellular energy and repair \u2014 it naturally declines with age.',
  type: 'single-select',
  branch: 'longevity',
  answers: [
    { id: 'yes', label: "Yes, I've been reading about this", scores: { longevity: 3 } },
    { id: 'curious', label: "I'm curious \u2014 tell me more on the results page", scores: { longevity: 2 } },
    { id: 'new', label: 'This is all new to me', scores: { longevity: 1 } },
  ],
};

// ─── Metabolic Support Branch ───────────────────────────────────────────────

export const q_metabolic_1: Question = {
  id: 'q_metabolic_1',
  text: 'How would you describe your energy between meals?',
  type: 'single-select',
  branch: 'metabolic',
  answers: [
    { id: 'stable', label: "Pretty steady \u2014 I don't think about it much", scores: { metabolic: 0 } },
    { id: 'dips', label: 'I get noticeable energy dips, especially mid-afternoon', scores: { metabolic: 2 } },
    { id: 'crashes', label: "I crash hard if I don't eat on time", scores: { metabolic: 3 } },
  ],
};

export const q_metabolic_2: Question = {
  id: 'q_metabolic_2',
  text: 'Do you experience sugar or carb cravings?',
  type: 'single-select',
  branch: 'metabolic',
  answers: [
    { id: 'rarely', label: 'Not really', scores: { metabolic: 0 } },
    { id: 'sometimes', label: 'Sometimes, especially in the afternoon or evening', scores: { metabolic: 1 } },
    { id: 'strong', label: 'Strong cravings that feel hard to control', scores: { metabolic: 3 } },
  ],
};

export const q_metabolic_3: Question = {
  id: 'q_metabolic_3',
  text: 'Any of these apply to you?',
  subtext: 'Select all that apply.',
  type: 'multi-select',
  branch: 'metabolic',
  answers: [
    { id: 'pcos', label: "I've been diagnosed with PCOS or insulin resistance", scores: { metabolic: 3 } },
    { id: 'weight', label: 'I struggle with weight despite eating reasonably well', scores: { metabolic: 2 } },
    { id: 'a1c', label: 'My doctor has mentioned blood sugar or A1C concerns', scores: { metabolic: 3 } },
    { id: 'belly', label: 'I carry weight around my midsection', scores: { metabolic: 1 } },
    { id: 'none', label: 'None of these', scores: { metabolic: 0 }, exclusive: true },
  ],
};

export const q_metabolic_4: Question = {
  id: 'q_metabolic_4',
  text: 'How would you describe your relationship with food and energy?',
  type: 'single-select',
  branch: 'metabolic',
  answers: [
    { id: 'fine', label: 'I eat well and feel good \u2014 just want to optimize', scores: { metabolic: 1 } },
    { id: 'reactive', label: 'My energy and mood feel very tied to what I eat', scores: { metabolic: 2 } },
    { id: 'frustrated', label: "I'm frustrated \u2014 I feel like my metabolism is working against me", scores: { metabolic: 3 } },
  ],
};

// ─── Triage Path ────────────────────────────────────────────────────────────

export const q_triage_1: Question = {
  id: 'q_triage_1',
  text: "No worries \u2014 let's figure it out together. Which of these bother you the most?",
  subtext: 'Pick up to 3.',
  type: 'multi-select',
  maxSelect: 3,
  branch: 'triage',
  answers: [
    { id: 'bloating', label: 'Bloating or digestive issues', scores: { gut: 3 } },
    { id: 'fatigue', label: 'Constant fatigue or burnout', scores: { stress: 2, longevity: 1 } },
    { id: 'sick-often', label: 'Getting sick too often', scores: { immune: 3 } },
    { id: 'brain-fog', label: "Brain fog or feeling \"off\"", scores: { liver: 2, longevity: 1 } },
    { id: 'hormonal', label: 'PMS, hot flashes, or hormonal symptoms', scores: { hormone: 3 } },
    { id: 'aging', label: "Feeling like you're aging faster than you should", scores: { longevity: 3 } },
    { id: 'cravings', label: 'Sugar cravings or energy crashes', scores: { metabolic: 3 } },
    { id: 'skin', label: 'Skin problems (breakouts, rashes, dullness)', scores: { liver: 2 } },
    { id: 'sleep', label: 'Sleep problems', scores: { stress: 3 } },
    { id: 'inflammation', label: 'Joint pain or chronic inflammation', scores: { longevity: 2 } },
  ],
};

export const q_triage_2: Question = {
  id: 'q_triage_2',
  text: 'If you could change one thing about how you feel day-to-day, what would it be?',
  type: 'single-select',
  branch: 'triage',
  answers: [
    { id: 'energy', label: 'More steady energy', scores: { stress: 2, metabolic: 1 } },
    { id: 'digestion', label: 'Better digestion', scores: { gut: 3 } },
    { id: 'calm', label: 'Less stress and more calm', scores: { stress: 3 } },
    { id: 'clarity', label: 'Sharper thinking and focus', scores: { longevity: 2, liver: 1 } },
    { id: 'resilience', label: 'Stronger immunity', scores: { immune: 3 } },
    { id: 'balance', label: 'Hormonal balance', scores: { hormone: 3 } },
    { id: 'weight', label: 'Better metabolism', scores: { metabolic: 3 } },
  ],
};

// ─── Safety Gate Questions ──────────────────────────────────────────────────

export const q_safety_1: Question = {
  id: 'q_safety_1',
  text: 'Are you currently taking any prescription medications?',
  subtext: 'This helps us flag any important considerations for your results.',
  type: 'yes-no',
  answers: [
    { id: 'no', label: 'No', scores: {} },
    { id: 'yes', label: 'Yes', scores: {} },
  ],
};

export const q_safety_1a: Question = {
  id: 'q_safety_1a',
  text: 'Which type(s) of medication? This helps us make sure our suggestions are appropriate for you.',
  subtext: 'Select all that apply.',
  type: 'multi-select',
  answers: [
    { id: 'blood-sugar', label: 'Blood sugar medication (metformin, insulin, etc.)', scores: {} },
    { id: 'blood-thinners', label: 'Blood thinners (warfarin, aspirin, etc.)', scores: {} },
    { id: 'thyroid', label: 'Thyroid medication', scores: {} },
    { id: 'hormones', label: 'Hormone therapy (HRT, birth control)', scores: {} },
    { id: 'cholesterol', label: 'Cholesterol medication (statins)', scores: {} },
    { id: 'other', label: 'Other', scores: {} },
  ],
};

export const q_safety_2: Question = {
  id: 'q_safety_2',
  text: 'Are you currently pregnant or nursing?',
  type: 'single-select',
  answers: [
    { id: 'no', label: 'No', scores: {} },
    { id: 'yes', label: 'Yes', scores: {} },
    { id: 'trying', label: 'Trying to conceive', scores: {} },
  ],
};

// ─── All questions as a flat lookup ─────────────────────────────────────────

export const ALL_QUESTIONS: Question[] = [
  q1, q2, q3,
  q_gut_1, q_gut_2, q_gut_3, q_gut_4,
  q_stress_1, q_stress_2, q_stress_3, q_stress_4,
  q_immune_1, q_immune_2, q_immune_3,
  q_detox_1, q_detox_2, q_detox_3, q_detox_4,
  q_hormone_1, q_hormone_2, q_hormone_3, q_hormone_4,
  q_longevity_1, q_longevity_2, q_longevity_3, q_longevity_4,
  q_metabolic_1, q_metabolic_2, q_metabolic_3, q_metabolic_4,
  q_triage_1, q_triage_2,
  q_safety_1, q_safety_1a, q_safety_2,
];

/** Branch question sets keyed by Q1 answer */
export const BRANCH_QUESTIONS: Record<string, string[]> = {
  gut: ['q_gut_1', 'q_gut_2', 'q_gut_3', 'q_gut_4'],
  stress: ['q_stress_1', 'q_stress_2', 'q_stress_3', 'q_stress_4'],
  immune: ['q_immune_1', 'q_immune_2', 'q_immune_3'],
  detox: ['q_detox_1', 'q_detox_2', 'q_detox_3', 'q_detox_4'],
  hormones: ['q_hormone_1', 'q_hormone_2', 'q_hormone_3', 'q_hormone_4'],
  longevity: ['q_longevity_1', 'q_longevity_2', 'q_longevity_3', 'q_longevity_4'],
  metabolic: ['q_metabolic_1', 'q_metabolic_2', 'q_metabolic_3', 'q_metabolic_4'],
  unsure: ['q_triage_1', 'q_triage_2'],
};

/** Map from Q1 answer to the BundleKey used for triage abbreviated branch routing */
export const GOAL_TO_BUNDLE_KEY: Record<string, string> = {
  gut: 'gut',
  stress: 'stress',
  immune: 'immune',
  detox: 'liver',
  hormones: 'hormone',
  longevity: 'longevity',
  metabolic: 'metabolic',
};

/** For triage abbreviated path: first 2 questions per branch */
export const ABBREVIATED_BRANCH: Record<string, string[]> = {
  gut: ['q_gut_1', 'q_gut_2'],
  stress: ['q_stress_1', 'q_stress_2'],
  immune: ['q_immune_1', 'q_immune_2'],
  liver: ['q_detox_1', 'q_detox_2'],
  hormone: ['q_hormone_1', 'q_hormone_2'],
  longevity: ['q_longevity_1', 'q_longevity_2'],
  metabolic: ['q_metabolic_1', 'q_metabolic_2'],
};
