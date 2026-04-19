# WHP Wellness Content Guide
## Voice, SEO, and Generative Engine Optimization — Unified Source of Truth

---

## Voice & Tone

**Who we sound like:** A trusted clinician with great bedside manner. Knowledgeable and precise, but never cold or academic. You'd feel comfortable asking this person a follow-up question.

**Person:** Second person ("you/your"). Never first person.

**Register:** Warm, measured, confident. Not bubbly, not clinical. Think: a doctor who explains things clearly because they respect your intelligence, not because they're dumbing it down.

**Emotional approach:** Normalize the reader's experience, then give them agency. Never fear-monger. Never hype.

### Word choices
**Use:** "support," "may help," "balance," "resilience," "consistent," "nourishing," "evidence suggests," "research indicates"

**Avoid:** "fix," "cure," "detox your body," "boost" (sparingly OK), "hack," "supercharge," "game-changer," "miracle," "breakthrough"

### Hedging + specificity (these work together)
Pair measured language with hard data. This builds trust AND makes content citable by AI engines.

**Yes:** "Ashwagandha may help support healthy cortisol levels — one randomized controlled trial found a 23% reduction in serum cortisol compared to placebo (Lopresti et al., 2019)."

**No:** "Ashwagandha may help support healthy cortisol levels." *(too vague — nothing for AI to cite)*

**No:** "Ashwagandha slashes cortisol by 23%!" *(hype, no hedging, no attribution)*

---

## Post Structure

Every blog post follows this structure. The order is intentional — it serves both AI extractability and human readability.

### 1. Quick Answer Box (40-80 words)
A self-contained, factual summary that directly answers the primary query. Include at least one specific statistic and one named citation. This is what AI engines extract and cite.

Set apart visually as a callout/summary box on the page.

**Example:**
> Berberine is a plant alkaloid that activates AMPK, the same metabolic pathway targeted by metformin. In a head-to-head trial, berberine 1g/day reduced HbA1c by 0.9% — statistically comparable to metformin 1.5g/day (Yin et al., 2008, *Metabolism*). It also supports healthy cholesterol and triglyceride levels.

### 2. Context and education (60-70% of the post)
The body of the post. Approachable but substantive. This is where the bedside manner lives.

- Explain the problem or topic in plain language
- Cover the science — mechanisms, pathways, what's happening in the body
- Lifestyle factors first (sleep, nutrition, movement, stress) before supplements
- Weave in statistics and citations naturally

### 3. Supplement section (last 30%)
- Frame as "adjunctive support, not a standalone solution"
- Link product names naturally — don't repeat excessively
- Explain what each product contributes and why
- If a bundle exists, introduce it as a curated protocol
- Include: "Talk with your healthcare provider before starting any new supplement routine."

### 4. Key Takeaways (3-5 bullets)
Short, scannable summary. Each bullet should be independently citable — include a stat or specific claim.

---

## Formatting Rules

### Headers
- **H1:** Post title (one per page)
- **H2:** Major sections, formatted as questions when possible ("What does berberine actually do?" not "Berberine overview")
- **H3:** Subsections within H2s

Question-format headers match how people query AI engines, which increases the chance of your content being the cited answer.

### Paragraphs
2-4 sentences max. One idea per paragraph.

### Lists and tables
Use generously. AI engines extract structured data more reliably than prose.
- Bullet lists for symptoms, steps, supplement descriptions
- Tables for comparisons ("DIM vs Calcium D-Glucarate," "GABA vs L-Theanine")
- Avoid walls of unbroken text

### Definitions
Define key terms explicitly near the top of the post or in the Quick Answer box. AI engines frequently cite definition statements.

**Example:** "N-Acetyl-L-Cysteine (NAC) is a precursor to glutathione, the body's primary intracellular antioxidant and a critical molecule in Phase II liver detoxification."

---

## Evidence & Citations

This is a core differentiator. Most supplement blogs make vague claims. We cite real research.

### Rules
- 3-8 named citations per post (author, year, journal)
- Link to PubMed when possible
- Include specific numbers: doses, effect sizes, sample sizes, p-values when relevant
- Integrate citations into prose — not just footnotes
- Prefer RCTs and meta-analyses over animal studies or observational data
- When evidence is weak, say so honestly ("preliminary research suggests," "animal studies indicate, though human data is limited")

### Honesty about dosing
If a product's dose is below what studies used, say so transparently. This builds trust and differentiates from brands that overpromise.

**Example:** "NAD+ Gold contains 50mg NMN as a supportive dose. Published human trials have used 250-500mg to measurably increase NAD+ levels. We include NMN as part of a broader cellular health approach — if your primary goal is NAD+ elevation, discuss higher-dose options with your practitioner."

---

## SEO Checklist (per post)

- [ ] Primary keyword selected (research volume + difficulty first)
- [ ] Primary keyword in H1, first 100 words, and 2-3 H2s
- [ ] 3-5 secondary/long-tail keywords woven naturally into body
- [ ] Meta title ≤60 characters (include primary keyword)
- [ ] Meta description ≤155 characters (include primary keyword + value prop)
- [ ] Alt text on all images (descriptive, include keyword where natural)
- [ ] Internal links to 2-3 related blog posts
- [ ] Internal links to relevant product pages
- [ ] Internal link to bundle page if applicable
- [ ] URL slug is clean and keyword-relevant
- [ ] Request indexing in GSC after publishing

**Do NOT:**
- Keyword-stuff or bold every keyword mention
- Write FAQ sections that just restate the article
- Use generic CTAs ("Learn more," "Click here," "Explore supplements")

---

## GEO Checklist (per post)

- [ ] Quick Answer box at the top (40-80 words, self-contained, citable)
- [ ] At least 3 specific statistics with named sources
- [ ] Key terms explicitly defined
- [ ] H2s formatted as questions matching AI queries
- [ ] Tables or structured comparisons for key content
- [ ] Author attribution: "Dr. Anita Nischal, Functional Medicine Practitioner"
- [ ] Article schema (JSON-LD) on the page
- [ ] FAQPage schema if post contains Q&A-structured sections
- [ ] "Last updated: [date]" visible on page
- [ ] Review and refresh every 3 months (AI engines have strong recency bias)

---

## Schema Markup (site-wide)

### Every blog post
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "author": {
    "@type": "Person",
    "name": "Dr. Anita Nischal",
    "jobTitle": "Functional Medicine Practitioner",
    "url": "https://www.whpwellness.com/the-team"
  },
  "datePublished": "...",
  "dateModified": "...",
  "headline": "...",
  "description": "..."
}
```

### FAQ sections within posts
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is berberine?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}
```

### Product pages (verify Wix auto-generates — supplement if needed)
- Product schema with name, price, availability, description, image

### Organization (site-wide, one instance)
- Organization schema with Dr. Nischal's credentials, practice info

---

## Dr. Nischal Author Page

Create or update a dedicated author page with:
- Full name and credentials
- Photo
- Practice history and specializations
- Brief bio written in third person
- Links to published content / blog posts
- This page should be linked from every blog post's author byline

AI engines weight author authority heavily. A strong author page with clear credentials increases citation likelihood across all content.

---

## Interlinking Strategy

### Bundle ↔ Blog ↔ Products
Every bundle has a companion blog post. Every blog post links to the bundle and individual products. This creates a tight content cluster that both search engines and AI engines can map.

```
Bundle page ←→ Blog post
     ↓               ↓
Product pages   Product pages
```

### Blog ↔ Blog cross-links (where topics overlap)
- Liver Detox ↔ Women's Hormone (estrogen metabolism is a liver function)
- Gut Health ↔ Immune (70% of immune system is in the gut)
- Stress/Adrenal ↔ Metabolic (cortisol affects blood sugar)
- Longevity ↔ Liver Detox (polyphenols support hepatic function)
- Stress/Adrenal ↔ Women's Hormone (cortisol and hormone interplay)

### Hub page
Create a "Learn" or "Research Library" page that links to all blog posts organized by health category. This helps AI engines map the full content network and understand topical authority.

---

## Supplement References — Compliance

### FDA/FTC rules (non-negotiable)
- **Structure/function claims ONLY** — "supports healthy cortisol levels" ✅
- **No disease claims** — "treats adrenal fatigue" ❌
- **No comparative drug claims** — "as effective as metformin" ❌ (even if the study says so — rephrase: "in one trial, berberine showed comparable HbA1c reduction to metformin")
- Include: "These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease."

### Drug interaction warnings
When a product has documented drug interactions (especially berberine, milk thistle, DIM), include a clear warning — not buried in fine print. This protects Dr. Nischal's reputation and is the right thing to do.

### Honest dosing
When a product's dose is below what clinical studies used, acknowledge it. Position as "supportive dose" vs "therapeutic dose." This builds more trust than pretending 50mg NMN is equivalent to 250mg.

---

## Content Refresh Schedule

| Action | Frequency |
|--------|-----------|
| Publish new blog posts | 2-4 per month |
| Update existing posts (stats, citations, "last updated" date) | Every 3 months |
| Check GSC for new indexing issues | Monthly |
| Review AI citation performance (search brand in ChatGPT/Perplexity) | Monthly |
| Refresh Quick Answer boxes with newer research | Every 3 months |
