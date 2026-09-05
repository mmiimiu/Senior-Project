import React from 'react'
import { Search, Sparkles, X, ArrowRight, CornerDownLeft } from 'lucide-react'

export const EXAMPLE_QUERIES = [
  { text: 'หาคอนโดติด BTS เลี้ยงสัตว์ได้ เงียบสงบ', label: '🐾 สัตว์เลี้ยง + BTS + สงบ' },
  { text: 'คอนโดใกล้ MRT พระราม 9 เหมาะกับ WFH งบไม่เกิน 20,000', label: '💻 พระราม 9 + WFH + คุมงบ' },
  { text: 'คอนโดเลี้ยงแมวได้ งบไม่เกิน 15,000 ใกล้รถไฟฟ้า', label: '🐱 เลี้ยงแมว + งบประหยัด' },
  { text: 'คอนโดวิวแม่น้ำ บรรยากาศเงียบสงบ เป็นส่วนตัว', label: '🌊 วิวแม่น้ำเจ้าพระยา' },
  { text: 'คอนโดติด BTS อารีย์ คาเฟ่เยอะ ของกินสะดวก', label: '☕ อารีย์ + คาเฟ่ฮอปปิ้ง' },
  { text: 'คอนโดราคาประหยัด ใกล้มหาวิทยาลัย งบไม่เกิน 10,000', label: '🎓 นักศึกษา + ต่ำกว่าหมื่น' },
  { text: 'คอนโดเพดานสูง Duo Space เหมาะกับทำงาน WFH อ่อนนุช', label: '🏢 เพดานสูง + อ่อนนุช' }
]

export default function SearchBar({ query, setQuery, onSearch, isLoading }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  const handleSelectExample = (exampleText) => {
    setQuery(exampleText)
    onSearch(exampleText)
  }

  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto 28px auto' }}>
      
      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <div 
          className="pulse-glow"
          style={{
            position: 'relative',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(20px)',
            borderRadius: 20,
            border: '1.5px solid rgba(99, 102, 241, 0.4)',
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px 8px 20px',
            gap: 12,
            boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.2)'
          }}
        >
          <div style={{ color: '#818cf8', display: 'flex', alignItems: 'center' }}>
            <Sparkles size={22} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="พิมพ์ความต้องการเป็นภาษาไทย เช่น 'หาคอนโดติด BTS เลี้ยงสัตว์ได้ เงียบสงบ งบไม่เกิน 18,000'..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '1.05rem',
              fontFamily: 'var(--font-thai)',
              padding: '8px 0'
            }}
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="btn btn-primary"
            style={{
              padding: '10px 22px',
              borderRadius: 14,
              opacity: isLoading || !query.trim() ? 0.6 : 1
            }}
          >
            {isLoading ? (
              <span>กำลังประมวลผล NLP...</span>
            ) : (
              <>
                <span>ค้นหา</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Prompt Chips */}
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
          💡 ประโยคตัวอย่าง:
        </span>
        {EXAMPLE_QUERIES.map((ex, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectExample(ex.text)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 9999,
              padding: '4px 12px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-thai)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)'
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'
              e.currentTarget.style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            {ex.label}
          </button>
        ))}
      </div>

    </div>
  )
}
