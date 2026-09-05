import React from 'react'
import { Train, Heart, DollarSign, Sparkles, Tags, ChevronRight, Cpu } from 'lucide-react'

export default function EntityBadges({ entities = null, isSearched = false }) {
  const hasEntities = entities && Object.keys(entities).length > 0

  return (
    <div
      className="glass-panel animate-fade-in"
      style={{
        width: 260,
        flexShrink: 0,
        padding: '14px 16px',
        borderRadius: 16,
        border: '1px solid rgba(99, 102, 241, 0.25)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        position: 'sticky',
        top: 84,
        alignSelf: 'flex-start',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: isSearched ? '#10b981' : '#6366f1',
            boxShadow: isSearched ? '0 0 8px #10b981' : '0 0 8px #6366f1'
          }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-heading)' }}>
            {isSearched ? 'การสกัดเงื่อนไข 4 มิติ' : 'การสกัดเงื่อนไข 4 มิติ (NLP)'}
          </span>
        </div>
        <span style={{
          fontSize: '0.62rem',
          padding: '1px 6px',
          borderRadius: 6,
          background: 'rgba(99, 102, 241, 0.12)',
          color: 'var(--accent-primary)',
          fontWeight: 600
        }}>
          PyThaiNLP
        </span>
      </div>

      {/* 4 Dimension Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        
        {/* 1. Transit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Train size={13} color="#60a5fa" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>1. รถไฟฟ้า</span>
          </div>
          <ChevronRight size={10} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: entities?.station ? '#60a5fa' : 'var(--text-muted)',
            background: entities?.station ? 'rgba(96,165,250,0.12)' : 'var(--bg-subtle)',
            padding: '2px 8px',
            borderRadius: 12,
            border: entities?.station ? '1px solid rgba(96,165,250,0.3)' : '1px solid transparent',
            maxWidth: 110,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {entities?.station || entities?.line || (isSearched ? 'ไม่ระบุ' : 'BTS / MRT')}
          </span>
        </div>

        {/* 2. Pet Policy */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Heart size={13} color="#f43f5e" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>2. สัตว์เลี้ยง</span>
          </div>
          <ChevronRight size={10} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: entities?.pet_friendly === true ? '#10b981' : entities?.pet_friendly === false ? '#f43f5e' : 'var(--text-muted)',
            background: entities?.pet_friendly === true ? 'rgba(16,185,129,0.12)' : entities?.pet_friendly === false ? 'rgba(244,63,94,0.12)' : 'var(--bg-subtle)',
            padding: '2px 8px',
            borderRadius: 12,
            border: entities?.pet_friendly != null ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent',
          }}>
            {entities?.pet_friendly === true ? '🐾 อนุญาต' : entities?.pet_friendly === false ? '🚫 ไม่อนุญาต' : (isSearched ? 'ไม่ระบุ' : 'Pet-Friendly')}
          </span>
        </div>

        {/* 3. Budget */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <DollarSign size={13} color="#f59e0b" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>3. งบประมาณ</span>
          </div>
          <ChevronRight size={10} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: (entities?.max_price || entities?.min_price) ? '#f59e0b' : 'var(--text-muted)',
            background: (entities?.max_price || entities?.min_price) ? 'rgba(245,158,11,0.12)' : 'var(--bg-subtle)',
            padding: '2px 8px',
            borderRadius: 12,
            border: (entities?.max_price || entities?.min_price) ? '1px solid rgba(245,158,11,0.3)' : '1px solid transparent',
          }}>
            {entities?.max_price
              ? `≤ ฿${entities.max_price.toLocaleString()}`
              : entities?.min_price
                ? `≥ ฿${entities.min_price.toLocaleString()}`
                : (isSearched ? 'ไม่ระบุ' : 'ช่วงราคา/เดือน')}
          </span>
        </div>

        {/* 4. Lifestyle / Ambience */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <Sparkles size={13} color="#a855f7" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>4. ไลฟ์สไตล์</span>
          </div>
          <ChevronRight size={10} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 4 }} />
          <div style={{ textAlign: 'right', maxWidth: 120 }}>
            {entities?.lifestyle_tags_matched?.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'flex-end' }}>
                {entities.lifestyle_tags_matched.map((tag, i) => (
                  <span key={i} style={{
                    fontSize: '0.65rem',
                    background: 'rgba(168,85,247,0.12)',
                    color: '#a855f7',
                    border: '1px solid rgba(168,85,247,0.3)',
                    padding: '1px 6px',
                    borderRadius: 10
                  }}>{tag}</span>
                ))}
              </div>
            ) : (
              <span style={{
                fontSize: '0.7rem',
                color: isSearched ? 'var(--text-muted)' : '#a855f7',
                background: isSearched ? 'var(--bg-subtle)' : 'rgba(168,85,247,0.1)',
                padding: '2px 8px',
                borderRadius: 12,
                display: 'inline-block'
              }}>
                {isSearched ? 'Cosine Match' : 'สงบ / WFH'}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Tokens Breakdown (when searching) */}
      {entities?.tokens?.length > 0 && (
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <Tags size={10} color="var(--text-muted)" />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>คำที่ตัดได้ (Tokens):</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {entities.tokens.map((t, i) => (
              <span key={i} style={{
                fontSize: '0.62rem',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                padding: '1px 5px',
                borderRadius: 4,
                color: 'var(--text-muted)'
              }}>{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Footer / Helper Note */}
      <div style={{ marginTop: 10, paddingTop: 6, borderTop: '1px solid var(--border-color)', fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.4, textAlign: 'center' }}>
        {isSearched ? (
          <span style={{ color: '#10b981' }}>✓ ประมวลผลจากภาษาธรรมชาติสำเร็จ</span>
        ) : (
          <span>พิมพ์ค้นหาในช่องเดียว ระบบจะสกัด 4 มิตินี้แบบอัตโนมัติ</span>
        )}
      </div>

    </div>
  )
}
