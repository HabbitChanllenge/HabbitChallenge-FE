import { useEffect, useState } from "react";
import { streakApi } from "./endpoints.js";

const rankingListKeys = [
  "allStreak",
  "allStreaks",
  "all_streak",
  "rankData",
  "rank_data",
  "rankList",
  "rank_list",
  "rank",
  "streakList",
  "rankings",
  "ranking",
  "streaks",
  "users",
  "items",
  "content",
  "result",
  "data",
  "list",
  "+",
];

function unwrap(value, depth = 0) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object" || depth > 5) return [];

  for (const key of rankingListKeys) {
    if (value[key] != null) {
      const rows = unwrap(value[key], depth + 1);
      if (rows.length > 0 || Array.isArray(value[key])) return rows;
    }
  }

  const nestedRows = Object.values(value)
    .map((item) => unwrap(item, depth + 1))
    .find((rows) => rows.length > 0);
  if (nestedRows) return nestedRows;

  const hasUser = ["id", "userId", "user_id", "name", "userName", "user_name", "username", "nickname"]
    .some((key) => value[key] != null);
  return hasUser ? [value] : [];
}

export function normalizeRanking(value) {
  const rows = unwrap(value);
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row, index) => ({
      id:
        row?.id ??
        row?.userId ??
        row?.user_id ??
        row?.userName ??
        row?.user_name ??
        row?.username ??
        row?.name ??
        `user-${index + 1}`,
      name:
        row?.name ??
        row?.userId ??
        row?.user_id ??
        row?.username ??
        row?.nickname ??
        row?.userName ??
        row?.user_name ??
        row?.memberName ??
        row?.member_name ??
        `사용자 ${index + 1}`,
      days: Number(
        row?.streak ??
          row?.streakDays ??
          row?.streakCount ??
          row?.streak_count ??
          row?.continuousDay ??
          row?.continuous_day ??
        row?.continuousStreak ??
        row?.continuous_streak ??
          row?.totalStreak ??
          row?.total_streak ??
          row?.days ??
          row?.count ??
          row?.continuousDays ??
          0,
      ),
      rank: Number(row?.rank ?? row?.ranking ?? row?.rankNumber ?? row?.rank_number ?? index + 1),
    }))
    .sort((a, b) => a.rank - b.rank);
}

export function useRanking(token) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [networkRevision, setNetworkRevision] = useState(0);

  useEffect(() => {
    const retryWhenOnline = () =>
      setNetworkRevision((revision) => revision + 1);
    window.addEventListener("online", retryWhenOnline);
    return () => window.removeEventListener("online", retryWhenOnline);
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    Promise.resolve()
      .then(async () => {
        try {
          const allUsers = normalizeRanking(await streakApi.all(token));
          if (allUsers.length > 0) return allUsers;
        } catch {
          // Fall back to the ranking endpoint when allStreak is unavailable.
        }
        return normalizeRanking(await streakApi.ranking(token));
      })
      .then((rankedUsers) => {
        if (active) setUsers(rankedUsers);
      })
      .catch((reason) => {
        if (active) setError(reason.message || "랭킹을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token, networkRevision]);

  return { users, loading, error };
}
