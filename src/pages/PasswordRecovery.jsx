import { useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,30}$/;
const passwordGuide = "비밀번호 형식은 8자 이상 30자 이하, 숫자, 특수문자, 영문 대소문자 포함 입니다. 형식에 맞춰 작성해 주세요.";

export default function PasswordRecovery({ onBack, onComplete }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [attempted, setAttempted] = useState(false);

  const passwordError = attempted && !passwordPattern.test(password)
    ? passwordGuide
    : attempted && password !== confirm ? "비밀번호가 일치하지 않습니다." : "";
  const confirmError = attempted && passwordPattern.test(password) && password !== confirm
    ? "비밀번호가 일치하지 않습니다." : "";
  const requestCode = () => {
    if (emailPattern.test(email)) setSent(true);
  };
  const verifyCode = () => {
    if (code === "123456" && sent) setVerified(true);
  };
  const submit = (event) => {
    event.preventDefault();
    setAttempted(true);
    if (verified && passwordPattern.test(password) && password === confirm) onComplete();
  };

  return (
    <form className="auth-form recovery-form" onSubmit={submit} noValidate>
      <button type="button" className="recovery-back" onClick={onBack} aria-label="로그인으로 돌아가기">‹</button>
      <h1>비밀번호 찾기</h1>
      <div className="recovery-fields">
        <label className="field"><span>이메일</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력해 주세요." />
          <button type="button" className="verify-button" onClick={requestCode} disabled={!emailPattern.test(email)}>{sent ? "인증번호 재전송" : "인증 번호 전송"}</button>
        </label>
        <label className="field"><span>인증번호</span>
          <input inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} placeholder="인증 번호를 입력해 주세요." />
          <button type="button" className="verify-button" onClick={verifyCode} disabled={!sent || !code}>인증 번호 확인</button>
          {sent && <small className={verified ? "success-message" : "recovery-hint"}>{verified ? "인증이 완료되었습니다." : "테스트 인증번호: 123456"}</small>}
        </label>
        <label className="field"><span>새 비밀번호</span>
          <input className={attempted && !passwordPattern.test(password) ? "has-error" : ""} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="새 비밀번호를 입력해 주세요." autoComplete="new-password" />
        </label>
        <label className="field"><span>새 비밀번호 확인</span>
          <input className={passwordError || confirmError ? "has-error" : ""} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="새 비밀번호를 다시 입력해 주세요." autoComplete="new-password" />
          {(passwordError || confirmError) && <small className="error-message">{passwordError || confirmError}</small>}
        </label>
      </div>
      <button className="primary-button recovery-submit" type="submit">비밀번호 변경하기</button>
    </form>
  );
}
