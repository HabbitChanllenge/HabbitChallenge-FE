import { useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onSignup, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const emailError =
    submitted &&
    (!email
      ? "이메일을 입력해주세요."
      : !emailPattern.test(email)
        ? "올바른 이메일 형식을 입력해주세요."
        : "");
  const passwordError =
    submitted && password.length < 8 ? "비밀번호를 다시 확인해주세요." : "";

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (emailPattern.test(email) && password.length >= 8) onLogin();
  };

  return (
    <form className="auth-form login-form" onSubmit={handleSubmit} noValidate>
      <h1>로그인</h1>
      <div className="form-fields">
        <label className="field">
          <span>이메일</span>
          <input
            className={emailError ? "has-error" : ""}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="이메일을 입력해주세요."
            autoComplete="email"
          />
          {emailError && <small className="error-message">{emailError}</small>}
        </label>
        <label className="field">
          <span>비밀번호</span>
          <div className={`input-wrap ${passwordError ? "has-error" : ""}`}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력해 주세요."
              autoComplete="current-password"
            />
            <button
              className="visibility-button"
              type="button"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "◌" : "◉"}
            </button>
          </div>
          {passwordError && (
            <small className="error-message">{passwordError}</small>
          )}
        </label>
      </div>
      <div className="form-bottom">
        <p>
          아직 계정이 없으신가요?{" "}
          <button type="button" className="text-button" onClick={onSignup}>
            회원가입
          </button>
        </p>
        <button
          className={`primary-button login-submit ${email && password ? "is-filled" : ""}`}
          type="submit"
        >
          로그인하기
        </button>
      </div>
    </form>
  );
}
