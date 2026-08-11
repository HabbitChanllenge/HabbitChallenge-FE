import logo from '../assets/logo.svg'
import BottomNav from '../components/BottomNav.jsx'

export default function Habit({ onNavigate, habit, onToggleComplete }) {
  return <div className="sub-page">
    <header className="home-header"><button type="button" aria-label="알림">♧</button><img src={logo} alt="새싹루틴" /><div><b>31일</b><small>연속기록</small></div></header>
    <main className="habit-page-content"><div className="habit-title"><h1>내 습관</h1><button type="button" aria-label="습관 추가" onClick={() => onNavigate('habit-create')}>＋</button></div>{habit ? <article className="created-habit"><div><b>{habit.name}</b><small>{habit.frequency} · {habit.category}</small></div><div className="habit-card-actions"><button type="button" className="verify-button" onClick={onToggleComplete}>{habit.completed ? '인증 완료' : '인증'}</button><button type="button" onClick={() => onNavigate('habit-edit')}>수정</button></div>{habit.completed && <div className="weekly-checks" aria-label="이번 주 인증 현황">{Array.from({ length: 7 }, (_, index) => <span className={index === 0 ? 'checked' : ''} key={index}>{index === 0 && '✓'}</span>)}</div>}</article> : <div className="empty-state habit-empty"><span>🌱</span><p>아직 만든 습관이 없어요.</p><small>작은 습관부터 시작해 보세요.</small><button type="button" onClick={() => onNavigate('habit-create')}>습관 만들기</button></div>}</main>
    <BottomNav active="habit" onNavigate={onNavigate} />
  </div>
}
