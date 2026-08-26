import { useState } from "react";
import logo from "../assets/logo.svg";
import BottomNav from "../components/BottomNav.jsx";

const categories = ["생활", "운동", "공부", "식습관", "마음건강", "재정관리", "청결", "기타"];
const days = ["월", "화", "수", "목", "금", "토", "일"];
const counts = Array.from({ length: 9 }, (_, index) => index + 1);

export default function HabitForm({ mode, habit, onNavigate, onSave }) {
  const [name, setName] = useState(habit?.name ?? "");
  const [frequency, setFrequency] = useState(habit?.frequency ?? "하루");
  const knownCategory = categories.includes(habit?.category) ? habit?.category : "기타";
  const [category, setCategory] = useState(habit ? knownCategory : "");
  const [customCategory, setCustomCategory] = useState(habit && !categories.includes(habit.category) ? habit.category : "");
  const [verificationCount, setVerificationCount] = useState(habit?.frequency === "하루" && habit.verificationCount <= 9 ? String(habit.verificationCount) : "");
  const [customCount, setCustomCount] = useState(habit?.frequency === "하루" && habit.verificationCount > 9 ? String(habit.verificationCount) : "");
  const [selectedDays, setSelectedDays] = useState(habit?.verificationDays ?? []);
  const [alertOn, setAlertOn] = useState(habit?.alertOn ?? false);
  const [submitted, setSubmitted] = useState(false);
  const hasValidCount = verificationCount || (/^\d+$/.test(customCount) && Number(customCount) >= 10);
  const isValid =
    name.trim() &&
    category &&
    (category !== "기타" || customCategory.trim()) &&
    (frequency === "하루" ? hasValidCount : selectedDays.length);
  const toggleDay = (day) =>
    setSelectedDays((value) => value.includes(day) ? value.filter((item) => item !== day) : [...value, day]);
  const selectFrequency = (value) => {
    setFrequency(value);
    setSubmitted(false);
  };
  const selectCount = (count) => {
    setVerificationCount(String(count));
    setCustomCount("");
  };
  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) return;

    onSave({
      name: name.trim(),
      frequency,
      category: category === "기타" ? customCategory.trim() : category,
      verificationCount: frequency === "하루" ? Number(verificationCount || customCount) : selectedDays.length,
      verificationDays: frequency === "일주일" ? selectedDays : [],
      alertOn,
      completed: habit?.completed ?? false,
    });
  };

  return (
    <div className="sub-page habit-form-page">
      <header className="home-header">
        <span />
        <img src={logo} alt="새싹루틴" />
        <span />
      </header>
      <form className="habit-editor" onSubmit={submit} noValidate>
        {mode === "edit" && <h1>습관 수정</h1>}
        <label className="editor-label">
          습관명
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="습관의 이름을 입력해주세요" />
          {submitted && !name.trim() && <small>습관명을 입력해주세요.</small>}
        </label>
        <fieldset>
          <legend>반복 주기</legend>
          <div className="habit-choice-grid">
            {["하루", "일주일"].map((item) => (
              <button className={frequency === item ? "selected" : ""} type="button" key={item} onClick={() => selectFrequency(item)}>{item}</button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>카테고리</legend>
          <div className="habit-choice-grid full-choice-grid">
            {categories.map((item) => (
              <button className={category === item ? "selected" : ""} type="button" key={item} onClick={() => setCategory((value) => value === item ? "" : item)}>{item}</button>
            ))}
          </div>
          {category === "기타" && <input className="custom-category" value={customCategory} onChange={(event) => setCustomCategory(event.target.value)} placeholder="카테고리를 입력해주세요" />}
          {submitted && (!category || (category === "기타" && !customCategory.trim())) && <small>카테고리를 선택하거나 입력해주세요.</small>}
        </fieldset>
        {frequency === "하루" ? (
          <fieldset>
            <legend>주기당 인증 횟수</legend>
            <div className="habit-choice-grid full-choice-grid">
              {counts.map((count) => <button type="button" className={verificationCount === String(count) ? "selected" : ""} key={count} onClick={() => selectCount(count)}>{count}번</button>)}
            </div>
            <input className="custom-category" inputMode="numeric" value={customCount} onChange={(event) => { setCustomCount(event.target.value.replace(/\D/g, "")); setVerificationCount(""); }} placeholder="10회 이상은 숫자로 입력해주세요. 예) 12" />
            {submitted && !hasValidCount && <small>인증 횟수를 선택하거나 10회 이상의 숫자를 입력해주세요.</small>}
          </fieldset>
        ) : (
          <fieldset>
            <legend>인증 요일</legend>
            <div className="habit-choice-grid full-choice-grid">
              {days.map((day) => <button type="button" className={selectedDays.includes(day) ? "selected" : ""} key={day} onClick={() => toggleDay(day)}>{day}요일</button>)}
            </div>
            {submitted && !selectedDays.length && <small>인증 요일을 선택해주세요.</small>}
          </fieldset>
        )}
        <fieldset>
          <legend>알림 받기</legend>
          <div className="habit-choice-grid full-choice-grid alert-choice-grid">
            <button type="button" className={!alertOn ? "selected" : ""} onClick={() => setAlertOn(false)}>끄기</button>
            <button type="button" className={alertOn ? "selected" : ""} onClick={() => setAlertOn(true)}>켜기</button>
          </div>
        </fieldset>
        <button className={`primary-button habit-submit ${isValid ? "is-ready" : ""}`} type="submit">
          {mode === "edit" ? "수정하기" : "생성하기"}
        </button>
      </form>
      <BottomNav active="habit" onNavigate={onNavigate} />
    </div>
  );
}
