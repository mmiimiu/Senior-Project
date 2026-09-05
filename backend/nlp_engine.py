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
    {"canonical": "BTS อารีย์", "keywords": ["อารีย์", "bts อารีย์", "สถานีอารีย์", "ari"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS หมอชิต", "keywords": ["หมอชิต", "bts หมอชิต", "สถานีหมอชิต", "mochit"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS อุดมสุข", "keywords": ["อุดมสุข", "bts อุดมสุข", "udom suk", "udomsuk"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS บางนา", "keywords": ["บางนา", "bts บางนา", "bang na", "bangna"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS ทองหล่อ", "keywords": ["ทองหล่อ", "bts ทองหล่อ", "thong lor", "thonglor"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS เอกมัย", "keywords": ["เอกมัย", "bts เอกมัย", "ekkamai", "ekamai"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS อ่อนนุช", "keywords": ["อ่อนนุช", "bts อ่อนนุช", "on nut", "onnut"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS ปุณณวิถี", "keywords": ["ปุณณวิถี", "bts ปุณณวิถี", "punnawithi"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS แบริ่ง", "keywords": ["แบริ่ง", "bts แบริ่ง", "bearing"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS พร้อมพงษ์", "keywords": ["พร้อมพงษ์", "bts พร้อมพงษ์", "phrom phong"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS อโศก", "keywords": ["อโศก", "bts อโศก", "asoke", "asok"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS อนุสาวรีย์ชัยสมรภูมิ", "keywords": ["อนุสาวรีย์", "อนุสาวรีย์ชัย", "bts อนุสาวรีย์", "victory monument"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS เสนานิคม", "keywords": ["เสนานิคม", "bts เสนานิคม", "senanikom"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS รัชโยธิน", "keywords": ["รัชโยธิน", "bts รัชโยธิน", "ratchayothin"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS พระโขนง", "keywords": ["พระโขนง", "bts พระโขนง", "phra khanong"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS บางจาก", "keywords": ["บางจาก", "bts บางจาก", "bang chak"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS สายหยุด", "keywords": ["สายหยุด", "bts สายหยุด", "sai yud"], "line": "BTS Sukhumvit"},
    {"canonical": "BTS สะพานตากสิน", "keywords": ["สะพานตากสิน", "bts สะพานตากสิน", "saphan taksin"], "line": "BTS Silom"},
    {"canonical": "BTS วงเวียนใหญ่", "keywords": ["วงเวียนใหญ่", "bts วงเวียนใหญ่", "wongwian yai"], "line": "BTS Silom"},
    {"canonical": "BTS กรุงธนบุรี", "keywords": ["กรุงธนบุรี", "bts กรุงธนบุรี", "krung thon buri"], "line": "BTS Silom"},
    {"canonical": "MRT พระราม 9", "keywords": ["พระราม 9", "พระรามเก้า", "mrt พระราม 9", "rama 9", "rama ix"], "line": "MRT Blue"},
    {"canonical": "MRT สามย่าน", "keywords": ["สามย่าน", "mrt สามย่าน", "sam yan", "samyan"], "line": "MRT Blue"},
    {"canonical": "MRT ลาดพร้าว", "keywords": ["ลาดพร้าว", "mrt ลาดพร้าว", "ladprao", "lat phrao"], "line": "MRT Blue"},
    {"canonical": "MRT สุขุมวิท", "keywords": ["mrt สุขุมวิท", "สถานีสุขุมวิท"], "line": "MRT Blue"},
    {"canonical": "MRT ศูนย์วัฒนธรรม", "keywords": ["ศูนย์วัฒนธรรม", "mrt ศูนย์วัฒนธรรม", "cultural centre"], "line": "MRT Blue"},
    {"canonical": "MRT รัชดาภิเษก", "keywords": ["รัชดาภิเษก", "รัชดา", "mrt รัชดา"], "line": "MRT Blue"},
    {"canonical": "MRT ภาษีเจริญ", "keywords": ["ภาษีเจริญ", "mrt ภาษีเจริญ", "ซีคอนบางแค"], "line": "MRT Blue"},
    {"canonical": "MRT พหลโยธิน", "keywords": ["พหลโยธิน", "ห้าแยกลาดพร้าว", "mrt พหลโยธิน", "เซ็นทรัลลาดพร้าว"], "line": "MRT Blue"},
    {"canonical": "MRT บางโพ", "keywords": ["บางโพ", "mrt บางโพ", "bang pho"], "line": "MRT Blue"},
    {"canonical": "MRT ห้วยขวาง", "keywords": ["ห้วยขวาง", "mrt ห้วยขวาง", "huai khwang"], "line": "MRT Blue"},
    {"canonical": "MRT ศรีอุดม", "keywords": ["ศรีอุดม", "mrt ศรีอุดม", "sri udom"], "line": "MRT Yellow"},
    {"canonical": "ARL รามคำแหง", "keywords": ["รามคำแหง", "arl รามคำแหง", "แอร์พอร์ตลิงก์รามคำแหง"], "line": "Airport Rail Link"},
    {"canonical": "SRT รังสิต", "keywords": ["รังสิต", "srt รังสิต", "ม.กรุงเทพ", "มธ.รังสิต", "ธรรมศาสตร์"], "line": "SRT Red"}
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

            # B. Mass Transit Proximity (Weight: 30%)
            station_matched = False
            if entities["station"]:
                if entities["station"].lower() in condo["station"].lower() or condo["station"].lower() in entities["station"].lower():
                    # Distance boost
                    dist = condo["distance_m"]
                    if dist <= 100:
                        score += 30.0
                        reasons.append(f"🚆 ติด {condo['station']} ({dist} ม.)")
                    elif dist <= 500:
                        score += 25.0
                        reasons.append(f"🚆 ใกล้ {condo['station']} ({dist} ม.)")
                    else:
                        score += 18.0
                        reasons.append(f"🚆 ย่าน {condo['station']} ({dist} ม.)")
                    station_matched = True
                elif entities["line"] and entities["line"] in condo["line"]:
                    score += 15.0
                    reasons.append(f"🚆 อยู่ตามแนว {condo['line']}")
            elif entities["line"]:
                if entities["line"] in condo["line"] or entities["line"] == "Mass Transit":
                    score += 15.0
                    reasons.append(f"🚆 ใกล้รถไฟฟ้า ({condo['station']})")

            # C. Budget / Rental Price Matching (Weight: 20%)
            price = condo["price_per_month"]
            if entities["max_price"]:
                max_p = entities["max_price"]
                if price <= max_p:
                    # Within budget bonus
                    savings = max_p - price
                    score += 20.0
                    reasons.append(f"💰 ราคาอยู่ในงบ (฿{price:,}/ด. จากงบ ฿{max_p:,})")
                elif price <= max_p * 1.15:  # Slightly above budget (15% grace)
                    score += 8.0
                    reasons.append(f"💰 เกินงบเล็กน้อย (฿{price:,}/ด.)")
                else:
                    score -= 25.0  # Over budget penalty
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

            # If user explicitly specified Pet Friendly and condo is NOT pet friendly, keep match low
            if pet_penalty:
                final_match_pct = min(final_match_pct, 25)

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
