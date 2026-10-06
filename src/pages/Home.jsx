import logo from "../assets/logo.svg";
import BottomNav from "../components/BottomNav.jsx";
import HabitCard from "../components/HabitCard.jsx";
import { useRanking } from "../lib/ranking.js";

export default function Home({ onNavigate, habits, onToggleCheck, onEdit, token }) {
  const { users: rankings, loading: rankingLoading, error: rankingError } = useRanking(token);
  const streak = Math.max(0, ...habits.map((habit) => habit.streak ?? 0));
  return (
    <div className="home-page">
      <header className="home-header">
        <span />
        <img src={logo} alt="새싹루틴" />
        <div className="streak-badge">
          <b>{streak}일</b>
          <small>연속 인증</small>
        </div>
      </header>
      <section className="habit-section">
        <div className="section-heading">
          <span>습관</span>
          <button type="button" onClick={() => onNavigate("habit")}>
            더보기
          </button>
        </div>
        {habits.length ? (
          <div className="habit-list">
            {habits.slice(0, 3).map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleCheck={onToggleCheck}
                onEdit={onEdit}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state home-empty-state">
            <p>아직 습관이 없습니다.</p>
            <button type="button" onClick={() => onNavigate("habit-create")}>
              습관 생성
            </button>
          </div>
        )}
      </section>
      <section className="ranking-section">
        <div className="section-heading">
          <span>랭킹</span>
          <button type="button" onClick={() => onNavigate("ranking")}>
            더보기
          </button>
        </div>
        {rankingLoading ? <p role="status">랭킹을 불러오는 중…</p> : rankingError ? <p role="alert">{rankingError}</p> : rankings.length === 0 ? <p>표시할 랭킹이 없습니다.</p> : (
          <div className="home-ranking-podium">
            {rankings[1] && <div className="home-podium-user second"><b>{rankings[1].name}</b><span>{rankings[1].days}일</span></div>}
            {rankings[0] && <div className="home-podium-user first"><b>{rankings[0].name}</b><span>{rankings[0].days}일</span><em>🏆</em></div>}
            {rankings[2] && <div className="home-podium-user third"><b>{rankings[2].name}</b><span>{rankings[2].days}일</span></div>}
          </div>
        )}
      </section>
      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}
