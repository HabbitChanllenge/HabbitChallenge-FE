import logo from '../assets/logo.svg'
import BottomNav from '../components/BottomNav.jsx'

export default function Ranking({ onNavigate }) {
  return <div className="sub-page">
    <header className="home-header"><button type="button" aria-label="알림">♧</button><img src={logo} alt="새싹루틴" /><div><b>31일</b><small>연속기록</small></div></header>
    <main className="ranking-page"><h1>랭킹</h1><div className="empty-state ranking-full-empty"><span>🏆</span><p>아직 랭킹에 참여한 사용자가 없어요.</p><small>첫 번째 습관 기록의 주인공이 되어보세요.</small></div></main>
    <BottomNav active="ranking" onNavigate={onNavigate} />
  </div>
}
