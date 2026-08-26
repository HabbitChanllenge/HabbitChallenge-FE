import { useEffect } from "react";
import logo from "../assets/logo.svg";
import BottomNav from "../components/BottomNav.jsx";
import HabitCard from "../components/HabitCard.jsx";

export default function Habit({ onNavigate, habits, onToggleCheck, onEdit, notice, onClearNotice }) {
  const target = habits.reduce((sum, habit) => sum + (habit.frequency === "일주일" ? habit.verificationDays.length : habit.verificationCount), 0);
  const completed = habits.reduce((sum, habit) => sum + habit.checks.length, 0);
  const progress = target ? Math.min(100, (completed / target) * 100) : 0;
  const streak = Math.max(0, ...habits.map((habit) => habit.streak ?? 0));
  useEffect(() => { if (!notice) return undefined; const timer = window.setTimeout(onClearNotice, 1200); return () => window.clearTimeout(timer); }, [notice, onClearNotice]);
  return <div className="sub-page"><header className="home-header"><span /><img src={logo} alt="새싹루틴" /><div className="streak-badge"><b>{streak}일</b><small>연속 인증</small></div></header>
    <main className="habit-page-content"><div className="habit-title"><h2>내 습관</h2><button type="button" aria-label="습관 추가" onClick={() => onNavigate("habit-create")}>+</button></div>
      <section className="today-habit-summary"><h1>오늘의 습관 달성</h1><b>{completed}/{target}</b><div className="today-progress"><i style={{ width: `${progress}%` }} /><span>{completed}/{target}</span></div></section>
      {habits.length ? <div className="habit-list habit-list-scroll">{habits.map((habit) => <HabitCard key={habit.id} habit={habit} onToggleCheck={onToggleCheck} onEdit={onEdit} />)}</div> : <div className="empty-state habit-empty"><span>🌱</span><p>아직 만든 습관이 없어요.</p><button type="button" onClick={() => onNavigate("habit-create")}>습관 만들기</button></div>}
      {notice && <p className="habit-notice">{notice}</p>}
    </main><BottomNav active="habit" onNavigate={onNavigate} /></div>;
}
