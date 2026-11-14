import { useState } from "react";
import Header from "./components/Header.jsx";
import ModeSelector from "./components/ModeSelector.jsx";
import CodeInput from "./components/CodeInput.jsx";
import QuestionInput from "./components/QuestionInput.jsx";
import ResultPanel from "./components/ResultPanel.jsx";
import { EXAMPLES, MODE_INFO } from "./examples.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [mode, setMode] = useState("explain");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [resultMode, setResultMode] = useState("explain");

  function loadExample() {
    const ex = EXAMPLES[mode];
    setLanguage(ex.language);
    setCode(ex.code);
    setQuestion(ex.question);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    if (!code.trim()) {
      setError("Please paste some code first.");
      setAnswer("");
      return;
    }
    setResultMode(mode);
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, language, code, question }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "The request failed.");
      setAnswer(data.answer);
    } catch (err) {
      setAnswer("");
      setError(err instanceof TypeError ? "Could not reach the server. Is it running?" : err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Header />
      <main className="layout">
        <form className="card" onSubmit={handleSubmit} onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSubmit(e); }}>
          <ModeSelector mode={mode} onChange={setMode} />
          <CodeInput language={language} code={code} onLanguageChange={setLanguage} onCodeChange={setCode} onExample={loadExample} />
          <QuestionInput mode={mode} value={question} onChange={setQuestion} />
          <button type="submit" className="primary" disabled={loading} title="Ctrl+Enter">
            {loading ? "Working…" : MODE_INFO[mode].action}
          </button>
        </form>
        <ResultPanel mode={loading || answer || error ? resultMode : mode} loading={loading} answer={answer} error={error} />
      </main>
      <footer className="footer">
        AI suggestions can be wrong, so always verify them before use. Your code is sent to an AI provider; do not paste secrets.
      </footer>
    </div>
  );
}
