"""
Thai NLP & Semantic Search Engine for Condominium Retrieval
Supports 4 core dimensions:
1. Mass Transit (BTS/MRT station and proximity)
2. Pet Policy (Pet-Friendly detection)
3. Budget Range (Rent/Month min & max parsing)
4. Lifestyle & Ambience (Semantic matching & Cosine similarity)
"""

import re
import numpy as np
from typing import Dict, Any, List, Optional
from pythainlp.tokenize import word_tokenize
from pythainlp.corpus import thai_stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dataset import CONDO_DATASET

# Pre-defined Station Knowledge Base for BTS / MRT / SRT / ARL
KNOWN_STATIONS = [
    {
        "canonical": "BTS มหาวิทยาลัยเกษตรศาสตร์", 
        "keywords": ["มหาวิทยาลัยเกษตรศาสตร์", "มหาวิทยาลัยเกษตร", "ม.เกษตรศาสตร์", "ม.เกษตร", "bts มหาวิทยาลัยเกษตรศาสตร์", "bts มหาวิทยาลัยเกษตร", "bts ม.เกษตร", "เกษตรศาสตร์", "เกษตร", "kasetsart", "kasetsart university", "ม.เกษตรฯ", "สถานีม.เกษตร", "สถานีมหาวิทยาลัยเกษตรศาสตร์", "เกษตร-นวมินทร์"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Kaset-Phahol",
        "neighbors": ["BTS เสนานิคม", "BTS รัชโยธิน", "BTS สายหยุด", "BTS หมอชิต"]
    },
    {
        "canonical": "BTS เสนานิคม", 
        "keywords": ["เสนานิคม", "bts เสนานิคม", "senanikom", "พหลโยธิน 34", "เสนา"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Kaset-Phahol",
        "neighbors": ["BTS มหาวิทยาลัยเกษตรศาสตร์", "BTS รัชโยธิน"]
    },
    {
        "canonical": "BTS รัชโยธิน", 
        "keywords": ["รัชโยธิน", "bts รัชโยธิน", "ratchayothin", "เมเจอร์รัชโยธิน"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Kaset-Phahol",
        "neighbors": ["BTS เสนานิคม", "BTS มหาวิทยาลัยเกษตรศาสตร์", "MRT พหลโยธิน"]
    },
    {
        "canonical": "BTS อารีย์", 
        "keywords": ["อารีย์", "bts อารีย์", "สถานีอารีย์", "ari", "ซอยอารีย์"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Phahol-Ari",
        "neighbors": ["BTS สะพานควาย", "BTS อนุสาวรีย์ชัยสมรภูมิ", "BTS หมอชิต"]
    },
    {
        "canonical": "BTS หมอชิต", 
        "keywords": ["หมอชิต", "bts หมอชิต", "สถานีหมอชิต", "mochit", "สวนจตุจักร", "จตุจักร"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Chatuchak",
        "neighbors": ["BTS สะพานควาย", "BTS ห้าแยกลาดพร้าว", "MRT สวนจตุจักร"]
    },
    {
        "canonical": "BTS อุดมสุข", 
        "keywords": ["อุดมสุข", "bts อุดมสุข", "udom suk", "udomsuk"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Bangna-Udomsuk",
        "neighbors": ["BTS บางนา", "BTS ปุณณวิถี", "MRT ศรีอุดม"]
    },
    {
        "canonical": "BTS บางนา", 
        "keywords": ["บางนา", "bts บางนา", "bang na", "bangna", "เซ็นทรัลบางนา"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Bangna-Udomsuk",
        "neighbors": ["BTS อุดมสุข", "BTS แบริ่ง"]
    },
    {
        "canonical": "BTS ทองหล่อ", 
        "keywords": ["ทองหล่อ", "bts ทองหล่อ", "thong lor", "thonglor", "สุขุมวิท 55"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Mid-Sukhumvit",
        "neighbors": ["BTS เอกมัย", "BTS พร้อมพงษ์"]
    },
    {
        "canonical": "BTS เอกมัย", 
        "keywords": ["เอกมัย", "bts เอกมัย", "ekkamai", "ekamai", "สุขุมวิท 63"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Mid-Sukhumvit",
        "neighbors": ["BTS ทองหล่อ", "BTS พระโขนง"]
    },
    {
        "canonical": "BTS อ่อนนุช", 
        "keywords": ["อ่อนนุช", "bts อ่อนนุช", "on nut", "onnut", "สุขุมวิท 77", "สุขุมวิท 81"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Onnut-Phrakhanong",
        "neighbors": ["BTS พระโขนง", "BTS บางจาก"]
    },
    {
        "canonical": "BTS ปุณณวิถี", 
        "keywords": ["ปุณณวิถี", "bts ปุณณวิถี", "punnawithi", "สุขุมวิท 101", "true digital park"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Punnawithi",
        "neighbors": ["BTS บางจาก", "BTS อุดมสุข"]
    },
    {
        "canonical": "BTS แบริ่ง", 
        "keywords": ["แบริ่ง", "bts แบริ่ง", "bearing", "สุขุมวิท 107"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Bearing-Samutprakarn",
        "neighbors": ["BTS บางนา", "BTS สำโรง"]
    },
    {
        "canonical": "BTS พร้อมพงษ์", 
        "keywords": ["พร้อมพงษ์", "bts พร้อมพงษ์", "phrom phong", "เอ็มควอเทียร์", "เอ็มโพเรียม", "สุขุมวิท 24"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Inner-Sukhumvit",
        "neighbors": ["BTS อโศก", "BTS ทองหล่อ"]
    },
    {
        "canonical": "BTS อโศก", 
        "keywords": ["อโศก", "bts อโศก", "asoke", "asok", "terminal 21", "สุขุมวิท 21"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Inner-Sukhumvit",
        "neighbors": ["BTS นานา", "BTS พร้อมพงษ์", "MRT สุขุมวิท"]
    },
    {
        "canonical": "BTS อนุสาวรีย์ชัยสมรภูมิ", 
        "keywords": ["อนุสาวรีย์", "อนุสาวรีย์ชัย", "bts อนุสาวรีย์", "victory monument", "ราชวิถี"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Phayathai-Victory",
        "neighbors": ["BTS พญาไท", "BTS สนามเป้า", "BTS อารีย์"]
    },
    {
        "canonical": "BTS พระโขนง", 
        "keywords": ["พระโขนง", "bts พระโขนง", "phra khanong", "สุขุมวิท 71"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Onnut-Phrakhanong",
        "neighbors": ["BTS เอกมัย", "BTS อ่อนนุช"]
    },
    {
        "canonical": "BTS บางจาก", 
        "keywords": ["บางจาก", "bts บางจาก", "bang chak", "สุขุมวิท 93"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Punnawithi",
        "neighbors": ["BTS อ่อนนุช", "BTS ปุณณวิถี"]
    },
    {
        "canonical": "BTS สายหยุด", 
        "keywords": ["สายหยุด", "bts สายหยุด", "sai yud", "พหลโยธิน 50", "พหล 50", "สะพานใหม่"], 
        "line": "BTS Sukhumvit Line",
        "zone": "Upper-Phahol",
        "neighbors": ["BTS มหาวิทยาลัยเกษตรศาสตร์", "BTS วัดพระศรีมหาธาตุ"]
    },
    {
        "canonical": "BTS สะพานตากสิน", 
        "keywords": ["สะพานตากสิน", "bts สะพานตากสิน", "saphan taksin", "สาทร", "เจริญกรุง", "shrewsbury"], 
        "line": "BTS Silom Line",
        "zone": "Riverside-Silom",
        "neighbors": ["BTS กรุงธนบุรี", "BTS สุรศักดิ์"]
    },
    {
        "canonical": "BTS วงเวียนใหญ่", 
        "keywords": ["วงเวียนใหญ่", "bts วงเวียนใหญ่", "wongwian yai", "สมเด็จพระเจ้าตากสิน"], 
        "line": "BTS Silom Line",
        "zone": "Thonburi",
        "neighbors": ["BTS กรุงธนบุรี", "BTS โพธิ์นิมิตร"]
    },
    {
        "canonical": "BTS กรุงธนบุรี", 
        "keywords": ["กรุงธนบุรี", "bts กรุงธนบุรี", "krung thon buri", "เจริญนคร", "ไอคอนสยาม", "iconsiam"], 
        "line": "BTS Silom Line",
        "zone": "Riverside-Silom",
        "neighbors": ["BTS สะพานตากสิน", "BTS วงเวียนใหญ่"]
    },
    {
        "canonical": "MRT พระราม 9", 
        "keywords": ["พระราม 9", "พระรามเก้า", "mrt พระราม 9", "rama 9", "rama ix", "ฟอร์จูน", "เซ็นทรัลพระราม 9", "new cbd"], 
        "line": "MRT Blue Line",
        "zone": "Rama9-Ratchada",
        "neighbors": ["MRT ศูนย์วัฒนธรรม", "MRT เพชรบุรี", "ARL มักกะสัน"]
    },
    {
        "canonical": "MRT สามย่าน", 
        "keywords": ["สามย่าน", "mrt สามย่าน", "sam yan", "samyan", "จุฬา", "แถวจุฬา", "ใกล้จุฬา", "จุฬาลงกรณ์", "ม.จุฬา", "จามจุรีสแควร์", "สามย่านมิตรทาวน์"], 
        "line": "MRT Blue Line",
        "zone": "Chula-Samyan-Siam",
        "neighbors": ["MRT สีลม", "MRT หัวลำโพง", "BTS สยาม", "BTS สนามกีฬาแห่งชาติ", "BTS ศาลาแดง"]
    },
    {
        "canonical": "BTS สยาม", 
        "keywords": ["สยาม", "bts สยาม", "siam", "เซ็นทรัลเวิลด์", "สยามพารากอน", "สยามสแควร์", "แถวจุฬา", "ย่านจุฬา", "ใกล้จุฬา"], 
        "line": "BTS Silom Line",
        "zone": "Chula-Samyan-Siam",
        "neighbors": ["BTS ชิดลม", "BTS สนามกีฬาแห่งชาติ", "BTS ราชดำริ", "MRT สามย่าน"]
    },
    {
        "canonical": "BTS สนามกีฬาแห่งชาติ", 
        "keywords": ["สนามกีฬาแห่งชาติ", "bts สนามกีฬาแห่งชาติ", "national stadium", "เกษมสันต์", "จุฬา", "แถวจุฬา", "ย่านจุฬา", "จุฬาลงกรณ์", "mbk", "มาบุญครอง"], 
        "line": "BTS Silom Line",
        "zone": "Chula-Samyan-Siam",
        "neighbors": ["BTS สยาม", "MRT สามย่าน"]
    },
    {
        "canonical": "BTS ศาลาแดง",
        "keywords": ["ศาลาแดง", "bts ศาลาแดง", "sala daeng", "สีลม", "silom", "สาทร", "แถวจุฬา"],
        "line": "BTS Silom Line",
        "zone": "Chula-Samyan-Siam",
        "neighbors": ["BTS ช่องนนทรี", "BTS สะพานตากสิน", "MRT สามย่าน", "MRT สีลม"]
    },
    {
        "canonical": "MRT ลาดพร้าว", 
        "keywords": ["ลาดพร้าว", "mrt ลาดพร้าว", "ladprao", "lat phrao", "ลาดพร้าว 15"], 
        "line": "MRT Blue Line",
        "zone": "Ladprao",
        "neighbors": ["MRT พหลโยธิน", "MRT รัชดาภิเษก"]
    },
    {
        "canonical": "MRT สุขุมวิท", 
        "keywords": ["mrt สุขุมวิท", "สถานีสุขุมวิท", "อโศกมนตรี"], 
        "line": "MRT Blue Line",
        "zone": "Inner-Sukhumvit",
        "neighbors": ["MRT เพชรบุรี", "MRT ศูนย์การประชุมแห่งชาติสิริกิติ์"]
    },
    {
        "canonical": "MRT ศูนย์วัฒนธรรม", 
        "keywords": ["ศูนย์วัฒนธรรม", "mrt ศูนย์วัฒนธรรม", "cultural centre", "เดอะสตรีทรัชดา", "ตลาดนัดรถไฟ"], 
        "line": "MRT Blue Line",
        "zone": "Rama9-Ratchada",
        "neighbors": ["MRT พระราม 9", "MRT ห้วยขวาง"]
    },
    {
        "canonical": "MRT รัชดาภิเษก", 
        "keywords": ["รัชดาภิเษก", "รัชดา", "mrt รัชดา", "รัชดา 19"], 
        "line": "MRT Blue Line",
        "zone": "Ratchada",
        "neighbors": ["MRT สุทธิสาร", "MRT ลาดพร้าว"]
    },
    {
        "canonical": "MRT ภาษีเจริญ", 
        "keywords": ["ภาษีเจริญ", "mrt ภาษีเจริญ", "ซีคอนบางแค", "เพชรเกษม"], 
        "line": "MRT Blue Line",
        "zone": "Thonburi-Phetkasem",
        "neighbors": ["MRT บางหว้า", "MRT บางแค"]
    },
    {
        "canonical": "MRT พหลโยธิน", 
        "keywords": ["พหลโยธิน", "ห้าแยกลาดพร้าว", "mrt พหลโยธิน", "เซ็นทรัลลาดพร้าว", "ยูเนี่ยนมอลล์"], 
        "line": "MRT Blue Line",
        "zone": "Ladprao",
        "neighbors": ["MRT ลาดพร้าว", "MRT สวนจตุจักร", "BTS ห้าแยกลาดพร้าว"]
    },
    {
        "canonical": "MRT บางโพ", 
        "keywords": ["บางโพ", "mrt บางโพ", "bang pho", "เกตเวย์บางซื่อ", "พระราม 7"], 
        "line": "MRT Blue Line",
        "zone": "Bangpho-Riverside",
        "neighbors": ["MRT เตาปูน", "MRT บางอ้อ"]
    },
    {
        "canonical": "MRT ห้วยขวาง", 
        "keywords": ["ห้วยขวาง", "mrt ห้วยขวาง", "huai khwang", "รัชดา 18", "ตลาดห้วยขวาง"], 
        "line": "MRT Blue Line",
        "zone": "Rama9-Ratchada",
        "neighbors": ["MRT สุทธิสาร", "MRT ศูนย์วัฒนธรรม"]
    },
    {
        "canonical": "MRT ศรีอุดม", 
        "keywords": ["ศรีอุดม", "mrt ศรีอุดม", "sri udom", "อุดมสุข-ศรีนครินทร์"], 
        "line": "MRT Yellow Line",
        "zone": "Srinakarin",
        "neighbors": ["MRT สวนหลวง ร.9", "MRT ศรีเอี่ยม"]
    },
    {
        "canonical": "ARL รามคำแหง", 
        "keywords": ["รามคำแหง", "arl รามคำแหง", "แอร์พอร์ตลิงก์รามคำแหง", "พัฒนาการ", "สุวรรณภูมิ"], 
        "line": "Airport Rail Link",
        "zone": "Ramkhamhaeng",
        "neighbors": ["ARL มักกะสัน", "ARL หัวหมาก"]
    },
    {
        "canonical": "SRT รังสิต", 
        "keywords": ["รังสิต", "srt รังสิต", "ม.กรุงเทพ", "มธ.รังสิต", "ธรรมศาสตร์", "ม.ธรรมศาสตร์", "มหาวิทยาลัยธรรมศาสตร์", "ฟิวเจอร์พาร์ครังสิต"], 
        "line": "SRT Red Line",
        "zone": "Rangsit",
        "neighbors": ["SRT หลักหก", "SRT ดอนเมือง"]
    },
    # ===== สถานีเพิ่มเติม ย่านกรุงเทพครอบคลุม =====
    {
        "canonical": "BTS ชิดลม",
        "keywords": ["ชิดลม", "bts ชิดลม", "chidlom", "เซ็นทรัลเวิลด์", "สยาม", "ใกล้ซีดับเบิ้ลดี", "cwdc", "วิทยุ"],
        "line": "BTS Sukhumvit Line",
        "zone": "CBD-Chidlom",
        "neighbors": ["BTS สยาม", "BTS เพลินจิต", "BTS ราชดำริ"]
    },
    {
        "canonical": "BTS เพลินจิต",
        "keywords": ["เพลินจิต", "bts เพลินจิต", "phloen chit", "เซ็นทรัลเอ็มบาสซี", "ถนนวิทยุ", "สถานทูต"],
        "line": "BTS Sukhumvit Line",
        "zone": "CBD-Chidlom",
        "neighbors": ["BTS ชิดลม", "BTS นานา"]
    },
    {
        "canonical": "BTS นานา",
        "keywords": ["นานา", "bts นานา", "nana", "สุขุมวิท 3", "สุขุมวิท 5", "arab street"],
        "line": "BTS Sukhumvit Line",
        "zone": "Lower-Sukhumvit",
        "neighbors": ["BTS เพลินจิต", "BTS อโศก"]
    },
    {
        "canonical": "BTS ช่องนนทรี",
        "keywords": ["ช่องนนทรี", "bts ช่องนนทรี", "chong nonsi", "สาทร", "sathorn", "ย่านสาทร", "silom complex"],
        "line": "BTS Silom Line",
        "zone": "Sathorn-Silom",
        "neighbors": ["BTS ศาลาแดง", "BTS สุรศักดิ์", "BTS เซนต์หลุยส์"]
    },
    {
        "canonical": "MRT ลุมพินี",
        "keywords": ["ลุมพินี", "mrt ลุมพินี", "lumpini", "สวนลุมพินี", "lumphini park", "พระราม 4"],
        "line": "MRT Blue Line",
        "zone": "Sathorn-Lumpini",
        "neighbors": ["MRT สีลม", "MRT คลองเตย", "BTS ศาลาแดง"]
    },
    {
        "canonical": "MRT สุทธิสาร",
        "keywords": ["สุทธิสาร", "mrt สุทธิสาร", "sutthisan", "ห้วยขวาง", "รัชดา 19"],
        "line": "MRT Blue Line",
        "zone": "Ratchada-Sutthisan",
        "neighbors": ["MRT รัชดาภิเษก", "MRT ห้วยขวาง"]
    },
    {
        "canonical": "MRT ท่าพระ",
        "keywords": ["ท่าพระ", "mrt ท่าพระ", "tha phra", "บางขุนนนท์", "จรัญ", "ฝั่งธนบุรีตะวันตก"],
        "line": "MRT Blue Line",
        "zone": "Thonburi-Taphra",
        "neighbors": ["MRT บางไผ่", "MRT จรัญสนิทวงศ์ 13", "MRT จรัญสนิทวงศ์ 3"]
    },
    {
        "canonical": "MRT จรัญสนิทวงศ์ 13",
        "keywords": ["จรัญสนิทวงศ์", "จรัญ", "mrt จรัญ", "charan sanit wong", "บางขุนนนท์", "ฝั่งธน"],
        "line": "MRT Blue Line",
        "zone": "Thonburi-Taphra",
        "neighbors": ["MRT ท่าพระ", "MRT บางยี่ขัน"]
    },
    {
        "canonical": "MRT เตาปูน",
        "keywords": ["เตาปูน", "mrt เตาปูน", "taopoon", "บางซื่อ", "จุดตัดสายม่วง-น้ำเงิน"],
        "line": "MRT Blue Line",
        "zone": "Bangsue-Taopoon",
        "neighbors": ["MRT บางโพ", "MRT สวนจตุจักร"]
    },
    {
        "canonical": "MRT เพชรบุรี",
        "keywords": ["เพชรบุรี", "mrt เพชรบุรี", "phetchaburi", "มักกะสัน", "arl มักกะสัน"],
        "line": "MRT Blue Line",
        "zone": "Phetchaburi-Makkasan",
        "neighbors": ["MRT สุขุมวิท", "MRT พระราม 9", "ARL มักกะสัน"]
    },
    {
        "canonical": "BTS สะพานควาย",
        "keywords": ["สะพานควาย", "bts สะพานควาย", "saphan khwai", "พหลโยธิน 35", "อารีย์เหนือ"],
        "line": "BTS Sukhumvit Line",
        "zone": "Phahol-Ari",
        "neighbors": ["BTS อารีย์", "BTS หมอชิต"]
    },
    {
        "canonical": "BTS วุฒากาศ",
        "keywords": ["วุฒากาศ", "bts วุฒากาศ", "wutthakat", "ราษฎร์บูรณะ", "ถนนสุขสวัสดิ์"],
        "line": "BTS Silom Line",
        "zone": "Thonburi-South",
        "neighbors": ["BTS โพธิ์นิมิตร", "BTS วงเวียนใหญ่"]
    },
    {
        "canonical": "MRT สีลม",
        "keywords": ["mrt สีลม", "สีลม", "silom", "บางรัก", "bang rak"],
        "line": "MRT Blue Line",
        "zone": "Sathorn-Silom",
        "neighbors": ["MRT ลุมพินี", "MRT สามย่าน", "BTS ศาลาแดง"]
    }
]

# Lifestyle Keyword Mappings and Clusters
LIFESTYLE_CLUSTERS = {
    "quiet": {
        "keywords": ["เงียบสงบ", "สงบ", "ไม่พลุกพล่าน", "ไม่วุ่นวาย", "เป็นส่วนตัว", "private", "quiet", "peaceful", "ร่มรื่น"],
        "tag": "เงียบสงบ/เป็นส่วนตัว"
    },
    "wfh": {
        "keywords": ["wfh", "work from home", "ทำงานที่บ้าน", "เหมาะกับ wfh", "co-working", "ห้องทำงาน", "อ่านหนังสือ", "โต๊ะทำงาน", "สายเทค"],
        "tag": "เหมาะกับ WFH"
    },
    "river_view": {
        "keywords": ["วิวแม่น้ำ", "ริมแม่น้ำ", "ริมน้ำ", "แม่น้ำเจ้าพระยา", "ติดแม่น้ำ", "วิวเจ้าพระยา", "river view", "riverfront"],
        "tag": "วิวแม่น้ำ"
    },
    "luxury": {
        "keywords": ["หรูหรา", "ส่วนกลางหรู", "ลักชัวรี่", "luxury", "ไฮเอนด์", "สระว่ายน้ำใหญ่", "sky pool", "อลังการ", "สไตล์โรงแรม"],
        "tag": "ส่วนกลางหรู"
    },
    "near_transit": {
        "keywords": ["ติด bts", "ติด mrt", "ติดรถไฟฟ้า", "ใกล้ bts", "ใกล้ mrt", "เดินถึงรถไฟฟ้า", "0 เมตร", "ก้าวเดียว"],
        "tag": "ติดรถไฟฟ้า"
    },
    "food_shopping": {
        "keywords": ["ของกินเยอะ", "ใกล้ห้าง", "ติดห้าง", "คาเฟ่", "สตรีทฟู้ด", "ตลาดนัด", "ช้อปปิ้ง", "เซ็นทรัล", "ของกินสะดวก"],
        "tag": "ของกินเยอะ/ใกล้ห้าง"
    },
    "nature_green": {
        "keywords": ["พื้นที่สีเขียว", "ใกล้สวน", "สวนสาธารณะ", "จตุจักร", "ธรรมชาติ", "รักธรรมชาติ", "สวนลุม", "วิ่งออกกำลังกาย"],
        "tag": "พื้นที่สีเขียว/ใกล้สวน"
    },
    "high_ceiling": {
        "keywords": ["เพดานสูง", "duplex", "ดูเพล็กซ์", "duo space", "โปร่งโล่ง", "ห้องสองชั้น"],
        "tag": "เพดานสูง/ดูเพล็กซ์"
    },
    "budget_friendly": {
        "keywords": ["ราคาประหยัด", "งบน้อย", "ไม่แพง", "คุ้มค่า", "ราคาถูก", "ราคาเบาๆ", "สบายกระเป๋า"],
        "tag": "ราคาประหยัด"
    }
}


class ThaiNLPSearchEngine:
    def __init__(self, dataset: List[Dict[str, Any]] = CONDO_DATASET):
        self.dataset = dataset
        self.stop_words = list(thai_stopwords())
        self._prepare_vectorizer()

    def _prepare_vectorizer(self):
        """Prepare TF-IDF Vectorizer on condo corpus (descriptions + lifestyle tags + facilities)"""
        corpus = []
        for condo in self.dataset:
            text = f"{condo['name']} {condo['station']} {condo['line']} {' '.join(condo['lifestyle_tags'])} {' '.join(condo['facilities'])} {condo['description']}"
            tokens = word_tokenize(text.lower(), engine="newmm", keep_whitespace=False)
            filtered_tokens = [t for t in tokens if t not in self.stop_words and len(t.strip()) > 1]
            corpus.append(" ".join(filtered_tokens))
        
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2))
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)

    def extract_entities(self, query: str) -> Dict[str, Any]:
        """
        Extract 4 dimensions from Thai natural language text:
        1. Transit Station (BTS/MRT)
        2. Pet Policy (True / False / None)
        3. Budget Range (min_price, max_price)
        4. Lifestyle & Ambience Intended Tags
        """
        q_lower = query.lower()
        extracted = {
            "raw_query": query,
            "station": None,
            "line": None,
            "pet_friendly": None,
            "min_price": None,
            "max_price": None,
            "lifestyle_intents": [],
            "lifestyle_tags_matched": [],
            "tokens": []
        }

        # Tokenization
        tokens = word_tokenize(query, engine="newmm", keep_whitespace=False)
        extracted["tokens"] = tokens

        # 1. Mass Transit Extraction
        for st in KNOWN_STATIONS:
            for kw in st["keywords"]:
                if kw in q_lower:
                    extracted["station"] = st["canonical"]
                    extracted["line"] = st["line"]
                    break
            if extracted["station"]:
                break
        
        # Generic transit mentions if specific station not detected
        if not extracted["station"]:
            if any(k in q_lower for k in ["bts", "บีทีเอส", "สายสีเขียว"]):
                extracted["line"] = "BTS Sukhumvit Line"
            elif any(k in q_lower for k in ["mrt", "เอ็มอาร์ที", "สายสีน้ำเงิน", "รถไฟใต้ดิน"]):
                extracted["line"] = "MRT Blue Line"
            elif "รถไฟฟ้า" in q_lower:
                extracted["line"] = "Mass Transit"

        # 2. Pet Policy Extraction
        pet_positive_kw = ["เลี้ยงสัตว์ได้", "เลี้ยงสัตว์", "เลี้ยงหมา", "เลี้ยงแมว", "pet friendly", "pet-friendly", "สัตว์เลี้ยง", "ทาสแมว", "ทาสหมา", "หมา", "แมว"]
        pet_negative_kw = ["ห้ามเลี้ยงสัตว์", "ไม่เลี้ยงสัตว์", "ห้ามเลี้ยงหมา", "ห้ามเลี้ยงแมว", "ไม่เอาสัตว์เลี้ยง"]

        if any(neg in q_lower for neg in pet_negative_kw):
            extracted["pet_friendly"] = False
        elif any(pos in q_lower for pos in pet_positive_kw):
            extracted["pet_friendly"] = True

        # 3. Budget / Price Range Extraction
        # Parse expressions like "ไม่เกิน 15,000", "งบ 15000", "10k-20k", "ต่ำกว่า 2 หมื่น", "งบหมื่นห้า", "12000-18000"
        price_patterns = [
            # Range: "10,000 - 20,000" or "10000-20000"
            (r'(\d+[\d,]*)\s*(?:-|ถึง|to)\s*(\d+[\d,]*)', 'range'),
            # "ไม่เกิน 15,000" or "ต่ำกว่า 15000" or "งบ 15,000" or "งบไม่เกิน 15,000"
            (r'(?:ไม่เกิน|ต่ำกว่า|งบไม่เกิน|งบ|งบประมาณ|ราคาไม่เกิน|ราคา|ไม่เกินงบ)\s*(\d+[\d,]*)', 'max'),
            # "มากกว่า 20,000" or "ตั้งแต่ 15000"
            (r'(?:มากกว่า|ตั้งแต่|เกิน)\s*(\d+[\d,]*)', 'min'),
            # "15k" or "20k"
            (r'(\d+)\s*k\b', 'k_val')
        ]

        # Thai textual numbers handling (เช่น "หมื่นห้า", "สองหมื่น", "เก้าพัน", "หมื่นต้นๆ")
        thai_num_map = {
            "หมื่นห้า": 15000,
            "หมื่นต้นๆ": 12000,
            "หมื่นต้น": 12000,
            "หมื่นกลาง": 15000,
            "หมื่นปลาย": 18000,
            "สองหมื่น": 20000,
            "สามหมื่น": 30000,
            "สี่หมื่น": 40000,
            "ห้าหมื่น": 50000,
            "หนึ่งหมื่น": 10000,
            "หมื่นเดียว": 10000,
            "แปดพัน": 8000,
            "เก้าพัน": 9000,
            "เจ็ดพัน": 7000,
        }

        for th_text, val in thai_num_map.items():
            if th_text in q_lower:
                if any(w in q_lower for w in ["ไม่เกิน", "ต่ำกว่า", "งบ", "ราคา"]):
                    extracted["max_price"] = val
                else:
                    extracted["max_price"] = val

        # Regex numeric matching
        if not extracted["max_price"]:
            for pattern, p_type in price_patterns:
                match = re.search(pattern, q_lower)
                if match:
                    if p_type == 'range':
                        min_p = int(match.group(1).replace(',', ''))
                        max_p = int(match.group(2).replace(',', ''))
                        extracted["min_price"] = min_p
                        extracted["max_price"] = max_p
                        break
                    elif p_type == 'max':
                        val = int(match.group(1).replace(',', ''))
                        # Sanity check: price usually > 3000
                        if val >= 3000:
                            extracted["max_price"] = val
                            break
                    elif p_type == 'min':
                        val = int(match.group(1).replace(',', ''))
                        if val >= 3000:
                            extracted["min_price"] = val
                            break
                    elif p_type == 'k_val':
                        val = int(match.group(1)) * 1000
                        extracted["max_price"] = val
                        break

        # 4. Lifestyle & Ambience Intention Extraction
        for cluster_id, data in LIFESTYLE_CLUSTERS.items():
            for kw in data["keywords"]:
                if kw in q_lower:
                    if data["tag"] not in extracted["lifestyle_tags_matched"]:
                        extracted["lifestyle_tags_matched"].append(data["tag"])
                    if cluster_id not in extracted["lifestyle_intents"]:
                        extracted["lifestyle_intents"].append(cluster_id)
                    break

        return extracted

    def search_nlp(self, query: str, top_k: int = 20) -> Dict[str, Any]:
        """
        Hybrid NLP & Semantic Search:
        1. Extract structured entities (Transit, Pet, Budget, Lifestyle)
        2. Calculate Semantic Cosine Similarity on query vs condo corpus
        3. Apply Multi-dimensional Hybrid Scoring
        4. Return ranked results with match explanations and entity breakdowns
        """
        if not query.strip():
            return {"query": query, "entities": {}, "results": [], "total": 0}

        entities = self.extract_entities(query)
        
        # 1. Compute Semantic Similarity Vector
        query_tokens = word_tokenize(query.lower(), engine="newmm", keep_whitespace=False)
        filtered_q = [t for t in query_tokens if t not in self.stop_words and len(t.strip()) > 1]
        q_vec_str = " ".join(filtered_q) if filtered_q else query
        
        query_vec = self.vectorizer.transform([q_vec_str])
        cosine_sims = cosine_similarity(query_vec, self.tfidf_matrix).flatten()

        scored_results = []

        for idx, condo in enumerate(self.dataset):
            score = 0.0
            reasons = []

            # A. Pet Friendly Constraint Matching (Weight: 30%)
            pet_penalty = False
            if entities["pet_friendly"] is True:
                if condo["pet_friendly"]:
                    score += 30.0
                    reasons.append("🐾 อนุญาตเลี้ยงสัตว์ (Pet-Friendly)")
                else:
                    score -= 40.0  # Heavy penalty for violating pet requirement
                    pet_penalty = True
            elif entities["pet_friendly"] is False:
                if not condo["pet_friendly"]:
                    score += 20.0
                    reasons.append("🚫 ปลอดสัตว์เลี้ยง")

            # B. Mass Transit & Location Matching (Weight: 35%)
            station_matched = False
            location_mismatch = False

            if entities["station"]:
                target_station = entities["station"].lower()
                condo_station = condo["station"].lower()

                # Find zone of target station
                target_zone = None
                target_neighbors = []
                for st_info in KNOWN_STATIONS:
                    if st_info["canonical"].lower() == target_station:
                        target_zone = st_info.get("zone")
                        target_neighbors = [n.lower() for n in st_info.get("neighbors", [])]
                        break

                # Find zone of condo's station
                condo_zone = None
                for st_info in KNOWN_STATIONS:
                    if st_info["canonical"].lower() == condo_station or condo_station in st_info["canonical"].lower():
                        condo_zone = st_info.get("zone")
                        break

                # Direct match
                if target_station in condo_station or condo_station in target_station:
                    dist = condo["distance_m"]
                    if dist <= 100:
                        score += 42.0
                        reasons.append(f"🚆 ติด {condo['station']} ({dist} ม.)")
                    elif dist <= 500:
                        score += 35.0
                        reasons.append(f"🚆 ใกล้ {condo['station']} ({dist} ม.)")
                    else:
                        score += 26.0
                        reasons.append(f"🚆 ย่าน {condo['station']} ({dist} ม.)")
                    station_matched = True
                # Neighbor match
                elif any(n in condo_station for n in target_neighbors):
                    score += 20.0
                    reasons.append(f"🚆 ละแวกใกล้เคียง: {condo['station']}")
                    station_matched = True
                # Same zone match (e.g., BTS แถวจุฬา → zone Chula-Samyan-Siam)
                elif target_zone and condo_zone and target_zone == condo_zone:
                    score += 18.0
                    reasons.append(f"🚆 ย่านเดียวกัน ({condo_zone}): {condo['station']}")
                    station_matched = True
                else:
                    # STRICT LOCATION MISMATCH
                    score -= 60.0
                    location_mismatch = True
            elif entities["line"]:
                if entities["line"] in condo["line"] or entities["line"] == "Mass Transit":
                    score += 15.0
                    reasons.append(f"🚆 ใกล้รถไฟฟ้า ({condo['station']})")

            # C. Budget / Rental Price Matching (Weight: 20%)
            price = condo["price_per_month"]
            budget_hard_fail = False
            if entities["max_price"]:
                max_p = entities["max_price"]
                if price <= max_p:
                    score += 20.0
                    reasons.append(f"💰 ราคาอยู่ในงบ (฿{price:,}/ด. จากงบ ฿{max_p:,})")
                else:
                    # Price exceeds max budget -> hard exclude
                    budget_hard_fail = True
            elif entities["min_price"]:
                min_p = entities["min_price"]
                if price >= min_p:
                    score += 15.0
                    reasons.append(f"💰 อยู่ในช่วงราคาที่ระบุ (฿{price:,}/ด.)")

            # D. Lifestyle & Ambience Semantic Matching (Weight: 20% + Cosine Vector 20%)
            # 1) Direct tag overlap
            tag_matches = 0
            for tag in entities["lifestyle_tags_matched"]:
                for c_tag in condo["lifestyle_tags"]:
                    if any(w in c_tag.lower() for w in tag.lower().split('/')):
                        tag_matches += 1
                        reasons.append(f"🌿 ตรงไลฟ์สไตล์: {c_tag}")
                        break
            
            score += min(tag_matches * 8.0, 20.0)

            # 2) Vector Cosine Similarity Score (0 - 20)
            cos_val = float(cosine_sims[idx])
            vector_score = min(cos_val * 35.0, 25.0)
            score += vector_score
            if cos_val > 0.15 and not reasons:
                reasons.append(f"✨ บริบทคำบรรยายสอดคล้องกับความต้องการ ({int(cos_val*100)}%)")

            # Normalize final Match Score to 0 - 100%
            final_match_pct = max(0, min(100, int(score)))

            # Hard exclusions (ตัดทิ้งเลย ไม่แสดงในผล)
            if location_mismatch:
                final_match_pct = 0
            if budget_hard_fail:          # ราคาเกิน 2x งบที่ระบุ
                final_match_pct = 0

            # If user explicitly specified Pet Friendly and condo is NOT pet friendly, keep match low
            if pet_penalty:
                final_match_pct = min(final_match_pct, 20)

            # Only include if match score is reasonable
            if final_match_pct > 15:
                condo_copy = dict(condo)
                condo_copy["match_score"] = final_match_pct
                condo_copy["match_reasons"] = list(dict.fromkeys(reasons))  # unique reasons
                condo_copy["cosine_sim"] = round(cos_val, 4)
                scored_results.append(condo_copy)

        # Sort by Match Score descending
        scored_results.sort(key=lambda x: (x["match_score"], x["cosine_sim"]), reverse=True)

        return {
            "query": query,
            "search_type": "nlp_semantic",
            "entities": entities,
            "total_found": len(scored_results),
            "results": scored_results[:top_k]
        }

    def search_keyword(self, query: str, top_k: int = 20) -> Dict[str, Any]:
        """
        Traditional Keyword-Based Search Baseline (exact substring / full keyword containment).
        Simulates standard property websites that fail when multi-conditions or lifestyle terms are mixed.
        """
        if not query.strip():
            return {"query": query, "search_type": "keyword", "results": [], "total_found": 0}

        q_terms = [t.strip().lower() for t in query.split() if t.strip()]
        results = []

        for condo in self.dataset:
            # Build search string of traditional database searchable columns
            text_target = f"{condo['name']} {condo['station']} {condo['line']} {condo['description']}".lower()
            
            # Exact match check: ALL terms must exist literally (Standard AND search)
            match_all = all(term in text_target for term in q_terms)
            
            if match_all:
                condo_copy = dict(condo)
                condo_copy["match_score"] = 100
                condo_copy["match_reasons"] = [f"พบคำค้นหาตรงตัวทุกคำ: '{query}'"]
                results.append(condo_copy)

        return {
            "query": query,
            "search_type": "keyword_traditional",
            "terms_searched": q_terms,
            "total_found": len(results),
            "results": results[:top_k],
            "explanation": "ระบบค้นหาแบบคำสำคัญแบบดั้งเดิมต้องการให้ข้อความในฐานข้อมูลตรงกับทุกคำในประโยคค้นหาอย่างเคร่งครัด หากคำใดคำหนึ่งไม่ตรงตัว (เช่น รูปประโยคไลฟ์สไตล์) จะไม่ส่งคืนผลลัพธ์ (0 รายการ)"
        }


# Global Singleton Instance
nlp_engine = ThaiNLPSearchEngine()
