"use client";

import React from "react";

const SAMPLE_PROMPTS = [
  "อารี เลี้ยงสัตว์ wfh ไม่เกิน7000",
  "ติด BTS เลี้ยงสัตว์ได้ เงียบสงบ",
  "ใกล้ บางเขน งบไม่เกิน 10,000",
  "คอนโดเป็นส่วนตัว ใกล้ BTS อารีย์",
  "BTS อ่อนนุช ราคาไม่เกิน 15,000 ร่มรื่น",
  "BTS คูคต ราคาประหยัด",
];

interface SearchHeroProps {
  query: string;
  loading: boolean;
  onQueryChange: (val: string) => void;
  onSubmit: (q?: string) => void;
  onClear: () => void;
  onResetHome: () => void;
}

export default function SearchHero({
  query,
  loading,
  onQueryChange,
  onSubmit,
  onClear,
  onResetHome,
}: SearchHeroProps) {
  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              id="homeBtn"
              type="button"
              className="btn-home"
              onClick={onResetHome}
              title="กลับหน้าแรกและดูรายการแนะนำ"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Home
            </button>
          </div>
        </div>
      </header>
      <div className="main-container" style={{ paddingBottom: 0 }}>
        <section className="hero-section">
        <h1 className="hero-title">
          ค้นหาคอนโด<span>BTS สายสีเขียว</span> (คูคต - เคหะฯ)
        </h1>
        <p className="hero-subtitle">
          ระบบวิเคราะห์ภาษาธรรมชาติ 4 มิติ (ทำเลแนว BTS สายสีเขียว คูคต - เคหะฯ, สัตว์เลี้ยง, ไลฟ์สไตล์, งบประมาณ) ครอบคลุม 100 โครงการ
        </p>

        <div className="search-box-wrapper">
          <form
            className="search-input-group"
            id="searchForm"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              id="searchInput"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="เช่น ใกล้ BTS บางเขน เลี้ยงสัตว์ได้ หรือ คูคต งบไม่เกิน 8,000..."
              autoComplete="off"
            />
            {query.trim() && (
              <button type="button" id="clearSearchBtn" className="btn-clear" title="ล้างข้อความ" onClick={onClear}>
                ✕
              </button>
            )}
            <button type="submit" id="submitSearchBtn" className="btn-search" disabled={loading}>
              {loading ? "กำลังค้นหา..." : "ค้นหา"}
            </button>
          </form>
        </div>

        <div className="quick-prompts-container">
          <span className="prompt-label">ทดลองคลิกคำค้นหาตัวอย่าง:</span>
          <div className="prompts-list" id="promptsList">
            {SAMPLE_PROMPTS.map((sample) => (
              <button
                key={sample}
                type="button"
                className="prompt-chip"
                onClick={() => {
                  onQueryChange(sample);
                  onSubmit(sample);
                }}
              >
                “{sample}”
              </button>
            ))}
          </div>
        </div>
        </section>
      </div>
    </>
  );
}
