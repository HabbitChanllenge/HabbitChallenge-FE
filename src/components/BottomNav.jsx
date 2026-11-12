const icons = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5.5 9.5V21h13V9.5M9 21v-7h6v7" /></>,
  habit: <><path d="M20.5 3.5c-8-1.8-15.7.7-15.7 7.3 0 5.2 5.5 7.5 10.1 5.2 4.1-2 6.1-7.1 5.6-12.5Z" /><path d="M3 4c1.8 6.8 5.7 11.4 12.2 14.2L20 21" /></>,
  ranking: <><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H4v2a5 5 0 0 0 5 5M16 6h4v2a5 5 0 0 1-5 5M12 13v5m-5 3h10m-8-3h6" /></>,
  mypage: <><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
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
      {items.map(([id, label]) => (
        <button
          className={active === id ? "active" : ""}
          type="button"
          key={id}
          aria-current={active === id ? "page" : undefined}
          onClick={() => onNavigate(id)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">{icons[id]}</svg>
          <small>{label}</small>
        </button>
      ))}
    </nav>
  );
}
