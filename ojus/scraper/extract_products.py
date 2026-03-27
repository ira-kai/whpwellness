"""
Ojus Product Extractor
Scrapes all products from whpwellness.com, extracts ingredients via Claude vision,
and writes everything to the local SQLite database.
"""

import asyncio
import json
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path

import httpx
from crawl4ai import AsyncWebCrawler
from dotenv import load_dotenv
from rich.console import Console
from rich.table import Table

from vision_ingredients import extract_ingredients

load_dotenv(Path(__file__).parent.parent / ".env")

DB_PATH = Path(__file__).parent.parent / "ojus.db"
CATALOG_URL = "https://www.whpwellness.com/category/all-products"
BASE_URL = "https://www.whpwellness.com"

console = Console()


def get_db():
    db = sqlite3.connect(DB_PATH)
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("PRAGMA foreign_keys=ON")
    db.row_factory = sqlite3.Row
    return db


async def discover_product_urls() -> list[str]:
    """Crawl the catalog page and extract all product URLs."""
    console.print("[bold]Step 1: Discovering product URLs...[/bold]")

    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url=CATALOG_URL)

    urls = []
    for link in result.links.get("internal", []):
        href = link.get("href", "")
        if "/product-page/" in href:
            if href.startswith("/"):
                href = BASE_URL + href
            if href not in urls:
                urls.append(href)

    console.print(f"Found {len(urls)} product URLs")
    return urls


async def scrape_product(crawler: AsyncWebCrawler, url: str) -> dict | None:
    """Scrape a single product page for metadata and images."""
    try:
        result = await crawler.arun(url=url)
        html = result.html or ""
        metadata = result.metadata or {}

        # Extract slug from URL
        slug = url.rstrip("/").split("/product-page/")[-1] if "/product-page/" in url else None

        # Extract from crawl4ai's parsed content
        product = {
            "url": url,
            "slug": slug,
            "name": metadata.get("title", "").split("|")[0].strip(),
            "description": result.markdown[:2000] if result.markdown else None,
        }

        # Collect all image URLs from the page
        images = []
        for img in result.media.get("images", []):
            src = img.get("src", "")
            if src and "wixstatic.com" in src:
                images.append(src)

        product["all_image_urls"] = images
        product["product_image_url"] = images[0] if images else None

        # Supplement facts panel is typically the 2nd image
        if len(images) >= 2:
            product["supplement_facts_image_url"] = images[1]
        elif len(images) == 1:
            product["supplement_facts_image_url"] = images[0]

        return product

    except Exception as e:
        console.print(f"[red]Error scraping {url}: {e}[/red]")
        return None


def upsert_product(db: sqlite3.Connection, product: dict) -> str:
    """Insert or update a product, return its ID."""
    existing = db.execute("SELECT id FROM products WHERE url = ?", (product["url"],)).fetchone()

    product_id = existing["id"] if existing else str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    if existing:
        db.execute(
            """UPDATE products SET
                name=?, slug=?, description=?, product_image_url=?,
                supplement_facts_image_url=?, all_image_urls=?,
                status='live', last_scraped_at=?, updated_at=?
            WHERE id=?""",
            (
                product["name"], product["slug"], product["description"],
                product.get("product_image_url"),
                product.get("supplement_facts_image_url"),
                json.dumps(product.get("all_image_urls", [])),
                now, now, product_id,
            ),
        )
    else:
        db.execute(
            """INSERT INTO products (id, name, slug, url, description,
                product_image_url, supplement_facts_image_url, all_image_urls,
                status, last_scraped_at, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'live', ?, ?, ?)""",
            (
                product_id, product["name"], product["slug"], product["url"],
                product["description"], product.get("product_image_url"),
                product.get("supplement_facts_image_url"),
                json.dumps(product.get("all_image_urls", [])),
                now, now, now,
            ),
        )

    db.commit()
    return product_id


def save_ingredients(db: sqlite3.Connection, product_id: str, extraction: dict):
    """Save extracted ingredients to the database."""
    # Clear old ingredients for this product
    db.execute("DELETE FROM ingredients WHERE product_id = ?", (product_id,))

    for ing in extraction.get("ingredients", []):
        db.execute(
            """INSERT INTO ingredients (id, product_id, name, amount, unit,
                daily_value_pct, form, is_proprietary_blend, blend_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                str(uuid.uuid4()), product_id, ing["name"],
                ing.get("amount"), ing.get("unit"),
                ing.get("daily_value_pct"), ing.get("form"),
                1 if ing.get("is_proprietary_blend") else 0,
                ing.get("blend_name"),
            ),
        )

    db.commit()


async def run():
    db = get_db()

    # Step 1: Discover URLs
    urls = await discover_product_urls()
    if not urls:
        console.print("[red]No product URLs found. Check the catalog page.[/red]")
        return

    # Step 2 & 3: Scrape each product and run vision extraction
    stats = {"scraped": 0, "vision_high": 0, "vision_medium": 0, "vision_low": 0, "vision_failed": 0, "text_only": 0, "total_ingredients": 0}

    async with AsyncWebCrawler() as crawler:
        for i, url in enumerate(urls, 1):
            console.print(f"\n[cyan][{i}/{len(urls)}][/cyan] {url}")

            product = await scrape_product(crawler, url)
            if not product:
                stats["vision_failed"] += 1
                continue

            product_id = upsert_product(db, product)
            stats["scraped"] += 1

            # Vision extraction
            sfp_url = product.get("supplement_facts_image_url")
            if sfp_url:
                console.print(f"  Running vision extraction...")
                extraction = await extract_ingredients(sfp_url)

                if "error" not in extraction:
                    save_ingredients(db, product_id, extraction)
                    confidence = extraction.get("extraction_confidence", "medium")
                    n_ingredients = len(extraction.get("ingredients", []))
                    stats[f"vision_{confidence}"] += 1
                    stats["total_ingredients"] += n_ingredients

                    db.execute(
                        "UPDATE products SET extraction_method='vision', extraction_confidence=? WHERE id=?",
                        (confidence, product_id),
                    )
                    db.commit()
                    console.print(f"  [green]OK[/green] {product['name']} — {n_ingredients} ingredients | confidence: {confidence}")
                else:
                    stats["vision_failed"] += 1
                    db.execute(
                        "UPDATE products SET extraction_method='html', extraction_confidence='low' WHERE id=?",
                        (product_id,),
                    )
                    db.commit()
                    console.print(f"  [yellow]Vision failed:[/yellow] {extraction.get('error')}")
            else:
                stats["text_only"] += 1
                console.print(f"  [yellow]No supplement facts image found[/yellow]")

    # Step 5: Summary
    console.print("\n")
    table = Table(title="Extraction Summary")
    table.add_column("Metric", style="bold")
    table.add_column("Value", justify="right")
    table.add_row("Products scraped", str(stats["scraped"]))
    table.add_row("Vision — high confidence", str(stats["vision_high"]))
    table.add_row("Vision — medium confidence", str(stats["vision_medium"]))
    table.add_row("Vision — low confidence", str(stats["vision_low"]))
    table.add_row("Vision — failed", str(stats["vision_failed"]))
    table.add_row("Text-only (no panel image)", str(stats["text_only"]))
    table.add_row("Pending (not yet on site)", "6")
    table.add_row("Total ingredients in DB", str(stats["total_ingredients"]))
    console.print(table)
    console.print("\n[bold yellow]Next: Ask Ira for supplement facts images for the 6 pending products[/bold yellow]")

    db.close()


if __name__ == "__main__":
    asyncio.run(run())
