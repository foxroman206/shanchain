// src/components/Explore.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Explore({ time }) {
  const navigate = useNavigate()
  const [activeChip, setActiveChip] = useState('全部')

  const chips = ['全部', '🌊 災害救援', '📚 教育', '🏥 醫療', '🌱 環境', '👴 老人', '🐾 動物', '⚠️ 排除宗教']

  return (
    <div className="screen">
      <div className="statusbar">
        <span className="time">{time}</span>
        <div className="icons">
          <button className="top-btn btn-lang dark">EN</button>
          <span>🔋</span>
        </div>
      </div>

      <div className="section-header" style={{ paddingBottom: 4 }}>
        <div className="section-title">探索專案</div>
      </div>

      <div className="search-bar">
        <span style={{ fontSize: 17, opacity: 0.4 }}>🔍</span>
        <input type="text" placeholder="搜尋專案、地區、類別..." readOnly />
      </div>

      <div className="filter-chips">
        {chips.map(chip => (
          <button
            key={chip}
            className={`chip${activeChip === chip ? ' active' : ''}`}
            style={chip === '⚠️ 排除宗教' ? { borderColor: 'rgba(201,133,26,0.4)', color: 'var(--gold)' } : {}}
            onClick={() => setActiveChip(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      <div style={{ height: 4 }} />

      <div className="project-list">
        {/* Flood */}
        <div className="project-card" onClick={() => navigate('/detail/flood')}>
          <div className="project-img bg-a">
            🌊
            <div className="project-img-overlay" />
            <div className="project-img-badge">🔴 緊急 · 剩3天</div>
          </div>
          <div className="project-body">
            <div className="task-badge badge-urgent" style={{ marginBottom: 8 }}>災害救援</div>
            <div className="project-title">花蓮水災緊急救援物資</div>
            <div className="project-org">🏛️ 台灣紅十字會 <span className="verified-badge">✓ 已驗證</span></div>
            <div className="project-progress-bar"><div className="project-progress-fill" style={{ width: '73%' }} /></div>
            <div className="project-footer">
              <div className="project-amount">NT$365,000 <span>/ 500,000</span></div>
              <div style={{ fontSize: 11, color: 'var(--ink3)' }}>👥 892</div>
            </div>
          </div>
        </div>

        {/* Temple (religion) */}
        <div className="project-card" onClick={() => navigate('/detail/temple')}>
          <div className="project-img bg-d">
            ⛩️
            <div className="project-img-overlay" />
            <div className="project-img-badge">⚠️ 高風險類別</div>
          </div>
          <div className="project-body">
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
              <div className="task-badge" style={{ background: '#fffbeb', color: '#92400e', marginBottom: 0 }}>🕌 宗教</div>
              <div style={{ background: '#fef2f2', color: 'var(--red)', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 10 }}>⚠️ 需額外審核</div>
            </div>
            <div className="project-title">大甲媽祖宮廟修繕工程</div>
            <div className="project-org">
              🕌 大甲鎮瀾宮
              <span style={{ fontSize: 10, background: '#fffbeb', color: '#92400e', padding: '2px 7px', borderRadius: 10, marginLeft: 'auto', fontWeight: 700 }}>🔍 DAO審核中</span>
            </div>
            <div className="religion-warning">
              <div className="rw-icon">⚠️</div>
              <div className="rw-text"><strong>高風險類別：</strong>宗教捐款需通過 AI 查核 + 第三方審計 + DAO 社群投票，每 NT$50,000 一個里程碑，需上傳實地照片驗證。</div>
            </div>
            <div className="project-progress-bar" style={{ marginTop: 10 }}>
              <div className="project-progress-fill" style={{ width: '28%', background: 'var(--gold)' }} />
            </div>
            <div className="project-footer">
              <div className="project-amount">NT$140,000 <span>/ 500,000</span></div>
              <div style={{ fontSize: 11, color: 'var(--ink3)' }}>👥 203</div>
            </div>
          </div>
        </div>

        {/* School */}
        <div className="project-card" onClick={() => navigate('/detail/school')}>
          <div className="project-img bg-c">
            💻
            <div className="project-img-overlay" />
            <div className="project-img-badge">📊 AI 87分</div>
          </div>
          <div className="project-body">
            <div className="task-badge badge-new" style={{ marginBottom: 8 }}>教育</div>
            <div className="project-title">偏鄉學童數位教育設備</div>
            <div className="project-org">🌿 未來種子基金會 <span className="verified-badge">✓ 已驗證</span></div>
            <div className="project-progress-bar">
              <div className="project-progress-fill" style={{ width: '45%', background: 'var(--blue)' }} />
            </div>
            <div className="project-footer">
              <div className="project-amount">NT$135,000 <span>/ 300,000</span></div>
              <div style={{ fontSize: 11, color: 'var(--ink3)' }}>👥 341</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 12 }} />
    </div>
  )
}
