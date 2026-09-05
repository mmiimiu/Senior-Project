import React from 'react'
import { Search, GitCompare, BarChart3, Building2, Sparkles, GraduationCap } from 'lucide-react'

export default function Navbar({ activeTab, setActiveTab, totalCondos = 50 }) {
  const navItems = [
    { id: 'search', label: 'ค้นหาด้วยภาษาธรรมชาติ', icon: Search, badge: 'Thai NLP' },
    { id: 'compare', label: 'โหมดเปรียบเทียบ', icon: GitCompare, badge: 'NLP vs Keyword' },
    { id: 'evaluation', label: 'ห้องทดลองประเมินผลวิจัย', icon: BarChart3, badge: 'Evaluation Lab' },
    { id: 'explorer', label: 'คลังคอนโดทั้งหมด', icon: Building2, count: totalCondos }
  ]

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
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, background: 'linear-gradient(90deg, #ffffff, #c7d2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CondoLifestyle AI
              </h1>
              <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                Senior Project
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              <GraduationCap size={13} color="#94a3b8" />
              การพัฒนาระบบค้นหาคอนโดมิเนียมจากภาษาธรรมชาติไทยตามเงื่อนไขไลฟ์สไตล์ (ม.รังสิต)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0, 0, 0, 0.25)', padding: 4, borderRadius: 16, border: '1px solid var(--border-color)' }}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-thai)',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.35)' : 'none'
                }}
              >
                <Icon size={16} color={isActive ? '#ffffff' : '#94a3b8'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{ 
                    fontSize: '0.68rem', 
                    padding: '2px 6px', 
                    borderRadius: 9999, 
                    background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#ffffff' : '#94a3b8'
                  }}>
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && (
                  <span style={{ 
                    fontSize: '0.72rem', 
                    padding: '2px 7px', 
                    borderRadius: 9999, 
                    background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                    color: isActive ? '#ffffff' : '#a5b4fc'
                  }}>
                    {item.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

      </div>
    </header>
  )
}
