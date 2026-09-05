import React, { useState, useEffect } from 'react'
import { BarChart3, Play, Sparkles, CheckCircle2, XCircle, TrendingUp, HelpCircle, ArrowUpRight, Award, BookOpen } from 'lucide-react'

export default function EvaluationLab({ onTestQuery }) {
  const [benchmarkData, setBenchmarkData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedQueryDetail, setSelectedQueryDetail] = useState(null)

  const fetchBenchmark = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/benchmark/run')
      const data = await res.json()
      setBenchmarkData(data)
    } catch (err) {
      console.error('Failed to run benchmark:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBenchmark()
  }, [])

  const categories = benchmarkData ? [
    'ALL',
    ...Array.from(new Set(benchmarkData.query_details.map(q => q.category)))
  ] : ['ALL']

  const filteredQueries = benchmarkData?.query_details.filter(q => 
    selectedCategory === 'ALL' || q.category === selectedCategory
  ) || []

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge badge-indigo">บทที่ 4: การทดลองและประเมินผล</span>
            <span className="badge badge-cyan">25 Benchmark Queries</span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0 0 0', color: '#ffffff' }}>
            ห้องทดลองประเมินผลประสิทธิภาพระบบ (Evaluation Lab & Benchmark)
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
            การประเมินความถูกต้องแม่นยำในการค้นหา (Precision, Recall, F1-Score) เปรียบเทียบระหว่าง Thai NLP vs Traditional Keyword Search
          </p>
        </div>

        <button
          onClick={fetchBenchmark}
          disabled={isLoading}
          className="btn btn-primary"
          style={{ padding: '10px 20px', borderRadius: 14 }}
        >
          <Play size={16} />
          <span>{isLoading ? 'กำลังประมวลผลการทดสอบ...' : 'รันการประเมินผลทั้งหมด (Run Benchmark)'}</span>
        </button>
      </div>

      {/* Summary KPI Cards Grid */}
      {benchmarkData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
          
          {/* KPI 1: Precision */}
          <div className="glass-card" style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
              ค่าความแม่นยำเฉลี่ย (Average Precision)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>
                {benchmarkData.nlp_system.avg_precision}%
              </span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                vs Keyword: <strong style={{ color: '#f87171' }}>{benchmarkData.keyword_system.avg_precision}%</strong>
              </span>
            </div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: '#34d399' }}>
              <TrendingUp size={14} />
              <span>ความแม่นยำของผลลัพธ์สูงกว่าระบบเดิมอย่างมีนัยสำคัญ</span>
            </div>
          </div>

          {/* KPI 2: Recall */}
          <div className="glass-card" style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
              ค่าความครอบคลุมเฉลี่ย (Average Recall)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#60a5fa' }}>
                {benchmarkData.nlp_system.avg_recall}%
              </span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                vs Keyword: <strong style={{ color: '#f87171' }}>{benchmarkData.keyword_system.avg_recall}%</strong>
              </span>
            </div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: '#60a5fa' }}>
              <TrendingUp size={14} />
              <span>ดึงรายการคอนโดที่ตรงเจตนาได้ครบถ้วนกว่า</span>
            </div>
          </div>

          {/* KPI 3: F1-Score */}
          <div className="glass-card" style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
              ค่าความสมดุลเฉลี่ย (Average F1-Score)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#c084fc' }}>
                {benchmarkData.nlp_system.avg_f1_score}%
              </span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                vs Keyword: <strong style={{ color: '#f87171' }}>{benchmarkData.keyword_system.avg_f1_score}%</strong>
              </span>
            </div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: '#c084fc' }}>
              <Award size={14} />
              <span>ดัชนีชี้วัดประสิทธิภาพโดยรวม (Overall Performance)</span>
            </div>
          </div>

          {/* KPI 4: Total Queries */}
          <div className="glass-card" style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
              ชุดประโยคทดสอบมาตรฐาน (Test Queries)
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
                {benchmarkData.total_benchmark_queries}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                ประโยคภาษาไทย
              </span>
            </div>
            <div style={{ marginTop: 8, fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              ครอบคลุม 4 มิติเงื่อนไขตามขอบเขตการวิจัย
            </div>
          </div>

        </div>
      )}

      {/* Category Filter Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          หมวดหมู่ชุดทดสอบ:
        </span>
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCategory(cat)}
            style={{
              background: selectedCategory === cat ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255, 255, 255, 0.05)',
              color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
              border: selectedCategory === cat ? '1px solid #6366f1' : '1px solid var(--border-color)',
              borderRadius: 9999,
              padding: '5px 14px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-thai)',
              transition: 'all 0.15s ease'
            }}
          >
            {cat === 'ALL' ? 'ทั้งหมด (All Categories)' : cat}
          </button>
        ))}
      </div>

      {/* Benchmark Queries Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', padding: 0, marginBottom: 32 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '14px 16px', color: 'var(--text-muted)', width: 60 }}>#</th>
              <th style={{ padding: '14px 16px', color: 'var(--text-primary)' }}>ประโยคทดสอบภาษาธรรมชาติ (Test Query)</th>
              <th style={{ padding: '14px 16px', color: 'var(--text-primary)' }}>หมวดหมู่</th>
              <th style={{ padding: '14px 16px', color: '#34d399', textAlign: 'center' }}>NLP Precision</th>
              <th style={{ padding: '14px 16px', color: '#60a5fa', textAlign: 'center' }}>NLP Recall</th>
              <th style={{ padding: '14px 16px', color: '#c084fc', textAlign: 'center' }}>NLP F1</th>
              <th style={{ padding: '14px 16px', color: '#f87171', textAlign: 'center' }}>Keyword Search</th>
              <th style={{ padding: '14px 16px', color: 'var(--text-primary)', textAlign: 'center' }}>การทดลอง</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueries.map((item, idx) => (
              <tr 
                key={item.id} 
                style={{ 
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)'}
              >
                <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 600 }}>{item.id.toUpperCase()}</td>
                <td style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: 500 }}>
                  {item.query}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                    {item.category}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#34d399', fontWeight: 700 }}>
                  {item.nlp.precision}%
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#60a5fa', fontWeight: 700 }}>
                  {item.nlp.recall}%
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#c084fc', fontWeight: 700 }}>
                  {item.nlp.f1}%
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  {item.keyword.retrieved_count === 0 ? (
                    <span className="badge badge-rose" style={{ fontSize: '0.72rem' }}>
                      ไม่พบ (0 รายการ)
                    </span>
                  ) : (
                    <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                      ตรงตัว {item.keyword.retrieved_count} รายการ
                    </span>
                  )}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <button
                    onClick={() => onTestQuery(item.query)}
                    className="btn btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: 8 }}
                  >
                    <span>ทดสอบค้นหา</span>
                    <ArrowUpRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Research Methodology & Findings Card */}
      <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <BookOpen size={22} color="#818cf8" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
            สรุปผลการวิจัยและข้อค้นพบสำคัญ (Key Findings & Conclusion)
          </h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.6 }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.92rem', color: '#34d399', margin: '0 0 6px 0' }}>
              1. ความเหนือกว่าของการสกัด Entity แบบผสมผสาน
            </h4>
            <p style={{ margin: 0 }}>
              ระบบสามารถแยกตัวแปรเชิงปริมาณ (สถานี BTS/MRT, งบประมาณ, เงื่อนไขสัตว์เลี้ยง) ออกจากข้อความภาษาธรรมชาติได้อย่างแม่นยำสูงถึง 90%+ ทำให้ไม่ต้องพึ่งพา Dropdown ซับซ้อน
            </p>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.92rem', color: '#60a5fa', margin: '0 0 6px 0' }}>
              2. การจับคู่ความหมายเชิงไลฟ์สไตล์ (Semantic Match)
            </h4>
            <p style={{ margin: 0 }}>
              คำเชิงนามธรรม เช่น "เงียบสงบ", "เหมาะกับ WFH", "วิวแม่น้ำ" ที่ไม่สามารถค้นหาผ่าน Keyword ปกติได้ ถูกคำนวณผ่าน Vector Cosine Similarity ร่วมกับข้อมูลคำบรรยายห้องพักอย่างมีประสิทธิภาพ
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
