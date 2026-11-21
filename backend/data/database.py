# -*- coding: utf-8 -*-
"""
Data Layer: SQLite Database Access Module (backend/data/condos.db)
Thai Natural Language Condominium Search System Based on Lifestyle Criteria
"""

import json
import sqlite3
from pathlib import Path
from typing import Any, Dict, List, Optional

DB_PATH = Path(__file__).resolve().parent / "condos.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def _row_to_dict(row: sqlite3.Row) -> Dict[str, Any]:
    lifestyle = json.loads(row["lifestyle_json"]) if row["lifestyle_json"] else []
    pet = bool(row["pet_friendly"])
    return {
        "id": row["id"],
        "name": row["name"],
        "station": row["station"],
        "transitType": row["transit_type"],
        "distance": row["distance"],
        "price": row["price"],
        "price_per_month": row["price"],
        "petFriendly": pet,
        "pet_friendly": pet,
        "lifestyle": lifestyle,
        "lifestyle_tags": lifestyle,
        "desc": row["description"],
        "description": row["description"],
        "image": row["image"],
    }


def fetch_all_condos() -> List[Dict[str, Any]]:
    """ดึงข้อมูลคอนโดมิเนียมทั้งหมด 100 โครงการจากฐานข้อมูล SQLite (condos.db)"""
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM condominiums ORDER BY id ASC").fetchall()
        return [_row_to_dict(r) for r in rows]


def fetch_condo_by_id(condo_id: int) -> Optional[Dict[str, Any]]:
    """ดึงข้อมูลคอนโดมิเนียมรายโครงการตามรหัส ID จากฐานข้อมูล SQLite (condos.db)"""
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM condominiums WHERE id = ?", (condo_id,)).fetchone()
        return _row_to_dict(row) if row else None
