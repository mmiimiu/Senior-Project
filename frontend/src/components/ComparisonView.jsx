import React from 'react'
import { Sparkles, Database, CheckCircle, XCircle, ArrowRight, AlertTriangle, Info } from 'lucide-react'
import CondoCard from './CondoCard'

export default function ComparisonView({ 
  query, 
  nlpResults, 
  keywordResults, 
  onSelectCondo, 
  isLoading 
}) {
  const nlpList = nlpResults?.results || []
  const kwList = keywordResults?.results || []

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      
      {/* Research Insight Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 16,
          padding: '16px 20px',
          marginBottom: 28,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14
        }}
      >
        <Info size={22} color="#818cf8" style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <h4 style={{ fontSize: '0.96rem', fontWeight: 700, margin: '0 0 4px 0', color: '#ffffff' }}>
            เปรียบเทียบผลลัพธ์: Thai NLP & Semantic Search vs Traditional Keyword-based Search
          </h4>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
            การค้นหาแบบดั้งเดิม (Keyword Matching) บังคับให้ข้อความในฐานข้อมูลต้องมีคำค้นหาตรงตัวครบทุกคำ 
            เมื่อผู้ใช้พิมพ์ประโยคซับซ้อน เช่น <em>"ติด BTS เลี้ยงสัตว์ได้ เงียบสงบ"</em> ระบบดั้งเดิมจะส่งคืน <strong>0 รายการ (ไม่พบข้อมูล)</strong> 
            ในขณะที่ระบบ <strong>Thai NLP & Semantic Search</strong> สามารถสกัด Entity และจับคู่บริบทเชิงความหมายได้อย่างถูกต้องแม่นยำ
          </p>
        </div>
      </div>

      {/* Side-by-Side Dual Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        
        {/* LEFT COLUMN: Thai NLP & Semantic Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Header */}
          <div 
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1.5px solid rgba(99, 102, 241, 0.4)',
              borderRadius: 16,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  ระบบ Thai NLP & Semantic Search
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#a5b4fc' }}>
                  (ระบบที่พัฒนาขึ้นในโครงงานนี้)
                </span>
              </div>
            </div>
            <div className="badge badge-emerald" style={{ fontSize: '0.82rem', padding: '4px 12px' }}>
              พบ {nlpList.length} รายการ
            </div>
          </div>

          {/* NLP Status / Entities */}
          {nlpResults?.entities && (
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border-color)', fontSize: '0.8rem', color: '#cbd5e1' }}>
              <div style={{ fontWeight: 600, color: '#a5b4fc', marginBottom: 4 }}>สกัดเงื่อนไขสำเร็จ:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {nlpResults.entities.station && <span className="badge badge-cyan">🚆 {nlpResults.entities.station}</span>}
                {nlpResults.entities.pet_friendly !== null && (
                  <span className={`badge ${nlpResults.entities.pet_friendly ? 'badge-emerald' : 'badge-rose'}`}>
                    🐾 {nlpResults.entities.pet_friendly ? 'เลี้ยงสัตว์ได้' : 'ห้ามสัตว์เลี้ยง'}
                  </span>
                )}
                {nlpResults.entities.max_price && <span className="badge badge-amber">💰 งบ ≤ ฿{nlpResults.entities.max_price.toLocaleString()}</span>}
                {nlpResults.entities.lifestyle_tags_matched?.map((t, idx) => (
                  <span key={idx} className="badge badge-purple">🌿 {t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              กำลังประมวลผล NLP...
            </div>
          ) : nlpList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
              {nlpList.map((condo) => (
                <CondoCard 
                  key={condo.id} 
                  condo={condo} 
                  onSelect={onSelectCondo} 
                  searchType="nlp" 
                />
              ))}
            </div>
          ) : (
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed var(--border-color)', borderRadius: 14, padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
              ยังไม่มีผลลัพธ์
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Traditional Keyword Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Header */}
          <div 
            style={{
              background: 'rgba(100, 116, 139, 0.15)',
              border: '1.5px solid rgba(100, 116, 139, 0.3)',
              borderRadius: 16,
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={18} color="#ffffff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                  ระบบ Keyword-Based Search แบบดั้งเดิม
                </h3>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  (แพลตฟอร์มอสังหาฯ ทั่วไปในปัจจุบัน)
                </span>
              </div>
            </div>
            <div 
              className={`badge ${kwList.length > 0 ? 'badge-indigo' : 'badge-rose'}`} 
              style={{ fontSize: '0.82rem', padding: '4px 12px' }}
            >
              พบ {kwList.length} รายการ
            </div>
          </div>

          {/* Keyword Failure Explanation Box */}
          <div style={{ background: 'rgba(244, 63, 94, 0.06)', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(244, 63, 94, 0.2)', fontSize: '0.8rem', color: '#fecdd3' }}>
            <div style={{ fontWeight: 600, color: '#fb7185', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={14} /> ข้อจำกัดของระบบแบบดั้งเดิม:
            </div>
            <div>
              {kwList.length === 0 ? (
                <span>
                  <strong>ค้นหาคำตรงตัวไม่พบ:</strong> เมื่อพิมพ์ประโยคยาวที่มีเงื่อนไขผสม (เช่น "เลี้ยงสัตว์ได้", "เงียบสงบ") ระบบพยายามหาคำที่เรียงต่อกันตรงเป๊ะทุกคำในฐานข้อมูล ทำให้ไม่พบห้องพักเลย แม้จะมีคอนโดที่ตรงกับความต้องการจริงอยู่ก็ตาม
                </span>
              ) : (
                <span>พบผลลัพธ์ที่มีคำค้นหาตรงตัวพอดี {kwList.length} รายการ แต่ไม่สามารถประเมินระดับความพึงพอใจหรือสกัดเงื่อนไขที่ซับซ้อนได้</span>
              )}
            </div>
          </div>

          {/* Keyword Results List */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              กำลังค้นหาด้วยคำสำคัญ...
            </div>
          ) : kwList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
              {kwList.map((condo) => (
                <CondoCard 
                  key={condo.id} 
                  condo={condo} 
                  onSelect={onSelectCondo} 
                  searchType="keyword" 
                />
              ))}
            </div>
          ) : (
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed rgba(244, 63, 94, 0.3)', borderRadius: 14, padding: '48px 24px', textAlign: 'center' }}>
              <XCircle size={36} color="#f43f5e" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: 6 }}>ไม่พบข้อมูลคอนโดมิเนียม (0 รายการ)</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: 320, margin: '0 auto' }}>
                ระบบแบบดั้งเดิมล้มเหลวในการตีความประโยคค้นหาภาษาธรรมชาติที่มีหลายเงื่อนไขรวมกัน
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}
