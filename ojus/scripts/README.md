# Wix Product Import Script

Pushes product content from local JSON files to an existing Wix Stores V1 catalog.

## Getting a Wix API Key

1. Go to [Wix Dashboard](https://manage.wix.com/) and select your site.
2. Navigate to **Settings > Advanced > API Keys** (or go directly to `https://manage.wix.com/account/api-keys`).
3. Click **Generate API Key**.
4. Give it a name (e.g., "Product Import Script").
5. Under permissions, grant access to **Wix Stores > Products** (read + write).
6. Copy the key. You will not be able to see it again.

## Setup

No dependencies to install. The script uses Node.js built-in `fetch` (Node 18+) and `fs/path` modules.

Set your API key as an environment variable:

```bash
export WIX_API_KEY="your-api-key-here"
```

Or pass it inline with `--api-key`.

If your account manages multiple sites, also set `WIX_SITE_ID` or pass `--site-id`.

## Usage

### 1. Dry run (default, safe)

Shows what would be updated without touching the Wix store:

```bash
node wix_import.js
```

### 2. Test with a single product

Pick one slug (e.g., `calm`) and verify the diff looks right:

```bash
node wix_import.js --single calm
```

### 3. Execute on a single product

Once the diff looks correct, apply it:

```bash
node wix_import.js --single calm --execute
```

### 4. Execute on all products

After confirming single-product behavior:

```bash
node wix_import.js --execute
```

## Flags

| Flag              | Description                                               |
|-------------------|-----------------------------------------------------------|
| (no flags)        | Dry-run mode. Shows diffs, writes nothing.                |
| `--execute`       | Actually sends PATCH requests to the Wix API.             |
| `--single <slug>` | Process only the product matching this slug.              |
| `--api-key <key>` | Wix API key (alternative to `WIX_API_KEY` env var).       |
| `--site-id <id>`  | Wix site ID (alternative to `WIX_SITE_ID` env var).       |
| `--help`          | Print usage info.                                         |

## Safety Features

- **Dry-run by default** -- you must explicitly pass `--execute` to write changes.
- **Diff preview** -- before any write, the script prints what will change (old vs new values).
- **Automatic backups** -- before each PATCH, the current product data from Wix is saved to `scripts/backups/<slug>_<timestamp>.json`.
- **Rate limiting** -- 350ms delay between API calls to stay within Wix rate limits.

## What Gets Updated

The script updates three product fields:

1. **description** -- rendered as HTML paragraphs from the JSON `description` field.
2. **additionalInfoSections** -- six sections built from JSON fields:
   - "What Sets This Apart" (from `formulation_rationale` or `why_we_carry_it`)
   - "Benefits" (from `benefit_bullets`, rendered as `<ul>`)
   - "Who It's For"
   - "How to Take"
   - "Safety"
   - "Disclaimer"
3. **seoData** -- `title`, `description`, and `tags` from `meta_title`, `meta_description`, and `focus_keyword`.

Fields like `price`, `name`, images, and inventory are **not touched**.
