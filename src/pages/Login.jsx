import { useState } from "react";
import { authApi } from "../lib/endpoints.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onSignup, onLogin, onForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [credentialsRejected, setCredentialsRejected] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailError =
    submitted && !emailPattern.test(email)
      ? !email
        ? "이메일을 입력해 주세요."
        : "올바른 이메일 형식을 입력해 주세요."
      : "";
  const passwordError =
    submitted && password.length < 8 ? "비밀번호를 다시 확인해 주세요." : "";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!emailPattern.test(email) || password.length < 8) return;
    setLoading(true);
    setRequestError("");
    try {
      const result = await authApi.login({ email, password });
      const token = result?.token ?? result?.accessToken ?? result?.data?.token ?? result?.data?.accessToken ?? "";
      onLogin(token);
    } catch (error) {
      if (error.status === 401) {
        setCredentialsRejected(true);
        setRequestError("이메일 또는 비밀번호를 확인해 주세요.");
      } else {
        setCredentialsRejected(false);
        setRequestError(error.message || "로그인에 실패했습니다.");
      }
    } finally { setLoading(false); }
  };

  return (
    <form className="auth-form login-form" onSubmit={handleSubmit} noValidate>
      <h1>로그인</h1>
      <div className="form-fields">
        <label className="field">
          <span>이메일</span>
          <input
            className={emailError || credentialsRejected ? "has-error" : ""}
            type="email"
            value={email}
            onChange={(event) => { setEmail(event.target.value); setCredentialsRejected(false); setRequestError(""); }}
            placeholder="이메일을 입력해 주세요."
            autoComplete="email"
          />
          {emailError && <small className="error-message">{emailError}</small>}
        </label>
        <label className="field">
          <span>비밀번호</span>
          <input
            className={passwordError || credentialsRejected ? "has-error" : ""}
            type="password"
            value={password}
            onChange={(event) => { setPassword(event.target.value); setCredentialsRejected(false); setRequestError(""); }}
            placeholder="비밀번호를 입력해 주세요."
            autoComplete="current-password"
          />
          {passwordError && (
            <small className="error-message">{passwordError}</small>
          )}
          <span className="forgot-password-row">
            <button
              type="button"
              className="text-button"
              onClick={onForgotPassword}
            >
              비밀번호 찾기
            </button>
          </span>
        </label>
      </div>
      <div className="form-bottom">
        {requestError && <p className="error-message" role="alert">{requestError}</p>}
        <p>
          아직 계정이 없으시다면?{" "}
          <button type="button" className="text-button" onClick={onSignup}>
            회원가입
          </button>
        </p>
        <button
          className={`primary-button login-submit ${email && password ? "is-filled" : ""}`}
          type="submit"
          disabled={loading}
        >
          로그인하기
        </button>
      </div>
    </form>
  );
}
