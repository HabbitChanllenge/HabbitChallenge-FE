import { useState } from 'react'
import './App.css'
import logo from './assets/logo.svg'
import Home from './pages/Home.jsx'
import Habit from './pages/Habit.jsx'
import Mypage from './pages/Mypage.jsx'
import Ranking from './pages/Ranking.jsx'
import HabitForm from './pages/HabitForm.jsx'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EyeIcon = ({ hidden }) => (
  <span aria-hidden="true" className="eye-icon">{hidden ? '◉' : '◌'}</span>
)

function PasswordField({ label, value, onChange, placeholder, error }) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="field">
      <span>{label}</span>
      <div className={`input-wrap ${error ? 'has-error' : ''}`}>
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="current-password"
        />
        <button
          className="visibility-button"
          type="button"
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 표시'}
          onClick={() => setVisible(!visible)}
        >
          <EyeIcon hidden={!visible} />
        </button>
      </div>
      {error && <small className="error-message">{error}</small>}
    </label>
  )
}

function Login({ onSignup, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const emailError = submitted && (!email ? '이메일을 입력해주세요.' : !emailPattern.test(email) ? '올바른 이메일 형식을 입력해주세요.' : '')
  const passwordError = submitted && (password.length < 8 ? '비밀번호는 8자 이상 입력해주세요.' : '')

  const submit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    if (emailPattern.test(email) && password.length >= 8) onLogin()
  }

  return (
    <form className="auth-form" onSubmit={submit} noValidate>
      <h1>로그인</h1>
      <div className="form-fields">
        <label className="field">
          <span>이메일</span>
          <input className={emailError ? 'has-error' : ''} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sprout@example.com" autoComplete="email" />
          {emailError && <small className="error-message">{emailError}</small>}
        </label>
        <PasswordField label="비밀번호" value={password} onChange={setPassword} placeholder="비밀번호를 입력해 주세요." error={passwordError} />
      </div>
      <div className="form-bottom">
        <p>아직 계정이 없으신가요? <button type="button" className="text-button" onClick={onSignup}>회원가입</button></p>
        <button className="primary-button" type="submit">로그인하기</button>
      </div>
    </form>
  )
}

function Signup({ onLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [submitted, setSubmitted] = useState(false)
  const update = (key) => (value) => setForm((current) => ({ ...current, [key]: value }))
  const errors = {
    name: submitted && (!/^[a-zA-Z0-9_]{3,12}$/.test(form.name) ? '아이디는 영문, 숫자, 밑줄 3~12자로 입력해주세요.' : ''),
    email: submitted && (!emailPattern.test(form.email) ? '올바른 이메일 형식을 입력해주세요.' : ''),
    password: submitted && (form.password.length < 8 ? '비밀번호는 8자 이상 입력해주세요.' : ''),
    confirm: submitted && form.password !== form.confirm ? '비밀번호가 일치하지 않습니다.' : '',
  }
  const submit = (event) => {
    event.preventDefault()
    setSubmitted(true)
    if (!Object.values(errors).some(Boolean)) alert('회원가입 정보가 입력되었습니다.')
  }

  return (
    <form className="auth-form signup-form" onSubmit={submit} noValidate>
      <h1>계정 만들기</h1>
      <div className="form-fields">
        <label className="field"><span>아이디</span><input className={errors.name ? 'has-error' : ''} value={form.name} onChange={(e) => update('name')(e.target.value)} placeholder="영문과 숫자 입력" autoComplete="username" />{errors.name && <small className="error-message">{errors.name}</small>}</label>
        <label className="field"><span>이메일</span><input className={errors.email ? 'has-error' : ''} type="email" value={form.email} onChange={(e) => update('email')(e.target.value)} placeholder="이메일을 입력해주세요." autoComplete="email" />{errors.email && <small className="error-message">{errors.email}</small>}</label>
        <PasswordField label="비밀번호" value={form.password} onChange={update('password')} placeholder="비밀번호를 입력해 주세요." error={errors.password} />
        <PasswordField label="비밀번호 확인" value={form.confirm} onChange={update('confirm')} placeholder="비밀번호를 다시 입력해 주세요." error={errors.confirm} />
      </div>
      <div className="form-bottom">
        <p>이미 계정이 있으신가요? <button type="button" className="text-button" onClick={onLogin}>로그인</button></p>
        <button className="primary-button" type="submit">가입하고 시작하기</button>
      </div>
    </form>
  )
}

export default function App() {
  const [screen, setScreen] = useState('login')
  const [habit, setHabit] = useState(null)
  const isSignup = screen === 'signup'
  const isHome = ['home', 'habit', 'mypage', 'ranking', 'habit-create', 'habit-edit'].includes(screen)
  return (
    <main className="app-shell">
      <section className={`phone-frame ${isSignup ? 'signup-mode' : ''} ${isHome ? 'home-mode' : ''}`}>
        <div className="status-bar"><span>9:41</span><span className="island" /><span>▮▮▮ ◒</span></div>
        {screen === 'home' ? <Home onNavigate={setScreen} habit={habit} /> : screen === 'habit' ? <Habit onNavigate={setScreen} habit={habit} onToggleComplete={() => setHabit((value) => ({ ...value, completed: !value.completed }))} /> : screen === 'mypage' ? <Mypage onNavigate={setScreen} /> : screen === 'ranking' ? <Ranking onNavigate={setScreen} /> : screen === 'habit-create' ? <HabitForm mode="create" onNavigate={setScreen} onSave={(value) => { setHabit(value); setScreen('habit') }} /> : screen === 'habit-edit' ? <HabitForm mode="edit" habit={habit} onNavigate={setScreen} onSave={(value) => { setHabit(value); setScreen('habit') }} /> : <><header className="brand"><img src={logo} alt="새싹루틴" /></header>{isSignup ? <Signup onLogin={() => setScreen('login')} /> : <Login onSignup={() => setScreen('signup')} onLogin={() => setScreen('home')} />}</>}
        <div className="home-indicator" />
      </section>
    </main>
  )
}
