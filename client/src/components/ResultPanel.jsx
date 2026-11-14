import { useState } from "react";

// Minimal renderer for the model's Markdown: ## headings, ``` fences, paragraphs.
// Everything is rendered as React text nodes (no innerHTML), so it is XSS-safe.
function renderAnswer(text) {
  return text.split("```").map((chunk, i) => {
    if (i % 2 === 1) {
      const code = chunk.replace(/^[^\n]*\n/, "");
      return <pre key={i}><code>{code.trimEnd()}</code></pre>;
    }
    return chunk.split(/\n(?=#{1,3} )/).map((block, j) => {
      const m = block.trim().match(/^#{1,3} (.*)\n?([\s\S]*)$/);
      if (m) {
        return (
          <section key={`${i}-${j}`}>
            <h3>{m[1]}</h3>
            {m[2].trim() && <p>{m[2].trim()}</p>}
          </section>
        );
      }
      return block.trim() ? <p key={`${i}-${j}`}>{block.trim()}</p> : null;
    });
  });
}

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
    <section className="card" aria-live="polite">
      <div className="result-head">
        <h2>Result</h2>
        {answer && !loading && (
          <button type="button" className="secondary" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
        )}
      </div>
      {loading && <div className="state"><span className="spinner" />Thinking… this can take up to a minute.</div>}
      {!loading && error && <div className="error" role="alert">{error}</div>}
      {!loading && !error && answer && <div className="answer">{renderAnswer(answer)}</div>}
      {!loading && !error && !answer && (
        <div className="state">Choose a tool, paste some code, and press the button. Your result will appear here.</div>
      )}
    </section>
  );
}
