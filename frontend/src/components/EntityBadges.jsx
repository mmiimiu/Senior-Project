import React from 'react'
import { Train, Heart, DollarSign, Sparkles, Tags, ChevronRight } from 'lucide-react'

export default function EntityBadges({ entities }) {
  if (!entities || Object.keys(entities).length === 0) return null

  return (
    <div
      className="animate-fade-in"
      style={{
        background: 'var(--bg-glass)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: 14,
        padding: '12px 14px',
        width: 240,
        flexShrink: 0,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        alignSelf: 'flex-start',
        position: 'sticky',
        top: 80,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', flexShrink: 0 }} />
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '0.01em' }}>
          NLP ตรวจจับได้
        </span>
      </div>

      {/* Entity rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>

        {/* Transit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Train size={12} color="#60a5fa" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: 44 }}>Transit</span>
          <ChevronRight size={10} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <span style={{
            fontSize: '0.7rem', fontWeight: 600, color: entities.station ? '#60a5fa' : 'var(--text-muted)',
            background: entities.station ? 'rgba(96,165,250,0.1)' : 'transparent',
            padding: entities.station ? '1px 7px' : '0',
            borderRadius: 20,
            border: entities.station ? '1px solid rgba(96,165,250,0.25)' : 'none',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 110
          }}>
            {entities.station || entities.line || 'ไม่ระบุ'}
          </span>
        </div>

        {/* Pet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Heart size={12} color="#f43f5e" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: 44 }}>สัตว์เลี้ยง</span>
          <ChevronRight size={10} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <span style={{
            fontSize: '0.7rem', fontWeight: 600,
            color: entities.pet_friendly === true ? '#10b981' : entities.pet_friendly === false ? '#f43f5e' : 'var(--text-muted)',
            background: entities.pet_friendly === true ? 'rgba(16,185,129,0.1)' : entities.pet_friendly === false ? 'rgba(244,63,94,0.1)' : 'transparent',
            padding: entities.pet_friendly != null ? '1px 7px' : '0',
            borderRadius: 20,
            border: entities.pet_friendly === true ? '1px solid rgba(16,185,129,0.25)' : entities.pet_friendly === false ? '1px solid rgba(244,63,94,0.25)' : 'none',
          }}>
            {entities.pet_friendly === true ? '🐾 ได้' : entities.pet_friendly === false ? '🚫 ไม่ได้' : 'ไม่ระบุ'}
          </span>
        </div>

        {/* Budget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <DollarSign size={12} color="#f59e0b" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: 44 }}>งบ</span>
          <ChevronRight size={10} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <span style={{
            fontSize: '0.7rem', fontWeight: 600,
            color: (entities.max_price || entities.min_price) ? '#f59e0b' : 'var(--text-muted)',
            background: (entities.max_price || entities.min_price) ? 'rgba(245,158,11,0.1)' : 'transparent',
            padding: (entities.max_price || entities.min_price) ? '1px 7px' : '0',
            borderRadius: 20,
            border: (entities.max_price || entities.min_price) ? '1px solid rgba(245,158,11,0.25)' : 'none',
            whiteSpace: 'nowrap'
          }}>
            {entities.max_price
              ? `≤ ฿${entities.max_price.toLocaleString()}`
              : entities.min_price
                ? `≥ ฿${entities.min_price.toLocaleString()}`
                : 'ไม่ระบุ'}
          </span>
        </div>

        {/* Lifestyle */}
        {entities.lifestyle_tags_matched?.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <Sparkles size={12} color="#a855f7" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', minWidth: 44 }}>ไลฟ์</span>
            <ChevronRight size={10} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {entities.lifestyle_tags_matched.slice(0, 3).map((tag, i) => (
                <span key={i} style={{
                  fontSize: '0.65rem', background: 'rgba(168,85,247,0.1)', color: '#a855f7',
                  border: '1px solid rgba(168,85,247,0.25)', padding: '1px 6px', borderRadius: 20
                }}>{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tokens */}
      {entities.tokens?.length > 0 && (
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          <Tags size={10} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          {entities.tokens.map((t, i) => (
            <span key={i} style={{
              fontSize: '0.62rem', background: 'var(--bg-subtle)', border: '1px solid var(--border-color)',
              padding: '1px 5px', borderRadius: 4, color: 'var(--text-muted)'
            }}>{t}</span>
          ))}
        </div>
      )}

      {/* Powered by */}
      <div style={{ marginTop: 8, fontSize: '0.6rem', color: 'var(--text-muted)', textAlign: 'right', opacity: 0.6 }}>
        PyThaiNLP + NER
      </div>
    </div>
  )
}
