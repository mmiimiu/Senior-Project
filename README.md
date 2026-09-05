# Thai Natural Language Condominium Search System Based on Lifestyle Criteria
## การพัฒนาระบบค้นหาคอนโดมิเนียมจากข้อความภาษาธรรมชาติภาษาไทยตามเงื่อนไขไลฟ์สไตล์

**Senior Project - College of Digital Innovation Technology, Rangsit University**  
- **ผู้จัดทำ:** นางสาว วาธิณีย์ วรรณกิจ (รหัสนักศึกษา 6707225)  
- **อาจารย์ที่ปรึกษา:** อาจารย์สุมนา เกษมสวัสดิ์  
- **หลักสูตร:** วิทยาศาสตรบัณฑิต (วท.บ.) สาขาวิชาวิทยาการคอมพิวเตอร์

---

## 🌟 จุดเด่นและมิติการประมวลผล (Core Dimensions)
1. **🚆 แนวรถไฟฟ้า (Mass Transit):** สกัดชื่อสถานีและสายรถไฟฟ้า BTS / MRT พร้อมคำนวณระยะเดิน
2. **🐾 นโยบายสัตว์เลี้ยง (Pet Policy):** สกัดความต้องการอนุญาตเลี้ยงสัตว์ (Pet-Friendly)
3. **💰 ช่วงราคาค่าเช่า (Budget Range):** แปลงข้อความระบุงบประมาณ (เช่น ไม่เกิน 15,000, 10k-20k, งบหมื่นห้า)
4. **🌿 ไลฟ์สไตล์และบรรยากาศ (Ambience & Lifestyle):** จับคู่ความหมายเชิงบริบทผ่าน Semantic Vector Cosine Similarity (เช่น เงียบสงบ, เหมาะกับ WFH, เป็นส่วนตัว, วิวแม่น้ำ)

---

## 🚀 สถาปัตยกรรมระบบ (Tech Stack)
- **Backend:** Python 3.11, FastAPI, PyThaiNLP, Scikit-learn (TF-IDF & Cosine Similarity), Pydantic, Uvicorn
- **Frontend:** React 18, Vite, Lucide React, Glassmorphism Design System, Responsive UI
- **Evaluation Benchmark:** 25 Benchmark Queries พร้อมการคำนวณค่า Precision, Recall และ F1-Score

---

## 🛠️ วิธีการติดตั้งและรันระบบ (Quick Start)

### 1. Backend (Python FastAPI)
```bash
cd backend
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\activate
pip install fastapi uvicorn pythainlp scikit-learn numpy pydantic

# รันเซิร์ฟเวอร์
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

เปิดบราวเซอร์ที่: `http://localhost:5173/`
