import { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import BottomNav from "../components/BottomNav.jsx";
import HabitCard from "../components/HabitCard.jsx";
import { useRanking } from "../lib/ranking.js";

function SkeletonHabits() {
  return <div className="home-skeleton-habits" aria-hidden="true">
    {Array.from({ length: 3 }, (_, index) => <div className="home-skeleton-card" key={index}>
      <i /><i /><i />
      <div><b /><b /><b /></div>
    </div>)}
  </div>;
}

function SkeletonRanking() {
  return <div className="home-skeleton-ranking" aria-hidden="true">
    <div className="home-skeleton-rank-labels"><i /><i /><i /></div>
    <div className="home-ranking-podium">
      <div className="home-podium-user second" />
      <div className="home-podium-user first"><em>🏆</em></div>
      <div className="home-podium-user third" />
    </div>
  </div>;
}

export default function Home({ onNavigate, habits, onToggleCheck, onEdit, token, habitsLoading, habitsUnavailable }) {
  const { users: rankings, loading: rankingLoading, error: rankingError } = useRanking(token);
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const markOnline = () => setOnline(true);
    const markOffline = () => setOnline(false);
    window.addEventListener("online", markOnline);
    window.addEventListener("offline", markOffline);
    return () => {
      window.removeEventListener("online", markOnline);
      window.removeEventListener("offline", markOffline);
    };
  }, []);
  const offlineFallback = !online || habitsUnavailable || Boolean(rankingError);
  const showHabitsSkeleton = offlineFallback || habitsLoading;
  const showRankingSkeleton = offlineFallback || rankingLoading || rankings.length === 0;
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
        {showHabitsSkeleton ? <SkeletonHabits /> : habits.length ? (
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
            <p>아직 습관이 없습니다</p>
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
        {showRankingSkeleton ? <><span className="visually-hidden" role="status">인터넷 연결이 없거나 랭킹 정보를 불러오지 못했습니다.</span><SkeletonRanking /></> : (
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
