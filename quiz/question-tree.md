# Supplement Quiz: Question Tree & Branching Logic

## 1. Research Findings Summary

### Competitor Analysis

| Brand | Questions | Time | Key UX Pattern |
|-------|-----------|------|----------------|
| Care/of | ~15-20 | 5 min | Goal-first routing, science badges on results, visual cards |
| Persona | ~20-25 | 5 min | Gender-adaptive branching, medical advisory review, progress bar |
| Rootine | 32-33 | 8+ min | Longest quiz; back-arrow navigation, explanatory text at every step |
| HUM Nutrition | ~10-12 | 3 min | Step counter, personal health coach on results page |
| Feals | 3 | <1 min | Ultra-short for single-product brand, high completion |

### Engagement Best Practices

**Optimal length:** 7-10 questions hit the sweet spot. Completion rates hold at ~85% through 7 questions, then drop sharply after question 10. For our quiz with branching, the user will answer 8-10 questions total (5 core + 3-5 branch-specific).

**Completion rate benchmarks:** 65-80% of people who click "start" will finish a well-designed quiz. Conditional branching (showing only relevant questions) boosted completion from 45% to 67% in one study.

**Mobile-first:** 60% of quiz traffic comes from mobile. Every extra second of load time costs 7% completion.

**Progress indicators:** "3 of 8" outperforms "37%" -- people parse concrete counts better than percentages.

**Email capture timing:** Placing email collection at the results gate (not mid-quiz) avoids mid-funnel drop-off. We collect email to "send your results" after they see their recommendation.

### Psychological Principles Applied

1. **Progressive disclosure:** Start with easy, non-threatening questions (goal, age). Save sensitive topics (medications, diagnoses) for after commitment is established.
2. **Commitment/consistency:** Once someone answers 2-3 questions, they feel invested and are more likely to finish (sunk-cost engagement).
3. **IKEA effect:** The more input people give, the more they value the output. Branch-specific questions make users feel "this is really about ME."
4. **Autonomy/validation:** Every question should feel like "tell me about you" not "answer this clinical intake form." Phrasing matters enormously.
5. **Warm authority:** Dr. Nischal's voice -- knowledgeable but never cold. Second person. Gentle confidence.

### Design Decisions

- **Total questions per user:** 8-10 (5 universal + 3-5 branch-specific)
- **Estimated completion time:** 2-3 minutes
- **Question types:** Visual single-select cards (primary), multi-select with limit (secondary), yes/no toggles (safety gates)
- **Branching model:** Goal-first routing with a "not sure" symptom triage path
- **No slider controls:** Sliders are imprecise on mobile and create accessibility issues. Use descriptive card options instead.

---

## 2. Quiz Flow Overview

```
START
  |
  v
[Q1] Welcome + Primary Goal  -----> routes to one of 7 branches (or "not sure" triage)
  |
  v
[Q2] Age Range
  |
  v
[Q3] Biological Sex  -----------> gates Women's Hormone path (only if female/AFAB)
  |
  v
[Q4] Branch-specific Q1
  |
  v
[Q5] Branch-specific Q2
  |
  v
[Q6] Branch-specific Q3
  |
  v
[Q7] Branch-specific Q4 (conditional — some branches have 3, some 4-5)
  |
  v
[Q8] Prescription Medications? (safety gate)
  |                |
  | (yes)          | (no)
  v                |
[Q8a] Med type     |
  |                |
  v <--------------+
  |
[Q9] Pregnant/Nursing? (if female/AFAB, else skip)
  |
  v
[Q10] Email capture + "See Your Results"
  |
  v
RESULTS PAGE
```

**Total questions seen by a typical user:**
- Male user: 8-9 questions (skip Q9)
- Female user selecting Hormones path: 10 questions (longest path)
- "Not sure" user: 9-11 questions (triage adds 1-2 questions, then routes to a branch with 2-3 follow-ups)

---

## 3. Universal Questions (Everyone Answers)

### Q1 — Primary Health Goal

> **What's bringing you here today?**
>
> *Pick the area that feels most pressing right now.*

| Option | Label | Icon Suggestion | Routes To | Primary Bundle Score |
|--------|-------|-----------------|-----------|---------------------|
| `gut` | Digestive comfort | Stomach/leaf | Gut branch | GI Restore +3 |
| `stress` | Stress & energy | Battery/sun | Stress branch | Adrenal Resilience +3 |
| `immune` | Immune strength | Shield | Immune branch | Immune Defense +3 |
| `detox` | Detox & cleansing | Droplet/leaf | Detox branch | Liver Detox +3 |
| `hormones` | Hormone balance | Wave/cycle | Hormone branch | Women's Hormone +3 |
| `longevity` | Healthy aging & vitality | Sparkle/cell | Longevity branch | Cellular Vitality +3 |
| `metabolic` | Blood sugar & metabolism | Flame/gauge | Metabolic branch | Metabolic Support +3 |
| `unsure` | I'm not sure -- help me figure it out | Compass | Triage path | (none yet) |

**Type:** Single-select visual cards (large, tappable, with icon + label)
**UX note:** Cards should be in a 2-column grid on mobile, 4-column on desktop. The "not sure" option should be visually distinct (different card style, placed last and full-width).

---

### Q2 — Age Range

> **What's your age range?**
>
> *This helps us consider what your body needs at this stage of life.*

| Option | Label | Scoring Effect |
|--------|-------|---------------|
| `18-29` | 18-29 | Immune Defense +1 |
| `30-39` | 30-39 | Adrenal Resilience +1 |
| `40-49` | 40-49 | Women's Hormone +1, Cellular Vitality +1 |
| `50-59` | 50-59 | Cellular Vitality +2, Metabolic Support +1 |
| `60+` | 60+ | Cellular Vitality +2, Immune Defense +1 |

**Type:** Single-select horizontal pills
**UX note:** Subtitle text reassures user why we're asking -- reduces "why do you need this?" friction.

---

### Q3 — Biological Sex

> **What sex were you assigned at birth?**
>
> *We ask because hormone and nutrient needs can differ significantly.*

| Option | Label | Effect |
|--------|-------|--------|
| `female` | Female | Unlocks hormone branch eligibility; shows Q9 (pregnancy) |
| `male` | Male | Blocks hormone branch; skips Q9 |
| `prefer-not` | Prefer not to say | Treats as neutral; skips Q9; hormone branch available but not auto-routed |

**Type:** Single-select cards
**UX note:** If user selected `hormones` in Q1 but answers `male` in Q3, show a brief interstitial: *"Our Hormone Balance bundle is formulated for estrogen-related concerns. Based on your answers, we think these might be a better fit for you..."* and re-route to the top-scoring alternative branch (likely Adrenal Resilience or Cellular Vitality). Add +2 to the next-highest bundle.

---

## 4. Branch-Specific Questions

### GUT HEALTH BRANCH (q_gut_1 through q_gut_4)

#### q_gut_1

> **How often do you experience bloating or digestive discomfort?**

| Option | Label | Scores |
|--------|-------|--------|
| `rarely` | Rarely -- my digestion is mostly fine | GI Restore +0 |
| `weekly` | A few times a week | GI Restore +1 |
| `daily` | Most days | GI Restore +2 |
| `after-meals` | Almost every time I eat | GI Restore +3 |

**Type:** Single-select cards

#### q_gut_2

> **Do any of these sound familiar?**
>
> *Select all that apply.*

| Option | Label | Scores |
|--------|-------|--------|
| `food-sensitivity` | Certain foods just don't agree with me anymore | GI Restore +1 |
| `antibiotics` | I've taken antibiotics in the past year | GI Restore +1 |
| `irregularity` | My digestion is unpredictable day to day | GI Restore +1 |
| `diagnosed` | I've been told I have IBS, SIBO, or leaky gut | GI Restore +2 |
| `none` | None of these | GI Restore +0 |

**Type:** Multi-select checkboxes (selecting "None" clears others)

#### q_gut_3

> **How would you describe your energy after meals?**

| Option | Label | Scores |
|--------|-------|--------|
| `fine` | I feel fine -- meals don't really affect my energy | GI Restore +0 |
| `sluggish` | I often feel sluggish or heavy after eating | GI Restore +1, Metabolic Support +1 |
| `bloat-crash` | Bloated and tired -- like my body is working overtime | GI Restore +2 |

**Type:** Single-select cards

#### q_gut_4

> **Have you tried probiotics or digestive enzymes before?**

| Option | Label | Scores |
|--------|-------|--------|
| `never` | No, this would be new for me | GI Restore +1 |
| `some-help` | Yes, and they helped a little | GI Restore +2 |
| `no-help` | Yes, but they didn't make a difference | GI Restore +2 |
| `currently` | Yes, I'm taking some now but want something better | GI Restore +3 |

**Type:** Single-select cards

---

### STRESS & ADRENAL BRANCH (q_stress_1 through q_stress_4)

#### q_stress_1

> **Which best describes your energy pattern most days?**

| Option | Label | Scores |
|--------|-------|--------|
| `wired-tired` | Wired but tired -- my mind races but my body is exhausted | Adrenal Resilience +3 |
| `flat` | Flat and drained -- I struggle to get going | Adrenal Resilience +2, Cellular Vitality +1 |
| `rollercoaster` | Up and down -- I crash hard in the afternoon | Adrenal Resilience +2, Metabolic Support +1 |
| `mostly-ok` | Mostly steady -- I'm looking for an edge | Adrenal Resilience +1 |

**Type:** Single-select cards

#### q_stress_2

> **How's your sleep these days?**

| Option | Label | Scores |
|--------|-------|--------|
| `fine` | I sleep well most nights | Adrenal Resilience +0 |
| `fall-asleep` | I have trouble falling asleep | Adrenal Resilience +2 |
| `stay-asleep` | I fall asleep fine but wake up at 2-3 AM | Adrenal Resilience +3 |
| `both` | Both -- falling asleep AND staying asleep are hard | Adrenal Resilience +3 |

**Type:** Single-select cards
**UX note:** The 2-3 AM waking pattern is a classic cortisol dysregulation signal. This question doubles as education.

#### q_stress_3

> **How long have you been feeling this way?**

| Option | Label | Scores |
|--------|-------|--------|
| `recent` | It's fairly new -- the last few weeks | Adrenal Resilience +1 |
| `months` | Several months | Adrenal Resilience +2 |
| `year-plus` | Over a year -- it's become my normal | Adrenal Resilience +3 |

**Type:** Single-select cards

#### q_stress_4

> **Do you rely on caffeine to get through the day?**

| Option | Label | Scores |
|--------|-------|--------|
| `no` | Not really -- I can take it or leave it | Adrenal Resilience +0 |
| `moderate` | I need my morning coffee but that's it | Adrenal Resilience +1 |
| `heavy` | Multiple cups, and I still feel drained | Adrenal Resilience +2 |
| `anxious` | Caffeine makes me jittery or anxious now | Adrenal Resilience +3 |

**Type:** Single-select cards

---

### IMMUNE BRANCH (q_immune_1 through q_immune_3)

#### q_immune_1

> **How often do you tend to get sick?**

| Option | Label | Scores |
|--------|-------|--------|
| `rarely` | Rarely -- maybe once a year or less | Immune Defense +1 |
| `few` | A few times a year -- more than I'd like | Immune Defense +2 |
| `often` | It feels like I catch everything going around | Immune Defense +3 |

**Type:** Single-select cards

#### q_immune_2

> **When you do get sick, how quickly do you bounce back?**

| Option | Label | Scores |
|--------|-------|--------|
| `fast` | Pretty quickly -- a few days and I'm fine | Immune Defense +0 |
| `slow` | It lingers -- I'm not fully right for a week or more | Immune Defense +2 |
| `very-slow` | It takes me out for a long time, or it comes in waves | Immune Defense +3 |

**Type:** Single-select cards

#### q_immune_3

> **Any of these apply to you?**
>
> *Select all that apply.*

| Option | Label | Scores |
|--------|-------|--------|
| `seasonal` | I struggle more during certain seasons | Immune Defense +1 |
| `autoimmune` | I have an autoimmune condition | Immune Defense +1, Liver Detox +1 |
| `travel` | I travel frequently or am around crowds often | Immune Defense +1 |
| `chronic` | I deal with chronic low-grade inflammation | Immune Defense +1, Cellular Vitality +1 |
| `none` | None of these | Immune Defense +0 |

**Type:** Multi-select checkboxes

---

### LIVER DETOX BRANCH (q_detox_1 through q_detox_4)

#### q_detox_1

> **Do any of these ring true for you?**
>
> *Select all that apply.*

| Option | Label | Scores |
|--------|-------|--------|
| `brain-fog` | Brain fog or mental cloudiness | Liver Detox +1, Cellular Vitality +1 |
| `skin` | Skin issues (acne, rashes, dullness) | Liver Detox +2 |
| `chemical` | Sensitivity to chemicals, fragrances, or fumes | Liver Detox +2 |
| `fatigue` | Unexplained fatigue even with enough sleep | Liver Detox +1, Adrenal Resilience +1 |
| `none` | None of these | Liver Detox +0 |

**Type:** Multi-select checkboxes

#### q_detox_2

> **How often do you consume alcohol?**

| Option | Label | Scores |
|--------|-------|--------|
| `never` | Rarely or never | Liver Detox +0 |
| `social` | Socially -- a few times a month | Liver Detox +1 |
| `regular` | A few times a week | Liver Detox +2 |
| `daily` | Most days | Liver Detox +3 |

**Type:** Single-select cards
**UX note:** No judgment in the phrasing. This is clinical data, not a morality test.

#### q_detox_3

> **Have you ever had known exposure to mold, heavy metals, or environmental toxins?**

| Option | Label | Scores |
|--------|-------|--------|
| `yes` | Yes, or I suspect so | Liver Detox +3 |
| `unsure` | I'm not sure | Liver Detox +1 |
| `no` | No | Liver Detox +0 |

**Type:** Single-select cards

#### q_detox_4

> **How would you describe your body's "reset" ability?**

| Option | Label | Scores |
|--------|-------|--------|
| `good` | I bounce back well from indulgences or late nights | Liver Detox +0 |
| `slow` | It takes me a day or two to feel right again | Liver Detox +1 |
| `poor` | My body seems to hold onto everything -- I feel sluggish a lot | Liver Detox +2 |

**Type:** Single-select cards

---

### WOMEN'S HORMONE BRANCH (q_hormone_1 through q_hormone_4)

**Gate:** Only shown if Q3 = `female` or `prefer-not`. If Q3 = `male`, re-route (see Q3 notes).

#### q_hormone_1

> **Where are you in your hormonal journey?**

| Option | Label | Scores |
|--------|-------|--------|
| `cycling` | Still having regular periods | Women's Hormone +1 |
| `irregular` | Periods are becoming irregular or unpredictable | Women's Hormone +2 |
| `peri` | Perimenopause (symptoms starting, periods shifting) | Women's Hormone +3 |
| `post` | Menopause or post-menopause | Women's Hormone +3, Cellular Vitality +1 |

**Type:** Single-select cards

#### q_hormone_2

> **Which of these do you experience?**
>
> *Select all that apply.*

| Option | Label | Scores |
|--------|-------|--------|
| `pms` | PMS -- mood swings, irritability, cravings before your period | Women's Hormone +2 |
| `cramps` | Painful cramps or heavy periods | Women's Hormone +2 |
| `hot-flashes` | Hot flashes or night sweats | Women's Hormone +2 |
| `hair` | Hair thinning or changes in hair/skin | Women's Hormone +1 |
| `mood` | Mood changes that feel hormone-driven | Women's Hormone +1, Adrenal Resilience +1 |
| `none` | None of these | Women's Hormone +0 |

**Type:** Multi-select checkboxes

#### q_hormone_3

> **How much do these symptoms affect your daily life?**

| Option | Label | Scores |
|--------|-------|--------|
| `minor` | They're annoying but manageable | Women's Hormone +1 |
| `moderate` | They disrupt my routine several days a month | Women's Hormone +2 |
| `significant` | They significantly impact my quality of life | Women's Hormone +3 |

**Type:** Single-select cards

#### q_hormone_4

> **Have you tried hormone-related supplements before?**

| Option | Label | Scores |
|--------|-------|--------|
| `no` | No, this is new territory for me | Women's Hormone +1 |
| `some` | I've tried a few things with mixed results | Women's Hormone +2 |
| `looking` | Yes, and I'm looking for something more comprehensive | Women's Hormone +3 |

**Type:** Single-select cards

---

### CELLULAR VITALITY / LONGEVITY BRANCH (q_longevity_1 through q_longevity_4)

#### q_longevity_1

> **What's motivating your interest in healthy aging?**

| Option | Label | Scores |
|--------|-------|--------|
| `proactive` | I'm being proactive -- I want to age well | Cellular Vitality +2 |
| `noticing` | I'm noticing changes -- less energy, slower recovery, foggy thinking | Cellular Vitality +3 |
| `family` | Family history has me paying attention | Cellular Vitality +2 |

**Type:** Single-select cards

#### q_longevity_2

> **Which of these concerns resonate with you?**
>
> *Select all that apply.*

| Option | Label | Scores |
|--------|-------|--------|
| `cognitive` | Mental sharpness -- memory, focus, clarity | Cellular Vitality +1, Adrenal Resilience +1 |
| `joints` | Joint comfort and mobility | Cellular Vitality +2 |
| `inflammation` | Chronic aches or inflammation | Cellular Vitality +2 |
| `cardiovascular` | Heart and cardiovascular health | Cellular Vitality +1 |
| `none` | None specifically -- I just want to stay ahead of it | Cellular Vitality +1 |

**Type:** Multi-select checkboxes

#### q_longevity_3

> **How active are you?**

| Option | Label | Scores |
|--------|-------|--------|
| `sedentary` | Not very -- I'd like to be more active | Cellular Vitality +1, Metabolic Support +1 |
| `moderate` | Moderately active -- I move a few times a week | Cellular Vitality +1 |
| `active` | Very active -- I exercise regularly | Cellular Vitality +2 |

**Type:** Single-select cards

#### q_longevity_4

> **Are you interested in NAD+ or longevity-specific nutrients?**
>
> *NAD+ supports cellular energy and repair -- it naturally declines with age.*

| Option | Label | Scores |
|--------|-------|--------|
| `yes` | Yes, I've been reading about this | Cellular Vitality +3 |
| `curious` | I'm curious -- tell me more on the results page | Cellular Vitality +2 |
| `new` | This is all new to me | Cellular Vitality +1 |

**Type:** Single-select cards
**UX note:** The subtitle provides just enough education to make the question accessible without overwhelming.

---

### METABOLIC SUPPORT BRANCH (q_metabolic_1 through q_metabolic_4)

#### q_metabolic_1

> **How would you describe your energy between meals?**

| Option | Label | Scores |
|--------|-------|--------|
| `stable` | Pretty steady -- I don't think about it much | Metabolic Support +0 |
| `dips` | I get noticeable energy dips, especially mid-afternoon | Metabolic Support +2 |
| `crashes` | I crash hard if I don't eat on time | Metabolic Support +3 |

**Type:** Single-select cards

#### q_metabolic_2

> **Do you experience sugar or carb cravings?**

| Option | Label | Scores |
|--------|-------|--------|
| `rarely` | Not really | Metabolic Support +0 |
| `sometimes` | Sometimes, especially in the afternoon or evening | Metabolic Support +1 |
| `strong` | Strong cravings that feel hard to control | Metabolic Support +3 |

**Type:** Single-select cards

#### q_metabolic_3

> **Any of these apply to you?**
>
> *Select all that apply.*

| Option | Label | Scores |
|--------|-------|--------|
| `pcos` | I've been diagnosed with PCOS or insulin resistance | Metabolic Support +3 |
| `weight` | I struggle with weight despite eating reasonably well | Metabolic Support +2 |
| `a1c` | My doctor has mentioned blood sugar or A1C concerns | Metabolic Support +3 |
| `belly` | I carry weight around my midsection | Metabolic Support +1 |
| `none` | None of these | Metabolic Support +0 |

**Type:** Multi-select checkboxes

#### q_metabolic_4

> **How would you describe your relationship with food and energy?**

| Option | Label | Scores |
|--------|-------|--------|
| `fine` | I eat well and feel good -- just want to optimize | Metabolic Support +1 |
| `reactive` | My energy and mood feel very tied to what I eat | Metabolic Support +2 |
| `frustrated` | I'm frustrated -- I feel like my metabolism is working against me | Metabolic Support +3 |

**Type:** Single-select cards

---

### "NOT SURE" TRIAGE PATH (q_triage_1 through q_triage_2)

When user selects "I'm not sure -- help me figure it out" in Q1, they get symptom-based triage questions that map symptoms to branches.

#### q_triage_1

> **No worries -- let's figure it out together. Which of these bother you the most?**
>
> *Pick up to 3.*

| Option | Label | Scores |
|--------|-------|--------|
| `bloating` | Bloating or digestive issues | GI Restore +3 |
| `fatigue` | Constant fatigue or burnout | Adrenal Resilience +2, Cellular Vitality +1 |
| `sick-often` | Getting sick too often | Immune Defense +3 |
| `brain-fog` | Brain fog or feeling "off" | Liver Detox +2, Cellular Vitality +1 |
| `hormonal` | PMS, hot flashes, or hormonal symptoms | Women's Hormone +3 |
| `aging` | Feeling like you're aging faster than you should | Cellular Vitality +3 |
| `cravings` | Sugar cravings or energy crashes | Metabolic Support +3 |
| `skin` | Skin problems (breakouts, rashes, dullness) | Liver Detox +2 |
| `sleep` | Sleep problems | Adrenal Resilience +3 |
| `inflammation` | Joint pain or chronic inflammation | Cellular Vitality +2 |

**Type:** Multi-select visual cards with icons (max 3 selections enforced)

#### q_triage_2

> **If you could change one thing about how you feel day-to-day, what would it be?**

| Option | Label | Scores |
|--------|-------|--------|
| `energy` | More steady energy | Adrenal Resilience +2, Metabolic Support +1 |
| `digestion` | Better digestion | GI Restore +3 |
| `calm` | Less stress and more calm | Adrenal Resilience +3 |
| `clarity` | Sharper thinking and focus | Cellular Vitality +2, Liver Detox +1 |
| `resilience` | Stronger immunity | Immune Defense +3 |
| `balance` | Hormonal balance | Women's Hormone +3 |
| `weight` | Better metabolism | Metabolic Support +3 |

**Type:** Single-select visual cards

**After q_triage_2:** Calculate which bundle has the highest cumulative score. Route the user to the top 2 branch-specific questions for that bundle (skip to q_[branch]_1 and q_[branch]_2 only -- abbreviated path to avoid fatigue).

If Q3 = `male` and the top-scoring bundle is Women's Hormone, take the second-highest bundle instead.

---

## 5. Safety Gate Questions (End of Quiz)

### Q_safety_1 — Medications

> **Are you currently taking any prescription medications?**
>
> *This helps us flag any important considerations for your results.*

| Option | Label | Effect |
|--------|-------|--------|
| `no` | No | Skip to Q_safety_2 or results |
| `yes` | Yes | Show Q_safety_1a |

**Type:** Yes/No toggle cards

### Q_safety_1a — Medication Type (conditional: only if Q_safety_1 = yes)

> **Which type(s) of medication? This helps us make sure our suggestions are appropriate for you.**
>
> *Select all that apply.*

| Option | Label | Results Flag |
|--------|-------|-------------|
| `blood-sugar` | Blood sugar medication (metformin, insulin, etc.) | Flag on Metabolic Support results |
| `blood-thinners` | Blood thinners (warfarin, aspirin, etc.) | Flag on all bundles containing omega/turmeric |
| `thyroid` | Thyroid medication | Flag on Women's Hormone results |
| `hormones` | Hormone therapy (HRT, birth control) | Flag on Women's Hormone results |
| `cholesterol` | Cholesterol medication (statins) | Flag on Cellular Vitality results |
| `other` | Other | General "consult your provider" note |

**Type:** Multi-select checkboxes
**UX note:** This does NOT change the recommendation -- it adds a safety disclaimer to the results page: *"Because you're taking [medication type], we recommend discussing these supplements with your healthcare provider before starting."*

### Q_safety_2 — Pregnancy (conditional: only if Q3 = female)

> **Are you currently pregnant or nursing?**

| Option | Label | Effect |
|--------|-------|--------|
| `no` | No | Proceed to results |
| `yes` | Yes | Add prominent safety banner to results |
| `trying` | Trying to conceive | Add safety note to results |

**Type:** Single-select cards
**Results effect:** If `yes` or `trying`, results page shows: *"Congratulations! Because you're pregnant/nursing/trying to conceive, please consult your healthcare provider before starting any new supplement regimen. Dr. Nischal is available for a personalized consultation to discuss what's safe and beneficial for you right now."* Include consultation CTA.

---

## 6. Scoring System

### Bundle Score Accumulation

Each answer adds points to one or more bundle scores. By the end of the quiz, every user has a score array:

```
{
  gi_restore: 0,
  adrenal_resilience: 0,
  immune_defense: 0,
  liver_detox: 0,
  womens_hormone: 0,
  cellular_vitality: 0,
  metabolic_support: 0
}
```

### Score Ranges and Confidence

| Total Score for Top Bundle | Confidence | Results Messaging |
|---------------------------|------------|-------------------|
| 8+ | High | "Based on your answers, we have a strong recommendation for you." |
| 5-7 | Medium | "Here's what we'd suggest as a great starting point." |
| 1-4 | Low | "Based on what you've shared, here's where we'd start." |

### Weight Rationale

- **Q1 (primary goal):** +3 to chosen bundle. This is the strongest signal -- the user literally told us what they want.
- **Branch-specific questions:** +1 to +3 each. These confirm and refine the initial signal.
- **Q2 (age):** +1 to +2. Gentle demographic nudge -- not deterministic.
- **Cross-bundle scores:** Some answers score toward multiple bundles (e.g., brain fog scores toward both Liver Detox and Cellular Vitality). This is intentional -- it surfaces secondary recommendations.

### Tie-Breaking Rules

1. **Primary goal wins:** If there's a tie and one of the tied bundles matches the Q1 selection, that bundle wins.
2. **Recency wins:** If tie persists, the bundle that received points from the most recent question wins (later answers reflect more considered thought).
3. **Lower price wins:** If still tied, recommend the lower-priced bundle (lower barrier to entry).

---

## 7. Results Page Logic

### Primary Recommendation

Show the highest-scoring bundle as the hero recommendation with:
- Bundle name and description
- What's included (product list with brief descriptions)
- Price
- "Add to Cart" CTA
- Expandable "Why we recommend this for you" section that references their specific answers

### Secondary Recommendation

If a second bundle scores within 3 points of the top bundle, show it as:
> *"You might also benefit from..."*

Show it in a smaller card below the primary recommendation.

### Tertiary Mention

If a third bundle scores within 5 points:
> *"Some of your answers also suggest..."*

Single-line mention with link to learn more.

### Safety Disclaimers

Displayed contextually based on Q_safety_1a and Q_safety_2 answers (see Section 5).

### Consultation CTA

Always present at bottom of results:
> *"Want a deeper dive? Book a consultation with Dr. Nischal to discuss a personalized protocol tailored to your unique needs."*

---

## 8. Edge Cases

### Male user selects "Hormone balance" in Q1
- Q3 reveals male sex
- Interstitial message explains Women's Hormone bundle is estrogen-focused
- System takes the +3 from Q1 and redistributes: +2 to next-highest bundle, +1 to third-highest
- Routes to the branch of the next-highest bundle
- User never sees hormone-specific questions

### All scores are very low (max < 4)
- This can happen if a user selects very mild answers throughout
- Results messaging: *"Your answers suggest you're in a pretty good place overall. Here's a gentle starting point to help you stay there."*
- Recommend Cellular Vitality (longevity/maintenance framing) or Immune Defense (universal appeal, lowest price point at $103)

### User selects "None" on all multi-select questions
- Treat as low-confidence; rely more heavily on Q1 signal
- Results lean on the Q1-selected bundle with moderate confidence messaging

### Multiple bundles tied at high scores
- Likely means user has overlapping concerns (e.g., stress + gut issues)
- Show both as co-primary recommendations: *"Your answers point to two areas that often go hand-in-hand..."*
- Consider showing a "Build Your Own" option if >2 bundles are tied

### Pregnancy + high-scoring bundle
- Never suppress the recommendation
- Always add the safety banner (see Q_safety_2)
- Add consultation CTA as primary action instead of "Add to Cart"

### "Not sure" path + no clear winner after triage
- If no bundle exceeds score 4 after triage questions:
- Show top 3 bundles as equal options: *"Based on your answers, any of these could be a good starting point. Here's a quick look at each..."*
- Emphasize consultation CTA

---

## 9. UX Notes & Implementation Guidance

### Question Types Summary

| Type | Used For | Behavior |
|------|----------|----------|
| **Single-select cards** | Most questions | Large tappable cards with label. Selecting one auto-advances after 400ms delay (gives user time to see selection). |
| **Multi-select checkboxes** | "Select all that apply" questions | Checkboxes within cards. "None of these" clears all others. Explicit "Continue" button required. |
| **Yes/No toggles** | Safety gates (medications, pregnancy) | Two large cards side by side. |
| **Horizontal pills** | Age range | Compact single-row selector. |

### Progress Bar

- Format: "Question 3 of 9" (calculate total dynamically based on branch)
- Thin bar (4px) at top of quiz container using brand color `#2F3D4F`
- Bar should animate smoothly between questions

### Transitions

- Questions slide in from right, slide out to left (300ms ease)
- Back button available on all questions (slide in from left)
- No animation on first question load

### Mobile Considerations

- Cards stack to single column below 480px
- Minimum tap target: 48x48px
- Progress text scales down but never disappears
- Sticky "Continue" button at bottom for multi-select questions

### Intro Screen (Before Q1)

> **Your Personalized Wellness Assessment**
>
> *Answer a few quick questions and we'll recommend the right protocol for you. Takes about 2 minutes.*
>
> [Start My Assessment]

### Email Capture (After last question, before results)

> **Where should we send your results?**
>
> *We'll email you a summary of your personalized recommendation along with a special offer.*
>
> [Email input]
> [See My Results]
>
> *Skip -- just show me my results* (small text link below)

**UX note:** Email is optional. The skip link should be clearly visible but visually secondary. Even without email, the quiz is valuable as a conversion tool since they land on a product recommendation page.

### Loading/Calculation Screen (Between email and results)

Show for 2-3 seconds with animated progress:
> *"Analyzing your responses..."*
> *"Matching you with the right protocol..."*
> *"Preparing your personalized recommendation..."*

**UX note:** This artificial delay is intentional. It signals that real computation is happening, which increases perceived value of the result (the IKEA effect -- they invested time, now the system is "working hard" for them).

---

## 10. Complete Question ID Reference

| ID | Question | Branch | Type |
|----|----------|--------|------|
| `intro` | Welcome screen | Universal | Screen |
| `q1` | Primary health goal | Universal | Single-select cards |
| `q2` | Age range | Universal | Horizontal pills |
| `q3` | Biological sex | Universal | Single-select cards |
| `q_gut_1` | Bloating frequency | Gut | Single-select cards |
| `q_gut_2` | Digestive history | Gut | Multi-select |
| `q_gut_3` | Post-meal energy | Gut | Single-select cards |
| `q_gut_4` | Supplement history | Gut | Single-select cards |
| `q_stress_1` | Energy pattern | Stress | Single-select cards |
| `q_stress_2` | Sleep quality | Stress | Single-select cards |
| `q_stress_3` | Duration of symptoms | Stress | Single-select cards |
| `q_stress_4` | Caffeine dependency | Stress | Single-select cards |
| `q_immune_1` | Illness frequency | Immune | Single-select cards |
| `q_immune_2` | Recovery speed | Immune | Single-select cards |
| `q_immune_3` | Immune factors | Immune | Multi-select |
| `q_detox_1` | Detox symptoms | Detox | Multi-select |
| `q_detox_2` | Alcohol frequency | Detox | Single-select cards |
| `q_detox_3` | Toxin exposure | Detox | Single-select cards |
| `q_detox_4` | Reset ability | Detox | Single-select cards |
| `q_hormone_1` | Hormonal stage | Hormones | Single-select cards |
| `q_hormone_2` | Hormone symptoms | Hormones | Multi-select |
| `q_hormone_3` | Symptom severity | Hormones | Single-select cards |
| `q_hormone_4` | Supplement history | Hormones | Single-select cards |
| `q_longevity_1` | Motivation | Longevity | Single-select cards |
| `q_longevity_2` | Aging concerns | Longevity | Multi-select |
| `q_longevity_3` | Activity level | Longevity | Single-select cards |
| `q_longevity_4` | NAD+ awareness | Longevity | Single-select cards |
| `q_metabolic_1` | Between-meal energy | Metabolic | Single-select cards |
| `q_metabolic_2` | Cravings | Metabolic | Single-select cards |
| `q_metabolic_3` | Metabolic factors | Metabolic | Multi-select |
| `q_metabolic_4` | Food-energy relationship | Metabolic | Single-select cards |
| `q_triage_1` | Symptom selection | Triage | Multi-select (max 3) |
| `q_triage_2` | Top priority | Triage | Single-select cards |
| `q_safety_1` | Medications | Safety | Yes/No |
| `q_safety_1a` | Medication type | Safety | Multi-select |
| `q_safety_2` | Pregnancy | Safety | Single-select cards |
| `email` | Email capture | Universal | Input + CTA |
| `loading` | Calculation screen | Universal | Screen |
| `results` | Results page | Universal | Screen |

---

## 11. Bundle Reference

| Bundle | Key | Products | Price |
|--------|-----|----------|-------|
| GI Restore Protocol | `gi_restore` | bio-spore, gi-rebuild, d-enzyme, fiber-fit, probiotic-100 | ~$284 |
| Adrenal Resilience Bundle | `adrenal_resilience` | n-adrenal, calm, mag-threonate, l-theanine | ~$189 |
| Immune Defense Protocol | `immune_defense` | immune, immune-pro, vita-c | ~$103 |
| Liver Detox Protocol | `liver_detox` | liver-sauce-1, detox-2, n-a-c, glutathione-cacao-mint | ~$156 |
| Women's Hormone Balance | `womens_hormone` | dim-cdg, estro-fem, menstracalm, hair-nails | ~$167 |
| Cellular Vitality | `cellular_vitality` | nad-gold, omega-capsules, turmeric, redox-u | ~$212 |
| Metabolic Support Protocol | `metabolic_support` | amp-k, inositol-blend, fiber-fit | ~$147 |
