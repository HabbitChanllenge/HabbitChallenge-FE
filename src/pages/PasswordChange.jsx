import { useState } from "react";
import BottomNav from "../components/BottomNav.jsx";

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,30}$/;
const passwordGuide = "비밀번호 형식은 8자 이상 30자 이하, 숫자, 특수문자, 영문 대소문자 포함 입니다. 형식에 맞춰 작성해 주세요.";

function PasswordField({ label, value, onChange, error, placeholder }) {
  const [visible, setVisible] = useState(false);
  return <label className="field password-change-field">
    <span>{label}</span>
    <div className={`password-change-input ${error ? "has-error" : ""}`}>
      <input type={visible ? "text" : "password"} value={value} onChange={onChange}
        placeholder={placeholder} autoComplete="current-password" />
      <button type="button" className="password-eye" onClick={() => setVisible((shown) => !shown)}
        aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}>
        {visible ? "◉" : "◉̸"}
      </button>
    </div>
  </label>;
}

export default function PasswordChange({ currentPassword, onBack, onComplete, onNavigate }) {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [attempted, setAttempted] = useState(false);
  const errors = {
    current: attempted && current !== currentPassword ? "현재 비밀번호를 다시 확인해 주세요." : "",
    password: attempted && !passwordPattern.test(password) ? passwordGuide : "",
    confirm: attempted && passwordPattern.test(password) && password !== confirm ? "비밀번호가 일치하지 않습니다." : "",
  };
  const valid = current === currentPassword && passwordPattern.test(password) && password === confirm;
  const submit = (event) => {
    event.preventDefault();
    setAttempted(true);
    if (valid) onComplete(password);
  };
  return <div className="sub-page password-change-page">
    <form className="password-change-form" onSubmit={submit} noValidate>
      <h1>비밀번호 변경</h1>
      <div className="password-change-fields">
        <PasswordField label="비밀번호" value={current} onChange={(event) => setCurrent(event.target.value)} error={errors.current} placeholder="비밀번호를 입력해 주세요" />
        <PasswordField label="새 비밀번호" value={password} onChange={(event) => setPassword(event.target.value)} error={errors.password} placeholder="새 비밀번호를 입력해 주세요" />
        <PasswordField label="새 비밀번호 확인" value={confirm} onChange={(event) => setConfirm(event.target.value)} error={errors.confirm || errors.password} placeholder="새 비밀번호를 다시 입력해 주세요" />
      </div>
      {(errors.current || errors.password || errors.confirm) && <small className="error-message password-change-error">{errors.current || errors.password || errors.confirm}</small>}
      <button className={`primary-button password-change-submit ${valid ? "is-ready" : ""}`} type="submit">비밀번호 변경하기</button>
    </form>
    <BottomNav active="mypage" onNavigate={onNavigate} />
  </div>;
}
