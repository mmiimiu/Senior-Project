import React from 'react'
import { Train, Sparkles, ExternalLink, ShieldCheck, CheckCircle2, Layers } from 'lucide-react'

export default function CondoCard({ condo, onSelect, searchType = 'nlp' }) {
  const matchScore = condo.match_score || 0
  const walkMinutes = Math.max(1, Math.ceil((condo.distance_m || 200) / 80))
  
  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'rgba(16, 185, 129, 0.15)', text: '#059669', border: '#10b981' }
    if (score >= 60) return { bg: 'rgba(99, 102, 241, 0.15)', text: '#6366f1', border: '#6366f1' }
    if (score >= 40) return { bg: 'rgba(245, 158, 11, 0.15)', text: '#d97706', border: '#f59e0b' }
    return { bg: 'rgba(148, 163, 184, 0.15)', text: '#64748b', border: '#64748b' }
  }

  const scoreStyle = getScoreColor(matchScore)

  return (
    <div 
      className="glass-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
        borderRadius: 18,
        border: '1px solid var(--border-color)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease'
      }}
    >
      {/* Condo Image with Gradient Overlay */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img 
          src={condo.image_url} 
          alt={condo.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(15,23,42,0.88) 100%)'
        }} />

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {searchType === 'nlp' && matchScore > 0 ? (
            <div 
              style={{
                background: scoreStyle.bg,
                color: scoreStyle.text,
                border: `1px solid ${scoreStyle.border}`,
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: 9999,
                fontWeight: 700,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
              }}
            >
              <Sparkles size={13} />
              <span>{matchScore}% ตรงใจ</span>
            </div>
          ) : (
            <span style={{ background: 'rgba(16, 185, 129, 0.85)', color: '#ffffff', fontSize: '0.72rem', padding: '3px 8px', borderRadius: 9999, fontWeight: 600 }}>
              พร้อมเข้าอยู่
            </span>
          )}

          <div style={{ display: 'flex', gap: 6 }}>
            {condo.pet_friendly && (
              <span className="badge badge-emerald" style={{ backdropFilter: 'blur(8px)', fontSize: '0.72rem' }}>
                🐾 เลี้ยงสัตว์ได้
              </span>
            )}
            <span style={{ background: 'rgba(0,0,0,0.55)', color: '#f1f5f9', fontSize: '0.72rem', padding: '3px 8px', borderRadius: 9999, backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <CheckCircle2 size={11} color="#38bdf8" /> Verified
            </span>
          </div>
        </div>

        {/* Floating Price & Room Type */}
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 500 }}>ค่าเช่ารายเดือน</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                ฿{condo.price_per_month.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#e2e8f0' }}>/ด.</span>
            </div>
          </div>
          <span style={{ fontSize: '0.74rem', background: 'rgba(15, 23, 42, 0.75)', color: '#e2e8f0', padding: '3px 9px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)' }}>
            {condo.room_type}
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
        
        {/* Title */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3, margin: 0, color: 'var(--text-heading)' }}>
          {condo.name}
        </h3>

        {/* Real Estate Spec Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-subtle)', padding: '6px 10px', borderRadius: 8, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6366f1', fontWeight: 600 }}>
            <Train size={14} />
            <span>{condo.station}</span>
          </div>
          <div style={{ color: condo.distance_m <= 100 ? '#059669' : 'var(--text-muted)' }}>
            {condo.distance_m <= 50 ? '⚡ ติดสถานี' : `🚶 ~${walkMinutes} นาที (${condo.distance_m} ม.)`}
          </div>
        </div>

        {/* Match Reasons Callout Box */}
        {condo.match_reasons && condo.match_reasons.length > 0 && (
          <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 10, padding: '8px 10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#6366f1', fontWeight: 600, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={12} /> ไฮไลต์ที่ตรงกับความต้องการ:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {condo.match_reasons.slice(0, 2).map((reason, rIdx) => (
                <div key={rIdx} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: '#10b981' }}>✔</span> {reason}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description snippet */}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
          {condo.description}
        </p>

        {/* Lifestyle Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 'auto', paddingTop: 4 }}>
          {condo.lifestyle_tags.slice(0, 3).map((tag, tIdx) => (
            <span key={tIdx} style={{ fontSize: '0.7rem', background: 'var(--bg-subtle)', color: 'var(--text-secondary)', padding: '2px 7px', borderRadius: 6, border: '1px solid var(--border-color)' }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <button 
          onClick={() => onSelect(condo)}
          className="btn btn-primary"
          style={{
            width: '100%',
            marginTop: 6,
            padding: '9px 12px',
            fontSize: '0.84rem',
            justifyContent: 'center',
            borderRadius: 12
          }}
        >
          <span>ดูรายละเอียดโครงการ</span>
          <ExternalLink size={14} />
        </button>

      </div>
    </div>
  )
}
