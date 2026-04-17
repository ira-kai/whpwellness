"""Download all supplement facts images locally."""

import sqlite3
import httpx
from pathlib import Path

DB_PATH = Path(__file__).parent / "ojus.db"
OUT_DIR = Path(__file__).parent / "supplement_facts_images"
OUT_DIR.mkdir(exist_ok=True)

db = sqlite3.connect(DB_PATH)
db.row_factory = sqlite3.Row
rows = db.execute(
    "SELECT slug, supplement_facts_image_url FROM products WHERE supplement_facts_image_url IS NOT NULL"
).fetchall()

print(f"Downloading {len(rows)} images...")
ok, fail = 0, 0

for r in rows:
    slug = r["slug"]
    url = r["supplement_facts_image_url"]
    out_path = OUT_DIR / f"{slug}.png"
    if out_path.exists():
        print(f"  SKIP {slug} (already downloaded)")
        ok += 1
        continue
    try:
        resp = httpx.get(url, timeout=30, follow_redirects=True)
        resp.raise_for_status()
        out_path.write_bytes(resp.content)
        print(f"  OK {slug} ({len(resp.content)//1024}KB)")
        ok += 1
    except Exception as e:
        print(f"  FAIL {slug}: {e}")
        fail += 1

db.close()
print(f"\nDone: {ok} downloaded, {fail} failed")
print(f"Images saved to: {OUT_DIR}")
