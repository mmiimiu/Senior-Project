"use client";

import React from "react";
import type { CondoItem } from "@/types/condo";

interface ModalsProps {
  selectedCondo: CondoItem | null;
  showResearchModal: boolean;
  onCloseCondo: () => void;
  onCloseResearch: () => void;
}

export default function Modals({
  selectedCondo,
  showResearchModal,
  onCloseCondo,
  onCloseResearch,
}: ModalsProps) {
  return (
    <>
      {showResearchModal && (
        <div
          className="modal-overlay"
          id="researchModal"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseResearch();
          }}
        >
          <div className="modal-dialog">
            <button type="button" className="modal-close-btn" id="closeModalBtn" onClick={onCloseResearch}>
              &times;
            </button>
            <div className="modal-header">
              <div className="uni-badge-modal">มหาวิทยาลัยรังสิต • ปริญญานิพนธ์ 2569</div>
              <h2>ระบบค้นหาคอนโดมิเนียมด้วยภาษาธรรมชาติภาษาไทยตามไลฟ์สไตล์</h2>
            </div>
            <div className="modal-body">
              <div className="author-card">
                <div className="author-row">
                  <strong>ผู้วิจัย:</strong> <span>นางสาว วาธิณีย์ วรรณกิจ (รหัสนักศึกษา 6707225)</span>
                </div>
                <div className="author-row">
                  <strong>อาจารย์ที่ปรึกษา:</strong> <span>อาจารย์ สุมนา เกษมสวัสดิ์</span>
                </div>
                <div className="author-row">
                  <strong>หลักสูตร:</strong> <span>วิทยาศาสตรบัณฑิต (วท.บ.) วิทยาการคอมพิวเตอร์</span>
                </div>
                <div className="author-row">
                  <strong>คณะ:</strong> <span>วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี มหาวิทยาลัยรังสิต</span>
                </div>
              </div>
              <div className="modal-text-block">
                <h4>ที่มาและความสำคัญ</h4>
                <p>
                  แก้ปัญหาของระบบเดิมแบบ Keyword Search ที่ไม่สามารถค้นหาประโยคภาษาธรรมชาติที่มีหลายเงื่อนไขรวมกันได้
                  เช่น &quot;ติด BTS เลี้ยงสัตว์ได้ เงียบสงบ&quot; ด้วยการใช้ Thai NLP สกัดเอนทิตี 4 มิติหลัก
                  และคำนวณความสอดคล้องเชิงไลฟ์สไตล์
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedCondo && (
        <div
          className="modal-overlay"
          id="condoModal"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseCondo();
          }}
        >
          <div className="modal-dialog">
            <button type="button" className="modal-close-btn" id="closeCondoModalBtn" onClick={onCloseCondo}>
              &times;
            </button>
            <div id="condoModalContent">
              <img src={selectedCondo.image} className="condo-detail-img" alt={selectedCondo.name} />
              <h2 style={{ fontSize: "1.3rem", marginBottom: "4px", color: "#fff" }}>{selectedCondo.name}</h2>
              <div style={{ color: "#a5b4fc", fontSize: "0.9rem", marginBottom: "8px" }}>
                📍 {selectedCondo.station} ({selectedCondo.distance}) • สาย {selectedCondo.transitType || "BTS"}
              </div>
              <div className="detail-price-box">
                ฿{Number(selectedCondo.price ?? selectedCondo.price_per_month ?? 0).toLocaleString()}{" "}
                <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>/ เดือน</span>
              </div>
              <div style={{ marginBottom: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {selectedCondo.petFriendly ?? selectedCondo.pet_friendly ? (
                  <span className="badge-pet" style={{ position: "static" }}>
                    🐾 เลี้ยงสัตว์ได้ (Pet-Friendly)
                  </span>
                ) : (
                  <span style={{ background: "rgba(255,255,255,0.08)", padding: "3px 8px", borderRadius: "6px", fontSize: "0.75rem" }}>
                    ไม่อนุญาตเลี้ยงสัตว์
                  </span>
                )}
                {(selectedCondo.lifestyle ?? selectedCondo.lifestyle_tags ?? []).map((tag) => (
                  <span key={tag} className="lifestyle-tag highlight">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="author-card">
                <strong>รายละเอียดโครงการ:</strong>
                <p style={{ color: "#cbd5e1", fontSize: "0.88rem", lineHeight: 1.6, marginTop: "6px" }}>
                  {selectedCondo.desc ?? selectedCondo.description ?? ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
