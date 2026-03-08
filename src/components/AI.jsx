// src/components/AI.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ai as aiApi } from '../api/client.js'

// ── 工具函式 ──────────────────────────────────────────────────────────────────
function severityColor(s) {
  return s === 'critical' ? 'var(--red)' : s === 'high' ? '#dc6b0a' : s === 'medium' ? 'var(--gold)' : 'var(--green)'
}
function severityLabel(s) {
  return { critical: '極高風險', high: '高風險', medium: '中等風險', low: '低風險' }[s] || s
}

// ── Tab 1：AI 聊天助理 ────────────────────────────────────────────────────────
function ChatTab() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    { role: 'bot', text: '👋 我是善鏈 AI 助理！\n\n我可以幫您：\n🔍 搜尋最適合的專案\n🛡️ 查核專案真實性\n💳 說明捐款方式\n🏛️ 解釋 DAO 治理\n\n請問您想了解什麼？', results: null }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  const quickBtns = ['推薦緊急專案', '怎麼捐款', '這個安全嗎', '什麼是 DAO', '節稅說明']

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text) {
    const msg = (text || input).trim()
    if (!msg) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const res = await aiApi.chat(msg)
      setMessages(m => [...m, { role: 'bot', text: res.response, results: res.search_results || null }])
    } catch {
      setMessages(m => [...m, { role: 'bot', text: '⚠️ AI 服務暫時無法連線。\n請確認後端服務是否運行中。\n(確認 Python AI service 啟動於 port 5001)' }])
    }
    setLoading(false)
  }

  function onKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <div className="ai-chat-root">
      <div className="ai-chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={'ai-msg ' + m.role}>
            <div className="ai-msg-avatar">{m.role === 'bot' ? '🤖' : '👤'}</div>
            <div style={{ flex: 1 }}>
              <div className="ai-msg-bubble">{m.text}</div>
              {m.results && m.results.length > 0 && (
                <div className="ai-chat-results">
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink3)', marginBottom: 6 }}>🎯 AI 找到相關專案</div>
                  {m.results.map((r, j) => (
                    <div key={j} className="ai-chat-result-item" onClick={() => navigate('/detail/' + r.project_id)}>
                      <div className="ai-result-title">{r.title}</div>
                      <div className="ai-result-meta">
                        {r.org} · AI評分 {r.ai_score}/100 · 相關度 {Math.round((r.semantic_score || r.score || 0) * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="ai-msg bot">
            <div className="ai-msg-avatar">🤖</div>
            <div className="ai-typing">
              <div className="ai-typing-dot" /><div className="ai-typing-dot" /><div className="ai-typing-dot" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="ai-quick-btns">
        {quickBtns.map(b => (
          <button key={b} className="ai-quick-btn" onClick={() => send(b)}>{b}</button>
        ))}
      </div>

      <div className="ai-chat-input-row">
        <input className="ai-chat-input" value={input}
          onChange={e => setInput(e.target.value)} onKeyDown={onKey}
          placeholder="輸入問題，例如：我想幫助花蓮的孩子..."
        />
        <button className="ai-chat-send" onClick={() => send()} disabled={loading || !input.trim()}>
          ↑
        </button>
      </div>
    </div>
  )
}

// ── Tab 2：語意搜尋 ───────────────────────────────────────────────────────────
function SearchTab() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState('')
  const examples = ['幫助地震受災家庭', '讓偏鄉孩子上網', '老人冬天禦寒', '台灣東部急需物資']

  async function doSearch(q) {
    const term = (q || query).trim()
    if (!term) return
    setLoading(true); setResults(null)
    try {
      const res = await aiApi.search(term, 8)
      setResults(res.results || [])
      setMethod(res.method || 'semantic')
    } catch {
      // fallback: show mock
      setResults([])
      setMethod('offline')
    }
    setLoading(false)
  }

  function onKey(e) { if (e.key === 'Enter') doSearch() }

  const pctBar = (r) => r.pct || Math.round((r.raised || 0) / Math.max(1, r.goal || 1) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%', overflow: 'hidden' }}>
      {/* Search input */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center',
          background: 'var(--surface2)', borderRadius: 16, padding: '10px 14px',
          border: '1.5px solid var(--border)' }}>
          <span style={{ fontSize: 16, opacity: 0.5 }}>🔍</span>
          <input style={{ flex: 1, border: 'none', background: 'none', fontFamily: 'inherit', fontSize: 14,
            color: 'var(--ink)', outline: 'none' }}
            value={query} onChange={e => setQuery(e.target.value)} onKeyDown={onKey}
            placeholder="用自然語言搜尋，例如：幫助老人..." autoFocus
          />
          {loading && <div style={{ width: 16, height: 16, border: '2px solid var(--border)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />}
        </div>
        {/* Example chips */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          {examples.map(e => (
            <button key={e} onClick={() => { setQuery(e); doSearch(e) }}
              style={{ padding: '4px 10px', borderRadius: 20, border: '1.5px solid var(--border)',
                background: 'var(--card)', fontSize: 11, color: 'var(--ink2)', cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: 600 }}>
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {results === null && !loading && (
          <div style={{ textAlign: 'center', color: 'var(--ink3)', fontSize: 13, marginTop: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🧠</div>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>AI 語意搜尋引擎</div>
            <div style={{ fontSize: 12, lineHeight: 1.7 }}>不用精確關鍵字，用自然語言描述<br />您想幫助的對象或事件</div>
          </div>
        )}

        {results !== null && results.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--ink3)', fontSize: 13, marginTop: 40 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🤔</div>
            <div>沒有找到相關專案</div>
            <div style={{ fontSize: 11, marginTop: 6 }}>
              {method === 'offline' ? '⚠️ AI 服務離線，請啟動 Python 服務' : '請嘗試其他描述'}
            </div>
          </div>
        )}

        {results !== null && results.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--ink3)', fontWeight: 700 }}>
                找到 {results.length} 個相關專案
              </div>
              <div style={{ fontSize: 10, color: 'var(--ink3)', background: 'var(--surface2)',
                padding: '3px 8px', borderRadius: 10 }}>
                {method === 'semantic_tfidf' ? '🧠 語意搜尋' : method === 'sql_fallback' ? '🔤 關鍵字搜尋' : '⚠️ 離線'}
              </div>
            </div>

            {results.map((r, i) => {
              const pct = pctBar(r)
              const rel = r.semantic_score ? Math.round(r.semantic_score * 100) : null
              return (
                <div key={i} onClick={() => navigate('/detail/' + r.id)}
                  style={{ background: 'var(--card)', borderRadius: 16, padding: 14, cursor: 'pointer',
                    border: '1.5px solid var(--border)', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--ink)', flex: 1 }}>{r.title}</div>
                    {rel !== null && (
                      <div style={{ fontSize: 10, fontWeight: 700, background: rel > 30 ? '#dcfce7' : '#fef9c3',
                        color: rel > 30 ? '#15803d' : '#92400e', padding: '3px 8px', borderRadius: 10, marginLeft: 8, flexShrink: 0 }}>
                        相關 {rel}%
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink3)', marginBottom: 8 }}>{r.org}</div>
                  <div style={{ background: 'var(--surface2)', borderRadius: 6, height: 6, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', width: pct + '%', background: 'var(--red)', borderRadius: 6 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                    <span style={{ color: 'var(--red)', fontWeight: 700 }}>
                      {r.raisedFormatted || ('NT$' + (r.raised || 0).toLocaleString())}
                    </span>
                    <span style={{ color: 'var(--ink3)' }}>AI 評分 {r.ai_score}/100</span>
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

// ── Tab 3：詐騙分析 ───────────────────────────────────────────────────────────
function FraudTab() {
  const [mode, setMode] = useState('text')   // 'text' | 'project'
  const [text, setText] = useState('')
  const [category, setCategory] = useState('一般')
  const [projectId, setProjectId] = useState('proj_flood')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const categories = ['一般', '災害救援', '教育', '醫療', '老人關懷', '宗教文化', '環境']
  const projects = [
    { id: 'proj_flood', name: '花蓮水災緊急救援' },
    { id: 'proj_school', name: '偏鄉學童數位教育' },
    { id: 'proj_elder', name: '獨居老人冬季送暖' },
    { id: 'proj_temple', name: '大甲媽祖宮廟修繕' },
  ]

  async function analyze() {
    setLoading(true); setResult(null)
    try {
      let res
      if (mode === 'text') {
        res = await aiApi.fraudText(text, category === '一般' ? '' : category)
        setResult({ type: 'text', ...res })
      } else {
        res = await aiApi.fraudProject(projectId)
        setResult({ type: 'project', ...res })
      }
    } catch {
      setResult({ error: '⚠️ 分析失敗：請確認 Python AI 服務已啟動' })
    }
    setLoading(false)
  }

  const riskPct = result ? Math.round((result.combined_risk || result.risk_score || 0) * 100) : 0
  const sev = result?.overall_severity || result?.severity || 'low'

  return (
    <div style={{ padding: '16px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      {/* Mode toggle */}
      <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 12, padding: 3, marginBottom: 14 }}>
        {[['text','📝 分析文字'], ['project','🔍 分析專案']].map(([k, l]) => (
          <button key={k} onClick={() => { setMode(k); setResult(null) }}
            style={{ flex: 1, padding: '8px', borderRadius: 10, border: 'none', fontFamily: 'inherit',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              background: mode === k ? '#fff' : 'transparent',
              color: mode === k ? 'var(--ink)' : 'var(--ink3)',
              boxShadow: mode === k ? '0 2px 8px rgba(0,0,0,0.1)' : 'none' }}>
            {l}
          </button>
        ))}
      </div>

      {mode === 'text' ? (
        <>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', marginBottom: 6, textTransform: 'uppercase' }}>類別</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  style={{ padding: '4px 10px', borderRadius: 20, border: '1.5px solid',
                    borderColor: category === c ? 'var(--red)' : 'var(--border)',
                    background: category === c ? '#fef2f2' : 'var(--card)',
                    color: category === c ? 'var(--red)' : 'var(--ink2)',
                    fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', marginBottom: 6, textTransform: 'uppercase' }}>輸入待分析文字</div>
            <textarea value={text} onChange={e => setText(e.target.value)}
              rows={5} placeholder="貼入專案說明、募款文字或任何可疑訊息..."
              style={{ width: '100%', borderRadius: 14, border: '1.5px solid var(--border)', padding: '12px 14px',
                fontFamily: 'inherit', fontSize: 13, color: 'var(--ink)', background: 'var(--card)',
                resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </>
      ) : (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', marginBottom: 8, textTransform: 'uppercase' }}>選擇專案</div>
          {projects.map(p => (
            <div key={p.id} onClick={() => setProjectId(p.id)}
              style={{ padding: '11px 14px', borderRadius: 12, border: '1.5px solid',
                borderColor: projectId === p.id ? 'var(--red)' : 'var(--border)',
                background: projectId === p.id ? '#fef2f2' : 'var(--card)',
                marginBottom: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
              {p.name}
            </div>
          ))}
        </div>
      )}

      <button onClick={analyze} disabled={loading || (mode === 'text' && !text.trim())}
        style={{ width: '100%', height: 48, background: 'var(--ink)', color: '#fff', border: 'none',
          borderRadius: 14, fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          opacity: loading ? 0.6 : 1, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {loading
          ? <><span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> 分析中...</>
          : '🛡️ 開始 AI 詐騙分析'}
      </button>

      {/* Result */}
      {result && !result.error && (
        <div style={{ background: 'var(--card)', borderRadius: 18, padding: 16, border: '1.5px solid var(--border)' }}>
          {/* Risk gauge */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 10px' }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--surface2)" strokeWidth="10" />
                <circle cx="50" cy="50" r="40" fill="none"
                  stroke={severityColor(sev)} strokeWidth="10"
                  strokeDasharray={`${riskPct * 2.51} 251`}
                  strokeLinecap="round" transform="rotate(-90 50 50)" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: severityColor(sev) }}>{riskPct}%</div>
                <div style={{ fontSize: 9, color: 'var(--ink3)' }}>風險分</div>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: severityColor(sev) }}>{severityLabel(sev)}</div>
          </div>

          {/* Text analysis flags */}
          {(result.flags || result.text_analysis?.flags || []).length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', marginBottom: 8 }}>偵測到的風險標記</div>
              {(result.flags || result.text_analysis?.flags || []).map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 10px', background: 'var(--surface2)', borderRadius: 10, marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>
                      {f.matched?.slice(0,3).join('、')}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--ink3)', marginTop: 2 }}>{f.type}</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: severityColor(sev) }}>
                    +{Math.round((f.risk_contribution || 0) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pattern analysis (project mode) */}
          {result.pattern_analysis && (result.pattern_analysis.anomalies || []).length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', marginBottom: 8 }}>捐款模式異常</div>
              {result.pattern_analysis.anomalies.map((a, i) => (
                <div key={i} style={{ fontSize: 12, padding: '7px 10px', background: '#fef9c3', borderRadius: 10, marginBottom: 6, color: '#92400e', fontWeight: 600 }}>
                  ⚠️ {a.detail}
                </div>
              ))}
            </div>
          )}

          {/* Recommendation */}
          <div style={{ background: riskPct > 40 ? '#fef2f2' : '#f0fdf4', borderRadius: 12, padding: '10px 12px',
            fontSize: 12, color: riskPct > 40 ? 'var(--red)' : '#15803d', lineHeight: 1.6, fontWeight: 600 }}>
            💡 {result.recommendation || result.text_analysis?.recommendation}
          </div>

          {result.alert_created && (
            <div style={{ marginTop: 10, background: '#fef2f2', borderRadius: 12, padding: '8px 12px', fontSize: 11, color: 'var(--red)', fontWeight: 700 }}>
              🚨 已自動建立 AI 警報並通知 DAO 審查
            </div>
          )}
        </div>
      )}

      {result?.error && (
        <div style={{ background: '#fef9c3', borderRadius: 14, padding: 14, fontSize: 13, color: '#92400e' }}>
          {result.error}
        </div>
      )}
    </div>
  )
}

// ── Tab 4：新聞/災害掃描 ──────────────────────────────────────────────────────
function NewsTab() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const examples = [
    '花蓮縣發生芮氏規模6.5強震，超過800人受困，建築物倒塌，需要緊急救援',
    '屏東縣持續豪大雨，農業損失慘重，約1,200戶農家受到影響，農委會已啟動緊急應變',
    '台北市獨居老人服務缺口：冬季期間估計有超過3,000位獨居長者無法得到足夠照顧',
    '台南地震已造成32人受傷，12棟建物受損，當地醫院人力嚴重吃緊',
  ]

  async function scan() {
    if (!text.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await aiApi.scanNews(text)
      setResult(res)
    } catch {
      setResult({ error: '⚠️ 掃描失敗：請確認 Python AI 服務已啟動（port 5001）' })
    }
    setLoading(false)
  }

  const urgencyColor = (u) => u > 0.7 ? 'var(--red)' : u > 0.4 ? '#dc6b0a' : 'var(--green)'
  const disasterEmoji = { earthquake: '🏚️', flood: '🌊', fire: '🔥', drought: '☀️', epidemic: '🦠', poverty: '🏚️' }
  const disasterName = { earthquake: '地震', flood: '水災', fire: '火災', drought: '旱災', epidemic: '疫情', poverty: '貧困' }

  return (
    <div style={{ padding: '16px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', marginBottom: 6, textTransform: 'uppercase' }}>
          貼入新聞或任意文字
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
          placeholder="貼入新聞報導、社群貼文、災情公告..."
          style={{ width: '100%', borderRadius: 14, border: '1.5px solid var(--border)',
            padding: '12px 14px', fontFamily: 'inherit', fontSize: 13, color: 'var(--ink)',
            background: 'var(--card)', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', marginBottom: 8, textTransform: 'uppercase' }}>範例文字</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {examples.map((e, i) => (
          <button key={i} onClick={() => setText(e)}
            style={{ textAlign: 'left', padding: '9px 12px', borderRadius: 12, border: '1.5px solid var(--border)',
              background: 'var(--card)', fontSize: 11, color: 'var(--ink2)', cursor: 'pointer',
              fontFamily: 'inherit', lineHeight: 1.5 }}>
            {e.slice(0, 50)}...
          </button>
        ))}
      </div>

      <button onClick={scan} disabled={loading || !text.trim()}
        style={{ width: '100%', height: 48, background: 'var(--red)', color: '#fff', border: 'none',
          borderRadius: 14, fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          opacity: loading ? 0.6 : 1, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        {loading
          ? <><span style={{ width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> 掃描中...</>
          : '📡 開始災害掃描'}
      </button>

      {result && !result.error && (
        <div style={{ background: 'var(--card)', borderRadius: 18, padding: 16, border: '1.5px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Urgency */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'var(--surface2)', borderRadius: 14, padding: '12px 14px' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink3)', marginBottom: 2 }}>整體緊急度</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: urgencyColor(result.overall_urgency) }}>
                {Math.round(result.overall_urgency * 100)}%
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink3)', marginBottom: 4 }}>建議行動</div>
              <div style={{ fontSize: 11, fontWeight: 700,
                color: result.should_create_alert ? 'var(--red)' : 'var(--green)' }}>
                {result.should_create_alert ? '🚨 建議建立專案' : '✅ 無需緊急回應'}
              </div>
            </div>
          </div>

          {/* Detected disasters */}
          {Object.keys(result.disasters_detected || {}).length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', marginBottom: 8 }}>偵測到的災害類型</div>
              {Object.entries(result.disasters_detected).map(([type, info]) => (
                <div key={type} style={{ background: 'var(--surface2)', borderRadius: 12, padding: '10px 12px', marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>
                      {disasterEmoji[type] || '⚠️'} {disasterName[type] || type}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: urgencyColor(info.urgency) }}>
                      緊急 {Math.round(info.urgency * 100)}%
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink3)', marginBottom: 4 }}>
                    關鍵字：{info.keywords_matched?.join('、')}
                  </div>
                  {info.max_affected > 0 && (
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)' }}>
                      估計受影響：{info.max_affected.toLocaleString()} 人
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Locations */}
          {(result.locations_mentioned || []).length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink3)', marginBottom: 6 }}>偵測到的地點</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {result.locations_mentioned.map(l => (
                  <span key={l} style={{ padding: '4px 10px', borderRadius: 20, background: '#dbeafe', color: '#1d4ed8', fontSize: 12, fontWeight: 700 }}>
                    📍 {l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.alert_created && (
            <div style={{ background: '#fef2f2', borderRadius: 12, padding: '10px 12px',
              fontSize: 12, color: 'var(--red)', fontWeight: 700, lineHeight: 1.5 }}>
              🚨 AI 已自動建立警報並記錄於系統，建議前往「治理」頁面提出緊急專案提案。
            </div>
          )}

          {Object.keys(result.disasters_detected || {}).length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--green)', fontSize: 13, fontWeight: 700 }}>
              ✅ 未偵測到明顯災害關鍵字
            </div>
          )}
        </div>
      )}

      {result?.error && (
        <div style={{ background: '#fef9c3', borderRadius: 14, padding: 14, fontSize: 13, color: '#92400e' }}>
          {result.error}
        </div>
      )}
    </div>
  )
}

// ── Main AI Page ──────────────────────────────────────────────────────────────
export default function AI({ time }) {
  const [tab, setTab] = useState('chat')
  const [aiOnline, setAiOnline] = useState(null)
  const [scanCount, setScanCount] = useState(847)

  const tabs = [
    { id: 'chat',   icon: '💬', label: '助理' },
    { id: 'search', icon: '🔍', label: '搜尋' },
    { id: 'fraud',  icon: '🛡️', label: '詐騙' },
    { id: 'news',   icon: '📡', label: '災害' },
  ]

  useEffect(() => {
    // Check AI service status
    aiApi.status().then(d => setAiOnline(d.ai_service === 'online')).catch(() => setAiOnline(false))
    aiApi.stats().then(d => setScanCount(d.scan_count || 847)).catch(() => {})
    const id = setInterval(() => setScanCount(c => c + Math.floor(Math.random() * 3) + 1), 7000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="statusbar">
        <span className="time">{time}</span>
        <div className="icons"><span>🔋</span></div>
      </div>

      {/* Header */}
      <div style={{ padding: '10px 18px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)' }}>🤖 AI 分析引擎</div>
            <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>
              已掃描 {scanCount.toLocaleString()} 個事件
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6,
            background: aiOnline === null ? 'var(--surface2)' : aiOnline ? '#dcfce7' : '#fef9c3',
            padding: '5px 10px', borderRadius: 20 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%',
              background: aiOnline === null ? 'var(--ink3)' : aiOnline ? '#16a34a' : '#d97706',
              animation: aiOnline ? 'pulse 2s infinite' : 'none' }} />
            <span style={{ fontSize: 11, fontWeight: 700,
              color: aiOnline === null ? 'var(--ink3)' : aiOnline ? '#15803d' : '#92400e' }}>
              {aiOnline === null ? '檢查中...' : aiOnline ? 'Python AI 連線' : 'AI 離線'}
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 14, padding: 3, gap: 2 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, padding: '8px 4px', borderRadius: 11, border: 'none', fontFamily: 'inherit',
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                background: tab === t.id ? '#fff' : 'transparent',
                color: tab === t.id ? 'var(--ink)' : 'var(--ink3)',
                boxShadow: tab === t.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s' }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{t.icon}</div>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'hidden', marginTop: 10 }}>
        {tab === 'chat'   && <ChatTab />}
        {tab === 'search' && <SearchTab />}
        {tab === 'fraud'  && <FraudTab />}
        {tab === 'news'   && <NewsTab />}
      </div>
    </div>
  )
}
