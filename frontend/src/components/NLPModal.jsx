import React from 'react'
import { Train, Heart, DollarSign, Sparkles, Tags, X, Cpu, CheckCircle2 } from 'lucide-react'

export default function NLPModal({ entities, query, onClose }) {
  if (!entities) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: 540,
          borderRadius: 20,
          border: '1px solid rgba(99, 102, 241, 0.3)',
          background: 'var(--bg-modal)',
          padding: '24px 28px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2))',
              border: '1px solid rgba(99,102,241,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8'
            }}>
              <Cpu size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                ผลการสกัดเงื่อนไข 4 มิติ (Thai NLP)
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                ขับเคลื่อนด้วย PyThaiNLP & Custom Rule-based NER
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Input Query Display */}
        {query && (
          <div style={{
            background: 'var(--bg-subtle)',
            borderRadius: 12,
            padding: '10px 14px',
            marginBottom: 16,
            border: '1px solid var(--border-color)',
            fontSize: '0.85rem'
          }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', marginBottom: 2 }}>ประโยคค้นหาภาษาธรรมชาติ:</span>
            <strong style={{ color: '#818cf8' }}>"{query}"</strong>
          </div>
        )}

        {/* 4 Dimension Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          
          {/* 1. Transit */}
          <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(96,165,250,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Train size={14} color="#60a5fa" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>1. แนวรถไฟฟ้า (Transit)</span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: entities.station ? '#60a5fa' : 'var(--text-secondary)' }}>
              {entities.station || entities.line || 'ไม่ระบุสถานีเจาะจง'}
            </div>
          </div>

          {/* 2. Pet Policy */}
          <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(244,63,94,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Heart size={14} color="#f43f5e" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>2. สัตว์เลี้ยง (Pet Policy)</span>
            </div>
            <div style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: entities.pet_friendly === true ? '#10b981' : entities.pet_friendly === false ? '#f43f5e' : 'var(--text-secondary)'
            }}>
              {entities.pet_friendly === true ? '🐾 อนุญาตเลี้ยงสัตว์' : entities.pet_friendly === false ? '🚫 ไม่อนุญาต' : 'ไม่ระบุเงื่อนไข'}
            </div>
          </div>

          {/* 3. Budget */}
          <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(245,158,11,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <DollarSign size={14} color="#f59e0b" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>3. งบประมาณ (Budget)</span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: (entities.max_price || entities.min_price) ? '#f59e0b' : 'var(--text-secondary)' }}>
              {entities.max_price
                ? `ไม่เกิน ฿${entities.max_price.toLocaleString()}/ด.`
                : entities.min_price
                  ? `เริ่มต้น ฿${entities.min_price.toLocaleString()}/ด.`
                  : 'ไม่จำกัดงบประมาณ'}
            </div>
          </div>

          {/* 4. Lifestyle */}
          <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(168,85,247,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Sparkles size={14} color="#a855f7" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>4. ไลฟ์สไตล์ (Ambience)</span>
            </div>
            {entities.lifestyle_tags_matched?.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {entities.lifestyle_tags_matched.map((tag, idx) => (
                  <span key={idx} style={{
                    fontSize: '0.72rem',
                    background: 'rgba(168,85,247,0.15)',
                    color: '#a855f7',
                    border: '1px solid rgba(168,85,247,0.3)',
                    padding: '2px 8px',
                    borderRadius: 8,
                    fontWeight: 600
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                วิเคราะห์ความหมายโดยรวม (Cosine)
              </div>
            )}
          </div>

        </div>

        {/* Tokens Breakdown */}
        {entities.tokens?.length > 0 && (
          <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border-color)', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Tags size={13} color="var(--text-muted)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                การตัดคำภาษาไทย (Thai Word Segmentation):
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {entities.tokens.map((token, i) => (
                <span key={i} style={{
                  fontSize: '0.75rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  padding: '3px 8px',
                  borderRadius: 6,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-thai)'
                }}>
                  {token}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: 8, borderTop: '1px solid var(--border-color)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10b981' }}>
            <CheckCircle2 size={14} /> สกัดและจับคู่เงื่อนไขสำเร็จ
          </span>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '4px 14px', fontSize: '0.78rem', borderRadius: 8 }}
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  )
}
