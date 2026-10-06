import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav.jsx";
import { userApi } from "../lib/endpoints.js";

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

export default function PasswordChange({ token, onComplete, onNavigate }) {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    let active = true;
    userApi.getMe(token).then((result) => {
      const data = result?.user ?? result?.data?.user ?? result?.data ?? result;
      if (active) setProfile({ userId: data?.name ?? "", email: data?.email ?? "" });
    }).catch((error) => { if (active) setRequestError(error.message || "회원 정보를 불러오지 못했습니다."); });
    return () => { active = false; };
  }, [token]);
  const errors = {
    current: attempted && current.length < 8 ? "현재 비밀번호를 입력해 주세요." : "",
    password: attempted && !passwordPattern.test(password) ? passwordGuide : "",
    confirm: attempted && passwordPattern.test(password) && password !== confirm ? "비밀번호가 일치하지 않습니다." : "",
  };
  const valid = current.length >= 8 && passwordPattern.test(password) && password === confirm;
  const submit = async (event) => {
    event.preventDefault();
    setAttempted(true);
    if (!valid) return;
    setLoading(true); setRequestError("");
    try { await userApi.updateMe({ ...profile, currentPassword: current, newPassword: password }, token); onComplete(); }
    catch (error) { setRequestError(error.message || "비밀번호를 변경하지 못했습니다."); }
    finally { setLoading(false); }
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
      {requestError && <small className="error-message password-change-error" role="alert">{requestError}</small>}
      <button className={`primary-button password-change-submit ${valid ? "is-ready" : ""}`} type="submit" disabled={loading}>{loading ? "처리 중…" : "비밀번호 변경하기"}</button>
    </form>
    <BottomNav active="mypage" onNavigate={onNavigate} />
  </div>;
}
