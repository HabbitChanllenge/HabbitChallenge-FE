import logo from "../assets/logo.svg";
import BottomNav from "../components/BottomNav.jsx";
import { useRanking } from "../lib/ranking.js";

export default function Ranking({ onNavigate, token, streak = 0 }) {
  const { users, loading, error } = useRanking(token);
  const [first, second, third, ...rest] = users;
  const message = loading ? "랭킹을 불러오는 중…" : error || (users.length === 0 ? "유저가 없습니다" : "");

  return (
    <div className="sub-page ranking-screen">
      <header className="home-header"><span /><img src={logo} alt="새싹 루틴" /><div className="streak-badge"><b>{streak}일</b></div></header>
      <main className="ranking-page">
        <section className="ranking-podium">
          <div className="podium-user second">{second && <><b>{second.name}</b><span>{second.days}일</span></>}<i>{second?.rank ?? ""}</i></div>
          <div className="podium-user first">{first && <><b>{first.name}</b><span>{first.days}일</span></>}<em>🏆</em><i>{first?.rank ?? ""}</i></div>
          <div className="podium-user third">{third && <><b>{third.name}</b><span>{third.days}일</span></>}<i>{third?.rank ?? ""}</i></div>
        </section>
        {message && <p className="ranking-state-message" role={error ? "alert" : "status"}>{message}</p>}
        {rest.length > 0 && <section className="ranking-list">{rest.map((user) => <div key={user.id}><span>{user.rank}</span><b>{user.name}</b><strong>{user.days}일</strong></div>)}</section>}
      </main>
      <BottomNav active="ranking" onNavigate={onNavigate} />
    </div>
  );
}
