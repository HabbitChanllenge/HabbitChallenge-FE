import { useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function PasswordField({ label, value, onChange, placeholder, error }) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="field">
      <span>{label}</span>
      <div className={`input-wrap ${error ? "has-error" : ""}`}>
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
        />
        <button
          className="visibility-button"
          type="button"
          aria-label={visible ? "비밀번호 숨기기" : "비밀번호 표시"}
          onClick={() => setVisible(!visible)}
        >
          {visible ? "◌" : "◉"}
        </button>
      </div>
      {error && <small className="error-message">{error}</small>}
    </label>
  );
}

export default function Signup({ onLogin, onComplete }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const update = (key) => (value) =>
    setForm((current) => ({ ...current, [key]: value }));
  const errors = {
    name:
      submitted && !/^[a-zA-Z0-9_]{3,12}$/.test(form.name)
        ? "아이디는 영문, 숫자, 밑줄 3~12자로 입력해주세요."
        : "",
    email:
      submitted && !emailPattern.test(form.email)
        ? "올바른 이메일 형식을 입력해주세요."
        : "",
    password:
      submitted && form.password.length < 8
        ? "비밀번호는 8자 이상 입력해주세요."
        : "",
    confirm:
      submitted && form.password !== form.confirm
        ? "비밀번호가 일치하지 않습니다."
        : "",
  };
  const submit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const valid = /^[a-zA-Z0-9_]{3,12}$/.test(form.name) && emailPattern.test(form.email) && form.password.length >= 8 && form.password === form.confirm;
    if (valid) onComplete();
  };

  return (
    <form className="auth-form signup-form" onSubmit={submit} noValidate>
      <h1>계정 만들기</h1>
      <div className="form-fields">
        <label className="field">
          <span>아이디</span>
          <input
            className={errors.name ? "has-error" : ""}
            value={form.name}
            onChange={(event) => update("name")(event.target.value)}
            placeholder="앱에서 불릴 이름을 입력해주세요."
            autoComplete="username"
          />
          {errors.name && (
            <small className="error-message">{errors.name}</small>
          )}
        </label>
        <label className="field">
          <span>이메일</span>
          <input
            className={errors.email ? "has-error" : ""}
            type="email"
            value={form.email}
            onChange={(event) => update("email")(event.target.value)}
            placeholder="이메일을 입력해주세요."
            autoComplete="email"
          />
          {errors.email && (
            <small className="error-message">{errors.email}</small>
          )}
        </label>
        <PasswordField
          label="비밀번호"
          value={form.password}
          onChange={update("password")}
          placeholder="비밀번호를 입력해 주세요."
          error={errors.password}
        />
        <PasswordField
          label="비밀번호 확인"
          value={form.confirm}
          onChange={update("confirm")}
          placeholder="비밀번호를 다시 입력해 주세요."
          error={errors.confirm}
        />
      </div>
      <div className="form-bottom">
        <p>
          이미 계정이 있으신가요?{" "}
          <button type="button" className="text-button" onClick={onLogin}>
            로그인
          </button>
        </p>
        <button
          className={`primary-button signup-submit ${Object.values(form).some(Boolean) ? "is-filled" : ""}`}
          type="submit"
        >
          가입하고 시작하기
        </button>
      </div>
    </form>
  );
}
