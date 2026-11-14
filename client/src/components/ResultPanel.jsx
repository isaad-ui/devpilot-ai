import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ResultPanel({ loading, answer, error }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.alert("Copy is unavailable here. Please select the text and copy it manually.");
    }
  }

  return (
    <section className="card result-card" aria-live="polite">
      <div className="result-head">
        <h2>Result</h2>
        {answer && !loading && (
          <button type="button" className="secondary" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
        )}
      </div>
      {loading && <div className="state"><span className="spinner" />Thinking… this can take up to a minute.</div>}
      {!loading && error && <div className="error" role="alert">{error}</div>}
      {!loading && !error && answer && <div className="answer"><ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown></div>}
      {!loading && !error && !answer && (
        <div className="empty">
          <div className="empty-icon" aria-hidden="true">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
            </svg>
          </div>
          <strong>Your answer will appear here</strong>
          <p>Choose a tool, paste some code, and press the button. Not sure where to start? Try an example.</p>
        </div>
      )}
    </section>
  );
}
