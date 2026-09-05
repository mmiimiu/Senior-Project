import React from 'react'
import { Train, Heart, DollarSign, Sparkles, Tags, CheckCircle2, AlertCircle } from 'lucide-react'

export default function EntityBadges({ entities, searchType = 'nlp' }) {
  if (!entities || Object.keys(entities).length === 0) return null

  const hasAnyEntity = entities.station || entities.line || entities.pet_friendly !== null || entities.max_price || entities.min_price || (entities.lifestyle_tags_matched && entities.lifestyle_tags_matched.length > 0)

  return (
    <div 
      className="glass-card animate-fade-in"
      style={{
        padding: '16px 20px',
        marginBottom: 28,
        border: '1px solid rgba(99, 102, 241, 0.25)',
        background: 'var(--bg-glass)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-heading)' }}>
            ผลการสกัดเงื่อนไข 4 มิติจากข้อความ (Entity Extraction Breakdown)
          </span>
        </div>
        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          Powered by PyThaiNLP & Custom NER Rules
        </span>
      </div>

      {/* Extracted Entity Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        
        {/* 1. Mass Transit */}
        <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
            <Train size={14} color="#60a5fa" />
            <span>1. แนวรถไฟฟ้า (Transit)</span>
          </div>
          <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
            {entities.station ? (
              <span className="badge badge-cyan">{entities.station}</span>
            ) : entities.line ? (
              <span className="badge badge-cyan">{entities.line}</span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>ไม่ระบุสถานีเจาะจง</span>
            )}
          </div>
        </div>

        {/* 2. Pet Policy */}
        <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
            <Heart size={14} color="#f43f5e" />
            <span>2. นโยบายสัตว์เลี้ยง (Pet Policy)</span>
          </div>
          <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
            {entities.pet_friendly === true ? (
              <span className="badge badge-emerald">🐾 อนุญาตเลี้ยงสัตว์ (Pet-Friendly)</span>
            ) : entities.pet_friendly === false ? (
              <span className="badge badge-rose">🚫 ปลอดสัตว์เลี้ยง</span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>ไม่จำกัดเงื่อนไข</span>
            )}
          </div>
        </div>

        {/* 3. Budget Range */}
        <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
            <DollarSign size={14} color="#f59e0b" />
            <span>3. ช่วงราคา/งบประมาณ (Budget)</span>
          </div>
          <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>
            {entities.min_price && entities.max_price ? (
              <span className="badge badge-amber">฿{entities.min_price.toLocaleString()} - ฿{entities.max_price.toLocaleString()}/ด.</span>
            ) : entities.max_price ? (
              <span className="badge badge-amber">ไม่เกิน ฿{entities.max_price.toLocaleString()}/เดือน</span>
            ) : entities.min_price ? (
              <span className="badge badge-amber">ตั้งแต่ ฿{entities.min_price.toLocaleString()}/เดือนขึ้นไป</span>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>ไม่จำกัดงบประมาณ</span>
            )}
          </div>
        </div>

        {/* 4. Lifestyle & Ambience */}
        <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
            <Sparkles size={14} color="#a855f7" />
            <span>4. ไลฟ์สไตล์และบรรยากาศ (Ambience)</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {entities.lifestyle_tags_matched && entities.lifestyle_tags_matched.length > 0 ? (
              entities.lifestyle_tags_matched.map((tag, idx) => (
                <span key={idx} className="badge badge-purple">{tag}</span>
              ))
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>วิเคราะห์ความหมายโดยรวม (Cosine)</span>
            )}
          </div>
        </div>

      </div>

      {/* Thai Word Tokenizer Debug Chips */}
      {entities.tokens && entities.tokens.length > 0 && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Tags size={12} /> คำที่ตัดได้ (Tokens):
          </span>
          {entities.tokens.map((token, i) => (
            <span key={i} style={{ fontSize: '0.72rem', background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: 6, color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
              {token}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
