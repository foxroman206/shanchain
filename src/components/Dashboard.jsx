// src/components/Dashboard.jsx
import { useState, useEffect } from 'react'
import { auth as authApi, donations as donationsApi } from '../api/client.js'

const STORIES = [
  { emoji: '👴', text: <>感謝您！您的捐款讓 <strong>王伯伯（82歲）</strong> 今年冬天不再挨凍，他說：「有人記得我，我很開心。」</> },
  { emoji: '📚', text: <>偏鄉的 <strong>小美（10歲）</strong> 第一次用上平板：「我終於可以跟城市同學學一樣的東西了！」</> },
  { emoji: '🌊', text: <>花蓮家庭重建中：「我們以為什麼都沒了，大家的善意讓我們重新站起來。謝謝。」</> },
]

export default function Dashboard({ time, user }) {
  const [storyIdx, setStoryIdx] = useState(0)
  const [userData, setUserData] = useState(null)
  const [myDonations, setMyDonations] = useState([])

  useEffect(() => {
    const id = setInterval(() => {
      setStoryIdx(i => (i + 1) % STORIES.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (authApi.hasToken()) {
      authApi.me().then(d => setUserData(d)).catch(() => {})
      donationsApi.myHistory({ limit: 10 }).then(d => setMyDonations(d.donations || [])).catch(() => {})
    }
  }, [])

  const story = STORIES[storyIdx]

  return (
    <div className="screen">
      <div className="statusbar">
        <span className="time">{time}</span>
        <div className="icons"><span>🔋</span></div>
      </div>

      <div className="section-header" style={{ paddingBottom: 4 }}>
        <div className="section-title">📊 我的貢獻</div>
      </div>

      {/* Impact hero */}
      <div style={{ margin: '0 18px 10px', background: 'var(--ink)', borderRadius: 'var(--rb)', padding: 20, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, background: 'radial-gradient(circle,rgba(45,122,79,0.3),transparent)', borderRadius: '50%' }} />
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>TOTAL IMPACT</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 36, fontWeight: 500, color: '#fff', letterSpacing: -2, marginBottom: 4 }}>NT$8,420</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
          已支持 <strong style={{ color: '#fff' }}>14</strong> 個專案 · 影響 <strong style={{ color: 'var(--green)' }}>3,720</strong> 人
        </div>
      </div>

      {/* Story carousel */}
      <div style={{ padding: '0 18px', marginBottom: 10 }}>
        <div className="story-carousel" onClick={() => setStoryIdx(i => (i + 1) % STORIES.length)}>
          <div className="story-emoji">{story.emoji}</div>
          <div className="story-text">{story.text}</div>
          <div className="story-footer">
            <div className="story-dots">
              {STORIES.map((_, i) => (
                <div key={i} className={`story-dot${i === storyIdx ? ' active' : ''}`} />
              ))}
            </div>
            <button className="share-btn" onClick={e => { e.stopPropagation(); alert('📤 已分享到 LINE！（Demo 模擬）') }}>
              分享 📤
            </button>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="dash-card">
        <div className="dash-card-title">🏅 守護者勳章</div>
        <div className="badge-row">
          <div className="badge-chip badge-gold">⭐ 黃金守護者</div>
          <div className="badge-chip badge-blue">💡 數位先鋒</div>
          <div className="badge-chip badge-green">🌱 環境衛士</div>
          <div className="badge-chip badge-red">🔥 連續30天</div>
        </div>
      </div>

      {/* NFT grid */}
      <div className="dash-card">
        <div className="dash-card-title">🎖️ NFT 公益證明</div>
        <div className="nft-grid">
          {[
            { bg: 'bg-a', icon: '🌊', name: '花蓮救援\n#001' },
            { bg: 'bg-c', icon: '💻', name: '數位教育\n#012' },
            { bg: 'bg-b', icon: '🌱', name: '淨灘行動\n#034' },
            { bg: 'bg-d', icon: '❤️', name: '送暖計畫\n#078' },
            { bg: 'bg-e', icon: '🏥', name: '偏鄉醫療\n#103' },
            { bg: '', icon: '+', name: '下次解鎖' },
          ].map((n, i) => (
            <div key={i} className={`nft-card ${n.bg}`}
              style={i === 5 ? { background: 'var(--surface2)', border: '2px dashed var(--border)' } : {}}
            >
              <span style={i === 5 ? { opacity: 0.3 } : {}}>{n.icon}</span>
              <div className="nft-name" style={i === 5 ? { color: 'var(--ink3)' } : {}}>
                {n.name.split('\n').map((line, j) => <span key={j}>{line}{j === 0 && <br />}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity */}
      <div className="dash-card">
        <div className="dash-card-title">📝 最近捐款紀錄</div>
        {[
          { bg: 'bg-a', icon: '🌊', title: '花蓮水災緊急救援', sub: '2024.01.20 · 💳 信用卡 · ⛓ 已上鏈', amount: 'NT$1,000' },
          { bg: 'bg-c', icon: '💻', title: '偏鄉數位教育設備', sub: '2024.01.15 · 💚 LINE Pay · 🏆 里程碑達成', amount: 'NT$500' },
          { bg: 'bg-b', icon: '🌱', title: '台南淨灘行動', sub: '2024.01.08 · 🏪 超商 · ✅ 已完成', amount: 'NT$200' },
        ].map((a, i) => (
          <div className="activity-item" key={i}>
            <div className={`activity-icon ${a.bg}`}>{a.icon}</div>
            <div className="activity-content">
              <div className="activity-title">{a.title}</div>
              <div className="activity-sub">{a.sub}</div>
            </div>
            <div className="activity-amount">{a.amount}</div>
          </div>
        ))}
      </div>

      <div style={{ height: 12 }} />
    </div>
  )
}
