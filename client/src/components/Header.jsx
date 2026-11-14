export default function Header() {
  return (
    <>
      <header className="header">
        <div className="brand">
          <div className="logo" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m8 7-5 5 5 5" />
              <path d="m16 7 5 5-5 5" />
              <path d="m13.5 5-3 14" />
            </svg>
          </div>
          <div>
            <h1>DevPilot AI</h1>
            <p>Your AI pair for reading, fixing and reviewing code</p>
          </div>
        </div>
        <span className="badge">Never runs your code</span>
      </header>
      <section className="intro">
        <h2>Understand, debug and review code in seconds.</h2>
        <p>Pick a tool, paste your code, and get a clear, structured answer you can copy.</p>
      </section>
    </>
  );
}
