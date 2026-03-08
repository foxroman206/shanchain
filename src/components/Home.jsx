// src/components/Home.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { tickerMessages } from '../data/projects.js'

export default function Home({ elderMode, time, onOpenElderModal, speakGuide, setDonateProject }) {
  const navigate = useNavigate()
  const [scanCount, setScanCount] = useState(847)
  const [tickerIdx, setTickerIdx] = useState(0)
  const [tickerVisible, setTickerVisible] = useState(true)

  // Live scan counter
  useEffect(() => {
    const id = setInterval(() => {
      setScanCount(c => c + Math.floor(Math.random() * 3) + 1)
    }, 7000)
    return () => clearInterval(id)
  }, [])

  // Ticker rotation
  useEffect(() => {
    const id = setInterval(() => {
      setTickerVisible(false)
      setTimeout(() => {
        setTickerIdx(i => (i + 1) % tickerMessages.length)
        setTickerVisible(true)
      }, 300)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  function quickDonateElder(projectId) {
    navigate(`/detail/${projectId}`)
  }

  return (
    <div className="screen">
      {/* Status bar */}
      <div className="statusbar">
        <span className="time">{time}</span>
        <div className="icons">
          <button
            className={`top-btn ${elderMode ? 'btn-elder-on' : 'btn-elder-off'}`}
            onClick={onOpenElderModal}
            aria-label="長者模式"
          >
            👴 {elderMode ? '長者✓' : '長者'}
          </button>
          <button className="top-btn btn-lang">EN</button>
        </div>
      </div>

      {/* Elder voice guide */}
      <div className="voice-bar elder-only">
        <div className="vb-icon">🔊</div>
        <div className="vb-text">歡迎使用善鏈！<br />點這裡聽語音導引</div>
        <button className="vb-btn" onClick={() => speakGuide('home')}>播放</button>
      </div>

      {/* Hero */}
      <div className="home-hero">
        <div className="hero-greeting">早安，善心人士 👋</div>
        <div className="hero-title">用科技，讓<span>每分善款</span>都抵達需要</div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="stat-num">NT$4.7M</div>
            <div className="stat-label">本月募集</div>
          </div>
          <div className="hero-stat">
            <div className="stat-num">1,284</div>
            <div className="stat-label">活躍任務</div>
          </div>
          <div className="hero-stat">
            <div className="stat-num">98.3%</div>
            <div className="stat-label">資金到位率</div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="alert-ticker">
        <div className="ticker-dot" />
        <div className="ticker-text" style={{ opacity: tickerVisible ? 1 : 0 }}>
          {tickerMessages[tickerIdx]}
        </div>
        <div className="ticker-label">LIVE</div>
      </div>

      {/* === ELDER ONLY: quick donate buttons === */}
      <div className="elder-only" style={{ padding: '12px 18px 0', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>⭐ 快速捐款</div>
        <button className="elder-simple-btn" onClick={() => quickDonateElder('flood')}>
          <div className="esb-icon">🌊</div>
          <div className="esb-info">
            <div className="esb-name">花蓮水災救援</div>
            <div className="esb-sub">緊急需要幫助 · 3天截止</div>
          </div>
          <div className="esb-arrow">›</div>
        </button>
        <button className="elder-simple-btn" onClick={() => quickDonateElder('elder')}>
          <div className="esb-icon">❤️</div>
          <div className="esb-info">
            <div className="esb-name">老人冬季送暖</div>
            <div className="esb-sub">幫助 150 位獨居長者</div>
          </div>
          <div className="esb-arrow">›</div>
        </button>
        <button className="elder-simple-btn" onClick={() => navigate('/explore')}>
          <div className="esb-icon">🔍</div>
          <div className="esb-info">
            <div className="esb-name">看更多專案</div>
            <div className="esb-sub">所有公益項目</div>
          </div>
          <div className="esb-arrow">›</div>
        </button>
      </div>

      {/* === NORMAL MODE: quick actions grid === */}
      <div className="section-header elder-hide">
        <div className="section-title">快速操作</div>
      </div>
      <div className="quick-grid elder-hide">
        <button className="quick-btn" onClick={() => navigate('/explore')}>
          <div className="quick-icon qi-1">🔍</div>
          <div className="quick-label">探索專案</div>
        </button>
        <button className="quick-btn" onClick={() => navigate('/create')}>
          <div className="quick-icon qi-2">✏️</div>
          <div className="quick-label">發起專案</div>
        </button>
        <button className="quick-btn" onClick={() => navigate('/ai')}>
          <div className="quick-icon qi-3">🤖</div>
          <div className="quick-label">AI 引擎</div>
        </button>
        <button className="quick-btn" onClick={() => navigate('/dashboard')}>
          <div className="quick-icon qi-4">📊</div>
          <div className="quick-label">我的貢獻</div>
        </button>
      </div>

      {/* Urgent tasks */}
      <div className="section-header elder-hide">
        <div className="section-title">⚠️ 緊急任務</div>
        <button className="section-more" onClick={() => navigate('/explore')}>查看全部</button>
      </div>
      <div className="tasks-scroll elder-hide">
        <div className="task-card" onClick={() => navigate('/detail/flood')}>
          <div className="task-badge badge-urgent">🔴 緊急</div>
          <div className="task-title">花蓮水災緊急救援物資</div>
          <div className="task-meta">AI 評分 94 · 影響 2,300 人</div>
          <div className="task-progress-bar"><div className="task-progress-fill" style={{ width: '73%' }} /></div>
          <div className="task-progress-label"><span>73%</span><span>剩 3 天</span></div>
        </div>
        <div className="task-card" onClick={() => navigate('/detail/school')}>
          <div className="task-badge badge-active">🟢 進行中</div>
          <div className="task-title">偏鄉學童數位教育設備</div>
          <div className="task-meta">AI 評分 87 · 影響 480 人</div>
          <div className="task-progress-bar"><div className="task-progress-fill" style={{ width: '45%', background: 'var(--green)' }} /></div>
          <div className="task-progress-label"><span>45%</span><span>剩 14 天</span></div>
        </div>
        <div className="task-card" onClick={() => navigate('/detail/elder')}>
          <div className="task-badge badge-new">🔵 新上線</div>
          <div className="task-title">獨居老人冬季送暖計畫</div>
          <div className="task-meta">AI 評分 79 · 影響 150 人</div>
          <div className="task-progress-bar"><div className="task-progress-fill" style={{ width: '12%', background: 'var(--blue)' }} /></div>
          <div className="task-progress-label"><span>12%</span><span>剩 21 天</span></div>
        </div>
      </div>

      <div style={{ height: 10 }} />

      {/* AI Banner */}
      <div className="ai-banner elder-hide" onClick={() => navigate('/ai')}>
        <div className="ai-icon-wrap">🧠</div>
        <div className="ai-banner-text">
          <div className="ai-banner-title">AI 引擎即時運作中</div>
          <div className="ai-banner-sub">已掃描 {scanCount.toLocaleString()} 事件 · 偵測 3 起緊急需求</div>
        </div>
        <div className="ai-banner-arrow">›</div>
      </div>

      <div style={{ height: 12 }} />
    </div>
  )
}
