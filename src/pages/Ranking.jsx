import { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import BottomNav from "../components/BottomNav.jsx";
import { streakApi } from "../lib/endpoints.js";

function unwrap(value) {
  if (Array.isArray(value)) return value;
  for (const key of ["data", "rankings", "ranking", "streaks", "users", "items", "content"]) {
    if (value?.[key] != null) return unwrap(value[key]);
  }
  return [];
}

function normalizeRanking(value) {
  const rows = unwrap(value);
  if (!Array.isArray(rows)) return [];
  return rows.map((row, index) => ({
    id: row?.id ?? row?.userId ?? row?.username ?? row?.name ?? `user-${index + 1}`,
    name: row?.username ?? row?.nickname ?? row?.name ?? row?.userName ?? row?.id ?? `사용자 ${index + 1}`,
    days: Number(row?.streak ?? row?.streakDays ?? row?.days ?? row?.count ?? row?.continuousDays ?? 0),
    rank: Number(row?.rank ?? row?.ranking ?? index + 1),
  })).sort((a, b) => a.rank - b.rank);
}

export default function Ranking({ onNavigate, token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    streakApi.ranking(token)
      .then((data) => { if (active) setUsers(normalizeRanking(data)); })
      .catch((reason) => { if (active) setError(reason.message || "랭킹을 불러오지 못했습니다."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  const [first, second, third, ...rest] = users;
  return (
    <div className="sub-page ranking-screen">
      <header className="home-header"><span /><img src={logo} alt="새싹 루틴" /><span /></header>
      <main className="ranking-page">
        <h1>랭킹</h1>
        <p className="ranking-caption">연속 인증 일수 기준</p>
        {loading ? <p role="status">랭킹을 불러오는 중…</p> : error ? <p role="alert">{error}</p> : users.length === 0 ? <p>표시할 랭킹이 없습니다.</p> : <>
          <section className="ranking-podium">
            {second && <div className="podium-user second"><b>{second.name}</b><span>{second.days}일</span><i>2</i></div>}
            {first && <div className="podium-user first"><b>{first.name}</b><span>{first.days}일</span><em>왕관</em><i>1</i></div>}
            {third && <div className="podium-user third"><b>{third.name}</b><span>{third.days}일</span><i>3</i></div>}
          </section>
          <section className="ranking-list">{rest.map((user) => <div key={user.id}><span>{user.rank}</span><b>{user.name}</b><strong>{user.days}일</strong></div>)}</section>
        </>}
      </main>
      <BottomNav active="ranking" onNavigate={onNavigate} />
    </div>
  );
}
