"use client";

import React from "react";
import type { ConditionSummary, ExtractedEntities } from "@/types/condo";

interface CriteriaMonitorProps {
  summary: ConditionSummary | null;
  entities: ExtractedEntities;
  query: string;
}

const LABELS: Record<string, string> = {
  entityTransit: "🚇 ทำเล:",
  entityPet: "🐾 สัตว์เลี้ยง:",
  entityLifestyle: "✨ ไลฟ์สไตล์:",
  entityBudget: "💰 งบประมาณ:",
};

export default function CriteriaMonitor({ summary, entities, query }: CriteriaMonitorProps) {
  const items = summary?.items || [
    {
      id: "entityTransit" as const,
      value: entities.station || entities.line || (query ? "ไม่พบทำเล" : "ทั้งหมด"),
      active: Boolean(entities.station || entities.line),
    },
    {
      id: "entityPet" as const,
      value:
        entities.pet_friendly === true
          ? "✅ อนุญาตเลี้ยงสัตว์"
          : entities.pet_friendly === false
            ? "❌ ไม่อนุญาตเลี้ยงสัตว์"
            : query
              ? "ทั่วไป"
              : "ไม่ระบุ",
      active: entities.pet_friendly !== null && entities.pet_friendly !== undefined,
    },
    {
      id: "entityLifestyle" as const,
      value: (entities.lifestyle_tags_matched || []).join(", ") || (query ? "ทั่วไป" : "ไม่ระบุ"),
      active: Boolean(entities.lifestyle_tags_matched?.length),
    },
    {
      id: "entityBudget" as const,
      value:
        entities.min_price && entities.max_price
          ? `${entities.min_price.toLocaleString()} - ${entities.max_price.toLocaleString()} บ./ด.`
          : entities.max_price
            ? `≤ ${entities.max_price.toLocaleString()} บ./ด.`
            : entities.min_price
              ? `≥ ${entities.min_price.toLocaleString()} บ./ด.`
              : "ไม่จำกัด",
      active: Boolean(entities.min_price || entities.max_price),
    },
  ];

  const activeCount = items.filter((item) => item.active).length;
  const badgeText = summary?.badge || (activeCount ? `สกัดได้ ${activeCount} มิติเงื่อนไข` : "พร้อมวิเคราะห์");

  return (
    <section className="nlp-insight-section" id="nlpSection">
      <div className="nlp-compact-bar">
        <div className="nlp-compact-header">
          <div className="nlp-compact-title">
            <span className="nlp-indicator" />
            <span>
              💡 <strong>สรุปเงื่อนไขคำค้นหา:</strong>{" "}
              <small style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "0.8rem" }}>
                (ระบบอ่านจากคำค้นหาของคุณอัตโนมัติ)
              </small>
            </span>
          </div>
          <span className="nlp-badge" id="matchScoreBadge">
            {badgeText}
          </span>
        </div>
        <div className="nlp-compact-row" id="entitiesGrid">
          {items.map((item) => (
            <div key={item.id} className={`nlp-compact-item ${item.active ? "active" : ""}`} id={item.id}>
              <span className="compact-label">{LABELS[item.id]}</span>
              <span className="ent-val">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
