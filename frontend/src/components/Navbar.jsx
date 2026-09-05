import React from 'react'
import { Building2, Sun, Moon, GraduationCap } from 'lucide-react'

export default function Navbar({ totalCondos = 0, theme, toggleTheme }) {
  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 12, zIndex: 50, margin: '0 16px 24px 16px', padding: '12px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        
        {/* Brand — CONDO wordmark with Thesis Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={{
              margin: 0,
              fontSize: '1.6rem',
              fontWeight: 900,
              letterSpacing: '0.18em',
              fontFamily: 'var(--font-en)',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              CONDO
            </h1>
          </div>
          <p style={{
            margin: 0,
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}>
            <GraduationCap size={13} color="#818cf8" />
            การพัฒนาระบบค้นหาคอนโดมิเนียมจากข้อความภาษาธรรมชาติภาษาไทยตามเงื่อนไขไลฟ์สไตล์
          </p>
        </div>

        {/* Right Info: Total Condos & Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {totalCondos > 0 && (
            <div className="badge badge-cyan" style={{ fontSize: '0.82rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={14} />
              <span>{totalCondos} โครงการในระบบ</span>
            </div>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            title={theme === 'dark' ? 'สลับเป็นโหมดสว่าง (Light Mode)' : 'สลับเป็นโหมดมืด (Dark Mode)'}
            style={{
              padding: '8px 14px',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid var(--border-color)'
            }}
          >
            {theme === 'dark' ? (
              <>
                <Sun size={16} color="#fbbf24" />
                <span>โหมดสว่าง</span>
              </>
            ) : (
              <>
                <Moon size={16} color="#6366f1" />
                <span>โหมดมืด</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  )
}
