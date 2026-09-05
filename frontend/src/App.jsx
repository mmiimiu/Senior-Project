import React, { useState, useEffect } from 'react'
import { Sparkles, Building, GitCompare, AlertCircle, GraduationCap } from 'lucide-react'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import EntityBadges from './components/EntityBadges'
import CondoCard from './components/CondoCard'
import CondoModal from './components/CondoModal'
import ComparisonView from './components/ComparisonView'
import EvaluationLab from './components/EvaluationLab'
import CondoExplorer from './components/CondoExplorer'

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })
  const [activeTab, setActiveTab] = useState('search')
  const [query, setQuery] = useState('หาคอนโดติด BTS เลี้ยงสัตว์ได้ เงียบสงบ งบไม่เกิน 18,000')
  const [nlpResults, setNlpResults] = useState(null)
  const [keywordResults, setKeywordResults] = useState(null)
  const [allCondos, setAllCondos] = useState([])
  const [selectedCondo, setSelectedCondo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

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
    
    // Initial search
    handleSearch('หาคอนโดติด BTS เลี้ยงสัตว์ได้ เงียบสงบ งบไม่เกิน 18,000')
  }, [])

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return
    setIsLoading(true)
    setError(null)

    try {
      // 1. NLP Semantic Search
      const nlpRes = await fetch('/api/search/nlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, top_k: 20 })
      })
      const nlpData = await nlpRes.json()
      setNlpResults(nlpData)

      // 2. Traditional Keyword Search (for comparison mode)
      const kwRes = await fetch('/api/search/keyword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, top_k: 20 })
      })
      const kwData = await kwRes.json()
      setKeywordResults(kwData)

    } catch (err) {
      console.error('Search error:', err)
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestFromEvaluation = (testQuery) => {
    setQuery(testQuery)
    handleSearch(testQuery)
    setActiveTab('compare') // switch to comparison view to see test result
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        totalCondos={allCondos.length} 
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, paddingBottom: 60 }}>
        
        {/* Error Alert */}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: 12, padding: '12px 16px', color: '#fca5a5', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: Smart NLP Search */}
        {activeTab === 'search' && (
          <div className="animate-fade-in">
            
            {/* Hero Section */}
            <div style={{ textAlign: 'center', margin: '16px auto 32px auto', maxWidth: 760 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '4px 14px', borderRadius: 9999, marginBottom: 14 }}>
                <Sparkles size={14} color="#818cf8" />
                <span style={{ fontSize: '0.82rem', color: '#6366f1', fontWeight: 600 }}>
                  Thai NLP & Semantic Search Engine
                </span>
              </div>
              
              <h2 style={{ fontSize: '2.1rem', fontWeight: 800, margin: '0 0 10px 0', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
                ค้นหาคอนโดมิเนียมตามไลฟ์สไตล์ที่คุณต้องการ
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                พิมพ์ความต้องการเป็นภาษาธรรมชาติ เช่น <em>"ติด BTS เลี้ยงแมวได้ เงียบสงบ งบไม่เกิน 15,000"</em> 
                ระบบจะวิเคราะห์เงื่อนไข 4 มิติและค้นหาห้องพักที่ตรงใจที่สุดโดยอัตโนมัติ
              </p>
            </div>

            {/* Natural Language Search Input */}
            <SearchBar 
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            {/* Extracted Entity Badges */}
            {nlpResults?.entities && (
              <EntityBadges 
                entities={nlpResults.entities} 
                searchType="nlp" 
              />
            )}

            {/* Search Results Section */}
            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                    ผลลัพธ์คอนโดมิเนียมที่แนะนำ
                  </h3>
                  {nlpResults && (
                    <span className="badge badge-indigo">
                      พบ {nlpResults.total_found} โครงการ
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setActiveTab('compare')}
                  className="btn btn-outline-primary"
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  <GitCompare size={14} />
                  <span>เปรียบเทียบกับระบบเดิม (Keyword Search)</span>
                </button>
              </div>

              {/* Grid of Ranked Condo Cards */}
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                  <div style={{ width: 40, height: 40, border: '3px solid rgba(99, 102, 241, 0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
                  <p>กำลังวิเคราะห์ประโยคภาษาธรรมชาติและจับคู่คอนโดมิเนียม...</p>
                  <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
              ) : nlpResults?.results?.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                  {nlpResults.results.map((condo) => (
                    <CondoCard 
                      key={condo.id}
                      condo={condo}
                      onSelect={(c) => setSelectedCondo(c)}
                      searchType="nlp"
                    />
                  ))}
                </div>
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
        )}

        {/* TAB 2: Side-by-Side Comparison */}
        {activeTab === 'compare' && (
          <div>
            <SearchBar 
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            <ComparisonView 
              query={query}
              nlpResults={nlpResults}
              keywordResults={keywordResults}
              onSelectCondo={(c) => setSelectedCondo(c)}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* TAB 3: Evaluation Lab & Research Dashboard */}
        {activeTab === 'evaluation' && (
          <EvaluationLab onTestQuery={handleTestFromEvaluation} />
        )}

        {/* TAB 4: Condo Explorer */}
        {activeTab === 'explorer' && (
          <CondoExplorer 
            condos={allCondos} 
            onSelectCondo={(c) => setSelectedCondo(c)} 
          />
        )}

      </main>

      {/* Single Condo Detail Modal */}
      <CondoModal 
        condo={selectedCondo} 
        onClose={() => setSelectedCondo(null)} 
      />

      {/* University & Author Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-glass)', padding: '20px 24px', marginTop: 'auto' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GraduationCap size={18} color="#6366f1" />
            <span>
              <strong>ปริญญานิพนธ์:</strong> การพัฒนาระบบค้นหาคอนโดมิเนียมจากข้อความภาษาธรรมชาติภาษาไทยตามเงื่อนไขไลฟ์สไตล์
            </span>
          </div>
          <div>
            ผู้จัดทำ: <strong>นางสาว วาธิณีย์ วรรณกิจ (6707225)</strong> • ที่ปรึกษา: <strong>อ.สุมนา เกษมสวัสดิ์</strong> • มหาวิทยาลัยรังสิต
          </div>
        </div>
      </footer>

    </div>
  )
}
