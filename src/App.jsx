import { useEffect, useState } from "react";
import "./App.css";
import Home from "./pages/Home.jsx";
import Habit from "./pages/Habit.jsx";
import Mypage from "./pages/Mypage.jsx";
import Ranking from "./pages/Ranking.jsx";
import HabitForm from "./pages/HabitForm.jsx";
import Splash from "./pages/Splash.jsx";
import Login from "./pages/Login.jsx";
import SignupPage from "./pages/Signup.jsx";
import PasswordRecovery from "./pages/PasswordRecovery.jsx";
import PasswordChange from "./pages/PasswordChange.jsx";
import { authApi, habitApi } from "./lib/endpoints.js";

function normalizeHabits(result) {
  const rows = Array.isArray(result)
    ? result
    : (result?.habits ?? result?.data?.habits ?? result?.data ?? []);
  if (!Array.isArray(rows)) return [];

  return rows.map((habit, index) => {
    const isWeekly = String(habit.periodType ?? "").toLowerCase().includes("week");
    const rawDays = habit.dayOfWeek ?? habit.verificationDays ?? habit.days ?? [];
    const dayNames = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const dayLabels = ["\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0", "\uC77C"];
    const verificationDays = rawDays.map((day) => {
      const value = String(day).toLowerCase();
      const dayIndex = Number.isInteger(day) ? day - 1 : dayNames.indexOf(value);
      return dayLabels[dayIndex] ?? day;
    });
    const targetCount = isWeekly
      ? verificationDays.length
      : Number(habit.totalRepeat ?? habit.verificationCount ?? 1);
    const completedCount = Number(
      habit.completedCount ?? (habit.completed ? targetCount : habit.checks?.length ?? 0),
    );
    const checks = Array.isArray(habit.checks)
      ? habit.checks
      : Array.from({ length: completedCount }, (_, checkIndex) => checkIndex);
    const categories = Array.isArray(habit.category)
      ? habit.category
      : Array.isArray(habit.categories)
        ? habit.categories
        : habit.category
          ? [habit.category]
          : [];

    return {
      ...habit,
      id: habit.id ?? habit.habitId ?? index,
      name: habit.name ?? habit.title ?? "",
      frequency: habit.frequency ?? (isWeekly ? "\uC8FC\uAC04" : "\uD558\uB8E8"),
      category: categories[0] ?? "",
      checks,
      verificationDays,
      verificationCount: targetCount,
      completedCount,
      streak: Number(habit.streak ?? habit.streakDays ?? 0),
    };
  });
}

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [habits, setHabits] = useState([]);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [habitNotice, setHabitNotice] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [recoveryReturn, setRecoveryReturn] = useState("login");
  const [token, setToken] = useState(
    () => localStorage.getItem("sprout-token") || "",
  );
  const [hasSession, setHasSession] = useState(() =>
    Boolean(localStorage.getItem("sprout-token")),
  );
  const [dataError, setDataError] = useState("");
  const [habitsLoading, setHabitsLoading] = useState(false);
  const [habitsUnavailable, setHabitsUnavailable] = useState(false);
  const [networkRevision, setNetworkRevision] = useState(0);

  useEffect(() => {
    const retryWhenOnline = () =>
      setNetworkRevision((revision) => revision + 1);
    window.addEventListener("online", retryWhenOnline);
    return () => window.removeEventListener("online", retryWhenOnline);
  }, []);

  useEffect(() => {
    if (!hasSession) {
      setHabitsLoading(false);
      return;
    }
    let active = true;
    setHabitsLoading(true);
    habitApi
      .list(token)
      .then((result) => {
        if (active) {
          setHabits(normalizeHabits(result));
          setHabitsUnavailable(false);
        }
      })
      .catch(() => {
        if (active) setHabitsUnavailable(true);
      })
      .finally(() => {
        if (active) setHabitsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token, hasSession, networkRevision]);
  const isSignup = screen === "signup";
  const isRecovery = screen === "password-recovery";
  const isHome = [
    "home",
    "habit",
    "mypage",
    "ranking",
    "habit-create",
    "habit-edit",
  ].includes(screen);
  const editingHabit = habits.find((habit) => habit.id === editingHabitId);

  useEffect(() => {
    if (screen !== "splash") return undefined;
    const timer = window.setTimeout(() => setScreen("login"), 1200);
    return () => window.clearTimeout(timer);
  }, [screen]);

  useEffect(() => {
    if (!authNotice) return undefined;
    const timer = window.setTimeout(() => setAuthNotice(""), 1200);
    return () => window.clearTimeout(timer);
  }, [authNotice]);

  const toggleHabitCheck = async (habitId, index) => {
    const habit = habits.find((item) => item.id === habitId);
    const completedCount = habit?.completedCount ?? habit?.checks?.length ?? 0;
    const nextCompletedCount = habit?.checks?.includes(index)
      ? Math.max(0, index)
      : Math.max(completedCount, index + 1);
    try {
      await habitApi.verify(habitId, nextCompletedCount, token);
      setHabits(normalizeHabits(await habitApi.list(token)));
      setDataError("");
    } catch (error) {
      setDataError(error.message || "습관 인증을 저장하지 못했습니다.");
      return;
    }
  };

  const openEdit = (habitId) => {
    setEditingHabitId(habitId);
    setScreen("habit-edit");
  };
  const saveEdit = async (value) => {
    try {
      await habitApi.update(editingHabitId, value, token);
      setHabits(normalizeHabits(await habitApi.list(token)));
      setDataError("");
    } catch (error) {
      setDataError(error.message || "습관을 수정하지 못했습니다.");
      return;
    }
    setHabitNotice(`${value.name} 습관이 수정되었습니다.`);
    setScreen("habit");
  };
  const deleteHabit = async () => {
    try {
      if (!hasSession) throw new Error("로그인 후 이용해 주세요.");
      await habitApi.remove(editingHabitId, token);
      setDataError("");
    } catch (error) {
      setDataError(error.message || "습관을 삭제하지 못했습니다.");
      return;
    }
    setHabits((current) =>
      current.filter((habit) => habit.id !== editingHabitId),
    );
    setEditingHabitId(null);
    setScreen("habit");
  };
  const openRecovery = (returnTo = "login") => {
    setRecoveryReturn(returnTo);
    setScreen("password-recovery");
  };

  const content =
    screen === "splash" ? (
      <Splash />
    ) : screen === "home" ? (
      <Home
        onNavigate={setScreen}
        habits={habits}
        onToggleCheck={toggleHabitCheck}
        onEdit={openEdit}
        token={token}
        habitsLoading={habitsLoading}
        habitsUnavailable={habitsUnavailable}
      />
    ) : screen === "habit" ? (
      <Habit
        onNavigate={setScreen}
        habits={habits}
        onToggleCheck={toggleHabitCheck}
        onEdit={openEdit}
        notice={habitNotice}
        onClearNotice={() => setHabitNotice("")}
      />
    ) : screen === "mypage" ? (
      <Mypage
        onNavigate={(next) =>
          next === "password-recovery"
            ? openRecovery("mypage")
            : setScreen(next)
        }
        streak={Math.max(0, ...habits.map((habit) => habit.streak ?? 0))}
        token={token}
        onLogout={async () => {
          try {
            if (hasSession) await authApi.logout(token);
          } catch (error) {
            setDataError(error.message || "로그아웃에 실패했습니다.");
            return;
          }
          localStorage.removeItem("sprout-token");
          setToken("");
          setHasSession(false);
          setHabits([]);
          setDataError("");
          setScreen("login");
        }}
        onDeleteAccount={async (password) => {
          await authApi.resign(token, { password });
          localStorage.removeItem("sprout-token");
          setToken("");
          setHasSession(false);
          setHabits([]);
          setScreen("login");
        }}
      />
    ) : screen === "ranking" ? (
      <Ranking
        onNavigate={setScreen}
        token={token}
        streak={Math.max(0, ...habits.map((habit) => habit.streak ?? 0))}
      />
    ) : screen === "habit-create" ? (
      <HabitForm
        mode="create"
        onNavigate={setScreen}
        onSave={async (value) => {
          try {
            if (!hasSession) throw new Error("로그인 후 이용해 주세요.");
            const result = await (value.frequency === "일주일"
              ? habitApi.createWeek(value, token)
              : habitApi.createDay(value, token));
            setDataError("");
            const created =
              result?.habit ?? result?.data?.habit ?? result?.data ?? result;
            if (
              created &&
              typeof created === "object" &&
              (created.id ?? created.habitId)
            ) {
              setHabits((current) => [
                ...current,
                ...normalizeHabits([created]),
              ]);
            } else {
              setHabits(normalizeHabits(await habitApi.list(token)));
            }
            setHabitNotice("습관이 생성되었습니다.");
            setScreen("habit");
          } catch (error) {
            setDataError(error.message || "습관을 생성하지 못했습니다.");
          }
        }}
      />
    ) : screen === "habit-edit" ? (
      <HabitForm
        mode="edit"
        habit={editingHabit}
        onNavigate={setScreen}
        onSave={saveEdit}
        onDelete={deleteHabit}
      />
    ) : isSignup ? (
      <SignupPage
        onLogin={() => setScreen("login")}
        onComplete={() => {
          setAuthNotice("회원가입이 완료되었습니다.");
          setScreen("login");
        }}
      />
    ) : isRecovery ? (
      <PasswordRecovery
        onBack={() => setScreen(recoveryReturn)}
        onComplete={() => {
          setAuthNotice("비밀번호가 변경되었습니다.");
          setScreen(recoveryReturn);
        }}
      />
    ) : screen === "password-change" ? (
      <PasswordChange
        token={token}
        onComplete={() => {
          setAuthNotice("비밀번호가 변경되었습니다.");
          setScreen("mypage");
        }}
        onNavigate={setScreen}
      />
    ) : (
      <Login
        onSignup={() => setScreen("signup")}
        onForgotPassword={() => openRecovery("login")}
        onLogin={(nextToken) => {
          setToken(nextToken || "");
          setHasSession(true);
          setHabitsLoading(true);
          setHabitsUnavailable(false);
          setDataError("");
          if (nextToken) localStorage.setItem("sprout-token", nextToken);
          else localStorage.removeItem("sprout-token");
          setScreen("home");
        }}
      />
    );

  return (
    <main className="app-shell">
      <section
        className={`phone-frame ${isSignup ? "signup-mode" : ""} ${isRecovery ? "recovery-mode" : ""} ${isHome ? "home-mode" : ""}`}
      >
        {content}
        {dataError && (
          <p className="auth-notice" role="alert">
            {dataError}
          </p>
        )}
        {authNotice && <p className="auth-notice">{authNotice}</p>}
        <div className="home-indicator" />
      </section>
    </main>
  );
}
