"""
FastAPI Server for Thai Natural Language Condominium Search System
Based on Lifestyle Criteria
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from dataset import CONDO_DATASET
from nlp_engine import nlp_engine, KNOWN_STATIONS
from benchmark_data import run_benchmark_evaluation

app = FastAPI(
    title="Thai NLP Condominium Search API",
    description="Senior Project - College of Digital Innovation Technology, Rangsit University",
    version="1.0.0"
)

# Enable CORS for frontend development and local access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str
    top_k: Optional[int] = 20

@app.get("/")
def read_root():
    return {
        "project": "Thai Natural Language Condominium Search System Based on Lifestyle Criteria",
        "author": "Watinee Wannakit (6707225)",
        "advisor": "Ms. Sumana Kasemsawasdi",
        "university": "Rangsit University",
        "status": "Online",
        "total_condos": len(CONDO_DATASET)
    }

@app.post("/api/search/nlp")
def search_nlp(req: SearchRequest):
    """
    Search Condos using Thai Natural Language & Semantic Matching
    """
    return nlp_engine.search_nlp(req.query, top_k=req.top_k)

@app.post("/api/search/keyword")
def search_keyword(req: SearchRequest):
    """
    Search Condos using Traditional Exact Keyword Matching (Baseline comparison)
    """
    return nlp_engine.search_keyword(req.query, top_k=req.top_k)

@app.get("/api/condos")
def get_condos(
    station: Optional[str] = None,
    pet_friendly: Optional[bool] = None,
    max_price: Optional[int] = None
):
    """
    Get all condominiums with optional traditional filters
    """
    results = CONDO_DATASET
    if station:
        results = [c for c in results if station.lower() in c["station"].lower()]
    if pet_friendly is not None:
        results = [c for c in results if c["pet_friendly"] == pet_friendly]
    if max_price is not None:
        results = [c for c in results if c["price_per_month"] <= max_price]
    
    return {
        "total": len(results),
        "condos": results
    }

@app.get("/api/condos/{condo_id}")
def get_condo_by_id(condo_id: str):
    """
    Get detail of a single condominium
    """
    for condo in CONDO_DATASET:
        if condo["id"] == condo_id:
            return condo
    raise HTTPException(status_code=404, detail="Condominium not found")

@app.get("/api/benchmark/run")
def get_benchmark_results():
    """
    Execute 25 benchmark test queries and return precision/recall/F1 comparison
    """
    return run_benchmark_evaluation()

@app.get("/api/stations")
def get_stations():
    """
    List all supported BTS and MRT stations
    """
    return {
        "stations": [s["canonical"] for s in KNOWN_STATIONS]
    }
