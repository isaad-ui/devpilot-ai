import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MODE_INFO } from "../examples.js";

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    window.alert("Copy is unavailable here. Please select the text and copy it manually.");
    return false;
  }
}

function CopyButton({ getText, label = "Copy", title }) {
  const [copied, setCopied] = useState(false);
  async function onClick() {
    if (await writeClipboard(getText())) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }
  return (
    <button type="button" className="secondary" onClick={onClick} title={title}>
      {copied ? "Copied" : label}
    </button>
  );
}

// Fenced code blocks get their own header with a copy button.
function CodeBlock({ children }) {
  const codeEl = Array.isArray(children) ? children[0] : children;
  const lang = /language-(\S+)/.exec(codeEl?.props?.className ?? "")?.[1] ?? "code";
  const text = String(codeEl?.props?.children ?? "").replace(/\n$/, "");
  return (
    <div className="codeblock">
      <div className="codeblock-head">
        <span>{lang}</span>
        <CopyButton getText={() => text} label="Copy code" title="Copy this code block" />
      </div>
      <pre><code>{text}</code></pre>
    </div>
  );
}

export default function ResultPanel({ mode, loading, streaming, answer, error }) {
  const info = MODE_INFO[mode];
  const status = loading ? "running" : streaming ? "streaming" : error ? "error" : answer ? "done" : "idle";

  return (
    <section className="card result-card" aria-live="polite">
      <div className="result-head">
        <h2>
          Output <span className="result-mode">/ {info.label}</span>
        </h2>
        <div className="result-actions">
          {status === "streaming" && <span className="status status-live">Generating</span>}
          {status === "done" && <span className="status status-ok">Done</span>}
          {status === "error" && <span className="status status-err">Failed</span>}
          {(status === "done" || (status === "error" && answer)) && <CopyButton getText={() => answer} label="Copy all" title="Copy the whole answer as Markdown" />}
        </div>
      </div>

      {loading && (
        <div className="loading" role="status">
          <div className="loading-line">analyzing<span className="cursor" aria-hidden="true" /></div>
          <div className="skeleton" style={{ width: "92%" }} />
          <div className="skeleton" style={{ width: "78%" }} />
          <div className="skeleton" style={{ width: "86%" }} />
          <div className="skeleton" style={{ width: "55%" }} />
        </div>
      )}

      {!loading && answer && (
        <div className={`answer${streaming ? " is-streaming" : ""}`}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ pre: CodeBlock }}>
            {answer}
          </ReactMarkdown>
          {streaming && <span className="cursor" aria-hidden="true" />}
        </div>
      )}

      {!loading && !streaming && error && <div className="error" role="alert">{error}</div>}

      {status === "idle" && (
        <div className="empty" key={mode}>
          <strong>{info.label}: no result yet</strong>
          <p>{info.blurb}. Paste code on the left and run it. You will get:</p>
          <ul className="outputs">
            {info.outputs.map((o) => <li key={o}>{o}</li>)}
          </ul>
          <div className="prompt">waiting for input<span className="cursor" aria-hidden="true" /></div>
        </div>
      )}
    </section>
  );
}
