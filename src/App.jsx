// src/App.jsx
import { useEffect, useState, useCallback } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Home from './components/Home.jsx'
import Explore from './components/Explore.jsx'
import Detail from './components/Detail.jsx'
import Donate from './components/Donate.jsx'
import Create from './components/Create.jsx'
import AI from './components/AI.jsx'
import DAO from './components/DAO.jsx'
import Dashboard from './components/Dashboard.jsx'
import Login from './components/Login.jsx'

// ── Device mode switcher bar (outside phone shell) ──────────────────────────

const DEVICES = [
  { key: 'mobile',  label: '📱 手機', title: 'Mobile' },
  { key: 'tablet',  label: '📟 平板', title: 'Tablet' },
  { key: 'desktop', label: '🖥️ 電腦', title: 'Desktop' },
]

function DeviceSwitcher({ viewMode, setViewMode }) {
  return (
    <div className="device-switcher">
      {DEVICES.map(d => (
        <button
          key={d.key}
          className={'dev-btn' + (viewMode === d.key ? ' active' : '')}
          onClick={() => setViewMode(d.key)}
          title={d.title}
        >
          {d.label}
        </button>
      ))}
    </div>
  )
}

// ── Modals ──────────────────────────────────────────────────────────────────

function SuccessModal({ show, amount, methodName, txHash, onClose }) {
  if (!show) return null
  return (
    <div className="modal-overlay show">
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-icon">🎉</div>
        <div className="modal-title">捐款成功！</div>
        <div className="modal-sub">
          NT${amount?.toLocaleString()} 已透過 <strong>{methodName}</strong>{' '}
          完成，後端已鎖入智能合約。您解鎖了新勳章！
        </div>
        <div className="modal-badges">
          <div className="modal-badge badge-gold">⭐ 守護者 Lv.3</div>
          <div className="modal-badge badge-red">🔥 連續捐款</div>
        </div>
        <div className="modal-tx">
          <div className="modal-tx-label">區塊鏈確認</div>
          <div className="modal-tx-hash">{txHash}</div>
        </div>
        <button className="modal-close" onClick={onClose}>返回首頁</button>
      </div>
    </div>
  )
}

function ElderModal({ show, elderMode, onSelect, onClose }) {
  if (!show) return null
  return (
    <div className="modal-overlay show">
      <div className="modal-sheet elder-modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title" style={{ fontSize: 18, marginBottom: 6 }}>選擇使用模式</div>
        <div className="modal-sub" style={{ fontSize: 12, marginBottom: 16 }}>
          長者模式使用大字體、簡化流程，讓捐款更輕鬆
        </div>
        <div className={`elder-option${!elderMode ? ' selected' : ''}`} onClick={() => onSelect(false)}>
          <div className="eo-icon">📱</div>
          <div className="eo-info">
            <div className="eo-title">標準模式</div>
            <div className="eo-desc">完整功能 · 所有頁面 · 適合熟悉手機的用戶</div>
          </div>
        </div>
        <div className={`elder-option${elderMode ? ' selected' : ''}`} onClick={() => onSelect(true)}>
          <div className="eo-icon">👴</div>
          <div className="eo-info">
            <div className="eo-title">長者模式</div>
            <div className="eo-desc">大字體 · 語音導引 · 簡化流程 · 超商繳費優先</div>
          </div>
        </div>
        <button className="modal-close" style={{ marginTop: 12 }} onClick={onClose}>確定</button>
      </div>
    </div>
  )
}

function KycInfoModal({ show, onClose }) {
  if (!show) return null
  return (
    <div className="modal-overlay show">
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title" style={{ fontSize: 17 }}>為何需要 KYC？</div>
        <div style={{ background: 'var(--surface)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.8 }}>
            依台灣《洗錢防制法》第 7 條，金融機構（含非營利資金流）對
            <strong>單筆超過 NT$10,000</strong> 的交易需進行身分驗證。<br /><br />
            您的資料僅用於合規驗證，<strong>不會用於任何商業目的</strong>。
          </div>
        </div>
        <button className="modal-close" onClick={onClose}>了解</button>
      </div>
    </div>
  )
}

function SmsModal({ show, onClose }) {
  if (!show) return null
  return (
    <div className="modal-overlay show">
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-icon">📱</div>
        <div className="modal-title">簡訊捐款</div>
        <div className="modal-sub">長者友善 · 家人可協助設定一次，之後自動發送</div>
        <div style={{ background: 'var(--surface)', borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: 'var(--ink)', lineHeight: 2 }}>
            1️⃣ 發送簡訊至 <strong>0987-654-321</strong><br />
            2️⃣ 內容輸入：捐款 <strong>500 花蓮</strong><br />
            3️⃣ 收到確認簡訊後完成<br />
            4️⃣ 每月會收到「您的捐款幫助了 X 人」
          </div>
        </div>
        <div style={{ background: '#f0fdf4', borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 12, color: 'var(--green)', lineHeight: 1.6 }}>
          ✅ 費用從電話費扣除<br />✅ 無需銀行帳號或手機支付<br />✅ 適合沒有智慧型手機的長者
        </div>
        <button className="modal-close" onClick={onClose}>了解</button>
      </div>
    </div>
  )
}

function FreezeModal({ show, onConfirm, onClose }) {
  if (!show) return null
  return (
    <div className="modal-overlay show">
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-icon">🛑</div>
        <div className="modal-title">合約凍結確認</div>
        <div className="modal-sub">此操作將立即凍結大甲鎮瀾宮合約，並自動退款給所有 203 位捐款人。此操作不可逆。</div>
        <div className="modal-tx" style={{ background: '#fef2f2' }}>
          <div className="modal-tx-label" style={{ color: 'var(--red)' }}>受影響合約</div>
          <div className="modal-tx-hash" style={{ color: 'var(--red)' }}>0x4a8b2c...9d3e · NT$140,000 已鎖定</div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button onClick={onConfirm} style={{ flex: 1, height: 48, background: '#fef2f2', border: '1.5px solid var(--red)', borderRadius: 12, color: 'var(--red)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>確認凍結</button>
          <button onClick={onClose} style={{ flex: 1, height: 48, background: 'var(--surface2)', border: 'none', borderRadius: 12, color: 'var(--ink2)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>取消</button>
        </div>
      </div>
    </div>
  )
}

function CreateSuccessModal({ show, isReligion, onClose }) {
  if (!show) return null
  return (
    <div className="modal-overlay show">
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="create-modal-icon">{isReligion ? '⏳' : '✅'}</div>
        <div className="modal-title">{isReligion ? '已提交 DAO 審核' : 'AI 審核通過！'}</div>
        <div className="modal-sub">
          {isReligion
            ? '您的宗教類專案已提交 DAO 社群投票，需 72 小時審核期，通過後方可上線。'
            : '您的專案已通過 AI 風險審核（評分 82/100），正在部署智能合約並上鏈中...'}
        </div>
        <div className="modal-tx">
          <div className="modal-tx-label">合約部署狀態</div>
          <div className="modal-tx-hash" style={{ color: 'var(--gold)' }}>
            {isReligion ? '⏳ 等待 DAO 投票 · 預計 72 小時' : '⏳ 上鏈中：預計 30 秒完成 · Polygon 網路'}
          </div>
        </div>
        <button className="modal-close" onClick={onClose}>查看我的專案</button>
      </div>
    </div>
  )
}

// ── BottomNav ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { key: 'home',      path: '/',          icon: '🏠', label: '首頁' },
  { key: 'explore',   path: '/explore',   icon: '🔍', label: '探索' },
  { key: 'create',    path: '/create',    icon: '✏️', label: '發起' },
  { key: 'ai',        path: '/ai',        icon: '🤖', label: 'AI' },
  { key: 'dao',       path: '/dao',       icon: '🏛️', label: '治理' },
  { key: 'dashboard', path: '/dashboard', icon: '📊', label: '我的' },
]

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (item) => {
    if (item.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(item.path)
  }

  return (
    <div className="bottomnav">
      {NAV_ITEMS.map(item => (
        <button
          key={item.key}
          className={`nav-btn${isActive(item) ? ' active' : ''}`}
          onClick={() => navigate(item.path)}
          aria-label={item.label}
        >
          <div className="nav-icon">{item.icon}</div>
          <div className="nav-label">{item.label}</div>
        </button>
      ))}
    </div>
  )
}

// ── StatusBar clock ──────────────────────────────────────────────────────────

function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = () => {
      const d = new Date()
      const h = d.getHours().toString().padStart(2, '0')
      const m = d.getMinutes().toString().padStart(2, '0')
      setTime(`${h}:${m}`)
    }
    fmt()
    const id = setInterval(fmt, 30000)
    return () => clearInterval(id)
  }, [])
  return time || '9:41'
}

// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const navigate = useNavigate()

  // Auth & device
  const [user, setUser]           = useState(null)      // null = not logged in
  const [viewMode, setViewMode]   = useState('mobile')  // 'mobile' | 'tablet' | 'desktop'

  // Global state
  const [elderMode, setElderModeState]  = useState(false)
  const [donateProject, setDonateProject] = useState(null)
  const [donateAmount, setDonateAmount]   = useState(500)
  const [donateMethod, setDonateMethod]   = useState({ tab: 'fiat', fiat: 'card', crypto: 'usdt' })

  // Modals
  const [showSuccess, setShowSuccess]           = useState(false)
  const [successTx, setSuccessTx]               = useState('')
  const [showElderModal, setShowElderModal]     = useState(false)
  const [showKycInfo, setShowKycInfo]           = useState(false)
  const [showSms, setShowSms]                   = useState(false)
  const [showFreeze, setShowFreeze]             = useState(false)
  const [showCreateSuccess, setShowCreateSuccess] = useState(false)
  const [createIsReligion, setCreateIsReligion] = useState(false)

  const time = useClock()

  // Apply view mode class to body
  useEffect(() => {
    document.body.className = viewMode + (elderMode ? ' elder-mode' : '')
  }, [viewMode, elderMode])

  const handleLogin = useCallback((userData) => {
    setUser(userData)
    navigate('/')
  }, [navigate])

  const handleLogout = useCallback(() => {
    setUser(null)
    navigate('/login')
  }, [navigate])

  const handleSetElderMode = useCallback((on) => {
    setElderModeState(on)
    setShowElderModal(false)
    if (on) speakGuide('home')
  }, [])

  const handleConfirmDonate = useCallback(async () => {
    if (!donateProject || !donateAmount) return alert('請選擇專案與金額')
    try {
      const res = await fetch('https://shanchainbackend.onrender.com/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: donateProject.id,
          amount: donateAmount,
          method: donateMethod.tab === 'fiat' ? donateMethod.fiat : donateMethod.crypto,
          is_anonymous: false
        })
      })
      const data = await res.json()
      if (res.ok) {
        setSuccessTx(data.txHash || '0x成功交易哈希')
        setShowSuccess(true)
      } else {
        alert('捐款失敗：' + (data.error || '伺服器錯誤'))
      }
    } catch (e) {
      console.error('捐款錯誤', e)
      alert('捐款失敗，請檢查網路')
    }
  }, [donateProject, donateAmount, donateMethod])

  const handleSuccessClose = useCallback(() => {
    setShowSuccess(false)
    navigate('/')
  }, [navigate])

  const handleFreezeConfirm = useCallback(() => {
    setShowFreeze(false)
    setTimeout(() => {
      alert('🛑 合約已凍結！\n\n203 位捐款人共 NT$140,000 將在 24 小時內退款至原支付方式。\n\n此記錄已永久記錄於區塊鏈。')
    }, 300)
  }, [])

  const handleCreateSuccess = useCallback((isReligion) => {
    setCreateIsReligion(isReligion)
    setShowCreateSuccess(true)
  }, [])

  const handleCreateSuccessClose = useCallback(() => {
    setShowCreateSuccess(false)
    navigate('/explore')
  }, [navigate])

  function speakGuide(screen) {
    if (!window.speechSynthesis) return
    const guides = {
      home: '歡迎使用善鏈！這是公益捐款平台。您可以點選下方的快速捐款按鈕，選擇您想幫助的項目。',
      donate: '請選擇您想捐款的金額，然後選擇超商繳費方式，最後按確認捐款。',
    }
    const msg = new SpeechSynthesisUtterance(guides[screen] || guides.home)
    msg.lang = 'zh-TW'; msg.rate = 0.85; msg.pitch = 1.0
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(msg)
  }

  // Show login page if not authed
  if (!user) {
    return (
      <div className="app-shell">
        <DeviceSwitcher viewMode={viewMode} setViewMode={setViewMode} />
        <Login onLogin={handleLogin} viewMode={viewMode} />
      </div>
    )
  }

  // Shared context
  const ctx = {
    elderMode, viewMode, user, onLogout: handleLogout,
    time,
    donateProject, setDonateProject,
    donateAmount, setDonateAmount,
    donateMethod, setDonateMethod,
    onOpenElderModal: () => setShowElderModal(true),
    onConfirmDonate: handleConfirmDonate,
    onShowKycInfo: () => setShowKycInfo(true),
    onShowSms: () => setShowSms(true),
    onShowFreeze: () => setShowFreeze(true),
    onCreateSuccess: handleCreateSuccess,
    speakGuide,
  }

  // ── Render responsive shell ──
  if (viewMode === 'mobile') {
    return (
      <div className="app-shell">
        <DeviceSwitcher viewMode={viewMode} setViewMode={setViewMode} />
        <div className="phone" id="phone">
          <div className="phone-notch" />
          <AppRoutes ctx={ctx} />
          <BottomNav />
          <AppModals {...{ showSuccess, donateAmount, donateMethod, successTx, handleSuccessClose, showElderModal, elderMode, handleSetElderMode, showKycInfo, showSms, showFreeze, handleFreezeConfirm, showCreateSuccess, createIsReligion, handleCreateSuccessClose, setShowElderModal, setShowKycInfo, setShowSms, setShowFreeze }} />
        </div>
      </div>
    )
  }

  if (viewMode === 'tablet') {
    return (
      <div className="app-shell tablet-shell">
        <DeviceSwitcher viewMode={viewMode} setViewMode={setViewMode} />
        <div className="tablet-frame">
          <TabletTopBar ctx={ctx} />
          <div className="tablet-body">
            <TabletSideNav />
            <div className="tablet-content">
              <AppRoutes ctx={ctx} />
            </div>
          </div>
          <AppModals {...{ showSuccess, donateAmount, donateMethod, successTx, handleSuccessClose, showElderModal, elderMode, handleSetElderMode, showKycInfo, showSms, showFreeze, handleFreezeConfirm, showCreateSuccess, createIsReligion, handleCreateSuccessClose, setShowElderModal, setShowKycInfo, setShowSms, setShowFreeze }} />
        </div>
      </div>
    )
  }

  // desktop
  return (
    <div className="app-shell desktop-shell">
      <DeviceSwitcher viewMode={viewMode} setViewMode={setViewMode} />
      <div className="desktop-frame">
        <DesktopSidebar ctx={ctx} />
        <div className="desktop-main">
          <DesktopTopBar ctx={ctx} />
          <div className="desktop-content">
            <AppRoutes ctx={ctx} />
          </div>
        </div>
        <AppModals {...{ showSuccess, donateAmount, donateMethod, successTx, handleSuccessClose, showElderModal, elderMode, handleSetElderMode, showKycInfo, showSms, showFreeze, handleFreezeConfirm, showCreateSuccess, createIsReligion, handleCreateSuccessClose, setShowElderModal, setShowKycInfo, setShowSms, setShowFreeze }} />
      </div>
    </div>
  )
}

// ── Route tree (shared across all device modes) ──────────────────────────────
function AppRoutes({ ctx }) {
  return (
    <Routes>
      <Route path="/"           element={<Home      {...ctx} />} />
      <Route path="/login"      element={<Home      {...ctx} />} />
      <Route path="/explore"    element={<Explore   {...ctx} />} />
      <Route path="/detail/:id" element={<Detail    {...ctx} />} />
      <Route path="/donate"     element={<Donate    {...ctx} />} />
      <Route path="/create"     element={<Create    {...ctx} />} />
      <Route path="/ai"         element={<AI        {...ctx} />} />
      <Route path="/dao"        element={<DAO       {...ctx} />} />
      <Route path="/dashboard"  element={<Dashboard {...ctx} />} />
    </Routes>
  )
}

// ── Tablet top bar ────────────────────────────────────────────────────────────
function TabletTopBar({ ctx }) {
  const navigate = useNavigate()
  return (
    <div className="tablet-topbar">
      <div className="tt-logo">⛓️ <span>善鏈 GoodChain</span></div>
      <div className="tt-right">
        <button className={`top-btn ${ctx.elderMode ? 'btn-elder-on' : 'btn-elder-off'}`}
          onClick={ctx.onOpenElderModal}>👴 長者</button>
        <div className="tt-user" onClick={ctx.onLogout} title="登出">
          <div className="tt-avatar">
            {ctx.user?.provider === 'google' ? 'G' :
             ctx.user?.provider === 'apple'  ? '🍎' :
             ctx.user?.provider === 'fb'     ? 'f' : '👤'}
          </div>
          <span>{ctx.user?.name}</span>
        </div>
      </div>
    </div>
  )
}

// ── Tablet side nav ───────────────────────────────────────────────────────────
function TabletSideNav() {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <div className="tablet-sidenav">
      {NAV_ITEMS.map(item => (
        <button key={item.key}
          className={'tsn-btn' + (
            (item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)) ? ' active' : ''
          )}
          onClick={() => navigate(item.path)}>
          <span className="tsn-icon">{item.icon}</span>
          <span className="tsn-label">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

// ── Desktop sidebar ───────────────────────────────────────────────────────────
function DesktopSidebar({ ctx }) {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <div className="desktop-sidebar">
      <div className="ds-logo">
        <span className="ds-logo-icon">⛓️</span>
        <span className="ds-logo-text">善鏈<br /><small>GoodChain</small></span>
      </div>
      <nav className="ds-nav">
        {NAV_ITEMS.map(item => (
          <button key={item.key}
            className={'ds-nav-btn' + (
              (item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)) ? ' active' : ''
            )}
            onClick={() => navigate(item.path)}>
            <span className="ds-nav-icon">{item.icon}</span>
            <span className="ds-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="ds-user" onClick={ctx.onLogout} title="點擊登出">
        <div className="ds-avatar">
          {ctx.user?.provider === 'google' ? 'G' :
           ctx.user?.provider === 'apple'  ? '🍎' :
           ctx.user?.provider === 'fb'     ? 'f' : '👤'}
        </div>
        <div className="ds-user-info">
          <div className="ds-user-name">{ctx.user?.name}</div>
          <div className="ds-user-sub">點擊登出</div>
        </div>
      </div>
    </div>
  )
}

// ── Desktop top bar ───────────────────────────────────────────────────────────
function DesktopTopBar({ ctx }) {
  const location = useLocation()
  const titles = { '/': '首頁', '/explore': '探索專案', '/detail': '專案詳情',
    '/donate': '捐款', '/create': '發起專案', '/ai': 'AI 引擎', '/dao': 'DAO 治理', '/dashboard': '我的貢獻' }
  const title = Object.entries(titles).find(([k]) => k !== '/' && location.pathname.startsWith(k))?.[1]
    || (location.pathname === '/' ? '首頁' : '善鏈')
  return (
    <div className="desktop-topbar">
      <div className="dtb-title">{title}</div>
      <div className="dtb-right">
        <button className={`top-btn ${ctx.elderMode ? 'btn-elder-on' : 'btn-elder-off'}`}
          onClick={ctx.onOpenElderModal}>👴 長者模式</button>
        <div className="dtb-user" onClick={ctx.onLogout} title="登出">
          <div className="dtb-avatar">
            {ctx.user?.provider === 'google' ? 'G' :
             ctx.user?.provider === 'apple'  ? '🍎' :
             ctx.user?.provider === 'fb'     ? 'f' : '👤'}
          </div>
          <div className="dtb-user-info">
            <div className="dtb-name">{ctx.user?.name}</div>
            <div className="dtb-sub">{
              ctx.user?.provider === 'google' ? 'Google 帳號' :
              ctx.user?.provider === 'apple'  ? 'Apple ID' :
              ctx.user?.provider === 'fb'     ? 'Facebook' :
              ctx.user?.provider === 'email'  ? '電子信箱' :
              ctx.user?.provider === 'phone'  ? '手機號碼' : '訪客'
            }</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── All modals in one place ───────────────────────────────────────────────────
function AppModals({ showSuccess, donateAmount, donateMethod, successTx, handleSuccessClose,
  showElderModal, elderMode, handleSetElderMode,
  showKycInfo, showSms, showFreeze, handleFreezeConfirm,
  showCreateSuccess, createIsReligion, handleCreateSuccessClose,
  setShowElderModal, setShowKycInfo, setShowSms, setShowFreeze }) {
  return (
    <>
      <SuccessModal
        show={showSuccess} amount={donateAmount}
        methodName={donateMethod.tab === 'fiat'
          ? { card: '信用卡', linepay: 'LINE Pay', jko: '街口支付', cvs: '超商繳費', atm: 'ATM轉帳', sms: '簡訊捐款' }[donateMethod.fiat]
          : { usdt: 'USDT', usdc: 'USDC', wallet: 'MetaMask' }[donateMethod.crypto]}
        txHash={successTx} onClose={handleSuccessClose}
      />
      <ElderModal show={showElderModal} elderMode={elderMode} onSelect={handleSetElderMode} onClose={() => setShowElderModal(false)} />
      <KycInfoModal show={showKycInfo} onClose={() => setShowKycInfo(false)} />
      <SmsModal     show={showSms}     onClose={() => setShowSms(false)} />
      <FreezeModal  show={showFreeze}  onConfirm={handleFreezeConfirm} onClose={() => setShowFreeze(false)} />
      <CreateSuccessModal show={showCreateSuccess} isReligion={createIsReligion} onClose={handleCreateSuccessClose} />
    </>
  )
}