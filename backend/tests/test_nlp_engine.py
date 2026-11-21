import unittest

from backend.api.routes import get_condo_by_id
from backend.data.database import DB_PATH, fetch_all_condos
from backend.services.nlp_engine import nlp_engine


class SearchConstraintTests(unittest.TestCase):
    def test_sqlite_database_is_initialized_with_100_condos(self):
        condos = fetch_all_condos()
        self.assertTrue(DB_PATH.is_file())
        self.assertEqual(len(condos), 100)

    def test_explicit_pet_policy_is_respected(self):
        cases = [
            ("คอนโดเลี้ยงสัตว์ได้", True),
            ("คอนโดไม่อนุญาตเลี้ยงสัตว์", False),
            ("คอนโดไม่รับสัตว์เลี้ยง", False),
        ]
        for query, expected_pet_policy in cases:
            with self.subTest(query=query):
                result = nlp_engine.search_nlp(query, top_k=100)
                self.assertTrue(result["results"])
                self.assertTrue(
                    all(item["pet_friendly"] is expected_pet_policy for item in result["results"])
                )

    def test_maximum_budget_is_never_exceeded(self):
        result = nlp_engine.search_nlp("คอนโดงบไม่เกิน 10000", top_k=100)
        self.assertTrue(result["results"])
        self.assertTrue(all(item["price"] <= 10000 for item in result["results"]))

    def test_budget_range_respects_both_limits(self):
        result = nlp_engine.search_nlp("คอนโดงบ 10000-20000", top_k=100)
        self.assertTrue(result["results"])
        self.assertTrue(all(10000 <= item["price"] <= 20000 for item in result["results"]))

    def test_minimum_budget_returns_only_eligible_results(self):
        result = nlp_engine.search_nlp("คอนโดตั้งแต่ 20000", top_k=100)
        self.assertTrue(result["results"])
        self.assertTrue(all(item["price"] >= 20000 for item in result["results"]))

    def test_condo_detail_endpoint_uses_numeric_dataset_ids(self):
        condo = get_condo_by_id(1)
        self.assertEqual(condo["id"], 1)

    def test_station_search_includes_only_same_or_two_adjacent_stops(self):
        result = nlp_engine.search_nlp("คอนโดใกล้ BTS อารีย์", top_k=100)
        distances = [item["station_stops_away"] for item in result["results"]]
        self.assertTrue(distances)
        self.assertEqual(distances[0], 0)
        self.assertTrue(all(distance <= 2 for distance in distances))
        self.assertEqual(distances, sorted(distances))

    def test_exact_station_match_prevents_similar_station_confusion(self):
        result = nlp_engine.search_nlp("คอนโดใกล้ BTS สะพานใหม่", top_k=100)
        self.assertEqual(result["entities"]["station"], "BTS สะพานใหม่")
        self.assertTrue(result["results"])
        self.assertEqual(result["results"][0]["station_stops_away"], 0)
        self.assertIn("BTS สะพานใหม่", result["results"][0]["station"])

    def test_khu_khot_is_recognized_from_complete_green_line(self):
        result = nlp_engine.search_nlp("คอนโด BTS คูคต", top_k=100)
        self.assertEqual(result["entities"]["station"], "BTS คูคต")
        self.assertTrue(result["results"])
        self.assertEqual(result["results"][0]["station_stops_away"], 0)

    def test_thai_budget_units_and_lifestyle_tags_are_extracted(self):
        r1 = nlp_engine.extract_entities("หาคอนโดแถวบางนา ใกล้ bts เลี้ยงสัตว์ได้ งบ 1.2 หมื่น")
        self.assertEqual(r1["max_price"], 12000)
        r2 = nlp_engine.extract_entities("หาคอนโดติดรถไฟฟ้า หมอชิต บรรยากาศร่มรื่น งบ 10 พัน")
        self.assertEqual(r2["max_price"], 10000)
        self.assertIn("ร่มรื่น", r2["lifestyle_tags_matched"])
        r3 = nlp_engine.extract_entities("หาห้องพัก แบริ่ง เลี้ยงหมาพันธุ์เล็กได้ ราคาถูก ไม่เกินหมื่น")
        self.assertEqual(r3["max_price"], 10000)
        self.assertIn("ราคาประหยัด", r3["lifestyle_tags_matched"])


if __name__ == "__main__":
    unittest.main()
