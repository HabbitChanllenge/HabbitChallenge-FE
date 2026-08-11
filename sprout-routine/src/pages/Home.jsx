import logo from '../assets/logo.svg'
import BottomNav from '../components/BottomNav.jsx'

export default function Home({ onNavigate, habit }) {
  return (
    <div className="home-page">
      <header className="home-header"><button type="button" aria-label="알림">♧</button><img src={logo} alt="새싹루틴" /><div><b>31일</b><small>연속기록</small></div></header>
      <section className="habit-section">
        <div className="section-heading"><span>습관</span><button type="button">전체보기</button></div>
        {habit ? <div className="habit-list"><article className="habit-card"><div><h2>{habit.name}</h2><p>{habit.frequency} · {habit.category}</p></div><div className="progress"><i style={{ width: habit.completed ? '100%' : '0%' }} /></div><div className="habit-actions"><button type="button" onClick={() => onNavigate('habit')}>{habit.completed ? '인증 완료' : '인증하기'}</button><button type="button" onClick={() => onNavigate('habit')}>습관 보기</button></div></article></div> : <div className="empty-state"><span>🌱</span><p>아직 만든 습관이 없어요.</p><button type="button" onClick={() => onNavigate('habit-create')}>첫 습관 만들기</button></div>}
      </section>
      <section className="ranking-section">
        <div className="section-heading"><span>랭킹</span><button type="button">전체보기</button></div>
        <div className="empty-state ranking-empty"><span>🏆</span><p>아직 랭킹에 참여한 사용자가 없어요.</p><small>습관을 만들고 첫 기록을 남겨보세요.</small></div>
      </section>
      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  )
}
