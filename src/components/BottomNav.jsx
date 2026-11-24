import habitIcon from "../assets/iconhabit.svg";
const icons = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5M9 21v-7h6v7" />
    </>
  ),
  ranking: (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 6H4v2a5 5 0 0 0 5 5M16 6h4v2a5 5 0 0 1-5 5M12 13v5m-5 3h10m-8-3h6" />
    </>
  ),
  mypage: (
    <>
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
    </>
  ),
};

const items = [
  ["home", "홈"],
  ["habit", "습관"],
  ["ranking", "랭킹"],
  ["mypage", "마이페이지"],
];

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      <button className="nav-brand" type="button" onClick={() => onNavigate("home")} aria-label="새싹루틴 홈">
        <img src={new URL("../assets/logo.svg", import.meta.url).href} alt="새싹루틴" />
      </button>
      {items.map(([id, label]) => (
        <button
          className={`${active === id ? "active" : ""} nav-${id}`}
          type="button"
          key={id}
          aria-current={active === id ? "page" : undefined}
          onClick={() => onNavigate(id)}
        >
          {id === "habit" ? (
            <img className="nav-icon-image habit-icon" src={habitIcon} alt="" />
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {icons[id]}
            </svg>
          )}
          <small>{label}</small>
        </button>
      ))}
    </nav>
  );
}
