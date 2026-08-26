import splashImage from "../assets/splash.svg";

export default function Splash() {
  return (
    <main className="splash-page" aria-label="새싹루틴을 시작하는 중입니다.">
      <img src={splashImage} alt="새싹루틴" />
    </main>
  );
}
