"""
API Layer: FastAPI Routes for Thai Natural Language Condominium Search System
Stack: Next.js (React/TypeScript) + Python FastAPI + SQLite (backend/data/condos.db)
"""

from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

from backend.data.database import fetch_all_condos, fetch_condo_by_id
from backend.services.nlp_engine import nlp_engine, KNOWN_STATIONS

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
OUT_DIR = ROOT_DIR / "out"
DIAG_DIR = ROOT_DIR / "docs" / "diagrams"
RECOMMENDED_IDS = [3, 17, 28, 35, 45, 52]

app = FastAPI(
    title="Thai NLP Condominium Search API",
    description="Next.js + Python FastAPI + SQLite - College of Digital Innovation Technology, Rangsit University",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if DIAG_DIR.is_dir():
    app.mount("/diagrams", StaticFiles(directory=str(DIAG_DIR)), name="diagrams")
if (OUT_DIR / "_next").is_dir():
    app.mount("/_next", StaticFiles(directory=str(OUT_DIR / "_next")), name="next_assets")


class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 100


def build_condition_summary(entities: dict, query: str = "") -> dict:
    """สร้างข้อความสรุปเงื่อนไข 4 มิติจากฝั่ง Python สำหรับแสดงผลบน Next.js UI"""
    station = entities.get("station") or entities.get("line")
    oos = entities.get("out_of_scope")
    lifestyle = entities.get("lifestyle_tags_matched") or []
    min_price, max_price = entities.get("min_price"), entities.get("max_price")
    pet = entities.get("pet_friendly")
    budget_text = f"{min_price:,} - {max_price:,} บ./ด." if (min_price and max_price) else (f"≤ {max_price:,} บ./ด." if max_price else (f"≥ {min_price:,} บ./ด." if min_price else "ไม่จำกัด"))
    pet_text = "✅ อนุญาตเลี้ยงสัตว์" if pet is True else ("❌ ไม่อนุญาตเลี้ยงสัตว์" if pet is False else ("ทั่วไป" if query else "ไม่ระบุ"))
    transit_val = f"{oos} (นอกแนว BTS สายสีเขียว)" if oos else (station or ("ไม่พบทำเล" if query else "ทั้งหมด"))
    items = [
        {"id": "entityTransit", "value": transit_val, "active": bool(station or oos)},
        {"id": "entityPet", "value": pet_text, "active": pet is not None},
        {"id": "entityLifestyle", "value": ", ".join(lifestyle) if lifestyle else ("ทั่วไป" if query else "ไม่ระบุ"), "active": len(lifestyle) > 0},
        {"id": "entityBudget", "value": budget_text, "active": bool(min_price or max_price)},
    ]
    active_count = sum(1 for item in items if item["active"])
    badge = "ทำเลอยู่นอกแนว BTS สายสีเขียว (0 รายการ)" if oos else (f"สกัดได้ {active_count} มิติเงื่อนไข" if active_count else "พร้อมวิเคราะห์")
    return {"items": items, "badge": badge}


@app.get("/api/info")
def read_info():
    all_condos = fetch_all_condos()
    return {
        "project": "Thai Natural Language Condominium Search System Based on Lifestyle Criteria",
        "author": "Watinee Wannakit (6707225)",
        "advisor": "Ms. Sumana Kasemsawasdi",
        "university": "Rangsit University",
        "frontend_framework": "Next.js (React + TypeScript)",
        "backend_framework": "Python FastAPI + PyThaiNLP + Scikit-learn",
        "database": "SQLite (backend/data/condos.db)",
        "status": "Online",
        "total_condos": len(all_condos),
    }


@app.post("/api/search/nlp")
def search_nlp(req: SearchRequest):
    result = nlp_engine.search_nlp(req.query, top_k=req.top_k or 100)
    result["condition_summary"] = build_condition_summary(result.get("entities", {}), req.query)
    return result


@app.post("/api/search/keyword")
def search_keyword(req: SearchRequest):
    return nlp_engine.search_keyword(req.query, top_k=req.top_k or 100)


@app.get("/api/condos")
def get_condos(station: Optional[str] = None, pet_friendly: Optional[bool] = None, max_price: Optional[int] = None):
    results = nlp_engine.dataset
    if station:
        results = [c for c in results if station.lower() in c["station"].lower()]
    if pet_friendly is not None:
        results = [c for c in results if c["pet_friendly"] == pet_friendly]
    if max_price is not None:
        results = [c for c in results if c["price_per_month"] <= max_price]
    recommended = [next((c for c in nlp_engine.dataset if c["id"] == rec_id), None) for rec_id in RECOMMENDED_IDS]
    return {
        "total": len(results),
        "condos": results,
        "recommended": [c for c in recommended if c is not None],
        "condition_summary": build_condition_summary({}, ""),
    }


@app.get("/api/condos/{condo_id}")
def get_condo_by_id(condo_id: int):
    condo = fetch_condo_by_id(condo_id)
    if condo:
        return condo
    raise HTTPException(status_code=404, detail="Condominium not found")


@app.get("/api/stations")
def get_stations():
    return {"stations": [s["canonical"] for s in KNOWN_STATIONS]}


@app.get("/")
@app.get("/index.html")
def serve_index():
    next_index = OUT_DIR / "index.html"
    if next_index.is_file():
        return FileResponse(next_index)
    return {"message": "Next.js UI is running on http://localhost:3000"}


if __name__ == "__main__":
    uvicorn.run("backend.api.routes:app", host="127.0.0.1", port=5500, reload=True)
