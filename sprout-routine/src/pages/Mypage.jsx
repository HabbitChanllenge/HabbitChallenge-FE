import { useState } from 'react'
import logo from '../assets/logo.svg'
import BottomNav from '../components/BottomNav.jsx'

export default function Mypage({ onNavigate }) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveAttempted, setSaveAttempted] = useState(false)
  const [form, setForm] = useState({ email: 'habit10@sprout.com', password: 'habit1000', name: 'habit10' })
  const change = (key) => (e) => setForm((value) => ({ ...value, [key]: e.target.value }))
  const errors = {
    email: saveAttempted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '올바른 이메일 형식을 입력해주세요.' : '',
    password: saveAttempted && form.password.length < 8 ? '비밀번호는 8자 이상 입력해주세요.' : '',
    name: saveAttempted && !/^[a-zA-Z0-9_]{3,12}$/.test(form.name) ? '아이디는 영문, 숫자, 밑줄 3~12자로 입력해주세요.' : '',
  }
  const save = () => { setSaveAttempted(true); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || form.password.length < 8 || !/^[a-zA-Z0-9_]{3,12}$/.test(form.name)) return; setEditing(false); setSaved(true) }
  return <div className="sub-page">
    <header className="home-header"><button type="button" aria-label="알림">♧</button><img src={logo} alt="새싹루틴" /><div><b>31일</b><small>연속기록</small></div></header>
    <main className="profile-content">
      <div className="profile-hero"><div className="profile-avatar">🌱</div><b>{form.name}</b><button type="button" onClick={() => onNavigate('login')}>로그아웃하기</button></div>
      <section className="profile-info"><h2>내 정보</h2>
        <label>이메일<input className={errors.email ? 'has-error' : ''} value={form.email} onChange={change('email')} disabled={!editing} type="email" />{errors.email && <small className="error-message">{errors.email}</small>}</label>
        <label>비밀번호<input className={errors.password ? 'has-error' : ''} value={form.password} onChange={change('password')} disabled={!editing} type="password" />{errors.password && <small className="error-message">{errors.password}</small>}</label>
        <label>아이디<input className={errors.name ? 'has-error' : ''} value={form.name} onChange={change('name')} disabled={!editing} />{errors.name && <small className="error-message">{errors.name}</small>}</label>
      </section>
      {saved && <p className="save-message">수정이 완료되었습니다.</p>}
      <div className="profile-actions">{editing ? <button type="button" className="primary-button" onClick={save}>수정 완료하기</button> : <button type="button" className="primary-button" onClick={() => setEditing(true)}>내 정보 수정하기</button>}<button type="button" className="delete-account" onClick={() => setConfirmDelete(true)}>회원 탈퇴</button></div>
    </main>
    <BottomNav active="mypage" onNavigate={onNavigate} />
    {confirmDelete && <div className="modal-backdrop"><section className="confirm-modal"><h2>정말 탈퇴하시겠어요?</h2><p>탈퇴 후에는 계정과 기록을 되돌릴 수 없어요.</p><input type="password" placeholder="비밀번호를 입력해주세요" /><div><button type="button" onClick={() => setConfirmDelete(false)}>취소</button><button type="button" className="danger" onClick={() => setConfirmDelete(false)}>탈퇴</button></div></section></div>}
  </div>
}
