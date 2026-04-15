"""Database helpers for the Ojus scraper."""

import json
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "ojus.db"


def get_db() -> sqlite3.Connection:
    db = sqlite3.connect(DB_PATH)
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("PRAGMA foreign_keys=ON")
    db.row_factory = sqlite3.Row
    return db


def upsert_product(db: sqlite3.Connection, product: dict) -> str:
    """Insert or update a product, return its ID."""
    existing = db.execute(
        "SELECT id FROM products WHERE url = ? OR slug = ?",
        (product["url"], product.get("slug")),
    ).fetchone()

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
