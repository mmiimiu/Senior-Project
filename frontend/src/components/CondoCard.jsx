import React from 'react'
import { Train, Heart, DollarSign, Check, MapPin, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react'

export default function CondoCard({ condo, onSelect, searchType = 'nlp' }) {
  const matchScore = condo.match_score || 0
  
  // Score color helper
  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'rgba(16, 185, 129, 0.2)', text: '#34d399', border: '#10b981' }
    if (score >= 60) return { bg: 'rgba(99, 102, 241, 0.2)', text: '#818cf8', border: '#6366f1' }
    if (score >= 40) return { bg: 'rgba(245, 158, 11, 0.2)', text: '#fbbf24', border: '#f59e0b' }
    return { bg: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8', border: '#64748b' }
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
        position: 'relative'
      }}
    >
      {/* Condo Image with Gradient Overlay */}
      <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
        <img 
          src={condo.image_url} 
          alt={condo.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.85) 100%)'
        }} />

        {/* Top Badges: Match Score & Pet Friendly */}
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
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <Sparkles size={14} />
              <span>{matchScore}% Match</span>
            </div>
          ) : <div />}

          {condo.pet_friendly ? (
            <span className="badge badge-emerald" style={{ backdropFilter: 'blur(8px)' }}>
              🐾 เลี้ยงสัตว์ได้
            </span>
          ) : (
            <span style={{ 
              background: 'rgba(0, 0, 0, 0.6)', 
              color: '#94a3b8', 
              fontSize: '0.74rem', 
              padding: '3px 8px', 
              borderRadius: 9999,
              backdropFilter: 'blur(8px)' 
            }}>
              ห้ามเลี้ยงสัตว์
            </span>
          )}
        </div>

        {/* Price Tag (Floating on Image bottom) */}
        <div style={{ position: 'absolute', bottom: 10, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              ฿{condo.price_per_month.toLocaleString()}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1', marginLeft: 4 }}>
              / เดือน
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.6)', color: '#e2e8f0', padding: '2px 8px', borderRadius: 6 }}>
            {condo.room_type}
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1, gap: 10 }}>
        
        {/* Title */}
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3, margin: 0, color: '#ffffff' }}>
          {condo.name}
        </h3>

        {/* Transit Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#93c5fd', fontSize: '0.84rem' }}>
          <Train size={15} />
          <span>{condo.station}</span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: condo.distance_m <= 100 ? '#34d399' : '#94a3b8', fontWeight: condo.distance_m <= 100 ? 600 : 400 }}>
            {condo.distance_m <= 50 ? 'ติดสถานี' : `${condo.distance_m} ม.`}
          </span>
        </div>

        {/* Match Reasons Callout Box (NLP Explanations) */}
        {condo.match_reasons && condo.match_reasons.length > 0 && (
          <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: 10, padding: '8px 10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#a5b4fc', fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={12} /> ตรงตามเงื่อนไขที่วิเคราะห์ได้:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {condo.match_reasons.slice(0, 3).map((reason, rIdx) => (
                <div key={rIdx} style={{ fontSize: '0.76rem', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: '#34d399' }}>✔</span> {reason}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description snippet */}
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
          {condo.description}
        </p>

        {/* Lifestyle Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 'auto', paddingTop: 6 }}>
          {condo.lifestyle_tags.slice(0, 4).map((tag, tIdx) => (
            <span key={tIdx} style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', padding: '2px 8px', borderRadius: 6 }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <button 
          onClick={() => onSelect(condo)}
          className="btn btn-secondary"
          style={{
            width: '100%',
            marginTop: 8,
            padding: '8px 12px',
            fontSize: '0.85rem',
            justifyContent: 'center'
          }}
        >
          <span>ดูรายละเอียดโครงการ</span>
          <ExternalLink size={14} />
        </button>

      </div>
    </div>
  )
}
