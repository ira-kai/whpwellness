"""Tests for scraper/db.py — upsert_product and save_ingredients."""

import json
import sqlite3
from pathlib import Path

import pytest

# Add parent to path so we can import db module
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from db import upsert_product, save_ingredients

SCHEMA_PATH = Path(__file__).parent.parent.parent / "database" / "schema.sql"


@pytest.fixture
def db():
    """In-memory SQLite with the real schema applied."""
    conn = sqlite3.connect(":memory:")
    conn.execute("PRAGMA foreign_keys=ON")
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA_PATH.read_text())
    yield conn
    conn.close()


def _make_product(**overrides):
    base = {
        "url": "https://www.whpwellness.com/product-page/zinc",
        "slug": "zinc",
        "name": "Zinc",
        "description": "Essential mineral supplement",
        "product_image_url": "https://example.com/zinc.jpg",
        "supplement_facts_image_url": "https://example.com/zinc-facts.jpg",
        "all_image_urls": ["https://example.com/zinc.jpg", "https://example.com/zinc-facts.jpg"],
    }
    base.update(overrides)
    return base


class TestUpsertProduct:
    def test_insert_new_product(self, db):
        product = _make_product()
        product_id = upsert_product(db, product)

        row = db.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
        assert row is not None
        assert row["name"] == "Zinc"
        assert row["slug"] == "zinc"
        assert row["url"] == product["url"]
        assert row["status"] == "live"
        assert row["description"] == "Essential mineral supplement"

    def test_returns_uuid(self, db):
        product_id = upsert_product(db, _make_product())
        # UUID4 format: 8-4-4-4-12 hex chars
        assert len(product_id) == 36
        assert product_id.count("-") == 4

    def test_update_existing_product(self, db):
        product = _make_product()
        first_id = upsert_product(db, product)

        product["name"] = "Zinc Plus"
        product["description"] = "Updated description"
        second_id = upsert_product(db, product)

        assert first_id == second_id
        row = db.execute("SELECT * FROM products WHERE id = ?", (first_id,)).fetchone()
        assert row["name"] == "Zinc Plus"
        assert row["description"] == "Updated description"

    def test_update_sets_status_live(self, db):
        """An existing pending product should become live after upsert."""
        product = _make_product()
        product_id = upsert_product(db, product)
        db.execute("UPDATE products SET status = 'pending' WHERE id = ?", (product_id,))
        db.commit()

        upsert_product(db, product)
        row = db.execute("SELECT status FROM products WHERE id = ?", (product_id,)).fetchone()
        assert row["status"] == "live"

    def test_stores_image_urls_as_json(self, db):
        product = _make_product()
        product_id = upsert_product(db, product)

        row = db.execute("SELECT all_image_urls FROM products WHERE id = ?", (product_id,)).fetchone()
        urls = json.loads(row["all_image_urls"])
        assert len(urls) == 2
        assert "zinc.jpg" in urls[0]

    def test_multiple_products_distinct_ids(self, db):
        id1 = upsert_product(db, _make_product(url="https://example.com/a", slug="a"))
        id2 = upsert_product(db, _make_product(url="https://example.com/b", slug="b"))
        assert id1 != id2

    def test_product_count(self, db):
        upsert_product(db, _make_product(url="https://example.com/a", slug="a"))
        upsert_product(db, _make_product(url="https://example.com/b", slug="b"))
        # Upsert same URL again — should not create a third
        upsert_product(db, _make_product(url="https://example.com/a", slug="a", name="Updated"))

        count = db.execute("SELECT COUNT(*) FROM products").fetchone()[0]
        assert count == 2


class TestSaveIngredients:
    def _insert_product(self, db):
        product_id = upsert_product(db, _make_product())
        return product_id

    def test_saves_ingredients(self, db):
        product_id = self._insert_product(db)
        extraction = {
            "ingredients": [
                {"name": "Zinc", "amount": "30", "unit": "mg", "daily_value_pct": "273%"},
                {"name": "Vitamin C", "amount": "60", "unit": "mg"},
            ]
        }
        save_ingredients(db, product_id, extraction)

        rows = db.execute("SELECT * FROM ingredients WHERE product_id = ?", (product_id,)).fetchall()
        assert len(rows) == 2
        names = {r["name"] for r in rows}
        assert names == {"Zinc", "Vitamin C"}

    def test_ingredient_fields(self, db):
        product_id = self._insert_product(db)
        extraction = {
            "ingredients": [{
                "name": "Zinc Bisglycinate",
                "amount": "30",
                "unit": "mg",
                "daily_value_pct": "273%",
                "form": "bisglycinate chelate",
                "is_proprietary_blend": False,
                "blend_name": None,
            }]
        }
        save_ingredients(db, product_id, extraction)

        row = db.execute("SELECT * FROM ingredients WHERE product_id = ?", (product_id,)).fetchone()
        assert row["name"] == "Zinc Bisglycinate"
        assert row["amount"] == "30"
        assert row["unit"] == "mg"
        assert row["daily_value_pct"] == "273%"
        assert row["form"] == "bisglycinate chelate"
        assert row["is_proprietary_blend"] == 0

    def test_proprietary_blend_flag(self, db):
        product_id = self._insert_product(db)
        extraction = {
            "ingredients": [{
                "name": "Gut Health Complex",
                "amount": "500",
                "unit": "mg",
                "is_proprietary_blend": True,
                "blend_name": "Digestive Support Blend",
            }]
        }
        save_ingredients(db, product_id, extraction)

        row = db.execute("SELECT * FROM ingredients WHERE product_id = ?", (product_id,)).fetchone()
        assert row["is_proprietary_blend"] == 1
        assert row["blend_name"] == "Digestive Support Blend"

    def test_replaces_old_ingredients(self, db):
        """Calling save_ingredients twice should replace, not append."""
        product_id = self._insert_product(db)

        save_ingredients(db, product_id, {"ingredients": [
            {"name": "Old Ingredient", "amount": "10", "unit": "mg"},
        ]})
        save_ingredients(db, product_id, {"ingredients": [
            {"name": "New Ingredient A", "amount": "20", "unit": "mg"},
            {"name": "New Ingredient B", "amount": "30", "unit": "mg"},
        ]})

        rows = db.execute("SELECT * FROM ingredients WHERE product_id = ?", (product_id,)).fetchall()
        assert len(rows) == 2
        names = {r["name"] for r in rows}
        assert "Old Ingredient" not in names

    def test_empty_ingredients(self, db):
        product_id = self._insert_product(db)
        save_ingredients(db, product_id, {"ingredients": []})

        count = db.execute("SELECT COUNT(*) FROM ingredients WHERE product_id = ?", (product_id,)).fetchone()[0]
        assert count == 0

    def test_missing_ingredients_key(self, db):
        product_id = self._insert_product(db)
        save_ingredients(db, product_id, {})

        count = db.execute("SELECT COUNT(*) FROM ingredients WHERE product_id = ?", (product_id,)).fetchone()[0]
        assert count == 0
