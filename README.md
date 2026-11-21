# Thai NLP Condominium Search System (Next.js + Python FastAPI + SQLite)
ระบบค้นหาคอนโดมิเนียมจากข้อความภาษาธรรมชาติภาษาไทยตามเงื่อนไขไลฟ์สไตล์

โครงงานวิจัยปริญญานิพนธ์ สาขาวิชาวิทยาการคอมพิวเตอร์ วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี มหาวิทยาลัยรังสิต (ปีการศึกษา 2569)
- **ผู้วิจัย**: นางสาว วาธิณีย์ วรรณกิจ (รหัสนักศึกษา 6707225)
- **อาจารย์ที่ปรึกษา**: อาจารย์ สุมนา เกษมสวัสดิ์

---

## โครงสร้างไฟล์แบ่งตาม Layer (3-Tier Layered Architecture)

```text
Project/
├── src/                                # [Layer 1: Presentation Tier — Next.js (React/TypeScript)]
│   ├── app/                            # Next.js App Router (layout.tsx, page.tsx, globals.css)
│   ├── components/                     # UI Components (SearchHero, CriteriaMonitor, CondoGrid, Modals)
│   └── types/                          # TypeScript Interfaces (condo.ts)
├── backend/                            # [Layer 2 & 3: Application & Data Tier — Python FastAPI + SQLite]
│   ├── api/                            # API Layer (routes.py — FastAPI REST Endpoints)
│   ├── services/                       # Service Layer (nlp_engine.py — PyThaiNLP, TF-IDF, Levenshtein)
│   ├── data/                           # Data Layer (database.py & condos.db — ฐานข้อมูล SQLite 100 โครงการ)
│   ├── tests/                          # Testing Layer (evaluate_chapter4.py & test_nlp_engine.py)
│   └── requirements.txt
├── docs/                               # [Documentation & Thesis Reports]
│   ├── เล่มโปรเจค-6707225Edit 2-.docx  # เล่มโปรเจกต์จบฉบับสมบูรณ์ (บทที่ 1–5)
│   ├── ResearchPaper.docx              # เล่มวิจัย (บทที่ 1–3)
│   └── diagrams/                       # แผนภาพการออกแบบระบบ (รูปที่ 3.1 – 3.5)
├── main.py                             # Entry Point สตาร์ททั้ง Next.js และ FastAPI ด้วยคำสั่งเดียว
├── next.config.mjs                     # ตั้งค่า Next.js & API Proxy Rewrites
├── package.json                        # Scripts (dev, build, test, evaluate)
└── tsconfig.json                       # ตั้งค่า TypeScript
```

## วิธีการรันระบบใน VS Code (คำสั่งเดียวสตาร์ทครบทั้ง Stack)
```bash
npm run dev
```
หรือกดปุ่ม **Run / F5** (`Run Full-Stack (Next.js + FastAPI + SQLite)`) ใน VS Code:
- **Next.js Frontend Server**: `http://localhost:3000`
- **FastAPI Server + Static UI**: `http://localhost:5500`
- **Swagger API Documentation**: `http://localhost:5500/docs`

## วิธีเผยแพร่เว็บไซต์ให้เปิดผ่านอินเทอร์เน็ต
โปรเจกต์แยกหน้าเว็บ Next.js และ API FastAPI จึงต้องเผยแพร่ทั้งสองส่วน:

1. Push โค้ดขึ้น GitHub
2. สร้าง Web Service บน Render โดยเลือก repository นี้ Render จะอ่านการตั้งค่าจาก `render.yaml` แล้วติดตั้ง backend ให้อัตโนมัติ เมื่อ Deploy สำเร็จ ให้คัดลอก URL ของ service (เช่น `https://ชื่อ-service.onrender.com`)
3. Import repository เดียวกันเป็นโปรเจกต์บน Vercel โดยใช้ค่า Build Command เริ่มต้น (`npm run build`)
4. ใน Vercel ไปที่ **Settings → Environment Variables** เพิ่ม `NEXT_PUBLIC_API_BASE_URL` ให้เป็น URL ของ Render โดยไม่ต้องเติม `/api` ต่อท้าย แล้วกด Redeploy
5. เปิด URL ที่ Vercel แสดง เพื่อเข้าชมเว็บไซต์จากอินเทอร์เน็ต

API ที่เผยแพร่แล้วดูเอกสารได้ที่ `<Render URL>/docs` และตรวจสถานะได้ที่ `<Render URL>/api/info` หากใช้บริการ Render แบบ Free อาจต้องรอสักครู่เมื่อเรียกครั้งแรกหลังไม่มีการใช้งาน
