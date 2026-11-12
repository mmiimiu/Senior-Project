"""
Benchmark Test Suite & Evaluation Metrics
For "การพัฒนาระบบค้นหาคอนโดมิเนียมจากข้อความภาษาธรรมชาติภาษาไทยตามเงื่อนไขไลฟ์สไตล์"
Evaluates Precision, Recall, and F1-Score between NLP Search vs Keyword Search.
"""

from typing import List, Dict, Any
from nlp_engine import nlp_engine
from dataset import CONDO_DATASET

# 25 Benchmark Queries covering 4 dimensions and natural language complexity
BENCHMARK_QUERIES = [
    {
        "id": "q01",
        "query": "หาคอนโดติด BTS เลี้ยงสัตว์ได้ เงียบสงบ",
        "category": "Multi-attribute (Transit + Pet + Lifestyle)",
        "expected_ids": ["c02", "c05", "c09", "c13", "c20", "c35", "c39", "c42"],
        "description": "ค้นหาคอนโดใกล้รถไฟฟ้า อนุญาตให้เลี้ยงสัตว์ และมีบรรยากาศเงียบสงบ"
    },
    {
        "id": "q02",
        "query": "คอนโดใกล้ MRT พระราม 9 เหมาะกับ WFH งบไม่เกิน 20,000",
        "category": "Multi-attribute (Station + Lifestyle + Budget)",
        "expected_ids": ["c03", "c25", "c18"],
        "description": "ระบุสถานีพระราม 9 บรรยากาศรองรับการทำงาน และคุมงบไม่เกิน 2 หมื่น"
    },
    {
        "id": "q03",
        "query": "คอนโดเลี้ยงแมวได้ งบไม่เกิน 15,000 ใกล้รถไฟฟ้า",
        "category": "Budget + Pet + Transit",
        "expected_ids": ["c09", "c20", "c29", "c39", "c47"],
        "description": "ค้นหาห้องเลี้ยงแมว ราคาประหยัดไม่เกิน 1.5 หมื่น เดินทางด้วยรถไฟฟ้าได้"
    },
    {
        "id": "q04",
        "query": "คอนโดวิวแม่น้ำ บรรยากาศเงียบสงบ เป็นส่วนตัว",
        "category": "Ambience & View",
        "expected_ids": ["c08", "c12", "c30", "c45"],
        "description": "ค้นหาคอนโดริมแม่น้ำเจ้าพระยา เน้นความเงียบสงบและเป็นส่วนตัว"
    },
    {
        "id": "q05",
        "query": "คอนโดติด BTS อารีย์ คาเฟ่เยอะ ของกินสะดวก",
        "category": "Station & Lifestyle",
        "expected_ids": ["c04"],
        "description": "ระบุย่านอารีย์ เดินถึงสถานี BTS และชื่นชอบแหล่งคาเฟ่ของกิน"
    },
    {
        "id": "q06",
        "query": "คอนโดราคาประหยัด ใกล้มหาวิทยาลัย งบไม่เกิน 10,000",
        "category": "Student Budget & Location",
        "expected_ids": ["c11", "c17", "c49", "c45"],
        "description": "ค้นหาห้องพักราคาประหยัดสำหรับนักศึกษา งบต่ำกว่าหมื่น"
    },
    {
        "id": "q07",
        "query": "คอนโดหรูระดับลักชัวรี่ ใจกลางอโศก ส่วนกลางอลังการ",
        "category": "Luxury & Central CBD",
        "expected_ids": ["c19", "c06", "c14"],
        "description": "คอนโดระดับบนใจกลางอโศก สระว่ายน้ำลอยฟ้าและส่วนกลางพรีเมียม"
    },
    {
        "id": "q08",
        "query": "คอนโดติด MRT สามย่าน ใกล้จุฬา มีที่อ่านหนังสือ",
        "category": "Station & Study Space",
        "expected_ids": ["c06", "c15"],
        "description": "ใกล้ MRT สามย่าน มี Co-Study / Co-Working เหมาะกับนิสิตจุฬาฯ"
    },
    {
        "id": "q09",
        "query": "คอนโดใกล้สวนจตุจักร เลี้ยงหมาได้ วิ่งออกกำลังกาย",
        "category": "Pet + Health & Park",
        "expected_ids": ["c05", "c16"],
        "description": "ย่านหมอชิต/จตุจักร มีพื้นที่พาสุนัขเดินเล่นและใกล้สวนสาธารณะ"
    },
    {
        "id": "q10",
        "query": "คอนโดเพดานสูง Duo Space เหมาะกับทำงาน WFH อ่อนนุช",
        "category": "Architecture & Station",
        "expected_ids": ["c21", "c38", "c32"],
        "description": "ต้องการห้องสองชั้นเพดานสูง โปร่ง ย่านอ่อนนุช"
    },
    {
        "id": "q11",
        "query": "คอนโดติดบันได BTS ไม่ต้องเดินไกล งบ 15000-20000",
        "category": "Transit Proximity & Budget Range",
        "expected_ids": ["c01", "c22", "c28", "c41"],
        "description": "ระยะห่างสถานี 0-50 เมตร คุมงบหมื่นกลางถึงสองหมื่น"
    },
    {
        "id": "q12",
        "query": "คอนโดเลี้ยงสัตว์ได้ ทองหล่อ สเปซกว้าง",
        "category": "Pet + Prime Location",
        "expected_ids": ["c24", "c42"],
        "description": "คอนโด Pet friendly ในทำเลพรีเมียมทองหล่อ"
    },
    {
        "id": "q13",
        "query": "คอนโดสไตล์รีสอร์ต บรรยากาศธรรมชาติ สระว่ายน้ำใหญ่",
        "category": "Resort Style & Facility",
        "expected_ids": ["c11", "c32", "c49"],
        "description": "เน้นพื้นที่สีเขียว ร่มรื่น และสระว่ายน้ำขนาดใหญ่สไตล์รีสอร์ต"
    },
    {
        "id": "q14",
        "query": "คอนโดใกล้ BTS หมอชิต วิวสวนโล่งๆ",
        "category": "Station & Green View",
        "expected_ids": ["c05", "c16"],
        "description": "ใกล้ BTS หมอชิต มองเห็นวิวสวนจตุจักรแบบเปิดโล่ง"
    },
    {
        "id": "q15",
        "query": "คอนโดติด MRT ลาดพร้าว เดินทางสะดวก ของกินเยอะ",
        "category": "Station & Convenience",
        "expected_ids": ["c13", "c43"],
        "description": "สถานีลาดพร้าว เดินไม่กี่ก้าวถึงทางขึ้นรถไฟฟ้า"
    },
    {
        "id": "q16",
        "query": "คอนโดเงียบสงบ ซอยเย็นอากาศ สาทร ราคาคุ้มค่า",
        "category": "Quiet Residential & Location",
        "expected_ids": ["c27", "c40", "c48"],
        "description": "ย่านสาทร-ลุมพินี เน้นความสงบ ไม่พลุกพล่าน"
    },
    {
        "id": "q17",
        "query": "คอนโดสายเทคโนโลยี ใกล้ True Digital Park ปุณณวิถี",
        "category": "Tech Hub & Station",
        "expected_ids": ["c28", "c33", "c46"],
        "description": "ติดหรือใกล้ True Digital Park มีระบบอำนวยความสะดวกสายไอที"
    },
    {
        "id": "q18",
        "query": "คอนโดเลี้ยงหมาใหญ่ได้ มี Pet Park แถวพัฒนาการหรือรามคำแหง",
        "category": "Pet Specialized & Location",
        "expected_ids": ["c29", "c35"],
        "description": "คอนโดที่มีสิ่งอำนวยความสะดวกสำหรับสุนัขโดยเฉพาะในทำเลรามคำแหง/พัฒนาการ"
    },
    {
        "id": "q19",
        "query": "คอนโดติด MRT ภาษีเจริญ ติดห้างซีคอนบางแค งบหมื่นเดียว",
        "category": "Station + Mall + Budget",
        "expected_ids": ["c26"],
        "description": "ระบุสถานีภาษีเจริญ ติดห้าง และงบไม่เกิน 10,000"
    },
    {
        "id": "q20",
        "query": "คอนโดใกล้ Airport Link รามคำแหง เดินทางไปสุวรรณภูมิสะดวก",
        "category": "Transit Specific",
        "expected_ids": ["c23", "c35"],
        "description": "ใกล้รถไฟฟ้าแอร์พอร์ตเรลลิงก์ เพื่อการเดินทางไปสนามบิน"
    },
    {
        "id": "q21",
        "query": "คอนโดติด BTS อนุสาวรีย์ชัย ใกล้โรงพยาบาล วิวสวย",
        "category": "Station & Medical Proximity",
        "expected_ids": ["c37", "c44"],
        "description": "ทำเลอนุสาวรีย์ชัยสมรภูมิ ติดรถไฟฟ้า ใกล้โรงพยาบาล"
    },
    {
        "id": "q22",
        "query": "คอนโดสายสปอร์ต สระว่ายน้ำยาว ฟิตเนสใหญ่ ใกล้ BTS แบริ่ง",
        "category": "Sport Facility & Station",
        "expected_ids": ["c31", "c49"],
        "description": "เน้นฟิตเนสและสระว่ายน้ำขนาดใหญ่ ใกล้ BTS แบริ่ง"
    },
    {
        "id": "q23",
        "query": "คอนโดหรูริมแม่น้ำเจ้าพระยา ใกล้ไอคอนสยาม มีเรือรับส่ง",
        "category": "Luxury Riverside & Landmark",
        "expected_ids": ["c12", "c30"],
        "description": "ริมแม่น้ำเจ้าพระยาฝั่งเจริญนคร/คลองสาน มีบริการเรือ Shuttle"
    },
    {
        "id": "q24",
        "query": "คอนโดปล่อยเช่าพร้อมพงษ์ สวนป่า 10 ไร่ สำหรับผู้บริหาร",
        "category": "Luxury & Prime Phrom Phong",
        "expected_ids": ["c14"],
        "description": "ย่านพร้อมพงษ์ สังคมระดับพรีเมียม สวนป่าขนาดใหญ่"
    },
    {
        "id": "q25",
        "query": "คอนโด Pet Friendly สไตล์เรโทร ย่านรัชดา เงียบสงบ",
        "category": "Pet + Design + Ambience",
        "expected_ids": ["c20", "c47"],
        "description": "คอนโดเลี้ยงสัตว์ได้ สไตล์เฉพาะตัวย่านรัชดาภิเษก"
    }
]


def run_benchmark_evaluation() -> Dict[str, Any]:
    """
    Executes benchmark queries across both systems and calculates:
    - Precision = (Relevant Retrieved) / (Total Retrieved)
    - Recall = (Relevant Retrieved) / (Total Expected Relevant)
    - F1-Score = 2 * (Precision * Recall) / (Precision + Recall)
    """
    nlp_precisions = []
    nlp_recalls = []
    nlp_f1s = []

    kw_precisions = []
    kw_recalls = []
    kw_f1s = []

    details = []

    for item in BENCHMARK_QUERIES:
        query = item["query"]
        expected = set(item["expected_ids"])
        n_expected = len(expected)

        # 1. Evaluate NLP Semantic Search
        nlp_res = nlp_engine.search_nlp(query, top_k=6)
        nlp_retrieved_ids = [r["id"] for r in nlp_res["results"]]
        nlp_retrieved_set = set(nlp_retrieved_ids)

        nlp_true_positives = len(expected.intersection(nlp_retrieved_set))
        nlp_precision = (nlp_true_positives / len(nlp_retrieved_set)) if nlp_retrieved_set else 0.0
        nlp_recall = (nlp_true_positives / n_expected) if n_expected > 0 else 0.0
        nlp_f1 = (2 * nlp_precision * nlp_recall / (nlp_precision + nlp_recall)) if (nlp_precision + nlp_recall) > 0 else 0.0

        nlp_precisions.append(nlp_precision)
        nlp_recalls.append(nlp_recall)
        nlp_f1s.append(nlp_f1)

        # 2. Evaluate Traditional Keyword Search
        kw_res = nlp_engine.search_keyword(query, top_k=6)
        kw_retrieved_ids = [r["id"] for r in kw_res["results"]]
        kw_retrieved_set = set(kw_retrieved_ids)

        kw_true_positives = len(expected.intersection(kw_retrieved_set))
        kw_precision = (kw_true_positives / len(kw_retrieved_set)) if kw_retrieved_set else 0.0
        kw_recall = (kw_true_positives / n_expected) if n_expected > 0 else 0.0
        kw_f1 = (2 * kw_precision * kw_recall / (kw_precision + kw_recall)) if (kw_precision + kw_recall) > 0 else 0.0

        kw_precisions.append(kw_precision)
        kw_recalls.append(kw_recall)
        kw_f1s.append(kw_f1)

        # Determine explanation for keyword search behavior
        kw_failure_reason = ""
        if len(kw_retrieved_set) == 0:
            kw_failure_reason = "ไม่พบผลลัพธ์ (0 รายการ) เนื่องจากระบบเดิมค้นหาคำตรงตัวแบบ AND ทั้งประโยค ซึ่งไม่ตรงกับคีย์เวิร์ดในฐานข้อมูล"
        else:
            kw_failure_reason = f"พบตรงตัว {len(kw_retrieved_set)} รายการ"

        details.append({
            "id": item["id"],
            "query": query,
            "category": item["category"],
            "expected_count": n_expected,
            "nlp": {
                "retrieved_count": len(nlp_retrieved_ids),
                "true_positives": nlp_true_positives,
                "precision": round(nlp_precision * 100, 1),
                "recall": round(nlp_recall * 100, 1),
                "f1": round(nlp_f1 * 100, 1),
                "extracted_entities": nlp_res["entities"]
            },
            "keyword": {
                "retrieved_count": len(kw_retrieved_ids),
                "true_positives": kw_true_positives,
                "precision": round(kw_precision * 100, 1),
                "recall": round(kw_recall * 100, 1),
                "f1": round(kw_f1 * 100, 1),
                "reason": kw_failure_reason
            }
        })

    summary = {
        "total_benchmark_queries": len(BENCHMARK_QUERIES),
        "nlp_system": {
            "avg_precision": round(sum(nlp_precisions) / len(nlp_precisions) * 100, 2),
            "avg_recall": round(sum(nlp_recalls) / len(nlp_recalls) * 100, 2),
            "avg_f1_score": round(sum(nlp_f1s) / len(nlp_f1s) * 100, 2)
        },
        "keyword_system": {
            "avg_precision": round(sum(kw_precisions) / len(kw_precisions) * 100, 2),
            "avg_recall": round(sum(kw_recalls) / len(kw_recalls) * 100, 2),
            "avg_f1_score": round(sum(kw_f1s) / len(kw_f1s) * 100, 2)
        },
        "query_details": details
    }

    return summary
