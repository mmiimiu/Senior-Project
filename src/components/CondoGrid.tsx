"use client";

import React from "react";
import type { CondoItem, ExtractedEntities } from "@/types/condo";

interface CondoGridProps {
  heading: string;
  countText: string;
  items: CondoItem[];
  entities: ExtractedEntities;
  error: boolean;
  showLoadMore: boolean;
  showAll: boolean;
  recommendedCount: number;
  totalCount: number;
  onSelectCondo: (condo: CondoItem) => void;
  onToggleShowAll: () => void;
}

export default function CondoGrid({
  heading,
  countText,
  items,
  entities,
  error,
  showLoadMore,
  showAll,
  recommendedCount,
  totalCount,
  onSelectCondo,
  onToggleShowAll,
}: CondoGridProps) {
  return (
    <section className="results-section">
      <div className="results-header">
        <h2 id="resultsHeading">{heading}</h2>
        <span className="results-count" id="resultsCount">
          {countText}
        </span>
      </div>

      <div className="condo-grid" id="condoGrid">
        {error ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 20px", color: "#fca5a5" }}>
            <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>เชื่อมต่อระบบ Python Backend ไม่ได้</p>
            <p style={{ fontSize: "0.9rem", marginTop: "8px", color: "#cbd5e1" }}>
              รันคำสั่ง <code>npm run dev</code> หรือ <code>.venv/bin/python main.py</code> แล้วรีเฟรชหน้าเว็บอีกครั้ง
            </p>
          </div>
        ) : !items.length ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "48px 20px", color: "var(--text-muted)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🔍</div>
            <p style={{ fontSize: "1.15rem", color: "#fff", fontWeight: 600 }}>ไม่พบคอนโดมิเนียมที่ตรงกับเงื่อนไข</p>
            <p style={{ fontSize: "0.9rem", marginTop: "8px", color: "#94a3b8", lineHeight: 1.6 }}>
              {entities.out_of_scope
                ? `ทำเล "${entities.out_of_scope}" อยู่นอกแนว BTS สายสีเขียว (ระบบครอบคลุมเฉพาะคอนโดตามแนว BTS คูคต - เคหะฯ)`
                : entities.max_price
                  ? `ไม่มีรายการที่ผ่านงบไม่เกิน ฿${Number(entities.max_price).toLocaleString()} บาท/เดือน`
                  : "ลองปรับคำค้นหาหรือเปลี่ยนตัวกรอง"}
            </p>
          </div>
        ) : (
          items.map((condo) => {
            const price = Number(condo.price ?? condo.price_per_month ?? 0);
            const petFriendly = Boolean(condo.petFriendly ?? condo.pet_friendly);
            const lifestyle = condo.lifestyle ?? condo.lifestyle_tags ?? [];
            const description = condo.desc ?? condo.description ?? "";

            return (
              <article key={condo.id} className="condo-card" onClick={() => onSelectCondo(condo)}>
                <div className="card-media">
                  <img className="card-img" src={condo.image} alt={condo.name} loading="lazy" />
                  {petFriendly && <span className="badge-pet">🐾 Pet-Friendly</span>}
                  <div className="card-price-tag">
                    ฿{price.toLocaleString()}
                    <span style={{ fontSize: "0.7rem", fontWeight: 400, color: "#94a3b8" }}>/ด.</span>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="card-name">{condo.name}</h3>
                  <div className="card-station">
                    📍 {condo.station} ({condo.distance})
                  </div>
                  <p className="card-desc">{description}</p>
                  <div className="card-tags">
                    {lifestyle.map((tag) => (
                      <span
                        key={tag}
                        className={`lifestyle-tag ${entities.lifestyle_tags_matched?.includes(tag) ? "highlight" : ""}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn-view-detail"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCondo(condo);
                    }}
                  >
                    คลิกดูรายละเอียดเพิ่มเติม
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {showLoadMore && !error && (
        <div id="loadMoreBox" style={{ textAlign: "center", marginTop: "28px" }}>
          <button type="button" id="loadMoreBtn" className="btn-load-more" onClick={onToggleShowAll}>
            {showAll
              ? `ย่อรายการแนะนำ (${recommendedCount} โครงการ)`
              : `ดูห้องพักทั้งหมด (${totalCount} โครงการ)`}
          </button>
        </div>
      )}
    </section>
  );
}
