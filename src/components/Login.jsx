// src/components/Login.jsx
import { useState } from 'react'
import { auth } from '../api/client.js'

function LoginBg() {
  return (
    <div className="login-bg">
      <div className="lb lb1"/><div className="lb lb2"/><div className="lb lb3"/>
    </div>
  )
}

function LogoRow() {
  return (
    <div className="login-logo-row">
      <div className="login-logo-icon">⛓️</div>
      <div className="login-logo-text">善鏈 <span>GoodChain</span></div>
    </div>
  )
}

function EmailView({ tab, onLogin, onBack, viewMode }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault()
    if (!email || !password) return
    setBusy(true); setError('')
    try {
      let data
      if (tab === 'register') {
        data = await auth.register({ name: email.split('@')[0], email, password, provider: 'email' })
      } else {
        data = await auth.login({ email, password, provider: 'email' })
      }
      auth.saveToken(data.token)
      onLogin(data.user)
    } catch (e) { setError(e.message) } finally { setBusy(false) }
  }
  return (
    <div className={'login-root ' + viewMode}>
      <LoginBg />
      <div className={'login-card single ' + viewMode}>
        <div className="login-right">
          <button className="login-back-btn" onClick={onBack}>← 返回</button>
          <LogoRow />
          <div className="login-title">{tab === 'login' ? '電子信箱登入' : '電子信箱註冊'}</div>
          <form onSubmit={submit} className="auth-form">
            <div className="auth-field">
              <label>電子信箱</label>
              <div className="auth-input-wrap">
                <span className="auth-icon">✉️</span>
                <input type="email" placeholder="your@email.com" value={email}
                  onChange={e => setEmail(e.target.value)} autoFocus />
              </div>
            </div>
            <div className="auth-field">
              <label>密碼</label>
              <div className="auth-input-wrap">
                <span className="auth-icon">🔒</span>
                <input type={showPw ? 'text' : 'password'} placeholder="請輸入密碼"
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className="pw-eye" onClick={() => setShowPw(s => !s)}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            {tab === 'register' && (
              <label className="auth-agree">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                我同意 <span className="lnk">服務條款</span> 及 <span className="lnk">隱私政策</span>
              </label>
            )}
            {tab === 'login' && <div className="auth-forgot">忘記密碼？</div>}
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" className={'auth-submit' + (busy ? ' loading' : '')}>
              {busy ? <span className="social-spinner white" /> : (tab === 'login' ? '登入' : '建立帳號')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function PhoneView({ tab, onNext, onBack, viewMode }) {
  const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault()
    if (!phone) return
    setBusy(true); setError('')
    try {
      const data = await auth.sendOtp(phone)
      console.log('[OTP for testing]:', data.debug_otp)
      onNext(phone)
    } catch(e) { setError(e.message) } finally { setBusy(false) }
  }
  return (
    <div className={'login-root ' + viewMode}>
      <LoginBg />
      <div className={'login-card single ' + viewMode}>
        <div className="login-right">
          <button className="login-back-btn" onClick={onBack}>← 返回</button>
          <LogoRow />
          <div className="login-title">手機號碼{tab === 'login' ? '登入' : '驗證'}</div>
          <div className="login-subtitle">我們將發送 6 位數驗證碼到您的手機</div>
          <form onSubmit={submit} className="auth-form">
            <div className="auth-field">
              <label>台灣手機號碼</label>
              <div className="auth-input-wrap">
                <span className="auth-icon">📱</span>
                <span className="phone-cc">+886</span>
                <input type="tel" placeholder="912 345 678" value={phone}
                  onChange={e => setPhone(e.target.value)} autoFocus />
              </div>
            </div>
            <button type="submit" className={'auth-submit' + (busy ? ' loading' : '')}>
              {busy ? <span className="social-spinner white" /> : '發送驗證碼'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function OtpView({ phone, onLogin, onBack, viewMode }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [busy, setBusy] = useState(false)
  function change(idx, val) {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]; next[idx] = val.slice(-1); setOtp(next)
    if (val && idx < 5) document.getElementById('otp' + (idx + 1))?.focus()
  }
  const [error, setError] = useState('')
  async function verify() {
    if (otp.join('').length < 6) return
    setBusy(true); setError('')
    try {
      const data = await auth.verifyOtp(phone, otp.join(''))
      auth.saveToken(data.token)
      onLogin(data.user)
    } catch(e) { setError(e.message) } finally { setBusy(false) }
  }
  return (
    <div className={'login-root ' + viewMode}>
      <LoginBg />
      <div className={'login-card single ' + viewMode}>
        <div className="login-right">
          <button className="login-back-btn" onClick={onBack}>← 返回</button>
          <LogoRow />
          <div className="login-title">輸入驗證碼 📲</div>
          <div className="login-subtitle">已傳送至 +886 {phone}</div>
          <div className="otp-row">
            {otp.map((v, i) => (
              <input key={i} id={'otp' + i} className="otp-box" type="text"
                inputMode="numeric" maxLength={1} value={v}
                onChange={e => change(i, e.target.value)}
                onKeyDown={e => { if (e.key === 'Backspace' && !v && i > 0) document.getElementById('otp' + (i - 1))?.focus() }}
                autoFocus={i === 0} />
            ))}
          </div>
          <button className={'auth-submit' + (busy ? ' loading' : '')} onClick={verify}>
            {busy ? <span className="social-spinner white" /> : '驗證並登入'}
          </button>
          {error && <div className="auth-error">{error}</div>}
          <div className="otp-resend">沒收到？<span className="lnk"> 重新發送</span></div>
        </div>
      </div>
    </div>
  )
}

export default function Login({ onLogin, viewMode }) {
  const [tab, setTab] = useState('login')
  const [step, setStep] = useState('main')
  const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState(null)

  async function fakeSocial(id) {
    setBusy(id)
    try {
      // Social login: in production, integrate OAuth. Demo: direct API call.
      const data = await auth.login({ provider: id, email: id + '@demo.goodchain.tw', name: id + ' User' })
      auth.saveToken(data.token)
      onLogin(data.user)
    } catch (e) {
      alert(e.message)
    } finally { setBusy(null) }
  }

  if (step === 'email') return <EmailView tab={tab} onLogin={onLogin} onBack={() => setStep('main')} viewMode={viewMode} />
  if (step === 'phone') return <PhoneView tab={tab} onNext={p => { setPhone(p); setStep('otp') }} onBack={() => setStep('main')} viewMode={viewMode} />
  if (step === 'otp') return <OtpView phone={phone} onLogin={onLogin} onBack={() => setStep('phone')} viewMode={viewMode} />

  const isDesktop = viewMode === 'desktop'

  return (
    <div className={'login-root ' + viewMode}>
      <LoginBg />
      <div className={'login-card ' + viewMode}>

        {isDesktop && (
          <div className="login-left">
            <div className="ll-logo">⛓️</div>
            <div className="ll-brand">善鏈 GoodChain</div>
            <div className="ll-tagline">用科技，讓每分善款<br />都抵達真正需要的地方</div>
            <div className="ll-stats">
              <div className="ll-stat">
                <div className="ll-stat-num">NT$4.7M</div>
                <div className="ll-stat-lbl">本月善款</div>
              </div>
              <div className="ll-stat">
                <div className="ll-stat-num">1,284</div>
                <div className="ll-stat-lbl">活躍專案</div>
              </div>
              <div className="ll-stat">
                <div className="ll-stat-num">98.3%</div>
                <div className="ll-stat-lbl">資金到位率</div>
              </div>
            </div>
            <div className="ll-badges">
              <div className="ll-badge">🔒 區塊鏈透明驗證</div>
              <div className="ll-badge">🤖 AI 詐騙偵測保護</div>
              <div className="ll-badge">🏛️ DAO 社群共同治理</div>
            </div>
          </div>
        )}

        <div className="login-right">
          {!isDesktop && <LogoRow />}

          <div className="login-tabs">
            <button className={'ltab' + (tab === 'login' ? ' active' : '')} onClick={() => setTab('login')}>登入</button>
            <button className={'ltab' + (tab === 'register' ? ' active' : '')} onClick={() => setTab('register')}>註冊</button>
          </div>

          <div className="login-title">
            {tab === 'login' ? '歡迎回來 👋' : '加入善鏈 🌟'}
          </div>
          <div className="login-subtitle">
            {tab === 'login' ? '選擇您慣用的登入方式' : '快速建立帳號，開始行善'}
          </div>

          <div className="social-btns">
            <button
              className={'social-btn' + (busy === 'apple' ? ' loading' : '')}
              style={{ background: '#1a1614', color: '#fff' }}
              onClick={() => fakeSocial('apple')}>
              {busy === 'apple'
                ? <span className="social-spinner" />
                : <><span className="sbi">🍎</span><span className="sbl">Apple 繼續</span></>}
            </button>

            <button
              className={'social-btn' + (busy === 'google' ? ' loading' : '')}
              style={{ background: '#fff', color: '#3c4043', border: '1.5px solid #dadce0' }}
              onClick={() => fakeSocial('google')}>
              {busy === 'google'
                ? <span className="social-spinner dark" />
                : <><span className="sbi google-g">G</span><span className="sbl">Google 繼續</span></>}
            </button>

            <button
              className={'social-btn' + (busy === 'fb' ? ' loading' : '')}
              style={{ background: '#1877f2', color: '#fff' }}
              onClick={() => fakeSocial('fb')}>
              {busy === 'fb'
                ? <span className="social-spinner" />
                : <><span className="sbi fb-f">f</span><span className="sbl">Facebook 繼續</span></>}
            </button>
          </div>

          <div className="login-divider"><span>或繼續使用</span></div>

          <div className="login-methods">
            <button className="lmethod" onClick={() => setStep('email')}>
              <span className="lm-icon">✉️</span>
              <span className="lm-label">電子信箱</span>
              <span className="lm-arrow">›</span>
            </button>
            <button className="lmethod" onClick={() => setStep('phone')}>
              <span className="lm-icon">📱</span>
              <span className="lm-label">手機號碼 OTP</span>
              <span className="lm-arrow">›</span>
            </button>
          </div>

          <button className="login-guest" onClick={() => onLogin({ provider: 'guest', name: '訪客' })}>
            以訪客身份瀏覽 →
          </button>

          <div className="login-legal">
            登入即代表您同意
            <span className="lnk"> 服務條款</span> 及
            <span className="lnk"> 隱私政策</span>
          </div>
        </div>
      </div>
    </div>
  )
}
