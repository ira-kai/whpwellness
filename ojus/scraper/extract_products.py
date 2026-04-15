"""
Ojus Product Extractor
Scrapes all products from whpwellness.com, extracts ingredients via Claude vision,
and writes everything to the local SQLite database.

Run without API key:  python extract_products.py
Run with vision:      python extract_products.py --vision
Skip already-scraped: python extract_products.py --new-only
"""

import asyncio
import os
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import httpx
from crawl4ai import AsyncWebCrawler
from dotenv import load_dotenv
from rich.console import Console
from rich.table import Table

from db import get_db, upsert_product, save_ingredients
from export import export_csv

load_dotenv(Path(__file__).parent.parent / ".env")

SITEMAP_URL = "https://www.whpwellness.com/store-products-sitemap.xml"
BASE_URL = "https://www.whpwellness.com"

console = Console()


def discover_product_urls() -> list[str]:
    """Fetch the Wix product sitemap and extract all product URLs."""
    console.print("[bold]Step 1: Discovering product URLs from sitemap...[/bold]")

    resp = httpx.get(SITEMAP_URL, timeout=30)
    resp.raise_for_status()

    root = ET.fromstring(resp.text)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}

    urls = []
    for loc in root.findall(".//sm:loc", ns):
        url = loc.text.strip()
        if "/product-page/" in url:
            urls.append(url)

    console.print(f"Found {len(urls)} product URLs")
    return urls


async def scrape_product(crawler: AsyncWebCrawler, url: str) -> dict | None:
    """Scrape a single product page for metadata and images."""
    try:
        result = await crawler.arun(url=url)
        metadata = result.metadata or {}

        slug = url.rstrip("/").split("/product-page/")[-1] if "/product-page/" in url else None

        product = {
            "url": url,
            "slug": slug,
            "name": (metadata.get("title") or "").split("|")[0].strip(),
            "description": result.markdown[:2000] if result.markdown else None,
        }

        images = []
        for img in result.media.get("images", []):
            src = img.get("src", "")
            if src and "wixstatic.com" in src:
                images.append(src)

        product["all_image_urls"] = images
        product["product_image_url"] = images[0] if images else None

        if len(images) >= 2:
            product["supplement_facts_image_url"] = images[1]
        elif len(images) == 1:
            product["supplement_facts_image_url"] = images[0]

        return product

    except Exception as e:
        console.print(f"[red]Error scraping {url}: {e}[/red]")
        return None


async def run():
    use_vision = "--vision" in sys.argv and os.getenv("ANTHROPIC_API_KEY")

    if "--vision" in sys.argv and not os.getenv("ANTHROPIC_API_KEY"):
        console.print("[red]--vision flag set but ANTHROPIC_API_KEY not found in .env[/red]")
        return

    extract_ingredients = None
    if use_vision:
        from vision_ingredients import extract_ingredients

    db = get_db()

    urls = discover_product_urls()
    if not urls:
        console.print("[red]No product URLs found. Check the catalog page.[/red]")
        return

    new_only = "--new-only" in sys.argv
    known_urls = set()
    if new_only:
        rows = db.execute("SELECT url FROM products WHERE last_scraped_at IS NOT NULL").fetchall()
        known_urls = {r["url"] for r in rows}
        if known_urls:
            console.print(f"[dim]--new-only: skipping {len(known_urls)} already-scraped products[/dim]")

    stats = {"scraped": 0, "skipped": 0, "vision_ok": 0, "vision_failed": 0, "skipped_vision": 0}

    async with AsyncWebCrawler() as crawler:
        for i, url in enumerate(urls, 1):
            if new_only and url in known_urls:
                stats["skipped"] += 1
                continue

            console.print(f"\n[cyan][{i}/{len(urls)}][/cyan] {url}")

            product = await scrape_product(crawler, url)
            if not product:
                continue

            try:
                product_id = upsert_product(db, product)
                stats["scraped"] += 1
                console.print(f"  [green]OK[/green] {product['name']}")

                if use_vision and extract_ingredients:
                    sfp_url = product.get("supplement_facts_image_url")
                    if sfp_url:
                        console.print(f"  Running vision extraction...")
                        extraction = await extract_ingredients(sfp_url)

                        if "error" not in extraction:
                            save_ingredients(db, product_id, extraction)
                            confidence = extraction.get("extraction_confidence", "medium")
                            n = len(extraction.get("ingredients", []))
                            stats["vision_ok"] += 1
                            db.execute(
                                "UPDATE products SET extraction_method='vision', extraction_confidence=? WHERE id=?",
                                (confidence, product_id),
                            )
                            db.commit()
                            console.print(f"  [green]Vision OK[/green] — {n} ingredients ({confidence})")
                        else:
                            stats["vision_failed"] += 1
                            console.print(f"  [yellow]Vision failed:[/yellow] {extraction.get('error')}")
                else:
                    stats["skipped_vision"] += 1
            except Exception as e:
                db.rollback()
                console.print(f"  [red]DB error for {product.get('name', url)}: {e}[/red]")

    # Summary
    console.print("\n")
    table = Table(title="Scrape Summary")
    table.add_column("Metric", style="bold")
    table.add_column("Value", justify="right")
    if stats["skipped"]:
        table.add_row("Skipped (already scraped)", str(stats["skipped"]))
    table.add_row("Products scraped", str(stats["scraped"]))
    if use_vision:
        table.add_row("Vision — success", str(stats["vision_ok"]))
        table.add_row("Vision — failed", str(stats["vision_failed"]))
    else:
        table.add_row("Vision skipped (no --vision)", str(stats["skipped_vision"]))
        console.print("[dim]Tip: Run with --vision once you have ANTHROPIC_API_KEY in .env[/dim]")
    console.print(table)

    export_csv(db)
    db.close()


if __name__ == "__main__":
    asyncio.run(run())
