import { useEffect, useState } from "react";
import profileImage from "../assets/profile.svg";
import logo from "../assets/logo.svg";
import BottomNav from "../components/BottomNav.jsx";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[a-zA-Z0-9_]{3,12}$/;

function PasswordInput({ value, onChange, disabled, error }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={`profile-password-wrap ${error ? "has-error" : ""}`}>
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete="current-password"
      />
      <button
        type="button"
        className="visibility-button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
      >
        {visible ? "◌" : "◉"}
      </button>
    </div>
  );
}

export default function Mypage({ onNavigate }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveAttempted, setSaveAttempted] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteAttempted, setDeleteAttempted] = useState(false);
  const [form, setForm] = useState({
    email: "habit10@sprout.com",
    password: "habit1000",
    name: "habit10",
  });
  const change = (key) => (event) =>
    setForm((value) => ({ ...value, [key]: event.target.value }));
  const errors = {
    email:
      saveAttempted && !emailPattern.test(form.email)
        ? "올바른 이메일 형식을 입력해주세요."
        : "",
    password:
      saveAttempted && form.password.length < 8
        ? "비밀번호는 8자 이상 입력해주세요."
        : "",
    name:
      saveAttempted && !namePattern.test(form.name)
        ? "아이디는 영문, 숫자, 밑줄 3~12자로 입력해주세요."
        : "",
  };
  const deleteError =
    deleteAttempted && deletePassword.length < 8
      ? "비밀번호는 8자 이상 입력해주세요."
      : deleteAttempted && deletePassword !== form.password
        ? "비밀번호가 일치하지 않습니다."
        : "";
  const save = () => {
    setSaveAttempted(true);
    if (
      !emailPattern.test(form.email) ||
      form.password.length < 8 ||
      !namePattern.test(form.name)
    )
      return;
    setEditing(false);
    setSaved(true);
  };
  const startEditing = () => {
    setSaved(false);
    setSaveAttempted(false);
    setEditing(true);
  };
  const deleteAccount = () => {
    setDeleteAttempted(true);
    if (deletePassword.length < 8 || deletePassword !== form.password) return;
    onNavigate("splash");
  };
  useEffect(() => {
    if (!saved) return undefined;
    const timer = window.setTimeout(() => setSaved(false), 1200);
    return () => window.clearTimeout(timer);
  }, [saved]);

  return (
    <div className="sub-page mypage-page">
      <header className="home-header">
        <span />
        <img src={logo} alt="새싹루틴" />
        <span />
      </header>
      <main className={`profile-content ${editing ? "is-editing" : ""}`}>
        <div className="profile-hero">
          <img
            className="profile-avatar"
            src={profileImage}
            alt="프로필 사진"
          />
          <div className="profile-identity">
            <b>{form.name}</b>
            <button type="button" onClick={() => onNavigate("login")}>
              로그아웃하기
            </button>
          </div>
        </div>
        <section className="profile-info">
          <label>
            이메일
            <input
              className={errors.email ? "has-error" : ""}
              value={form.email}
              onChange={change("email")}
              disabled={!editing}
              type="email"
            />
            {errors.email && (
              <small className="error-message">{errors.email}</small>
            )}
          </label>
          <label>
            비밀번호
            <PasswordInput
              value={form.password}
              onChange={change("password")}
              disabled={!editing}
              error={errors.password}
            />
            {errors.password && (
              <small className="error-message">{errors.password}</small>
            )}
          </label>
          <label>
            아이디
            <input
              className={errors.name ? "has-error" : ""}
              value={form.name}
              onChange={change("name")}
              disabled={!editing}
            />
            {errors.name && (
              <small className="error-message">{errors.name}</small>
            )}
          </label>
        </section>
        {saved && <p className="save-message">수정이 완료되었습니다.</p>}
        <div className="profile-actions">
          {editing ? (
            <>
              <button
                type="button"
                className="primary-button profile-edit-button profile-save-button"
                onClick={save}
              >
                수정 완료하기
              </button>
              <button
                type="button"
                className="delete-account"
                onClick={() => setConfirmDelete(true)}
              >
                회원 탈퇴
              </button>
            </>
          ) : (
            <button
              type="button"
              className="primary-button profile-edit-button"
              onClick={startEditing}
            >
              내 정보 수정하기
            </button>
          )}
        </div>
      </main>
      <BottomNav active="mypage" onNavigate={onNavigate} />
      {confirmDelete && (
        <div className="modal-backdrop">
          <section className="confirm-modal">
            <h2>정말 탈퇴하시겠어요?</h2>
            <p>탈퇴하면 계정과 기록을 되돌릴 수 없어요.</p>
            <input
              className={deleteError ? "has-error" : ""}
              type="password"
              value={deletePassword}
              onChange={(event) => setDeletePassword(event.target.value)}
              placeholder="비밀번호를 입력해주세요"
              autoComplete="current-password"
            />
            {deleteError && (
              <small className="error-message">{deleteError}</small>
            )}
            <div>
              <button type="button" onClick={() => setConfirmDelete(false)}>
                취소
              </button>
              <button type="button" className="danger" onClick={deleteAccount}>
                탈퇴
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
