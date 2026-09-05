import React, { useEffect } from 'react'
import { X, Train, Heart, DollarSign, Sparkles, CheckCircle2, MapPin, Building, Shield, ExternalLink } from 'lucide-react'

export default function CondoModal({ condo, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!condo) return null

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(5, 8, 18, 0.82)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
      onClick={onClose}
    >
      <div 
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 780,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          padding: 0
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Hero Header Image */}
        <div style={{ position: 'relative', height: 260, width: '100%' }}>
          <img
            src={condo.image_url}
            alt={condo.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(15,23,42,0.95) 100%)'
          }} />
          
          <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              {condo.pet_friendly ? (
                <span className="badge badge-emerald">🐾 Pet-Friendly อนุญาตเลี้ยงสัตว์</span>
              ) : (
                <span className="badge badge-rose">🚫 ไม่อนุญาตให้เลี้ยงสัตว์</span>
              )}
              {condo.match_score > 0 && (
                <span className="badge badge-indigo">
                  <Sparkles size={12} /> {condo.match_score}% Match Score
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              {condo.name}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#93c5fd', marginTop: 4 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Train size={15} /> {condo.station} ({condo.distance_m} ม.)
              </span>
              <span>•</span>
              <span style={{ color: '#cbd5e1' }}>{condo.line}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          
          {/* Top Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ค่าเช่ารายเดือน</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>
                ฿{condo.price_per_month.toLocaleString()}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 400 }}> /ด.</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ขนาดและรูปแบบห้อง</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>
                {condo.room_type}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>ระยะเดินถึงรถไฟฟ้า</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#60a5fa' }}>
                {condo.distance_m <= 50 ? '0-1 นาที (ติดสถานี)' : `${condo.distance_m} เมตร (เดิน ~${Math.ceil(condo.distance_m / 80)} นาที)`}
              </div>
            </div>
          </div>

          {/* Thai Natural Language Description */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building size={16} color="#818cf8" /> รายละเอียดโครงการและบรรยากาศห้องพัก
            </h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 14, border: '1px solid var(--border-color)', color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6 }}>
              {condo.description}
            </div>
          </div>

          {/* Lifestyle Tags */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} color="#a855f7" /> จุดเด่นและมิติไลฟ์สไตล์ (Lifestyle Tags)
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {condo.lifestyle_tags.map((tag, idx) => (
                <span key={idx} className="badge badge-purple" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Facilities & Amenities */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={16} color="#34d399" /> สิ่งอำนวยความสะดวกภายในโครงการ (Facilities)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
              {condo.facilities.map((fac, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: '#e2e8f0', background: 'rgba(255, 255, 255, 0.02)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <CheckCircle2 size={15} color="#10b981" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Simulation & Location Info */}
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 14, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MapPin size={22} color="#f43f5e" />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>พิกัดทำเลที่ตั้งโครงการ</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  ละติจูด: {condo.lat}, ลองจิจูด: {condo.lng} ({condo.station})
                </div>
              </div>
            </div>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(condo.name + ' ' + condo.station)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary"
              style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            >
              <span>เปิดดูบน Google Maps</span>
              <ExternalLink size={13} />
            </a>
          </div>

        </div>

      </div>
    </div>
  )
}
