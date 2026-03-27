# Ojus Growth OS

Agentic sales system for WHP Wellness / Ojus supplement line.

## Setup

1. Copy `.env.example` to `.env` and fill in your keys
2. Initialize the database: `python database/init_db.py`
3. Install scraper dependencies: `pip install -r scraper/requirements.txt`

## Structure

```
ojus/
├── .agents/skills/    — gstack sales loop skills
├── scraper/           — product extraction pipeline
├── database/          — SQLite schema and init
└── agents/            — Python agent implementations
```

## Sales Loop

Scout → Bundle → Create → Comply → Convert → Measure → Iterate
