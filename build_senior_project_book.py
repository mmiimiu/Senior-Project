# -*- coding: utf-8 -*-
"""
Complete Senior Project Thesis Builder
Produces: /Users/millie/Desktop/Project/docs/ระบบค้นหาคอนโดมิเนียมด้วยภาษาธรรมชาติภาษาไทยตามไลฟ์สไตล์.docx
"""
import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

SRC_DOC = '/Users/millie/Desktop/Project/ชื่อเจคใหม่New.docx'
DST_DOC = '/Users/millie/Desktop/Project/docs/ระบบค้นหาคอนโดมิเนียมด้วยภาษาธรรมชาติภาษาไทยตามไลฟ์สไตล์.docx'
ALGO_IMG = '/Users/millie/Desktop/Project/docs/diagrams/diagram_algo_example.png'

def set_run_font(run, font_name='TH Sarabun New', font_size=16, bold=False, color_rgb=None):
    run.font.name = font_name
    run.font.size = Pt(font_size)
    run.bold = bold
    if color_rgb:
        run.font.color.rgb = color_rgb
    rPr = run._r.get_or_add_rPr()
    rFonts = OxmlElement('w:rFonts')
    rFonts.set(qn('w:ascii'), font_name)
    rFonts.set(qn('w:hAnsi'), font_name)
    rFonts.set(qn('w:cs'), font_name)
    rPr.append(rFonts)

def insert_styled_p_before(target_p, text="", font_name='TH Sarabun New', font_size=16, bold=False, alignment=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=6, line_spacing=1.15):
    new_p = target_p.insert_paragraph_before()
    new_p.alignment = alignment
    new_p.paragraph_format.space_before = Pt(space_before)
    new_p.paragraph_format.space_after = Pt(space_after)
    new_p.paragraph_format.line_spacing = line_spacing
    if text:
        run = new_p.add_run(text)
        set_run_font(run, font_name, font_size, bold)
    return new_p

def set_cell_properties(cell, text, bold=False, font_size=14, alignment=WD_ALIGN_PARAGRAPH.LEFT, fill_hex=None):
    cell.text = ''
    p = cell.paragraphs[0]
    p.alignment = alignment
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    run = p.add_run(text)
    set_run_font(run, font_name='TH Sarabun New', font_size=font_size, bold=bold)
    if fill_hex:
        shading_xml = f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>'
        cell._tc.get_or_add_tcPr().append(parse_xml(shading_xml))
    cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER

def set_table_borders(table):
    tblPr = table._tbl.tblPr
    borders_xml = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>\n'
        f'  <w:top w:val="single" w:sz="6" w:space="0" w:color="000000"/>\n'
        f'  <w:left w:val="single" w:sz="6" w:space="0" w:color="000000"/>\n'
        f'  <w:bottom w:val="single" w:sz="6" w:space="0" w:color="000000"/>\n'
        f'  <w:right w:val="single" w:sz="6" w:space="0" w:color="000000"/>\n'
        f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="D3D3D3"/>\n'
        f'  <w:insideV w:val="single" w:sz="4" w:space="0" w:color="D3D3D3"/>\n'
        f'</w:tblBorders>'
    )
    tblPr.append(borders_xml)

def build():
    print(f"Loading base document: {SRC_DOC}")
    doc = docx.Document(SRC_DOC)

    # 1. Expand DFD Level 1 / Product Data Flow explanation
    # Find paragraph starting with 'คำอธิบายรูปที่ 3.5:'
    dfd_p = None
    for p in doc.paragraphs:
        if p.text.strip().startswith('คำอธิบายรูปที่ 3.5:'):
            dfd_p = p
            break

    if dfd_p:
        print("Found DFD Level 1 explanation. Expanding with Real-World Product Data Flow Architecture...")
        dfd_p.text = (
            "คำอธิบายรูปที่ 3.5: แผนภาพการไหลของข้อมูลระดับที่ 1 (DFD Level 1) แสดงเส้นทางการส่งผ่านและการประมวลผลข้อมูลในระบบ "
            "โดยจำแนกกระบวนการไหลของข้อมูลในผลิตภัณฑ์จริง (Real-World Product Data Flow Architecture) ออกเป็น 6 ขั้นตอนหลัก ดังนี้:\n"
            "1. ส่วนรับคำค้นหาและจัดการสถานะฝั่งไคลเอนต์ (Client State & Input Acquisition): ผู้ใช้ (User) ป้อนข้อความค้นหาภาษาธรรมชาติผ่านคอมโพเนนต์ SearchHero.tsx ของ Next.js ซึ่งมีการจัดการสถานะแบบ Reactive State และส่งคำขอค้นหาแบบ Asynchronous HTTP GET Request (/api/search/nlp?q=...) ไปยังเซิร์ฟเวอร์หลังบ้าน\n"
            "2. การประมวลผลภาษาธรรมชาติและสกัดเอนทิตี 4 มิติ (NLP Tokenization & Multi-Dimensional Entity Extraction): เซิร์ฟเวอร์ FastAPI ส่งประโยคต่อไปยังโมดูล backend/services/nlp_engine.py โดยใช้ไลบรารี PyThaiNLP ตัดคำด้วยตัวตัดคำ newmm ร่วมกับคลังคำศัพท์เฉพาะ (Custom Dictionary) เพื่อสกัดเอนทิตี 4 มิติสำคัญ ได้แก่ (ก) สถานี BTS เป้าหมาย โดยประยุกต์ใช้ Levenshtein Distance ตรวจจับและแก้ไขคำสะกดผิดหรือคำเรียกย่อ เช่น 'อารี' ปรับให้ตรงกับสถานี 'อารีย์' (ข) นโยบายการเลี้ยงสัตว์ ตรวจจับคำว่า 'เลี้ยงสัตว์ได้' หรือ 'ห้ามเลี้ยงสัตว์' (ค) งบประมาณค่าเช่า ใช้ Regular Expression ตรวจจับเพดานราคาและหน่วยเงิน และ (ง) บรรยากาศและไลฟ์สไตล์ ตรวจจับแท็กตาม Lifestyle Taxonomy เช่น 'wfh', 'เงียบสงบ'\n"
            "3. การส่งข้อมูลสะท้อนกลับแบบทันที (Live Criteria Feedback Loop): ข้อมูลเอนทิตีทั้ง 4 มิติที่สกัดได้จะถูกแปลงเป็น Criteria Object และส่งกลับมายังคอมโพเนนต์ CriteriaMonitor.tsx บนหน้าเว็บทันที เพื่อแสดงผลสรุปสถานะเงื่อนไขที่ระบบตรวจพบแบบเรียลไทม์ ทำให้ผู้ใช้มองเห็นความเข้าใจของระบบอย่างโปร่งใส\n"
            "4. การกรองข้อมูลเชิงเงื่อนไขบังคับบนฐานข้อมูล (Hard-Constraint Database Filtering): โมดูลฐานข้อมูล backend/data/database.py นำสถานีเป้าหมาย (รวมถึงสถานีข้างเคียงระยะห่างไม่เกิน 1-2 สถานี) นโยบายสัตว์เลี้ยง และเพดานงบประมาณ ไปแปลงเป็นคำสั่ง SQL เพื่อคัดกรองข้อมูลจากฐานข้อมูล SQLite (backend/data/condos.db) ดึงเฉพาะคอนโดมิเนียมที่ผ่านเกณฑ์เบื้องต้นออกมาเป็นชุดข้อมูลตัวเลือก (Candidate Condominiums)\n"
            "5. การคำนวณคะแนนความสอดคล้องและการจัดอันดับ (Soft Lifestyle Scoring & Ranking): ชุดคอนโดมิเนียมตัวเลือกจะถูกส่งเข้าสู่อัลกอริทึมจัดอันดับแบบผสมผสาน (Hybrid Scoring Algorithm) โดยนำแท็กไลฟ์สไตล์และคำบรรยายของแต่ละโครงการมาเปรียบเทียบกับคำค้นหาของผู้ใช้ ผ่านการคำนวณความตรงกันของแท็ก (Tag Matching) ร่วมกับการคำนวณเวกเตอร์ TF-IDF Cosine Similarity เพื่อให้คะแนนความตรงใจเชิงไลฟ์สไตล์เพิ่มเติม\n"
            "6. การส่งคืนผลลัพธ์และการเรนเดอร์ส่วนติดต่อผู้ใช้ (Response Serialization & UI Presentation): ผลลัพธ์โครงการที่จัดเรียงลำดับคะแนนความสอดคล้องจากสูงสุดลงมา จะถูกแปลงเป็นรูปแบบ JSON และส่งกลับไปยังคอมโพเนนต์ CondoGrid.tsx บนหน้าเว็บ เพื่อเรนเดอร์การ์ดโครงการพร้อมแท็กและคะแนน และเมื่อผู้ใช้คลิกที่การ์ดใด ระบบจะเปิดหน้าต่างป๊อปอัป Modals.tsx แสดงรายละเอียดเชิงลึก ภาพถ่าย และช่องทางการติดต่อ"
        )
        set_run_font(dfd_p.runs[0], font_name='TH Sarabun New', font_size=16, bold=False)
        dfd_p.paragraph_format.line_spacing = 1.15
        dfd_p.paragraph_format.space_after = Pt(6)

    # 2. Insert Hardware & Software Specifications (Table 3.5) and Algorithm Trace (Figure 3.9) before 3.1.5 in BODY
    target_315 = None
    for i, p in enumerate(doc.paragraphs):
        # Match only in body (i > 150)
        if i > 150 and p.text.strip().startswith('3.1.5 ระยะที่ 5:'):
            target_315 = p
            print(f"Found paragraph 3.1.5 in body at index P[{i}]")
            break

    if not target_315:
        raise ValueError("Target paragraph 3.1.5 in body not found!")

    # Insert Section 3.1.4.1 Header & Text before 3.1.5
    insert_styled_p_before(target_315, "3.1.4.1 เครื่องมือและสภาพแวดล้อมที่ใช้ในการพัฒนาระบบ (Hardware & Software Specifications)", font_size=16, bold=True, space_before=10, space_after=4)
    insert_styled_p_before(
        target_315,
        "เพื่อให้การพัฒนาและการประมวลผลระบบค้นหาคอนโดมิเนียมด้วยภาษาธรรมชาติภาษาไทยตามเกณฑ์ไลฟ์สไตล์ทำงานได้อย่างรวดเร็ว ถูกต้อง และมีเสถียรภาพสูง "
        "ผู้วิจัยได้กำหนดรายละเอียดของเครื่องมือ อุปกรณ์ฮาร์ดแวร์ ซอฟต์แวร์ และเฟรมเวิร์กที่ใช้ในสภาพแวดล้อมการพัฒนาจริง ทั้งในฝั่งส่วนหน้า (Frontend) "
        "ฝั่งส่วนบริการหลังบ้าน (Backend & NLP Engine) และระบบฐานข้อมูล ดังแสดงรายละเอียดใน ตารางที่ 3.5",
        font_size=16, bold=False, space_before=0, space_after=6
    )

    insert_styled_p_before(target_315, "ตารางที่ 3.5: รายละเอียดเครื่องมือ ฮาร์ดแวร์ และซอฟต์แวร์ที่ใช้ในการพัฒนาระบบ (Hardware & Software Specifications)", font_size=16, bold=True, space_before=6, space_after=4)

    # Create Table 3.5
    table_specs = doc.add_table(rows=14, cols=4)
    table_specs.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_specs.style = 'Table Grid'
    set_table_borders(table_specs)

    headers = [
        "หมวดหมู่ (Category)",
        "รายการเครื่องมือ (Tool / Component)",
        "เวอร์ชัน / ข้อมูลจำเพาะ (Specification)",
        "บทบาทหน้าที่ในระบบ (Role & Responsibility)"
    ]
    for col_idx, h in enumerate(headers):
        set_cell_properties(table_specs.cell(0, col_idx), h, bold=True, font_size=14, alignment=WD_ALIGN_PARAGRAPH.CENTER, fill_hex="E8EEF5")

    specs_data = [
        ("ฮาร์ดแวร์ (Hardware)", "เครื่องคอมพิวเตอร์ประมวลผลหลัก", "Apple M4 Chip (8-Core CPU / 10-Core GPU, 16 GB Unified Memory, 256 GB NVMe SSD)", "สภาพแวดล้อมประมวลผลและทดสอบระบบทั้ง Frontend, Backend และฐานข้อมูล"),
        ("ระบบปฏิบัติการ (OS)", "macOS Sequoia", "15.6.1 (Build 24G90)", "ระบบปฏิบัติการหลักสำหรับการพัฒนา รันเซิร์ฟเวอร์ และทดสอบโปรแกรม"),
        ("ส่วนหน้า (Frontend)", "Node.js Runtime", "v26.13.1 (รองรับ Node 18+ LTS)", "สภาพแวดล้อมรันไทม์จาวาสคริปต์สำหรับระบบฝั่งหน้าบ้าน"),
        ("ส่วนหน้า (Frontend)", "Next.js Framework", "14.2.35 (App Router Architecture)", "เว็บเฟรมเวิร์กสถาปัตยกรรม React SSR/SSG จัดการเส้นทางและโครงสร้างเพจ"),
        ("ส่วนหน้า (Frontend)", "React & TypeScript", "React 18.3.1 / TypeScript 5.9.3", "พัฒนาคอมโพเนนต์ส่วนติดต่อผู้ใช้แบบ Type-Safe ป้องกันข้อผิดพลาด"),
        ("ส่วนหน้า (Frontend)", "Tailwind CSS & Lucide Icons", "Tailwind CSS 3.4.1 / Lucide 0.378.0", "ออกแบบและจัดรูปแบบส่วนต่อประสานผู้ใช้ Responsive สไตล์ Modern Clean"),
        ("ส่วนหลัง (Backend)", "Python Programming Language", "Python 3.9.6 (64-bit)", "ภาษาคอมพิวเตอร์หลักในการประมวลผลภาษาธรรมชาติและตรรกะทางธุรกิจ"),
        ("ส่วนหลัง (Backend)", "FastAPI Framework", "0.128.8", "เว็บเฟรมเวิร์กประสิทธิภาพสูงสำหรับสร้างบริการ RESTful API แบบอะซิงโครนัส"),
        ("ส่วนหลัง (Backend)", "Uvicorn ASGI Server", "0.39.0", "เว็บเซิร์ฟเวอร์แบบ ASGI สำหรับรันบริการ FastAPI บนพอร์ต 5500"),
        ("การประมวลภาษา (NLP)", "PyThaiNLP Library", "5.4.0 (Engine: newmm)", "ประมวลผลและตัดคำภาษาไทย พร้อมเชื่อมต่อพจนานุกรมคำศัพท์เฉพาะ"),
        ("การเรียนรู้ของเครื่อง (ML)", "Scikit-learn & NumPy", "Scikit-learn 1.6.1 / NumPy 2.0.2", "แปลงข้อจำเป็นเวกเตอร์ TF-IDF และคำนวณค่า Cosine Similarity"),
        ("ตรวจสอบข้อมูล (Validation)", "Pydantic", "2.13.5", "ตรวจสอบความถูกต้องของโครงสร้างข้อมูล (Data Validation) ของ API"),
        ("ฐานข้อมูล (Database)", "SQLite 3", "3.43.2 (ไฟล์ condos.db)", "ฐานข้อมูลเชิงสัมพันธ์น้ำหนักเบา เก็บข้อมูลโครงการคอนโดมิเนียม 100 แห่ง")
    ]

    for row_idx, data in enumerate(specs_data, start=1):
        for col_idx, text in enumerate(data):
            align = WD_ALIGN_PARAGRAPH.CENTER if col_idx == 0 else WD_ALIGN_PARAGRAPH.LEFT
            set_cell_properties(table_specs.cell(row_idx, col_idx), text, bold=False, font_size=13, alignment=align)

    # Set column widths
    col_widths = [Inches(1.3), Inches(1.5), Inches(1.8), Inches(1.9)]
    for row in table_specs.rows:
        for i, w in enumerate(col_widths):
            row.cells[i].width = w

    # Move table before target_315
    target_315._p.addprevious(table_specs._tbl)

    insert_styled_p_before(
        target_315,
        "หมายเหตุ: ระบบได้รับการออกแบบให้ทำงานร่วมกันแบบ Loose Coupling ระหว่าง Next.js และ FastAPI ผ่าน RESTful API "
        "ทำให้สามารถปรับเปลี่ยนฮาร์ดแวร์หรือยกระดับโมเดลภาษาในอนาคตได้อย่างยืดหยุ่น",
        font_size=14, bold=False, space_before=4, space_after=8
    )

    # Insert Section 3.1.4.2 Header & Text
    insert_styled_p_before(target_315, "3.1.4.2 ตัวอย่างการทำงานและการคำนวณของอัลกอริทึม (Algorithm Worked Trace)", font_size=16, bold=True, space_before=10, space_after=4)
    insert_styled_p_before(
        target_315,
        "เพื่อให้เห็นภาพขั้นตอนการประมวลผลคำนวณของอัลกอริทึมอย่างเป็นรูปธรรม ผู้วิจัยได้นำกรณีศึกษาคำค้นหาตัวแทนที่มีเงื่อนไขครบทั้ง 4 มิติ "
        "และมีคำสะกดคลาดเคลื่อนเล็กน้อย คือ “อารี เลี้ยงสัตว์ wfh ไม่เกิน7000” มาแจกแจงกระบวนการทำงานตั้งแต่การรับข้อความดิบ การตัดคำ "
        "การคำนวณค่าความคล้ายคลึงของสถานี การคัดกรองเงื่อนไขบังคับ ไปจนถึงการคำนวณคะแนนความสอดคล้องแบบผสมผสาน (Hybrid Score) "
        "ดังแสดงใน รูปที่ 3.9",
        font_size=16, bold=False, space_before=0, space_after=6
    )

    # Insert Figure 3.9 Caption
    insert_styled_p_before(
        target_315,
        "รูปที่ 3.9 แผนภาพแสดงกระบวนการประมวลผลคำนวณและสกัดข้อมูลของอัลกอริทึม (Algorithm Worked Trace: ตัวอย่างการประมวลผลคำค้นหา 'อารี เลี้ยงสัตว์ wfh ไม่เกิน7000')",
        font_size=16, bold=True, alignment=WD_ALIGN_PARAGRAPH.CENTER, space_before=6, space_after=4
    )

    # Insert Figure 3.9 Image
    img_p = target_315.insert_paragraph_before()
    img_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    img_p.paragraph_format.space_before = Pt(4)
    img_p.paragraph_format.space_after = Pt(6)
    img_run = img_p.add_run()
    img_run.add_picture(ALGO_IMG, width=Inches(5.8))

    # Insert Figure 3.9 Explanation
    insert_styled_p_before(
        target_315,
        "คำอธิบายรูปที่ 3.9: การทำงานของอัลกอริทึมตามกรณีศึกษาคำค้นหา “อารี เลี้ยงสัตว์ wfh ไม่เกิน7000” ประกอบด้วยขั้นตอนการคำนวณ 5 ขั้นตอนหลัก ดังนี้:\n"
        "1. ขั้นตอนการแปลงรูปและตัดคำ (Preprocessing & Tokenization): ระบบรับข้อความค้นหาดิบ ทำความสะอาดช่องว่างซ้ำซ้อน และส่งเข้าสู่ตัวตัดคำ PyThaiNLP (newmm) ได้ผลลัพธ์เป็นรายการคำ ['อารี', ' ', 'เลี้ยงสัตว์', ' ', 'wfh', ' ', 'ไม่เกิน', '7000']\n"
        "2. ขั้นตอนการสกัดเอนทิตี 4 มิติ (Entity Extraction & Typo Handling):\n"
        "   - มิติสถานี (Station): ตรวจพบคำว่า 'อารี' ซึ่งไม่มีในรายชื่อสถานีตรงตัว ระบบจึงนำไปคำนวณค่า Levenshtein Similarity Ratio กับฐานข้อมูลสถานี BTS พบว่าคำว่า 'อารีย์' ได้ค่าความคล้ายคลึงสูงสุด 0.88 (สูงกว่าเกณฑ์ Threshold 0.75) ระบบจึงสกัดได้สถานีเป้าหมายเป็น 'อารีย์'\n"
        "   - มิติสัตว์เลี้ยง (Pet Policy): ตรวจพบคำสำคัญ 'เลี้ยงสัตว์' ในคลังคำศัพท์เชิงบวก จึงกำหนดค่า pet_friendly = True\n"
        "   - มิติงบประมาณ (Budget Ceiling): ตรวจพบนิพจน์ทั่วไป 'ไม่เกิน 7000' จึงแปลงเป็นค่า max_price = 7000 บาท/เดือน\n"
        "   - มิติไลฟ์สไตล์ (Lifestyle Tags): ตรวจพบคำสำคัญ 'wfh' ตรงกับ Lifestyle Taxonomy จึงกำหนด lifestyle_tags = ['wfh']\n"
        "3. ขั้นตอนการคัดกรองเงื่อนไขบังคับบนฐานข้อมูล (Hard-Constraint Database Filtering):\n"
        "   ระบบนำสถานี 'อารีย์' ไปขยายเป็นสถานีข้างเคียงระยะห่างไม่เกิน 1 สถานี ได้แก่ ['สะพานควาย', 'อารีย์', 'สนามเป้า'] จากนั้นสร้างคำสั่ง SQL ดึงข้อมูลจากฐานข้อมูล SQLite: "
        "SELECT * FROM condominiums WHERE station IN ('สะพานควาย','อารีย์','สนามเป้า') AND pet_friendly = 1 AND min_rent_price <= 7000; "
        "ซึ่งดึงโครงการตัวเลือกที่ผ่านเงื่อนไขบังคับได้ 2 โครงการ ได้แก่ (1) The Rhythm Ari (สถานีอารีย์, ค่าเช่า 6,500 บ./ด.) และ (2) Noble Lite Phaholyothin (สถานีสะพานควาย, ค่าเช่า 7,000 บ./ด.)\n"
        "4. ขั้นตอนการคำนวณคะแนนความสอดคล้องแบบผสมผสาน (Hybrid Scoring Calculation):\n"
        "   - โครงการ The Rhythm Ari: ได้คะแนนสถานีตรงเป้าหมาย = 50 คะแนน, คะแนนสัตว์เลี้ยงตรง = 30 คะแนน, คะแนนงบประมาณผ่านเกณฑ์ = 20 คะแนน, คะแนนแท็ก 'wfh' ตรงกัน = 16 คะแนน, และคะแนน TF-IDF Cosine Similarity ของคำบรรยาย = 8.5 คะแนน รวมคะแนนทั้งสิ้น = 50 + 30 + 20 + 16 + 8.5 = 124.5 คะแนน\n"
        "   - โครงการ Noble Lite Phaholyothin: ได้คะแนนสถานีข้างเคียง (ห่าง 1 สถานี) = 35 - 5(1) = 30 คะแนน, คะแนนสัตว์เลี้ยงตรง = 30 คะแนน, คะแนนงบประมาณผ่านเกณฑ์ = 20 คะแนน, คะแนนแท็ก 'wfh' ตรงกัน = 16 คะแนน, และคะแนน TF-IDF Cosine Similarity ของคำบรรยาย = 7.2 คะแนน รวมคะแนนทั้งสิ้น = 30 + 30 + 20 + 16 + 7.2 = 103.2 คะแนน\n"
        "5. ขั้นตอนการจัดอันดับและส่งคืนผลลัพธ์ (Ranking & Response Output): ระบบจัดเรียงผลลัพธ์โดยให้ The Rhythm Ari อยู่ในอันดับที่ 1 (124.5 คะแนน) และ Noble Lite Phaholyothin อยู่ในอันดับที่ 2 (103.2 คะแนน) พร้อมส่งคืนชุดข้อมูล JSON และอัปเดตแถบ Criteria Monitor ให้ผู้ใช้ทราบทันที",
        font_size=16, bold=False, space_before=4, space_after=8
    )

    # 3. Update Front Matter (TOC, List of Figures, List of Tables)
    print("Updating Front Matter (TOC, List of Figures, List of Tables)...")

    # In TOC: find 3.1.4 and add 3.1.4.1 and 3.1.4.2
    for i in range(len(doc.paragraphs)):
        p = doc.paragraphs[i]
        if i < 100 and "3.1.4 ระยะที่ 4: การพัฒนาระบบ (Implementation)" in p.text:
            print(f"Adding subheadings under 3.1.4 in TOC after P[{i}]...")
            next_p = doc.paragraphs[i+1]
            insert_styled_p_before(next_p, "            3.1.4.1 เครื่องมือและสภาพแวดล้อมที่ใช้ในการพัฒนาระบบ  .  .  20", font_size=16, space_before=0, space_after=2)
            insert_styled_p_before(next_p, "            3.1.4.2 ตัวอย่างการทำงานและการคำนวณของอัลกอริทึม  .  .  22", font_size=16, space_before=0, space_after=2)
            break

    # In List of Figures: find รูปที่ 3.8 and add รูปที่ 3.9
    for i in range(len(doc.paragraphs)):
        p = doc.paragraphs[i]
        if i < 120 and "รูปที่ 3.8 หน้าต่างแสดงรายละเอียดโครงการคอนโดมิเนียม" in p.text:
            print(f"Adding Figure 3.9 to List of Figures after P[{i}]...")
            next_p = doc.paragraphs[i+1]
            insert_styled_p_before(next_p, "รูปที่ 3.9 แผนภาพแสดงกระบวนการประมวลผลคำนวณและสกัดข้อมูลของอัลกอริทึม (Algorithm Worked Trace)  .  .  22", font_size=16, space_before=0, space_after=2)
            break

    # In List of Tables: replace Table 1.1 with Table 3.1, and insert Table 3.5 after Table 3.4
    # In List of Tables: remove non-existent Table 1.1, and insert Table 3.5 after Table 3.4
    for i in range(len(doc.paragraphs)):
        p = doc.paragraphs[i]
        if i < 130 and "ตารางที่ 1.1 แผนการดำเนินงานวิจัย" in p.text:
            print(f"Removing non-existent Table 1.1 in List of Tables at P[{i}]...")
            p._element.getparent().remove(p._element)
            break

    for i in range(len(doc.paragraphs)):
        p = doc.paragraphs[i]
        if i < 130 and "ตารางที่ 3.4 ข้อกำหนดบริการ RESTful API ของระบบ" in p.text:
            print(f"Adding Table 3.5 to List of Tables after P[{i}]...")
            next_p = doc.paragraphs[i+1]
            insert_styled_p_before(next_p, "ตารางที่ 3.5 รายละเอียดเครื่องมือ ฮาร์ดแวร์ และซอฟต์แวร์ที่ใช้ในการพัฒนาระบบ (Specifications)  .  .  21", font_size=16, space_before=0, space_after=2)
            break

    print(f"Saving final Senior Project book to: {DST_DOC}")
    doc.save(DST_DOC)
    print("Senior Project Book built and saved successfully!")

if __name__ == '__main__':
    build()
