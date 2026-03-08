// src/components/Detail.jsx
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projects } from '../data/projects.js'

export default function Detail({ time, setDonateProject }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const p = projects[id] || projects.flood

  // Milestone vote state: { milestoneIndex: 'yes'|'no'|null }
  const [votes, setVotes] = useState({})

  function vote(idx, type) {
    setVotes(v => ({ ...v, [idx]: v[idx] === type ? null : type }))
  }

  function handleDonate() {
    setDonateProject(p)
    navigate('/donate')
  }

  const milestones = [
    { dot: 'md-done', dotIcon: '✓', title: '採購飲用水與食品', sub: 'NT$150,000 · 已完成 2024.01.15', hasVote: true, defaultVote: 'yes', defaultCount: '(234)' },
    { dot: 'md-active', dotIcon: '⬤', title: '禦寒衣物與醫療耗材', sub: 'NT$200,000 · 進行中', hasVote: true },
    { dot: 'md-pending', dotIcon: '○', title: '臨時住所修繕補助', sub: 'NT$150,000 · 待解鎖', hasVote: false },
  ]

  return (
    <div className="screen">
      <div className="statusbar">
        <span className="time">{time}</span>
        <div className="icons"><span>🔋</span></div>
      </div>

      <div className="detail-header">
        <div className="back-btn" onClick={() => navigate(-1)} role="button" aria-label="返回">←</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>
          {p.title.slice(0, 12)}...
        </div>
      </div>

      <div className={`detail-hero ${p.bg}`}>{p.emoji}</div>

      <div className="detail-body">
        <div className={`task-badge ${p.badgeClass}`}>{p.badge}</div>
        <div style={{ height: 8 }} />
        <div className="detail-title">{p.title}</div>

        <div className="detail-org">
          <div className="org-avatar">🏛️</div>
          <div className="org-name">{p.org}</div>
          <div className="verified-badge">✓ 區塊鏈已驗證</div>
        </div>

        {/* Religion warning */}
        {p.isReligion && (
          <div style={{ marginBottom: 12 }}>
            <div className="religion-warning" style={{ borderRadius: 14 }}>
              <div className="rw-icon" style={{ fontSize: 20 }}>⚠️</div>
              <div className="rw-text" style={{ fontSize: 12 }}>
                <strong>宗教高風險類別：</strong>此專案需通過 AI 背景查核、第三方審計報告及 DAO 社群投票，資金每 NT$50,000 一個里程碑，需上傳實地照片＋影片才可解鎖。
                如發現問題，DAO 可一鍵凍結合約並退款所有捐款人。
              </div>
            </div>
          </div>
        )}

        {/* AI Score */}
        <div className="ai-score-card">
          <div className="score-circle">
            <div className="score-num">{p.score}</div>
            <div className="score-label">AI評分</div>
          </div>
          <div className="ai-score-text">
            <div className="ai-score-title">🤖 AI 風險評估</div>
            <div className="ai-score-sub">{p.aiDesc}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="detail-stats">
          <div className="detail-stat"><div className="ds-num">{p.ds1}</div><div className="ds-label">受影響人數</div></div>
          <div className="detail-stat"><div className="ds-num">{p.ds2}</div><div className="ds-label">支持者</div></div>
          <div className="detail-stat"><div className="ds-num">{p.ds3}</div><div className="ds-label">剩餘時間</div></div>
        </div>

        {/* Progress */}
        <div className="detail-progress-wrap">
          <div className="dpw-header">
            <div className="dpw-raised">{p.raised}</div>
            <div className="dpw-goal">{p.goal}</div>
          </div>
          <div className="dpw-bar"><div className="dpw-fill" style={{ width: p.fill }} /></div>
          <div className="dpw-footer">
            <span>{p.pct}% 達成</span>
            <span>{p.donors}</span>
          </div>
        </div>

        <div className="detail-desc">{p.desc}</div>

        <div className="section-title" style={{ marginBottom: 10 }}>📋 里程碑 + 社群驗證</div>
        <div className="milestones-list">
          {milestones.map((m, idx) => (
            <div className="milestone" key={idx}>
              <div className={`milestone-dot ${m.dot}`}>{m.dotIcon}</div>
              <div className="milestone-content">
                <div className="milestone-title">{m.title}</div>
                <div className="milestone-sub">{m.sub}</div>
                {m.hasVote && (
                  <div className="vote-btns">
                    <button
                      className={`vote-btn${(votes[idx] || m.defaultVote) === 'yes' ? ' voted-yes' : ''}`}
                      onClick={() => vote(idx, 'yes')}
                    >
                      👍 {idx === 0 ? `已確認 ${m.defaultCount}` : '確認成果'}
                    </button>
                    <button
                      className={`vote-btn${votes[idx] === 'no' ? ' voted-no' : ''}`}
                      onClick={() => vote(idx, 'no')}
                    >
                      👎 質疑{idx === 0 ? ' (2)' : ''}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 80 }} />
      </div>

      {/* Floating donate button */}
      <button className="donate-btn" onClick={handleDonate} aria-label="立即捐款">
        ❤️ 立即捐款支持
      </button>
    </div>
  )
}
