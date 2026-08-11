export default function BottomNav({ active, onNavigate }) {
  const items = [
    ['home', '⌂', '홈'],
    ['habit', '♡', '습관'],
    ['ranking', '♕', '랭킹'],
    ['mypage', '♙', '마이'],
  ]
  return <nav className="bottom-nav">{items.map(([id, icon, label]) => <button className={active === id ? 'active' : ''} type="button" key={id} onClick={() => onNavigate(id)}><span>{icon}</span>{label}</button>)}</nav>
}
