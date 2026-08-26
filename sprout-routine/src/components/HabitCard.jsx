import { useState } from "react";

export default function HabitCard({ habit, onEdit, onToggleCheck }) {
  const [showChecks, setShowChecks] = useState(false);
  const target = habit.frequency === "일주일"
    ? Math.max(1, habit.verificationDays?.length ?? 0)
    : Math.max(1, habit.verificationCount ?? 1);
  const checks = habit.checks ?? [];
  const completedCount = checks.length;
  const isComplete = completedCount >= target;
  const statusClass = isComplete
    ? "is-complete"
    : completedCount > 0
      ? "is-in-progress"
      : "is-pending";
  const frequencyDetail = habit.frequency === "일주일"
    ? `매주 ${completedCount}/${target}`
    : `매일 ${completedCount}/${target}`;

  return (
    <article className={`habit-card ${statusClass}`}>
      <h2>{habit.name}</h2>
      <p>#{habit.category}</p>
      <p>{frequencyDetail}</p>
      <div className="habit-actions">
        <button type="button" onClick={() => setShowChecks((value) => !value)}>인증</button>
        <button type="button" onClick={() => onEdit(habit.id)}>수정</button>
        <button type="button">연속 성공 {habit.streak ?? 0}일</button>
      </div>
      {showChecks && (
        <div className={`verification-panel ${isComplete ? "is-complete" : ""}`}>
          <span>{isComplete ? "오늘 인증 완료" : "오늘 인증이 남았어요"}</span>
          <div className="verification-checks">
            {Array.from({ length: target }, (_, index) => (
              <button
                type="button"
                className={checks.includes(index) ? "checked" : ""}
                key={index}
                aria-label={`${index + 1}번째 인증 ${checks.includes(index) ? "취소" : "완료"}`}
                onClick={() => onToggleCheck(habit.id, index)}
              >
                {checks.includes(index) ? "✓" : ""}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
