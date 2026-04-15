"""CSV export for Ojus product data."""

import csv
import sqlite3

from rich.console import Console

from db import DB_PATH

console = Console()


def export_csv(db: sqlite3.Connection):
    """Export products table to CSV for easy viewing."""
    csv_path = DB_PATH.parent / "ojus_products.csv"
    rows = db.execute(
        """SELECT name, slug, url, category, status, price,
                  product_image_url, supplement_facts_image_url,
                  extraction_method, extraction_confidence, last_scraped_at
           FROM products ORDER BY name"""
    ).fetchall()

    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([col[0] for col in db.execute(
            """SELECT name, slug, url, category, status, price,
                      product_image_url, supplement_facts_image_url,
                      extraction_method, extraction_confidence, last_scraped_at
               FROM products LIMIT 0"""
        ).description])
        writer.writerows(rows)

    console.print(f"\n[bold green]CSV exported:[/bold green] {csv_path}  ({len(rows)} products)")
