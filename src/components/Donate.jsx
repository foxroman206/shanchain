// src/components/Donate.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { payMethodNames } from '../data/projects.js'
import { donations as donationsApi } from '../api/client.js'

const PRESETS = [100, 500, 1000, 3000, 5000]

export default function Donate({
  time, elderMode,
  donateProject, donateAmount, setDonateAmount,
  donateMethod, setDonateMethod,
  onConfirmDonate, onShowKycInfo, onShowSms,
}) {
  const navigate = useNavigate()
  const project = donateProject

  const [tab, setTab] = useState(donateMethod.tab || 'fiat')
  const [fiatMethod, setFiatMethod] = useState(donateMethod.fiat || 'card')
  const [cryptoMethod, setCryptoMethod] = useState(donateMethod.crypto || 'usdt')
  const [amount, setAmount] = useState(donateAmount || 500)
  const [anon, setAnon] = useState(false)
  const [nft, setNft] = useState(true)

  function selectAmount(val) {
    setAmount(val)
    setDonateAmount(val)
  }

  function selectFiat(method) {
    setFiatMethod(method)
    setDonateMethod(m => ({ ...m, fiat: method }))
    if (method === 'sms') onShowSms()
  }

  function selectCrypto(method) {
    setCryptoMethod(method)
    setDonateMethod(m => ({ ...m, crypto: method }))
  }

  function switchTab(t) {
    setTab(t)
    setDonateMethod(m => ({ ...m, tab: t }))
  }

  const [confirming, setConfirming] = useState(false)
  const [apiError, setApiError] = useState('')

  async function handleConfirm() {
    setConfirming(true)
    setApiError('')
    try {
      const result = await donationsApi.create({
        project_id: project?.id || 'proj_flood',
        amount,
        method: tab === 'fiat' ? fiatMethod : cryptoMethod,
        method_tab: tab,
        is_anonymous: anon,
        want_nft: nft,
      })
      onConfirmDonate(result)
    } catch (e) {
      if (e.status === 401) {
        setApiError('請先登入後再捐款')
      } else {
        setApiError(e.message)
        onConfirmDonate() // fallback for demo without backend
      }
    } finally { setConfirming(false) }
  }

  const showBarcode = (tab === 'fiat') && (fiatMethod === 'cvs' || fiatMethod === 'atm')

  return (
    <div className="screen donate-screen">
      <div className="statusbar" style={{ background: 'var(--surface)' }}>
        <span className="time">{time}</span>
        <div className="icons"><span>🔋</span></div>
      </div>

      <div className="donate-header">
        <div className="back-btn" onClick={() => navigate(-1)} aria-label="返回">←</div>
        <div className="donate-title">選擇捐款金額</div>
      </div>

      {/* Amount display */}
      <div className="amount-display">
        <div className="amount-label">您將捐助</div>
        <div className="amount-value">
          <span className="amount-currency">NT$</span>
          {amount.toLocaleString()}
        </div>
      </div>

      {/* Presets */}
      <div className="amount-presets">
        {PRESETS.map(p => (
          <button
            key={p}
            className={`preset-btn${amount === p ? ' selected' : ''}`}
            onClick={() => selectAmount(p)}
          >
            {p.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Payment tabs */}
      <div className="pay-section">
        <div className="pay-section-title">選擇支付方式</div>
        <div className="pay-tabs">
          <button className={`pay-tab${tab === 'fiat' ? ' active' : ''}`} onClick={() => switchTab('fiat')} aria-label="法幣直接捐">
            <span className="pt-icon">💳</span>
            <span className="pt-label">法幣捐款</span>
            <span className="pt-sub">推薦 · 最簡單</span>
          </button>
          <button className={`pay-tab${tab === 'crypto' ? ' active' : ''}`} onClick={() => switchTab('crypto')} aria-label="加密貨幣捐款">
            <span className="pt-icon">🪙</span>
            <span className="pt-label">加密捐款</span>
            <span className="pt-sub">獲額外 NFT</span>
          </button>
        </div>

        {/* FIAT panel */}
        {tab === 'fiat' && (
          <div>
            <div className="fiat-methods">
              {[
                { key: 'card',    icon: '💳', name: '信用卡',  sub: 'Visa / Mastercard' },
                { key: 'linepay', icon: '💚', name: 'LINE Pay', sub: 'LINE 綁定支付' },
                { key: 'jko',     icon: '🟠', name: '街口支付', sub: 'JKO Pay' },
                { key: 'cvs',     icon: '🏪', name: '超商繳費', sub: '7-11 / 全家' },
                { key: 'atm',     icon: '🏧', name: 'ATM 轉帳', sub: '銀行轉帳' },
                { key: 'sms',     icon: '📱', name: '簡訊捐款', sub: '老人友善' },
              ].map(m => (
                <div
                  key={m.key}
                  className={`fiat-method${fiatMethod === m.key ? ' selected' : ''}`}
                  onClick={() => selectFiat(m.key)}
                >
                  <div className="fm-icon">{m.icon}</div>
                  <div className="fm-info">
                    <div className="fm-name">{m.name}</div>
                    <div className="fm-sub">{m.sub}</div>
                  </div>
                  <div className="fm-check">{fiatMethod === m.key ? '✓' : ''}</div>
                </div>
              ))}
            </div>

            {showBarcode && (
              <div className="barcode-display">
                <div className="barcode-img">▉▊▋▌▌▊▉▉▊▋</div>
                <div className="barcode-num">9821 4723 0056 7</div>
                <div className="barcode-note">請至超商機台掃描條碼<br />或告知店員繳費代碼</div>
              </div>
            )}
          </div>
        )}

        {/* CRYPTO panel */}
        {tab === 'crypto' && (
          <div>
            <div className="nft-bonus-badge">🎁 加密捐款專屬：獲得限量閃光版 NFT + 平台治理代幣</div>
            <div className="crypto-grid">
              {[
                { key: 'usdt',   icon: '💵', name: 'USDT (穩定幣)', sub: 'Polygon 網路 · 手續費極低', badge: '推薦' },
                { key: 'usdc',   icon: '🔵', name: 'USDC',           sub: 'Circle 發行 · 高流動性' },
                { key: 'wallet', icon: '🦊', name: 'MetaMask 錢包',  sub: '自備錢包連接' },
              ].map(m => (
                <div
                  key={m.key}
                  className={`crypto-method${cryptoMethod === m.key ? ' selected' : ''}`}
                  onClick={() => selectCrypto(m.key)}
                >
                  <div className="cm-icon">{m.icon}</div>
                  <div className="cm-info">
                    <div className="cm-name">{m.name}</div>
                    <div className="cm-sub">{m.sub}</div>
                  </div>
                  {m.badge && <div className="cm-badge">{m.badge}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      {tab === 'fiat' && (
        <div className="fiat-backend-note">
          <div className="fbn-icon">ℹ️</div>
          <div className="fbn-text"><strong>無需了解區塊鏈：</strong>您的法幣捐款由後端轉換為穩定幣鎖入智能合約，用戶體驗與傳統捐款完全相同。</div>
        </div>
      )}
      {tab === 'crypto' && (
        <div className="blockchain-note">
          <div className="blockchain-note-icon">🔒</div>
          <div className="blockchain-note-text"><strong>透明保障：</strong>捐款通過後端轉換鎖入智能合約，里程碑達成後自動釋放，所有交易永久公開可查。</div>
        </div>
      )}

      {/* Form fields */}
      <div className="donate-form">
        <div className="form-field">
          <label>捐款至</label>
          <div className="field-value">{project?.title || '花蓮水災緊急救援'}</div>
        </div>
        <div className="form-field">
          <label>匿名捐款</label>
          <div className="field-value">
            公開顯示捐款者
            <div className={`toggle${anon ? ' off' : ''}`} onClick={() => setAnon(a => !a)} role="switch" />
          </div>
        </div>
        <div className="form-field">
          <label>收取 NFT 公益證明</label>
          <div className="field-value">
            獲得限定紀念 NFT
            <div className={`toggle${!nft ? ' off' : ''}`} onClick={() => setNft(n => !n)} role="switch" />
          </div>
        </div>
      </div>

      {/* KYC */}
      {amount > 10000 && (
        <div className="kyc-step show">
          <div className="kyc-title">⚠️ 大額捐款 KYC 驗證</div>
          <div className="kyc-why">
            依《洗錢防制法》，捐款超過 NT$10,000 需身分驗證。
            <span className="kyc-why-link" onClick={onShowKycInfo}> 為什麼需要 KYC？</span>
          </div>
          <div className="kyc-upload" onClick={() => alert('📋 KYC 上傳（Demo）\n\n實際整合：Sumsub / Jumio API')}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>📋</div>
            <div className="kyc-upload-text">點擊上傳身分證正面</div>
          </div>
        </div>
      )}

      <button className="confirm-btn" onClick={handleConfirm}>
        確認捐款 NT${amount.toLocaleString()}
      </button>
      <div style={{ height: 20 }} />
    </div>
  )
}
