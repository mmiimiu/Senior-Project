import subprocess
import os

svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#EDF2F7"/>
    </linearGradient>
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1E3A8A"/>
      <stop offset="100%" stop-color="#3B82F6"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.08"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="800" fill="url(#bgGrad)"/>
  
  <!-- Outer Card -->
  <rect x="40" y="30" width="1120" height="740" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" filter="url(#shadow)"/>

  <!-- Header Banner -->
  <path d="M 40 46 Q 40 30 56 30 L 1144 30 Q 1160 30 1160 46 L 1160 110 L 40 110 Z" fill="url(#headerGrad)"/>
  <text x="600" y="70" font-family="'TH Sarabun New', sans-serif" font-size="28" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
    ระบบนิเวศและเครื่องมือที่ใช้ในการพัฒนาระบบ (Development Software Tools &amp; Ecosystem)
  </text>
  <text x="600" y="98" font-family="'TH Sarabun New', sans-serif" font-size="18" fill="#DBEAFE" text-anchor="middle">
    ระบบค้นหาคอนโดมิเนียมด้วยภาษาธรรมชาติภาษาไทยตามไลฟ์สไตล์ (Thai NLP Condominium Search System)
  </text>

  <!-- Section 1: Presentation & Frontend Tools -->
  <g transform="translate(70, 135)">
    <rect width="320" height="300" rx="12" fill="#F0FDF4" stroke="#86EFAC" stroke-width="1.5"/>
    <rect width="320" height="42" rx="12" fill="#22C55E"/>
    <rect y="30" width="320" height="12" fill="#22C55E"/>
    <text x="160" y="27" font-family="'TH Sarabun New', sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      1. ส่วนหน้าของระบบ (Frontend)
    </text>
    
    <!-- Item 1 -->
    <g transform="translate(15, 55)">
      <rect width="290" height="52" rx="8" fill="#FFFFFF" stroke="#DCFCE7"/>
      <text x="15" y="24" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#15803D">Next.js 14.2 (App Router)</text>
      <text x="15" y="44" font-family="'TH Sarabun New', sans-serif" font-size="14" fill="#4B5563">SSR/SSG Hybrid Web Framework</text>
    </g>
    <!-- Item 2 -->
    <g transform="translate(15, 115)">
      <rect width="290" height="52" rx="8" fill="#FFFFFF" stroke="#DCFCE7"/>
      <text x="15" y="24" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#15803D">React 18 &amp; TypeScript 5.9</text>
      <text x="15" y="44" font-family="'TH Sarabun New', sans-serif" font-size="14" fill="#4B5563">Interactive UI &amp; Type-Safe Logic</text>
    </g>
    <!-- Item 3 -->
    <g transform="translate(15, 175)">
      <rect width="290" height="52" rx="8" fill="#FFFFFF" stroke="#DCFCE7"/>
      <text x="15" y="24" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#15803D">Tailwind CSS 3.4</text>
      <text x="15" y="44" font-family="'TH Sarabun New', sans-serif" font-size="14" fill="#4B5563">Responsive Utility-First Styling</text>
    </g>
    <!-- Item 4 -->
    <g transform="translate(15, 235)">
      <rect width="290" height="52" rx="8" fill="#FFFFFF" stroke="#DCFCE7"/>
      <text x="15" y="24" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#15803D">Node.js v26.13 (LTS 18+)</text>
      <text x="15" y="44" font-family="'TH Sarabun New', sans-serif" font-size="14" fill="#4B5563">JavaScript Server Runtime Engine</text>
    </g>
  </g>

  <!-- Section 2: Backend & NLP Engine Tools -->
  <g transform="translate(440, 135)">
    <rect width="320" height="300" rx="12" fill="#EFF6FF" stroke="#93C5FD" stroke-width="1.5"/>
    <rect width="320" height="42" rx="12" fill="#3B82F6"/>
    <rect y="30" width="320" height="12" fill="#3B82F6"/>
    <text x="160" y="27" font-family="'TH Sarabun New', sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      2. บริการหลังบ้าน &amp; NLP (Backend)
    </text>
    
    <!-- Item 1 -->
    <g transform="translate(15, 55)">
      <rect width="290" height="52" rx="8" fill="#FFFFFF" stroke="#DBEAFE"/>
      <text x="15" y="24" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#1D4ED8">Python 3.9 &amp; FastAPI 0.128</text>
      <text x="15" y="44" font-family="'TH Sarabun New', sans-serif" font-size="14" fill="#4B5563">High-Speed RESTful API Service</text>
    </g>
    <!-- Item 2 -->
    <g transform="translate(15, 115)">
      <rect width="290" height="52" rx="8" fill="#FFFFFF" stroke="#DBEAFE"/>
      <text x="15" y="24" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#1D4ED8">PyThaiNLP 5.4.0 (newmm)</text>
      <text x="15" y="44" font-family="'TH Sarabun New', sans-serif" font-size="14" fill="#4B5563">Thai Word Segmentation &amp; Dictionary</text>
    </g>
    <!-- Item 3 -->
    <g transform="translate(15, 175)">
      <rect width="290" height="52" rx="8" fill="#FFFFFF" stroke="#DBEAFE"/>
      <text x="15" y="24" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#1D4ED8">Scikit-learn 1.6 &amp; NumPy</text>
      <text x="15" y="44" font-family="'TH Sarabun New', sans-serif" font-size="14" fill="#4B5563">TF-IDF &amp; Cosine Similarity Calculation</text>
    </g>
    <!-- Item 4 -->
    <g transform="translate(15, 235)">
      <rect width="290" height="52" rx="8" fill="#FFFFFF" stroke="#DBEAFE"/>
      <text x="15" y="24" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#1D4ED8">Uvicorn 0.39 &amp; Pydantic</text>
      <text x="15" y="44" font-family="'TH Sarabun New', sans-serif" font-size="14" fill="#4B5563">ASGI High-Concurrency Web Server</text>
    </g>
  </g>

  <!-- Section 3: Database & System Design Tools -->
  <g transform="translate(810, 135)">
    <rect width="320" height="300" rx="12" fill="#FAF5FF" stroke="#D8B4FE" stroke-width="1.5"/>
    <rect width="320" height="42" rx="12" fill="#A855F7"/>
    <rect y="30" width="320" height="12" fill="#A855F7"/>
    <text x="160" y="27" font-family="'TH Sarabun New', sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      3. ฐานข้อมูล &amp; การออกแบบ (Data &amp; Design)
    </text>
    
    <!-- Item 1 -->
    <g transform="translate(15, 55)">
      <rect width="290" height="52" rx="8" fill="#FFFFFF" stroke="#F3E8FF"/>
      <text x="15" y="24" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#7E22CE">Draw.io (diagrams.net)</text>
      <text x="15" y="44" font-family="'TH Sarabun New', sans-serif" font-size="14" fill="#4B5563">DFD, Flowchart, System Architecture</text>
    </g>
    <!-- Item 2 -->
    <g transform="translate(15, 115)">
      <rect width="290" height="52" rx="8" fill="#FFFFFF" stroke="#F3E8FF"/>
      <text x="15" y="24" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#7E22CE">SQLite 3 (condos.db)</text>
      <text x="15" y="44" font-family="'TH Sarabun New', sans-serif" font-size="14" fill="#4B5563">Lightweight Relational Database (100 Condos)</text>
    </g>
    <!-- Item 3 -->
    <g transform="translate(15, 175)">
      <rect width="290" height="52" rx="8" fill="#FFFFFF" stroke="#F3E8FF"/>
      <text x="15" y="24" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#7E22CE">DB Browser for SQLite</text>
      <text x="15" y="44" font-family="'TH Sarabun New', sans-serif" font-size="14" fill="#4B5563">Visual Database Management &amp; SQL Query</text>
    </g>
    <!-- Item 4 -->
    <g transform="translate(15, 235)">
      <rect width="290" height="52" rx="8" fill="#FFFFFF" stroke="#F3E8FF"/>
      <text x="15" y="24" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#7E22CE">Swagger UI &amp; Postman</text>
      <text x="15" y="44" font-family="'TH Sarabun New', sans-serif" font-size="14" fill="#4B5563">RESTful API Interactive Testing &amp; Latency</text>
    </g>
  </g>

  <!-- Section 4: Hardware & Environment Specifications (Bottom Banner) -->
  <g transform="translate(70, 465)">
    <rect width="1060" height="275" rx="12" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
    <rect width="1060" height="42" rx="12" fill="#475569"/>
    <rect y="30" width="1060" height="12" fill="#475569"/>
    <text x="530" y="27" font-family="'TH Sarabun New', sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      4. สภาพแวดล้อมฮาร์ดแวร์และเครื่องมือสนับสนุน (Hardware &amp; Development Environment)
    </text>

    <!-- Sub-item 1: Hardware -->
    <g transform="translate(25, 60)">
      <rect width="485" height="95" rx="8" fill="#FFFFFF" stroke="#E2E8F0"/>
      <text x="20" y="28" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#0F172A">เครื่องคอมพิวเตอร์ประมวลผลหลัก (Hardware Machine):</text>
      <text x="20" y="52" font-family="'TH Sarabun New', sans-serif" font-size="16" fill="#334155">• ชิปประมวลผล: Apple M4 Chip (8-Core CPU / 10-Core GPU)</text>
      <text x="20" y="74" font-family="'TH Sarabun New', sans-serif" font-size="16" fill="#334155">• หน่วยความจำ: 16 GB Unified Memory | พื้นที่จัดเก็บ: 256 GB NVMe SSD</text>
    </g>

    <!-- Sub-item 2: Operating System -->
    <g transform="translate(545, 60)">
      <rect width="485" height="95" rx="8" fill="#FFFFFF" stroke="#E2E8F0"/>
      <text x="20" y="28" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#0F172A">ระบบปฏิบัติการและสภาพแวดล้อมระบบ (Operating System):</text>
      <text x="20" y="52" font-family="'TH Sarabun New', sans-serif" font-size="16" fill="#334155">• ระบบปฏิบัติการ: macOS Sequoia เวอร์ชัน 15.6.1 (Build 24G90)</text>
      <text x="20" y="74" font-family="'TH Sarabun New', sans-serif" font-size="16" fill="#334155">• สถาปัตยกรรม: ARM64 (Apple Silicon Architecture)</text>
    </g>

    <!-- Sub-item 3: IDE & Version Control -->
    <g transform="translate(25, 170)">
      <rect width="485" height="85" rx="8" fill="#FFFFFF" stroke="#E2E8F0"/>
      <text x="20" y="28" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#0F172A">โปรแกรมพัฒนาโค้ด (Code Editor &amp; IDE):</text>
      <text x="20" y="52" font-family="'TH Sarabun New', sans-serif" font-size="16" fill="#334155">• Visual Studio Code 1.95+ (Extensions: Python, ESLint, Tailwind)</text>
      <text x="20" y="72" font-family="'TH Sarabun New', sans-serif" font-size="16" fill="#334155">• การจัดการเวอร์ชัน: Git 2.39+ ควบคุมประวัติการแก้ไขโครงการ</text>
    </g>

    <!-- Sub-item 4: Testing & Documentation -->
    <g transform="translate(545, 170)">
      <rect width="485" height="85" rx="8" fill="#FFFFFF" stroke="#E2E8F0"/>
      <text x="20" y="28" font-family="'TH Sarabun New', sans-serif" font-size="18" font-weight="bold" fill="#0F172A">เครื่องมือทดสอบและจัดทำรูปเล่ม (Testing &amp; Documentation):</text>
      <text x="20" y="52" font-family="'TH Sarabun New', sans-serif" font-size="16" fill="#334155">• เบราว์เซอร์ &amp; API: Google Chrome DevTools และ Postman / Swagger</text>
      <text x="20" y="72" font-family="'TH Sarabun New', sans-serif" font-size="16" fill="#334155">• จัดพิมพ์รูปเล่มวิจัย: Microsoft Word (จัดรูปแบบตามคู่มือปริญญานิพนธ์)</text>
    </g>
  </g>
</svg>
'''

svg_path = '/Users/millie/Desktop/Project/docs/diagrams/software_dev_tools.svg'
png_path = '/Users/millie/Desktop/Project/docs/diagrams/software_dev_tools.png'

with open(svg_path, 'w', encoding='utf-8') as f:
    f.write(svg_content)

print(f"SVG written to: {svg_path}")

# Convert to PNG using qlmanage and sips
res = subprocess.run(['qlmanage', '-t', '-s', '1600', '-o', '/Users/millie/Desktop/Project/docs/diagrams/', svg_path], capture_output=True, text=True)
print("qlmanage:", res.returncode, res.stdout, res.stderr)

temp_png = svg_path + '.png'
if os.path.exists(temp_png):
    os.rename(temp_png, png_path)
    print(f"Generated PNG: {png_path}")
