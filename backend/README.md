# BKK CONDO NLP - Backend & NLP Engine
**Senior Project - College of Digital Innovation Technology, Rangsit University**  
**Author:** Watinee Wannakit (วาทินี วรรณกิจ) - Student ID: 6707225  
**Topic:** การพัฒนาระบบค้นหาคอนโดมิเนียมด้วยการประมวลผลภาษาธรรมชาติอิงเกณฑ์ไลฟ์สไตล์ (BTS สายสีเขียว 100 แห่ง)

---

## 🛠️ สถาปัตยกรรมระบบ (Full-Stack Architecture)
ระบบได้รับการออกแบบเป็น Full-Stack System 3 ชั้น (3-Tier Architecture):
1. **Frontend Tier (Web UI):** HTML5, Vanilla CSS3, JavaScript ES6 (Instant Search, Live Condition Monitor, Responsive Condo Cards)
2. **Backend & NLP Tier (Python):** Python 3, FastAPI, PyThaiNLP, Scikit-learn (TF-IDF & Cosine Similarity), Fuzzy Levenshtein Distance
3. **Data Tier:** 100 Condominiums Dataset covering BTS Green Line (47 stations)

---

## 📂 โครงสร้างโฟลเดอร์ Backend
```
backend/
├── main.py                # FastAPI REST API Server (/api/search/nlp, /api/condos)
├── nlp_engine.py          # Thai NLP Engine (Entity Extraction & Semantic Search)
├── dataset.py             # Benchmark Dataset (100 โครงการ BTS สายสีเขียว)
├── evaluate_chapter4.py   # สคริปต์รันชุดทดสอบ 20 ประโยคตามตารางที่ 4.1 และ 4.2
├── benchmark_data.py      # Benchmark Test Suite
└── requirements.txt       # รายการ Library ที่ใช้ในโปรเจกต์
```

---

## 🚀 วิธีการรันระบบ Backend

### 1. ติดตั้ง Library ที่จำเป็น
```bash
pip install -r backend/requirements.txt
```

### 2. รันสคริปต์ประเมินผลความแม่นยำ (ตามบทที่ 4)
```bash
python3 backend/evaluate_chapter4.py
```

### 3. รัน FastAPI Server (พอร์ต 8000)
```bash
uvicorn backend.main:app --reload --port 8000
```
- เปิดดู Swagger API Documentation ได้ที่: `http://localhost:8000/docs`
