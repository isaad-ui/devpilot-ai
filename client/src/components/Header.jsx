export default function Header() {
  return (
    <header className="header">
      <div className="brand">
        <div className="logo" aria-hidden="true">&gt;_</div>
        <div>
          <h1>DevPilot</h1>
          <p>Explain, debug and review code</p>
        </div>
      </div>
      <span className="badge">Code is never executed</span>
    </header>
  );
}
