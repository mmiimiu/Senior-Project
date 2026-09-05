import React, { useState, useEffect, useMemo } from 'react'
import { Sparkles, Building, AlertCircle, ArrowUpDown, X, Cpu } from 'lucide-react'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import NLPModal from './components/NLPModal'
import CondoCard from './components/CondoCard'
import CondoModal from './components/CondoModal'

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('match')
  const [nlpResults, setNlpResults] = useState(null)
  const [allCondos, setAllCondos] = useState([])
  const [selectedCondo, setSelectedCondo] = useState(null)
  const [showNLPModal, setShowNLPModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(false)

  // Handle Theme switching & persistence
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // Fetch all condos on mount
  useEffect(() => {
    fetch('/api/condos')
      .then(res => res.json())
      .then(data => {
        if (data.condos) setAllCondos(data.condos)
      })
      .catch(err => console.error('Failed to load condos:', err))
  }, [])

  const handleSearch = async (searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) {
      setNlpResults(null)
      return
    }
    setIsLoading(true)
    setError(null)

    try {
      const nlpRes = await fetch('/api/search/nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, top_k: 50 })
      })
      const nlpData = await nlpRes.json()
      setNlpResults(nlpData)
    } catch (err) {
      console.error('Search error:', err)
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearSearch = () => {
    setQuery('')
    setNlpResults(null)
    setShowAll(false)
  }

  // Determine active list: search results or all condos
  const activeCondos = nlpResults ? (nlpResults.results || []) : allCondos

  const sortedCondos = useMemo(() => {
    const list = [...activeCondos]
    if (sortBy === 'price_asc') return list.sort((a, b) => a.price_per_month - b.price_per_month)
    if (sortBy === 'price_desc') return list.sort((a, b) => b.price_per_month - a.price_per_month)
    if (sortBy === 'distance') return list.sort((a, b) => (a.distance_m || 0) - (b.distance_m || 0))
    if (nlpResults) {
      return list.sort((a, b) => (b.match_score || 0) - (a.match_score || 0))
    }
    return list
  }, [activeCondos, sortBy, nlpResults])

  // In browse mode show only 9 initially; search always shows full results
  const displayedCondos = (!nlpResults && !showAll) ? sortedCondos.slice(0, 9) : sortedCondos

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar 
        totalCondos={allCondos.length} 
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, paddingBottom: 60, maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Error Alert */}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: 12, padding: '12px 16px', color: '#fca5a5', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="animate-fade-in">
          
          {/* Real Estate Portal Hero Section */}
          <div style={{ textAlign: 'center', margin: '20px auto 32px auto', maxWidth: 800 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '4px 14px', borderRadius: 9999, marginBottom: 14 }}>
              <Sparkles size={14} color="#818cf8" />
              <span style={{ fontSize: '0.82rem', color: '#6366f1', fontWeight: 600 }}>
                Thai NLP Condominium Search Platform
              </span>
            </div>
            
            <h2 style={{ fontSize: '2.3rem', fontWeight: 800, margin: '0 0 12px 0', lineHeight: 1.25, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, var(--text-heading), #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ค้นหาคอนโดมิเนียมตามไลฟ์สไตล์ที่คุณต้องการ
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', margin: '0 auto', maxWidth: 650, lineHeight: 1.5 }}>
              ค้นหาคอนโดตามแนวรถไฟฟ้า BTS/MRT พร้อมระบุเงื่อนไขสัตว์เลี้ยง งบประมาณ และไลฟ์สไตล์ที่ต้องการได้อย่างอิสระ
            </p>
          </div>

          {/* Natural Language Search Input */}
          <SearchBar 
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            isLoading={isLoading}
          />

          {/* Condo Listings Header & Sorting */}
          <div style={{ marginTop: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
              
              {/* Left Title & Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-heading)' }}>
                  {nlpResults ? 'ผลการค้นหาคอนโดมิเนียม' : 'คอนโดมิเนียมแนะนำ'}
                </h3>
                <span className="badge badge-indigo">
                  {nlpResults ? `พบ ${nlpResults.total_found} โครงการ` : `${!showAll ? '9' : allCondos.length} / ${allCondos.length} โครงการ`}
                </span>
                
                {/* Button to Open NLP Breakdown Modal */}
                {nlpResults?.entities && (
                  <button
                    onClick={() => setShowNLPModal(true)}
                    className="btn btn-secondary"
                    style={{
                      padding: '5px 12px',
                      fontSize: '0.78rem',
                      borderRadius: 10,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'rgba(99, 102, 241, 0.12)',
                      border: '1px solid rgba(99, 102, 241, 0.35)',
                      color: '#818cf8',
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.15s ease'
                    }}
                    title="คลิกเพื่อดูการสกัดเงื่อนไข 4 มิติจาก PyThaiNLP"
                  >
                    <Cpu size={14} />
                    <span>ดูผลวิเคราะห์ NLP 4 มิติ</span>
                  </button>
                )}

                {nlpResults && (
                  <button
                    onClick={handleClearSearch}
                    className="btn btn-secondary"
                    style={{ padding: '5px 10px', fontSize: '0.75rem', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <X size={12} />
                    <span>ล้างการค้นหา</span>
                  </button>
                )}
              </div>

              {/* Sorting Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-subtle)', border: '1px solid var(--border-color)', borderRadius: 10, padding: '6px 14px' }}>
                <ArrowUpDown size={14} color="var(--text-muted)" />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 500 }}>จัดเรียง:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.82rem', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-thai)' }}
                >
                  {nlpResults && (
                    <option value="match" style={{ background: 'var(--bg-modal)' }}>🌟 ความตรงใจสูงสุด (% Match)</option>
                  )}
                  <option value="price_asc" style={{ background: 'var(--bg-modal)' }}>💰 ราคา: ต่ำ ➔ สูง</option>
                  <option value="price_desc" style={{ background: 'var(--bg-modal)' }}>💎 ราคา: สูง ➔ ต่ำ</option>
                  <option value="distance" style={{ background: 'var(--bg-modal)' }}>🚆 ใกล้รถไฟฟ้าที่สุด</option>
                </select>
              </div>
            </div>

            {/* Grid of Condo Cards */}
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <div style={{ width: 40, height: 40, border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
                <p>กำลังวิเคราะห์ประโยคภาษาธรรมชาติและค้นหาคอนโดมิเนียม...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : sortedCondos.length > 0 ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 22 }}>
                  {displayedCondos.map((condo) => (
                    <CondoCard 
                      key={condo.id}
                      condo={condo}
                      onSelect={(c) => setSelectedCondo(c)}
                      searchType={nlpResults ? 'nlp' : 'browse'}
                    />
                  ))}
                </div>
                {/* Show All button — browse mode only, when not expanded yet */}
                {!nlpResults && !showAll && sortedCondos.length > 9 && (
                  <div style={{ textAlign: 'center', marginTop: 36 }}>
                    <button
                      onClick={() => setShowAll(true)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                        color: '#fff', border: 'none', borderRadius: 12,
                        padding: '12px 32px', fontSize: '0.9rem', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'var(--font-thai)',
                        boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.5)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.35)' }}
                    >
                      <Building size={16} />
                      ดูคอนโดทั้งหมด {allCondos.length} โครงการ
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
                <Building size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px auto' }} />
                <h4 style={{ fontSize: '1.1rem', marginBottom: 6 }}>ไม่พบคอนโดมิเนียมที่ตรงกับเงื่อนไข</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  ลองปรับเปลี่ยนข้อความค้นหา หรือคลิกประโยคตัวอย่างด้านบนเพื่อทดสอบ
                </p>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Single Condo Detail Modal */}
      <CondoModal 
        condo={selectedCondo} 
        onClose={() => setSelectedCondo(null)} 
      />

      {/* 4-Dimension NLP Breakdown Modal */}
      {showNLPModal && nlpResults?.entities && (
        <NLPModal 
          entities={nlpResults.entities}
          query={query}
          onClose={() => setShowNLPModal(false)}
        />
      )}

    </div>
  )
}
