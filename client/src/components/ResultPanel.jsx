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
        <h2>Output</h2>
        {answer && !loading && (
          <button type="button" className="secondary" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
        )}
      </div>
      {loading && <div className="state"><span className="spinner" />Thinking… this can take up to a minute.</div>}
      {!loading && error && <div className="error" role="alert">{error}</div>}
      {!loading && !error && answer && <div className="answer"><ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown></div>}
      {!loading && !error && !answer && (
        <div className="empty">
          <strong>No result yet</strong>
          <p>Choose a tool, paste code on the left, and run it. The answer appears here.</p>
          <div className="prompt">waiting for input<span className="cursor" aria-hidden="true" /></div>
        </div>
      )}
    </section>
  );
}
