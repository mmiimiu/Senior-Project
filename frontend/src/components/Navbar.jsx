import React from 'react'
import { Sparkles, GraduationCap, Building2, Sun, Moon } from 'lucide-react'

export default function Navbar({ totalCondos = 0, theme, toggleTheme }) {
  return (
    <header className="glass-panel" style={{ position: 'sticky', top: 12, zIndex: 50, margin: '0 16px 24px 16px', padding: '12px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        
        {/* Brand & Project Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ 
            width: 44, 
            height: 44, 
            borderRadius: 12, 
            background: 'linear-gradient(135deg, #6366f1, #06b6d4)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, background: 'linear-gradient(90deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CondoLifestyle AI
              </h1>
              <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                Senior Project
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              <GraduationCap size={13} color="var(--text-muted)" />
              การพัฒนาระบบค้นหาคอนโดมิเนียมจากภาษาธรรมชาติไทยตามเงื่อนไขไลฟ์สไตล์ (ม.รังสิต)
            </p>
          </div>
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
