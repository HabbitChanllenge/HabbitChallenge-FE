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
      <div className="workspace-heading"><h1>랭킹</h1><div className="streak-badge"><b>{streak}일</b><small>연속 일수</small></div></div>
      <main className="ranking-page">
        <section className="ranking-podium">
          <div className="podium-user second">{second && <><b>{second.name}</b><span>{second.days}일</span></>}<i>{second?.rank ?? ""}</i></div>
          <div className="podium-user first">{first && <><b>{first.name}</b><span>{first.days}일</span></>}<svg className="trophy-icon" viewBox="0 0 128 128" aria-hidden="true"><path d="M42 14h44c10 0 16 8 16 18v10c0 24-15 39-32 44v12h18c8 0 14 6 14 14v7H26v-7c0-8 6-14 14-14h18V86C41 81 26 66 26 42V32c0-10 6-18 16-18zm-2 16H14v10c0 14 8 24 21 29-4-9-6-20-6-33V30zm48 0v6c0 13-2 24-6 33 13-5 21-15 21-29V30H88z" /></svg><i>{first?.rank ?? ""}</i></div>
          <div className="podium-user third">{third && <><b>{third.name}</b><span>{third.days}일</span></>}<i>{third?.rank ?? ""}</i></div>
        </section>
        {message && <p className="ranking-state-message" role={error ? "alert" : "status"}>{message}</p>}
        {rest.length > 0 && <section className="ranking-list">{rest.map((user) => <div key={user.id}><span>{user.rank}</span><b>{user.name}</b><strong>{user.days}일</strong></div>)}</section>}
      </main>
      <BottomNav active="ranking" onNavigate={onNavigate} />
    </div>
  );
}
