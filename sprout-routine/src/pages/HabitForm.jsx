import { useState } from 'react'
import logo from '../assets/logo.svg'
import BottomNav from '../components/BottomNav.jsx'

const categories = ['건강', '운동', '공부', '생활', '자기계발', '마음챙김', '독서', '저축', '기타']
const days = ['월', '화', '수', '목', '금', '토', '일']

export default function HabitForm({ mode, habit, onNavigate, onSave }) {
  const [name, setName] = useState(habit?.name ?? '')
  const [frequency, setFrequency] = useState(habit?.frequency ?? '매일')
  const [category, setCategory] = useState(habit?.category ?? '')
  const [customCategory, setCustomCategory] = useState('')
  const [selectedDays, setSelectedDays] = useState([])
  const [alertOn, setAlertOn] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const isValid = name.trim() && category && (category !== '기타' || customCategory.trim()) && (frequency === '매일' || selectedDays.length)
  const toggleDay = (day) => setSelectedDays((value) => value.includes(day) ? value.filter((item) => item !== day) : [...value, day])
  const submit = (event) => { event.preventDefault(); setSubmitted(true); if (isValid) onSave({ name: name.trim(), frequency, category: category === '기타' ? customCategory.trim() : category, completed: habit?.completed ?? false }) }
  const title = mode === 'edit' ? '습관 수정' : '습관 생성'
  return <div className="sub-page habit-form-page">
    <header className="home-header"><button type="button" aria-label="뒤로" onClick={() => onNavigate('habit')}>‹</button><img src={logo} alt="새싹루틴" /><div><b>31일</b><small>연속기록</small></div></header>
    <form className="habit-editor" onSubmit={submit} noValidate><h1>{title}</h1>
      <label className="editor-label">습관명<input value={name} onChange={(e) => setName(e.target.value)} placeholder="매일 실천할 습관을 입력해 주세요." />{submitted && !name.trim() && <small>습관명을 입력해 주세요.</small>}</label>
      <fieldset><legend>반복 주기</legend><div className="choice-row">{['매일', '요일 선택'].map((item) => <button className={frequency === item ? 'selected' : ''} type="button" key={item} onClick={() => setFrequency(item)}>{item}</button>)}</div></fieldset>
      {frequency === '요일 선택' && <fieldset><legend>인증 요일</legend><div className="choice-grid days">{days.map((day) => <button type="button" className={selectedDays.includes(day) ? 'selected' : ''} key={day} onClick={() => toggleDay(day)}>{day}</button>)}</div>{submitted && !selectedDays.length && <small>인증 요일을 선택해 주세요.</small>}</fieldset>}
      <fieldset><legend>카테고리</legend><div className="choice-grid">{categories.map((item) => <button type="button" className={category === item ? 'selected' : ''} key={item} onClick={() => setCategory((value) => value === item ? '' : item)}>{item}</button>)}</div>{category === '기타' && <input className="custom-category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder="카테고리를 직접 입력해 주세요." />}{submitted && (!category || (category === '기타' && !customCategory.trim())) && <small>카테고리를 선택하거나 입력해 주세요.</small>}</fieldset>
      <fieldset><legend>알림 받기</legend><div className="choice-row"><button type="button" className={!alertOn ? 'selected' : ''} onClick={() => setAlertOn(false)}>끄기</button><button type="button" className={alertOn ? 'selected' : ''} onClick={() => setAlertOn(true)}>켜기</button></div></fieldset>
      <button className="primary-button habit-submit" type="submit" disabled={!isValid}>{mode === 'edit' ? '수정하기' : '생성하기'}</button>
    </form>
    <BottomNav active="habit" onNavigate={onNavigate} />
  </div>
}
