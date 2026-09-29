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

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [habits, setHabits] = useState([]);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [habitNotice, setHabitNotice] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [recoveryReturn, setRecoveryReturn] = useState("login");
  const [currentPassword, setCurrentPassword] = useState("habit1000");
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

  const toggleHabitCheck = (habitId, index) => {
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== habitId) return habit;
        const checks = habit.checks ?? [];
        const nextChecks = checks.includes(index)
          ? checks.filter((item) => item !== index)
          : [...checks, index];
        const target =
          habit.frequency === "일주일"
            ? Math.max(1, habit.verificationDays?.length ?? 0)
            : Math.max(1, habit.verificationCount ?? 1);
        const completed = nextChecks.length >= target;
        return {
          ...habit,
          checks: nextChecks,
          completed,
          streak: completed
            ? Math.max(1, habit.streak ?? 0)
            : (habit.streak ?? 0),
        };
      }),
    );
  };

  const openEdit = (habitId) => {
    setEditingHabitId(habitId);
    setScreen("habit-edit");
  };
  const saveEdit = (value) => {
    setHabits((current) =>
      current.map((habit) => {
        if (habit.id !== editingHabitId) return habit;
        const target =
          value.frequency === "일주일"
            ? value.verificationDays.length
            : value.verificationCount;
        const checks = (habit.checks ?? []).filter((check) => check < target);
        return {
          ...habit,
          ...value,
          checks,
          completed: checks.length >= target,
        };
      }),
    );
    setHabitNotice(`${value.name} 습관이 수정되었습니다.`);
    setScreen("habit");
  };
  const deleteHabit = () => {
    setHabits((current) => current.filter((habit) => habit.id !== editingHabitId));
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
        onNavigate={(next) => next === "password-recovery" ? openRecovery("mypage") : setScreen(next)}
        streak={Math.max(0, ...habits.map((habit) => habit.streak ?? 0))}
        currentPassword={currentPassword}
      />
    ) : screen === "ranking" ? (
      <Ranking onNavigate={setScreen} />
    ) : screen === "habit-create" ? (
      <HabitForm
        mode="create"
        onNavigate={setScreen}
        onSave={(value) => {
          setHabits((current) => [
            ...current,
            { ...value, id: crypto.randomUUID(), checks: [], streak: 0 },
          ]);
          setHabitNotice("습관이 생성되었습니다.");
          setScreen("habit");
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
        currentPassword={currentPassword}
        onComplete={(nextPassword) => {
          setCurrentPassword(nextPassword);
          setAuthNotice("비밀번호가 변경되었습니다.");
          setScreen("mypage");
        }}
        onNavigate={setScreen}
      />
    ) : (
      <Login
        onSignup={() => setScreen("signup")}
        onForgotPassword={() => openRecovery("login")}
        onLogin={() => setScreen("home")}
      />
    );

  return (
    <main className="app-shell">
      <section
        className={`phone-frame ${isSignup ? "signup-mode" : ""} ${isRecovery ? "recovery-mode" : ""} ${isHome ? "home-mode" : ""}`}
      >
        <div className="status-bar">
          <span>9:41</span>
          <span className="island" />
          <span>▮▮▮ ◒</span>
        </div>
        {content}
        {authNotice && <p className="auth-notice">{authNotice}</p>}
        <div className="home-indicator" />
      </section>
    </main>
  );
}
