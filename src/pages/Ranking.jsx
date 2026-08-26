import logo from "../assets/logo.svg";
import BottomNav from "../components/BottomNav.jsx";

const users = [
  ["seoyun_1444", 365], ["seoyun_2444", 277], ["seoyun_3444", 244],
  ["taegyun", 230], ["taegyun1", 200], ["taegyun2", 182], ["taegyun3", 176], ["taegyun4", 152], ["taegyun5", 148], ["taegyun6", 130],
];

export default function Ranking({ onNavigate }) {
  const [first, second, third, ...rest] = users;
  return <div className="sub-page ranking-screen"><header className="home-header"><span /><img src={logo} alt="새싹루틴" /><div className="streak-badge"><b>31일</b><small>연속 인증</small></div></header>
    <main className="ranking-page"><h1>랭킹</h1><p className="ranking-caption">연속 인증일 기준</p>
      <section className="ranking-podium"><div className="podium-user second"><b>{second[0]}</b><span>{second[1]}일</span><i>2</i></div><div className="podium-user first"><b>{first[0]}</b><span>{first[1]}일</span><em>🏆</em><i>1</i></div><div className="podium-user third"><b>{third[0]}</b><span>{third[1]}일</span><i>3</i></div></section>
      <section className="ranking-list">{rest.map(([id, days], index) => <div key={id}><span>{index + 4}</span><b>{id}</b><strong>{days}일</strong></div>)}</section>
    </main><BottomNav active="ranking" onNavigate={onNavigate} /></div>;
}
