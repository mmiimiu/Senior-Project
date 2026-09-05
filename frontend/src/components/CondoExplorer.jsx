import React, { useState, useMemo } from 'react'
import { Building2, Search, Filter, Train, Heart, DollarSign, Sparkles } from 'lucide-react'
import CondoCard from './CondoCard'

export default function CondoExplorer({ condos = [], onSelectCondo }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStation, setSelectedStation] = useState('ALL')
  const [petFilter, setPetFilter] = useState('ALL')
  const [maxPrice, setMaxPrice] = useState(100000)

  // Extract unique stations
  const stations = useMemo(() => {
    return ['ALL', ...Array.from(new Set(condos.map(c => c.station))).sort()]
  }, [condos])

  // Filtered condos
  const filteredCondos = useMemo(() => {
    return condos.filter(condo => {
      const matchSearch = !searchTerm || 
        condo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        condo.station.toLowerCase().includes(searchTerm.toLowerCase()) ||
        condo.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchStation = selectedStation === 'ALL' || condo.station === selectedStation
      const matchPet = petFilter === 'ALL' || 
        (petFilter === 'PET' && condo.pet_friendly) ||
        (petFilter === 'NO_PET' && !condo.pet_friendly)
      
      const matchPrice = condo.price_per_month <= maxPrice

      return matchSearch && matchStation && matchPet && matchPrice
    })
  }, [condos, searchTerm, selectedStation, petFilter, maxPrice])

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-indigo">ชุดข้อมูลสำหรับโครงงานวิจัย</span>
          <span className="badge badge-cyan">{condos.length} โครงการใน กทม.</span>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
          คลังข้อมูลคอนโดมิเนียมตามแนวรถไฟฟ้า (Condominium Dataset Explorer)
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
          ชุดข้อมูลคอนโดมิเนียมพร้อมข้อความบรรยายภาษาไทยและมิติไลฟ์สไตล์ตามแนวเส้นทาง BTS และ MRT
        </p>
      </div>

      {/* Filter Toolbar */}
      <div 
        className="glass-card" 
        style={{ 
          padding: '18px 20px', 
          marginBottom: 28, 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: 16,
          alignItems: 'center'
        }}
      >
        {/* Keyword Search */}
        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6, display: 'block', fontWeight: 500 }}>
            ค้นหาชื่อโครงการ / สถานี:
          </label>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="พิมพ์ชื่อคอนโดหรือทำเล..."
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                padding: '8px 12px 8px 36px',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-thai)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Station Filter */}
        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6, display: 'block', fontWeight: 500 }}>
            สถานีรถไฟฟ้า (BTS / MRT):
          </label>
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid var(--border-color)',
              borderRadius: 10,
              padding: '8px 12px',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-thai)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {stations.map((st, idx) => (
              <option key={idx} value={st} style={{ background: '#0f172a' }}>
                {st === 'ALL' ? 'ทุกสถานี (All Stations)' : st}
              </option>
            ))}
          </select>
        </div>

        {/* Pet Friendly Filter */}
        <div>
          <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6, display: 'block', fontWeight: 500 }}>
            นโยบายสัตว์เลี้ยง (Pet Policy):
          </label>
          <select
            value={petFilter}
            onChange={(e) => setPetFilter(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid var(--border-color)',
              borderRadius: 10,
              padding: '8px 12px',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-thai)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL" style={{ background: '#0f172a' }}>ทั้งหมด (All)</option>
            <option value="PET" style={{ background: '#0f172a' }}>🐾 เลี้ยงสัตว์ได้ (Pet Friendly)</option>
            <option value="NO_PET" style={{ background: '#0f172a' }}>🚫 ไม่อนุญาตสัตว์เลี้ยง</option>
          </select>
        </div>

        {/* Price Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
            <span>งบประมาณสูงสุด:</span>
            <strong style={{ color: '#34d399' }}>฿{maxPrice.toLocaleString()} /ด.</strong>
          </div>
          <input
            type="range"
            min={7000}
            max={100000}
            step={1000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
          />
        </div>

      </div>

      {/* Results Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          แสดงผลลัพธ์ทั้งหมด: <strong style={{ color: '#ffffff' }}>{filteredCondos.length}</strong> จาก {condos.length} โครงการ
        </span>
        {(searchTerm || selectedStation !== 'ALL' || petFilter !== 'ALL' || maxPrice < 100000) && (
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedStation('ALL')
              setPetFilter('ALL')
              setMaxPrice(100000)
            }}
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: 8 }}
          >
            ล้างตัวกรองทั้งหมด
          </button>
        )}
      </div>

      {/* Condos Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filteredCondos.map((condo) => (
          <CondoCard
            key={condo.id}
            condo={condo}
            onSelect={onSelectCondo}
            searchType="browse"
          />
        ))}
      </div>

    </div>
  )
}
