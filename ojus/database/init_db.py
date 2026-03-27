"""Initialize the SQLite database and seed pending products."""

import sqlite3
import uuid
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "ojus.db"
SCHEMA_PATH = Path(__file__).parent / "schema.sql"


def init():
    db = sqlite3.connect(DB_PATH)
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("PRAGMA foreign_keys=ON")

    with open(SCHEMA_PATH) as f:
        db.executescript(f.read())

    # Seed pending products if not already present
    existing = db.execute("SELECT COUNT(*) FROM products WHERE status='pending'").fetchone()[0]
    if existing == 0:
        pending = [
            ("Fiber Fit", "fiber-fit", "Gastrointestinal Health"),
            ("Inositol Blend", "inositol-blend", "Women's Health"),
            ("L-Theanine", "l-theanine", "Endocrine Health"),
            ("Zinc", "zinc", "Essential Minerals"),
            ("Vitamin D 5000IU", "vitamin-d-5000iu", "Essential Vitamins"),
            ("Cardio-OX", "cardio-ox", "Cardiovascular Health"),
        ]
        db.executemany(
            "INSERT INTO products (id, name, slug, category, status, extraction_confidence) VALUES (?, ?, ?, ?, 'pending', 'low')",
            [(str(uuid.uuid4()), name, slug, cat) for name, slug, cat in pending],
        )
        db.commit()
        print(f"Seeded {len(pending)} pending products")
    else:
        print(f"Already have {existing} pending products, skipping seed")

    total = db.execute("SELECT COUNT(*) FROM products").fetchone()[0]
    print(f"Database ready at {DB_PATH} — {total} products")
    db.close()


if __name__ == "__main__":
    init()
