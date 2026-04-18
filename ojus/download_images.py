"""
Download all gallery images for every product into supplement_facts_images/{slug}/.

Step 2 of 2 — run after extract_products.py.

Images are saved as image_1.png (main product shot), image_2.png, image_3.png, etc.
The supplement facts panel is one of image_2 onward — cowork reads the folder and
identifies which image is the facts panel for each product.

Usage: python download_images.py
"""

import json
import sqlite3
import httpx
from pathlib import Path

DB_PATH = Path(__file__).parent / "ojus.db"
OUT_DIR = Path(__file__).parent / "supplement_facts_images"


def download():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    rows = db.execute(
        "SELECT slug, name, all_image_urls FROM products WHERE all_image_urls IS NOT NULL"
    ).fetchall()
    db.close()

    print(f"Downloading images for {len(rows)} products...\n")
    ok, skipped, failed = 0, 0, 0

    for r in rows:
        slug = r["slug"]
        urls = json.loads(r["all_image_urls"]) if r["all_image_urls"] else []
        if not urls:
            print(f"  NO URLS  {slug}")
            continue

        product_dir = OUT_DIR / slug
        product_dir.mkdir(parents=True, exist_ok=True)

        for i, url in enumerate(urls, start=1):
            out_path = product_dir / f"image_{i}.png"
            if out_path.exists():
                skipped += 1
                continue
            try:
                resp = httpx.get(url, timeout=30, follow_redirects=True)
                resp.raise_for_status()
                out_path.write_bytes(resp.content)
                ok += 1
            except Exception as e:
                print(f"  FAIL  {slug}/image_{i}: {e}")
                failed += 1

        n = len(urls)
        print(f"  OK  {slug}  ({n} image{'s' if n != 1 else ''})")

    print(f"\nDone: {ok} downloaded, {skipped} already existed, {failed} failed")
    print(f"Folder: {OUT_DIR}")


if __name__ == "__main__":
    download()
