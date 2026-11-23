"""Service Layer: Thai NLP & Semantic Search Engine (4 Core Dimensions)"""
import re
from typing import Dict, Any, List, Optional
try:
    from pythainlp.tokenize import word_tokenize  # type: ignore
    from pythainlp.corpus import thai_stopwords   # type: ignore
except ImportError:
    def word_tokenize(text: str, **kwargs) -> List[str]: return [w for w in re.split(r'(\s+|[^\u0e00-\u0e7fa-zA-Z0-9])', text) if w and not w.isspace()]
    def thai_stopwords() -> set: return set()
try: from sklearn.feature_extraction.text import TfidfVectorizer; from sklearn.metrics.pairwise import cosine_similarity  # type: ignore
except ImportError: TfidfVectorizer = cosine_similarity = None
from backend.data.database import fetch_all_condos

KNOWN_STATIONS = [
    {"canonical": "BTS วัดพระศรีมหาธาตุ (บางเขน)", "keywords": ["วัดพระศรีมหาธาตุ", "วัดพระศรี", "บางเขน", "bts วัดพระศรีมหาธาตุ", "bts บางเขน", "วงเวียนบางเขน", "พหลโยธิน 59"], "line": "BTS Sukhumvit Line", "zone": "Bangkhen-Saphanmai", "neighbors": ["BTS สะพานใหม่", "BTS พหลโยธิน 59", "BTS กรมทหารราบที่ 11", "BTS มหาวิทยาลัยเกษตรศาสตร์"]}, {"canonical": "BTS มหาวิทยาลัยเกษตรศาสตร์", "keywords": ["มหาวิทยาลัยเกษตรศาสตร์", "มหาวิทยาลัยเกษตร", "ม.เกษตรศาสตร์", "ม.เกษตร", "bts มหาวิทยาลัยเกษตรศาสตร์", "bts มหาวิทยาลัยเกษตร", "bts ม.เกษตร", "เกษตรศาสตร์", "เกษตร", "kasetsart", "kasetsart university", "ม.เกษตรฯ", "สถานีม.เกษตร", "สถานีมหาวิทยาลัยเกษตรศาสตร์", "เกษตร-นวมินทร์"], "line": "BTS Sukhumvit Line", "zone": "Kaset-Phahol", "neighbors": ["BTS เสนานิคม", "BTS รัชโยธิน", "BTS สายหยุด", "BTS หมอชิต"]}, {"canonical": "BTS เสนานิคม", "keywords": ["เสนานิคม", "bts เสนานิคม", "senanikom", "พหลโยธิน 34", "เสนา"], "line": "BTS Sukhumvit Line", "zone": "Kaset-Phahol", "neighbors": ["BTS มหาวิทยาลัยเกษตรศาสตร์", "BTS รัชโยธิน"]}, {"canonical": "BTS รัชโยธิน", "keywords": ["รัชโยธิน", "bts รัชโยธิน", "ratchayothin", "เมเจอร์รัชโยธิน"], "line": "BTS Sukhumvit Line", "zone": "Kaset-Phahol", "neighbors": ["BTS เสนานิคม", "BTS มหาวิทยาลัยเกษตรศาสตร์", "BTS ห้าแยกลาดพร้าว"]}, {"canonical": "BTS อารีย์", "keywords": ["อารีย์", "อารี", "bts อารีย์", "สถานีอารีย์", "ari", "ซอยอารีย์"], "line": "BTS Sukhumvit Line", "zone": "Phahol-Ari", "neighbors": ["BTS สะพานควาย", "BTS อนุสาวรีย์ชัยสมรภูมิ", "BTS หมอชิต"]}, {"canonical": "BTS หมอชิต", "keywords": ["หมอชิต", "bts หมอชิต", "สถานีหมอชิต", "mochit", "สวนจตุจักร", "จตุจักร"], "line": "BTS Sukhumvit Line", "zone": "Chatuchak", "neighbors": ["BTS สะพานควาย", "BTS ห้าแยกลาดพร้าว"]}, {"canonical": "BTS อุดมสุข", "keywords": ["อุดมสุข", "bts อุดมสุข", "udom suk", "udomsuk"], "line": "BTS Sukhumvit Line", "zone": "Bangna-Udomsuk", "neighbors": ["BTS บางนา", "BTS ปุณณวิถี"]}, {"canonical": "BTS บางนา", "keywords": ["บางนา", "bts บางนา", "bang na", "bangna", "เซ็นทรัลบางนา"], "line": "BTS Sukhumvit Line", "zone": "Bangna-Udomsuk", "neighbors": ["BTS อุดมสุข", "BTS แบริ่ง"]}, {"canonical": "BTS ทองหล่อ", "keywords": ["ทองหล่อ", "bts ทองหล่อ", "thong lor", "thonglor", "สุขุมวิท 55"], "line": "BTS Sukhumvit Line", "zone": "Mid-Sukhumvit", "neighbors": ["BTS เอกมัย", "BTS พร้อมพงษ์"]}, {"canonical": "BTS เอกมัย", "keywords": ["เอกมัย", "bts เอกมัย", "ekkamai", "ekamai", "สุขุมวิท 63"], "line": "BTS Sukhumvit Line", "zone": "Mid-Sukhumvit", "neighbors": ["BTS ทองหล่อ", "BTS พระโขนง"]}, {"canonical": "BTS อ่อนนุช", "keywords": ["อ่อนนุช", "bts อ่อนนุช", "on nut", "onnut", "สุขุมวิท 77", "สุขุมวิท 81"], "line": "BTS Sukhumvit Line", "zone": "Onnut-Phrakhanong", "neighbors": ["BTS พระโขนง", "BTS บางจาก"]}, {"canonical": "BTS ปุณณวิถี", "keywords": ["ปุณณวิถี", "bts ปุณณวิถี", "punnawithi", "สุขุมวิท 101", "true digital park"], "line": "BTS Sukhumvit Line", "zone": "Punnawithi", "neighbors": ["BTS บางจาก", "BTS อุดมสุข"]}, {"canonical": "BTS แบริ่ง", "keywords": ["แบริ่ง", "bts แบริ่ง", "bearing", "สุขุมวิท 107"], "line": "BTS Sukhumvit Line", "zone": "Bearing-Samutprakarn", "neighbors": ["BTS บางนา", "BTS สำโรง"]}, {"canonical": "BTS พร้อมพงษ์", "keywords": ["พร้อมพงษ์", "bts พร้อมพงษ์", "phrom phong", "เอ็มควอเทียร์", "เอ็มโพเรียม", "สุขุมวิท 24"], "line": "BTS Sukhumvit Line", "zone": "Inner-Sukhumvit", "neighbors": ["BTS อโศก", "BTS ทองหล่อ"]}, {"canonical": "BTS อโศก", "keywords": ["อโศก", "bts อโศก", "asoke", "asok", "terminal 21", "สุขุมวิท 21", "อโศกมนตรี"], "line": "BTS Sukhumvit Line", "zone": "Inner-Sukhumvit", "neighbors": ["BTS นานา", "BTS พร้อมพงษ์"]}, {"canonical": "BTS อนุสาวรีย์ชัยสมรภูมิ", "keywords": ["อนุสาวรีย์", "อนุสาวรีย์ชัย", "อนุสาวรีย์ชัยสมรภูมิ", "bts อนุสาวรีย์", "victory monument", "ราชวิถี"], "line": "BTS Sukhumvit Line", "zone": "Phayathai-Victory", "neighbors": ["BTS พญาไท", "BTS สนามเป้า", "BTS อารีย์"]}, {"canonical": "BTS พระโขนง", "keywords": ["พระโขนง", "bts พระโขนง", "phra khanong", "สุขุมวิท 71"], "line": "BTS Sukhumvit Line", "zone": "Onnut-Phrakhanong", "neighbors": ["BTS เอกมัย", "BTS อ่อนนุช"]}, {"canonical": "BTS บางจาก", "keywords": ["บางจาก", "bts บางจาก", "bang chak", "สุขุมวิท 93"], "line": "BTS Sukhumvit Line", "zone": "Punnawithi", "neighbors": ["BTS อ่อนนุช", "BTS ปุณณวิถี"]}, {"canonical": "BTS สายหยุด", "keywords": ["สายหยุด", "bts สายหยุด", "sai yud", "พหลโยธิน 50", "พหล 50"], "line": "BTS Sukhumvit Line", "zone": "Upper-Phahol", "neighbors": ["BTS มหาวิทยาลัยเกษตรศาสตร์", "BTS วัดพระศรีมหาธาตุ (บางเขน)"]},
    {"canonical": "BTS สะพานใหม่", "keywords": ["สะพานใหม่", "bts สะพานใหม่", "ตลาดยิ่งเจริญ"], "line": "BTS Sukhumvit Line", "zone": "Upper-Phahol", "neighbors": ["BTS สายหยุด", "BTS โรงพยาบาลภูมิพลอดุลยเดช"]}, {"canonical": "BTS สยาม", "keywords": ["สยาม", "bts สยาม", "siam", "เซ็นทรัลเวิลด์", "สยามพารากอน", "สยามสแควร์", "แถวจุฬา", "ย่านจุฬา", "ใกล้จุฬา", "สามย่าน", "สามย่านมิตรทาวน์"], "line": "BTS Sukhumvit Line", "zone": "Chula-Samyan-Siam", "neighbors": ["BTS ชิดลม", "BTS สนามกีฬาแห่งชาติ", "BTS ราชเทวี"]}, {"canonical": "BTS สนามกีฬาแห่งชาติ", "keywords": ["สนามกีฬาแห่งชาติ", "สนามกีฬา", "bts สนามกีฬาแห่งชาติ", "national stadium", "เกษมสันต์", "จุฬา", "จุฬาลงกรณ์", "ม.จุฬา", "mbk", "มาบุญครอง"], "line": "BTS Silom Line", "zone": "Chula-Samyan-Siam", "neighbors": ["BTS สยาม"]}, {"canonical": "BTS ศาลาแดง", "keywords": ["ศาลาแดง", "bts ศาลาแดง", "sala daeng", "สีลม", "silom", "ลุมพินี", "สวนลุมพินี"], "line": "BTS Silom Line", "zone": "Chula-Samyan-Siam", "neighbors": ["BTS ช่องนนทรี", "BTS ราชดำริ", "BTS สยาม"]}, {"canonical": "BTS ห้าแยกลาดพร้าว", "keywords": ["ห้าแยกลาดพร้าว", "ลาดพร้าว", "bts ห้าแยกลาดพร้าว", "เซ็นทรัลลาดพร้าว", "ยูเนี่ยนมอลล์", "พหลโยธิน"], "line": "BTS Sukhumvit Line", "zone": "Ladprao", "neighbors": ["BTS หมอชิต", "BTS พหลโยธิน 24"]}, {"canonical": "BTS คูคต", "keywords": ["คูคต", "bts คูคต", "ลำลูกกา", "รังสิต"], "line": "BTS Sukhumvit Line", "zone": "KhuKhot", "neighbors": ["BTS แยก คปอ."]}, {"canonical": "BTS แยก คปอ.", "keywords": ["แยก คปอ.", "แยก คปอ", "แยกคปอ", "คปอ", "สายไหม", "ดอนเมือง"], "line": "BTS Sukhumvit Line", "zone": "KhuKhot", "neighbors": ["BTS คูคต", "BTS พิพิธภัณฑ์กองทัพอากาศ"]}, {"canonical": "BTS ชิดลม", "keywords": ["ชิดลม", "bts ชิดลม", "chidlom", "ใกล้ซีดับเบิ้ลดี", "cwdc", "วิทยุ"], "line": "BTS Sukhumvit Line", "zone": "CBD-Chidlom", "neighbors": ["BTS สยาม", "BTS เพลินจิต"]}, {"canonical": "BTS เพลินจิต", "keywords": ["เพลินจิต", "bts เพลินจิต", "phloen chit", "เซ็นทรัลเอ็มบาสซี", "ถนนวิทยุ", "สถานทูต"], "line": "BTS Sukhumvit Line", "zone": "CBD-Chidlom", "neighbors": ["BTS ชิดลม", "BTS นานา"]}, {"canonical": "BTS นานา", "keywords": ["นานา", "bts นานา", "nana", "สุขุมวิท 3", "สุขุมวิท 5", "arab street"], "line": "BTS Sukhumvit Line", "zone": "Lower-Sukhumvit", "neighbors": ["BTS เพลินจิต", "BTS อโศก"]}, {"canonical": "BTS ช่องนนทรี", "keywords": ["ช่องนนทรี", "bts ช่องนนทรี", "chong nonsi", "สาทร", "sathorn", "ย่านสาทร", "silom complex"], "line": "BTS Silom Line", "zone": "Sathorn-Silom", "neighbors": ["BTS ศาลาแดง", "BTS สุรศักดิ์", "BTS เซนต์หลุยส์"]}, {"canonical": "BTS พญาไท", "keywords": ["พญาไท", "bts พญาไท", "phaya thai", "แอร์พอร์ตลิงก์พญาไท"], "line": "BTS Sukhumvit Line", "zone": "Phayathai-Victory", "neighbors": ["BTS อนุสาวรีย์ชัยสมรภูมิ", "BTS ราชเทวี"]}, {"canonical": "BTS ราชเทวี", "keywords": ["ราชเทวี", "bts ราชเทวี", "ratchathewi", "เพชรบุรี"], "line": "BTS Sukhumvit Line", "zone": "Phayathai-Victory", "neighbors": ["BTS พญาไท", "BTS สยาม"]}, {"canonical": "BTS สนามเป้า", "keywords": ["สนามเป้า", "bts สนามเป้า", "sanam pao", "ททบ.5"], "line": "BTS Sukhumvit Line", "zone": "Phahol-Ari", "neighbors": ["BTS อารีย์", "BTS อนุสาวรีย์ชัยสมรภูมิ"]}, {"canonical": "BTS สำโรง", "keywords": ["สำโรง", "bts สำโรง", "samrong", "อิมพีเรียลสำโรง"], "line": "BTS Sukhumvit Line", "zone": "Bearing-Samutprakarn", "neighbors": ["BTS แบริ่ง", "BTS ปู่เจ้า"]}, {"canonical": "BTS ปู่เจ้า", "keywords": ["ปู่เจ้า", "bts ปู่เจ้า", "pu chao", "ปู่เจ้าสมิงพราย"], "line": "BTS Sukhumvit Line", "zone": "Bearing-Samutprakarn", "neighbors": ["BTS สำโรง", "BTS ช้างเอราวัณ"]}, {"canonical": "BTS เคหะฯ", "keywords": ["เคหะฯ", "เคหะ", "bts เคหะ", "เคหะสมุทรปราการ", "บางปู"], "line": "BTS Sukhumvit Line", "zone": "Samutprakarn", "neighbors": ["BTS สายลวด"]}, {"canonical": "BTS สะพานควาย", "keywords": ["สะพานควาย", "bts สะพานควาย", "saphan khwai", "พหลโยธิน 35", "อารีย์เหนือ"], "line": "BTS Sukhumvit Line", "zone": "Phahol-Ari", "neighbors": ["BTS อารีย์", "BTS หมอชิต"]}, {"canonical": "BTS วุฒากาศ", "keywords": ["วุฒากาศ", "bts วุฒากาศ", "wutthakat", "ราษฎร์บูรณะ", "ถนนสุขสวัสดิ์"], "line": "BTS Silom Line", "zone": "Thonburi-South", "neighbors": ["BTS โพธิ์นิมิตร", "BTS วงเวียนใหญ่"]}
]
TRANSIT_ROUTES = [
    ["คูคต", "แยก คปอ.", "พิพิธภัณฑ์กองทัพอากาศ", "โรงพยาบาลภูมิพลอดุลยเดช", "สะพานใหม่", "สายหยุด", "พหลโยธิน 59", "วัดพระศรีมหาธาตุ", "กรมทหารราบที่ 11", "บางบัว", "กรมป่าไม้", "มหาวิทยาลัยเกษตรศาสตร์", "เสนานิคม", "รัชโยธิน", "พหลโยธิน 24", "ห้าแยกลาดพร้าว", "หมอชิต", "สะพานควาย", "อารีย์", "สนามเป้า", "อนุสาวรีย์ชัยสมรภูมิ", "พญาไท", "ราชเทวี", "สยาม", "ชิดลม", "เพลินจิต", "นานา", "อโศก", "พร้อมพงษ์", "ทองหล่อ", "เอกมัย", "พระโขนง", "อ่อนนุช", "บางจาก", "ปุณณวิถี", "อุดมสุข", "บางนา", "แบริ่ง", "สำโรง", "ปู่เจ้า", "ช้างเอราวัณ", "โรงเรียนนายเรือ", "ปากน้ำ", "ศรีนครินทร์", "แพรกษา", "สายลวด", "เคหะฯ"],
    ["สนามกีฬาแห่งชาติ", "สยาม", "ราชดำริ", "ศาลาแดง", "ช่องนนทรี", "เซนต์หลุยส์", "สุรศักดิ์", "สะพานตากสิน", "กรุงธนบุรี", "วงเวียนใหญ่", "โพธิ์นิมิตร", "ตลาดพลู", "วุฒากาศ", "บางหว้า"],
]
OUT_OF_SCOPE_PLACES = ["มีนบุรี", "ลาดกระบัง", "บางซื่อ", "เตาปูน", "พระราม 9", "พระรามเก้า", "พระราม9", "ห้วยขวาง", "สุทธิสาร", "รัชดา", "ศูนย์วัฒนธรรม", "คลองเตย", "ลุมพินี", "สามย่าน", "หัวลำโพง", "ท่าพระ", "บางแค", "หลักสอง", "บางใหญ่", "ไทรม้า", "พระนั่งเกล้า", "แจ้งวัฒนะ", "ปากเกร็ด", "รามอินทรา", "คู้บอน", "วัชรพล", "บางชัน", "บางกะปิ", "ลำสาลี", "รามคำแหง", "รังสิต", "ดอนเมือง", "หลักหก", "สุวรรณภูมิ", "พัฒนาการ", "ศรีนครินทร์", "คลองบางไผ่", "ติวานนท์", "แคราย", "บางบัวทอง", "ประชาชื่น", "งามวงศ์วาน", "พระราม 2", "พระราม 3", "จรัญสนิทวงศ์", "ปิ่นเกล้า", "ตลิ่งชัน", "ศาลายา", "พุทธมณฑล", "ลาดปลาเค้า"]
PET_POS = ["เลี้ยงสัตว์ได้", "เลี้ยงสัตว์", "สัตว์เลี้ยง", "เลี้ยงหมา", "เลี้ยงแมว", "เลี้ยงสุนัข", "น้องหมา", "น้องแมว", "pet friendly", "pet-friendly", "petfriendly", "ทาสแมว", "ทาสหมา", "แมว", "สัตว์", "สุนัข"]
PET_NEG = ["ห้ามเลี้ยงสัตว์", "ไม่อนุญาตเลี้ยงสัตว์", "ไม่อนุญาตให้เลี้ยงสัตว์", "ไม่เลี้ยงสัตว์", "ไม่รับสัตว์เลี้ยง", "ไม่รับสัตว์", "ห้ามเลี้ยงหมา", "ห้ามเลี้ยงแมว", "ไม่เอาสัตว์เลี้ยง", "ไม่เอาสัตว์", "no pet", "no pets", "ห้ามเลี้ยง", "ไม่เลี้ยง"]
LIFESTYLE_CLUSTERS = {
    "quiet": {"keywords": ["เงียบสงบ", "สงบ", "เงียบ", "เงียบๆ", "ไม่พลุกพล่าน", "ไม่วุ่นวาย", "quiet", "peaceful", "สงบเงียบ"], "tag": "เงียบสงบ"}, "private": {"keywords": ["เป็นส่วนตัว", "ส่วนตัว", "private"], "tag": "เป็นส่วนตัว"},
    "wfh": {"keywords": ["wfh", "work from home", "ทำงานที่บ้าน", "เหมาะกับ wfh", "co-working", "ห้องทำงาน", "อ่านหนังสือ", "โต๊ะทำงาน", "สายเทค"], "tag": "เหมาะกับ WFH"}, "view": {"keywords": ["วิวเมืองสวย", "วิวสวย", "วิวเมือง", "วิวมุมสูง", "ชั้นสูง", "วิวสูง", "วิวแม่น้ำ", "ริมแม่น้ำ", "river view"], "tag": "วิวเมืองสวย"},
    "near_transit": {"keywords": ["ติด bts", "ติด mrt", "ติดรถไฟฟ้า", "ใกล้ bts", "ใกล้ mrt", "เดินถึงรถไฟฟ้า", "เดินไปสถานีได้", "เดินไม่เกิน", "เดินใกล้ๆ", "0 เมตร"], "tag": "ติดรถไฟฟ้า"}, "convenient": {"keywords": ["เดินทางสะดวก", "ของกินเยอะ", "ใกล้ห้าง", "ติดห้าง", "คาเฟ่", "สตรีทฟู้ด", "เซ็นทรัล", "ของกินสะดวก"], "tag": "เดินทางสะดวก"},
    "nature_green": {"keywords": ["ร่มรื่น", "ต้นไม้เยอะ", "พื้นที่สีเขียว", "ใกล้สวน", "สวนสาธารณะ", "จตุจักร", "ธรรมชาติ", "วิ่งออกกำลังกาย", "มีที่วิ่งเล่น"], "tag": "ร่มรื่น"}, "budget_friendly": {"keywords": ["ราคาประหยัด", "งบน้อย", "ไม่แพง", "คุ้มค่า", "ราคาถูก", "ราคาเบาๆ", "สบายกระเป๋า"], "tag": "ราคาประหยัด"},
}
def _normalize_station_name(station: str) -> str:
    return re.sub(r"[\u0e47-\u0e4c\s\-\.ฯ]", "", re.sub(r"^(?:BTS|MRT|SRT|ARL)\s*", "", re.sub(r"\([^)]*\)", "", station or ""), flags=re.IGNORECASE)).lower()
def station_stops_away(target_station: str, condo_station: str):
    target, condo = _normalize_station_name(target_station), _normalize_station_name(condo_station)
    if not target or not condo: return None
    norm_routes = [[_normalize_station_name(f"BTS {s}") for s in r] for r in TRANSIT_ROUTES]
    for nr in norm_routes:
        t_pos, c_pos = [i for i, n in enumerate(nr) if n == target], [i for i, n in enumerate(nr) if n == condo]
        if t_pos and c_pos: return min(abs(ti - ci) for ti in t_pos for ci in c_pos)
    siam = _normalize_station_name("BTS สยาม")
    for r1, r2 in ((norm_routes[0], norm_routes[1]), (norm_routes[1], norm_routes[0])):
        if target in r1 and condo in r2 and siam in r1 and siam in r2: return abs(r1.index(target) - r1.index(siam)) + abs(r2.index(condo) - r2.index(siam))
    return 0 if target == condo else None
def _normalize_condo(c: dict) -> dict:
    digits = re.sub(r"[^0-9]", "", str(c.get("distance", "0")))
    d = c.get("distance_m") if c.get("distance_m") is not None else (int(digits) if digits else 500)
    return {"id": c.get("id"), "name": c.get("name", ""), "station": c.get("station", ""), "line": c.get("line", f"BTS {c.get('transitType', 'Sukhumvit Line')}"), "transitType": c.get("transitType", "BTS"), "distance": c.get("distance", f"{d} ม."), "distance_m": d, "price": c.get("price", c.get("price_per_month", 0)), "price_per_month": c.get("price_per_month", c.get("price", 0)), "pet_friendly": c.get("pet_friendly", c.get("petFriendly", False)), "petFriendly": c.get("petFriendly", c.get("pet_friendly", False)), "lifestyle": c.get("lifestyle", c.get("lifestyle_tags", [])), "lifestyle_tags": c.get("lifestyle_tags", c.get("lifestyle", [])), "facilities": c.get("facilities", []), "description": c.get("description", c.get("desc", "")), "desc": c.get("desc", c.get("description", "")), "image": c.get("image", "")}
def _lev(a: str, b: str) -> int:
    m, n = len(a), len(b); dp = [[i if j == 0 else (j if i == 0 else 0) for j in range(n + 1)] for i in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1): dp[i][j] = dp[i - 1][j - 1] if a[i - 1] == b[j - 1] else 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]

class ThaiNLPSearchEngine:
    def __init__(self, dataset: Optional[List[Dict[str, Any]]] = None):
        raw_data = dataset if dataset is not None else fetch_all_condos()
        self.dataset, self.stop_words = [_normalize_condo(c) for c in raw_data], list(thai_stopwords())
        corpus = [" ".join([t for t in word_tokenize(f"{c['name']} {c['station']} {c['line']} {' '.join(c['lifestyle_tags'])} {' '.join(c['facilities'])} {c['description']}".lower(), engine="newmm", keep_whitespace=False) if t not in self.stop_words and len(t.strip()) > 1]) for c in self.dataset]
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2)) if TfidfVectorizer else None
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus) if self.vectorizer else None

    def extract_entities(self, query: str) -> Dict[str, Any]:
        q_lower, nq = query.lower(), re.sub(r"[\u0e47-\u0e4c\s\-\.ฯ]", "", (query or "").lower())
        norm_th = lambda s: re.sub(r"[\u0e47-\u0e4c\s\-\.ฯ]", "", (s or "").lower())
        ext = {"raw_query": query, "station": None, "line": None, "out_of_scope": None, "pet_friendly": None, "min_price": None, "max_price": None, "lifestyle_intents": [], "lifestyle_tags_matched": [], "tokens": word_tokenize(query, engine="newmm", keep_whitespace=False)}
        for st_name in sorted({s for r in TRANSIT_ROUTES for s in r}, key=len, reverse=True):
            if norm_th(st_name) in nq:
                ext["station"] = "BTS วัดพระศรีมหาธาตุ (บางเขน)" if st_name == "วัดพระศรีมหาธาตุ" else f"BTS {st_name}"
                ext["line"] = "BTS Silom Line" if st_name in TRANSIT_ROUTES[1] else "BTS Sukhumvit Line"; break
        for st in (KNOWN_STATIONS if not ext["station"] else []):
            if any(kw in q_lower or norm_th(kw) in nq for kw in st["keywords"]): ext["station"], ext["line"] = st["canonical"], st["line"]; break
        for st in (KNOWN_STATIONS if not ext["station"] else []):
            for nkw in [norm_th(kw) for kw in st["keywords"] if len(norm_th(kw)) >= 5]:
                if any(_lev(nq[i:i + l], nkw) <= 1 for l in (len(nkw) - 1, len(nkw), len(nkw) + 1) if l >= 5 for i in range(max(0, len(nq) - l + 1))): ext["station"], ext["line"] = st["canonical"], st["line"]; break
            if ext["station"]: break
        if not ext["station"]:
            for oos in OUT_OF_SCOPE_PLACES:
                if norm_th(oos) in nq or oos in q_lower: ext["out_of_scope"] = oos; break
            if not ext["out_of_scope"] and any(k in q_lower or norm_th(k) in nq for k in ["mrt", "เอ็มอาร์ที", "สายสีน้ำเงิน", "สายสีชมพู", "สายสีเหลือง", "สายสีม่วง", "สายสีแดง", "arl", "แอร์พอร์ตลิงก์"]): ext["out_of_scope"] = "รถไฟฟ้านอกสายสีเขียว"
            ext["line"] = "BTS Sukhumvit Line" if any(k in q_lower or norm_th(k) in nq for k in ["bts", "บีทีเอส", "สายสีเขียว"]) else None
        if any(neg in q_lower or norm_th(neg) in nq for neg in PET_NEG): ext["pet_friendly"] = False
        elif any(pos in q_lower or norm_th(pos) in nq for pos in PET_POS) or re.search(r"(?<!เ)หมา(?![ยกดง])|\bpets?\b", q_lower): ext["pet_friendly"] = True
        for th_text, val in {"หมื่นห้า": 15000, "หมื่นต้นๆ": 12000, "หมื่นต้น": 12000, "หมื่นกลาง": 15000, "หมื่นปลาย": 18000, "หมื่นสอง": 12000, "หมื่นสาม": 13000, "หมื่นสี่": 14000, "หมื่นหก": 16000, "หมื่นเจ็ด": 17000, "หมื่นแปด": 18000, "หมื่นเก้า": 19000, "สองหมื่น": 20000, "สามหมื่น": 30000, "สี่หมื่น": 40000, "ห้าหมื่น": 50000, "หนึ่งหมื่น": 10000, "หมื่นเดียว": 10000, "ไม่เกินหมื่น": 10000, "ต่ำกว่าหมื่น": 10000, "เก้าพัน": 9000, "แปดพัน": 8000, "เจ็ดพัน": 7000, "หกพัน": 6000, "ห้าพัน": 5000}.items():
            if th_text in q_lower: ext["max_price"] = val
        if not ext["max_price"]:
            for pat, p_type in [(r'(\d+[\d,]*)\s*(?:-|ถึง|to)\s*(\d+[\d,]*)', 'range'), (r'(\d+(?:\.\d+)?)\s*หมื่น', 'muen'), (r'(\d+)\s*พัน', 'phan'), (r'(?:ไม่เกิน|ต่ำกว่า|งบไม่เกิน|งบ|งบประมาณ|ราคาไม่เกิน|ราคา|ไม่เกินงบ|คุมงบ)\s*(\d+[\d,]*)', 'max'), (r'(?:มากกว่า|ตั้งแต่|เกิน)\s*(\d+[\d,]*)', 'min'), (r'(\d+)\s*k\b', 'k_val')]:
                m = re.search(pat, q_lower)
                if m and p_type == 'range': ext["min_price"], ext["max_price"] = int(m.group(1).replace(',', '')), int(m.group(2).replace(',', '')); break
                elif m and p_type == 'muen': ext["max_price"] = int(float(m.group(1)) * 10000); break
                elif m and p_type in ('phan', 'k_val'): ext["max_price"] = int(m.group(1)) * 1000; break
                elif m and p_type in ('max', 'min') and int(m.group(1).replace(',', '')) >= 3000: ext[f"{p_type}_price"] = int(m.group(1).replace(',', '')); break
        if not ext["max_price"] and not ext["min_price"]:
            for num_str in re.findall(r'(?<!\d)(\d{4,6})(?!\d)', q_lower.replace(',', '')):
                if 3000 <= int(num_str) <= 200000: ext["max_price"] = int(num_str); break
        for cid, data in LIFESTYLE_CLUSTERS.items():
            if any(kw in q_lower for kw in data["keywords"]):
                if data["tag"] not in ext["lifestyle_tags_matched"]: ext["lifestyle_tags_matched"].append(data["tag"])
                if cid not in ext["lifestyle_intents"]: ext["lifestyle_intents"].append(cid)
        return ext

    def search_nlp(self, query: str, top_k: int = 20) -> Dict[str, Any]:
        if not query.strip(): return {"query": query, "entities": {}, "results": [], "total": 0}
        entities = self.extract_entities(query)
        norm_th = lambda s: re.sub(r"[\u0e47-\u0e4c\s\-\.ฯ]", "", (s or "").lower())
        tokens = word_tokenize(query.lower(), engine="newmm", keep_whitespace=False)
        filtered_q = [t for t in tokens if t not in self.stop_words and len(t.strip()) > 1 and not re.match(r"^(\d+|บาท|เดือน|bts|mrt|คอนโด|ห้อง|โครงการ|หา|อยากได้)$", t, re.I)]
        cosine_sims = cosine_similarity(self.vectorizer.transform([" ".join(filtered_q) if filtered_q else query]), self.tfidf_matrix).flatten() if (self.vectorizer and cosine_similarity and self.tfidf_matrix is not None) else [0.0] * len(self.dataset)
        max_cos = max(cosine_sims) if len(cosine_sims) else 0.0
        ignore_kws = {kw for data in LIFESTYLE_CLUSTERS.values() for kw in data["keywords"]} | set(PET_POS + PET_NEG)
        unmatched = [w for w in filtered_q if not any(w in ik for ik in ignore_kws)]
        if not entities["station"] and not entities.get("out_of_scope") and unmatched and max_cos < 0.05 and any(len(norm_th(w)) >= 4 for w in unmatched):
            entities["out_of_scope"] = unmatched[0]
        if entities.get("out_of_scope"):
            return {"query": query, "search_type": "nlp_semantic", "entities": entities, "total_found": 0, "results": []}
        scored_results = []
        for idx, condo in enumerate(self.dataset):
            score, reasons, st_dist, pet_fail, loc_fail = 0.0, [], None, False, False
            if entities["pet_friendly"] is not None:
                if condo["pet_friendly"] == entities["pet_friendly"]:
                    score += 30.0 if entities["pet_friendly"] else 20.0
                    reasons.append("🐾 อนุญาตเลี้ยงสัตว์ (Pet-Friendly)" if entities["pet_friendly"] else "🚫 ปลอดสัตว์เลี้ยง")
                else: pet_fail = True
            if entities["station"]:
                st_dist = station_stops_away(entities["station"], condo["station"])
                if st_dist is None or st_dist > 2: score -= 60.0; loc_fail = True
                elif st_dist == 0: score += 50.0; reasons.append(f"🚆 สถานีที่ค้นหา: {condo['station']} ({condo['distance']})")
                else: score += 35.0 - (st_dist * 5.0); reasons.append(f"🚆 ห่างจากสถานีที่ค้นหา {st_dist} สถานี: {condo['station']}")
            elif entities["line"] and (entities["line"] in condo["line"] or entities["line"] == "Mass Transit"): score += 15.0; reasons.append(f"🚆 ใกล้รถไฟฟ้า ({condo['station']})")
            price = condo["price_per_month"]
            budget_fail = (entities["max_price"] is not None and price > entities["max_price"]) or (entities["min_price"] is not None and price < entities["min_price"])
            if not budget_fail and (entities["min_price"] is not None or entities["max_price"] is not None):
                score += 20.0; reasons.append(f"💰 อยู่ในช่วงงบ ฿{entities['min_price']:,}-฿{entities['max_price']:,}/ด." if (entities["min_price"] is not None and entities["max_price"] is not None) else (f"💰 ราคาอยู่ในงบไม่เกิน ฿{entities['max_price']:,}/ด." if entities["max_price"] is not None else f"💰 ราคาอยู่ในงบตั้งแต่ ฿{entities['min_price']:,}/ด."))
            tag_matches = sum(1 for tag in entities["lifestyle_tags_matched"] for c_tag in condo["lifestyle_tags"] if any(w in c_tag.lower() for w in tag.lower().split('/')) and not reasons.append(f"🌿 ตรงไลฟ์สไตล์: {c_tag}"))
            cos_val = float(cosine_sims[idx]); score += min(tag_matches * 16.0, 32.0) + min(cos_val * 35.0, 25.0)
            if cos_val > 0.15 and not reasons: reasons.append(f"✨ บริบทคำบรรยายสอดคล้องกับความต้องการ ({int(cos_val * 100)}%)")
            final_pct = 0 if (loc_fail or budget_fail or pet_fail) else max(0, min(100, int(score)))
            if final_pct > 15:
                item = {**condo, "match_score": final_pct, "match_reasons": list(dict.fromkeys(reasons)), "cosine_sim": round(cos_val, 4)}
                if st_dist is not None: item["station_stops_away"] = st_dist
                scored_results.append(item)
        scored_results.sort(key=lambda x: (x.get("station_stops_away", float("inf")), -x["match_score"], -x["cosine_sim"]))
        return {"query": query, "search_type": "nlp_semantic", "entities": entities, "total_found": len(scored_results), "results": scored_results[:top_k]}
    def search_keyword(self, query: str, top_k: int = 20) -> Dict[str, Any]:
        if not query.strip(): return {"query": query, "search_type": "keyword", "results": [], "total_found": 0}
        q_terms = [t.strip().lower() for t in query.split() if t.strip()]
        results = [{**c, "match_score": 100, "match_reasons": [f"พบคำค้นหาตรงตัวทุกคำ: '{query}'"]} for c in self.dataset if all(term in f"{c['name']} {c['station']} {c['line']} {c['description']}".lower() for term in q_terms)]
        return {"query": query, "search_type": "keyword_traditional", "terms_searched": q_terms, "total_found": len(results), "results": results[:top_k], "explanation": "ระบบค้นหาแบบคำสำคัญแบบดั้งเดิมต้องการให้ข้อความในฐานข้อมูลตรงกับทุกคำในประโยคค้นหาอย่างเคร่งครัด หากคำใดคำหนึ่งไม่ตรงตัว (เช่น รูปประโยคไลฟ์สไตล์) จะไม่ส่งคืนผลลัพธ์ (0 รายการ)"}
nlp_engine = ThaiNLPSearchEngine()
