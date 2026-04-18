# Ojus Growth OS

Agentic sales system for WHP Wellness / Ojus supplement line.

## Sales Loop

**Scout → Bundle → Create → Comply → Convert → Measure → Iterate**

Each stage is a Claude Code skill in `.agents/skills/`. Run them in sequence once the database is populated.

## Current State

| Layer | Status |
|---|---|
| Product catalog | 78 products in SQLite — names, prices, URLs, supplement facts image URLs |
| Ingredient data | Extracted via Claude Code into `supplement_facts.csv` (373 rows) and `supplement_instructions.csv` (78 rows) — **not yet loaded into DB** |
| Sales loop skills | All 7 skill definitions complete in `.agents/skills/` |
| Agent implementations | Phase 3 stubs in `agents/` — not yet built |
| API keys | Not configured |

## Setup

```bash
# 1. Copy env and add your keys
cp .env.example .env

# 2. Initialize the database
python database/init_db.py

# 3. Load ingredient data from CSVs into the database
python database/load_csvs.py       # see issue #3

# 4. (Optional) Re-run the scraper to refresh product data
pip install -r scraper/requirements.txt
python scraper/extract_products.py
```

## Structure

```
ojus/
├── .agents/skills/              — Claude Code skills for the sales loop
│   ├── ojus-scout.md            — weekly market intelligence (Tavily + Brave)
│   ├── ojus-bundle.md           — bundle design from scout output
│   ├── ojus-page.md             — product/bundle page copy (FTC-compliant)
│   ├── ojus-comply.md           — FTC compliance check layer (NEMO)
│   ├── ojus-audit.md            — Playwright site audit
│   ├── ojus-measure.md          — weekly KPI email (GA4 + Wix Stores)
│   └── ojus-quiz.md             — personalized recommendation quiz (pending)
├── agents/                      — Python agent implementations (Phase 3 stubs)
├── scraper/                     — product extraction pipeline
├── database/                    — SQLite schema, init, and seed files
├── supplement_facts.csv         — 373 ingredient rows across all 78 products
├── supplement_instructions.csv  — serving size / directions for all 78 products
└── ojus.db                      — local SQLite database
```

## Open Issues (in order)

| # | Task | Status |
|---|------|--------|
| #3 | Load CSVs into DB and verify completeness | **Start here** |
| #12 | Configure API keys (Tavily, Brave, SendGrid) | Easy |
| #5 | Implement scout agent | Hard |
| #6 | Implement bundle agent | Hard |
| #7 | Implement audit agent (Playwright) | Hard |
| #8–11 | Run the full sales loop | Depends on #5–7 |
| #13 | Connect GA4 API | Medium |
| #14 | Connect Wix Stores API | Hard |
| #15 | Implement ojus-measure weekly KPI email | Medium |
| #16–17 | Build personalized recommendation quiz | Do last |
