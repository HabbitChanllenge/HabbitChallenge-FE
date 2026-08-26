import logo from "../assets/logo.svg";
import BottomNav from "../components/BottomNav.jsx";
import HabitCard from "../components/HabitCard.jsx";

const rankings = [{ id: "seoyun_1444", days: 365 }, { id: "seoyun_2444", days: 277 }, { id: "seoyun_3444", days: 244 }];

export default function Home({ onNavigate, habits, onToggleCheck, onEdit }) {
  const streak = Math.max(0, ...habits.map((habit) => habit.streak ?? 0));
  return <div className="home-page">
    <header className="home-header"><span /><img src={logo} alt="새싹루틴" /><div className="streak-badge"><b>{streak}일</b><small>연속 인증</small></div></header>
    <section className="habit-section"><div className="section-heading"><span>습관</span><button type="button" onClick={() => onNavigate("habit")}>더보기</button></div>
      {habits.length ? <div className="habit-list">{habits.slice(0, 3).map((habit) => <HabitCard key={habit.id} habit={habit} onToggleCheck={onToggleCheck} onEdit={onEdit} />)}</div> : <div className="empty-state home-empty-state"><p>아직 습관이 없습니다.</p><button type="button" onClick={() => onNavigate("habit-create")}>습관 생성</button></div>}
    </section>
    <section className="ranking-section"><div className="section-heading"><span>랭킹</span><button type="button" onClick={() => onNavigate("ranking")}>더보기</button></div>
      <div className="home-ranking-podium">
        <div className="home-podium-user second"><b>{rankings[1].id}</b><span>{rankings[1].days}일</span></div>
        <div className="home-podium-user first"><b>{rankings[0].id}</b><span>{rankings[0].days}일</span><em>🏆</em></div>
        <div className="home-podium-user third"><b>{rankings[2].id}</b><span>{rankings[2].days}일</span></div>
      </div>
    </section>
    <BottomNav active="home" onNavigate={onNavigate} />
  </div>;
}
