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
  const [streaming, setStreaming] = useState(false);

  function loadExample() {
    const ex = EXAMPLES[mode];
    setLanguage(ex.language);
    setCode(ex.code);
    setQuestion(ex.question);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading || streaming) return;
    if (!code.trim()) {
      setError("Please paste some code first.");
      setAnswer("");
      return;
    }
    setResultMode(mode);
    setLoading(true);
    setStreaming(false);
    setAnswer("");
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/assistant/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, language, code, question }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "The request failed.");
      }

      // Read Server-Sent Events: `data: {"t": "..."}` chunks, then `event: done` / `event: error`.
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let text = "";
      let streamError = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop();
        for (const raw of events) {
          const event = /^event: (.+)$/m.exec(raw)?.[1];
          const dataLine = /^data: (.+)$/m.exec(raw)?.[1];
          if (!dataLine) continue;
          const data = JSON.parse(dataLine);
          if (event === "error") streamError = data.error || "The response was interrupted.";
          else if (data.t) {
            text += data.t;
            setLoading(false);
            setStreaming(true);
            setAnswer(text);
          }
        }
      }
      if (streamError) throw new Error(streamError);
      if (!text) throw new Error("The AI returned an empty response.");
    } catch (err) {
      setError(err instanceof TypeError ? "Could not reach the server. Is it running?" : err.message);
    } finally {
      setLoading(false);
      setStreaming(false);
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
          <button type="submit" className="primary" disabled={loading || streaming} title="Ctrl+Enter">
            {loading ? "Working…" : streaming ? "Generating…" : MODE_INFO[mode].action}
          </button>
        </form>
        <ResultPanel mode={loading || streaming || answer || error ? resultMode : mode} loading={loading} streaming={streaming} answer={answer} error={error} />
      </main>
      <footer className="footer">
        AI suggestions can be wrong, so always verify them before use. Your code is sent to an AI provider; do not paste secrets.
      </footer>
    </div>
  );
}
