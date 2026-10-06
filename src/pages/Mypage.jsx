import { useEffect, useState } from "react";
import profileImage from "../assets/profile.svg";
import logo from "../assets/logo.svg";
import BottomNav from "../components/BottomNav.jsx";
import { userApi } from "../lib/endpoints.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,30}$/;
export default function Mypage({
  onNavigate,
  streak = 0,
  token,
  onLogout,
  onDeleteAccount,
}) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveAttempted, setSaveAttempted] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteAttempted, setDeleteAttempted] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    email: "",
    name: "",
  });
  useEffect(() => {
    let active = true;
    userApi
      .getMe(token)
      .then((result) => {
        const profile =
          result?.user ?? result?.data?.user ?? result?.data ?? result;
        if (active)
          setForm({
            email: profile?.email ?? "",
            name: profile?.name ?? profile?.userName ?? "",
          });
      })
      .catch((error) => {
        if (active)
          setRequestError(error.message || "회원 정보를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [token]);
  const change = (key) => (event) =>
    setForm((value) => ({ ...value, [key]: event.target.value }));
  const errors = {
    email:
      saveAttempted && !emailPattern.test(form.email)
        ? "올바른 이메일 형식을 입력해주세요."
        : "",
    name: saveAttempted && !form.name.trim() ? "이름을 입력해주세요." : "",
    currentPassword: saveAttempted && !currentPassword ? "현재 비밀번호를 입력해주세요." : "",
    newPassword: saveAttempted && !passwordPattern.test(newPassword) ? "새 비밀번호 형식을 확인해주세요." : "",
    confirmPassword: saveAttempted && newPassword !== confirmPassword ? "새 비밀번호가 일치하지 않습니다." : "",
  };
  const deleteError =
    deleteAttempted && deletePassword.length < 8
      ? "비밀번호는 8자 이상 입력해주세요."
      : "";
  const save = async () => {
    setSaveAttempted(true);
    if (!emailPattern.test(form.email) || !form.name.trim() || !currentPassword || !passwordPattern.test(newPassword) || newPassword !== confirmPassword) return;
    setRequestError("");
    try {
      await userApi.updateMe(
        { userId: form.name.trim(), email: form.email.trim(), currentPassword, newPassword },
        token,
      );
      setEditing(false);
      setSaved(true);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (error) {
      setRequestError(error.message || "회원 정보를 수정하지 못했습니다.");
    }
  };
  const startEditing = () => {
    setSaved(false);
    setSaveAttempted(false);
    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    setEditing(true);
  };
  const deleteAccount = async () => {
    setDeleteAttempted(true);
    if (deletePassword.length < 8) return;
    setRequestError("");
    try {
      await onDeleteAccount(deletePassword);
    } catch (error) {
      if (error.status === 401) {
        setConfirmDelete(false);
        setDeletePassword("");
        setPasswordAlert(true);
      } else {
        setRequestError(error.message || "회원 탈퇴에 실패했습니다.");
      }
    }
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
        <div className="streak-badge">
          <b>{streak}일</b>
          <small>연속 인증</small>
        </div>
      </header>
      <main
        className={`profile-content ${editing ? "is-editing" : ""} ${saved ? "is-saved" : ""}`}
      >
        <div className="profile-hero">
          <img
            className="profile-avatar"
            src={profileImage}
            alt="프로필 사진"
          />
          <div className="profile-identity">
            <b>{loading ? "불러오는 중…" : form.name}</b>
            <button type="button" onClick={onLogout}>
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
            이름
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
        {editing && (
          <section className="profile-info">
            <label>현재 비밀번호<input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" />{errors.currentPassword && <small className="error-message">{errors.currentPassword}</small>}</label>
            <label>새 비밀번호<input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" />{errors.newPassword && <small className="error-message">{errors.newPassword}</small>}</label>
            <label>새 비밀번호 확인<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" />{errors.confirmPassword && <small className="error-message">{errors.confirmPassword}</small>}</label>
          </section>
        )}
        {requestError && <p className="profile-save-error" role="alert">{requestError}</p>}
        {saveAttempted && (errors.email || errors.name || errors.currentPassword || errors.newPassword || errors.confirmPassword) && (
          <p className="profile-save-error">형식에 맞게 입력해주세요.</p>
        )}
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
        {editing && (
          <button
            type="button"
            className="delete-account profile-delete-account"
            onClick={() => setConfirmDelete(true)}
          >
            회원 탈퇴
          </button>
        )}
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
      {passwordAlert && (
        <div className="modal-backdrop password-alert-backdrop">
          <section className="password-alert" role="alertdialog" aria-modal="true" aria-labelledby="password-alert-message">
            <p id="password-alert-message">비밀번호를 확인해 주세요.</p>
            <button type="button" onClick={() => setPasswordAlert(false)}>확인</button>
          </section>
        </div>
      )}
    </div>
  );
}
