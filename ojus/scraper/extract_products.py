"""
Ojus Product Extractor
Scrapes all products from whpwellness.com and writes metadata + image URLs to SQLite.

Step 1 of 2 — run this first, then run download_images.py.

Usage: python scraper/extract_products.py
       python scraper/extract_products.py --new-only   # skip already-scraped products
"""

import asyncio
import os
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import httpx
from crawl4ai import AsyncWebCrawler
from dotenv import load_dotenv
from rich.console import Console
from rich.table import Table

from db import get_db, upsert_product
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


def _extract_price(markdown: str) -> float | None:
    """Parse price from Wix markdown like '$54.00Price' or '$54.00'."""
    m = re.search(r"\$(\d+(?:\.\d{2})?)(?:Price)?", markdown or "")
    return float(m.group(1)) if m else None


def _extract_product_images(result) -> tuple[list[str], str | None]:
    """Extract all product gallery images, filtering out site-wide assets.

    Returns (all_image_urls, product_image_url).

    all_image_urls includes the main product shot plus every additional gallery
    image (supplement facts panels, lifestyle shots, etc.) — all saved so
    download_images.py can fetch them and cowork can identify the facts panels.
    """
    metadata = result.metadata or {}
    md = result.markdown or ""

    SKIP_ALTS = {"stripes", "logo", "whp wellness logo", ""}
    SKIP_MEDIA_IDS = {"11062b_ddb9213a8b9843fc95e4200cd0622fe2"}

    def is_site_asset(src: str, alt: str) -> bool:
        if alt.lower().strip() in SKIP_ALTS:
            return True
        return any(skip_id in src for skip_id in SKIP_MEDIA_IDS)

    # Collect real product images from result.media
    product_images = []
    for img in result.media.get("images", []):
        src = img.get("src", "")
        alt = img.get("alt", "")
        if src and "wixstatic.com" in src and not is_site_asset(src, alt):
            product_images.append(src)

    # Primary product image: prefer og:image (reliable), fall back to first media image
    og_img = metadata.get("og:image")
    product_image_url = og_img or (product_images[0] if product_images else None)

    # Track seen media IDs to avoid duplicates
    seen_media_ids = set()
    if product_image_url and "/media/" in product_image_url:
        seen_media_ids.add(product_image_url.split("/media/")[-1].split("/")[0].split("~")[0])

    all_image_urls = [product_image_url] if product_image_url else []

    # Collect ALL additional gallery thumbnails (supplement facts panels, etc.)
    # Wix renders these as thumbnail img tags in the markdown — upgrade to full size
    thumb_pattern = re.compile(
        r"!\[Thumbnail:[^\]]*\]\((https://static\.wixstatic\.com/media/[^)]+)\)"
    )
    for thumb_match in thumb_pattern.finditer(md):
        thumb_url = thumb_match.group(1)
        thumb_media_id = thumb_url.split("/media/")[-1].split("/")[0].split("~")[0]
        if thumb_media_id not in seen_media_ids:
            seen_media_ids.add(thumb_media_id)
            full_url = re.sub(r"/fill/w_\d+,h_\d+,", "/fill/w_800,h_800,", thumb_url)
            all_image_urls.append(full_url)

    return all_image_urls, product_image_url


async def scrape_product(crawler: AsyncWebCrawler, url: str) -> dict | None:
    """Scrape a single product page for metadata and image URLs."""
    try:
        result = await crawler.arun(url=url)
        metadata = result.metadata or {}
        md = result.markdown or ""

        slug = url.rstrip("/").split("/product-page/")[-1] if "/product-page/" in url else None
        name = (metadata.get("title") or metadata.get("og:title") or "").split("|")[0].strip()
        price = _extract_price(md)
        all_image_urls, product_image_url = _extract_product_images(result)

        return {
            "url": url,
            "slug": slug,
            "name": name,
            "price": price,
            "description": md[:2000] if md else None,
            "all_image_urls": all_image_urls,
            "product_image_url": product_image_url,
        }

    except Exception as e:
        console.print(f"[red]Error scraping {url}: {e}[/red]")
        return None


async def run():
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

    scraped, skipped = 0, 0

    async with AsyncWebCrawler() as crawler:
        for i, url in enumerate(urls, 1):
            if new_only and url in known_urls:
                skipped += 1
                continue

            console.print(f"\n[cyan][{i}/{len(urls)}][/cyan] {url}")

            product = await scrape_product(crawler, url)
            if not product:
                continue

            try:
                upsert_product(db, product)
                scraped += 1
                n_images = len(product.get("all_image_urls") or [])
                console.print(f"  [green]OK[/green] {product['name']} ({n_images} images)")
            except Exception as e:
                db.rollback()
                console.print(f"  [red]DB error for {product.get('name', url)}: {e}[/red]")

    table = Table(title="Scrape Summary")
    table.add_column("Metric", style="bold")
    table.add_column("Value", justify="right")
    if skipped:
        table.add_row("Skipped (already scraped)", str(skipped))
    table.add_row("Products scraped", str(scraped))
    console.print("\n")
    console.print(table)
    console.print("\n[dim]Next: run download_images.py to fetch all gallery images[/dim]")

    export_csv(db)
    db.close()


if __name__ == "__main__":
    asyncio.run(run())
