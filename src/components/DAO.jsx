// src/components/DAO.jsx
import { useState, useEffect } from 'react'
import { dao as daoApi } from '../api/client.js'

export default function DAO({ time, onShowFreeze }) {
  const [voted, setVoted] = useState({})
  const [proposals, setProposals] = useState(null)
  const [voteError, setVoteError] = useState({})

  useEffect(() => {
    daoApi.proposals().then(d => setProposals(d.proposals)).catch(() => {})
  }, [])

  async function daoVote(proposalId, type) {
    try {
      const result = await daoApi.vote(proposalId, type)
      setVoted(v => ({ ...v, [proposalId]: type }))
      if (proposals) {
        setProposals(prev => prev.map(p => p.id === proposalId ? result.proposal : p))
      }
    } catch (e) {
      if (e.status === 409) {
        setVoted(v => ({ ...v, [proposalId]: e.data?.currentVote || 'yes' }))
      } else if (e.status === 401) {
        setVoteError(v => ({ ...v, [proposalId]: '請先登入才能投票' }))
      } else {
        setVoted(v => ({ ...v, [proposalId]: type }))
      }
    }
  }

  function isVoted(proposalId) { return !!voted[proposalId] }

  return (
    <div className="screen">
      <div className="statusbar">
        <span className="time">{time}</span>
        <div className="icons"><span>🔋</span></div>
      </div>

      <div className="section-header" style={{ paddingBottom: 4 }}>
        <div className="section-title">🏛️ DAO 社群治理</div>
      </div>

      {/* Stats banner */}
      <div style={{ margin: '0 18px 12px', background: 'linear-gradient(135deg,#1a1614,#1d2b3a)', borderRadius: 'var(--rb)', padding: 18 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Mono', monospace", marginBottom: 6 }}>GOVERNANCE</div>
        <div style={{ fontSize: 13, color: '#fff', marginBottom: 12, lineHeight: 1.6 }}>所有平台規則由持幣社群共同決定，每位貢獻者都有投票權</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['5','進行中提案'],['1,248','活躍投票者'],['3','您的投票']].map(([num, label], i) => (
            <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 10, textAlign: 'center' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, color: i === 2 ? 'var(--green)' : '#fff' }}>{num}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 18px' }}>
        {/* Proposal 1: freeze */}
        <div className="dao-proposal">
          <div className="dao-status" style={{ background: '#fef2f2', color: 'var(--red)' }}>🔴 進行中 · 剩 2 天</div>
          <div className="dao-proposal-title">大甲鎮瀾宮宮廟修繕 — 凍結審查</div>
          <div className="dao-proposal-desc">AI 偵測到該宗教專案財務文件存在異常，社群發起緊急審查投票。若通過，合約將立即凍結並退款。</div>
          <div className="dao-meta">提案 #051 · 緊急提案 · 2024.01.21</div>
          <div className="dao-vote-bar"><div className="dao-yes-fill" style={{ width: '71%' }} /></div>
          <div className="dao-bar-label"><span>🛑 凍結 71% (883票)</span><span>繼續 29%</span></div>
          <div className="dao-btns">
            <button
              className={`dao-btn dao-yes${isVoted('p1') ? ' voted' : ''}`}
              disabled={isVoted('p1')}
              onClick={() => daoVote('p1', 'yes')}
            >
              {isVoted('p1') && voted.p1_choice === 'yes' ? '✓ 已投票' : '🛑 投票凍結'}
            </button>
            <button
              className={`dao-btn dao-no${isVoted('p1') ? ' voted' : ''}`}
              disabled={isVoted('p1')}
              onClick={() => daoVote('p1', 'no')}
            >
              {isVoted('p1') && voted.p1_choice === 'no' ? '✓ 已投票' : '✅ 繼續'}
            </button>
          </div>
          <button className="dao-freeze-btn" onClick={onShowFreeze}>⚡ 緊急凍結合約並退款</button>
        </div>

        {/* Proposal 2 */}
        <div className="dao-proposal">
          <div className="dao-status" style={{ background: '#eff6ff', color: 'var(--blue)' }}>🔵 投票中 · 剩 5 天</div>
          <div className="dao-proposal-title">調整 AI 緊急度權重：40% → 50%</div>
          <div className="dao-proposal-desc">提案認為緊急事件常被其他權重稀釋，建議將緊急度從 40% 提升至 50%。</div>
          <div className="dao-meta">提案 #047 · 提案人：0x3f4a...d2e1 · 2024.01.18</div>
          <div className="dao-vote-bar"><div className="dao-yes-fill" style={{ width: '63%' }} /></div>
          <div className="dao-bar-label"><span>👍 贊成 63% (782票)</span><span>👎 反對 37%</span></div>
          <div className="dao-btns">
            <button
              className={`dao-btn dao-yes${isVoted('p2') ? ' voted' : ''}`}
              disabled={isVoted('p2')}
              onClick={() => daoVote('p2', 'yes')}
            >
              {isVoted('p2') && voted.p2_choice === 'yes' ? '✓ 已贊成' : '👍 贊成'}
            </button>
            <button
              className={`dao-btn dao-no${isVoted('p2') ? ' voted' : ''}`}
              disabled={isVoted('p2')}
              onClick={() => daoVote('p2', 'no')}
            >
              {isVoted('p2') && voted.p2_choice === 'no' ? '✓ 已反對' : '👎 反對'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: 12 }} />
    </div>
  )
}
