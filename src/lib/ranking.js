import { useEffect, useState } from "react";
import { streakApi } from "./endpoints.js";

function unwrap(value) {
  if (Array.isArray(value)) return value;
  for (const key of ["+", "data", "rankings", "ranking", "streaks", "users", "items", "content"]) {
    if (value?.[key] != null) return unwrap(value[key]);
  }
  return [];
}

export function normalizeRanking(value) {
  const rows = unwrap(value);
  if (!Array.isArray(rows)) return [];
  return rows.map((row, index) => ({
    id: row?.id ?? row?.userId ?? row?.username ?? row?.name ?? `user-${index + 1}`,
    name: row?.name ?? row?.userId ?? row?.username ?? row?.nickname ?? row?.userName ?? `사용자 ${index + 1}`,
    days: Number(row?.streak ?? row?.streakDays ?? row?.days ?? row?.count ?? row?.continuousDays ?? 0),
    rank: Number(row?.rank ?? row?.ranking ?? index + 1),
  })).sort((a, b) => a.rank - b.rank);
}

export function useRanking(token) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    streakApi.ranking(token)
      .then((data) => { if (active) setUsers(normalizeRanking(data)); })
      .catch((reason) => { if (active) setError(reason.message || "랭킹을 불러오지 못했습니다."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  return { users, loading, error };
}
