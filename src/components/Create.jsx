// src/components/Create.jsx
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Create({ time, onCreateSuccess }) {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [desc, setDesc] = useState('')
  const [checks, setChecks] = useState({ rcw1: false, rcw2: false, rcw3: false, rcw4: false })
  const [uploadLabel, setUploadLabel] = useState('拖曳或點擊上傳')
  const [reviewState, setReviewState] = useState('idle') // idle | loading | done
  const [reviewText, setReviewText] = useState('')
  const [reviewSub, setReviewSub] = useState('')
  const [isReligion, setIsReligion] = useState(false)

  function handleCategoryChange(val) {
    setCategory(val)
    setIsReligion(val === 'religion')
  }

  function triggerUpload() {
    setUploadLabel('✅ 已上傳：report_2024.pdf')
    setReviewState('loading')
    setReviewText(isReligion ? 'AI 組織背景查核中...' : 'AI 詐騙偵測中...')
    setReviewSub('正在比對文件資料庫與信用評分')

    setTimeout(() => {
      setReviewText('NLP 事件分類中...')
      setReviewSub('分析專案類型與影響範圍')
    }, 1200)

    setTimeout(() => {
      setReviewState('done')
      setReviewText(isReligion ? '⚠️ 宗教類 — 需額外審核' : '✅ AI 審核完成！')
      setReviewSub(isReligion ? '已移交 DAO 社群投票，預計 72 小時' : '詐騙風險極低 · 建議上鏈')
    }, 2800)
  }

  function handleSubmit() {
    if (isReligion) {
      const allChecked = Object.values(checks).every(Boolean)
      if (!allChecked) { alert('⚠️ 宗教類別需勾選所有額外審核條款方可送出。'); return }
    }
    if (reviewState === 'idle') { triggerUpload(); return }
    if (reviewState === 'loading') return
    onCreateSuccess(isReligion)
  }

  const categories = [
    { value: 'disaster', label: '🌊 災害救援' },
    { value: 'edu',      label: '📚 教育' },
    { value: 'medical',  label: '🏥 醫療援助' },
    { value: 'env',      label: '🌱 環境保護' },
    { value: 'elder',    label: '👴 老人關懷' },
    { value: 'animal',   label: '🐾 動物福利' },
    { value: 'disability',label: '♿ 身心障礙' },
    { value: 'mental',   label: '🧠 心理健康' },
    { value: 'community',label: '🏘️ 社區發展' },
    { value: 'religion', label: '🕌 宗教文化（需額外審核）' },
  ]

  return (
    <div className="screen">
      <div className="statusbar">
        <span className="time">{time}</span>
        <div className="icons"><span>🔋</span></div>
      </div>

      <div className="section-header" style={{ paddingBottom: 4 }}>
        <div className="section-title">✏️ 發起公益專案</div>
      </div>

      <div className="create-form">
        <div className="create-field">
          <label>專案名稱</label>
          <input type="text" placeholder="輸入專案名稱..." value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="create-field">
          <label>募款目標</label>
          <input type="number" placeholder="NT$ 目標金額" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>

        <div className="create-field">
          <label>專案類別</label>
          <select value={category} onChange={e => handleCategoryChange(e.target.value)}>
            <option value="">請選擇類別...</option>
            {categories.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          {isReligion && (
            <div className="religion-create-warning show">
              <div className="rcw-title">⚠️ 宗教類別 — 高風險，需額外審核流程</div>
              <div className="rcw-list">台灣宗教捐款歷史上存在貪汙風險，平台採用最高標準審核：</div>
              <div className="rcw-checklist">
                {[
                  { key: 'rcw1', label: '同意每 NT$50,000 一個里程碑解鎖' },
                  { key: 'rcw2', label: '同意提供第三方審計報告' },
                  { key: 'rcw3', label: '同意上傳實地施工照片/影片' },
                  { key: 'rcw4', label: '同意 DAO 社群有凍結合約權' },
                ].map(item => (
                  <label key={item.key} className="rcw-check-item">
                    <input
                      type="checkbox"
                      checked={checks[item.key]}
                      onChange={e => setChecks(c => ({ ...c, [item.key]: e.target.checked }))}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="create-field">
          <label>專案描述</label>
          <textarea placeholder="描述計畫目標、執行方式及預期影響..." value={desc} onChange={e => setDesc(e.target.value)} />
        </div>

        <div className="create-field">
          <label>上傳證明文件</label>
          <div className="upload-area" onClick={triggerUpload}>
            <div className="upload-icon">📁</div>
            <div className="upload-label">{uploadLabel}</div>
            <div className="upload-sub">PDF · JPG · PNG · 最大 20MB</div>
          </div>
        </div>
      </div>

      {/* AI review overlay */}
      {reviewState !== 'idle' && (
        <div className="ai-review-overlay show">
          {reviewState === 'loading' && <div className="spinner" />}
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{reviewText}</div>
          <div style={{ fontSize: 10, color: 'var(--ink3)', fontFamily: "'DM Mono', monospace", marginTop: 4 }}>{reviewSub}</div>

          {reviewState === 'done' && (
            <div className="ai-review-result show">
              <div className="result-item"><span className="result-label">詐騙風險</span><span className="result-val">極低 ✓</span></div>
              <div className="result-item"><span className="result-label">文件真偽</span><span className="result-val">通過 ✓</span></div>
              <div className="result-item"><span className="result-label">AI 評分</span><span className="result-val">{isReligion ? '61 / 100（宗教降權）' : '82 / 100'}</span></div>
              <div className="result-item"><span className="result-label">建議上鏈</span><span className="result-val">是 ✓</span></div>

              {isReligion && (
                <div className="religion-review-steps show">
                  <div className="rrs-title">🕌 宗教類額外審核流程</div>
                  <div className="rrs-step"><div className="rs-num">1</div> AI 組織背景查核 — 進行中...</div>
                  <div className="rrs-step"><div className="rs-num">2</div> 第三方審計報告核驗 — 等待上傳</div>
                  <div className="rrs-step"><div className="rs-num">3</div> DAO 社群投票 — 預計 72 小時</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div style={{ padding: '10px 18px 0' }}>
        <button className="confirm-btn" style={{ margin: 0, width: '100%' }} onClick={handleSubmit}>
          送出 AI 審核申請
        </button>
      </div>
      <div style={{ height: 20 }} />
    </div>
  )
}
